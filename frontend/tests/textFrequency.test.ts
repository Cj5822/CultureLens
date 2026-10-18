import { describe, it, expect } from 'vitest'
import { extractWords, buildFrequency, buildFreqWords, STOP_WORDS, MAX_WORDS_PER_CLOUD } from '@/utils/textFrequency'
import { stakeholder, instrument } from './helpers'

describe('extractWords', () => {
  it('lower-cases, removes stop words and words of two letters or fewer', () => {
    expect(extractWords('The Integration of migrants in EU schools')).toEqual(['integration', 'migrants', 'schools'])
  })
  it('keeps hyphenated words and trims edge punctuation', () => {
    expect(extractWords('"cross-regional" policy.')).toEqual(['cross-regional', 'policy'])
  })
  it('uses a 145-word stop list', () => expect(STOP_WORDS.size).toBe(145))

  // D8 (design audit): letters outside a-z split words. Expected to fail
  // until the tokeniser handles diacritics.
  it.fails('counts "Māori" as one word (D8)', () => expect(extractWords('Māori education')).toEqual(['maori', 'education']))
})

describe('buildFrequency', () => {
  it('counts only the chosen country', () => {
    const es = [stakeholder({ country: 'Germany', itcApproach: 'integration' }), stakeholder({ country: 'Italy', itcApproach: 'integration' })]
    expect(buildFrequency('Germany', es).get('integration')).toBe(1)
  })
  it('counts each distinct field value once per entity (D7 fix)', () => {
    const s = stakeholder({ itcApproach: 'integration courses', relationToITC: 'integration courses' })
    expect(buildFrequency('Germany', [s]).get('integration')).toBe(1)
  })
  it('reads instrument fields too', () => {
    expect(buildFrequency('Germany', [instrument({ mainObjectives: 'teacher training' })]).get('teacher')).toBe(1)
  })
})

describe('buildFreqWords', () => {
  it('sorts by count, then alphabetically, and keeps at most 60 words', () => {
    const text = Array.from({ length: 70 }, (_, i) => `word${String.fromCharCode(97 + (i % 26))}${String.fromCharCode(97 + Math.floor(i / 26))}`).join(' ')
    const words = buildFreqWords('Germany', [stakeholder({ itcApproach: `${text} zebra zebra`, description: 'apple apple' })])
    expect(words).toHaveLength(MAX_WORDS_PER_CLOUD)
    expect(words.slice(0, 2).map((w) => w.text)).toEqual(['apple', 'zebra'])
  })
})
