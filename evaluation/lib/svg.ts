// Minimal, dependency-free SVG chart writers for the evaluation figures and
// the RQ4 bar-chart stimuli. Static output (report figures and still-image
// study stimuli), light background, system sans-serif font.

const FONT = "font-family=\"Arial, Helvetica, sans-serif\""
const INK = '#0b0b0b'
const INK_2 = '#52514e'
const GRID = '#e4e3df'
const SURFACE = '#ffffff'

/** Categorical slots 1-5 of the dataviz reference palette (validated, light mode). */
const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4']
const MARKERS = ['circle', 'square', 'diamond', 'triangle', 'cross'] as const

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function marker(kind: (typeof MARKERS)[number], x: number, y: number, color: string): string {
  const r = 4
  switch (kind) {
    case 'circle': return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="${SURFACE}" stroke-width="1.5"/>`
    case 'square': return `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" fill="${color}" stroke="${SURFACE}" stroke-width="1.5"/>`
    case 'diamond': return `<path d="M${x},${y - r - 1}L${x + r + 1},${y}L${x},${y + r + 1}L${x - r - 1},${y}Z" fill="${color}" stroke="${SURFACE}" stroke-width="1.5"/>`
    case 'triangle': return `<path d="M${x},${y - r - 1}L${x + r + 1},${y + r}L${x - r - 1},${y + r}Z" fill="${color}" stroke="${SURFACE}" stroke-width="1.5"/>`
    case 'cross': return `<path d="M${x - r},${y - r}L${x + r},${y + r}M${x - r},${y + r}L${x + r},${y - r}" stroke="${color}" stroke-width="2.5"/>`
  }
}

// ─── Log-log line chart (benchmark figure) ─────────────────────────────────

export interface LinePanel { title: string; series: { name: string; values: number[]; color?: string }[] }

export function lineChartSvg(opts: { panels: LinePanel[]; x: number[]; xLabel: string; yLabel: string; budgetMs?: number }): string {
  const panelW = 380
  const panelH = 300
  const m = { top: 40, right: 30, bottom: 50, left: 64 }
  // Legend only for panels with two or more series; a single series is
  // named by its panel title. Legend entries wrap within the panel width.
  const legendRows = Math.max(1, ...opts.panels.map((p) => (p.series.length > 1 ? Math.ceil(p.series.length / 3) : 0)))
  const legendH = 22 * legendRows + 8
  const W = panelW * opts.panels.length
  const H = panelH + legendH
  const parts: string[] = []

  opts.panels.forEach((panel, pi) => {
    const ox = pi * panelW
    const iw = panelW - m.left - m.right
    const ih = panelH - m.top - m.bottom
    const ys = panel.series.flatMap((s) => s.values).concat(opts.budgetMs ? [opts.budgetMs] : []).filter((v) => v > 0)
    const yMin = Math.pow(10, Math.floor(Math.log10(Math.min(...ys))))
    const yMax = Math.pow(10, Math.ceil(Math.log10(Math.max(...ys))))
    const xMin = Math.min(...opts.x)
    const xMax = Math.max(...opts.x)
    const sx = (v: number) => ox + m.left + ((Math.log10(v) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin))) * iw
    const sy = (v: number) => m.top + ih - ((Math.log10(v) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin))) * ih

    parts.push(`<text x="${ox + m.left}" y="22" font-size="13" font-weight="700" fill="${INK}">${esc(panel.title)}</text>`)
    for (let d = Math.log10(yMin); d <= Math.log10(yMax) + 1e-9; d++) {
      const v = Math.pow(10, d)
      const y = sy(v)
      parts.push(`<line x1="${ox + m.left}" x2="${ox + m.left + iw}" y1="${y}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`)
      parts.push(`<text x="${ox + m.left - 8}" y="${y + 4}" font-size="11" fill="${INK_2}" text-anchor="end">${v >= 1 ? v.toLocaleString('en') : v}</text>`)
    }
    for (const v of opts.x) {
      parts.push(`<text x="${sx(v)}" y="${m.top + ih + 18}" font-size="11" fill="${INK_2}" text-anchor="middle">${v.toLocaleString('en')}</text>`)
    }
    parts.push(`<line x1="${ox + m.left}" x2="${ox + m.left + iw}" y1="${m.top + ih}" y2="${m.top + ih}" stroke="${INK_2}" stroke-width="1"/>`)
    parts.push(`<text x="${ox + m.left + iw / 2}" y="${m.top + ih + 38}" font-size="12" fill="${INK_2}" text-anchor="middle">${esc(opts.xLabel)}</text>`)
    parts.push(`<text transform="translate(${ox + 16},${m.top + ih / 2}) rotate(-90)" font-size="12" fill="${INK_2}" text-anchor="middle">${esc(opts.yLabel)}</text>`)

    if (opts.budgetMs) {
      const y = sy(opts.budgetMs)
      parts.push(`<line x1="${ox + m.left}" x2="${ox + m.left + iw}" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="6 4"/>`)
      parts.push(`<text x="${ox + m.left + 4}" y="${y - 5}" font-size="11" fill="${INK}">${opts.budgetMs} ms frame budget</text>`)
    }

    panel.series.forEach((s, idx) => {
      const color = s.color ?? SERIES[idx % SERIES.length]
      const pts = s.values.map((v, i) => [sx(opts.x[i]), sy(Math.max(v, yMin))] as const)
      parts.push(`<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`)
      pts.forEach(([x, y]) => parts.push(marker(MARKERS[idx % MARKERS.length], x, y, color)))
    })

    if (panel.series.length > 1) {
      panel.series.forEach((s, idx) => {
        const color = s.color ?? SERIES[idx % SERIES.length]
        const lx = ox + 20 + (idx % 3) * 120
        const ly = panelH + 6 + Math.floor(idx / 3) * 22
        parts.push(`<line x1="${lx}" x2="${lx + 20}" y1="${ly}" y2="${ly}" stroke="${color}" stroke-width="2"/>`)
        parts.push(marker(MARKERS[idx % MARKERS.length], lx + 10, ly, color))
        parts.push(`<text x="${lx + 26}" y="${ly + 4}" font-size="12" fill="${INK}">${esc(s.name)}</text>`)
      })
    }
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" ${FONT}><rect width="100%" height="100%" fill="${SURFACE}"/>${parts.join('')}</svg>\n`
}

// ─── Grouped horizontal bar chart (RQ4 stimulus) ───────────────────────────

export interface GroupedBarOptions {
  words: string[]
  groups: { name: string; color: string; values: number[] }[]
  title?: string
  xLabel?: string
  /** Print each bar's count at its end. Off by default so that the chart is
   *  read from bar length against the shared axis. */
  valueLabels?: boolean
}

export function groupedBarSvg(o: GroupedBarOptions): string {
  const barH = 9
  const innerGap = 2 // 2px surface gap between the two bars of a word
  const rowGap = 9
  const rowH = barH * o.groups.length + innerGap * (o.groups.length - 1) + rowGap
  const labelW = Math.max(...o.words.map((w) => w.length)) * 7.2 + 16
  const m = { top: o.title ? 58 : 34, right: 30, bottom: 44, left: labelW }
  const iw = 520
  const ih = o.words.length * rowH
  const W = m.left + iw + m.right
  const H = m.top + ih + m.bottom
  const max = Math.max(1, ...o.groups.flatMap((g) => g.values))
  const step = max <= 10 ? 1 : max <= 25 ? 5 : max <= 60 ? 10 : 20
  const xMax = Math.ceil(max / step) * step
  const sx = (v: number) => m.left + (v / xMax) * iw
  const parts: string[] = []

  if (o.title) parts.push(`<text x="${m.left}" y="22" font-size="14" font-weight="700" fill="${INK}">${esc(o.title)}</text>`)
  // Legend
  let lx = m.left
  const ly = m.top - 16
  for (const g of o.groups) {
    parts.push(`<rect x="${lx}" y="${ly - 9}" width="12" height="12" rx="2" fill="${g.color}"/>`)
    parts.push(`<text x="${lx + 18}" y="${ly + 1}" font-size="12" fill="${INK}">${esc(g.name)}</text>`)
    lx += 18 + g.name.length * 7.5 + 24
  }
  // Grid + axis ticks
  for (let v = 0; v <= xMax; v += step) {
    parts.push(`<line x1="${sx(v)}" x2="${sx(v)}" y1="${m.top}" y2="${m.top + ih}" stroke="${GRID}" stroke-width="1"/>`)
    parts.push(`<text x="${sx(v)}" y="${m.top + ih + 16}" font-size="11" fill="${INK_2}" text-anchor="middle">${v}</text>`)
  }
  parts.push(`<text x="${m.left + iw / 2}" y="${m.top + ih + 34}" font-size="12" fill="${INK_2}" text-anchor="middle">${esc(o.xLabel ?? 'Number of occurrences')}</text>`)

  o.words.forEach((w, i) => {
    const y0 = m.top + i * rowH + rowGap / 2
    const midY = y0 + (rowH - rowGap) / 2
    parts.push(`<text x="${m.left - 8}" y="${midY + 4}" font-size="12" fill="${INK}" text-anchor="end">${esc(w)}</text>`)
    o.groups.forEach((g, gi) => {
      const v = g.values[i] ?? 0
      const y = y0 + gi * (barH + innerGap)
      const wpx = Math.max(0, sx(v) - m.left)
      if (wpx > 0) {
        // 2px rounded data-end, square at the baseline
        const r = Math.min(2, wpx / 2)
        parts.push(`<path d="M${m.left},${y}H${m.left + wpx - r}Q${m.left + wpx},${y} ${m.left + wpx},${y + r}V${y + barH - r}Q${m.left + wpx},${y + barH} ${m.left + wpx - r},${y + barH}H${m.left}Z" fill="${g.color}"/>`)
      }
      if (o.valueLabels) parts.push(`<text x="${m.left + wpx + 4}" y="${y + barH - 1}" font-size="10" fill="${INK_2}">${v}</text>`)
    })
  })
  parts.push(`<line x1="${m.left}" x2="${m.left}" y1="${m.top}" y2="${m.top + ih}" stroke="${INK_2}" stroke-width="1"/>`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" ${FONT}><rect width="100%" height="100%" fill="${SURFACE}"/>${parts.join('')}</svg>\n`
}
