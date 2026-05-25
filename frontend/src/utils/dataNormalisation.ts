/**
 * dataNormalization.ts
 *
 * Preprocessing utilities that normalize inconsistent Excel-derived data
 * into clean, visualization-ready structures.
 *
 * All functions are pure — no mutation of input objects.
 */

import type {
  Entity,
  Stakeholder,
  Instrument,
  ImpactInfluence,
  ImplementationStatus,
  GeographicalScope,
  ThematicFocus,
} from '@/types/entities';

// ─── Coordinate lookup ────────────────────────────────────────────────────────

interface Coordinates {
  readonly lat: number;
  readonly lng: number;
}

/**
 * Maps partner regions and common country names to realistic coordinates.
 * Future entries can be appended here as the dataset grows.
 */
const COUNTRY_COORDINATES = {
  // INTRACOMP partner regions
  Finland:              { lat: 60.1699, lng: 24.9384 }, // Helsinki
  Norway:               { lat: 59.9139, lng: 10.7522 }, // Oslo
  Italy:                { lat: 41.9028, lng: 12.4964 }, // Rome
  Greece:               { lat: 37.9838, lng: 23.7275 }, // Athens
  Germany:              { lat: 52.52,   lng: 13.405  }, // Berlin
  Serbia:               { lat: 44.8176, lng: 20.4633 }, // Belgrade
  'New Zealand':        { lat: -36.8485, lng: 174.7633 }, // Auckland
  'New Zealand & Pacific': { lat: -36.8485, lng: 174.7633 }, // Auckland
  EU:                   { lat: 50.8503, lng: 4.3517  }, // Brussels
  Belgium:              { lat: 50.8503, lng: 4.3517  }, // Brussels (used for EU entries)
  // Supplementary common countries
  France:               { lat: 48.5973, lng: 7.7526  }, // Strasbourg (Council of Europe)
  Austria:              { lat: 48.2082, lng: 16.3738 }, // Vienna
  Netherlands:          { lat: 52.3676, lng: 4.9041  }, // Amsterdam
  Sweden:               { lat: 59.3293, lng: 18.0686 }, // Stockholm
  Poland:               { lat: 52.2297, lng: 21.0122 }, // Warsaw
  Portugal:             { lat: 38.7169, lng: -9.1399 }, // Lisbon
  Spain:                { lat: 40.4168, lng: -3.7038 }, // Madrid
} as const satisfies Record<string, Coordinates>;

/** Fallback for countries not present in the lookup map. */
const FALLBACK_COORDINATES: Coordinates = { lat: 48.8566, lng: 2.3522 }; // Paris

// ─── Enum-normalisation maps ──────────────────────────────────────────────────

const IMPLEMENTATION_STATUS_MAP: Record<string, ImplementationStatus> = {
  draft:          'draft',
  development:    'development',
  implementation: 'implementation',
  evaluation:     'evaluation',
  archive:        'archive',
  archived:       'archive',
  completed:      'archive',
  active:         'implementation',
  pilot:          'development',
  planned:        'draft',
};

const IMPACT_INFLUENCE_MAP: Record<string, ImpactInfluence> = {
  symbolic:           'symbolic',
  advisory:           'advisory',
  binding:            'binding',
  'highly influential': 'highly influential',
  'high':             'highly influential',
  'highly':           'highly influential',
  informational:      'symbolic',
  none:               'symbolic',
  moderate:           'advisory',
  strong:             'binding',
  legal:              'binding',
  mandatory:          'binding',
};

// ─── Protected compound phrases ───────────────────────────────────────────────
// These GeographicalScope values contain "and" but must not be split on it.
// When parseMultiSelect encounters " and " inside a token, it checks this set
// before deciding whether to split further.

const PROTECTED_AND_PHRASES = new Set<string>([
  'local and regional',
  'local and cross-regional',
  'regional and national',
  'cross-regional and national',
  'local and national',
  'all of the above',
] satisfies GeographicalScope[]);

// ─── Public utilities ─────────────────────────────────────────────────────────

/**
 * Splits a raw multi-select string into a clean, de-duplicated array.
 *
 * Delimiters handled: `;`  `,`  `/`  `|`  and ` and ` (with phrase protection).
 * Whitespace is trimmed; empty tokens are dropped.
 *
 * @example
 * parseMultiSelect("local and regional; national")
 * // → ["local and regional", "national"]
 *
 * parseMultiSelect("Education, Culture | Migration")
 * // → ["Education", "Culture", "Migration"]
 */
export function parseMultiSelect(
  rawString: string | null | undefined,
): string[] {
  if (!rawString || rawString.trim() === '') return [];

  // Step 1: split on unambiguous delimiters first
  const segments = rawString
    .split(/[;,/|]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Step 2: for each segment, conditionally split on " and "
  // Only split when the segment is NOT a protected compound phrase.
  const tokens: string[] = [];
  for (const segment of segments) {
    const lower = segment.toLowerCase();
    if (segment.includes(' and ') && !PROTECTED_AND_PHRASES.has(lower as GeographicalScope)) {
      // Split on " and " — this segment is a list joined by "and"
      const parts = segment.split(/ and /i).map((p) => p.trim()).filter(Boolean);
      tokens.push(...parts);
    } else {
      tokens.push(segment);
    }
  }

  // Step 3: de-duplicate while preserving order
  return [...new Set(tokens)];
}

/**
 * Normalises a raw implementation status string to the ImplementationStatus union.
 * Falls back to `"draft"` for unknown or empty values.
 */
export function normalizeImplementationStatus(
  raw: string | null | undefined,
): ImplementationStatus {
  if (!raw) return 'draft';
  const key = raw.trim().toLowerCase();
  return IMPLEMENTATION_STATUS_MAP[key] ?? 'draft';
}

/**
 * Normalises a raw impact/influence string to the ImpactInfluence union.
 * Handles partial phrasing (e.g. "highly" → "highly influential").
 * Falls back to `"symbolic"` for unknown or empty values.
 */
export function normalizeImpactInfluence(
  raw: string | null | undefined,
): ImpactInfluence {
  if (!raw) return 'symbolic';
  const key = raw.trim().toLowerCase();

  // Direct map lookup
  if (key in IMPACT_INFLUENCE_MAP) return IMPACT_INFLUENCE_MAP[key]!;

  // Partial-phrase matching for cases like "highly influential (advisory)"
  if (key.includes('highly')) return 'highly influential';
  if (key.includes('binding') || key.includes('legal') || key.includes('mandatory')) {
    return 'binding';
  }
  if (key.includes('advisory') || key.includes('recommend')) return 'advisory';

  return 'symbolic';
}

/**
 * Returns a copy of the entry with valid `lat` and `lng` coordinates.
 * Maps the entry's `country` field against the coordinate lookup table.
 * Does not mutate the original object.
 */
export function assignCoordinates<T extends { country: string; lat: number; lng: number }>(
  entry: T,
): T {
  const coords =
    (COUNTRY_COORDINATES as Record<string, Coordinates>)[entry.country] ??
    FALLBACK_COORDINATES;

  return { ...entry, lat: coords.lat, lng: coords.lng };
}

// ─── High-level preprocessor ──────────────────────────────────────────────────

/**
 * Normalises all variant fields of a Stakeholder, returning a clean copy.
 */
function normalizeStakeholder(entry: Stakeholder): Stakeholder {
  return assignCoordinates({
    ...entry,
    thematicFocus: parseMultiSelect(
      entry.thematicFocus.join(';'),
    ) as ThematicFocus[],
    geographicalScope: parseMultiSelect(
      entry.geographicalScope.join(';'),
    ) as GeographicalScope[],
    impactInfluence: normalizeImpactInfluence(entry.impactInfluence),
  });
}

/**
 * Normalises all variant fields of an Instrument, returning a clean copy.
 */
function normalizeInstrument(entry: Instrument): Instrument {
  return assignCoordinates({
    ...entry,
    thematicFocus: parseMultiSelect(
      entry.thematicFocus.join(';'),
    ) as ThematicFocus[],
    geographicalScope: parseMultiSelect(
      entry.geographicalScope.join(';'),
    ) as GeographicalScope[],
    impactInfluence: normalizeImpactInfluence(entry.impactInfluence),
    implementationStatus: normalizeImplementationStatus(entry.implementationStatus),
  });
}

/**
 * High-level preprocessing entry point.
 * Normalizes multi-select fields, implementation status, impact influence,
 * and coordinates. Preserves the discriminated union type.
 *
 * Typical use: call this on each raw row after SheetJS parsing before
 * passing data to the service layer.
 */
export function normalizeEntity(entry: Entity): Entity {
  if (entry.category === 'stakeholders') {
    return normalizeStakeholder(entry);
  }
  return normalizeInstrument(entry);
}
