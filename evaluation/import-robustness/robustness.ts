// Import-robustness harness (report Sections 3.6 and 5.1).
//
// Generates test workbooks that reproduce layout variations of the INTRACOMP
// template with SheetJS, passes each through the production parser
// (frontend/src/utils/excelParser.ts) and compares the outcome with what a
// correct import should produce. Expected outcomes are declared below, before
// the parser is run; they come from the template specification, not from the
// parser's behaviour.
//
// Outputs (in import-robustness/):
//   workbooks/*.xlsx   the generated test workbooks
//   results.json       full observed outcome per variant and per field check
//   results.md         summary tables
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'
import { parseExcelFile, mergeEntities, type ParseResult } from '@/utils/excelParser'
import {
  STAKEHOLDER_HEADERS, INSTRUMENT_HEADERS, metaRows, rowsFor, buildWorkbook, workbookToArrayBuffer,
  type StakeholderRow, type InstrumentRow, type SheetSpec, type Meta,
} from '../lib/template'

const OUT = path.resolve('import-robustness')
const WB_DIR = path.join(OUT, 'workbooks')
mkdirSync(WB_DIR, { recursive: true })

// ─── Fixture data (fictitious organisations) ────────────────────────────────

const COUNTRY = 'Germany'

/** Four named stakeholders plus one row with an empty name, which should be
 *  skipped with exactly one warning. Category values deliberately use mixed
 *  case and multi-valued cells use different separators. */
const STAKEHOLDERS: StakeholderRow[] = [
  {
    Category: 'Stakeholders', 'Actor type': 'Government', 'Thematic focus': 'Education; Migration',
    Name: 'Federal Ministry for Learning (FML)', 'Geographical scope': 'national', 'Network role': 'Highly Influential',
    "Stakeholder's approach to and/or understanding of ITC": 'Funds intercultural teacher training.',
    'Recommended next steps': 'Engage', Connections: 'Northbridge Integration Office',
  },
  {
    Category: 'Stakeholders', 'Actor type': 'ADMINISTRATION', 'Thematic focus': 'Migration, Inter- and Transcultural Competences',
    Name: 'Northbridge Integration Office', 'Geographical scope': 'regional / national', 'Network role': 'BINDING',
    "Stakeholder's approach to and/or understanding of ITC": 'Runs integration courses for newcomers.',
    'Recommended next steps': 'monitor', Connections: 'Federal Ministry for Learning (FML); Intercultural Schools Act',
  },
  { Category: 'Stakeholders', 'Actor type': 'NGO', Name: '', 'Network role': 'advisory' },
  {
    Category: 'Stakeholders', 'Actor type': 'ngo', 'Thematic focus': 'Culture / Education',
    Name: 'Bridges for Belonging e.V.', 'Geographical scope': 'local', 'Network role': 'advisory',
    "Stakeholder's approach to and/or understanding of ITC": 'Community mentoring for families.',
    'Recommended next steps': 'contact',
  },
  {
    Category: 'Stakeholders', 'Actor type': 'Academia', 'Thematic focus': 'Inter- and Transculturality',
    Name: 'Institute for Plural Education', 'Geographical scope': 'cross-regional and national', 'Network role': 'symbolic',
    "Stakeholder's approach to and/or understanding of ITC": 'Researches transcultural pedagogy.',
    'Recommended next steps': 'no action',
  },
]

const INSTRUMENTS: InstrumentRow[] = [
  {
    Category: 'Instruments', 'Thematic focus': 'Education', 'Instrument type': 'Law',
    'Official name': 'Intercultural Schools Act', 'Geographical scope': 'national',
    'Responsible institution': 'Federal Ministry for Learning (FML)', 'Implementation status': 'Implementation',
    'Impact & influence(actual or expected) of instrument with regards to ITC': 'binding',
    'Main objectives of instrument': 'Requires intercultural content in teacher education.',
  },
  {
    Category: 'Instruments', 'Thematic focus': 'Migration; Culture', 'Instrument type': 'STRATEGY',
    'Official name': 'Welcome Strategy 2030', 'Geographical scope': 'regional',
    'Responsible institution': 'Northbridge Integration Office', 'Implementation status': 'draft',
    'Impact & influence(actual or expected) of instrument with regards to ITC': 'Advisory',
    'Main objectives of instrument': 'Coordinates regional reception services.',
  },
  {
    Category: 'Instruments', 'Thematic focus': 'Inter- and Transcultural Competences', 'Instrument type': 'guideline',
    'Official name': 'Guideline on Diverse Classrooms', 'Geographical scope': 'local and national',
    'Responsible institution': 'Institute for Plural Education', 'Implementation status': 'evaluation',
    'Impact & influence(actual or expected) of instrument with regards to ITC': 'symbolic',
    'Main objectives of instrument': 'Gives schools practical guidance on diversity.',
  },
]

const NAMED_STAKEHOLDERS = STAKEHOLDERS.filter((r) => r.Name).length // 4
const NAMED_INSTRUMENTS = INSTRUMENTS.filter((r) => r['Official name']).length // 3

const FULL_META: Meta = { partner: 'Test partner', date: '2026-05-18', country: COUNTRY, remarks: 'Generated test workbook' }

function stakeholderSheet(name: string, above: string[][]): SheetSpec {
  return { name, above, headers: STAKEHOLDER_HEADERS, data: rowsFor(STAKEHOLDER_HEADERS, STAKEHOLDERS) }
}
function instrumentSheet(name: string, above: string[][]): SheetSpec {
  return { name, above, headers: INSTRUMENT_HEADERS, data: rowsFor(INSTRUMENT_HEADERS, INSTRUMENTS) }
}

/** Current template: 4 metadata rows + blank spacer above the stakeholder
 *  header (header on row 6), 4 metadata rows above the instrument header
 *  (header on row 5). */
const STK_ABOVE = [...metaRows(FULL_META), []]
const INS_ABOVE = metaRows(FULL_META)

// ─── Variants and expected outcomes ─────────────────────────────────────────

interface Expected {
  error?: RegExp
  stakeholders?: number
  instruments?: number
  /** Every imported entity must carry this country. */
  country?: string
  warnings?: number
}

interface Variant {
  id: string
  label: string
  workbook: XLSX.WorkBook
  expected: Expected
  expectedText: string
}

const VARIANTS: Variant[] = [
  {
    id: 'v1-current-template',
    label: 'Current template (Intro sheet; stakeholder header on row 6, instrument header on row 5)',
    workbook: buildWorkbook([stakeholderSheet('Stakeholders', STK_ABOVE), instrumentSheet('Instruments', INS_ABOVE)]),
    expected: { stakeholders: NAMED_STAKEHOLDERS, instruments: NAMED_INSTRUMENTS, country: COUNTRY, warnings: 1 },
    expectedText: `${NAMED_STAKEHOLDERS} stakeholders, ${NAMED_INSTRUMENTS} instruments, country on all rows, 1 warning (empty-name row)`,
  },
  {
    id: 'v2-country-on-stakeholders-only',
    label: 'Country label only on Stakeholders sheet (Instruments "Country:" value blank)',
    workbook: buildWorkbook([
      stakeholderSheet('Stakeholders', STK_ABOVE),
      instrumentSheet('Instruments', metaRows({ ...FULL_META, country: '' })),
    ]),
    expected: { stakeholders: NAMED_STAKEHOLDERS, instruments: NAMED_INSTRUMENTS, country: COUNTRY, warnings: 1 },
    expectedText: `Instruments inherit the country; all ${NAMED_STAKEHOLDERS + NAMED_INSTRUMENTS} entities "${COUNTRY}"`,
  },
  {
    id: 'v3-sheet-name-variants',
    label: 'Sheet names in different case / singular ("STAKEHOLDER", "Instrument")',
    workbook: buildWorkbook([stakeholderSheet('STAKEHOLDER', STK_ABOVE), instrumentSheet('Instrument', INS_ABOVE)]),
    expected: { stakeholders: NAMED_STAKEHOLDERS, instruments: NAMED_INSTRUMENTS, country: COUNTRY, warnings: 1 },
    expectedText: 'Both sheets located; same result as the current template',
  },
  {
    id: 'v4-instruments-sheet-missing',
    label: 'Instruments sheet missing',
    workbook: buildWorkbook([stakeholderSheet('Stakeholders', STK_ABOVE)]),
    expected: { error: /instruments/i },
    expectedText: 'Explicit error naming the missing sheet',
  },
  {
    id: 'v5-short-stakeholder-metadata',
    label: 'Stakeholder metadata block one row shorter (no spacer row; header on row 5)',
    workbook: buildWorkbook([stakeholderSheet('Stakeholders', metaRows(FULL_META)), instrumentSheet('Instruments', INS_ABOVE)]),
    expected: { stakeholders: NAMED_STAKEHOLDERS, instruments: NAMED_INSTRUMENTS, country: COUNTRY, warnings: 1 },
    expectedText: `Header row found; ${NAMED_STAKEHOLDERS} stakeholders imported`,
  },
  {
    id: 'v6-legacy-headers-row-1',
    label: 'Legacy file: no Intro sheet, no metadata, headers on row 1',
    workbook: buildWorkbook([stakeholderSheet('Stakeholders', []), instrumentSheet('Instruments', [])], null),
    expected: { stakeholders: NAMED_STAKEHOLDERS, instruments: NAMED_INSTRUMENTS, warnings: 1 },
    expectedText: `All rows imported (${NAMED_STAKEHOLDERS} + ${NAMED_INSTRUMENTS} entities)`,
  },
]

// ─── Run ────────────────────────────────────────────────────────────────────

interface Observed {
  error?: string
  stakeholders?: number
  instruments?: number
  countries?: string[]
  warnings?: string[]
  result?: ParseResult
}

function run(wb: XLSX.WorkBook): Observed {
  try {
    const result = parseExcelFile(workbookToArrayBuffer(wb))
    const entities = mergeEntities(result)
    return {
      stakeholders: result.stakeholders.length,
      instruments: result.instruments.length,
      countries: [...new Set(entities.map((e) => e.country))],
      warnings: result.warnings,
      result,
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) }
  }
}

function evaluate(exp: Expected, obs: Observed): { pass: boolean; problems: string[] } {
  const problems: string[] = []
  if (exp.error) {
    if (!obs.error) problems.push('no error raised')
    else if (!exp.error.test(obs.error)) problems.push(`unexpected error: ${obs.error}`)
    return { pass: problems.length === 0, problems }
  }
  if (obs.error) return { pass: false, problems: [`error: ${obs.error}`] }
  if (exp.stakeholders !== undefined && obs.stakeholders !== exp.stakeholders)
    problems.push(`${obs.stakeholders} of ${exp.stakeholders} stakeholders imported`)
  if (exp.instruments !== undefined && obs.instruments !== exp.instruments)
    problems.push(`${obs.instruments} of ${exp.instruments} instruments imported`)
  if (exp.country !== undefined) {
    const total = (obs.stakeholders ?? 0) + (obs.instruments ?? 0)
    if (total > 0 && (obs.countries?.length !== 1 || obs.countries[0] !== exp.country))
      problems.push(`countries observed: ${JSON.stringify(obs.countries)}`)
  }
  if (exp.warnings !== undefined && obs.warnings?.length !== exp.warnings)
    problems.push(`${obs.warnings?.length} warning(s): ${obs.warnings?.map((w) => `"${w}"`).join('; ')}`)
  return { pass: problems.length === 0, problems }
}

function describe(obs: Observed, pass: boolean): string {
  if (obs.error) return `Error: "${obs.error}"`
  const total = (obs.stakeholders ?? 0) + (obs.instruments ?? 0)
  const parts = [
    `${obs.stakeholders} stakeholders, ${obs.instruments} instruments (${total} entities)`,
    `countries ${JSON.stringify(obs.countries)}`,
    `${obs.warnings?.length ?? 0} warning(s)${obs.warnings?.length ? ': ' + obs.warnings.map((w) => `"${w}"`).join('; ') : ''}`,
  ]
  return (pass ? 'As expected. ' : '') + parts.join('; ')
}

const variantResults = VARIANTS.map((v) => {
  const file = path.join(WB_DIR, `${v.id}.xlsx`)
  XLSX.writeFile(v.workbook, file)
  const obs = run(v.workbook)
  const { pass, problems } = evaluate(v.expected, obs)
  return { id: v.id, label: v.label, expected: v.expectedText, observed: describe(obs, pass), pass, problems, warnings: obs.warnings ?? [], error: obs.error }
})

// ─── Field-level checks on the current-template import ──────────────────────

const base = run(VARIANTS[0].workbook).result!
const byName = new Map(mergeEntities(base).map((e) => [e.name, e]))
const stk = (n: string) => byName.get(n) as Extract<ReturnType<typeof mergeEntities>[number], { category: 'stakeholders' }>
const ins = (n: string) => byName.get(n) as Extract<ReturnType<typeof mergeEntities>[number], { category: 'instruments' }>

// A separate workbook with values outside the enumerations. A tolerant
// importer should still import the rows, but should tell the user that a
// value was replaced by a default (Kandel et al.; design principle 4).
const OUT_OF_ENUM_STK: StakeholderRow = {
  Category: 'Stakeholders', 'Actor type': 'Public administration', Name: 'Office for Civic Participation',
  'Network role': 'very influential', 'Recommended next steps': 'follow up',
}
const OUT_OF_ENUM_INS: InstrumentRow = {
  Category: 'Instruments', 'Instrument type': 'regulation', 'Official name': 'Participation Regulation',
  'Implementation status': 'in progress',
  'Impact & influence(actual or expected) of instrument with regards to ITC': 'binding',
}
const coercionWb = buildWorkbook([
  { name: 'Stakeholders', above: STK_ABOVE, headers: STAKEHOLDER_HEADERS, data: rowsFor(STAKEHOLDER_HEADERS, [OUT_OF_ENUM_STK]) },
  { name: 'Instruments', above: INS_ABOVE, headers: INSTRUMENT_HEADERS, data: rowsFor(INSTRUMENT_HEADERS, [OUT_OF_ENUM_INS]) },
])
XLSX.writeFile(coercionWb, path.join(WB_DIR, 'f-out-of-enumeration-values.xlsx'))
const coercion = run(coercionWb)
const cStk = coercion.result?.stakeholders[0]
const cIns = coercion.result?.instruments[0]
const coercionWarnings = coercion.warnings ?? []

interface FieldCheck { check: string; expected: string; observed: string; pass: boolean }
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

const fieldChecks: FieldCheck[] = [
  {
    check: 'Mixed-case actor type ("Government", "ADMINISTRATION", "ngo")',
    expected: 'government, administration, NGO',
    observed: [stk('Federal Ministry for Learning (FML)')?.actorType, stk('Northbridge Integration Office')?.actorType, stk('Bridges for Belonging e.V.')?.actorType].join(', '),
    pass: eq([stk('Federal Ministry for Learning (FML)')?.actorType, stk('Northbridge Integration Office')?.actorType, stk('Bridges for Belonging e.V.')?.actorType], ['government', 'administration', 'NGO']),
  },
  {
    check: 'Mixed-case impact and instrument type ("BINDING", "Highly Influential", "Law", "STRATEGY")',
    expected: 'binding, highly influential, law, strategy',
    observed: [stk('Northbridge Integration Office')?.impactInfluence, stk('Federal Ministry for Learning (FML)')?.impactInfluence, ins('Intercultural Schools Act')?.instrumentType, ins('Welcome Strategy 2030')?.instrumentType].join(', '),
    pass: eq([stk('Northbridge Integration Office')?.impactInfluence, stk('Federal Ministry for Learning (FML)')?.impactInfluence, ins('Intercultural Schools Act')?.instrumentType, ins('Welcome Strategy 2030')?.instrumentType], ['binding', 'highly influential', 'law', 'strategy']),
  },
  {
    check: 'Multi-valued cells split on ";", "," and "/"',
    expected: '[Education, Migration]; [Migration, Inter- and Transcultural Competences]; [Culture, Education]',
    observed: [stk('Federal Ministry for Learning (FML)')?.thematicFocus, stk('Northbridge Integration Office')?.thematicFocus, stk('Bridges for Belonging e.V.')?.thematicFocus].map((v) => `[${v?.join(', ')}]`).join('; '),
    pass: eq([stk('Federal Ministry for Learning (FML)')?.thematicFocus, stk('Northbridge Integration Office')?.thematicFocus, stk('Bridges for Belonging e.V.')?.thematicFocus], [['Education', 'Migration'], ['Migration', 'Inter- and Transcultural Competences'], ['Culture', 'Education']]),
  },
  {
    check: 'Row with empty name skipped with a warning',
    expected: '1 warning mentioning "Name"',
    observed: base.warnings.map((w) => `"${w}"`).join('; ') || '(none)',
    pass: base.warnings.length === 1 && /name/i.test(base.warnings[0]),
  },
  {
    check: 'Connections split on ";" (cell with two references)',
    expected: '["Federal Ministry for Learning (FML)", "Intercultural Schools Act"]',
    observed: JSON.stringify(stk('Northbridge Integration Office')?.connections),
    pass: eq(stk('Northbridge Integration Office')?.connections, ['Federal Ministry for Learning (FML)', 'Intercultural Schools Act']),
  },
  {
    check: 'Out-of-enumeration values ("Public administration", "very influential", "follow up", "regulation", "in progress")',
    expected: 'Rows imported; a warning for each value replaced by a default',
    observed: coercion.error
      ? `Error: ${coercion.error}`
      : `Imported as actorType=${cStk?.actorType}, impact=${cStk?.impactInfluence}, nextSteps=${cStk?.recommendedNextSteps}, instrumentType=${cIns?.instrumentType}, status=${cIns?.implementationStatus}; ${coercionWarnings.length} warning(s)`,
    pass: !coercion.error && coercionWarnings.length >= 5,
  },
]

// ─── Write results ──────────────────────────────────────────────────────────

const generatedAt = new Date().toISOString()
writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ generatedAt, node: process.version, variants: variantResults, fieldChecks }, null, 2))

const esc = (s: string) => s.replace(/\|/g, '\\|')
const md = [
  '# Import-robustness results',
  '',
  `Generated ${generatedAt} by \`npm run robustness\` (Node ${process.version}) against \`frontend/src/utils/excelParser.ts\`.`,
  '',
  '## Template variants',
  '',
  '| Variant | Expected | Observed | Result |',
  '|---|---|---|---|',
  ...variantResults.map((r) => `| ${esc(r.label)} | ${esc(r.expected)} | ${esc(r.pass ? r.observed : r.problems.join('; '))} | ${r.pass ? 'Pass' : '**Fail**'} |`),
  '',
  '## Field-level checks',
  '',
  '| Check | Expected | Observed | Result |',
  '|---|---|---|---|',
  ...fieldChecks.map((c) => `| ${esc(c.check)} | ${esc(c.expected)} | ${esc(c.observed)} | ${c.pass ? 'Pass' : '**Fail**'} |`),
  '',
].join('\n')
writeFileSync(path.join(OUT, 'results.md'), md)
console.log(md)
