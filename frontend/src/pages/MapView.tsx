import { useState, useCallback } from 'react'
import type { Entity } from '@/types/entities'
import { WorldMap } from '@/components/map/WorldMap'
import { EntityMarkers } from '@/components/map/EntityMarkers'
import { EntityDetailPanel } from '@/components/detail/EntityDetailPanel'
import { useFilterContext } from '@/context/FilterContext'
import { VisualizationProvider, useVisualizationContext } from '@/context/VisualizationContext'
import { useVisualizationSync } from '@/hooks/useVisualizationSync'

// ─── Inner component — must be rendered inside VisualizationProvider ──────────

function MapViewContent() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { selectedId, highlightedIds } = useVisualizationContext()
  const { filteredEntities } = useFilterContext()

  const { selectedEntity, selectEntityById } = useVisualizationSync({
    entities: filteredEntities,
  })

  const handleMarkerClick = useCallback(
    (entity: Entity) => {
      if (selectedId === entity.id) {
        selectEntityById(null)
        setIsPanelOpen(false)
      } else {
        selectEntityById(entity.id)
        setIsPanelOpen(true)
      }
    },
    [selectedId, selectEntityById],
  )

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
    <div className="cl-map-page">
      <div className="cl-map-page__main">
        <div className="cl-map-wrap">
          <WorldMap height="100%">
            <EntityMarkers
              entities={filteredEntities}
              selectedId={selectedId}
              highlightedIds={highlightedIds}
              onMarkerClick={handleMarkerClick}
            />
          </WorldMap>

          <div className="cl-map-legend">
            <span className="cl-map-legend-item cl-map-legend-item--partner">
              Partner region
            </span>
            <span className="cl-map-legend-item cl-map-legend-item--other">
              Other
            </span>
            <span className="cl-map-legend-divider" />
            <span className="cl-map-legend-item cl-map-legend-item--stakeholder">
              Stakeholder
            </span>
            <span className="cl-map-legend-item cl-map-legend-item--instrument">
              Instrument
            </span>
          </div>
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

// ─── MapView — public export ──────────────────────────────────────────────────

export function MapView() {
  return (
    <VisualizationProvider>
      <MapViewContent />
    </VisualizationProvider>
  )
}
