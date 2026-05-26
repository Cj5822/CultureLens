import { useState, useCallback, useMemo } from 'react'
import type { Entity } from '@/types/entities'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UseEntitySelectionReturn {
  selectedEntity: Entity | null
  highlightedIds: string[]
  selectEntity: (entity: Entity | null) => void
  highlightConnections: (entity: Entity) => void
  clearSelection: () => void
}

// ─── useEntitySelection ────────────────────────────────────────────────────────

/**
 * Manages which entity is selected and which related IDs are highlighted.
 * Derives highlighted IDs from the selected entity's `connections` array.
 * All callbacks are stable (useCallback with no changing deps).
 * No global state libraries — pure React state only.
 */
export function useEntitySelection(): UseEntitySelectionReturn {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [highlightedIds, setHighlightedIds] = useState<string[]>([])

  const highlightConnections = useCallback((entity: Entity) => {
    // Deduplicate connection IDs and always include the entity itself
    const ids = Array.from(new Set([entity.id, ...entity.connections]))
    setHighlightedIds(ids)
  }, [])

  const selectEntity = useCallback(
    (entity: Entity | null) => {
      setSelectedEntity(entity)
      if (entity) {
        highlightConnections(entity)
      } else {
        setHighlightedIds([])
      }
    },
    [highlightConnections],
  )

  const clearSelection = useCallback(() => {
    setSelectedEntity(null)
    setHighlightedIds([])
  }, [])

  return useMemo(
    () => ({ selectedEntity, highlightedIds, selectEntity, highlightConnections, clearSelection }),
    [selectedEntity, highlightedIds, selectEntity, highlightConnections, clearSelection],
  )
}
