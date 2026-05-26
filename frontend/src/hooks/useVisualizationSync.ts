import { useMemo, useCallback } from 'react'
import type { Entity } from '@/types/entities'
import { useVisualizationContext } from '@/context/VisualizationContext'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UseVisualizationSyncArgs {
  entities: Entity[]
}

export interface UseVisualizationSyncReturn {
  selectedEntity: Entity | null
  connectedEntities: Entity[]
  selectEntityById: (id: string | null) => void
  hoverEntityById: (id: string | null) => void
  highlightConnections: (id: string | null) => void
}

// ─── useVisualizationSync ──────────────────────────────────────────────────────

/**
 * Bridges the shared VisualizationContext to concrete Entity objects.
 *
 * Responsibilities:
 *  - Maintains a memoised O(1) ID → Entity index for efficient lookups
 *  - Selecting an entity updates selectedId, highlightedIds (entity + connections)
 *  - Hovering a graph node highlights its direct neighbours without selecting
 *  - All IDs are deduplicated before being stored in context
 */
export function useVisualizationSync({
  entities,
}: UseVisualizationSyncArgs): UseVisualizationSyncReturn {
  const {
    selectedId,
    setSelectedId,
    setHoveredId,
    setHighlightedIds,
    clearVisualizationState,
  } = useVisualizationContext()

  // ── O(1) entity index ──────────────────────────────────────────────────────
  const entityIndex = useMemo<Map<string, Entity>>(() => {
    const map = new Map<string, Entity>()
    for (const entity of entities) {
      map.set(entity.id, entity)
    }
    return map
  }, [entities])

  // ── Derived: currently selected entity ────────────────────────────────────
  const selectedEntity = useMemo<Entity | null>(
    () => (selectedId ? (entityIndex.get(selectedId) ?? null) : null),
    [selectedId, entityIndex],
  )

  // ── Derived: connected entities of the selection ──────────────────────────
  const connectedEntities = useMemo<Entity[]>(() => {
    if (!selectedEntity) return []
    return selectedEntity.connections
      .map((id) => entityIndex.get(id))
      .filter((e): e is Entity => e !== undefined)
  }, [selectedEntity, entityIndex])

  // ── highlightConnections ───────────────────────────────────────────────────
  const highlightConnections = useCallback(
    (id: string | null) => {
      if (!id) {
        setHighlightedIds([])
        return
      }
      const entity = entityIndex.get(id)
      if (!entity) return
      // Include the entity itself + all its connections (deduplicated by context setter)
      setHighlightedIds([entity.id, ...entity.connections])
    },
    [entityIndex, setHighlightedIds],
  )

  // ── selectEntityById ───────────────────────────────────────────────────────
  // Selecting an entity: updates detail panel state, map marker highlights,
  // and graph node highlight — all derived downstream from selectedId + highlightedIds.
  const selectEntityById = useCallback(
    (id: string | null) => {
      if (!id) {
        clearVisualizationState()
        return
      }
      const entity = entityIndex.get(id)
      if (!entity) return
      setSelectedId(id)
      highlightConnections(id)
    },
    [entityIndex, setSelectedId, highlightConnections, clearVisualizationState],
  )

  // ── hoverEntityById ────────────────────────────────────────────────────────
  // Hover highlights the hovered node + its direct neighbours without selecting.
  const hoverEntityById = useCallback(
    (id: string | null) => {
      setHoveredId(id)
      if (!id) {
        // If there's a selection in place, keep its highlights; otherwise clear
        if (!selectedId) {
          setHighlightedIds([])
        } else {
          highlightConnections(selectedId)
        }
        return
      }
      const entity = entityIndex.get(id)
      if (!entity) return
      // Temporarily highlight hovered node + neighbours
      setHighlightedIds([entity.id, ...entity.connections])
    },
    [entityIndex, setHoveredId, setHighlightedIds, highlightConnections, selectedId],
  )

  return useMemo(
    () => ({
      selectedEntity,
      connectedEntities,
      selectEntityById,
      hoverEntityById,
      highlightConnections,
    }),
    [selectedEntity, connectedEntities, selectEntityById, hoverEntityById, highlightConnections],
  )
}
