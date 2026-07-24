import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Entity, Stakeholder, Instrument } from '@/types/entities'
import { DetailField } from './DetailField'
import { ConnectionList } from './ConnectionList'

export interface EntityDetailPanelProps {
  entity: Entity | null
  entities: Entity[]
  isOpen: boolean
  onClose: () => void
  onSelectConnection: (entity: Entity) => void
}

function isStakeholder(e: Entity): e is Stakeholder {
  return e.category === 'stakeholders'
}

function isInstrument(e: Entity): e is Instrument {
  return e.category === 'instruments'
}

function formatList(items: string[]): string {
  return items.join(', ')
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function trapFocus(panelEl: HTMLElement, event: KeyboardEvent) {
  const focusable = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (focusable.length === 0) return
  const first = focusable[0]
  const last  = focusable[focusable.length - 1]
  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }
}

export function EntityDetailPanel({
  entity,
  entities,
  isOpen,
  onClose,
  onSelectConnection,
}: EntityDetailPanelProps) {
  const panelRef    = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const connectedEntities: Entity[] = entity
    ? entity.connections
        .map((id) => entities.find((e) => e.id === id))
        .filter((e): e is Entity => e !== undefined)
    : []

  useEffect(() => {
    if (isOpen && panelRef.current) {
      closeBtnRef.current?.focus()
    }
  }, [isOpen, entity])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (panelRef.current) {
        trapFocus(panelRef.current, e)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelectConnection = useCallback(
    (connected: Entity) => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      onSelectConnection(connected)
    },
    [onSelectConnection],
  )

  return createPortal(
    <>
      <div
        className={`cl-detail-backdrop${isOpen ? ' cl-detail-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cl-detail-panel-title"
        aria-hidden={!isOpen}
        className={`cl-detail-panel${isOpen ? ' cl-detail-panel--open' : ''}`}
      >
        {/* Header */}
        <div className="cl-detail-panel__header">
          <div className="cl-detail-panel__title-row">
            <h2
              id="cl-detail-panel-title"
              className="cl-detail-panel__title"
            >
              {entity?.name ?? ''}
            </h2>
            <button
              ref={closeBtnRef}
              type="button"
              className="cl-detail-panel__close"
              onClick={onClose}
              aria-label="Close detail panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {entity && (
            <div className="cl-detail-panel__badges">
              <span className={`cl-detail-badge cl-detail-badge--${entity.category}`}>
                {entity.category === 'stakeholders' ? 'Stakeholder' : 'Instrument'}
              </span>
              {isStakeholder(entity) && (
                <span className="cl-detail-badge cl-detail-badge--type">
                  {entity.actorType}
                </span>
              )}
              {isInstrument(entity) && (
                <span className="cl-detail-badge cl-detail-badge--type">
                  {entity.instrumentType}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} className="cl-detail-panel__body">
          {entity ? (
            <dl className="cl-detail-fields">

              {/* Shared fields */}
              <DetailField label="Country" value={entity.country} />
              <DetailField
                label="Thematic focus"
                value={formatList(entity.thematicFocus)}
              />
              <DetailField
                label="Geographical scope"
                value={formatList(entity.geographicalScope)}
              />
              <DetailField
                label="Impact / Influence"
                value={entity.impactInfluence}
              />
              <DetailField
                label="Languages"
                value={formatList(entity.languages)}
              />
              <DetailField
                label="Intended audience"
                value={entity.intendedAudience}
              />
              <DetailField
                label="Equity addressed"
                value={entity.equityAddressed}
              />
              <DetailField
                label="Recommended next steps"
                value={entity.recommendedNextSteps}
              />
              {entity.additionalRemarks && (
                <DetailField
                  label="Additional remarks"
                  value={entity.additionalRemarks}
                />
              )}

              {/* Stakeholder-only fields */}
              {isStakeholder(entity) && (
                <>
                  {entity.functionalRole && (
                    <DetailField label="Functional role" value={entity.functionalRole} />
                  )}
                  <DetailField label="Resources" value={entity.description} />
                  <DetailField
                    label="Relevance to INTRACOMP"
                    value={entity.relevanceToINTRACOMP}
                  />
                  {entity.itcApproach && (
                    <DetailField label="Approach to ITC" value={entity.itcApproach} />
                  )}
                </>
              )}

              {/* Instrument-only fields */}
              {isInstrument(entity) && (
                <>
                  <DetailField
                    label="Implementation status"
                    value={entity.implementationStatus}
                  />
                  <DetailField
                    label="Relevance to INTRACOMP"
                    value={entity.relevanceToINTRACOMP}
                  />
                  <DetailField
                    label="Main objectives"
                    value={entity.mainObjectives}
                  />
                  {entity.itcApproach && (
                    <DetailField label="Approach to ITC" value={entity.itcApproach} />
                  )}
                </>
              )}

              {/* External link */}
              {entity.link && (
                <div className="cl-detail-field">
                  <dt className="cl-detail-field__label">External link</dt>
                  <dd className="cl-detail-field__value">
                    <a
                      href={entity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cl-detail-link"
                      aria-label={`Open external link for ${entity.name} (opens in new tab)`}
                    >
                      {entity.link}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="cl-detail-link__icon"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          ) : null}

          {/* Connections section */}
          {entity && (
            <section className="cl-detail-connections" aria-labelledby="cl-detail-connections-heading">
              <h3
                id="cl-detail-connections-heading"
                className="cl-detail-connections__heading"
              >
                Connections
                <span className="cl-detail-connections__count">
                  {connectedEntities.length}
                </span>
              </h3>
              <ConnectionList
                entity={entity}
                connectedEntities={connectedEntities}
                onSelect={handleSelectConnection}
              />
            </section>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}

export default EntityDetailPanel
