/**
 * excelParser.ts
 *
 * Parses the INTRACOMP mapping Excel workbook (2 sheets: stakeholders /
 * instruments) into typed Entity arrays.
 *
 * Column header matching is case-insensitive and whitespace-tolerant so that
 * minor formatting differences across partner files don't break the import.
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

// ─── Country → coordinates lookup ─────────────────────────────────────────────

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  'finland':     { lat: 60.1699, lng: 24.9384 },
  'norway':      { lat: 59.9139, lng: 10.7522 },
  'greece':      { lat: 37.9838, lng: 23.7275 },
  'italy':       { lat: 41.9028, lng: 12.4964 },
  'germany':     { lat: 52.5200, lng: 13.4050 },
  'serbia':      { lat: 44.8176, lng: 20.4633 },
  'belgium':     { lat: 50.8503, lng: 4.3517  },
  'france':      { lat: 48.8566, lng: 2.3522  },
  'austria':     { lat: 48.2082, lng: 16.3738 },
  'netherlands': { lat: 52.3676, lng: 4.9041  },
  'spain':       { lat: 40.4168, lng: -3.7038 },
  'sweden':      { lat: 59.3293, lng: 18.0686 },
  'poland':      { lat: 52.2297, lng: 21.0122 },
  'portugal':    { lat: 38.7223, lng: -9.1393 },
  'uk':          { lat: 51.5074, lng: -0.1278 },
  'switzerland': { lat: 47.3769, lng: 8.5417  },
  'eu':          { lat: 50.8503, lng: 4.3517  },
  'new zealand': { lat: -41.2865, lng: 174.7762 },
};

function coordsForCountry(country: string): { lat: number; lng: number } {
  return COUNTRY_COORDS[country.toLowerCase().trim()] ?? { lat: 0, lng: 0 };
}

// ─── Enum coercion helpers ─────────────────────────────────────────────────────

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

// ─── Column-header normaliser ──────────────────────────────────────────────────

/** Normalise a header string for fuzzy matching. */
function normHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Build a map of { normalisedHeader → column letter/index } from a worksheet
 * header row and return a row-accessor function.
 */
function buildRowAccessor(sheet: XLSX.WorkSheet): {
  getCell: (row: Record<string, unknown>, ...keys: string[]) => unknown;
  rows: Record<string, unknown>[];
} {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false,
  });

  // Build a normalised header → actual header map from the first row
  const headerMap = new Map<string, string>();
  if (rows.length > 0) {
    for (const key of Object.keys(rows[0])) {
      headerMap.set(normHeader(key), key);
    }
  }

  /**
   * Look up a cell value by trying several candidate strings in order.
   * Returns the first non-empty match, or ''.
   */
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

// ─── ID generator ──────────────────────────────────────────────────────────────

let _idCounter = 0;

function nextId(prefix: 'STK' | 'INS'): string {
  return `${prefix}-IMP-${String(++_idCounter).padStart(3, '0')}`;
}

// ─── Parse results ─────────────────────────────────────────────────────────────

export interface ParseResult {
  stakeholders: Stakeholder[];
  instruments: Instrument[];
  warnings: string[];
}

// ─── Stakeholder sheet parser ──────────────────────────────────────────────────

function parseStakeholderRow(
  row: Record<string, unknown>,
  getCell: (...keys: string[]) => unknown,
  rowIndex: number,
  warnings: string[],
): Stakeholder | null {
  const name = String(getCell('Name', 'name') ?? '').trim();
  if (!name) {
    warnings.push(`Stakeholders row ${rowIndex}: skipped — "Name" is empty`);
    return null;
  }

  const country = String(getCell('Country', 'country') ?? '').trim();
  const { lat, lng } = coordsForCountry(country);

  const thematic = coerceEnumList(
    getCell('Thematic focus', 'Thematic Focus', 'thematic focus'),
    THEMATIC_FOCUS,
  );
  const geoScope = coerceEnumList(
    getCell('Geographical scope', 'Geographical Scope', 'geographical scope'),
    GEO_SCOPE,
  );

  const languagesRaw = String(
    getCell("Language(s) of stakeholder communication", "Languages", "Language(s)", "languages") ?? '',
  );
  const languages = languagesRaw.split(/[;,/]/).map((s) => s.trim()).filter(Boolean);

  const connectionsRaw = String(
    getCell(
      'Connection to other stakeholders/and or instruments',
      'Connection to other stakeholders and or instruments',
      'Connections',
      'connections',
    ) ?? '',
  );
  const connections = connectionsRaw.split(/[;,/]/).map((s) => s.trim()).filter(Boolean);

  return {
    id: nextId('STK'),
    category: 'stakeholders',
    name: name.slice(0, 100),
    actorType: coerceEnum(
      getCell('Actor type', 'Actor Type', 'actorType'),
      ACTOR_TYPES,
      'other',
    ),
    thematicFocus: thematic,
    geographicalScope: geoScope,
    link: String(getCell('Link towards web presence', 'Link', 'link') ?? '').slice(0, 100),
    description: String(
      getCell(
        'Description of the mapped policy stakeholder within their broader context',
        'Description',
        'description',
      ) ?? '',
    ).slice(0, 500),
    relevanceToINTRACOMP: String(
      getCell(
        'Relevance of the stakeholder within the thematic context of INTRACOMP',
        'Relevance',
        'relevance',
      ) ?? '',
    ).slice(0, 200),
    impactInfluence: coerceEnum(
      getCell(
        'Impact & influence (actual or expected) of stakeholder with regards to ITC',
        'Impact & influence',
        'Impact and influence',
        'Impact',
        'impact',
      ),
      IMPACT_VALUES,
      'advisory',
    ),
    relationToITC: String(
      getCell(
        "Description of policy stakeholder's relation to ITC",
        'Relation to ITC',
        'relationToITC',
      ) ?? '',
    ).slice(0, 500),
    equityAddressed: String(
      getCell(
        '(How) does this stakeholder address issues of equity, marginalisation, or social inclusion?',
        'Equity',
        'equity',
      ) ?? '',
    ).slice(0, 500),
    intendedAudience: String(
      getCell(
        'Intended audience and/or beneficiaries of policy stakeholders?',
        'Intended audience',
        'intendedAudience',
      ) ?? '',
    ).slice(0, 100),
    languages,
    recommendedNextSteps: coerceEnum(
      getCell('Recommended next steps', 'Next steps', 'recommendedNextSteps'),
      NEXT_STEPS,
      'monitor',
    ),
    connections,
    additionalRemarks: String(
      getCell('Additional remarks', 'additionalRemarks') ?? '',
    ).slice(0, 500),
    country,
    lat,
    lng,
  };
}

// ─── Instrument sheet parser ───────────────────────────────────────────────────

function parseInstrumentRow(
  row: Record<string, unknown>,
  getCell: (...keys: string[]) => unknown,
  rowIndex: number,
  warnings: string[],
): Instrument | null {
  const name = String(getCell('Official name', 'Name', 'name') ?? '').trim();
  if (!name) {
    warnings.push(`Instruments row ${rowIndex}: skipped — "Official name" is empty`);
    return null;
  }

  const country = String(getCell('Country', 'country') ?? '').trim();
  const { lat, lng } = coordsForCountry(country);

  const thematic = coerceEnumList(
    getCell('Thematic focus', 'Thematic Focus', 'thematic focus'),
    THEMATIC_FOCUS,
  );
  const geoScope = coerceEnumList(
    getCell('Geographical scope', 'Geographical Scope', 'geographical scope'),
    GEO_SCOPE,
  );

  const languagesRaw = String(
    getCell("Language(s) of stakeholder communication", "Languages", "Language(s)", "languages") ?? '',
  );
  const languages = languagesRaw.split(/[;,/]/).map((s) => s.trim()).filter(Boolean);

  const connectionsRaw = String(
    getCell(
      'Connection to other stakeholders/and or instruments',
      'Connection to other stakeholders and or instruments',
      'Connections',
      'connections',
    ) ?? '',
  );
  const connections = connectionsRaw.split(/[;,/]/).map((s) => s.trim()).filter(Boolean);

  return {
    id: nextId('INS'),
    category: 'instruments',
    name: name.slice(0, 50),
    instrumentType: coerceEnum(
      getCell('Instrument type', 'Instrument Type', 'instrumentType'),
      INSTRUMENT_TYPES,
      'other',
    ),
    thematicFocus: thematic,
    geographicalScope: geoScope,
    link: String(getCell('Link towards web presence', 'Link', 'link') ?? '').slice(0, 100),
    responsibleInstitution: String(
      getCell('Responsible institution', 'Responsible Institution', 'responsibleInstitution') ?? '',
    ).slice(0, 100),
    mainObjectives: String(
      getCell('Main objectives of the instrument', 'Main objectives', 'mainObjectives') ?? '',
    ).slice(0, 500),
    implementationStatus: coerceEnum(
      getCell('Implementation status', 'Implementation Status', 'implementationStatus'),
      STATUS_VALUES,
      'development',
    ),
    relevanceToINTRACOMP: String(
      getCell(
        'Relevance of the instrument within the thematic context of INTRACOMP',
        'Relevance',
        'relevance',
      ) ?? '',
    ).slice(0, 200),
    impactInfluence: coerceEnum(
      getCell(
        'Impact & influence (actual or expected) of instrument with regards to ITC',
        'Impact & influence',
        'Impact and influence',
        'Impact',
        'impact',
      ),
      IMPACT_VALUES,
      'advisory',
    ),
    equityAddressed: String(
      getCell(
        '(How) does this instrument address issues of equity, marginalisation, or social inclusion?',
        'Equity',
        'equity',
      ) ?? '',
    ).slice(0, 500),
    intendedAudience: String(
      getCell(
        'Intended audience and/or beneficiaries of policy stakeholders?',
        'Intended audience',
        'intendedAudience',
      ) ?? '',
    ).slice(0, 100),
    languages,
    recommendedNextSteps: coerceEnum(
      getCell('Recommended next steps', 'Next steps', 'recommendedNextSteps'),
      NEXT_STEPS,
      'monitor',
    ),
    connections,
    additionalRemarks: String(
      getCell('Additional remarks', 'additionalRemarks') ?? '',
    ).slice(0, 500),
    country,
    lat,
    lng,
  };
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Parse an INTRACOMP mapping Excel file (ArrayBuffer) into typed entities.
 * Tries sheet names case-insensitively; falls back to the first two sheets.
 */
export function parseExcelFile(buffer: ArrayBuffer): ParseResult {
  _idCounter = 0; // reset for deterministic IDs per import
  const warnings: string[] = [];

  const wb = XLSX.read(buffer, { type: 'array' });

  // ── Locate sheets ────────────────────────────────────────────────────────────
  const sheetNames = wb.SheetNames;

  function findSheet(candidates: string[]): XLSX.WorkSheet | null {
    for (const c of candidates) {
      const match = sheetNames.find(
        (n) => n.toLowerCase().trim() === c.toLowerCase(),
      );
      if (match) return wb.Sheets[match];
    }
    return null;
  }

  const stakeholderSheet =
    findSheet(['stakeholders', 'stakeholder']) ??
    (sheetNames[0] ? wb.Sheets[sheetNames[0]] : null);

  const instrumentSheet =
    findSheet(['instruments', 'instrument']) ??
    (sheetNames[1] ? wb.Sheets[sheetNames[1]] : null);

  if (!stakeholderSheet) {
    throw new Error('Could not find a "Stakeholders" sheet in the workbook.');
  }
  if (!instrumentSheet) {
    throw new Error('Could not find an "Instruments" sheet in the workbook.');
  }

  // ── Parse stakeholders ───────────────────────────────────────────────────────
  const { getCell: getStkCell, rows: stkRows } = buildRowAccessor(stakeholderSheet);
  const stakeholders: Stakeholder[] = [];

  for (let i = 0; i < stkRows.length; i++) {
    const row = stkRows[i];
    const parsed = parseStakeholderRow(row, (...keys) => getStkCell(row, ...keys), i + 2, warnings);
    if (parsed) stakeholders.push(parsed);
  }

  // ── Parse instruments ────────────────────────────────────────────────────────
  const { getCell: getInsCell, rows: insRows } = buildRowAccessor(instrumentSheet);
  const instruments: Instrument[] = [];

  for (let i = 0; i < insRows.length; i++) {
    const row = insRows[i];
    const parsed = parseInstrumentRow(row, (...keys) => getInsCell(row, ...keys), i + 2, warnings);
    if (parsed) instruments.push(parsed);
  }

  return { stakeholders, instruments, warnings };
}

/** Merge parsed entities into a single flat array. */
export function mergeEntities(result: ParseResult): Entity[] {
  return [...result.stakeholders, ...result.instruments];
}
