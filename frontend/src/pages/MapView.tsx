import { useState, useMemo, useCallback } from 'react'
import type { FilterState } from '@/types'
import type { Entity } from '@/types/entities'
import type { EntityFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'
import { WorldMap } from '@/components/map/WorldMap'
import { EntityMarkers } from '@/components/map/EntityMarkers'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { EntityDetailPanel } from '@/components/detail/EntityDetailPanel'
import { filterEntities } from '@/utils/filterEntities'
import { mockEntities } from '@/data/mockData'
import { VisualizationProvider, useVisualizationContext } from '@/context/VisualizationContext'
import { useVisualizationSync } from '@/hooks/useVisualizationSync'

interface MapViewProps {
  // Legacy top-bar filters kept for interface compatibility with Dashboard
  filters: FilterState
}

// ─── Inner component — must be rendered inside VisualizationProvider ──────────

interface MapViewContentProps {
  entityFilters: EntityFilters
  onFiltersChange: (f: EntityFilters) => void
}

function MapViewContent({ entityFilters, onFiltersChange }: MapViewContentProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { selectedId, highlightedIds } = useVisualizationContext()

  const filteredEntities = useMemo(
    () => filterEntities(mockEntities, entityFilters),
    [entityFilters],
  )

  const countries = useMemo(
    () => [...new Set(mockEntities.map((e) => e.country))].sort(),
    [],
  )

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
      <FilterSidebar
        filters={entityFilters}
        onChange={onFiltersChange}
        resultCount={filteredEntities.length}
        countries={countries}
      />

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

// ─── MapView — public export, mounts the provider ────────────────────────────

export function MapView({ filters: _legacyFilters }: MapViewProps) {
  const [entityFilters, setEntityFilters] = useState<EntityFilters>(DEFAULT_FILTERS)

  return (
    <VisualizationProvider>
      <MapViewContent
        entityFilters={entityFilters}
        onFiltersChange={setEntityFilters}
      />
    </VisualizationProvider>
  )
}
