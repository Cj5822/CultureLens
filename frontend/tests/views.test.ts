import { describe, it, expect } from 'vitest'
import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS } from '@/types/filters'
import { buildGraphData } from '@/utils/graph/buildGraphData'
import { groupByTheme } from '@/utils/analytics/grouping'
import { computeParallelSetsLayout, PS_CANDIDATE_DIMENSIONS } from '@/utils/analytics/parallelSets'
import { stakeholder, instrument } from './helpers'

const dim = (key: string) => PS_CANDIDATE_DIMENSIONS.find((d) => d.key === key)!

describe('filterEntities', () => {
  const es = [
    stakeholder({ id: 'a', actorType: 'NGO', thematicFocus: ['Education', 'Migration'], country: 'Germany' }),
    stakeholder({ id: 'b', actorType: 'government', thematicFocus: ['Culture'], country: 'Italy' }),
    instrument({ id: 'c', instrumentType: 'law', thematicFocus: ['Migration'], country: 'Germany' }),
  ]
  const ids = (f: Partial<typeof DEFAULT_FILTERS>) => filterEntities(es, { ...DEFAULT_FILTERS, ...f }).map((e) => e.id)

  it('returns everything with no filters', () => expect(ids({})).toEqual(['a', 'b', 'c']))
  it('combines values within a group with OR', () => expect(ids({ countries: ['Germany', 'Italy'] })).toEqual(['a', 'b', 'c']))
  it('combines groups with AND', () => expect(ids({ countries: ['Germany'], thematicFocus: ['Education'] })).toEqual(['a']))
  it('matches multi-valued attributes on any overlap', () => expect(ids({ thematicFocus: ['Migration'] })).toEqual(['a', 'c']))
  it('applies subtype filters only to their own subtype', () => {
    expect(ids({ actorTypes: ['NGO'] })).toEqual(['a', 'c'])
    expect(ids({ instrumentTypes: ['strategy'] })).toEqual(['a', 'b'])
  })
})

describe('buildGraphData', () => {
  it('creates one node per entity, including isolated ones', () => {
    const g = buildGraphData([stakeholder({ id: 'x' }), stakeholder({ id: 'y' })])
    expect(g.nodes.map((n) => n.id)).toEqual(['x', 'y'])
    expect(g.edges).toEqual([])
  })
  it('collapses A→B and B→A into one undirected edge and ignores unknown IDs', () => {
    const g = buildGraphData([
      stakeholder({ id: 'x', connections: ['y', 'missing'] }),
      stakeholder({ id: 'y', connections: ['x'] }),
    ])
    expect(g.edges).toHaveLength(1)
  })
})

describe('multi-valued counting (D5)', () => {
  const es = [stakeholder({ thematicFocus: ['Education', 'Migration'] }), stakeholder({ thematicFocus: ['Migration'] })]
  it('counts an entity in every theme group in Analytics / Cluster Analysis', () => {
    expect(Object.fromEntries(groupByTheme(es).map((g) => [g.label, g.count]))).toEqual({ Migration: 2, Education: 1 })
  })
  it('counts only the first theme in Parallel Sets, so each column sums to the entity count', () => {
    const layout = computeParallelSetsLayout(es, [dim('category'), dim('primaryTheme')])
    const themes = Object.fromEntries(layout.columns[1].nodes.map((n) => [n.value, n.count]))
    expect(themes).toEqual({ Education: 1, Migration: 1 })
    for (const col of layout.columns) expect(col.nodes.reduce((s, n) => s + n.count, 0)).toBe(es.length)
  })
})
