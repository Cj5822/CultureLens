import 'leaflet/dist/leaflet.css'
import { useCallback, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import * as L from 'leaflet'
import type { Feature, FeatureCollection } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import worldDataJson from 'world-atlas/countries-110m.json'
import { getCountryStyle, getHoverStyle } from '@/utils/mapStyle'
import { useDataContext } from '@/context/DataContext'
import type { CountryDataMap, WorldMapProps } from './types'

// Country name to ISO3 lookup for dynamic data highlighting
const NAME_TO_ISO3: Record<string, string> = {
  'finland':        'FIN',
  'norway':         'NOR',
  'greece':         'GRC',
  'italy':          'ITA',
  'germany':        'DEU',
  'serbia':         'SRB',
  'belgium':        'BEL',
  'france':         'FRA',
  'austria':        'AUT',
  'netherlands':    'NLD',
  'spain':          'ESP',
  'sweden':         'SWE',
  'poland':         'POL',
  'portugal':       'PRT',
  'uk':             'GBR',
  'united kingdom': 'GBR',
  'switzerland':    'CHE',
  'eu':             'BEL',
  'new zealand':    'NZL',
  'denmark':        'DNK',
  'croatia':        'HRV',
  'czech republic': 'CZE',
  'czechia':        'CZE',
  'hungary':        'HUN',
}

// world-atlas encodes country IDs as numeric ISO 3166-1 strings (e.g. "246" = Finland)
const NUMERIC_TO_ISO3: Record<string, string> = {
  '004': 'AFG', '008': 'ALB', '012': 'DZA', '024': 'AGO', '032': 'ARG',
  '036': 'AUS', '040': 'AUT', '050': 'BGD', '056': 'BEL', '068': 'BOL',
  '076': 'BRA', '100': 'BGR', '104': 'MMR', '116': 'KHM', '120': 'CMR',
  '124': 'CAN', '144': 'LKA', '152': 'CHL', '156': 'CHN', '170': 'COL',
  '178': 'COG', '180': 'COD', '188': 'CRI', '191': 'HRV', '192': 'CUB',
  '196': 'CYP', '203': 'CZE', '208': 'DNK', '218': 'ECU', '818': 'EGY',
  '222': 'SLV', '231': 'ETH', '233': 'EST', '246': 'FIN', '250': 'FRA',
  '266': 'GAB', '276': 'DEU', '288': 'GHA', '300': 'GRC', '320': 'GTM',
  '332': 'HTI', '340': 'HND', '348': 'HUN', '356': 'IND', '360': 'IDN',
  '364': 'IRN', '368': 'IRQ', '372': 'IRL', '376': 'ISR', '380': 'ITA',
  '384': 'CIV', '388': 'JAM', '392': 'JPN', '400': 'JOR', '398': 'KAZ',
  '404': 'KEN', '408': 'PRK', '410': 'KOR', '414': 'KWT', '418': 'LAO',
  '422': 'LBN', '428': 'LVA', '430': 'LBR', '434': 'LBY', '440': 'LTU',
  '442': 'LUX', '450': 'MDG', '458': 'MYS', '466': 'MLI', '484': 'MEX',
  '504': 'MAR', '508': 'MOZ', '516': 'NAM', '524': 'NPL', '528': 'NLD',
  '554': 'NZL', '558': 'NIC', '562': 'NER', '566': 'NGA', '578': 'NOR',
  '586': 'PAK', '591': 'PAN', '604': 'PER', '608': 'PHL', '616': 'POL',
  '620': 'PRT', '630': 'PRI', '642': 'ROU', '643': 'RUS', '646': 'RWA',
  '682': 'SAU', '686': 'SEN', '694': 'SLE', '703': 'SVK', '705': 'SVN',
  '706': 'SOM', '710': 'ZAF', '724': 'ESP', '729': 'SDN', '752': 'SWE',
  '756': 'CHE', '760': 'SYR', '762': 'TJK', '764': 'THA', '768': 'TGO',
  '792': 'TUR', '800': 'UGA', '804': 'UKR', '784': 'ARE', '826': 'GBR',
  '840': 'USA', '858': 'URY', '860': 'UZB', '862': 'VEN', '704': 'VNM',
  '887': 'YEM', '894': 'ZMB', '716': 'ZWE', '688': 'SRB', '070': 'BIH',
  '807': 'MKD', '499': 'MNE',
}

const ANTIMERIDIAN_FILTER_IDS = new Set([
  242, // Fiji
  296, // Kiribati
  10,  // Antarctica
])

function normalizeRing(ring: number[][]): number[][] {
  if (!ring.length) return ring
  const result: number[][] = [[...ring[0]]]
  for (let i = 1; i < ring.length; i++) {
    let lon = ring[i][0]
    const prev = result[i - 1][0]
    while (lon - prev > 180) lon -= 360
    while (prev - lon > 180) lon += 360
    result.push([lon, ring[i][1]])
  }
  return result
}

function fixAntimeridian(f: Feature): Feature {
  const geom = f.geometry
  if (!geom) return f
  if (geom.type === 'Polygon') {
    return { ...f, geometry: { ...geom, coordinates: geom.coordinates.map(normalizeRing) } }
  }
  if (geom.type === 'MultiPolygon') {
    return {
      ...f,
      geometry: {
        ...geom,
        coordinates: geom.coordinates.map((poly: number[][][]) => poly.map(normalizeRing)),
      },
    }
  }
  return f
}

const ANTIMERIDIAN_FIX_IDS = new Set([
  643, // Russia
  840, // United States
])

const worldData = worldDataJson as unknown as Topology
const rawGeoData = feature(
  worldData,
  (worldData as unknown as { objects: { countries: Parameters<typeof feature>[1] } }).objects.countries,
) as FeatureCollection

const geoData: FeatureCollection = {
  type: 'FeatureCollection',
  features: rawGeoData.features
    .filter(f => !ANTIMERIDIAN_FILTER_IDS.has(Number(f.id)))
    .map(f => ANTIMERIDIAN_FIX_IDS.has(Number(f.id)) ? fixAntimeridian(f) : f),
}

export function WorldMap({
  width = '100%',
  height = '100vh',
  className,
  onCountryClick,
  children,
}: WorldMapProps) {
  const { entities } = useDataContext()

  // Build dynamic CountryDataMap from loaded entities
  const dynamicCountryData = useMemo<CountryDataMap>(() => {
    const map: CountryDataMap = {}
    for (const entity of entities) {
      if (!entity.country) continue
      const iso3 = NAME_TO_ISO3[entity.country.toLowerCase().trim()]
      if (!iso3) continue
      if (!map[iso3]) {
        map[iso3] = { hasData: true, name: entity.country, entryCount: 0 }
      }
      map[iso3].entryCount = (map[iso3].entryCount ?? 0) + 1
    }
    return map
  }, [entities])

  const lastHovered = useRef<{ layer: L.Path; base: L.PathOptions } | null>(null)

  const styleFeature = useCallback(
    (f: Feature | undefined): L.PathOptions => {
      const numStr = f?.id != null ? String(f.id).padStart(3, '0') : undefined
      const iso3 = numStr ? NUMERIC_TO_ISO3[numStr] : undefined
      return getCountryStyle(iso3, dynamicCountryData)
    },
    [dynamicCountryData],
  )

  const onEachFeature = useCallback(
    (f: Feature, layer: L.Layer) => {
      const numStr = f.id != null ? String(f.id).padStart(3, '0') : undefined
      const iso3 = numStr ? NUMERIC_TO_ISO3[numStr] : undefined
      const entry = iso3 ? dynamicCountryData[iso3] : undefined
      const base = getCountryStyle(iso3, dynamicCountryData)

      if (entry) {
        const count = entry.entryCount ?? 0
        const tooltipHtml = entry.hasData
          ? `<strong>${entry.name}</strong><br/>${count} ${count === 1 ? 'entry' : 'entries'}`
          : entry.name
        ;(layer as L.Path).bindTooltip(tooltipHtml, {
          sticky: true,
          className: 'cl-map-tooltip',
          direction: 'top',
          offset: [0, -4],
        })
      }

      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          const target = e.target as L.Path
          if (lastHovered.current && lastHovered.current.layer !== target) {
            lastHovered.current.layer.setStyle(lastHovered.current.base)
          }
          target.setStyle(getHoverStyle(base))
          lastHovered.current = { layer: target, base }
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            target.bringToFront()
          }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const target = e.target as L.Path
          target.setStyle(base)
          if (lastHovered.current?.layer === target) lastHovered.current = null
        },
        click: () => {
          if (iso3 && entry && onCountryClick) {
            onCountryClick(iso3, entry.name)
          }
        },
      })
    },
    [dynamicCountryData, onCountryClick],
  )

  return (
    <MapContainer
      center={[54, 15]}
      zoom={3}
      minZoom={2}
      maxZoom={10}
      maxBounds={[[-90, -180], [90, 180]]}
      style={{ height, width }}
      className={className}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      <GeoJSON
        data={geoData}
        style={styleFeature}
        onEachFeature={onEachFeature}
        key={`world-atlas-${entities.length}`}
      />
      {children}
    </MapContainer>
  )
}

export default WorldMap
