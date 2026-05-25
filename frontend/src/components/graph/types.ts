import type { SimulationNodeDatum } from 'd3'

export interface GraphNode {
  id: string
  label?: string
  type?: string
  radius?: number
  color?: string
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

export interface GraphEdge {
  source: string
  target: string
  label?: string
  weight?: number
}

export interface ForceGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width?: number
  height?: number
  className?: string
  nodeColor?: string
  edgeColor?: string
  backgroundColor?: string
  onNodeClick?: (node: GraphNode) => void
}

// D3 adds runtime simulation fields to each node datum
export type SimulationNode = GraphNode & SimulationNodeDatum

// D3 mutates source/target from string IDs to full node objects after forceLink initialises
export interface SimulationEdge extends Omit<GraphEdge, 'source' | 'target'> {
  source: SimulationNode | string
  target: SimulationNode | string
  index?: number
}
