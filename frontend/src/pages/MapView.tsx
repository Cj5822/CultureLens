import { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import type { FeatureCollection } from 'geojson';
import { PartnerCountriesLayer } from '@/features/map/components/PartnerCountriesLayer';
import { getStakeholders, getInstruments } from '@/services/dataService';
import type { FilterState } from '@/types';

// datasets/geo-countries — uses `ADMIN` property for country name.
// mapStyles.ts handles this via getFeatureName().
const WORLD_GEOJSON_URL =
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

interface MapViewProps {
  filters: FilterState;
}

export function MapView({ filters }: MapViewProps) {
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [geoError, setGeoError] = useState(false);
  const [entryCounts, setEntryCounts] = useState<Record<string, number>>({});

  // Load world GeoJSON once
  useEffect(() => {
    fetch(WORLD_GEOJSON_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<FeatureCollection>;
      })
      .then(setGeoJson)
      .catch((err) => {
        console.error('[MapView] Failed to load world GeoJSON:', err);
        setGeoError(true);
      });
  }, []);

  // Recompute entry counts whenever the country filter changes
  useEffect(() => {
    const countryFilter =
      filters.country !== 'All' ? { country: filters.country } : undefined;

    Promise.all([
      getStakeholders(countryFilter),
      getInstruments(countryFilter),
    ]).then(([stakeholders, instruments]) => {
      const counts: Record<string, number> = {};
      for (const entry of [...stakeholders, ...instruments]) {
        counts[entry.country] = (counts[entry.country] ?? 0) + 1;
      }
      setEntryCounts(counts);
    });
  }, [filters.country]);

  return (
    <div className="cl-page">
      <div className="cl-page-card">
        <h2 className="cl-page-title">European Research Network</h2>

        {geoError ? (
          <div className="cl-page-placeholder">
            <span className="cl-page-placeholder-label">Map unavailable</span>
            <p className="cl-page-placeholder-hint">
              Could not load world GeoJSON. Check your network connection.
            </p>
          </div>
        ) : (
          <div className="cl-map-wrap">
            <MapContainer
              center={[54, 15]}
              zoom={3}
              minZoom={2}
              maxZoom={8}
              style={{ height: '100%', width: '100%' }}
              zoomControl
              attributionControl={false}
            >
              {geoJson && (
                <PartnerCountriesLayer
                  geoJsonData={geoJson}
                  countryEntryCounts={entryCounts}
                />
              )}
            </MapContainer>

            {/* Legend */}
            <div className="cl-map-legend">
              <span className="cl-map-legend-item cl-map-legend-item--partner">
                Partner region
              </span>
              <span className="cl-map-legend-item cl-map-legend-item--other">
                Other
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
