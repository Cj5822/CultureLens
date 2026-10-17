/**
 * textFrequency.ts
 *
 * Word-frequency computation shared by the Text Analysis view (word clouds)
 * and the evaluation tooling (bar-chart stimuli and answer keys), so that both
 * formats in the word-cloud vs bar-chart comparison are built from exactly the
 * same counts.
 */

import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS } from '@/types/filters'
import type { Entity } from '@/types/entities'

export const STOP_WORDS = new Set([
  'a','about','above','after','again','against','all','also','an','and','any','are',
  'as','at','be','been','being','between','both','but','by','can','d','did','do',
  'does','doing','down','during','each','few','for','from','further','get','gets',
  'got','had','has','have','having','he','her','here','hers','herself','him',
  'himself','his','how','i','if','in','into','is','it','its','itself','just',
  'me','more','most','my','myself','no','nor','not','now','of','off','on','once',
  'only','or','other','our','ours','ourselves','out','over','own','s','same','she',
  'should','so','some','such','t','than','that','the','their','theirs','them',
  'themselves','then','there','these','they','this','those','through','to','too',
  'under','until','up','very','was','we','were','what','when','where','which',
  'while','who','whom','why','will','with','would','you','your','yours','yourself',
  'yourselves','may','might','shall','could',
  'must','within','across','including','without','towards','among',
  'upon','via','per','etc','eg','ie',
])

export const TEXT_FIELDS = [
  'description', 'itcApproach', 'relationToITC', 'mainObjectives',
  'additionalRemarks', 'equityAddressed', 'relevanceToINTRACOMP',
  'functionalRole',
] as const

export const MAX_WORDS_PER_CLOUD = 60

export interface FreqWord {
  text: string
  count: number
}

export function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^['-]+|['-]+$/g, ''))
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

/**
 * Counts word occurrences across the descriptive text fields of every entity
 * in `country`. Each distinct field value is counted once per entity: for
 * stakeholders the legacy `relationToITC` field is a copy of `itcApproach`,
 * and counting both would double-weight stakeholder ITC text relative to
 * instruments.
 */
export function buildFrequency(country: string, allEntities: Entity[]): Map<string, number> {
  const entities = filterEntities(allEntities, { ...DEFAULT_FILTERS, countries: [country] })
  const freq = new Map<string, number>()
  for (const e of entities) {
    const seen = new Set<string>()
    for (const field of TEXT_FIELDS) {
      const val = (e as unknown as Record<string, unknown>)[field]
      if (typeof val !== 'string' || !val || seen.has(val)) continue
      seen.add(val)
      for (const word of extractWords(val)) {
        freq.set(word, (freq.get(word) ?? 0) + 1)
      }
    }
  }
  return freq
}

/** Top-N words for a country, by count descending, ties broken alphabetically. */
export function buildFreqWords(country: string, allEntities: Entity[], limit = MAX_WORDS_PER_CLOUD): FreqWord[] {
  return [...buildFrequency(country, allEntities).entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text))
    .slice(0, limit)
}
