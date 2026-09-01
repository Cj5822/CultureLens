import { useCallback, useMemo, useState } from 'react'
import { useFilterContext } from '@/context/FilterContext'
import { useParallelSetsColumns } from '@/context/ParallelSetsContext'
import { EntityDetailPanel } from '@/components/detail/EntityDetailPanel'
import { ParallelSetsChart } from '@/components/charts/ParallelSetsChart'
import { PS_CANDIDATE_DIMENSIONS } from '@/utils/analytics/parallelSets'
import type { Entity } from '@/types/entities'

export function ParallelSets() {
  const { filteredEntities } = useFilterContext()
  const { columnKeys } = useParallelSetsColumns()

  const [panel, setPanel] = useState<{ title: string; entities: Entity[] } | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const dimensions = useMemo(
    () => columnKeys.map((key) => PS_CANDIDATE_DIMENSIONS.find((d) => d.key === key)!).filter(Boolean),
    [columnKeys],
  )

  const handleSelectEntities = useCallback((entities: Entity[], title: string) => {
    setPanel({ title, entities })
  }, [])

  const handleClosePanel = useCallback(() => setPanel(null), [])

  const handleSelectMember = useCallback((entity: Entity) => {
    setSelectedEntity(entity)
    setIsDetailOpen(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedEntity(null)
    setIsDetailOpen(false)
  }, [])

  return (
    <div className="cl-parallelsets-page">
      {/* ── Chart ────────────────────────────────────────────────────────── */}
      <div className="cl-parallelsets-chart-card">
        <h3 className="cl-parallelsets-chart-card__title">
          {filteredEntities.length} {filteredEntities.length === 1 ? 'entity' : 'entities'} across {dimensions.length} variables
        </h3>
        <p className="cl-parallelsets-chart-card__hint">
          Hover a band or category to trace it through the diagram; click to list its entities below. Add or
          remove variables from the filters panel on the left — each section has a small column-toggle button.
        </p>
        <ParallelSetsChart entities={filteredEntities} dimensions={dimensions} onSelectEntities={handleSelectEntities} />
      </div>

      {/* ── Selection panel ─────────────────────────────────────────────── */}
      {panel && (
        <div className="cl-parallelsets-selection">
          <div className="cl-parallelsets-selection__header">
            <span className="cl-parallelsets-selection__title">
              {panel.title} — {panel.entities.length} {panel.entities.length === 1 ? 'entity' : 'entities'}
            </span>
            <button type="button" className="cl-parallelsets-selection__close" onClick={handleClosePanel}>
              Close
            </button>
          </div>
          <div className="cl-parallelsets-selection__list">
            {panel.entities.map((entity) => (
              <button key={entity.id} type="button" className="cl-cluster-member" onClick={() => handleSelectMember(entity)}>
                <span className={`cl-cluster-member__dot cl-cluster-member__dot--${entity.category}`} />
                <span className="cl-cluster-member__name">{entity.name}</span>
                <span className="cl-cluster-member__meta">{entity.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Detail panel ─────────────────────────────────────────────────── */}
      <EntityDetailPanel
        entity={selectedEntity}
        entities={filteredEntities}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onSelectConnection={handleSelectMember}
      />
    </div>
  )
}
