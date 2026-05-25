import type { PathOptions } from 'leaflet'
import type { CountryDataMap } from '@/components/map/types'

const PARTNER_FILL = '#4f86c6'
const PARTNER_FILL_OPACITY = 0.6
const PARTNER_BORDER = '#2c5f8a'
const PARTNER_BORDER_WEIGHT = 1.5

const NON_PARTNER_FILL = '#b0b0b0'
const NON_PARTNER_FILL_OPACITY = 0.3
const NON_PARTNER_BORDER = '#888888'
const NON_PARTNER_BORDER_WEIGHT = 0.5

export function getCountryStyle(
  iso3: string | undefined,
  data: CountryDataMap,
): PathOptions {
  const entry = iso3 ? data[iso3] : undefined

  if (entry?.hasData) {
    return {
      fillColor: PARTNER_FILL,
      fillOpacity: PARTNER_FILL_OPACITY,
      color: PARTNER_BORDER,
      weight: PARTNER_BORDER_WEIGHT,
    }
  }

  return {
    fillColor: NON_PARTNER_FILL,
    fillOpacity: NON_PARTNER_FILL_OPACITY,
    color: NON_PARTNER_BORDER,
    weight: NON_PARTNER_BORDER_WEIGHT,
  }
}

export function getHoverStyle(currentStyle: PathOptions): PathOptions {
  return {
    ...currentStyle,
    fillOpacity: Math.min((currentStyle.fillOpacity ?? 0) + 0.2, 1),
    weight: 2.5,
    color: '#ffffff',
  }
}
