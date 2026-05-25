import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import type { ForceGraphProps } from './types'
import { useForceSimulation } from './useForceSimulation'

export function ForceGraph({
  nodes,
  edges,
  width = 800,
  height = 600,
  className,
  nodeColor = '#6366f1',
  edgeColor = '#94a3b8',
  backgroundColor = '#0f172a',
  onNodeClick,
}: ForceGraphProps) {
  // Single SVG ref — D3 owns all SVG DOM after mount
  const svgRef = useRef<SVGSVGElement>(null)

  // Zoom and pan — set up once on mount, independent of data
  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const svg = d3.select<SVGSVGElement, unknown>(svgEl)
    const zoomLayer = svg.select<SVGGElement>('.zoom-layer')

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .on('zoom', event => {
        zoomLayer.attr('transform', (event.transform as d3.ZoomTransform).toString())
      })

    svg.call(zoom)

    return () => {
      svg.on('.zoom', null)
    }
  }, [])

  useForceSimulation(svgRef, nodes, edges, { width, height, nodeColor, edgeColor, onNodeClick })

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', background: backgroundColor }}
    >
      {/* zoom-layer receives the pan/zoom transform; D3 populates its children */}
      <g className="zoom-layer" />
    </svg>
  )
}

export default ForceGraph

// Example usage:
// const nodes: GraphNode[] = [
//   { id: "1", label: "Node A", type: "stakeholder", color: "#4f86c6" },
//   { id: "2", label: "Node B", type: "instrument", color: "#e07b39" },
//   { id: "3", label: "Node C", type: "stakeholder" },
// ]
// const edges: GraphEdge[] = [
//   { source: "1", target: "2", weight: 2 },
//   { source: "2", target: "3" },
// ]
//
// <ForceGraph
//   nodes={nodes}
//   edges={edges}
//   width={900}
//   height={600}
//   onNodeClick={(node) => console.log("Clicked:", node)}
// />
