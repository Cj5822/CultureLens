import type { ActorType, ImpactInfluence, InstrumentType } from '@/types/entities'

// ─── Node colors ───────────────────────────────────────────────────────────────
// These match the palette used by EntityMarkers on the map for visual consistency.

export const ACTOR_TYPE_COLORS: Record<ActorType, string> = {
  academia:        '#4f86c6',
  'civil society': '#5aab6e',
  government:      '#c67c4f',
  NGO:             '#9c6ac6',
  administration:  '#4fb0c6',
  'private sector':'#c6b44f',
  other:           '#8a8a8a',
}

export const INSTRUMENT_TYPE_COLORS: Record<InstrumentType, string> = {
  law:        '#d64f4f',
  guideline:  '#4f86c6',
  petition:   '#c67c4f',
  initiative: '#5aab6e',
  strategy:   '#9c6ac6',
  other:      '#8a8a8a',
}

// ─── Node radius by impact level ───────────────────────────────────────────────

export const IMPACT_RADIUS: Record<ImpactInfluence, number> = {
  symbolic:           7,
  advisory:           10,
  binding:            13,
  'highly influential': 17,
}

// ─── Visual constants ──────────────────────────────────────────────────────────

export const DEFAULT_NODE_OPACITY  = 1
export const DIMMED_NODE_OPACITY   = 0.15
export const DEFAULT_EDGE_OPACITY  = 0.55
export const DIMMED_EDGE_OPACITY   = 0.05
export const HIGHLIGHT_EDGE_OPACITY = 0.9

export const SELECTED_STROKE_WIDTH  = 3
export const DEFAULT_STROKE_WIDTH   = 1.5
export const SELECTED_STROKE_COLOR  = '#ffffff'
export const SELECTED_GLOW_SPREAD   = 8
