// Synthetic dataset generator for the scalability benchmark (report Sections
// 3.6 and 5.4).
//
// Produces `n` fictitious entities whose shape follows the German extraction
// described in Section 5.3: roughly 58% stakeholders and 42% instruments
// (26 : 19), public administration as the most common actor type, instruments
// skewed towards guidelines and strategies, ITC-specific themes rare, and
// about 36% of entities declaring one to three connections written as names
// or prose rather than IDs. Connection text uses the reference forms observed
// in partner files (exact name, name plus annotation, acronym, prose mention,
// generic phrase), so connection resolution exercises every branch of the
// resolver. All randomness comes from a seeded PRNG, so a given (n, seed)
// always yields the same dataset.
import type {
  Entity, Stakeholder, Instrument, ActorType, InstrumentType, ImpactInfluence,
  ImplementationStatus, RecommendedNextSteps, ThematicFocus, GeographicalScope,
} from '@/types/entities'

export const COUNTRIES = ['EU', 'Finland', 'Germany', 'Greece', 'Italy', 'New Zealand', 'Norway', 'Serbia']
export const STAKEHOLDER_SHARE = 26 / 45
export const CONNECTED_SHARE = 0.36

// ─── PRNG ───────────────────────────────────────────────────────────────────

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Rng = () => number
const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)]
function weighted<T>(rng: Rng, table: readonly (readonly [T, number])[]): T {
  const total = table.reduce((s, [, w]) => s + w, 0)
  let r = rng() * total
  for (const [v, w] of table) { r -= w; if (r <= 0) return v }
  return table[table.length - 1][0]
}
const intBetween = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1))

// ─── Attribute distributions ────────────────────────────────────────────────

const ACTOR_TYPES: readonly (readonly [ActorType, number])[] = [
  ['administration', 10], ['government', 4], ['NGO', 4], ['academia', 3],
  ['civil society', 3], ['private sector', 1], ['other', 1],
]
const INSTRUMENT_TYPES: readonly (readonly [InstrumentType, number])[] = [
  ['guideline', 8], ['strategy', 4], ['initiative', 3], ['law', 2], ['other', 2],
]
const THEMES: readonly (readonly [ThematicFocus, number])[] = [
  ['Education', 12], ['Migration', 9], ['Culture', 5], ['Other', 5],
  ['Inter- and Transcultural Competences', 2], ['Inter- and Transculturality', 1], ['Climate', 1],
]
const SCOPES: readonly (readonly [GeographicalScope, number])[] = [
  ['national', 10], ['regional', 4], ['cross-regional and national', 4], ['local', 3],
  ['regional and national', 2], ['local and regional', 1], ['all of the above', 1],
]
const IMPACT: readonly (readonly [ImpactInfluence, number])[] = [
  ['advisory', 4], ['binding', 3], ['symbolic', 2], ['highly influential', 2],
]
const STATUS: readonly (readonly [ImplementationStatus, number])[] = [
  ['implementation', 6], ['development', 3], ['evaluation', 2], ['draft', 1], ['archive', 1],
]
const NEXT: readonly (readonly [RecommendedNextSteps, number])[] = [
  ['monitor', 5], ['engage', 3], ['contact', 3], ['no action', 1],
]

// ─── Names ──────────────────────────────────────────────────────────────────

const STK_HEADS = ['Ministry', 'Office', 'Agency', 'Council', 'Foundation', 'Institute', 'Network', 'Association', 'Centre', 'Commission', 'Federation', 'Board']
const INS_HEADS = ['Act', 'Strategy', 'Guideline', 'Programme', 'Action Plan', 'Framework', 'Charter', 'Initiative', 'Regulation', 'Curriculum']
const TOPICS = ['Education', 'Migration', 'Culture', 'Integration', 'Youth', 'Research', 'Inclusion', 'Languages', 'Diversity', 'Citizenship', 'Teacher Training', 'Refugee Support', 'Equal Treatment', 'Adult Learning', 'Heritage']
const SYL = ['va', 'lo', 'ren', 'ka', 'mi', 'tor', 'sel', 'an', 'dra', 'vik', 'hol', 'mer', 'tan', 'sor', 'el', 'ber', 'lin', 'ost', 'gar', 'nea']

function placeName(rng: Rng): string {
  const k = intBetween(rng, 2, 3)
  let s = ''
  for (let i = 0; i < k; i++) s += pick(rng, SYL)
  return s[0].toUpperCase() + s.slice(1)
}

function acronym(words: string): string {
  return words.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join('')
}

// ─── Free text ──────────────────────────────────────────────────────────────

const DOMAIN_WORDS = [
  'integration', 'education', 'intercultural', 'migrants', 'policy', 'national', 'teachers', 'schools',
  'language', 'support', 'inclusion', 'training', 'diversity', 'students', 'refugees', 'community',
  'equity', 'programme', 'curriculum', 'competences', 'cultural', 'social', 'regional', 'federal',
  'funding', 'research', 'youth', 'citizenship', 'participation', 'minority', 'heritage', 'mobility',
  'learning', 'public', 'services', 'guidance', 'framework', 'strategy', 'networks', 'dialogue',
]
const FILLER = ['and', 'the', 'for', 'with', 'of', 'to', 'in', 'across', 'through', 'by']

/** Zipf-like vocabulary: domain words first (most frequent), then synthetic
 *  words, so word-frequency tables have a realistic long tail. */
function buildVocabulary(rng: Rng, size = 600): string[] {
  const vocab = [...DOMAIN_WORDS]
  const seen = new Set(vocab)
  while (vocab.length < size) {
    const w = (pick(rng, SYL) + pick(rng, SYL) + pick(rng, SYL)).toLowerCase()
    if (!seen.has(w)) { seen.add(w); vocab.push(w) }
  }
  return vocab
}

function sentence(rng: Rng, vocab: string[], minWords: number, maxWords: number): string {
  const n = intBetween(rng, minWords, maxWords)
  const words: string[] = []
  for (let i = 0; i < n; i++) {
    if (rng() < 0.3) { words.push(pick(rng, FILLER)); continue }
    // Zipf(s=1) rank sampling via inverse transform on harmonic weights
    const r = Math.floor(Math.pow(vocab.length + 1, rng())) - 1
    words.push(vocab[Math.min(vocab.length - 1, Math.max(0, r))])
  }
  const s = words.join(' ')
  return s[0].toUpperCase() + s.slice(1) + '.'
}

// ─── Generator ──────────────────────────────────────────────────────────────

export interface GeneratedDataset {
  entities: Entity[]
  /** Number of entities that declare at least one connection. */
  connected: number
  references: number
}

export function generateDataset(n: number, seed = 20260518): GeneratedDataset {
  const rng = mulberry32(seed + n)
  const vocab = buildVocabulary(rng)
  const nStk = Math.round(n * STAKEHOLDER_SHARE)
  const usedNames = new Set<string>()

  const entities: Entity[] = []
  const acronyms = new Map<string, string>() // entity id -> acronym, when the name carries one

  for (let i = 0; i < n; i++) {
    const isStk = i < nStk
    const country = COUNTRIES[i % COUNTRIES.length]
    let name = ''
    let acr = ''
    for (let tries = 0; tries < 50; tries++) {
      const topic = pick(rng, TOPICS)
      const place = placeName(rng)
      const base = isStk
        ? `${pick(rng, STK_HEADS)} for ${topic} ${place}`
        : `${place} ${topic} ${pick(rng, INS_HEADS)}`
      if (usedNames.has(base.toLowerCase())) continue
      usedNames.add(base.toLowerCase())
      acr = isStk && rng() < 0.3 ? acronym(base) : ''
      name = acr ? `${base} (${acr})` : base
      break
    }
    if (!name) name = `Entity ${i}` // vanishingly unlikely

    const themes = [...new Set(Array.from({ length: intBetween(rng, 1, 2) }, () => weighted(rng, THEMES)))]
    const common = {
      name,
      country,
      lat: 0,
      lng: 0,
      thematicFocus: themes,
      geographicalScope: [weighted(rng, SCOPES)],
      link: '',
      impactInfluence: weighted(rng, IMPACT),
      connections: [] as string[],
      recommendedNextSteps: weighted(rng, NEXT),
      additionalRemarks: '',
      languages: [],
      equityAddressed: rng() < 0.85 ? sentence(rng, vocab, 8, 20) : '',
      intendedAudience: sentence(rng, vocab, 3, 8),
      itcApproach: sentence(rng, vocab, 10, 30),
    }
    if (isStk) {
      const e: Stakeholder = {
        ...common,
        id: `STK-GEN-${String(i + 1).padStart(5, '0')}`,
        category: 'stakeholders',
        actorType: weighted(rng, ACTOR_TYPES),
        functionalRole: sentence(rng, vocab, 6, 15),
        description: sentence(rng, vocab, 8, 20),
        relevanceToINTRACOMP: sentence(rng, vocab, 6, 15),
        relationToITC: common.itcApproach,
      }
      entities.push(e)
    } else {
      const e: Instrument = {
        ...common,
        id: `INS-GEN-${String(i + 1).padStart(5, '0')}`,
        category: 'instruments',
        instrumentType: weighted(rng, INSTRUMENT_TYPES),
        responsibleInstitution: '',
        mainObjectives: sentence(rng, vocab, 10, 25),
        implementationStatus: weighted(rng, STATUS),
        relevanceToINTRACOMP: sentence(rng, vocab, 6, 15),
      }
      entities.push(e)
    }
    if (acr) acronyms.set(entities[i].id, acr)
  }

  // Connections: ~36% of entities declare 1-3 references, mostly to entities
  // in the same country, written in the forms partners actually use.
  const byCountry = new Map<string, Entity[]>()
  for (const e of entities) byCountry.set(e.country, [...(byCountry.get(e.country) ?? []), e])
  for (const e of entities) {
    if (rng() >= CONNECTED_SHARE) continue
    const k = intBetween(rng, 1, 3)
    for (let j = 0; j < k; j++) {
      const pool = rng() < 0.9 ? byCountry.get(e.country)! : entities
      const target = pick(rng, pool)
      if (target.id === e.id) continue
      const acr = acronyms.get(target.id)
      const plain = target.name.replace(/\s*\([^)]*\)\s*$/, '')
      const form = weighted(rng, [['exact', 40], ['annotated', 25], ['acronym', acr ? 15 : 0], ['prose', 10], ['generic', 10]] as const)
      const text =
        form === 'exact' ? target.name
          : form === 'annotated' ? `${plain} (see ${target.category === 'stakeholders' ? 'stakeholder' : 'instrument'} sheet)`
            : form === 'acronym' ? acr!
              : form === 'prose' ? `other measures coordinated by ${plain}`
                : pick(rng, ['regional partners', 'local schools', 'civil society organisations', 'Education', 'Research'])
      e.connections.push(text)
    }
  }

  const connected = entities.filter((e) => e.connections.length > 0).length
  const references = entities.reduce((s, e) => s + e.connections.length, 0)
  return { entities, connected, references }
}
