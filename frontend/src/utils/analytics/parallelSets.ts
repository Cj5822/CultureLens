import type { Entity, Stakeholder, Instrument } from '@/types/entities'

// ─── Parallel sets (Wilke, Fundamentals of Data Visualization §11.4) ──────────
//
// A parallel-sets plot needs every dimension to assign each entity to
// exactly one category (a strict partition per column), so multi-valued
// fields like thematicFocus / geographicalScope are only exposed here in a
// derived, single-valued form (e.g. "primary theme" = first listed theme).

export interface PSDimension {
  /** Stable key, also used as the React key / <select> value. */
  key: string
  /** Column header shown above the axis. */
  label: string
  /** Extracts this entity's category for this dimension. */
  getValue: (entity: Entity) => string
  /** Canonical display order for known categories; unlisted values are appended, most-frequent first. */
  order?: readonly string[]
}

export interface PSNode {
  value: string
  count: number
  y0: number
  y1: number
}

export interface PSColumn {
  key: string
  label: string
  nodes: PSNode[]
}

export interface PSRibbon {
  /** Stable identity for hover/selection tracking. */
  id: string
  /** Ribbon runs from column `dimIndex` to column `dimIndex + 1`. */
  dimIndex: number
  sourceValue: string
  targetValue: string
  /** Value of the leftmost (colour) dimension for every entity in this ribbon. */
  colorValue: string
  count: number
  s0: number
  s1: number
  t0: number
  t1: number
  entities: Entity[]
}

export interface PSLayout {
  columns: PSColumn[]
  ribbons: PSRibbon[]
  total: number
}

const COUNTRY_TOP_N = 6

function isStakeholder(e: Entity): e is Stakeholder {
  return e.category === 'stakeholders'
}

// ─── Candidate dimensions ───────────────────────────────────────────────────

// Ordered to match the FilterSidebar's section order top-to-bottom, so a
// dimension toggled on there lands in the same relative left-to-right
// position in the diagram, regardless of the order it was toggled in.
export const PS_CANDIDATE_DIMENSIONS: PSDimension[] = [
  {
    key: 'category',
    label: 'Category',
    getValue: (e) => (isStakeholder(e) ? 'Stakeholder' : 'Instrument'),
    order: ['Stakeholder', 'Instrument'],
  },
  {
    key: 'type',
    label: 'Type',
    getValue: (e) => (isStakeholder(e) ? e.actorType : (e as Instrument).instrumentType),
  },
  {
    key: 'primaryTheme',
    label: 'Primary Thematic Focus',
    getValue: (e) => e.thematicFocus[0] ?? '(none)',
  },
  {
    key: 'primaryGeographicalScope',
    label: 'Primary Geographical Scope',
    getValue: (e) => e.geographicalScope[0] ?? '(none)',
  },
  {
    key: 'impactInfluence',
    label: 'Impact / Influence',
    getValue: (e) => e.impactInfluence,
    order: ['symbolic', 'advisory', 'binding', 'highly influential'],
  },
  {
    key: 'implementationStatus',
    label: 'Implementation Status',
    getValue: (e) => (isStakeholder(e) ? 'n/a (stakeholder)' : e.implementationStatus),
    order: ['draft', 'development', 'implementation', 'evaluation', 'archive', 'n/a (stakeholder)'],
  },
  {
    key: 'recommendedNextSteps',
    label: 'Recommended Next Steps',
    getValue: (e) => e.recommendedNextSteps,
    order: ['engage', 'contact', 'monitor', 'no action'],
  },
  {
    key: 'country',
    label: 'Country',
    // resolved dynamically per dataset — see resolveGetValue()
    getValue: (e) => e.country,
  },
]

export const PS_DEFAULT_DIMENSION_KEYS = ['category', 'type', 'impactInfluence', 'recommendedNextSteps']

/** Sorts a set of dimension keys into the same order as PS_CANDIDATE_DIMENSIONS. */
export function sortDimensionKeys(keys: readonly string[]): string[] {
  const keySet = new Set(keys)
  return PS_CANDIDATE_DIMENSIONS.map((d) => d.key).filter((k) => keySet.has(k))
}

// ─── Internal helpers ───────────────────────────────────────────────────────

/** Country needs dataset-dependent bucketing (top N + "Other"); everything else is static. */
function resolveGetValue(dim: PSDimension, entities: Entity[]): (e: Entity) => string {
  if (dim.key !== 'country') return dim.getValue

  const counts = new Map<string, number>()
  for (const e of entities) counts.set(e.country, (counts.get(e.country) ?? 0) + 1)
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, COUNTRY_TOP_N)
    .map(([country]) => country)
  const topSet = new Set(top)

  return (e: Entity) => (topSet.has(e.country) ? e.country : 'Other')
}

function resolveOrder(values: string[], canonical: readonly string[] | undefined, isCountry: boolean): string[] {
  const present = new Set(values)
  const freq = new Map<string, number>()
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1)
  const byFreqDesc = (a: string, b: string) => freq.get(b)! - freq.get(a)! || a.localeCompare(b)

  let order: string[]
  if (canonical) {
    const known = canonical.filter((v) => present.has(v))
    const unknown = [...present].filter((v) => !canonical.includes(v)).sort(byFreqDesc)
    order = [...known, ...unknown]
  } else {
    order = [...present].sort(byFreqDesc)
  }

  if (isCountry && present.has('Other')) {
    order = [...order.filter((v) => v !== 'Other'), 'Other']
  }
  return order
}

// ─── Layout computation ──────────────────────────────────────────────────────

/**
 * Computes a parallel-sets / alluvial layout: one column of stacked category
 * nodes per dimension, and ribbons whose thickness is proportional to the
 * number of entities flowing between adjacent categories.
 *
 * Ribbons are split by the *full* combination of category values across all
 * dimensions (an "alluvium", per ggalluvial terminology), so a ribbon's
 * colour — driven by the leftmost dimension — stays constant across every
 * column it passes through. This mirrors Wilke's recommendation to position
 * the colour-defining variable leftmost (dataviz §11.4) and keep bands
 * traceable across the whole plot.
 */
export function computeParallelSetsLayout(entities: Entity[], dimensions: PSDimension[]): PSLayout {
  const n = dimensions.length
  if (entities.length === 0 || n < 2) return { columns: [], ribbons: [], total: 0 }

  const getters = dimensions.map((d) => resolveGetValue(d, entities))
  const tuples = entities.map((e) => getters.map((fn) => fn(e)))

  const orders = dimensions.map((d, i) => resolveOrder(tuples.map((t) => t[i]), d.order, d.key === 'country'))
  const orderIndex = orders.map((ord) => new Map(ord.map((v, idx) => [v, idx])))

  // Group entities into "alluvia": one group per unique combination of values.
  const jointMap = new Map<string, { tuple: string[]; entities: Entity[] }>()
  tuples.forEach((tuple, idx) => {
    const key = tuple.join('␟')
    const existing = jointMap.get(key)
    if (existing) {
      existing.entities.push(entities[idx])
    } else {
      jointMap.set(key, { tuple, entities: [entities[idx]] })
    }
  })
  const joints = [...jointMap.values()]

  // Global sort: lexicographic over each dimension's category order. Keeps
  // same-colour alluvia bundled together at every column.
  joints.sort((a, b) => {
    for (let i = 0; i < n; i++) {
      const diff = orderIndex[i].get(a.tuple[i])! - orderIndex[i].get(b.tuple[i])!
      if (diff !== 0) return diff
    }
    return 0
  })

  // Column nodes: fixed category order, height = total count in that category.
  const columns: PSColumn[] = dimensions.map((d, i) => {
    const counts = new Map<string, number>()
    for (const j of joints) counts.set(j.tuple[i], (counts.get(j.tuple[i]) ?? 0) + j.entities.length)

    let cursor = 0
    const nodes: PSNode[] = []
    for (const value of orders[i]) {
      const count = counts.get(value) ?? 0
      if (count === 0) continue
      const y0 = cursor
      const y1 = cursor + count
      cursor = y1
      nodes.push({ value, count, y0, y1 })
    }
    return { key: d.key, label: d.label, nodes }
  })

  // Per-alluvium segment offsets within each node, placed in the same
  // globally-sorted order the alluvia were visited in — this is what keeps
  // ribbons non-self-crossing within a shared colour group. Cursors must
  // start at each node's own base offset (its y0 within the column), not
  // at 0 — otherwise every category after the first in a column ends up
  // with its ribbon segments drawn from the top of the column instead of
  // from that category's own node.
  const nodeCursors: Map<string, number>[] = columns.map((col) => {
    const base = new Map<string, number>()
    for (const node of col.nodes) base.set(node.value, node.y0)
    return base
  })
  const jointSegments = joints.map(() => ({ y0: new Array<number>(n).fill(0), y1: new Array<number>(n).fill(0) }))

  joints.forEach((j, idx) => {
    for (let i = 0; i < n; i++) {
      const v = j.tuple[i]
      const start = nodeCursors[i].get(v) ?? 0
      const size = j.entities.length
      jointSegments[idx].y0[i] = start
      jointSegments[idx].y1[i] = start + size
      nodeCursors[i].set(v, start + size)
    }
  })

  const ribbons: PSRibbon[] = []
  for (let i = 0; i < n - 1; i++) {
    joints.forEach((j, idx) => {
      ribbons.push({
        id: `${idx}-${i}`,
        dimIndex: i,
        sourceValue: j.tuple[i],
        targetValue: j.tuple[i + 1],
        colorValue: j.tuple[0],
        count: j.entities.length,
        s0: jointSegments[idx].y0[i],
        s1: jointSegments[idx].y1[i],
        t0: jointSegments[idx].y0[i + 1],
        t1: jointSegments[idx].y1[i + 1],
        entities: j.entities,
      })
    })
  }

  return { columns, ribbons, total: entities.length }
}
