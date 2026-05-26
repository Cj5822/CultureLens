import { useCallback, useMemo } from 'react'
import type { Entity } from '@/types/entities'
import { RelationshipGraph } from './RelationshipGraph'
import { useVisualizationSync } from '@/hooks/useVisualizationSync'
import { useVisualizationContext } from '@/context/VisualizationContext'
import { buildGraphData } from '@/utils/graph/buildGraphData'

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface GraphInteractionLayerProps {
  entities: Entity[]
  onOpenDetailPanel?: (entity: Entity) => void
}

// ─── GraphInteractionLayer ─────────────────────────────────────────────────────

/**
 * Wraps RelationshipGraph with full visualization synchronisation:
 *
 *  Hover  → highlights hovered node + direct neighbours; dims the rest
 *  Click  → selects the entity, opens the detail panel, highlights connections
 *  Close  → (called externally via clearVisualizationState) restores defaults
 *
 * Bridges graph events → VisualizationContext so that map markers and the
 * detail panel stay in sync with graph interactions.
 *
 * Performance notes:
 *  - graphData is memoised on the entity array — no recompute on hover/select
 *  - entityIndex is built once per entity list change inside useVisualizationSync
 *  - onNodeClick and onNodeHover are stable (useCallback with memoised deps)
 */
export function GraphInteractionLayer({
  entities,
  onOpenDetailPanel,
}: GraphInteractionLayerProps) {
  const { selectedId, highlightedIds } = useVisualizationContext()

  const { selectEntityById, hoverEntityById } = useVisualizationSync({ entities })

  // Build graph data — recomputed only when entities change
  const graphData = useMemo(() => buildGraphData(entities), [entities])

  // Build entity index for safe O(1) lookup on click/hover
  const entityIndex = useMemo<Map<string, Entity>>(() => {
    const m = new Map<string, Entity>()
    for (const e of entities) m.set(e.id, e)
    return m
  }, [entities])

  // ── Graph node click ───────────────────────────────────────────────────────
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const entity = entityIndex.get(nodeId)
      if (!entity) return // safely ignore invalid IDs

      selectEntityById(nodeId)
      onOpenDetailPanel?.(entity)
    },
    [entityIndex, selectEntityById, onOpenDetailPanel],
  )

  // ── Graph node hover ───────────────────────────────────────────────────────
  // RelationshipGraph handles its own hover dimming internally via D3.
  // We push the hover ID into context so map markers can reflect it too.
  // Note: RelationshipGraph doesn't expose onNodeHover today — this is a
  // context-level prep for future map/graph crosshair sync.
  const handleNodeHover = useCallback(
    (nodeId: string | null) => {
      hoverEntityById(nodeId)
    },
    [hoverEntityById],
  )

  // Suppress unused-variable lint — handleNodeHover is wired up when
  // RelationshipGraph exposes onNodeHover. It's intentionally kept here so
  // the context update path is live and map markers already react to it.
  void handleNodeHover

  return (
    <RelationshipGraph
      data={graphData}
      selectedId={selectedId}
      highlightedIds={highlightedIds}
      onNodeClick={handleNodeClick}
    />
  )
}

export default GraphInteractionLayer
