import type { ActorType, ImpactInfluence, InstrumentType } from '@/types/entities'

// ─── Graph data model ──────────────────────────────────────────────────────────

export interface GraphNode {
  id: string
  label: string
  category: 'stakeholders' | 'instruments'
  impactInfluence: ImpactInfluence
  actorType?: ActorType
  instrumentType?: InstrumentType
  country: string
}

export interface GraphEdge {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
