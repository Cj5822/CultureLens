import * as L from 'leaflet'
import type { Stakeholder, Instrument } from '@/types/entities'
import { ACTOR_TYPE_COLORS, INSTRUMENT_TYPE_COLORS, IMPACT_BORDER_STYLES } from './markerStyles'

type MarkerShape = 'circle' | 'diamond'

// ─── Icon cache ────────────────────────────────────────────────────────────────
// Icons are keyed by the visual parameters that determine their appearance.
// This avoids creating duplicate DivIcon objects for markers that share the
// same actor/instrument type, impact level, and interaction state.

const _cache = new Map<string, L.DivIcon>()

function cacheKey(
  color: string,
  impactInfluence: string,
  shape: MarkerShape,
  selected: boolean,
  dimmed: boolean,
): string {
  return `${color}|${impactInfluence}|${shape}|${selected ? 1 : 0}|${dimmed ? 1 : 0}`
}

// ─── Icon builder ──────────────────────────────────────────────────────────────

function buildIcon(
  color: string,
  border: string,
  shape: MarkerShape,
  ariaLabel: string,
  selected: boolean,
  dimmed: boolean,
): L.DivIcon {
  const size = selected ? 20 : 14
  const opacity = dimmed ? 0.28 : 1
  const shadow = selected
    ? `0 0 0 4px ${color}44, 0 2px 8px rgba(0,0,0,0.5)`
    : '0 1px 4px rgba(0,0,0,0.35)'

  const circleHtml = `
    <div
      aria-label="${ariaLabel}"
      role="img"
      style="
        width:${size}px;
        height:${size}px;
        background:${color};
        border:${border};
        border-radius:50%;
        opacity:${opacity};
        box-shadow:${shadow};
        box-sizing:border-box;
      "
    ></div>`

  const innerSize = Math.round(size * 0.8)
  const diamondHtml = `
    <div
      style="
        width:${size}px;
        height:${size}px;
        opacity:${opacity};
        display:flex;
        align-items:center;
        justify-content:center;
      "
    >
      <div
        aria-label="${ariaLabel}"
        role="img"
        style="
          width:${innerSize}px;
          height:${innerSize}px;
          background:${color};
          border:${border};
          transform:rotate(45deg);
          box-shadow:${shadow};
          box-sizing:border-box;
        "
      ></div>
    </div>`

  const html = shape === 'circle' ? circleHtml : diamondHtml
  const anchor = size / 2

  return L.divIcon({
    html,
    className: 'cl-entity-marker',
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    tooltipAnchor: [anchor + 4, 0],
    popupAnchor: [0, -(anchor + 4)],
  })
}

// ─── Public factories ──────────────────────────────────────────────────────────

/**
 * Returns a circular DivIcon for a Stakeholder, colour-coded by actorType
 * and border-styled by impactInfluence. Results are cached.
 */
export function createStakeholderIcon(
  stakeholder: Stakeholder,
  selected = false,
  dimmed = false,
): L.DivIcon {
  const color = ACTOR_TYPE_COLORS[stakeholder.actorType]
  const border = IMPACT_BORDER_STYLES[stakeholder.impactInfluence]
  const key = cacheKey(color, stakeholder.impactInfluence, 'circle', selected, dimmed)

  if (_cache.has(key)) return _cache.get(key)!

  const label = `${stakeholder.name} – ${stakeholder.actorType}, impact: ${stakeholder.impactInfluence}`
  const icon = buildIcon(color, border, 'circle', label, selected, dimmed)
  _cache.set(key, icon)
  return icon
}

/**
 * Returns a diamond DivIcon for an Instrument, colour-coded by instrumentType
 * and border-styled by impactInfluence. Results are cached.
 */
export function createInstrumentIcon(
  instrument: Instrument,
  selected = false,
  dimmed = false,
): L.DivIcon {
  const color = INSTRUMENT_TYPE_COLORS[instrument.instrumentType]
  const border = IMPACT_BORDER_STYLES[instrument.impactInfluence]
  const key = cacheKey(color, instrument.impactInfluence, 'diamond', selected, dimmed)

  if (_cache.has(key)) return _cache.get(key)!

  const label = `${instrument.name} – ${instrument.instrumentType}, impact: ${instrument.impactInfluence}`
  const icon = buildIcon(color, border, 'diamond', label, selected, dimmed)
  _cache.set(key, icon)
  return icon
}
