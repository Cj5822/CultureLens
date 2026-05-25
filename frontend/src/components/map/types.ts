export type CountryDataMap = {
  [iso3: string]: {
    hasData: boolean
    name: string
    /** Matches a value in PARTNER_REGIONS from mockData.ts */
    partnerRegion?: string
    entryCount?: number
  }
}

export interface WorldMapProps {
  width?: string
  height?: string
  className?: string
  onCountryClick?: (countryCode: string, name: string) => void
  /** Components rendered inside the MapContainer (e.g. EntityMarkers) */
  children?: React.ReactNode
}
