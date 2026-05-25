import { useEffect } from 'react'
import type { RefObject } from 'react'
import * as d3 from 'd3'
import type { GraphNode, GraphEdge, SimulationNode, SimulationEdge } from './types'

const DEFAULT_RADIUS = 8

interface UseForceSimulationOptions {
  width: number
  height: number
  nodeColor: string
  edgeColor: string
  onNodeClick?: (node: GraphNode) => void
}

export function useForceSimulation(
  svgRef: RefObject<SVGSVGElement | null>,
  nodes: GraphNode[],
  edges: GraphEdge[],
  { width, height, nodeColor, edgeColor, onNodeClick }: UseForceSimulationOptions,
): void {
  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const svg = d3.select<SVGSVGElement, unknown>(svgEl)
    const zoomLayer = svg.select<SVGGElement>('.zoom-layer')

    // Always clear previous content before rebuilding
    zoomLayer.selectAll('*').remove()
    svg.selectAll('defs').remove()
    svg.selectAll('.empty-state').remove()

    if (nodes.length === 0) {
      svg
        .append('text')
        .attr('class', 'empty-state')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', 16)
        .text('No data to display')
      return
    }

    // Shallow-copy arrays so D3 can mutate node/edge objects without affecting props
    const simNodes: SimulationNode[] = nodes.map(n => ({ ...n }))
    const simEdges: SimulationEdge[] = edges.map(e => ({ ...e })) as SimulationEdge[]

    // Arrowhead marker — appended at SVG level so it's unaffected by zoom transforms
    const defs = svg.append('defs')
    defs
      .append('marker')
      .attr('id', 'fg-arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', edgeColor)

    // --- Simulation ---
    const simulation = d3
      .forceSimulation<SimulationNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationEdge>(simEdges)
          .id(d => d.id)
          .distance(80),
      )
      .force('charge', d3.forceManyBody<SimulationNode>().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide<SimulationNode>().radius(d => (d.radius ?? DEFAULT_RADIUS) + 4),
      )
      .alphaDecay(0.028)
      .velocityDecay(0.4)

    // --- Edge lines — rendered first so they sit beneath nodes ---
    const edgeGroup = zoomLayer.append('g').attr('class', 'edges')
    const edgeSelection = edgeGroup
      .selectAll<SVGLineElement, SimulationEdge>('line')
      .data(simEdges)
      .join('line')
      .attr('stroke', edgeColor)
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', d => Math.sqrt(d.weight ?? 1))
      .attr('marker-end', 'url(#fg-arrowhead)')

    // --- Node circles ---
    const nodeGroup = zoomLayer.append('g').attr('class', 'nodes')
    const nodeSelection = nodeGroup
      .selectAll<SVGCircleElement, SimulationNode>('circle')
      .data(simNodes)
      .join('circle')
      .attr('r', d => d.radius ?? DEFAULT_RADIUS)
      .attr('fill', d => d.color ?? nodeColor)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')

    // --- Labels — rendered last so they sit above nodes ---
    const labelGroup = zoomLayer.append('g').attr('class', 'labels')
    const labelSelection = labelGroup
      .selectAll<SVGTextElement, SimulationNode>('text')
      .data(simNodes.filter(n => n.label != null))
      .join('text')
      .attr('font-size', 11)
      .attr('fill', '#e2e8f0')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .text(d => d.label ?? '')

    // --- Drag behavior ---
    // stopPropagation on dragstart prevents the SVG zoom handler from also firing
    const drag = d3
      .drag<SVGCircleElement, SimulationNode>()
      .on('start', (event, d) => {
        event.sourceEvent.stopPropagation()
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        // event.x/y are in the zoom-layer's local coordinate space
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeSelection.call(drag)

    // --- Node click ---
    if (onNodeClick) {
      nodeSelection.on('click', (_event, d) => {
        // Return the original prop node so the caller never sees D3-mutated fields
        const original = nodes.find(n => n.id === d.id)
        if (original) onNodeClick(original)
      })
    }

    // --- Tick: update SVG element positions each simulation step ---
    simulation.on('tick', () => {
      edgeSelection.each(function (d) {
        const src = d.source as SimulationNode
        const tgt = d.target as SimulationNode
        const sx = src.x ?? 0
        const sy = src.y ?? 0
        const tx = tgt.x ?? 0
        const ty = tgt.y ?? 0
        const dx = tx - sx
        const dy = ty - sy
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        // Shorten the line so the arrowhead tip sits at the node's edge
        const clearance = (tgt.radius ?? DEFAULT_RADIUS) + 8
        d3.select<SVGLineElement, SimulationEdge>(this)
          .attr('x1', sx)
          .attr('y1', sy)
          .attr('x2', tx - (dx / dist) * clearance)
          .attr('y2', ty - (dy / dist) * clearance)
      })

      nodeSelection.attr('cx', d => d.x ?? 0).attr('cy', d => d.y ?? 0)

      labelSelection
        .attr('x', d => d.x ?? 0)
        .attr('y', d => (d.y ?? 0) - (d.radius ?? DEFAULT_RADIUS) - 4)
    })

    return () => {
      simulation.stop()
      nodeSelection.on('click', null)
      nodeSelection.on('.drag', null)
    }
  }, [svgRef, nodes, edges, width, height, nodeColor, edgeColor, onNodeClick])
}
