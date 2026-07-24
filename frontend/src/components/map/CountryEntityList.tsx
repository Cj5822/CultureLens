import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { Entity, Stakeholder, Instrument } from '@/types/entities'
import { ACTOR_TYPE_COLORS, INSTRUMENT_TYPE_COLORS } from '@/components/graph/relationshipGraphConstants'

export interface CountryEntityListProps {
  countryName: string
  entities: Entity[]
  isOpen: boolean
  onClose: () => void
  onSelectEntity: (entity: Entity) => void
}

function isStakeholder(e: Entity): e is Stakeholder { return e.category === 'stakeholders' }
function isInstrument(e: Entity):  e is Instrument  { return e.category === 'instruments'  }

function typeColor(entity: Entity): string {
  if (isStakeholder(entity)) return ACTOR_TYPE_COLORS[entity.actorType] ?? '#8a8a8a'
  if (isInstrument(entity))  return INSTRUMENT_TYPE_COLORS[entity.instrumentType] ?? '#8a8a8a'
  return '#8a8a8a'
}

function typeLabel(entity: Entity): string {
  if (isStakeholder(entity)) return entity.actorType ?? 'stakeholder'
  if (isInstrument(entity))  return entity.instrumentType ?? 'instrument'
  return (entity as Entity).category
}

/** Circle for stakeholders, diamond for instruments — SVG so shape is crisp at any size */
function CategoryIcon({ entity, size = 14 }: { entity: Entity; size?: number }) {
  const color = typeColor(entity)
  const r = size / 2
  if (isStakeholder(entity)) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={r} cy={r} r={r - 0.5} fill={color} />
      </svg>
    )
  }
  // Diamond: rotated square inscribed in the viewBox
  const half = size / 2
  const pad  = 1
  const points = `${half},${pad} ${size - pad},${half} ${half},${size - pad} ${pad},${half}`
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <polygon points={points} fill={color} />
    </svg>
  )
}

const IMPACT_LABELS: Record<string, string> = {
  symbolic:             'Symbolic',
  advisory:             'Advisory',
  binding:              'Binding',
  'highly influential': 'High influence',
}

// ─── Map legend shown inside the panel ────────────────────────────────────────

function MapLegend() {
  return (
    <div className="cl-cel-legend">
      <p className="cl-cel-legend__heading">Map key</p>
      <div className="cl-cel-legend__grid">
        {/* Entity shape icons */}
        <div className="cl-cel-legend__row">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <circle cx="7" cy="7" r="6.5" fill="#4f86c6" />
          </svg>
          <span className="cl-cel-legend__label">Stakeholder</span>
        </div>
        <div className="cl-cel-legend__row">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <polygon points="7,1 13,7 7,13 1,7" fill="#d64f4f" />
          </svg>
          <span className="cl-cel-legend__label">Instrument</span>
        </div>

      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CountryEntityList({
  countryName,
  entities,
  isOpen,
  onClose,
  onSelectEntity,
}: CountryEntityListProps) {
  const panelRef    = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) setTimeout(() => closeBtnRef.current?.focus(), 50)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const stakeholders = entities.filter(isStakeholder)
  const instruments  = entities.filter(isInstrument)

  const panel = (
    <div
      ref={panelRef}
      className={`cl-cel-panel${isOpen ? ' cl-cel-panel--open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label={`Entities in ${countryName}`}
    >
      {/* Header */}
      <div className="cl-cel-panel__header">
        <div className="cl-cel-panel__title-row">
          <div>
            <h2 className="cl-cel-panel__title">{countryName}</h2>
            <p className="cl-cel-panel__subtitle">
              {entities.length} {entities.length === 1 ? 'entry' : 'entries'}
              {' · '}
              {stakeholders.length} stakeholder{stakeholders.length !== 1 ? 's' : ''}
              {' · '}
              {instruments.length} instrument{instruments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            className="cl-detail-panel__close"
            onClick={onClose}
            aria-label="Close country list"
            type="button"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      </div>

      {/* Entity list */}
      <div className="cl-cel-panel__body">
        {entities.length === 0 ? (
          <p className="cl-cel-panel__empty">No entries for this country.</p>
        ) : (
          <ul className="cl-cel-list" role="list">
            {entities.map(entity => (
              <li key={entity.id}>
                <button
                  type="button"
                  className="cl-cel-row"
                  onClick={() => onSelectEntity(entity)}
                >
                  <CategoryIcon entity={entity} size={14} />
                  <div className="cl-cel-row__content">
                    <span className="cl-cel-row__name">{entity.name}</span>
                    <span className="cl-cel-row__meta">
                      <span
                        className="cl-cel-row__type-chip"
                        style={{ background: typeColor(entity) + '22', color: typeColor(entity) }}
                      >
                        {typeLabel(entity)}
                      </span>
                      <span className="cl-cel-row__impact">
                        {IMPACT_LABELS[entity.impactInfluence] ?? entity.impactInfluence}
                      </span>
                    </span>
                  </div>
                  <span className="cl-cel-row__arrow" aria-hidden>›</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map legend */}
      <MapLegend />
    </div>
  )

  return createPortal(panel, document.body)
}
