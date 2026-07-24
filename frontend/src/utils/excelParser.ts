/**
 * excelParser.ts
 *
 * Parses the INTRACOMP Policy Mapping Template Excel workbook into typed
 * Entity arrays.
 *
 * Workbook structure (as of the 2026-07 template):
 *   Sheet 1 - "Intro"        (ignored)
 *   Sheet 2 - "Stakeholders" - metadata rows 1-5, headers row 6, data row 7+
 *   Sheet 3 - "Instruments"  - metadata rows 1-4, headers row 5, data row 6+
 *
 * Metadata rows: Partner (B1), Date (B2), Country (B3), Remarks (B4).
 * The Country value is applied to every entity in that sheet.
 */

import * as XLSX from 'xlsx';
import type {
  Stakeholder,
  Instrument,
  Entity,
  ActorType,
  InstrumentType,
  ImpactInfluence,
  ImplementationStatus,
  RecommendedNextSteps,
  ThematicFocus,
  GeographicalScope,
} from '@/types/entities';

// Country -> coordinates lookup
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  'finland':        { lat: 60.1699, lng: 24.9384 },
  'norway':         { lat: 59.9139, lng: 10.7522 },
  'greece':         { lat: 37.9838, lng: 23.7275 },
  'italy':          { lat: 41.9028, lng: 12.4964 },
  'germany':        { lat: 52.5200, lng: 13.4050 },
  'serbia':         { lat: 44.8176, lng: 20.4633 },
  'belgium':        { lat: 50.8503, lng: 4.3517  },
  'france':         { lat: 48.8566, lng: 2.3522  },
  'austria':        { lat: 48.2082, lng: 16.3738 },
  'netherlands':    { lat: 52.3676, lng: 4.9041  },
  'spain':          { lat: 40.4168, lng: -3.7038 },
  'sweden':         { lat: 59.3293, lng: 18.0686 },
  'poland':         { lat: 52.2297, lng: 21.0122 },
  'portugal':       { lat: 38.7223, lng: -9.1393 },
  'uk':             { lat: 51.5074, lng: -0.1278 },
  'united kingdom': { lat: 51.5074, lng: -0.1278 },
  'switzerland':    { lat: 47.3769, lng: 8.5417  },
  'eu':             { lat: 50.8503, lng: 4.3517  },
  'new zealand':    { lat: -41.2865, lng: 174.7762 },
};

function coordsForCountry(country: string): { lat: number; lng: number } {
  return COUNTRY_COORDS[country.toLowerCase().trim()] ?? { lat: 0, lng: 0 };
}

// Enum coercion helpers

function normalise(s: unknown): string {
  return String(s ?? '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function coerceEnum<T extends string>(
  raw: unknown,
  valid: readonly T[],
  fallback: T,
): T {
  const n = normalise(raw);
  return (valid.find((v) => v.toLowerCase() === n) as T) ?? fallback;
}

function coerceEnumList<T extends string>(
  raw: unknown,
  valid: readonly T[],
): T[] {
  if (raw == null || String(raw).trim() === '') return [];
  return String(raw)
    .split(/[;,/]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const found = valid.find((v) => v.toLowerCase() === s.toLowerCase());
      return found ?? null;
    })
    .filter((v): v is T => v !== null);
}

const ACTOR_TYPES: ActorType[] = [
  'academia', 'civil society', 'government', 'NGO',
  'administration', 'private sector', 'other',
];
const INSTRUMENT_TYPES: InstrumentType[] = [
  'law', 'guideline', 'petition', 'initiative', 'strategy', 'other',
];
const IMPACT_VALUES: ImpactInfluence[] = [
  'symbolic', 'advisory', 'binding', 'highly influential',
];
const STATUS_VALUES: ImplementationStatus[] = [
  'draft', 'development', 'implementation', 'evaluation', 'archive',
];
const NEXT_STEPS: RecommendedNextSteps[] = [
  'engage', 'contact', 'monitor', 'no action',
];
const THEMATIC_FOCUS: ThematicFocus[] = [
  'Inter- and Transcultural Competences',
  'Inter- and Transculturality',
  'Education',
  'Culture',
  'Migration',
  'Climate',
  'Other',
];
const GEO_SCOPE: GeographicalScope[] = [
  'local', 'regional', 'cross-regional', 'national',
  'local and regional', 'local and cross-regional',
  'regional and national', 'cross-regional and national',
  'local and national', 'all of the above',
];

// Column-header normaliser
function normHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Build a row-accessor from a worksheet.
 * @param dataRow  0-indexed row number to use as the HEADER row
 */
function buildRowAccessor(sheet: XLSX.WorkSheet, dataRow: number): {
  getCell: (row: Record<string, unknown>, ...keys: string[]) => unknown;
  rows: Record<string, unknown>[];
} {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false,
    range: dataRow,
  });

  const headerMap = new Map<string, string>();
  if (rows.length > 0) {
    for (const key of Object.keys(rows[0])) {
      headerMap.set(normHeader(key), key);
    }
  }

  function getCell(row: Record<string, unknown>, ...keys: string[]): unknown {
    for (const k of keys) {
      const actual = headerMap.get(normHeader(k));
      if (actual !== undefined && row[actual] != null && String(row[actual]).trim() !== '') {
        return row[actual];
      }
    }
    return '';
  }

  return { getCell, rows };
}

// Metadata extraction
function readCell(sheet: XLSX.WorkSheet, address: string): string {
  const cell = sheet[address];
  if (!cell) return '';
  return String(cell.v ?? '').trim();
}

// Next-steps value detection
function looksLikeNextStep(raw: unknown): boolean {
  const n = normalise(raw);
  return NEXT_STEPS.some((v) => v.toLowerCase() === n);
}

// ID generator
let _idCounter = 0;

function nextId(prefix: 'STK' | 'INS'): string {
  return `${prefix}-IMP-${String(++_idCounter).padStart(3, '0')}`;
}

// Parse results
export interface ParseResult {
  stakeholders: Stakeholder[];
  instruments: Instrument[];
  warnings: string[];
  meta: { partner: string; country: string; date: string };
}

// Stakeholder sheet parser
// Headers (row 6 in new template):
//   A=Category  B=Actor type  C=Thematic focus  D=Name  E=Link
//   F=Geographical scope  G=Functional role  H=Resources  I=Network role
//   J=Relevance  K=Impact & influence (freetext)
//   L=Stakeholder approach to ITC  M=Equity  N=Intended audience
//   O=Language(s)  P=Connections  Q=Spalte1 (unused)
//
// Note: col N often contains a next-steps value instead of intended audience.

function parseStakeholderRow(
  _row: Record<string, unknown>,
  getCell: (...keys: string[]) => unknown,
  rowIndex: number,
  country: string,
  warnings: string[],
): Stakeholder | null {
  const name = String(getCell('Name', 'name') ?? '').trim();
  if (!name) {
    warnings.push(`Stakeholders row ${rowIndex}: skipped - "Name" is empty`);
    return null;
  }

  const { lat, lng } = coordsForCountry(country);

  const thematic = coerceEnumList(getCell('Thematic focus', 'Thematic Focus'), THEMATIC_FOCUS);
  const geoScope = coerceEnumList(getCell('Geographical scope', 'Geographical Scope'), GEO_SCOPE);

  const languagesRaw = String(
    getCell(
      'Language(s)  of  stakeholder communication',
      'Language(s) of stakeholder communication',
      'Languages', 'Language(s)',
    ) ?? '',
  );
  const languages = languagesRaw.split(/[;,/]/).map((s) => s.replace(/\xa0/g, '').trim()).filter(Boolean);

  const connectionsRaw = String(
    getCell(
      'Connection to other stakeholders and/or instruments within this mapping document (if applicable)',
      'Connection to other stakeholders and/or instruments within this mapping document',
      'Connection to other stakeholders and or instruments',
      'Connections',
    ) ?? '',
  );
  const connections = connectionsRaw.split(/[;,]/).map((s) => s.trim()).filter(Boolean);

  // col N: "Intended audience" - users often put next-steps here instead
  const rawN = getCell('Intended audience and/or beneficiaries of policy stakeholder?', 'Intended audience');
  let intendedAudience = String(rawN ?? '').trim();
  let recommendedNextSteps: RecommendedNextSteps = 'monitor';

  if (looksLikeNextStep(rawN)) {
    recommendedNextSteps = coerceEnum(rawN, NEXT_STEPS, 'monitor');
    intendedAudience = '';
  }

  const explicitNextStep = getCell('Recommended next steps', 'Next steps');
  if (String(explicitNextStep).trim()) {
    recommendedNextSteps = coerceEnum(explicitNextStep, NEXT_STEPS, 'monitor');
  }

  const itcApproach = String(
    getCell(
      "Stakeholder's approach to and/or understanding of ITC",
      'Relation to ITC',
    ) ?? '',
  ).trim();

  return {
    id: nextId('STK'),
    category: 'stakeholders',
    name: name.slice(0, 200),
    actorType: coerceEnum(getCell('Actor type', 'Actor Type'), ACTOR_TYPES, 'other'),
    thematicFocus: thematic,
    geographicalScope: geoScope,
    link: String(getCell('Link towards web presence ', 'Link towards web presence', 'Link') ?? '').trim().slice(0, 500),
    functionalRole: String(getCell(' Functional role', 'Functional role', 'Functional Role') ?? '').trim(),
    description: String(getCell('Resources') ?? '').trim(),
    relevanceToINTRACOMP: String(
      getCell('Relevance of stakeholder within the thematic context of INTRACOMP', 'Relevance') ?? '',
    ).trim(),
    impactInfluence: coerceEnum(getCell('Network role', 'Network Role'), IMPACT_VALUES, 'advisory'),
    additionalRemarks: String(
      getCell(
        'Impact & influence(actual or expected) of stakeholder with regards to ITC',
        'Impact & influence', 'Impact and influence',
      ) ?? '',
    ).trim(),
    itcApproach,
    relationToITC: itcApproach,
    equityAddressed: String(
      getCell(
        'Does this stakeholder address issues of equity, marginalisation, or social inclusion, and, if so, the',
        'Does this stakeholder address issues of equity, marginalisation, or social inclusion',
        '(How) does this stakeholder address issues of equity, marginalisation, or social inclusion?',
        'Equity',
      ) ?? '',
    ).trim(),
    intendedAudience,
    languages,
    recommendedNextSteps,
    connections,
    country,
    lat,
    lng,
  };
}

// Instrument sheet parser
// Headers (row 5 in new template):
//   A=Category  B=Thematic focus  C=Instrument type  D=Official name  E=Link
//   F=Geographical scope  G=Responsible institution  H=Main objectives
//   I=Implementation status  J=Relevance  K=Impact & influence
//   L=Instrument approach to ITC  M=Equity  N=Intended audience
//   O=Language(s)  P=Connections
//
// Note: col O (Language) sometimes contains a next-steps value.

function parseInstrumentRow(
  _row: Record<string, unknown>,
  getCell: (...keys: string[]) => unknown,
  rowIndex: number,
  country: string,
  warnings: string[],
): Instrument | null {
  const name = String(getCell('Official name ', 'Official name', 'Name', 'name') ?? '').trim();
  if (!name) {
    warnings.push(`Instruments row ${rowIndex}: skipped - "Official name" is empty`);
    return null;
  }

  const { lat, lng } = coordsForCountry(country);

  const thematic = coerceEnumList(getCell('Thematic focus', 'Thematic Focus'), THEMATIC_FOCUS);
  const geoScope = coerceEnumList(getCell('Geographical scope', 'Geographical Scope'), GEO_SCOPE);

  // col O: Language - users sometimes put next-steps here
  const rawO = getCell('Language(s)  of  stakeholder communication', 'Language(s) of stakeholder communication', 'Languages');
  let languagesRaw = String(rawO ?? '').trim();
  let recommendedNextSteps: RecommendedNextSteps = 'monitor';

  if (looksLikeNextStep(rawO)) {
    recommendedNextSteps = coerceEnum(rawO, NEXT_STEPS, 'monitor');
    languagesRaw = '';
  }

  const languages = languagesRaw.split(/[;,/]/).map((s) => s.replace(/\xa0/g, '').trim()).filter(Boolean);

  const explicitNextStep = getCell('Recommended next steps', 'Next steps');
  if (String(explicitNextStep).trim()) {
    recommendedNextSteps = coerceEnum(explicitNextStep, NEXT_STEPS, 'monitor');
  }

  const connectionsRaw = String(
    getCell(
      'Connection to other stakeholders and/or instruments within this mapping document',
      'Connection to other stakeholders and or instruments',
      'Connections',
    ) ?? '',
  );
  const connections = connectionsRaw.split(/[;,]/).map((s) => s.trim()).filter(Boolean);

  const itcApproach = String(
    getCell(
      "Instrument's approach to and/or understanding of ITC",
      "Stakeholder's approach to and/or understanding of ITC",
      'Relation to ITC',
    ) ?? '',
  ).trim();

  return {
    id: nextId('INS'),
    category: 'instruments',
    name: name.slice(0, 200),
    instrumentType: coerceEnum(getCell('Instrument type', 'Instrument Type'), INSTRUMENT_TYPES, 'other'),
    thematicFocus: thematic,
    geographicalScope: geoScope,
    link: String(getCell('Link towards web presence', 'Link') ?? '').trim().slice(0, 500),
    responsibleInstitution: String(getCell('Responsible institution', 'Responsible Institution') ?? '').trim(),
    mainObjectives: String(getCell('Main objectives of instrument', 'Main objectives') ?? '').trim(),
    implementationStatus: coerceEnum(
      getCell('Implementation status', 'Implementation Status'),
      STATUS_VALUES,
      'development',
    ),
    relevanceToINTRACOMP: String(
      getCell('Relevance of instrument within the thematic context of INTRACOMP', 'Relevance') ?? '',
    ).trim(),
    impactInfluence: coerceEnum(
      getCell(
        'Impact & influence(actual or expected) of instrument with regards to ITC',
        'Impact & influence', 'Impact and influence', 'Impact',
      ),
      IMPACT_VALUES,
      'advisory',
    ),
    itcApproach,
    equityAddressed: String(
      getCell(
        'Does this instrument address issues of equity, marginalisation, or social inclus',
        'Does this instrument address issues of equity, marginalisation, or social inclusion',
        '(How) does this instrument address issues of equity, marginalisation, or social inclusion?',
        'Equity',
      ) ?? '',
    ).trim(),
    intendedAudience: String(
      getCell(
        'Intended audience and/or beneficiaries of instrument?',
        'Intended audience and/or beneficiaries of policy stakeholders?',
        'Intended audience',
      ) ?? '',
    ).trim(),
    languages,
    recommendedNextSteps,
    connections,
    additionalRemarks: '',
    country,
    lat,
    lng,
  };
}

// Public API

/**
 * Parse an INTRACOMP Policy Mapping Template Excel file (ArrayBuffer).
 * Supports both the current format (Intro sheet + metadata rows) and legacy
 * files (headers on row 1).
 */
export function parseExcelFile(buffer: ArrayBuffer): ParseResult {
  _idCounter = 0;
  const warnings: string[] = [];

  const wb = XLSX.read(buffer, { type: 'array' });
  const sheetNames = wb.SheetNames;

  function findSheet(candidates: string[]): XLSX.WorkSheet | null {
    for (const c of candidates) {
      const match = sheetNames.find((n) => n.toLowerCase().trim() === c.toLowerCase());
      if (match) return wb.Sheets[match];
    }
    return null;
  }

  const hasIntro = sheetNames.some((n) => n.toLowerCase().trim() === 'intro');

  const stakeholderSheet =
    findSheet(['stakeholders', 'stakeholder']) ??
    (hasIntro ? null : (sheetNames[0] ? wb.Sheets[sheetNames[0]] : null));

  const instrumentSheet =
    findSheet(['instruments', 'instrument']) ??
    (hasIntro ? null : (sheetNames[1] ? wb.Sheets[sheetNames[1]] : null));

  if (!stakeholderSheet) throw new Error('Could not find a "Stakeholders" sheet in the workbook.');
  if (!instrumentSheet)  throw new Error('Could not find an "Instruments" sheet in the workbook.');

  // Detect header row - scan candidate rows; the header row is the first whose
  // first cell value doesn't look like metadata ("Partner:", "Date:", etc.).
  function detectHeaderRow(sheet: XLSX.WorkSheet, candidates: number[]): number {
    for (const rowIdx of candidates) {
      const sample = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: '',
        raw: false,
        range: rowIdx,
      });
      if (sample.length === 0) continue;
      const firstKey = Object.keys(sample[0])[0] ?? '';
      const lk = firstKey.toLowerCase().trim();
      if (lk && !lk.startsWith('partner') && !lk.startsWith('date') &&
          !lk.startsWith('country') && !lk.startsWith('remark') && lk !== '') {
        return rowIdx;
      }
    }
    return 0;
  }

  const stkHeaderRow = detectHeaderRow(stakeholderSheet, [5, 4, 3, 2, 1, 0]);
  const insHeaderRow = detectHeaderRow(instrumentSheet,  [4, 3, 2, 1, 0]);

  // Extract file-level metadata
  let fileCountry = '';
  let filePartner = '';
  let fileDate    = '';

  function extractMeta(sheet: XLSX.WorkSheet, maxRow: number) {
    for (let r = 1; r <= maxRow; r++) {
      const label = readCell(sheet, `A${r}`).toLowerCase();
      const value = readCell(sheet, `B${r}`);
      if (label.startsWith('country')) fileCountry = value;
      if (label.startsWith('partner')) filePartner = value;
      if (label.startsWith('date'))    fileDate    = value;
    }
  }

  extractMeta(stakeholderSheet, stkHeaderRow + 1);
  if (!fileCountry) extractMeta(instrumentSheet, insHeaderRow + 1);

  // Parse stakeholders
  const { getCell: getStkCell, rows: stkRows } = buildRowAccessor(stakeholderSheet, stkHeaderRow);
  const stakeholders: Stakeholder[] = [];

  for (let i = 0; i < stkRows.length; i++) {
    const row = stkRows[i];
    const parsed = parseStakeholderRow(
      row, (...keys) => getStkCell(row, ...keys),
      stkHeaderRow + i + 2, fileCountry, warnings,
    );
    if (parsed) stakeholders.push(parsed);
  }

  // Parse instruments
  const { getCell: getInsCell, rows: insRows } = buildRowAccessor(instrumentSheet, insHeaderRow);
  const instruments: Instrument[] = [];

  for (let i = 0; i < insRows.length; i++) {
    const row = insRows[i];
    const parsed = parseInstrumentRow(
      row, (...keys) => getInsCell(row, ...keys),
      insHeaderRow + i + 2, fileCountry, warnings,
    );
    if (parsed) instruments.push(parsed);
  }

  return { stakeholders, instruments, warnings, meta: { partner: filePartner, country: fileCountry, date: fileDate } };
}

/** Merge parsed entities into a single flat array. */
export function mergeEntities(result: ParseResult): Entity[] {
  return [...result.stakeholders, ...result.instruments];
}
