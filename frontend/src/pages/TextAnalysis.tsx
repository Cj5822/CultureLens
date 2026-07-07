import { useMemo, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { scaleSqrt } from 'd3-scale'
import cloud from 'd3-cloud'
import { mockEntities } from '@/data/mockData'
import { filterEntities } from '@/utils/filterEntities'
import type { EntityFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'

// Stop words
const STOP_WORDS = new Set([
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
  'yourselves','been','has','have','may','might','shall','could','would','should',
  'must','within','across','including','without','between','towards','among',
  'upon','via','per','etc','eg','ie',
])

const COLOR_A = '#2563eb'
const COLOR_B = '#ea580c'

const ALL_COUNTRIES = [...new Set(mockEntities.map(e => e.country))].sort()

const TEXT_FIELDS = [
  'description', 'relationToITC', 'mainObjectives',
  'additionalRemarks', 'equityAddressed', 'relevanceToINTRACOMP',
] as const

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^['-]+|['-]+$/g, ''))
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

function buildFrequency(country: string): Map<string, number> {
  const filters: EntityFilters = { ...DEFAULT_FILTERS, countries: [country] }
  const entities = filterEntities(mockEntities, filters)
  const freq = new Map<string, number>()
  for (const e of entities) {
    for (const field of TEXT_FIELDS) {
      const val = (e as unknown as Record<string, unknown>)[field]
      if (typeof val === 'string' && val) {
        for (const word of extractWords(val)) {
          freq.set(word, (freq.get(word) ?? 0) + 1)
        }
      }
    }
  }
  return freq
}

interface FreqWord {
  text: string
  count: number
  size?: number
  x?: number
  y?: number
  rotate?: number
}

const MAX_WORDS_PER_CLOUD = 60

function buildFreqWords(country: string): FreqWord[] {
  const freq = buildFrequency(country)
  return [...freq.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_WORDS_PER_CLOUD)
}

// A single word cloud for one country. `maxCount` is shared across both
// clouds so word sizes stay on the same scale and remain comparable
// side by side.
function WordCloud({
  words,
  width,
  height,
  color,
  maxCount,
}: {
  words: FreqWord[]
  width: number
  height: number
  color: string
  maxCount: number
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || words.length === 0 || width <= 0 || height <= 0) return
    const sizeScale = scaleSqrt().domain([0, maxCount]).range([10, Math.min(width, height) * 0.16]).clamp(true)

    const layout = cloud()
      .size([width, height])
      .words(words.map(w => ({ ...w, size: sizeScale(w.count) })))
      .padding(3)
      .rotate(() => (Math.random() > 0.75 ? (Math.random() > 0.5 ? 90 : -90) : 0))
      .font('sans-serif')
      .fontSize((d: { size?: number }) => d.size ?? 12)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('end', (placed: any[]) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodes = (g as any).selectAll('text').data(placed as FreqWord[]).enter().append('text')
        nodes.style('font-family', 'sans-serif')
        nodes.style('font-weight', (d: FreqWord) => (d.count > maxCount * 0.3 ? '700' : '500'))
        nodes.style('fill', color)
        nodes.style('cursor', 'default')
        nodes.attr('text-anchor', 'middle')
        nodes.attr('font-size', (d: FreqWord) => String(d.size ?? 12) + 'px')
        nodes.attr('transform', (d: FreqWord) => 'translate(' + String(d.x) + ',' + String(d.y) + ') rotate(' + String(d.rotate) + ')')
        nodes.text((d: FreqWord) => d.text ?? '')
        nodes.append('title').text((d: FreqWord) => '"' + d.text + '" — ' + String(d.count) + ' occurrence' + (d.count === 1 ? '' : 's'))
      })

    layout.start()
    return () => { layout.stop() }
  }, [words, width, height, color, maxCount])

  return <svg ref={svgRef} width={width} height={height} />
}

export function TextAnalysis() {
  const [countryA, setCountryA] = useState<string>('')
  const [countryB, setCountryB] = useState<string>('')

  const cloudRowRef = useRef<HTMLDivElement>(null)
  const [rowSize, setRowSize] = useState({ width: 700, height: 420 })

  useEffect(() => {
    if (!cloudRowRef.current) return
    const ro = new ResizeObserver(entries => {
      const e = entries[0]
      if (e) setRowSize({ width: Math.floor(e.contentRect.width), height: Math.floor(e.contentRect.height) })
    })
    ro.observe(cloudRowRef.current)
    return () => ro.disconnect()
  }, [])

  // Each cloud gets half the row width, minus the divider between them.
  const paneWidth = Math.max(0, Math.floor((rowSize.width - 1) / 2))
  const paneHeight = rowSize.height

  const ready = Boolean(countryA && countryB && countryA !== countryB)

  const wordsA = useMemo(
    () => (ready ? buildFreqWords(countryA) : []),
    [ready, countryA],
  )
  const wordsB = useMemo(
    () => (ready ? buildFreqWords(countryB) : []),
    [ready, countryB],
  )
  // Shared scale domain so a word's size means the same thing in both clouds.
  const maxCount = useMemo(
    () => Math.max(1, ...wordsA.map(w => w.count), ...wordsB.map(w => w.count)),
    [wordsA, wordsB],
  )

  const entityCountA = useMemo(
    () => countryA ? filterEntities(mockEntities, { ...DEFAULT_FILTERS, countries: [countryA] }).length : 0,
    [countryA],
  )
  const entityCountB = useMemo(
    () => countryB ? filterEntities(mockEntities, { ...DEFAULT_FILTERS, countries: [countryB] }).length : 0,
    [countryB],
  )

  return (
    <div className="cl-text-analysis-page">
      <div className="cl-ta-country-row">
        <div className="cl-ta-country-card" style={{ '--card-accent': COLOR_A } as React.CSSProperties}>
          <label className="cl-ta-country-label" style={{ color: COLOR_A }}>Country A</label>
          <select
            className="cl-ta-country-select"
            value={countryA}
            onChange={e => { const v = e.target.value; setCountryA(v); if (v === countryB) setCountryB('') }}
          >
            <option value="">Select a country...</option>
            {ALL_COUNTRIES.map(c => (
              <option key={c} value={c} disabled={c === countryB}>{c}</option>
            ))}
          </select>
          {countryA && <span className="cl-ta-country-count">{entityCountA} entries</span>}
        </div>
        <div className="cl-ta-vs-badge">VS</div>
        <div className="cl-ta-country-card" style={{ '--card-accent': COLOR_B } as React.CSSProperties}>
          <label className="cl-ta-country-label" style={{ color: COLOR_B }}>Country B</label>
          <select
            className="cl-ta-country-select"
            value={countryB}
            onChange={e => { const v = e.target.value; setCountryB(v); if (v === countryA) setCountryA('') }}
          >
            <option value="">Select a country...</option>
            {ALL_COUNTRIES.map(c => (
              <option key={c} value={c} disabled={c === countryA}>{c}</option>
            ))}
          </select>
          {countryB && <span className="cl-ta-country-count">{entityCountB} entries</span>}
        </div>
      </div>

      {!ready && (
        <div className="cl-ta-empty-prompt">
          <span className="cl-ta-empty-prompt__icon">☁</span>
          <p className="cl-ta-empty-prompt__title">Select two countries to compare word clouds</p>
          <p className="cl-ta-empty-prompt__sub">
            Each country gets its own word cloud, sized on the same scale, so you can compare
            the most frequent words in <strong style={{ color: COLOR_A }}>Country A</strong>{' '}
            side by side with <strong style={{ color: COLOR_B }}>Country B</strong>.
          </p>
        </div>
      )}

      {ready && (
        <div className="cl-chart-card cl-ta-main-card">
          <div ref={cloudRowRef} className="cl-ta-clouds-row">
            <div className="cl-ta-cloud-col">
              <div className="cl-ta-cloud-col__label" style={{ color: COLOR_A }}>{countryA}</div>
              <div className="cl-ta-cloud-container">
                {wordsA.length === 0
                  ? <div className="cl-chart-empty">Not enough text data for {countryA}.</div>
                  : <WordCloud words={wordsA} width={paneWidth} height={paneHeight} color={COLOR_A} maxCount={maxCount} />
                }
              </div>
            </div>
            <div className="cl-ta-clouds-divider" />
            <div className="cl-ta-cloud-col">
              <div className="cl-ta-cloud-col__label" style={{ color: COLOR_B }}>{countryB}</div>
              <div className="cl-ta-cloud-container">
                {wordsB.length === 0
                  ? <div className="cl-chart-empty">Not enough text data for {countryB}.</div>
                  : <WordCloud words={wordsB} width={paneWidth} height={paneHeight} color={COLOR_B} maxCount={maxCount} />
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
