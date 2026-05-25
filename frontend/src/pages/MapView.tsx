import { useState, useMemo, useCallback } from 'react'
import type { FilterState } from '@/types'
import type { Entity } from '@/types/entities'
import type { EntityFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'
import { WorldMap } from '@/components/map/WorldMap'
import { EntityMarkers } from '@/components/map/EntityMarkers'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { filterEntities } from '@/utils/filterEntities'
import { mockEntities } from '@/data/mockData'

interface MapViewProps {
  // Legacy top-bar filters kept for interface compatibility with Dashboard
  filters: FilterState
}

export function MapView({ filters: _legacyFilters }: MapViewProps) {
  const [entityFilters, setEntityFilters] = useState<EntityFilters>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredEntities = useMemo(
    () => filterEntities(mockEntities, entityFilters),
    [entityFilters],
  )

  // Derive sorted unique country list from the full (unfiltered) dataset
  const countries = useMemo(
    () => [...new Set(mockEntities.map((e) => e.country))].sort(),
    [],
  )

  const handleMarkerClick = useCallback((entity: Entity) => {
    setSelectedId((prev) => (prev === entity.id ? null : entity.id))
  }, [])

  return (
    <div className="cl-map-page">
      <FilterSidebar
        filters={entityFilters}
        onChange={setEntityFilters}
        resultCount={filteredEntities.length}
        countries={countries}
      />

      <div className="cl-map-page__main">
        <div className="cl-map-wrap">
          <WorldMap height="100%">
            <EntityMarkers
              entities={filteredEntities}
              selectedId={selectedId}
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
      </div>
    </div>
  )
}
