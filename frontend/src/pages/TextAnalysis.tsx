import { useMemo, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { scaleSqrt } from 'd3-scale'
import cloud from 'd3-cloud'
import { useDataContext } from '@/context/DataContext'
import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS } from '@/types/filters'
import { buildFreqWords, type FreqWord } from '@/utils/textFrequency'

const COLOR_A = '#2563eb'
const COLOR_B = '#ea580c'

interface PlacedWord {
  text: string
  x: number
  y: number
  rotate: number
  size: number
}

/** Deterministic rotation so the same word always gets the same angle. */
function rotationFor(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) & 0xffff
  const choices = [0, 0, 0, 0, 90, -90]
  return choices[hash % choices.length]
}

/**
 * Pure rendering component — takes pre-computed placed words from the joint
 * layout and renders only those that belong to this country's word set.
 * Because both clouds share the same layout, identical words land in the
 * same (x, y) position in both panes.
 */
function WordCloud({
  words, placedWords, width, height, color, maxCount, sizeOf,
}: {
  words: FreqWord[]
  placedWords: PlacedWord[]
  width: number
  height: number
  color: string
  maxCount: number
  /** Font size for a given count. Each pane sizes words from its OWN count, so
   *  a word shared by both countries is drawn at different sizes when its counts
   *  differ. The joint layout reserves space for the larger size, so nothing overlaps. */
  sizeOf: (count: number) => number
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  const wordMap = useMemo(() => new Map(words.map(w => [w.text, w.count])), [words])

  useEffect(() => {
    if (!svgRef.current || placedWords.length === 0 || width <= 0 || height <= 0) return

    const toRender = placedWords.filter(p => wordMap.has(p.text))

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = (g as any).selectAll('text').data(toRender).enter().append('text')
    nodes.style('font-family', 'sans-serif')
    nodes.style('font-weight', (d: PlacedWord) => {
      const count = wordMap.get(d.text) ?? 0
      return count > maxCount * 0.3 ? '700' : '500'
    })
    nodes.style('fill', color)
    nodes.style('cursor', 'default')
    nodes.attr('text-anchor', 'middle')
    nodes.attr('font-size', (d: PlacedWord) => String(sizeOf(wordMap.get(d.text) ?? 0)) + 'px')
    nodes.attr('transform', (d: PlacedWord) =>
      'translate(' + String(d.x) + ',' + String(d.y) + ') rotate(' + String(d.rotate) + ')'
    )
    nodes.text((d: PlacedWord) => d.text)
    nodes.append('title').text((d: PlacedWord) => {
      const count = wordMap.get(d.text) ?? 0
      return '"' + d.text + '" - ' + String(count) + ' occurrence' + (count === 1 ? '' : 's')
    })
  }, [placedWords, wordMap, width, height, color, maxCount, sizeOf])

  return <svg ref={svgRef} width={width} height={height} />
}

export function TextAnalysis() {
  const { entities } = useDataContext()
  const [countryA, setCountryA] = useState<string>('')
  const [countryB, setCountryB] = useState<string>('')

  const cloudRowRef = useRef<HTMLDivElement>(null)
  const [rowSize, setRowSize] = useState({ width: 700, height: 420 })

  const allCountries = useMemo(
    () => [...new Set(entities.map(e => e.country).filter(Boolean))].sort(),
    [entities],
  )

  useEffect(() => {
    if (!cloudRowRef.current) return
    const ro = new ResizeObserver(entries => {
      const e = entries[0]
      if (e) setRowSize({ width: Math.floor(e.contentRect.width), height: Math.floor(e.contentRect.height) })
    })
    ro.observe(cloudRowRef.current)
    return () => ro.disconnect()
  }, [])

  const paneWidth  = Math.max(0, Math.floor((rowSize.width - 1) / 2))
  const paneHeight = rowSize.height
  const ready = Boolean(countryA && countryB && countryA !== countryB)

  const wordsA = useMemo(
    () => (ready ? buildFreqWords(countryA, entities) : []),
    [ready, countryA, entities],
  )
  const wordsB = useMemo(
    () => (ready ? buildFreqWords(countryB, entities) : []),
    [ready, countryB, entities],
  )
  const maxCount = useMemo(
    () => Math.max(1, ...wordsA.map(w => w.count), ...wordsB.map(w => w.count)),
    [wordsA, wordsB],
  )

  /** Shared square-root size scale (common domain across both countries). */
  const sizeScale = useMemo(
    () => scaleSqrt()
      .domain([0, maxCount])
      .range([10, Math.max(10, Math.min(paneWidth, paneHeight) * 0.16)])
      .clamp(true),
    [maxCount, paneWidth, paneHeight],
  )

  /**
   * Joint layout: merge both word lists and run d3-cloud once.
   * Words shared between the two countries get the same (x, y, rotate),
   * so they appear in the same position in both panes.
   */
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([])

  useEffect(() => {
    if (!ready || (wordsA.length === 0 && wordsB.length === 0) || paneWidth <= 0 || paneHeight <= 0) {
      setPlacedWords([])
      return
    }

    // Merge: for sizing use the max count of either country so scale is consistent
    const merged = new Map<string, number>()
    for (const w of wordsA) merged.set(w.text, Math.max(merged.get(w.text) ?? 0, w.count))
    for (const w of wordsB) merged.set(w.text, Math.max(merged.get(w.text) ?? 0, w.count))

    const wordList = [...merged.entries()].map(([text, count]) => ({
      text,
      count,
      size: sizeScale(count),
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layout = cloud<any>()
      .size([paneWidth, paneHeight])
      .words(wordList)
      .padding(3)
      .rotate((d: { text?: string }) => rotationFor(d.text ?? ''))
      .font('sans-serif')
      .fontSize((d: { size?: number }) => d.size ?? 12)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('end', (placed: any[]) => {
        setPlacedWords(placed.map(w => ({
          text: w.text as string,
          x: (w.x as number) ?? 0,
          y: (w.y as number) ?? 0,
          rotate: (w.rotate as number) ?? 0,
          size: (w.size as number) ?? 12,
        })))
      })

    layout.start()
    return () => { layout.stop() }
  }, [ready, wordsA, wordsB, sizeScale, paneWidth, paneHeight])

  const entityCountA = useMemo(
    () => countryA ? filterEntities(entities, { ...DEFAULT_FILTERS, countries: [countryA] }).length : 0,
    [countryA, entities],
  )
  const entityCountB = useMemo(
    () => countryB ? filterEntities(entities, { ...DEFAULT_FILTERS, countries: [countryB] }).length : 0,
    [countryB, entities],
  )

  if (entities.length === 0) {
    return (
      <div className="cl-ta-empty-prompt">
        <span className="cl-ta-empty-prompt__icon">☁</span>
        <p className="cl-ta-empty-prompt__title">No data loaded</p>
        <p className="cl-ta-empty-prompt__sub">Import an Excel file to enable text analysis.</p>
      </div>
    )
  }

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
            {allCountries.map(c => (
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
            {allCountries.map(c => (
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
                  : <WordCloud words={wordsA} placedWords={placedWords} width={paneWidth} height={paneHeight} color={COLOR_A} maxCount={maxCount} sizeOf={sizeScale} />
                }
              </div>
            </div>
            <div className="cl-ta-clouds-divider" />
            <div className="cl-ta-cloud-col">
              <div className="cl-ta-cloud-col__label" style={{ color: COLOR_B }}>{countryB}</div>
              <div className="cl-ta-cloud-container">
                {wordsB.length === 0
                  ? <div className="cl-chart-empty">Not enough text data for {countryB}.</div>
                  : <WordCloud words={wordsB} placedWords={placedWords} width={paneWidth} height={paneHeight} color={COLOR_B} maxCount={maxCount} sizeOf={sizeScale} />
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
