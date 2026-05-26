import type { Entity } from '@/types/entities'

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface ConnectionListProps {
  entity: Entity
  connectedEntities: Entity[]
  onSelect: (entity: Entity) => void
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function impactBadgeClass(impact: Entity['impactInfluence']): string {
  const map: Record<Entity['impactInfluence'], string> = {
    symbolic:           'cl-connection-item__impact--symbolic',
    advisory:           'cl-connection-item__impact--advisory',
    binding:            'cl-connection-item__impact--binding',
    'highly influential': 'cl-connection-item__impact--high',
  }
  return map[impact] ?? ''
}

function categoryLabel(entity: Entity): string {
  if (entity.category === 'stakeholders') {
    return entity.actorType
  }
  return entity.instrumentType
}

// ─── ConnectionList ────────────────────────────────────────────────────────────

/**
 * Renders the list of connected entities for the detail panel.
 * Clicking or pressing Enter/Space on a connection item:
 *   1. selects that entity as the new subject
 *   2. highlights its related markers/nodes (handled by the onSelect callback)
 *
 * Shows an empty-state message when there are no connections.
 */
export function ConnectionList({
  entity,
  connectedEntities,
  onSelect,
}: ConnectionListProps) {
  if (connectedEntities.length === 0) {
    return (
      <p className="cl-connection-list__empty" role="status">
        No connections recorded for {entity.name}.
      </p>
    )
  }

  return (
    <ul className="cl-connection-list" role="list" aria-label="Connected entities">
      {connectedEntities.map((connected) => (
        <li key={connected.id} className="cl-connection-list__item">
          <button
            type="button"
            className="cl-connection-item"
            onClick={() => onSelect(connected)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(connected)
              }
            }}
            aria-label={`Select ${connected.name}, ${categoryLabel(connected)}, ${connected.impactInfluence} impact`}
          >
            <span className="cl-connection-item__name">{connected.name}</span>
            <span className="cl-connection-item__meta">
              <span className="cl-connection-item__category">
                {categoryLabel(connected)}
              </span>
              <span
                className={`cl-connection-item__impact ${impactBadgeClass(connected.impactInfluence)}`}
              >
                {connected.impactInfluence}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ConnectionList
