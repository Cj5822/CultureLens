import { describe, it, expect } from 'vitest'
import { resolveConnections } from '@/utils/resolveConnections'
import { stakeholder, instrument, linked } from './helpers'

function world() {
  return [
    stakeholder({ id: 'S1', name: 'Federal Office for Migration and Refugees (BAMF)' }),
    stakeholder({ id: 'S2', name: 'Diakonie Deutschland' }),
    stakeholder({ id: 'S3', name: 'Ministry of Education (Te Tāhuhu o te Mātauranga)', country: 'New Zealand' }),
    stakeholder({ id: 'S4', name: 'Ministry of Education', country: 'Greece' }),
    stakeholder({ id: 'S5', name: 'Ministry of Education', country: 'Serbia' }),
    instrument({ id: 'I1', name: 'National Integration Action Plan', country: 'Germany' }),
    stakeholder({ id: 'EU1', name: 'European Commission – DG EAC', country: 'EU' }),
  ]
}

function resolve(raw: string, from = 'I1') {
  const es = world().map((e) => (e.id === from ? { ...e, connections: [raw] } : e))
  return linked(resolveConnections(es), from)
}

describe('resolveConnections', () => {
  it('keeps an existing generated ID', () => expect(resolve('S2')).toEqual(['S2']))
  it('links an exact name', () => expect(resolve('Diakonie Deutschland')).toEqual(['S2']))
  it('ignores case, diacritics, dashes and punctuation', () => {
    expect(resolve('diakonie-deutschland')).toEqual(['S2'])
    expect(resolve('Ministry of Education (Te Tahuhu o te Matauranga)')).toEqual(['S3'])
  })
  it('links a name followed by an annotation', () => expect(resolve('Diakonie Deutschland (see stakeholder sheet)')).toEqual(['S2']))
  it('links an acronym that appears inside a name', () => expect(resolve('BAMF')).toEqual(['S1']))
  it('leaves a name shared by several entities unresolved', () => expect(resolve('Ministry of Education')).toEqual([]))
  it('never links an entity to itself', () => expect(resolve('National Integration Action Plan')).toEqual([]))
  it('drops references it cannot resolve', () => expect(resolve('KMK')).toEqual([]))
  it('resolves across countries (import batches)', () => {
    expect(resolve('European Commission – DG EAC', 'S3')).toEqual(['EU1'])
  })
  it('does not mutate its input', () => {
    const es = world().map((e) => (e.id === 'I1' ? { ...e, connections: ['BAMF'] } : e))
    resolveConnections(es)
    expect(es.find((e) => e.id === 'I1')!.connections).toEqual(['BAMF'])
  })

  // Known false links (report Section 5.2): a short or generic query is
  // "contained" in longer names. Expected to fail until the matching rule is
  // tightened.
  it.fails('leaves a generic word unresolved (Section 5.2)', () => expect(resolve('Migration')).toEqual([]))
  it.fails('leaves a two-letter token unresolved (Section 5.2)', () => expect(resolve('EU')).toEqual([]))
})
