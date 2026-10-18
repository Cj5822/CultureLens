// Regression tests on the eight demonstration workbooks: the user-evaluation
// answers (report Table 6) and the network facts in Section 5.3 must not
// change silently.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { parseExcelFile, mergeEntities } from '@/utils/excelParser'
import { resolveConnections } from '@/utils/resolveConnections'
import { buildGraphData } from '@/utils/graph/buildGraphData'
import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS } from '@/types/filters'
import { buildFreqWords } from '@/utils/textFrequency'
import type { Entity } from '@/types/entities'

const DIR = path.resolve(__dirname, '..', 'src', 'data')
const raw: Entity[] = readdirSync(DIR).filter((f) => f.endsWith('.xlsx')).sort().flatMap((f) => {
  const b = readFileSync(path.join(DIR, f))
  return mergeEntities(parseExcelFile(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer))
})
const entities = resolveConnections(raw)
const graph = buildGraphData(entities)

describe('demonstration workbooks', () => {
  it('import 78 entities: 48 stakeholders and 30 instruments', () => {
    expect(entities).toHaveLength(78)
    expect(entities.filter((e) => e.category === 'stakeholders')).toHaveLength(48)
  })

  it('declare 137 references in 71 entities, resolving to 77 undirected edges', () => {
    expect(raw.filter((e) => e.connections.length > 0)).toHaveLength(71)
    expect(raw.reduce((s, e) => s + e.connections.length, 0)).toBe(137)
    expect(graph.edges).toHaveLength(77)
  })

  it('give the Table 6 answers', () => {
    const hi = filterEntities(entities, { ...DEFAULT_FILTERS, categories: ['stakeholders'], impactInfluence: ['highly influential'] })
    expect(hi.filter((e) => e.country === 'New Zealand')).toHaveLength(4)
    expect(entities.filter((e) => e.category === 'instruments' && e.implementationStatus === 'implementation')).toHaveLength(19)
    expect(entities.filter((e) => e.category === 'instruments' && e.instrumentType === 'law' && e.impactInfluence === 'binding')).toHaveLength(8)
    expect(entities.filter((e) => e.category === 'stakeholders' && e.actorType === 'administration')).toHaveLength(11)
    expect(buildFreqWords('Germany', entities).find((w) => w.text !== 'itc')?.text).toBe('integration')
    expect(buildFreqWords('New Zealand', entities).find((w) => w.text !== 'itc')?.text).toBe('bicultural')
  })

  it('link BMBF to Diakonie Deutschland in two steps via BAMF', () => {
    const id = (re: RegExp) => entities.find((e) => re.test(e.name))!.id
    const [bmbf, bamf, diakonie] = [id(/\(BMBF\)/), id(/\(BAMF\)/), id(/^Diakonie Deutschland$/)]
    const adj = (a: string, b: string) => graph.edges.some((e) => (e.source === a && e.target === b) || (e.source === b && e.target === a))
    expect(adj(bmbf, diakonie)).toBe(false)
    expect(adj(bmbf, bamf) && adj(bamf, diakonie)).toBe(true)
  })
})
