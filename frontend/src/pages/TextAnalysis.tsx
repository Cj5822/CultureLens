import { useMemo, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { scaleSqrt } from 'd3-scale'
import { interpolateRgb } from 'd3-interpolate'
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

const COLOR_A      = '#2563eb'
const COLOR_SHARED = '#94a3b8'
const COLOR_B      = '#ea580c'

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

function diffColor(score: number): string {
  if (score > 0) return interpolateRgb(COLOR_SHARED, COLOR_A)(Math.min(score * 6, 1))
  return interpolateRgb(COLOR_SHARED, COLOR_B)(Math.min(-score * 6, 1))
}

interface DiffWord {
  text: string
  countA: number
  countB: number
  differential: number
  combined: number
  size?: number
  x?: number
  y?: number
  rotate?: number
}

function buildDiffWords(countryA: string, countryB: string): DiffWord[] {
  const freqA = buildFrequency(countryA)
  const freqB = buildFrequency(countryB)
  const totalA = [...freqA.values()].reduce((s, n) => s + n, 0)
  const totalB = [...freqB.values()].reduce((s, n) => s + n, 0)
  const allWords = new Set([...freqA.keys(), ...freqB.keys()])
  const words: DiffWord[] = []
  for (const word of allWords) {
    const cA = freqA.get(word) ?? 0
    const cB = freqB.get(word) ?? 0
    const combined = cA + cB
    if (combined < 2) continue
    const normA = cA / Math.max(totalA, 1)
    const normB = cB / Math.max(totalB, 1)
    words.push({ text: word, countA: cA, countB: cB, differential: normA - normB, combined })
  }
  return words.sort((a, b) => b.combined - a.combined).slice(0, 100)
}

function WordCloud({ words, width, height }: { words: DiffWord[]; width: number; height: number }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || words.length === 0) return
    const maxCombined = Math.max(...words.map(w => w.combined))
    const sizeScale = scaleSqrt().domain([0, maxCombined]).range([10, Math.min(width, height) * 0.11]).clamp(true)

    const layout = cloud()
      .size([width, height])
      .words(words.map(w => ({ ...w, size: sizeScale(w.combined) })))
      .padding(4)
      .rotate(() => (Math.random() > 0.75 ? (Math.random() > 0.5 ? 90 : -90) : 0))
      .font('sans-serif')
      .fontSize((d: { size?: number }) => d.size ?? 12)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('end', (placed: any[]) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)
        const maxDiff = Math.max(...(placed as DiffWord[]).map(w => Math.abs(w.differential))) || 1
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodes = (g as any).selectAll('text').data(placed as DiffWord[]).enter().append('text')
        nodes.style('font-family', 'sans-serif')
        nodes.style('font-weight', (d: DiffWord) => (d.combined > maxCombined * 0.3 ? '700' : '500'))
        nodes.style('fill', (d: DiffWord) => diffColor(d.differential / maxDiff))
        nodes.style('cursor', 'default')
        nodes.attr('text-anchor', 'middle')
        nodes.attr('font-size', (d: DiffWord) => String(d.size ?? 12) + 'px')
        nodes.attr('transform', (d: DiffWord) => 'translate(' + String(d.x) + ',' + String(d.y) + ') rotate(' + String(d.rotate) + ')')
        nodes.text((d: DiffWord) => d.text ?? '')
        nodes.append('title').text((d: DiffWord) => '"' + d.text + '" A:' + String(d.countA) + ' B:' + String(d.countB))
      })

    layout.start()
    return () => { layout.stop() }
  }, [words, width, height])

  return <svg ref={svgRef} width={width} height={height} />
}

export function TextAnalysis() {
  const [countryA, setCountryA] = useState<string>('')
  const [countryB, setCountryB] = useState<string>('')

  const cloudRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 700, height: 420 })

  useEffect(() => {
    if (!cloudRef.current) return
    const ro = new ResizeObserver(entries => {
      const e = entries[0]
      if (e) setSize({ width: Math.floor(e.contentRect.width), height: Math.floor(e.contentRect.height) })
    })
    ro.observe(cloudRef.current)
    return () => ro.disconnect()
  }, [])

  const ready = Boolean(countryA && countryB && countryA !== countryB)

  const words = useMemo(
    () => (ready ? buildDiffWords(countryA, countryB) : []),
    [ready, countryA, countryB],
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
          <p className="cl-ta-empty-prompt__title">Select two countries to generate a word cloud</p>
          <p className="cl-ta-empty-prompt__sub">
            Words in <strong style={{ color: COLOR_A }}>blue</strong> appear more in Country A,{' '}
            <strong style={{ color: COLOR_B }}>orange</strong> in Country B, and{' '}
            <strong style={{ color: COLOR_SHARED }}>grey</strong> are shared.
          </p>
        </div>
      )}

      {ready && (
        <div className="cl-chart-card cl-ta-main-card">
          <div className="cl-ta-cloud-header">
            <span className="cl-ta-cloud-title">Word Cloud</span>
            <div className="cl-ta-legend">
              <span className="cl-ta-legend-dot" style={{ background: COLOR_A }} />
              <span className="cl-ta-legend-label">{countryA}</span>
              <span className="cl-ta-legend-dot" style={{ background: COLOR_SHARED }} />
              <span className="cl-ta-legend-label">Shared</span>
              <span className="cl-ta-legend-dot" style={{ background: COLOR_B }} />
              <span className="cl-ta-legend-label">{countryB}</span>
            </div>
          </div>
          <div ref={cloudRef} className="cl-ta-cloud-container">
            {words.length === 0
              ? <div className="cl-chart-empty">Not enough text data for these countries.</div>
              : <WordCloud words={words} width={size.width} height={size.height} />
            }
          </div>
        </div>
      )}
    </div>
  )
}
