// Shared fixtures for the unit tests.
import * as XLSX from 'xlsx'
import type { Entity, Stakeholder, Instrument } from '@/types/entities'

export const STK_HEADERS = [
  'Category', 'Actor type', 'Thematic focus', 'Name', 'Link towards web presence', 'Geographical scope',
  'Functional role', 'Resources', 'Network role', 'Relevance of stakeholder within the thematic context of INTRACOMP',
  'Impact & influence(actual or expected) of stakeholder with regards to ITC',
  "Stakeholder's approach to and/or understanding of ITC", 'Equity', 'Intended audience', 'Languages',
  'Recommended next steps', 'Connections',
]
export const INS_HEADERS = [
  'Category', 'Thematic focus', 'Instrument type', 'Official name', 'Link towards web presence', 'Geographical scope',
  'Responsible institution', 'Main objectives of instrument', 'Implementation status',
  'Relevance of instrument within the thematic context of INTRACOMP',
  'Impact & influence(actual or expected) of instrument with regards to ITC',
  "Instrument's approach to and/or understanding of ITC", 'Equity', 'Intended audience', 'Languages',
  'Recommended next steps', 'Connections',
]

const meta = (country: string) => [['Partner:', 'Test'], ['Date:', '2026-01-01'], ['Country:', country], ['Remarks:', '']]

/** A workbook in the current template layout: stakeholder header on row 6,
 *  instrument header on row 5. Rows are given as header -> value maps. */
export function templateWorkbook(opts: {
  country?: string
  stakeholders?: Record<string, string>[]
  instruments?: Record<string, string>[]
  stakeholderAbove?: string[][]
  instrumentAbove?: string[][]
  intro?: boolean
  sheetNames?: [string, string] | [string]
}): ArrayBuffer {
  const country = opts.country ?? 'Germany'
  const wb = XLSX.utils.book_new()
  if (opts.intro !== false) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['INTRACOMP Policy Mapping Template']]), 'Intro')
  const [stkName, insName] = opts.sheetNames ?? ['Stakeholders', 'Instruments']
  const toRows = (headers: string[], rows: Record<string, string>[]) => rows.map((r) => headers.map((h) => r[h] ?? ''))
  const stkAbove = opts.stakeholderAbove ?? [...meta(country), []]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...stkAbove, STK_HEADERS, ...toRows(STK_HEADERS, opts.stakeholders ?? [])]), stkName)
  if (insName) {
    const insAbove = opts.instrumentAbove ?? meta(country)
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([...insAbove, INS_HEADERS, ...toRows(INS_HEADERS, opts.instruments ?? [])]), insName)
  }
  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
}

let n = 0
export function stakeholder(over: Partial<Stakeholder> = {}): Stakeholder {
  n++
  return {
    id: `STK-T-${n}`, category: 'stakeholders', name: `Stakeholder ${n}`, actorType: 'government',
    thematicFocus: [], geographicalScope: [], link: '', impactInfluence: 'advisory', connections: [],
    recommendedNextSteps: 'monitor', additionalRemarks: '', languages: [], equityAddressed: '', intendedAudience: '',
    itcApproach: '', relationToITC: '', functionalRole: '', description: '', relevanceToINTRACOMP: '',
    country: 'Germany', lat: 0, lng: 0, ...over,
  }
}

export function instrument(over: Partial<Instrument> = {}): Instrument {
  n++
  return {
    id: `INS-T-${n}`, category: 'instruments', name: `Instrument ${n}`, instrumentType: 'law',
    thematicFocus: [], geographicalScope: [], link: '', impactInfluence: 'advisory', connections: [],
    recommendedNextSteps: 'monitor', additionalRemarks: '', languages: [], equityAddressed: '', intendedAudience: '',
    itcApproach: '', responsibleInstitution: '', mainObjectives: '', implementationStatus: 'implementation',
    relevanceToINTRACOMP: '', country: 'Germany', lat: 0, lng: 0, ...over,
  }
}

export const linked = (entities: Entity[], id: string) => entities.find((e) => e.id === id)!.connections
