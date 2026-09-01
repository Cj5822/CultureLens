import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Entity } from '@/types/entities'
import type { PSDimension, PSNode, PSRibbon } from '@/utils/analytics/parallelSets'
import { computeParallelSetsLayout } from '@/utils/analytics/parallelSets'

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_WIDTH = 20
const MARGIN = { top: 34, right: 150, bottom: 8, left: 150 }
const MIN_CHART_WIDTH = 640

const PALETTE = [
  '#4f86c6', '#d64f4f', '#4cb8a0', '#f5a623',
  '#9b59b6', '#5aab6e', '#c67c4f', '#4fb0c6', '#8a8a8a',
]

// ─── Hover / tooltip state ──────────────────────────────────────────────────

type HoverTarget =
  | { kind: 'ribbon'; ribbon: PSRibbon }
  | { kind: 'node'; dimIndex: number; value: string }

interface TooltipState {
  x: number
  y: number
  title: string
  lines: string[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function ribbonPath(x0: number, y0a: number, y0b: number, x1: number, y1a: number, y1b: number): string {
  const xm = (x0 + x1) / 2
  return `M${x0},${y0a} C${xm},${y0a} ${xm},${y1a} ${x1},${y1a} L${x1},${y1b} C${xm},${y1b} ${xm},${y0b} ${x0},${y0b} Z`
}

function fmtPct(count: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((count / total) * 1000) / 10}%`
}

function pluralEntities(count: number): string {
  return `${count} ${count === 1 ? 'entity' : 'entities'}`
}

// ─── Component ──────────────────────────────────────────────────────────────

export interface ParallelSetsChartProps {
  entities: Entity[]
  dimensions: PSDimension[]
  height?: number
  onSelectEntities: (entities: Entity[], title: string) => void
}

export function ParallelSetsChart({ entities, dimensions, height = 520, onSelectEntities }: ParallelSetsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(MIN_CHART_WIDTH)
  const [hover, setHover] = useState<HoverTarget | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setMeasuredWidth(w)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const width = Math.max(measuredWidth, MIN_CHART_WIDTH)
  const layout = useMemo(() => computeParallelSetsLayout(entities, dimensions), [entities, dimensions])

  const n = dimensions.length
  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - MARGIN.top - MARGIN.bottom
  const gap = n > 1 ? (innerWidth - n * NODE_WIDTH) / (n - 1) : 0
  const pxPerUnit = layout.total > 0 ? innerHeight / layout.total : 0

  const colX = useMemo(
    () => Array.from({ length: n }, (_, i) => MARGIN.left + i * (NODE_WIDTH + gap)),
    [n, gap],
  )

  // Colour lookup: column-0 category -> palette colour (the colour-defining variable is leftmost, per Wilke §11.4).
  const colorByCategory = useMemo(() => {
    const map = new Map<string, string>()
    const col0 = layout.columns[0]
    if (col0) col0.nodes.forEach((node, i) => map.set(node.value, PALETTE[i % PALETTE.length]))
    return map
  }, [layout])

  const isRibbonActive = useCallback(
    (ribbon: PSRibbon): boolean => {
      if (!hover) return true
      if (hover.kind === 'ribbon') return hover.ribbon.id === ribbon.id
      return (
        (hover.dimIndex === ribbon.dimIndex && ribbon.sourceValue === hover.value) ||
        (hover.dimIndex === ribbon.dimIndex + 1 && ribbon.targetValue === hover.value)
      )
    },
    [hover],
  )

  const isNodeActive = useCallback(
    (dimIndex: number, value: string): boolean => {
      if (!hover) return true
      if (hover.kind === 'node') return hover.dimIndex === dimIndex && hover.value === value
      const r = hover.ribbon
      return (dimIndex === r.dimIndex && value === r.sourceValue) || (dimIndex === r.dimIndex + 1 && value === r.targetValue)
    },
    [hover],
  )

  const handleRibbonEnter = useCallback(
    (ribbon: PSRibbon, evt: React.MouseEvent) => {
      setHover({ kind: 'ribbon', ribbon })
      const srcCol = dimensions[ribbon.dimIndex]
      const tgtCol = dimensions[ribbon.dimIndex + 1]
      setTooltip({
        x: evt.clientX,
        y: evt.clientY,
        title: `${pluralEntities(ribbon.count)} · ${fmtPct(ribbon.count, layout.total)}`,
        lines: [
          `${srcCol.label}: ${ribbon.sourceValue}`,
          `${tgtCol.label}: ${ribbon.targetValue}`,
          ...ribbon.entities.slice(0, 5).map((e) => `· ${e.name}`),
          ribbon.entities.length > 5 ? `… and ${ribbon.entities.length - 5} more` : '',
        ].filter(Boolean),
      })
    },
    [dimensions, layout.total],
  )

  const handleNodeEnter = useCallback(
    (dimIndex: number, node: PSNode, evt: React.MouseEvent) => {
      setHover({ kind: 'node', dimIndex, value: node.value })
      setTooltip({
        x: evt.clientX,
        y: evt.clientY,
        title: `${dimensions[dimIndex].label}: ${node.value}`,
        lines: [`${pluralEntities(node.count)} · ${fmtPct(node.count, layout.total)}`],
      })
    },
    [dimensions, layout.total],
  )

  const handleLeave = useCallback(() => {
    setHover(null)
    setTooltip(null)
  }, [])

  const handleMove = useCallback((evt: React.MouseEvent) => {
    setTooltip((t) => (t ? { ...t, x: evt.clientX, y: evt.clientY } : t))
  }, [])

  const nodeEntitiesFor = useCallback(
    (dimIndex: number, value: string): Entity[] => {
      const seen = new Set<string>()
      const out: Entity[] = []
      for (const r of layout.ribbons) {
        const matches =
          (r.dimIndex === dimIndex && r.sourceValue === value) || (r.dimIndex === dimIndex - 1 && r.targetValue === value)
        if (!matches) continue
        for (const e of r.entities) {
          if (!seen.has(e.id)) {
            seen.add(e.id)
            out.push(e)
          }
        }
      }
      return out
    },
    [layout],
  )

  if (layout.total === 0) {
    return (
      <div className="cl-parallelsets-chart" ref={containerRef}>
        <div className="cl-parallelsets-empty">No entities match the current filters.</div>
      </div>
    )
  }

  return (
    <div className="cl-parallelsets-chart" ref={containerRef}>
      <svg width={width} height={height} onMouseMove={handleMove}>
        {/* Column headers */}
        {dimensions.map((d, i) => (
          <text key={d.key} x={colX[i] + NODE_WIDTH / 2} y={MARGIN.top - 14} textAnchor="middle" className="cl-parallelsets-col-title">
            {d.label}
          </text>
        ))}

        {/* Ribbons — rendered before nodes so nodes sit on top */}
        <g>
          {layout.ribbons.map((r) => {
            const x0 = colX[r.dimIndex] + NODE_WIDTH
            const x1 = colX[r.dimIndex + 1]
            const y0a = MARGIN.top + r.s0 * pxPerUnit
            const y0b = MARGIN.top + r.s1 * pxPerUnit
            const y1a = MARGIN.top + r.t0 * pxPerUnit
            const y1b = MARGIN.top + r.t1 * pxPerUnit
            const active = isRibbonActive(r)
            return (
              <path
                key={r.id}
                d={ribbonPath(x0, y0a, y0b, x1, y1a, y1b)}
                fill={colorByCategory.get(r.colorValue) ?? '#8a8a8a'}
                opacity={hover ? (active ? 0.85 : 0.08) : 0.55}
                className="cl-parallelsets-ribbon"
                onMouseEnter={(evt) => handleRibbonEnter(r, evt)}
                onMouseLeave={handleLeave}
                onClick={() =>
                  onSelectEntities(
                    r.entities,
                    `${dimensions[r.dimIndex].label}: ${r.sourceValue} → ${dimensions[r.dimIndex + 1].label}: ${r.targetValue}`,
                  )
                }
              />
            )
          })}
        </g>

        {/* Nodes */}
        {layout.columns.map((col, dimIndex) => (
          <g key={col.key}>
            {col.nodes.map((node) => {
              const x = colX[dimIndex]
              const y = MARGIN.top + node.y0 * pxPerUnit
              const h = Math.max(0.5, (node.y1 - node.y0) * pxPerUnit)
              const fill = dimIndex === 0 ? colorByCategory.get(node.value) ?? PALETTE[0] : 'var(--cl-parallelsets-neutral)'
              const showLabel = h >= 15
              const isFirst = dimIndex === 0
              const isLast = dimIndex === n - 1
              const active = isNodeActive(dimIndex, node.value)
              return (
                <g key={node.value}>
                  <rect
                    x={x}
                    y={y}
                    width={NODE_WIDTH}
                    height={h}
                    fill={fill}
                    opacity={active ? 1 : 0.25}
                    stroke="var(--color-background)"
                    strokeWidth={1.5}
                    rx={2}
                    className="cl-parallelsets-node"
                    onMouseEnter={(evt) => handleNodeEnter(dimIndex, node, evt)}
                    onMouseLeave={handleLeave}
                    onClick={() => onSelectEntities(nodeEntitiesFor(dimIndex, node.value), `${dimensions[dimIndex].label}: ${node.value}`)}
                  />
                  {showLabel && (isFirst || isLast) && (
                    <text
                      x={isFirst ? x - 8 : x + NODE_WIDTH + 8}
                      y={y + h / 2}
                      dy="0.32em"
                      textAnchor={isFirst ? 'end' : 'start'}
                      className="cl-parallelsets-node-label"
                    >
                      {node.value} <tspan className="cl-parallelsets-node-count">({node.count})</tspan>
                    </text>
                  )}
                  {showLabel && !isFirst && !isLast && h >= 20 && (
                    <text x={x + NODE_WIDTH / 2} y={y + h / 2} dy="0.32em" textAnchor="middle" className="cl-parallelsets-node-count-inline">
                      {node.count}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        ))}
      </svg>

      {tooltip && (
        <div className="cl-parallelsets-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}>
          <div className="cl-parallelsets-tooltip__title">{tooltip.title}</div>
          {tooltip.lines.map((line, i) => (
            <div key={i} className="cl-parallelsets-tooltip__line">{line}</div>
          ))}
        </div>
      )}
    </div>
  )
}
