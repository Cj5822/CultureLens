/**
 * DataContext.tsx
 *
 * Holds the "active" entity dataset for the whole app.
 * Starts empty; grows as the user imports Excel files.
 *
 * Each import is kept as a separate, removable "batch" (one per file) rather
 * than replacing the previous dataset. This lets a user import several
 * countries' mapping files in sequence and see/compare them together on the
 * map, in analytics, etc. — and drop any one of them again without losing
 * the rest.
 *
 * FilterContext reads the flattened `entities` array from here, so adding or
 * removing an import batch causes every view to re-render automatically.
 *
 * The flattened array also runs through `resolveConnections` before it's
 * exposed: the source Excel's "Connections" column is filled in by hand
 * before any entity ID exists, so it almost always contains entity *names*
 * rather than the generated IDs the graph/detail views match against. This
 * step resolves those names to real IDs (across every currently-loaded
 * batch, not just the one that named them) so the network graph and the
 * detail panel's connection list actually show the relationships that were
 * recorded, instead of rendering isolated nodes. See resolveConnections.ts.
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import type { Entity } from '@/types/entities';
import type { ParseResult } from '@/utils/excelParser';
import { mergeEntities } from '@/utils/excelParser';
import { resolveConnections } from '@/utils/resolveConnections';

// ─── Import batch ──────────────────────────────────────────────────────────────

export interface ImportBatch {
  /** Unique id for this import, used to remove it later. */
  id: string;
  fileName: string;
  partner: string;
  country: string;
  date: string;
  importedAt: number;
  stakeholderCount: number;
  instrumentCount: number;
  warnings: string[];
  entities: Entity[];
}

// ─── Context value ─────────────────────────────────────────────────────────────

export interface DataContextValue {
  /** All entities across every currently loaded import, flattened, with
   *  `connections` resolved to real IDs wherever a match could be found. */
  entities: Entity[];
  /** One entry per imported file, in import order. */
  imports: ImportBatch[];
  /** Add a newly parsed file's data alongside whatever is already loaded. */
  addImport: (result: ParseResult, fileName: string) => void;
  /** Remove a single previously imported file's data, keeping the rest. */
  removeImport: (importId: string) => void;
  /** Clear every loaded import (return to the empty state). */
  clearAll: () => void;
  /** True when at least one file has been imported. */
  isImported: boolean;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | null>(null);

let _importCounter = 0;
function nextImportId(): string {
  _importCounter += 1;
  return `imp-${_importCounter}-${Date.now().toString(36)}`;
}

// ─── Provider ──────────────────────────────────────────────────────────────────

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [imports, setImports] = useState<ImportBatch[]>([]);

  const entities = useMemo(
    () => resolveConnections(imports.flatMap((batch) => batch.entities)),
    [imports],
  );

  function addImport(result: ParseResult, fileName: string) {
    const batch: ImportBatch = {
      id: nextImportId(),
      fileName,
      partner: result.meta.partner,
      country: result.meta.country,
      date: result.meta.date,
      importedAt: Date.now(),
      stakeholderCount: result.stakeholders.length,
      instrumentCount: result.instruments.length,
      warnings: result.warnings,
      entities: mergeEntities(result),
    };
    setImports((prev) => [...prev, batch]);
  }

  function removeImport(importId: string) {
    setImports((prev) => prev.filter((b) => b.id !== importId));
  }

  function clearAll() {
    setImports([]);
  }

  const isImported = imports.length > 0;

  return (
    <DataContext.Provider
      value={{ entities, imports, addImport, removeImport, clearAll, isImported }}
    >
      {children}
    </DataContext.Provider>
  );
}

// ─── Consumer hook ─────────────────────────────────────────────────────────────

export function useDataContext(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useDataContext must be used within a DataContextProvider');
  }
  return ctx;
}
