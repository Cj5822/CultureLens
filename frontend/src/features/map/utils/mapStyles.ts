/**
 * mapStyles.ts
 *
 * Styling logic and constants for the INTRACOMP partner countries map layer.
 * Keeps all visual configuration in one place, separate from rendering logic.
 */

import * as L from 'leaflet';
import type { Feature } from 'geojson';

// ─── Partner region registry ──────────────────────────────────────────────────

/**
 * Canonical set of INTRACOMP partner country/region names.
 * These must match the `name` property values in the GeoJSON source.
 */
export const PARTNER_COUNTRIES = new Set([
  'Finland',
  'Norway',
  'Italy',
  'Greece',
  'Germany',
  'Serbia',
  'New Zealand',
  // EU is handled as an overlay rather than a sovereign GeoJSON feature,
  // but included here for filter logic.
  'European Union',
] as const);

// ─── Style constants ──────────────────────────────────────────────────────────

/** Muted teal-blue used for partner country fill — academic/research aesthetic. */
const PARTNER_FILL = '#5b8db8';
const PARTNER_FILL_OPACITY = 0.45;

/** Neutral grey for non-partner countries. */
const NON_PARTNER_FILL = '#c8cdd4';
const NON_PARTNER_FILL_OPACITY = 0.3;

/** Shared border style. */
const BORDER_COLOR = '#ffffff';
const BORDER_WEIGHT = 1;
const BORDER_OPACITY = 0.7;

/** Hover overlay applied on top of the partner fill. */
const HOVER_BORDER_WEIGHT = 2.5;
const HOVER_FILL_OPACITY = 0.65;

// ─── Property name resolution ─────────────────────────────────────────────────

/**
 * Extracts the country name from a GeoJSON feature's properties.
 * Checks common property names across popular world GeoJSON datasets:
 *   'ADMIN' — datasets/geo-countries
 *   'name'  — D3 / Natural Earth variants
 *   'NAME'  — Natural Earth direct exports
 */
export function getFeatureName(feature: Feature | undefined): string {
  const p = feature?.properties;
  if (!p) return '';
  return (
    (p['ADMIN'] as string | undefined) ??
    (p['name'] as string | undefined) ??
    (p['NAME'] as string | undefined) ??
    ''
  );
}

// ─── Style functions ──────────────────────────────────────────────────────────

/**
 * Returns Leaflet PathOptions for a given GeoJSON feature.
 * Partner countries receive a distinct muted highlight;
 * non-partner countries are rendered in reduced-opacity grey.
 */
export function getCountryStyle(
  feature: Feature | undefined,
  countryEntryCounts: Record<string, number>,
): L.PathOptions {
  const name = getFeatureName(feature);
  const isPartner = PARTNER_COUNTRIES.has(name as Parameters<typeof PARTNER_COUNTRIES.has>[0]);
  const entryCount = countryEntryCounts[name] ?? 0;

  if (isPartner) {
    // Slightly increase fill opacity for countries with more entries
    const densityOpacity = Math.min(
      PARTNER_FILL_OPACITY + entryCount * 0.02,
      0.75,
    );
    return {
      fillColor: PARTNER_FILL,
      fillOpacity: densityOpacity,
      color: BORDER_COLOR,
      weight: BORDER_WEIGHT,
      opacity: BORDER_OPACITY,
    };
  }

  return {
    fillColor: NON_PARTNER_FILL,
    fillOpacity: NON_PARTNER_FILL_OPACITY,
    color: BORDER_COLOR,
    weight: BORDER_WEIGHT,
    opacity: BORDER_OPACITY,
  };
}

/**
 * Applies hover highlight to a partner country layer.
 * Non-partner countries are intentionally left unstyled on hover.
 */
export function highlightFeature(e: L.LeafletMouseEvent): void {
  const layer = e.target as L.Path;
  const feature = (layer as L.Path & { feature?: Feature }).feature;
  const name = getFeatureName(feature);

  if (!PARTNER_COUNTRIES.has(name as Parameters<typeof PARTNER_COUNTRIES.has>[0])) return;

  layer.setStyle({
    weight: HOVER_BORDER_WEIGHT,
    fillOpacity: HOVER_FILL_OPACITY,
  });

  // bring to front unless on IE/Edge where this causes rendering artifacts
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

/**
 * Resets a layer to its original computed style via the parent GeoJSON layer.
 *
 * Usage in component:
 *   const reset = resetHighlight(geoJsonRef.current);
 *   layer.on('mouseout', reset);
 */
export function resetHighlight(
  geoJsonLayer: L.GeoJSON,
): (e: L.LeafletMouseEvent) => void {
  return (e: L.LeafletMouseEvent) => {
    geoJsonLayer.resetStyle(e.target as L.Layer);
  };
}
