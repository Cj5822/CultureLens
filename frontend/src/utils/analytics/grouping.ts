import type { Entity, Stakeholder, Instrument, ImpactInfluence } from '@/types/entities'
import type { AggregationGroup } from '@/types/analytics'

// ─── Ordering constants ────────────────────────────────────────────────────────

/** Canonical impact-level order (used for stable 0-count insertion in groupByImpact) */
const IMPACT_ORDER: readonly ImpactInfluence[] = [
  'symbolic',
  'advisory',
  'binding',
  'highly influential',
]

// ─── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Sorts groups descending by count. Groups with equal counts are ordered
 * alphabetically by label for stable, deterministic output.
 */
function sortGroups<T extends Entity>(groups: AggregationGroup<T>[]): AggregationGroup<T>[] {
  return [...groups].sort((a, b) => {
    const diff = b.count - a.count
    return diff !== 0 ? diff : a.label.localeCompare(b.label)
  })
}

/**
 * Generic single-key grouping helper. Expands expandFn(entity) into zero or
 * more string keys and accumulates entries under each key.
 */
function groupByKeys<T extends Entity>(
  entries: T[],
  expandFn: (entry: T) => readonly string[],
): AggregationGroup<T>[] {
  const map = new Map<string, T[]>()

  for (const entry of entries) {
    for (const key of expandFn(entry)) {
      const bucket = map.get(key)
      if (bucket) {
        bucket.push(entry)
      } else {
        map.set(key, [entry])
      }
    }
  }

  const groups: AggregationGroup<T>[] = []
  for (const [label, grpEntries] of map) {
    groups.push({ label, count: grpEntries.length, entries: grpEntries })
  }

  return sortGroups(groups)
}

// ─── Public grouping functions ────────────────────────────────────────────────

/**
 * Groups entities by their country.
 * Each entity belongs to exactly one country group.
 */
export function groupByCountry(entries: Entity[]): AggregationGroup[] {
  return groupByKeys(entries, entry => [entry.country])
}

/**
 * Groups entities by thematic focus.
 * An entity with multiple themes appears in each theme's group.
 */
export function groupByTheme(entries: Entity[]): AggregationGroup[] {
  return groupByKeys(entries, entry => entry.thematicFocus)
}

/**
 * Groups entities by geographical scope.
 * An entity with multiple scopes appears in each scope's group.
 */
export function groupByGeographicalScope(entries: Entity[]): AggregationGroup[] {
  return groupByKeys(entries, entry => entry.geographicalScope)
}

/**
 * Groups entities by impact/influence level.
 * All four valid impact levels are always present, even when count is 0.
 * Groups are sorted descending by count; ties broken by the canonical
 * IMPACT_ORDER position (not alphabetically) to preserve semantic meaning.
 */
export function groupByImpact(entries: Entity[]): AggregationGroup[] {
  // Seed map with all valid levels at 0 so empty levels are represented
  const map = new Map<ImpactInfluence, Entity[]>(
    IMPACT_ORDER.map(level => [level, []]),
  )

  for (const entry of entries) {
    const bucket = map.get(entry.impactInfluence)
    if (bucket) {
      bucket.push(entry)
    }
    // If impactInfluence somehow doesn't match a known level, skip silently
  }

  const groups: AggregationGroup[] = []
  for (const [label, grpEntries] of map) {
    groups.push({ label, count: grpEntries.length, entries: grpEntries })
  }

  // Sort descending by count; equal counts keep canonical impact-level order
  return groups.sort((a, b) => {
    const diff = b.count - a.count
    if (diff !== 0) return diff
    // Tiebreak: preserve canonical impact order (index in IMPACT_ORDER)
    const aIdx = IMPACT_ORDER.indexOf(a.label as ImpactInfluence)
    const bIdx = IMPACT_ORDER.indexOf(b.label as ImpactInfluence)
    return aIdx - bIdx
  })
}

/**
 * Groups stakeholders by actor type.
 * Each stakeholder belongs to exactly one actor type group.
 */
export function groupByActorType(entries: Stakeholder[]): AggregationGroup<Stakeholder>[] {
  return groupByKeys(entries, entry => [entry.actorType])
}

/**
 * Groups instruments by instrument type.
 * Each instrument belongs to exactly one instrument type group.
 */
export function groupByInstrumentType(entries: Instrument[]): AggregationGroup<Instrument>[] {
  return groupByKeys(entries, entry => [entry.instrumentType])
}
