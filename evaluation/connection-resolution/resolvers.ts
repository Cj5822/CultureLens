// Resolver variants compared on the held-out suite.
//
//   exactId      the original design: link only a literal generated ID
//   implemented  the application's resolver, imported unchanged
//   prototype    the refinement described in report Section 5.2,
//                implemented here from that description
//
// Each variant resolves one raw reference declared by `source` against the
// full entity set and returns the linked entity ID or null.
import { resolveConnections } from '@/utils/resolveConnections'
import type { Entity } from '@/types/entities'

export type Resolver = (raw: string, source: Entity, entities: Entity[]) => string | null

export const exactId: Resolver = (raw, source, entities) => {
  const t = raw.trim()
  return t !== source.id && entities.some((e) => e.id === t) ? t : null
}

/** Runs the production resolver with this single reference as the source
 *  entity's only connection. */
export const implemented: Resolver = (raw, source, entities) => {
  const input = entities.map((e) => (e.id === source.id ? { ...e, connections: [raw] } : { ...e, connections: [] }))
  const out = resolveConnections(input).find((e) => e.id === source.id)!
  return out.connections[0] ?? null
}

// Same normalisation as resolveConnections.ts.
function normaliseName(raw: string): string {
  return raw.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}
const MIN_SUBSTRING_LEN = 6
const containsWords = (haystack: string, needle: string) => ` ${haystack} `.includes(` ${needle} `)
const isLongAcronym = (raw: string) => /^[A-Z]{4,}$/.test(raw.trim())

/** Prototype refinement (Section 5.2): the same cascade as the implemented
 *  resolver, except that containment is tested on whole-word boundaries, and
 *  the "query inside candidate" direction is accepted only when the query is
 *  an upper-case acronym of four or more letters. */
export const prototype: Resolver = (raw, source, entities) => {
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (entities.some((e) => e.id === trimmed)) return trimmed === source.id ? null : trimmed

  const q = normaliseName(trimmed)
  if (!q) return null
  const exact = entities.filter((e) => normaliseName(e.name) === q)
  if (exact.length === 1) return exact[0].id === source.id ? null : exact[0].id
  if (exact.length > 1) return null

  let best: string | null = null
  let bestLen = 0
  for (const e of entities) {
    if (e.id === source.id) continue
    const c = normaliseName(e.name)
    if (c.length < MIN_SUBSTRING_LEN) continue
    const candidateInQuery = containsWords(q, c)
    const queryInCandidate = isLongAcronym(trimmed) && containsWords(c, q)
    if ((candidateInQuery || queryInCandidate) && c.length > bestLen) {
      bestLen = c.length
      best = e.id
    }
  }
  return best
}

export const RESOLVERS: { key: string; label: string; fn: Resolver }[] = [
  { key: 'exact-id', label: 'Original exact-ID matching', fn: exactId },
  { key: 'implemented', label: 'Implemented name-based resolver', fn: implemented },
  { key: 'prototype', label: 'Prototype: word-boundary + acronym rule', fn: prototype },
]
