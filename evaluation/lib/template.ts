// Helpers for writing workbooks laid out like the INTRACOMP policy-mapping
// template (as found in frontend/src/data/CultureLens_Demo_*.xlsx):
//
//   Intro         free text
//   Stakeholders  metadata rows 1-4 (Partner/Date/Country/Remarks), row 5 blank,
//                 header row 6, data from row 7
//   Instruments   metadata rows 1-4, header row 5, data from row 6
import * as XLSX from 'xlsx'

export const STAKEHOLDER_HEADERS = [
  'Category', 'Actor type', 'Thematic focus', 'Name', 'Link towards web presence',
  'Geographical scope', 'Functional role', 'Resources', 'Network role',
  'Relevance of stakeholder within the thematic context of INTRACOMP',
  'Impact & influence(actual or expected) of stakeholder with regards to ITC',
  "Stakeholder's approach to and/or understanding of ITC", 'Equity', 'Intended audience',
  'Languages', 'Recommended next steps', 'Connections',
] as const

export const INSTRUMENT_HEADERS = [
  'Category', 'Thematic focus', 'Instrument type', 'Official name', 'Link towards web presence',
  'Geographical scope', 'Responsible institution', 'Main objectives of instrument',
  'Implementation status', 'Relevance of instrument within the thematic context of INTRACOMP',
  'Impact & influence(actual or expected) of instrument with regards to ITC',
  "Instrument's approach to and/or understanding of ITC", 'Equity', 'Intended audience',
  'Languages', 'Recommended next steps', 'Connections',
] as const

export type StakeholderRow = Partial<Record<(typeof STAKEHOLDER_HEADERS)[number], string>>
export type InstrumentRow = Partial<Record<(typeof INSTRUMENT_HEADERS)[number], string>>

export interface Meta {
  partner?: string
  date?: string
  country?: string
  remarks?: string
}

/** Metadata block as label/value rows. Omitted fields are left out entirely. */
export function metaRows(meta: Meta): string[][] {
  const rows: string[][] = []
  if (meta.partner !== undefined) rows.push(['Partner:', meta.partner])
  if (meta.date !== undefined) rows.push(['Date:', meta.date])
  if (meta.country !== undefined) rows.push(['Country:', meta.country])
  if (meta.remarks !== undefined) rows.push(['Remarks:', meta.remarks])
  return rows
}

export function rowsFor<H extends readonly string[]>(headers: H, rows: Partial<Record<H[number], string>>[]): string[][] {
  return rows.map((r) => headers.map((h) => (r as Record<string, string | undefined>)[h] ?? ''))
}

export interface SheetSpec {
  name: string
  /** Rows above the header row (metadata block, blank spacer rows). */
  above: string[][]
  headers: readonly string[]
  data: string[][]
}

export function buildWorkbook(sheets: SheetSpec[], intro: string[][] | null = [['INTRACOMP Policy Mapping Template']]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new()
  if (intro) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(intro), 'Intro')
  for (const s of sheets) {
    const aoa = [...s.above, [...s.headers], ...s.data]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), s.name)
  }
  return wb
}

export function workbookToArrayBuffer(wb: XLSX.WorkBook): ArrayBuffer {
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  return out
}
