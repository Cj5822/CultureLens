import type { ActorType, ImpactInfluence, InstrumentType } from '@/types/entities'
import {
  ACTOR_TYPE_COLORS,
  INSTRUMENT_TYPE_COLORS,
  IMPACT_RADIUS,
} from './relationshipGraphConstants'

// ─── GraphLegend ──────────────────────────────────────────────────────────────

export function GraphLegend() {
  return (
    <aside className="cl-graph-legend" aria-label="Graph legend">

      {/* ── Shape key ──────────────────────────────────────────────────────── */}
      <section className="cl-graph-legend__section">
        <h3 className="cl-graph-legend__heading">Entity type</h3>
        <ul className="cl-graph-legend__list" role="list">
          <li className="cl-graph-legend__item">
            <svg
              width={24}
              height={24}
              aria-hidden="true"
              className="cl-graph-legend__shape-icon"
            >
              <circle cx={12} cy={12} r={9} fill="#6366f1" stroke="#fff" strokeWidth={1.5} />
            </svg>
            <span>Stakeholder</span>
          </li>
          <li className="cl-graph-legend__item">
            <svg
              width={24}
              height={24}
              aria-hidden="true"
              className="cl-graph-legend__shape-icon"
            >
              {/* Diamond = square rotated 45° */}
              <rect
                x={5}
                y={5}
                width={14}
                height={14}
                rx={1}
                fill="#f59e0b"
                stroke="#fff"
                strokeWidth={1.5}
                transform="rotate(45 12 12)"
              />
            </svg>
            <span>Instrument</span>
          </li>
        </ul>
      </section>

      {/* ── Impact / size key ──────────────────────────────────────────────── */}
      <section className="cl-graph-legend__section">
        <h3 className="cl-graph-legend__heading">Impact level (size)</h3>
        <ul className="cl-graph-legend__list" role="list">
          {(
            [
              'symbolic',
              'advisory',
              'binding',
              'highly influential',
            ] as ImpactInfluence[]
          ).map(level => {
            const r = IMPACT_RADIUS[level]
            const diameter = r * 2 + 4
            return (
              <li key={level} className="cl-graph-legend__item">
                <svg
                  width={diameter}
                  height={diameter}
                  aria-hidden="true"
                  className="cl-graph-legend__size-icon"
                  style={{ minWidth: diameter }}
                >
                  <circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={r}
                    fill="#6366f1"
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                </svg>
                <span className="cl-graph-legend__label">{level}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ── Actor type colour key ───────────────────────────────────────────── */}
      <section className="cl-graph-legend__section">
        <h3 className="cl-graph-legend__heading">Actor type (stakeholder colour)</h3>
        <ul className="cl-graph-legend__list" role="list">
          {(Object.entries(ACTOR_TYPE_COLORS) as [ActorType, string][]).map(
            ([type, color]) => (
              <li key={type} className="cl-graph-legend__item">
                <span
                  className="cl-graph-legend__swatch"
                  style={{ background: color }}
                  aria-hidden="true"
                />
                <span className="cl-graph-legend__label">{type}</span>
              </li>
            ),
          )}
        </ul>
      </section>

      {/* ── Instrument type colour key ──────────────────────────────────────── */}
      <section className="cl-graph-legend__section">
        <h3 className="cl-graph-legend__heading">Instrument type (instrument colour)</h3>
        <ul className="cl-graph-legend__list" role="list">
          {(Object.entries(INSTRUMENT_TYPE_COLORS) as [InstrumentType, string][]).map(
            ([type, color]) => (
              <li key={type} className="cl-graph-legend__item">
                <span
                  className="cl-graph-legend__swatch"
                  style={{ background: color }}
                  aria-hidden="true"
                />
                <span className="cl-graph-legend__label">{type}</span>
              </li>
            ),
          )}
        </ul>
      </section>

    </aside>
  )
}

export default GraphLegend
