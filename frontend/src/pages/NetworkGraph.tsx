import { useState, useCallback } from 'react'
import type { Entity } from '@/types/entities'
import { GraphInteractionLayer } from '@/components/graph/GraphInteractionLayer'
import { EntityDetailPanel } from '@/components/detail/EntityDetailPanel'
import { GraphLegend } from '@/components/graph/GraphLegend'
import { useFilterContext } from '@/context/FilterContext'
import { VisualizationProvider, useVisualizationContext } from '@/context/VisualizationContext'
import { useVisualizationSync } from '@/hooks/useVisualizationSync'

// ─── Inner component — must be inside VisualizationProvider ──────────────────

function NetworkGraphContent() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { selectedId } = useVisualizationContext()
  const { filteredEntities } = useFilterContext()

  const { selectedEntity, selectEntityById } = useVisualizationSync({
    entities: filteredEntities,
  })

  const handleOpenDetailPanel = useCallback((_entity: Entity) => {
    setIsPanelOpen(true)
  }, [])

  // selectedId is consumed by GraphInteractionLayer via context
  void selectedId

  const handleClosePanel = useCallback(() => {
    selectEntityById(null)
    setIsPanelOpen(false)
  }, [selectEntityById])

  const handleSelectConnection = useCallback(
    (entity: Entity) => {
      selectEntityById(entity.id)
      setIsPanelOpen(true)
    },
    [selectEntityById],
  )

  return (
    <div className="cl-network-page">
      <div className="cl-network-page__main">
        <div className="cl-network-graph-wrap">
          <GraphInteractionLayer
            entities={filteredEntities}
            onOpenDetailPanel={handleOpenDetailPanel}
          />
          <GraphLegend />
        </div>

        <EntityDetailPanel
          entity={selectedEntity}
          entities={filteredEntities}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
          onSelectConnection={handleSelectConnection}
        />
      </div>
    </div>
  )
}

// ─── NetworkGraph — public export ─────────────────────────────────────────────

export function NetworkGraph() {
  return (
    <VisualizationProvider>
      <NetworkGraphContent />
    </VisualizationProvider>
  )
}
