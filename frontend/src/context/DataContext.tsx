/**
 * DataContext.tsx
 *
 * Holds the "active" entity dataset for the whole app.
 * Starts empty; populated when the user imports an Excel file.
 *
 * FilterContext reads from here so swapping in data causes every view to
 * re-render automatically.
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Entity } from '@/types/entities';

// ─── Context value ─────────────────────────────────────────────────────────────

export interface DataContextValue {
  /** The currently active entity dataset (empty until an Excel file is imported). */
  entities: Entity[];
  /** Replace the active dataset after a successful Excel import. */
  setEntities: (entities: Entity[]) => void;
  /** True when data has been imported. */
  isImported: boolean;
  /** Clear all data (return to empty state). */
  resetToMock: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [entities, setEntitiesState] = useState<Entity[]>([]);
  const [isImported, setIsImported] = useState(false);

  function setEntities(next: Entity[]) {
    setEntitiesState(next);
    setIsImported(true);
  }

  function resetToMock() {
    setEntitiesState([]);
    setIsImported(false);
  }

  return (
    <DataContext.Provider value={{ entities, setEntities, isImported, resetToMock }}>
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
