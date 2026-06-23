import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import type { Entity } from '@/types/entities'
import type { EntityFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'
import { filterEntities } from '@/utils/filterEntities'
import { useDataContext } from '@/context/DataContext'

// ─── Context value ─────────────────────────────────────────────────────────────

export interface FilterContextValue {
  filters: EntityFilters
  setFilters: (filters: EntityFilters) => void
  /** Entities after applying the current filters. */
  filteredEntities: Entity[]
  /** Sorted unique country list derived from the full (unfiltered) dataset. */
  countries: readonly string[]
}

// ─── Context ───────────────────────────────────────────────────────────────────

const FilterContext = createContext<FilterContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────────────────────────

export function FilterContextProvider({ children }: { children: ReactNode }) {
  const { entities } = useDataContext()
  const [filters, setFilters] = useState<EntityFilters>(DEFAULT_FILTERS)

  const filteredEntities = useMemo(
    () => filterEntities(entities, filters),
    [entities, filters],
  )

  const countries = useMemo(
    () => [...new Set(entities.map((e) => e.country))].sort(),
    [entities],
  )

  const value = useMemo<FilterContextValue>(
    () => ({ filters, setFilters, filteredEntities, countries }),
    [filters, filteredEntities, countries],
  )

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}

// ─── Consumer hook ─────────────────────────────────────────────────────────────

export function useFilterContext(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error('useFilterContext must be used within a FilterContextProvider')
  }
  return ctx
}
