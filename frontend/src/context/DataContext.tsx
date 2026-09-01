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
  /** All entities across every currently loaded import, flattened. */
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
    () => imports.flatMap((batch) => batch.entities),
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
