/**
 * DataContext.tsx
 *
 * Holds the "active" entity dataset for the whole app.
 * Starts with mockEntities; the import flow replaces it via setEntities.
 *
 * FilterContext reads from here instead of importing mockEntities directly,
 * so swapping in real data causes every view to re-render automatically.
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Entity } from '@/types/entities';
import { mockEntities } from '@/data/mockData';

// ─── Context value ─────────────────────────────────────────────────────────────

export interface DataContextValue {
  /** The currently active entity dataset. */
  entities: Entity[];
  /** Replace the active dataset (e.g. after a successful Excel import). */
  setEntities: (entities: Entity[]) => void;
  /** True when real data has been imported (false = still using demo data). */
  isImported: boolean;
  /** Revert to the built-in demo dataset. */
  resetToMock: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [entities, setEntitiesState] = useState<Entity[]>(mockEntities);
  const [isImported, setIsImported] = useState(false);

  function setEntities(next: Entity[]) {
    setEntitiesState(next);
    setIsImported(true);
  }

  function resetToMock() {
    setEntitiesState(mockEntities);
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
