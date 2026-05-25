import type { ActorType, InstrumentType, ImpactInfluence } from '@/types/entities'

// ─── Actor type colours ────────────────────────────────────────────────────────
// Each ActorType gets a visually distinct, accessible fill colour.

export const ACTOR_TYPE_COLORS: Record<ActorType, string> = {
  'academia':       '#4f86c6', // blue
  'civil society':  '#5aab6e', // green
  'government':     '#c67c4f', // orange
  'NGO':            '#9c6ac6', // purple
  'administration': '#4fb0c6', // teal
  'private sector': '#c6b44f', // gold
  'other':          '#8a8a8a', // grey
}

// ─── Instrument type colours ───────────────────────────────────────────────────

export const INSTRUMENT_TYPE_COLORS: Record<InstrumentType, string> = {
  'law':        '#d64f4f', // red
  'guideline':  '#4f86c6', // blue
  'petition':   '#c67c4f', // orange
  'initiative': '#5aab6e', // green
  'strategy':   '#9c6ac6', // purple
  'other':      '#8a8a8a', // grey
}

// ─── Impact / influence border styles ─────────────────────────────────────────
// Border weight and colour encode the entity's level of influence at a glance.

export const IMPACT_BORDER_STYLES: Record<ImpactInfluence, string> = {
  'symbolic':           '2px solid rgba(255,255,255,0.5)',
  'advisory':           '2px solid rgba(255,255,255,0.9)',
  'binding':            '3px solid #ffffff',
  'highly influential': '3px solid #ffd700',
}
