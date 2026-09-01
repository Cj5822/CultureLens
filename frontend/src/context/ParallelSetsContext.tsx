/**
 * ParallelSetsContext.tsx
 *
 * Holds which categorical fields are currently shown as columns in the
 * Parallel Sets diagram. Toggled from the FilterSidebar (each filter
 * section gets a small "show as column" button when the Parallel Sets view
 * is active) so users don't need a separate control panel — the filter
 * sidebar doubles as the variable picker.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { PS_DEFAULT_DIMENSION_KEYS, sortDimensionKeys } from '@/utils/analytics/parallelSets'

export const PS_MIN_COLUMNS = 2
export const PS_MAX_COLUMNS = 5

export interface ParallelSetsColumnsContextValue {
  /** Active dimension keys, always in PS_CANDIDATE_DIMENSIONS order. */
  columnKeys: string[]
  isColumnActive: (key: string) => boolean
  toggleColumn: (key: string) => void
  canRemove: boolean
  canAdd: boolean
}

const ParallelSetsColumnsContext = createContext<ParallelSetsColumnsContextValue | null>(null)

export function ParallelSetsColumnsProvider({ children }: { children: ReactNode }) {
  const [columnKeys, setColumnKeys] = useState<string[]>(PS_DEFAULT_DIMENSION_KEYS)

  const toggleColumn = useCallback((key: string) => {
    setColumnKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= PS_MIN_COLUMNS) return prev
        return sortDimensionKeys(prev.filter((k) => k !== key))
      }
      if (prev.length >= PS_MAX_COLUMNS) return prev
      return sortDimensionKeys([...prev, key])
    })
  }, [])

  const isColumnActive = useCallback((key: string) => columnKeys.includes(key), [columnKeys])

  const value = useMemo<ParallelSetsColumnsContextValue>(
    () => ({
      columnKeys,
      isColumnActive,
      toggleColumn,
      canRemove: columnKeys.length > PS_MIN_COLUMNS,
      canAdd: columnKeys.length < PS_MAX_COLUMNS,
    }),
    [columnKeys, isColumnActive, toggleColumn],
  )

  return <ParallelSetsColumnsContext.Provider value={value}>{children}</ParallelSetsColumnsContext.Provider>
}

export function useParallelSetsColumns(): ParallelSetsColumnsContextValue {
  const ctx = useContext(ParallelSetsColumnsContext)
  if (!ctx) {
    throw new Error('useParallelSetsColumns must be used within a ParallelSetsColumnsProvider')
  }
  return ctx
}
