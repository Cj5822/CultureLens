export type ActorType =
  | "academia"
  | "civil society"
  | "government"
  | "NGO"
  | "administration"
  | "private sector"
  | "other";

export type InstrumentType =
  | "law"
  | "guideline"
  | "petition"
  | "initiative"
  | "strategy"
  | "other";

export type ImpactInfluence =
  | "symbolic"
  | "advisory"
  | "binding"
  | "highly influential";

export type ImplementationStatus =
  | "draft"
  | "development"
  | "implementation"
  | "evaluation"
  | "archive";

export type RecommendedNextSteps =
  | "engage"
  | "contact"
  | "monitor"
  | "no action";

export type ThematicFocus =
  | "Inter- and Transcultural Competences"
  | "Inter- and Transculturality"
  | "Education"
  | "Culture"
  | "Migration"
  | "Climate"
  | "Other";

export type GeographicalScope =
  | "local"
  | "regional"
  | "cross-regional"
  | "national"
  | "local and regional"
  | "local and cross-regional"
  | "regional and national"
  | "cross-regional and national"
  | "local and national"
  | "all of the above";

export interface BaseEntity {
  id: string;
  name: string;
  category: string;
  thematicFocus: ThematicFocus[];
  geographicalScope: GeographicalScope[];
  /** max 100 characters */
  link: string;
  impactInfluence: ImpactInfluence;
  /** IDs referencing other Stakeholder or Instrument entries */
  connections: string[];
  recommendedNextSteps: RecommendedNextSteps;
  /** max 500 characters */
  additionalRemarks: string;
  languages: string[];
  /** max 500 characters */
  equityAddressed: string;
  /** max 100 characters */
  intendedAudience: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Stakeholder extends BaseEntity {
  category: "stakeholders";
  actorType: ActorType;
  /** max 500 characters */
  description: string;
  /** max 200 characters */
  relevanceToINTRACOMP: string;
  /** max 500 characters */
  relationToITC: string;
}

export interface Instrument extends BaseEntity {
  category: "instruments";
  instrumentType: InstrumentType;
  /** max 100 characters */
  responsibleInstitution: string;
  /** max 500 characters */
  mainObjectives: string;
  implementationStatus: ImplementationStatus;
  /** max 200 characters */
  relevanceToINTRACOMP: string;
}

export type Entity = Stakeholder | Instrument;
