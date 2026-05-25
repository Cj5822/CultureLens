import type { Entity } from '@/types/entities'
import type { GraphData, GraphEdge, GraphNode } from '@/types/graph'

// ─── buildGraphData ────────────────────────────────────────────────────────────

/**
 * Converts a flat entity array into a GraphData structure suitable for D3
 * force-directed rendering.
 *
 * Guarantees:
 *  - Every entity produces exactly one node (isolated nodes included).
 *  - Edges are undirected: A→B and B→A collapse into one edge.
 *  - References to IDs not present in `entities` are silently ignored.
 *  - Node and edge arrays are in stable, deterministic order (insertion order
 *    of the input array, then lexicographic edge key order).
 *  - No mutations to input data.
 */
export function buildGraphData(entities: Entity[]): GraphData {
  // O(1) existence check for connection targets
  const entityIds = new Set<string>(entities.map(e => e.id))

  // ── Nodes ──────────────────────────────────────────────────────────────────
  const nodes: GraphNode[] = entities.map(entity => {
    const base: GraphNode = {
      id:              entity.id,
      label:           entity.name,
      category:        entity.category as 'stakeholders' | 'instruments',
      impactInfluence: entity.impactInfluence,
      country:         entity.country,
    }

    if (entity.category === 'stakeholders') {
      return { ...base, actorType: entity.actorType }
    }

    // instruments
    return { ...base, instrumentType: entity.instrumentType }
  })

  // ── Edges (undirected deduplication) ──────────────────────────────────────
  // Normalise each connection pair so that the lexicographically smaller ID
  // always comes first. This maps both A→B and B→A to the same key.
  const edgeSet = new Set<string>()
  const edges: GraphEdge[] = []

  for (const entity of entities) {
    for (const connId of entity.connections) {
      // Skip references to entities not in the input set
      if (!entityIds.has(connId)) continue

      // Normalise direction for undirected deduplication
      const [a, b] = entity.id < connId
        ? [entity.id, connId]
        : [connId, entity.id]

      const key = `${a}|${b}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        // Preserve original direction (source = entity that declared the connection)
        edges.push({ source: entity.id, target: connId })
      }
    }
  }

  return { nodes, edges }
}
