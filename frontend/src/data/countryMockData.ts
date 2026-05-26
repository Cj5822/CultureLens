import type { CountryDataMap } from '@/components/map/types'
import { PARTNER_REGIONS } from './mockData'

// PARTNER_REGIONS = ["EU","Finland","Norway","New Zealand & Pacific","Italy","Greece","Germany","Serbia"]
const [EU, Finland, Norway, NewZealand, Italy, Greece, Germany, Serbia] = PARTNER_REGIONS

export const countryData: CountryDataMap = {
  // Partner countries — entry counts: stakeholders + instruments per region
  BEL: { hasData: true, name: 'Belgium',     partnerRegion: EU,          entryCount: 4 },
  FIN: { hasData: true, name: 'Finland',     partnerRegion: Finland,     entryCount: 5 },
  NOR: { hasData: true, name: 'Norway',      partnerRegion: Norway,      entryCount: 6 },
  NZL: { hasData: true, name: 'New Zealand', partnerRegion: NewZealand,  entryCount: 5 },
  ITA: { hasData: true, name: 'Italy',       partnerRegion: Italy,       entryCount: 6 },
  GRC: { hasData: true, name: 'Greece',      partnerRegion: Greece,      entryCount: 5 },
  DEU: { hasData: true, name: 'Germany',     partnerRegion: Germany,     entryCount: 5 },
  SRB: { hasData: true, name: 'Serbia',      partnerRegion: Serbia,      entryCount: 6 },

  // Context countries — included for map completeness, no INTRACOMP data
  FRA: { hasData: false, name: 'France' },
  GBR: { hasData: false, name: 'United Kingdom' },
  SWE: { hasData: false, name: 'Sweden' },
  DNK: { hasData: false, name: 'Denmark' },
  POL: { hasData: false, name: 'Poland' },
  AUT: { hasData: false, name: 'Austria' },
  CHE: { hasData: false, name: 'Switzerland' },
  ESP: { hasData: false, name: 'Spain' },
  PRT: { hasData: false, name: 'Portugal' },
  HRV: { hasData: false, name: 'Croatia' },
  CZE: { hasData: false, name: 'Czech Republic' },
  HUN: { hasData: false, name: 'Hungary' },
}
