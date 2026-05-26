import { useState, useCallback, useMemo } from 'react'
import type { FilterState } from '@/types'
import type { Entity } from '@/types/entities'
import type { EntityFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'
import { GraphInteractionLayer } from '@/components/graph/GraphInteractionLayer'
import { EntityDetailPanel } from '@/components/detail/EntityDetailPanel'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { GraphLegend } from '@/components/graph/GraphLegend'
import { filterEntities } from '@/utils/filterEntities'
import { mockEntities } from '@/data/mockData'
import { VisualizationProvider, useVisualizationContext } from '@/context/VisualizationContext'
import { useVisualizationSync } from '@/hooks/useVisualizationSync'

interface NetworkGraphProps {
  filters: FilterState
}

// ─── Inner component — must be inside VisualizationProvider ──────────────────

interface NetworkGraphContentProps {
  entityFilters: EntityFilters
  onFiltersChange: (f: EntityFilters) => void
}

function NetworkGraphContent({ entityFilters, onFiltersChange }: NetworkGraphContentProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const { selectedId } = useVisualizationContext()

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

  const handleOpenDetailPanel = useCallback((_entity: Entity) => {
    setIsPanelOpen(true)
  }, [])

  // Suppress unused selectedId — it's read by GraphInteractionLayer via context
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
      <FilterSidebar
        filters={entityFilters}
        onChange={onFiltersChange}
        resultCount={filteredEntities.length}
        countries={countries}
      />

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

export function NetworkGraph({ filters: _filters }: NetworkGraphProps) {
  const [entityFilters, setEntityFilters] = useState<EntityFilters>(DEFAULT_FILTERS)

  return (
    <VisualizationProvider>
      <NetworkGraphContent
        entityFilters={entityFilters}
        onFiltersChange={setEntityFilters}
      />
    </VisualizationProvider>
  )
}
