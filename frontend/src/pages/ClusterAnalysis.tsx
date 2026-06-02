import { useState, useMemo, useCallback } from 'react'
import { useFilterContext } from '@/context/FilterContext'
import { EntityDetailPanel } from '@/components/detail/EntityDetailPanel'
import {
  groupByTheme,
  groupByActorType,
  groupByGeographicalScope,
  groupByImpact,
} from '@/utils/analytics/grouping'
import type { AggregationGroup } from '@/types/analytics'
import type { Entity, Stakeholder } from '@/types/entities'

// ─── Types ─────────────────────────────────────────────────────────────────────

type ClusterAttribute = 'thematic-focus' | 'actor-type' | 'geographical-scope' | 'impact-level'

const CLUSTER_OPTIONS: { value: ClusterAttribute; label: string }[] = [
  { value: 'thematic-focus',     label: 'Thematic Focus' },
  { value: 'actor-type',         label: 'Actor Type' },
  { value: 'geographical-scope', label: 'Geographical Scope' },
  { value: 'impact-level',       label: 'Impact Level' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const CLUSTER_COLORS = [
  '#4f86c6', '#d64f4f', '#4cb8a0', '#f5a623',
  '#9b59b6', '#5aab6e', '#c67c4f', '#4fb0c6', '#8a8a8a',
]

function clusterColor(index: number): string {
  return CLUSTER_COLORS[index % CLUSTER_COLORS.length]
}

// ─── ClusterGroup ─────────────────────────────────────────────────────────────

interface ClusterGroupProps {
  group: AggregationGroup
  colorIndex: number
  onSelectMember: (entity: Entity) => void
}

function ClusterGroup({ group, colorIndex, onSelectMember }: ClusterGroupProps) {
  const color = clusterColor(colorIndex)

  return (
    <div className="cl-cluster-group">
      <div className="cl-cluster-group__header" style={{ borderLeftColor: color }}>
        <span className="cl-cluster-group__name">{group.label}</span>
        <span className="cl-cluster-group__count" style={{ background: color }}>
          {group.count}
        </span>
      </div>
      <div className="cl-cluster-group__members">
        {group.entries.map((entity) => (
          <button
            key={entity.id}
            type="button"
            className="cl-cluster-member"
            onClick={() => onSelectMember(entity)}
          >
            <span className={`cl-cluster-member__dot cl-cluster-member__dot--${entity.category}`} />
            <span className="cl-cluster-member__name">{entity.name}</span>
            <span className="cl-cluster-member__meta">{entity.country}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── ClusterAnalysis ──────────────────────────────────────────────────────────

export function ClusterAnalysis() {
  const { filteredEntities } = useFilterContext()
  const [attribute, setAttribute] = useState<ClusterAttribute>('thematic-focus')
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // ── Compute clusters ────────────────────────────────────────────────────
  const clusters: AggregationGroup[] = useMemo(() => {
    switch (attribute) {
      case 'thematic-focus':
        return groupByTheme(filteredEntities)

      case 'actor-type':
        return groupByActorType(
          filteredEntities.filter((e): e is Stakeholder => e.category === 'stakeholders'),
        ) as AggregationGroup[]

      case 'geographical-scope':
        return groupByGeographicalScope(filteredEntities)

      case 'impact-level':
        return groupByImpact(filteredEntities)
    }
  }, [attribute, filteredEntities])

  // ── Detail panel handlers ────────────────────────────────────────────────
  const handleSelectMember = useCallback((entity: Entity) => {
    setSelectedEntity(entity)
    setIsPanelOpen(true)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedEntity(null)
    setIsPanelOpen(false)
  }, [])

  const handleSelectConnection = useCallback((entity: Entity) => {
    setSelectedEntity(entity)
    setIsPanelOpen(true)
  }, [])

  // ── Note for actor-type (instruments excluded) ───────────────────────────
  const stakeholderCount = useMemo(
    () => filteredEntities.filter((e) => e.category === 'stakeholders').length,
    [filteredEntities],
  )

  return (
    <div className="cl-cluster-page">

      {/* ── Attribute selector ──────────────────────────────────────────── */}
      <div className="cl-cluster-selector">
        <span className="cl-cluster-selector__label">Cluster by</span>
        <div className="cl-cluster-selector__options">
          {CLUSTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`cl-cluster-option${attribute === opt.value ? ' cl-cluster-option--active' : ''}`}
              onClick={() => setAttribute(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {attribute === 'actor-type' && (
          <p className="cl-cluster-note">
            Showing {stakeholderCount} stakeholder{stakeholderCount !== 1 ? 's' : ''}
            {' '}— instruments are excluded (no actor type field).
          </p>
        )}
      </div>

      {/* ── Cluster grid ────────────────────────────────────────────────── */}
      {clusters.length === 0 ? (
        <div className="cl-cluster-empty">No entities match the current filters.</div>
      ) : (
        <div className="cl-cluster-grid">
          {clusters.map((group, i) => (
            <ClusterGroup
              key={group.label}
              group={group}
              colorIndex={i}
              onSelectMember={handleSelectMember}
            />
          ))}
        </div>
      )}

      {/* ── Detail panel ────────────────────────────────────────────────── */}
      <EntityDetailPanel
        entity={selectedEntity}
        entities={filteredEntities}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onSelectConnection={handleSelectConnection}
      />
    </div>
  )
}
