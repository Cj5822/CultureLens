import { useEffect, useRef, useMemo, useCallback } from 'react'
import * as d3 from 'd3'
import type { SimulationNodeDatum } from 'd3'
import type { GraphData, GraphEdge, GraphNode } from '@/types/graph'
import {
  ACTOR_TYPE_COLORS,
  INSTRUMENT_TYPE_COLORS,
  IMPACT_RADIUS,
  DEFAULT_NODE_OPACITY,
  DIMMED_NODE_OPACITY,
  DEFAULT_EDGE_OPACITY,
  DIMMED_EDGE_OPACITY,
  HIGHLIGHT_EDGE_OPACITY,
  SELECTED_STROKE_WIDTH,
  DEFAULT_STROKE_WIDTH,
  SELECTED_STROKE_COLOR,
  SELECTED_GLOW_SPREAD,
} from './relationshipGraphConstants'

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface RelationshipGraphProps {
  data: GraphData
  selectedId?: string | null
  highlightedIds?: string[]
  onNodeClick?: (nodeId: string) => void
}

// ─── D3 internal types ─────────────────────────────────────────────────────────

interface SimNode extends GraphNode, SimulationNodeDatum {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

interface SimEdge extends Omit<GraphEdge, 'source' | 'target'> {
  source: SimNode | string
  target: SimNode | string
  index?: number
}

// ─── Pure helpers ──────────────────────────────────────────────────────────────

function nodeColor(node: GraphNode): string {
  if (node.category === 'stakeholders' && node.actorType) {
    return ACTOR_TYPE_COLORS[node.actorType]
  }
  if (node.category === 'instruments' && node.instrumentType) {
    return INSTRUMENT_TYPE_COLORS[node.instrumentType]
  }
  return '#8a8a8a'
}

function nodeRadius(node: GraphNode): number {
  return IMPACT_RADIUS[node.impactInfluence]
}

/** Build adjacency set: nodeId → Set of neighbour IDs */
function buildAdjacency(edges: GraphEdge[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>()
  for (const edge of edges) {
    const src = typeof edge.source === 'string' ? edge.source : (edge.source as SimNode).id
    const tgt = typeof edge.target === 'string' ? edge.target : (edge.target as SimNode).id
    if (!adj.has(src)) adj.set(src, new Set())
    if (!adj.has(tgt)) adj.set(tgt, new Set())
    adj.get(src)!.add(tgt)
    adj.get(tgt)!.add(src)
  }
  return adj
}

// Half-size for diamond rect (rotated square) — the inscribed square of the target circle
function diamondHalfSize(r: number): number {
  return r * 0.82
}

// ─── RelationshipGraph ─────────────────────────────────────────────────────────

export function RelationshipGraph({
  data,
  selectedId,
  highlightedIds,
  onNodeClick,
}: RelationshipGraphProps) {
  const svgRef       = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simRef       = useRef<d3.Simulation<SimNode, SimEdge> | null>(null)

  // Memoised refs for selection so the main D3 effect doesn't need to re-run
  const selectedIdRef   = useRef<string | null | undefined>(selectedId)
  const highlightIdsRef = useRef<Set<string>>(new Set(highlightedIds ?? []))
  const onNodeClickRef  = useRef<((id: string) => void) | undefined>(onNodeClick)

  selectedIdRef.current   = selectedId
  highlightIdsRef.current = useMemo(() => new Set(highlightedIds ?? []), [highlightedIds])
  onNodeClickRef.current  = onNodeClick

  // Detect reduced-motion preference once
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // ── Highlight helpers ──────────────────────────────────────────────────────
  // These functions operate on live D3 selections stored in refs and are called
  // both from hover events and from the selection-update effect.

  const applyHighlight = useCallback(
    (
      svgEl: SVGSVGElement,
      hoveredId: string | null,
      adjacency: Map<string, Set<string>>,
    ) => {
      const svg = d3.select<SVGSVGElement, unknown>(svgEl)
      const selId = selectedIdRef.current

      // Determine which node IDs are "in focus" (hovered or selected)
      const focusIds = new Set<string>()
      if (hoveredId) focusIds.add(hoveredId)
      if (selId)     focusIds.add(selId)

      // Neighbours of any focused node
      const neighbourIds = new Set<string>()
      for (const fid of focusIds) {
        const nbrs = adjacency.get(fid)
        if (nbrs) for (const n of nbrs) neighbourIds.add(n)
      }

      const hasAnyFocus = focusIds.size > 0

      // ── Update node appearance ──────────────────────────────────────────
      svg.selectAll<SVGCircleElement, SimNode>('.rg-node-circle').each(function (d) {
        const el = d3.select<SVGCircleElement, SimNode>(this)
        const isSelected = d.id === selId
        const isFocused  = focusIds.has(d.id)
        const isNeighbour = neighbourIds.has(d.id)

        el.attr('stroke', isSelected ? SELECTED_STROKE_COLOR : '#1e293b')
          .attr('stroke-width', isSelected ? SELECTED_STROKE_WIDTH : DEFAULT_STROKE_WIDTH)
          .attr('filter', isSelected ? `url(#rg-glow-${d.id})` : null)
          .attr(
            'opacity',
            hasAnyFocus
              ? isFocused || isNeighbour ? DEFAULT_NODE_OPACITY : DIMMED_NODE_OPACITY
              : DEFAULT_NODE_OPACITY,
          )
      })

      svg.selectAll<SVGRectElement, SimNode>('.rg-node-diamond').each(function (d) {
        const el = d3.select<SVGRectElement, SimNode>(this)
        const isSelected = d.id === selId
        const isFocused  = focusIds.has(d.id)
        const isNeighbour = neighbourIds.has(d.id)

        el.attr('stroke', isSelected ? SELECTED_STROKE_COLOR : '#1e293b')
          .attr('stroke-width', isSelected ? SELECTED_STROKE_WIDTH : DEFAULT_STROKE_WIDTH)
          .attr('filter', isSelected ? `url(#rg-glow-${d.id})` : null)
          .attr(
            'opacity',
            hasAnyFocus
              ? isFocused || isNeighbour ? DEFAULT_NODE_OPACITY : DIMMED_NODE_OPACITY
              : DEFAULT_NODE_OPACITY,
          )
      })

      // ── Update edge appearance ──────────────────────────────────────────
      svg.selectAll<SVGLineElement, SimEdge>('.rg-edge').each(function (d) {
        const el = d3.select<SVGLineElement, SimEdge>(this)
        const srcId = typeof d.source === 'string' ? d.source : (d.source as SimNode).id
        const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimNode).id
        const edgeTouchesFocus =
          focusIds.has(srcId) || focusIds.has(tgtId)

        el.attr(
          'opacity',
          hasAnyFocus
            ? edgeTouchesFocus ? HIGHLIGHT_EDGE_OPACITY : DIMMED_EDGE_OPACITY
            : DEFAULT_EDGE_OPACITY,
        )
      })

      // ── Update label visibility ─────────────────────────────────────────
      svg.selectAll<SVGTextElement, SimNode>('.rg-node-label').each(function (d) {
        const el = d3.select<SVGTextElement, SimNode>(this)
        const isFocused  = focusIds.has(d.id)
        const isNeighbour = neighbourIds.has(d.id)
        el.attr(
          'opacity',
          hasAnyFocus
            ? isFocused || isNeighbour ? 1 : 0
            : 0.6,
        )
      })
    },
    [], // stable — reads from refs
  )

  // ── Main D3 setup effect — runs when graph data changes ────────────────────
  useEffect(() => {
    const svgEl = svgRef.current
    const containerEl = containerRef.current
    if (!svgEl || !containerEl) return

    // Stop any existing simulation before rebuilding
    simRef.current?.stop()

    const { nodes: rawNodes, edges: rawEdges } = data

    const svg = d3.select<SVGSVGElement, unknown>(svgEl)

    // Dimensions from container
    const width  = containerEl.clientWidth  || 800
    const height = containerEl.clientHeight || 600

    svg.attr('width', width).attr('height', height)

    // Clear previous render
    svg.selectAll('*').remove()

    // ── Empty state ──────────────────────────────────────────────────────────
    if (rawNodes.length === 0) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', 16)
        .text('No entities to display')
      return
    }

    // ── Defs: glow filters per node ──────────────────────────────────────────
    const defs = svg.append('defs')
    for (const node of rawNodes) {
      const filter = defs
        .append('filter')
        .attr('id', `rg-glow-${node.id}`)
        .attr('x', '-50%').attr('y', '-50%')
        .attr('width', '200%').attr('height', '200%')
      filter
        .append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', SELECTED_GLOW_SPREAD)
        .attr('result', 'blur')
      const merge = filter.append('feMerge')
      merge.append('feMergeNode').attr('in', 'blur')
      merge.append('feMergeNode').attr('in', 'SourceGraphic')
    }

    // ── Zoom + pan ───────────────────────────────────────────────────────────
    const zoomLayer = svg.append('g').attr('class', 'rg-zoom-layer')

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 5])
      .on('zoom', event => {
        zoomLayer.attr('transform', (event.transform as d3.ZoomTransform).toString())
      })

    svg.call(zoom)

    // ── D3 simulation data ───────────────────────────────────────────────────
    const simNodes: SimNode[] = rawNodes.map(n => ({ ...n }))
    const simEdges: SimEdge[] = rawEdges.map(e => ({ ...e })) as SimEdge[]

    const adjacency = buildAdjacency(rawEdges)

    // ── Force simulation ─────────────────────────────────────────────────────
    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimEdge>(simEdges)
          .id(d => d.id)
          .distance(90),
      )
      .force('charge', d3.forceManyBody<SimNode>().strength(-280))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide<SimNode>().radius(d => nodeRadius(d) + 6),
      )
      .alphaDecay(prefersReducedMotion ? 1 : 0.028)   // instant layout if reduced-motion
      .velocityDecay(0.4)

    simRef.current = simulation

    // ── Edge lines ───────────────────────────────────────────────────────────
    const edgeGroup = zoomLayer.append('g').attr('class', 'rg-edges')
    const edgeSel = edgeGroup
      .selectAll<SVGLineElement, SimEdge>('line')
      .data(simEdges)
      .join('line')
      .attr('class', 'rg-edge')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1.2)
      .attr('opacity', DEFAULT_EDGE_OPACITY)

    // ── Node groups ──────────────────────────────────────────────────────────
    // Each group contains the shape + label for one entity
    const nodeGroup = zoomLayer.append('g').attr('class', 'rg-nodes')

    const nodeGs = nodeGroup
      .selectAll<SVGGElement, SimNode>('g')
      .data(simNodes)
      .join('g')
      .attr('class', 'rg-node-group')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', d =>
        `${d.label} — ${d.category === 'stakeholders' ? d.actorType ?? 'stakeholder' : d.instrumentType ?? 'instrument'}, impact: ${d.impactInfluence}, country: ${d.country}`,
      )
      .style('cursor', 'pointer')
      .style('outline', 'none')

    // ── Stakeholder circles ──────────────────────────────────────────────────
    nodeGs
      .filter(d => d.category === 'stakeholders')
      .append('circle')
      .attr('class', 'rg-node-circle')
      .attr('r', d => nodeRadius(d))
      .attr('fill', d => nodeColor(d))
      .attr('stroke', '#1e293b')
      .attr('stroke-width', DEFAULT_STROKE_WIDTH)

    // ── Instrument diamonds (rotated rects) ──────────────────────────────────
    nodeGs
      .filter(d => d.category === 'instruments')
      .append('rect')
      .attr('class', 'rg-node-diamond')
      .attr('width',  d => diamondHalfSize(nodeRadius(d)) * 2)
      .attr('height', d => diamondHalfSize(nodeRadius(d)) * 2)
      .attr('x', d => -diamondHalfSize(nodeRadius(d)))
      .attr('y', d => -diamondHalfSize(nodeRadius(d)))
      .attr('rx', 1)
      .attr('fill', d => nodeColor(d))
      .attr('stroke', '#1e293b')
      .attr('stroke-width', DEFAULT_STROKE_WIDTH)
      .attr('transform', 'rotate(45)')

    // ── Labels ───────────────────────────────────────────────────────────────
    nodeGs
      .append('text')
      .attr('class', 'rg-node-label')
      .attr('dy', d => nodeRadius(d) + 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#e2e8f0')
      .attr('pointer-events', 'none')
      .attr('opacity', 0.6)
      .text(d => d.label.length > 28 ? `${d.label.slice(0, 26)}…` : d.label)

    // ── Drag behaviour ───────────────────────────────────────────────────────
    const drag = d3
      .drag<SVGGElement, SimNode>()
      .on('start', (event, d) => {
        event.sourceEvent?.stopPropagation()
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeGs.call(drag)

    // ── Mouse interactions ───────────────────────────────────────────────────
    nodeGs
      .on('mouseover', (_event, d) => {
        applyHighlight(svgEl, d.id, adjacency)
      })
      .on('mouseout', () => {
        applyHighlight(svgEl, null, adjacency)
      })
      .on('click', (_event, d) => {
        onNodeClickRef.current?.(d.id)
      })

    // ── Keyboard interaction (focus + Enter/Space) ───────────────────────────
    nodeGs
      .on('keydown', (event: KeyboardEvent, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onNodeClickRef.current?.(d.id)
        }
      })
      .on('focus', (_event, d) => {
        applyHighlight(svgEl, d.id, adjacency)
      })
      .on('blur', () => {
        applyHighlight(svgEl, null, adjacency)
      })

    // ── Simulation tick ──────────────────────────────────────────────────────
    simulation.on('tick', () => {
      edgeSel.each(function (d) {
        const src = d.source as SimNode
        const tgt = d.target as SimNode
        const sx = src.x ?? 0
        const sy = src.y ?? 0
        const tx = tgt.x ?? 0
        const ty = tgt.y ?? 0
        const dx = tx - sx
        const dy = ty - sy
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const clearance = nodeRadius(tgt) + 4
        d3.select<SVGLineElement, SimEdge>(this)
          .attr('x1', sx)
          .attr('y1', sy)
          .attr('x2', tx - (dx / dist) * clearance)
          .attr('y2', ty - (dy / dist) * clearance)
      })

      nodeGs.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    // Initial highlight pass so selectedId from props is immediately reflected
    applyHighlight(svgEl, null, adjacency)

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      simulation.stop()
      svg.on('.zoom', null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, prefersReducedMotion])
  // NOTE: applyHighlight is stable (no deps), so omitted from the array intentionally.
  // selectedId/highlightedIds are handled by the effect below.

  // ── Selection/highlight update effect — no simulation restart ──────────────
  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    // Recompute adjacency from current edge data
    const adjacency = buildAdjacency(data.edges)
    applyHighlight(svgEl, null, adjacency)
  }, [selectedId, highlightedIds, data.edges, applyHighlight])

  // ── Responsive resize ──────────────────────────────────────────────────────
  useEffect(() => {
    const containerEl = containerRef.current
    const svgEl = svgRef.current
    if (!containerEl || !svgEl) return

    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      d3.select(svgEl).attr('width', width).attr('height', height)
      simRef.current
        ?.force('center', d3.forceCenter(width / 2, height / 2))
        .alpha(0.1)
        .restart()
    })

    observer.observe(containerEl)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="cl-relationship-graph"
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <svg
        ref={svgRef}
        className="cl-relationship-graph__svg"
        style={{ display: 'block', background: '#0f172a', borderRadius: 8 }}
        aria-label="Entity relationship network graph"
        role="img"
      />
    </div>
  )
}

export default RelationshipGraph
