/**
 * PartnerCountriesLayer.tsx
 *
 * Renders GeoJSON country polygons on a React Leaflet map, visually
 * distinguishing the 8 INTRACOMP partner regions from non-partner countries.
 *
 * Props:
 *   geoJsonData        — a full world GeoJSON FeatureCollection
 *   countryEntryCounts — map of country name → number of entries (for density styling)
 *
 * Architecture note:
 * All styling logic lives in mapStyles.ts. This component is intentionally
 * thin — it handles rendering and interaction wiring only. Future additions
 * (filter callbacks, clustering overlays, data layers) should extend the props
 * interface without touching the style utilities.
 */

import { useRef, useCallback } from 'react';
import { GeoJSON as GeoJSONLayer } from 'react-leaflet';
import type * as L from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';

import {
  PARTNER_COUNTRIES,
  getCountryStyle,
  getFeatureName,
  highlightFeature,
  resetHighlight,
} from '../utils/mapStyles';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PartnerCountriesLayerProps {
  geoJsonData: FeatureCollection;
  countryEntryCounts: Record<string, number>;
  /** Optional callback fired when a partner country is clicked. */
  onCountryClick?: (countryName: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PartnerCountriesLayer({
  geoJsonData,
  countryEntryCounts,
  onCountryClick,
}: PartnerCountriesLayerProps) {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  /**
   * Style function passed to react-leaflet's GeoJSON component.
   * Called once per feature during initial render and on reset.
   */
  const styleFeature = useCallback(
    (feature: Feature | undefined): L.PathOptions =>
      getCountryStyle(feature, countryEntryCounts),
    [countryEntryCounts],
  );

  /**
   * Wires up hover and click handlers for each rendered feature layer.
   * Structured so future filtering callbacks can be added via onCountryClick.
   */
  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const name = getFeatureName(feature);
      const isPartner = PARTNER_COUNTRIES.has(
        name as Parameters<typeof PARTNER_COUNTRIES.has>[0],
      );
      const entryCount = countryEntryCounts[name] ?? 0;

      // Tooltip: shown on hover for partner countries only
      if (isPartner) {
        const tooltipContent = `<strong>${name}</strong><br/>${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`;
        (layer as L.Path).bindTooltip(tooltipContent, {
          sticky: true,
          className: 'cl-map-tooltip',
          direction: 'top',
          offset: [0, -4],
        });
      }

      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          highlightFeature(e);
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          if (geoJsonRef.current) {
            resetHighlight(geoJsonRef.current)(e);
          }
        },
        click: () => {
          // Log for now; structured for easy extension via onCountryClick prop
          console.log(`[PartnerCountriesLayer] selected: ${name}`);
          if (isPartner && onCountryClick) {
            onCountryClick(name);
          }
        },
      });
    },
    [countryEntryCounts, onCountryClick],
  );

  return (
    <GeoJSONLayer
      ref={geoJsonRef}
      data={geoJsonData}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
}
