/**
 * dataService.ts
 *
 * Centralised data access layer for stakeholder and instrument datasets.
 *
 * Architecture note:
 * All raw data is accessed exclusively through the three internal constants
 * (_stakeholders, _instruments, _entities) defined below. To swap in real
 * Excel-derived data, replace those three assignments with SheetJS-parsed
 * results — no other change is required anywhere in the codebase.
 */

// ─── Data source ──────────────────────────────────────────────────────────────
// Data is now loaded at runtime via Excel import (see DataContext / excelParser).
// This service operates on empty arrays by default; callers that need live data
// should read from DataContext / FilterContext instead.

import type {
  Entity,
  Stakeholder,
  Instrument,
  ActorType,
  InstrumentType,
  ImplementationStatus,
  ThematicFocus,
  GeographicalScope,
} from '@/types/entities';

// ─── Internal dataset access ──────────────────────────────────────────────────

const _stakeholders: Stakeholder[] = [];
const _instruments: Instrument[] = [];
const _entities: Entity[] = [];

/** O(1) lookup map built once at module load time. */
const _entityMap = new Map<string, Entity>(_entities.map((e) => [e.id, e]));

// ─── Filter type definitions ──────────────────────────────────────────────────

export interface StakeholderFilters {
  country?: string;
  actorType?: ActorType;
  thematicFocus?: ThematicFocus;
  geographicalScope?: GeographicalScope;
}

export interface InstrumentFilters {
  country?: string;
  instrumentType?: InstrumentType;
  implementationStatus?: ImplementationStatus;
  thematicFocus?: ThematicFocus;
  geographicalScope?: GeographicalScope;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Utility type: keys of T whose value is an array. */
type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends unknown[] ? K : never;
}[keyof T];

/**
 * Generic helper for partial matching against array-based fields.
 * Constrains K to only keys whose value type is an array, and V to the
 * element type of that array.
 */
function filterByArrayField<T, K extends ArrayKeys<T>>(
  items: T[],
  field: K,
  value: T[K] extends (infer U)[] ? U : never,
): T[] {
  return items.filter((item) =>
    (item[field] as unknown[]).includes(value),
  );
}

/**
 * Reusable filtering helper for primitive (scalar) fields.
 * Returns true when value is undefined (no filter applied).
 */
function matchesFilter<T, K extends keyof T>(
  item: T,
  key: K,
  value: T[K] | undefined,
): boolean {
  if (value === undefined) return true;
  return item[key] === value;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns all stakeholders, optionally filtered.
 *
 * Future integration point: replace _stakeholders with SheetJS-parsed rows.
 */
export async function getStakeholders(
  filters?: StakeholderFilters,
): Promise<Stakeholder[]> {
  let results: Stakeholder[] = [..._stakeholders];

  if (!filters) return results;

  if (filters.country !== undefined) {
    results = results.filter((s) => matchesFilter(s, 'country', filters.country));
  }
  if (filters.actorType !== undefined) {
    results = results.filter((s) => matchesFilter(s, 'actorType', filters.actorType));
  }
  if (filters.thematicFocus !== undefined) {
    results = filterByArrayField(results, 'thematicFocus', filters.thematicFocus);
  }
  if (filters.geographicalScope !== undefined) {
    results = filterByArrayField(results, 'geographicalScope', filters.geographicalScope);
  }

  return results;
}

/**
 * Returns all instruments, optionally filtered.
 *
 * Future integration point: replace _instruments with SheetJS-parsed rows.
 */
export async function getInstruments(
  filters?: InstrumentFilters,
): Promise<Instrument[]> {
  let results: Instrument[] = [..._instruments];

  if (!filters) return results;

  if (filters.country !== undefined) {
    results = results.filter((i) => matchesFilter(i, 'country', filters.country));
  }
  if (filters.instrumentType !== undefined) {
    results = results.filter((i) => matchesFilter(i, 'instrumentType', filters.instrumentType));
  }
  if (filters.implementationStatus !== undefined) {
    results = results.filter((i) =>
      matchesFilter(i, 'implementationStatus', filters.implementationStatus),
    );
  }
  if (filters.thematicFocus !== undefined) {
    results = filterByArrayField(results, 'thematicFocus', filters.thematicFocus);
  }
  if (filters.geographicalScope !== undefined) {
    results = filterByArrayField(results, 'geographicalScope', filters.geographicalScope);
  }

  return results;
}

/**
 * Finds a single entity by ID, searching across both datasets.
 * Uses the pre-built lookup map for O(1) access.
 */
export async function getEntryById(id: string): Promise<Entity | undefined> {
  return _entityMap.get(id);
}

/**
 * Resolves all connections for a given entity ID.
 * Invalid or missing connection IDs are silently ignored.
 */
export async function getConnections(id: string): Promise<Entity[]> {
  const entry = _entityMap.get(id);
  if (!entry) return [];

  return entry.connections.reduce<Entity[]>((acc, connId) => {
    const related = _entityMap.get(connId);
    if (related !== undefined) acc.push(related);
    return acc;
  }, []);
}
