import type { Entity, Stakeholder, Instrument } from '@/types/entities'

// ─── Core aggregation types ────────────────────────────────────────────────────

/**
 * A single group produced by a grouping function.
 * T is constrained to Entity subtypes so callers can get typed entry arrays
 * (e.g. AggregationGroup<Stakeholder> for groupByActorType).
 */
export interface AggregationGroup<T extends Entity = Entity> {
  label: string
  count: number
  entries: T[]
}

/**
 * Minimal {label, value} tuple consumed by chart renderers.
 */
export interface ChartDatum {
  label: string
  value: number
}

// ─── Re-export subtypes for convenience ───────────────────────────────────────

export type StakeholderGroup = AggregationGroup<Stakeholder>
export type InstrumentGroup  = AggregationGroup<Instrument>
export type EntityGroup      = AggregationGroup<Entity>
