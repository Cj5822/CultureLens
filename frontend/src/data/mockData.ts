import type { Stakeholder, Instrument } from "../types/entities";

export const PARTNER_REGIONS = [
  "EU",
  "Finland",
  "Norway",
  "New Zealand & Pacific",
  "Italy",
  "Greece",
  "Germany",
  "Serbia",
] as const;

// Mock data has been removed — all data is now loaded via Excel import.
export const mockStakeholders: Stakeholder[] = [];
export const mockInstruments: Instrument[] = [];
export const mockEntities: (Stakeholder | Instrument)[] = [];
