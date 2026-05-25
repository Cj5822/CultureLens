import { useEffect, useRef, useMemo } from 'react'
import { useMap } from 'react-leaflet'
import * as L from 'leaflet'
import type { Entity } from '@/types/entities'
import { createStakeholderIcon, createInstrumentIcon } from './icons'

export interface EntityMarkersProps {
  entities: Entity[]
  selectedId?: string | null
  highlightedIds?: string[]
  onMarkerClick?: (entity: Entity) => void
}

// ─── Jitter helpers ────────────────────────────────────────────────────────────

/** Round to 2 dp for cluster detection (0.01° ≈ 1 km at mid-latitudes) */
function clusterKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`
}

/**
 * Returns a map from entity ID → jittered [lat, lng].
 * Entities that share a coordinate cluster (within 0.01°) are spread diagonally
 * so they don't stack on top of each other and cause hover conflicts.
 */
function buildPositions(entities: Entity[]): Map<string, [number, number]> {
  // Group entities into clusters by rounded coordinate
  const clusters = new Map<string, Entity[]>()
  for (const entity of entities) {
    const key = clusterKey(entity.lat, entity.lng)
    const group = clusters.get(key) ?? []
    group.push(entity)
    clusters.set(key, group)
  }

  // Spread each cluster with a small diagonal offset per index
  const positions = new Map<string, [number, number]>()
  for (const group of clusters.values()) {
    group.forEach((entity, i) => {
      const jitter = (val: number, index: number) => val + index * 0.015
      positions.set(entity.id, [jitter(entity.lat, i), jitter(entity.lng, i)])
    })
  }
  return positions
}

// ─── EntityMarkers ─────────────────────────────────────────────────────────────

/**
 * Renders all entities as interactive Leaflet markers using the imperative API.
 * Must be mounted inside a react-leaflet <MapContainer>.
 *
 * Why imperative (useEffect + L.featureGroup) instead of declarative <Marker>:
 *  - A single FeatureGroup lets us call clearLayers() atomically before rebuilding,
 *    preventing duplicate or orphaned marker nodes during React re-renders.
 *  - Events are bound exactly once per marker creation — no rebinding on re-render.
 *  - StrictMode double-mount is handled by the two-effect pattern below.
 *  - bubblingMouseEvents + stopPropagation eliminates flicker on overlapping markers.
 *  - bringToFront() ensures markers always sit above the GeoJSON country layer.
 */
export function EntityMarkers({
  entities,
  selectedId,
  highlightedIds,
  onMarkerClick,
}: EntityMarkersProps) {
  const map = useMap()

  // The FeatureGroup is created once and lives for the component's lifetime.
  const layerRef = useRef<L.FeatureGroup | null>(null)

  const hasHighlights = (highlightedIds?.length ?? 0) > 0
  const highlightSet = useMemo(
    () => new Set(highlightedIds ?? []),
    [highlightedIds],
  )

  // ── Main render effect ───────────────────────────────────────────────────────
  // Rebuilds the marker set whenever the entity list or selection state changes.
  // The cleanup clears all markers but keeps the FeatureGroup on the map, which
  // is safe for both normal re-renders and React StrictMode's double-invoke.
  useEffect(() => {
    // Create the FeatureGroup exactly once and add it to the map
    if (!layerRef.current) {
      layerRef.current = L.featureGroup().addTo(map)
    }
    const layer = layerRef.current

    // ── Clear previous markers before rebuilding ─────────────────────────────
    layer.clearLayers()

    const positions = buildPositions(entities)

    for (const entity of entities) {
      const selected = entity.id === selectedId
      const dimmed = hasHighlights && !selected && !highlightSet.has(entity.id)

      const pos: [number, number] =
        positions.get(entity.id) ?? [entity.lat, entity.lng]

      const icon =
        entity.category === 'stakeholders'
          ? createStakeholderIcon(entity, selected, dimmed)
          : createInstrumentIcon(entity, selected, dimmed)

      // ── Create marker — bubblingMouseEvents: false prevents the event from
      //    reaching the map or markers underneath this one ─────────────────────
      const marker = L.marker(pos, {
        icon,
        zIndexOffset: selected ? 1000 : 0,
        bubblingMouseEvents: false,
      })

      // ── Tooltip ──────────────────────────────────────────────────────────────
      const subtype =
        entity.category === 'stakeholders'
          ? entity.actorType
          : entity.instrumentType

      marker.bindTooltip(
        `<strong>${entity.name}</strong><br/>${entity.category} · ${subtype}<br/>Impact: ${entity.impactInfluence}`,
        {
          sticky: true,
          direction: 'top',
          offset: [0, -8],
          className: 'cl-map-tooltip',
        },
      )

      // ── Popup ─────────────────────────────────────────────────────────────────
      marker.bindPopup(`
        <div class="cl-popup-content">
          <p class="cl-popup-name">${entity.name}</p>
          <p class="cl-popup-meta">${entity.country}</p>
          <p class="cl-popup-row"><strong>Thematic focus:</strong> ${entity.thematicFocus.join(', ')}</p>
          <p class="cl-popup-row"><strong>Next steps:</strong> ${entity.recommendedNextSteps}</p>
        </div>
      `)

      // ── Events — bound exactly once per marker, never rebound on re-render ───
      marker.on('mouseover', (e: L.LeafletMouseEvent) => {
        // Stop the event reaching markers underneath (fixes flicker on overlap)
        L.DomEvent.stopPropagation(e)
        marker.openTooltip()
      })

      marker.on('mouseout', () => {
        marker.closeTooltip()
      })

      marker.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e)
        onMarkerClick?.(entity)
      })

      layer.addLayer(marker)
    }

    // ── Ensure markers sit above the GeoJSON country layer ───────────────────
    // FeatureGroup.bringToFront() calls invoke('bringToFront') on each child;
    // Leaflet's invoke() skips layers that lack the method, so this is safe.
    layer.bringToFront()

    // Cleanup for StrictMode double-mount: clear markers but keep the group on
    // the map so the next setup run can reuse the same FeatureGroup.
    return () => {
      layer.clearLayers()
    }
  }, [entities, selectedId, hasHighlights, highlightSet, onMarkerClick, map])

  // ── Unmount cleanup ──────────────────────────────────────────────────────────
  // Runs only when the component is fully removed from the tree.
  // Removes the FeatureGroup from the map and resets the ref so a future
  // remount creates a fresh group.
  useEffect(() => {
    return () => {
      if (layerRef.current) {
        layerRef.current.clearLayers()
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  }, [map])

  // This component manages its own Leaflet layers — no React DOM output needed
  return null
}
