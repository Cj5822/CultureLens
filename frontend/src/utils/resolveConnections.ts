/**
 * resolveConnections.ts
 *
 * Rewrites each entity's `connections` array so raw text can refer to
 * another entity either by its generated ID (works today) or by *name* —
 * which is what actually ends up in that column, since the INTRACOMP Excel
 * template is filled in by hand before any entity IDs exist. Without this
 * step, `buildGraphData` (and the detail panel's "Connections" list) can
 * only ever match an ID that was typed in verbatim, which almost never
 * happens with real survey data — so the network graph renders as a pile
 * of disconnected nodes even when the underlying relationships are there.
 *
 * Matching strategy, cheapest first:
 *   1. The raw string is already a valid ID in this dataset — keep it.
 *   2. Exact match against a normalised entity name (diacritics, case and
 *      punctuation-insensitive).
 *   3. Substring match against a normalised entity name, in either
 *      direction (handles "Ministry of Education (see website)" matching
 *      an entity literally named "Ministry of Education", or someone
 *      abbreviating a long official name down to its key phrase).
 *
 * Ambiguous names (two entities normalising to the same string) are left
 * unresolved rather than guessed at — silently linking to the wrong entity
 * is worse than not linking at all.
 *
 * This runs over the *whole* currently-loaded dataset (all import batches
 * combined), so a connection typed in one country's file can resolve to an
 * entity that only exists in another country's file — e.g. every partner
 * naming "European Commission - DG EAC" as a connection all resolve to the
 * one such entity once all files are imported.
 */

import type { Entity } from '@/types/entities'

// ─── Name normalisation ─────────────────────────────────────────────────────

function normaliseName(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics (é -> e, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Names shorter than this are too generic to trust for substring matching
// (e.g. "EU", "UN") — they're still eligible for exact matches.
const MIN_SUBSTRING_LEN = 6

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns a new array with every entity's `connections` resolved to real
 * entity IDs wherever possible. Never mutates the input.
 */
export function resolveConnections(entities: Entity[]): Entity[] {
  if (entities.length === 0) return entities

  const idSet = new Set(entities.map((e) => e.id))

  // normalised name -> id, or null if the name is ambiguous (2+ entities share it)
  const byName = new Map<string, string | null>()
  for (const e of entities) {
    const key = normaliseName(e.name)
    if (!key) continue
    byName.set(key, byName.has(key) ? null : e.id)
  }

  // Precompute normalised names once for the substring-matching fallback.
  const normalisedEntities = entities
    .map((e) => ({ id: e.id, norm: normaliseName(e.name) }))
    .filter((e) => e.norm.length >= MIN_SUBSTRING_LEN)

  function resolveOne(raw: string, selfId: string): string | null {
    const trimmed = raw.trim()
    if (!trimmed) return null
    if (idSet.has(trimmed)) return trimmed === selfId ? null : trimmed

    const norm = normaliseName(trimmed)
    if (!norm) return null

    const exact = byName.get(norm)
    if (exact !== undefined) return exact === selfId ? null : exact

    let bestId: string | null = null
    let bestLen = 0
    for (const candidate of normalisedEntities) {
      if (candidate.id === selfId) continue
      if (norm.includes(candidate.norm) || candidate.norm.includes(norm)) {
        if (candidate.norm.length > bestLen) {
          bestLen = candidate.norm.length
          bestId = candidate.id
        }
      }
    }
    return bestId
  }

  return entities.map((entity) => {
    if (entity.connections.length === 0) return entity

    const resolved = new Set<string>()
    for (const raw of entity.connections) {
      const id = resolveOne(raw, entity.id)
      if (id) resolved.add(id)
    }

    const next = [...resolved]
    if (next.length === entity.connections.length && next.every((v, i) => v === entity.connections[i])) {
      return entity
    }
    return { ...entity, connections: next }
  })
}
