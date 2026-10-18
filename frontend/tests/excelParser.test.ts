import { describe, it, expect } from 'vitest'
import { parseExcelFile, mergeEntities } from '@/utils/excelParser'
import { templateWorkbook } from './helpers'

const STK: Record<string, string>[] = [
  { Category: 'Stakeholders', 'Actor type': 'Government', 'Thematic focus': 'Education; Migration', Name: 'Ministry A', 'Network role': 'BINDING', Connections: 'Office B; Act C' },
  { Category: 'Stakeholders', 'Actor type': 'ngo', 'Thematic focus': 'Culture / Education', Name: 'Office B', 'Network role': 'Highly Influential', Connections: 'Ministry A, Act C' },
  { Category: 'Stakeholders', 'Actor type': 'NGO', Name: '' },
]
const INS: Record<string, string>[] = [
  { Category: 'Instruments', 'Thematic focus': 'Education, Migration', 'Instrument type': 'Law', 'Official name': 'Act C', 'Implementation status': 'Implementation', 'Impact & influence(actual or expected) of instrument with regards to ITC': 'binding' },
]

describe('parseExcelFile', () => {
  it('imports the current template and applies the file country to every row', () => {
    const r = parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS }))
    expect(r.stakeholders).toHaveLength(2)
    expect(r.instruments).toHaveLength(1)
    expect(new Set(mergeEntities(r).map((e) => e.country))).toEqual(new Set(['Germany']))
    expect(r.meta.country).toBe('Germany')
  })

  it('skips a row with an empty name and says so', () => {
    const r = parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS }))
    expect(r.warnings).toHaveLength(1)
    expect(r.warnings[0]).toMatch(/Name/)
  })

  it('matches categorical values case-insensitively', () => {
    const r = parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS }))
    expect(r.stakeholders.map((s) => s.actorType)).toEqual(['government', 'NGO'])
    expect(r.stakeholders.map((s) => s.impactInfluence)).toEqual(['binding', 'highly influential'])
    expect(r.instruments[0].instrumentType).toBe('law')
    expect(r.instruments[0].implementationStatus).toBe('implementation')
  })

  it('splits multi-valued cells on semicolons, commas and slashes', () => {
    const r = parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS }))
    expect(r.stakeholders[0].thematicFocus).toEqual(['Education', 'Migration'])
    expect(r.stakeholders[1].thematicFocus).toEqual(['Culture', 'Education'])
    expect(r.instruments[0].thematicFocus).toEqual(['Education', 'Migration'])
  })

  it('splits connections on semicolons when present, otherwise on commas', () => {
    const r = parseExcelFile(templateWorkbook({
      stakeholders: [{ Name: 'X', Connections: 'Ministry of Education, Science and Technological Development; Office B' }, { Name: 'Y', Connections: 'A, B' }],
    }))
    expect(r.stakeholders[0].connections).toEqual(['Ministry of Education, Science and Technological Development', 'Office B'])
    expect(r.stakeholders[1].connections).toEqual(['A', 'B'])
  })

  it('finds sheets whose names differ in case or are singular', () => {
    const r = parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS, sheetNames: ['STAKEHOLDER', 'Instrument'] }))
    expect(r.stakeholders).toHaveLength(2)
    expect(r.instruments).toHaveLength(1)
  })

  it('fails explicitly when the Instruments sheet is missing', () => {
    expect(() => parseExcelFile(templateWorkbook({ stakeholders: STK, sheetNames: ['Stakeholders'] }))).toThrow(/Instruments/)
  })

  it('keeps generated IDs unique across several files', () => {
    const a = mergeEntities(parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS })))
    const b = mergeEntities(parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS })))
    const ids = [...a, ...b].map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // Known failure modes (report Section 5.1). These tests describe the
  // intended behaviour and are expected to fail until the importer is fixed;
  // vitest reports an error if one of them unexpectedly starts passing.
  it.fails('finds the header row when the stakeholder metadata block is one row shorter (Section 5.1)', () => {
    const above = [['Partner:', 'Test'], ['Date:', '2026-01-01'], ['Country:', 'Germany'], ['Remarks:', '']]
    const r = parseExcelFile(templateWorkbook({ stakeholders: STK, instruments: INS, stakeholderAbove: above }))
    expect(r.stakeholders).toHaveLength(2)
  })

  it.fails('warns when a value outside the enumeration is replaced by a default (Section 5.1)', () => {
    const r = parseExcelFile(templateWorkbook({ stakeholders: [{ Name: 'Office Z', 'Actor type': 'Public administration' }] }))
    expect(r.stakeholders[0].actorType).toBe('other')
    expect(r.warnings.some((w) => /Public administration/.test(w))).toBe(true)
  })
})
