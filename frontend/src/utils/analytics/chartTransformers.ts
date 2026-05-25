import type { Entity } from '@/types/entities'
import type { AggregationGroup, ChartDatum } from '@/types/analytics'

// ─── Chart transformers ────────────────────────────────────────────────────────

/**
 * Converts an array of AggregationGroups into ChartDatum tuples.
 * Preserves the existing sort order — call sortGroups / topNGroups before this
 * if you need a different ordering.
 * Pure function — does not mutate the input array.
 */
export function toChartData<T extends Entity = Entity>(
  groups: AggregationGroup<T>[],
): ChartDatum[] {
  return groups.map(({ label, count }) => ({ label, value: count }))
}

/**
 * Returns at most `limit` groups, preserving their existing order.
 * If `groups` has fewer entries than `limit`, the full array is returned.
 * Pure function — returns a new array, never mutates the input.
 */
export function topNGroups<T extends Entity = Entity>(
  groups: AggregationGroup<T>[],
  limit: number,
): AggregationGroup<T>[] {
  return groups.slice(0, limit)
}
