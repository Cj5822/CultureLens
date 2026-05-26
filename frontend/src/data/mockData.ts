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

export const mockStakeholders: Stakeholder[] = [
  // --- EU ---
  {
    id: "STK-EU-001",
    name: "European Commission – DG EAC",
    category: "stakeholders",
    actorType: "government",
    description:
      "Directorate-General for Education, Youth, Sport and Culture within the European Commission, responsible for EU policy on intercultural learning and Erasmus+.",
    relevanceToINTRACOMP:
      "Key funder and policy architect for intercultural competence programmes across EU member states.",
    relationToITC:
      "Directly shapes ITC frameworks through Erasmus+ programme guidelines, LifeLong Learning strategies, and Council Recommendations on key competences.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["all of the above"],
    link: "https://example-ec.eu/dg-eac/intercultural",
    impactInfluence: "binding",
    connections: ["INS-EU-001", "INS-EU-002", "STK-EU-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Regular consultation windows open for civil society input during programming periods.",
    languages: ["English", "French", "German"],
    equityAddressed:
      "Addresses socioeconomic barriers to intercultural education through targeted Erasmus+ mobility grants for disadvantaged youth.",
    intendedAudience: "Policy makers, educational institutions, NGOs",
    country: "Belgium",
    lat: 50.8503,
    lng: 4.3517,
  },
  {
    id: "STK-EU-002",
    name: "Council of Europe – Education Department",
    category: "stakeholders",
    actorType: "administration",
    description:
      "Intergovernmental body promoting democratic citizenship and human rights education including intercultural dialogue across 46 member states.",
    relevanceToINTRACOMP:
      "Develops reference frameworks and tools for intercultural competence in formal and non-formal education.",
    relationToITC:
      "Authors the Reference Framework of Competences for Democratic Culture (RFCDC), which integrates ITC as a core dimension of democratic participation.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Inter- and Transculturality",
      "Education",
    ],
    geographicalScope: ["cross-regional and national"],
    link: "https://example-coe.int/education/itc-frameworks",
    impactInfluence: "highly influential",
    connections: ["INS-EU-001", "STK-EU-001", "STK-GR-001"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Maintains a network of national coordinators for RFCDC implementation.",
    languages: ["English", "French"],
    equityAddressed:
      "Promotes inclusion of minority and migrant communities in civic and cultural life through competence-based frameworks.",
    intendedAudience: "Educators, policy makers, youth workers",
    country: "Belgium",
    lat: 50.8503,
    lng: 4.3517,
  },

  // --- Finland ---
  {
    id: "STK-FI-001",
    name: "Finnish National Agency for Education (OPH)",
    category: "stakeholders",
    actorType: "administration",
    description:
      "National authority responsible for developing education, early childhood education, and vocational training in Finland, including multicultural curricula.",
    relevanceToINTRACOMP:
      "Integrates intercultural competence into national core curricula and teacher training standards.",
    relationToITC:
      "Mandates ITC outcomes in the National Core Curriculum for Basic Education and upper secondary programmes.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-oph.fi/intercultural-education",
    impactInfluence: "binding",
    connections: ["INS-FI-001", "INS-FI-002", "STK-FI-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Publishes annual reports on multicultural education outcomes across Finnish municipalities.",
    languages: ["Finnish", "Swedish", "English"],
    equityAddressed:
      "Targets Sámi and Roma communities with culturally responsive curriculum adaptations.",
    intendedAudience: "Teachers, school administrators, curriculum developers",
    country: "Finland",
    lat: 60.1699,
    lng: 24.9384,
  },
  {
    id: "STK-FI-002",
    name: "University of Helsinki – Faculty of Educational Sciences",
    category: "stakeholders",
    actorType: "academia",
    description:
      "Leading research faculty conducting studies on multicultural education, intercultural learning, and teacher competence in diverse school environments.",
    relevanceToINTRACOMP:
      "Produces empirical research directly informing INTRACOMP theoretical models and competence frameworks.",
    relationToITC:
      "Runs longitudinal studies on ITC development among pre-service teachers and publishes in international peer-reviewed journals.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["national", "cross-regional"],
    link: "https://example-helsinki.fi/edu/multicultural-research",
    impactInfluence: "advisory",
    connections: ["STK-FI-001", "INS-FI-002", "STK-NO-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Active partner in Nordic research consortia on intercultural education.",
    languages: ["Finnish", "English", "Swedish"],
    equityAddressed:
      "Research focuses on immigrant students' educational integration and equity in multilingual classrooms.",
    intendedAudience: "Researchers, teacher educators, policy makers",
    country: "Finland",
    lat: 60.4518,
    lng: 22.2666,
  },
  {
    id: "STK-FI-003",
    name: "Moniheli – Network for Multicultural Associations",
    category: "stakeholders",
    actorType: "NGO",
    description:
      "Umbrella network of over 100 multicultural and immigrant associations in Finland, advocating for cultural diversity and equal participation in civic life.",
    relevanceToINTRACOMP:
      "Bridges policy recommendations and grassroots intercultural practice across Finnish civil society.",
    relationToITC:
      "Facilitates community-led intercultural dialogue workshops and training programmes aligned with national ITC goals.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Migration"],
    geographicalScope: ["national"],
    link: "https://example-moniheli.fi/en/itc-programmes",
    impactInfluence: "symbolic",
    connections: ["INS-FI-001", "STK-FI-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Offers co-design partnerships for intercultural training materials.",
    languages: ["Finnish", "English", "Arabic", "Somali"],
    equityAddressed:
      "Specifically supports African and Middle Eastern diaspora communities in accessing cultural and civic participation.",
    intendedAudience: "Immigrant communities, NGO workers, local authorities",
    country: "Finland",
    lat: 61.4978,
    lng: 23.7610,
  },

  // --- Norway ---
  {
    id: "STK-NO-001",
    name: "Norwegian Directorate for Education and Training (Udir)",
    category: "stakeholders",
    actorType: "administration",
    description:
      "Norwegian national agency responsible for developing the national curriculum and teacher education frameworks, including intercultural dimensions.",
    relevanceToINTRACOMP:
      "Implements intercultural competence standards in Norwegian schools through the renewed national curriculum (Fagfornyelsen).",
    relationToITC:
      "The 2020 curriculum renewal explicitly introduced interdisciplinary themes including democracy and citizenship with ITC at the core.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-udir.no/itc-curriculum",
    impactInfluence: "binding",
    connections: ["INS-NO-001", "INS-NO-002", "STK-NO-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Collaborates with Sámi Parliament on indigenous education rights integration.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Provides resources for indigenous Sámi language and cultural competence in the national curriculum.",
    intendedAudience: "Schools, teachers, curriculum coordinators",
    country: "Norway",
    lat: 59.9139,
    lng: 10.7522,
  },
  {
    id: "STK-NO-002",
    name: "OsloMet – Oslo Metropolitan University",
    category: "stakeholders",
    actorType: "academia",
    description:
      "Urban university with strong research profiles in migration studies, multicultural education, and social work in diverse urban contexts.",
    relevanceToINTRACOMP:
      "Key academic partner for research on ITC in vocational and higher education contexts.",
    relationToITC:
      "Hosts the Centre for the Study of Professions with research streams on intercultural communication in professional settings.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["regional", "national"],
    link: "https://example-oslomet.no/research/ite-competences",
    impactInfluence: "advisory",
    connections: ["STK-NO-001", "INS-NO-002", "STK-FI-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Publishes the Nordic Journal of Intercultural Education Research.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Research addresses gender and class intersections with migration in Norwegian educational contexts.",
    intendedAudience: "Researchers, practitioners, policy makers",
    country: "Norway",
    lat: 60.3913,
    lng: 5.3221,
  },
  {
    id: "STK-NO-003",
    name: "Antirasistisk Senter (Anti-Racist Centre)",
    category: "stakeholders",
    actorType: "civil society",
    description:
      "Norwegian civil society organisation working to combat racism and discrimination through education, advocacy, and intercultural dialogue programmes.",
    relevanceToINTRACOMP:
      "Provides frontline intercultural competence training and anti-bias education in schools and workplaces.",
    relationToITC:
      "Develops practical ITC tools and educational materials addressing racial equity and cultural inclusion in Norwegian institutions.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Migration"],
    geographicalScope: ["national"],
    link: "https://example-antirasistisk.no/education",
    impactInfluence: "symbolic",
    connections: ["INS-NO-001", "STK-NO-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Offers consulting services to municipalities on inclusive intercultural policies.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Focuses on Romani, Sámi, and immigrant communities facing systemic discrimination.",
    intendedAudience: "Schools, workplaces, municipalities",
    country: "Norway",
    lat: 63.4305,
    lng: 10.3951,
  },

  // --- New Zealand & Pacific ---
  {
    id: "STK-NZ-001",
    name: "New Zealand Ministry of Education – Te Kete Ipurangi",
    category: "stakeholders",
    actorType: "government",
    description:
      "New Zealand government ministry providing national educational resources, including bicultural and multicultural curriculum guidance through the TKI platform.",
    relevanceToINTRACOMP:
      "Integrates Māori and Pacific intercultural perspectives into the national curriculum through Te Ao Māori and Pacific Education frameworks.",
    relationToITC:
      "The New Zealand Curriculum explicitly positions cultural identity and languages as foundational to student wellbeing and intercultural competence.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["national"],
    link: "https://example-minedu.govt.nz/itc-curriculum",
    impactInfluence: "binding",
    connections: ["INS-NZ-001", "INS-NZ-002", "STK-NZ-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Maintains Te Kete Ipurangi as an open digital resource hub for bicultural education.",
    languages: ["English", "Māori"],
    equityAddressed:
      "Addresses educational achievement disparities for Māori and Pasifika students through culturally responsive pedagogy.",
    intendedAudience: "Teachers, school leaders, curriculum designers",
    country: "New Zealand",
    lat: -36.8485,
    lng: 174.7633,
  },
  {
    id: "STK-NZ-002",
    name: "Te Wānanga o Aotearoa",
    category: "stakeholders",
    actorType: "academia",
    description:
      "Pan-tribal Māori tertiary institution providing education grounded in Māori language, culture, and values, serving over 25,000 learners annually.",
    relevanceToINTRACOMP:
      "Represents an indigenous model of intercultural education centred on tikanga Māori and bicultural competence.",
    relationToITC:
      "Embeds ITC through immersive te reo Māori programmes and kaitiakitanga-based curricula that build cross-cultural understanding for all learners.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Culture",
      "Education",
    ],
    geographicalScope: ["national"],
    link: "https://example-twoa.ac.nz/itc-programmes",
    impactInfluence: "highly influential",
    connections: ["STK-NZ-001", "INS-NZ-001"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Collaborates with Pacific Island nations on regional intercultural education exchange.",
    languages: ["Māori", "English", "Samoan"],
    equityAddressed:
      "Prioritises Māori learner sovereignty and the revitalisation of indigenous language as equity intervention.",
    intendedAudience: "Māori learners, Pacific communities, educators",
    country: "New Zealand",
    lat: -37.787,
    lng: 175.2793,
  },
  {
    id: "STK-NZ-003",
    name: "Pacific Community (SPC) – Human Development Programme",
    category: "stakeholders",
    actorType: "administration",
    description:
      "Regional intergovernmental organisation supporting Pacific island countries and territories in education, health, and cultural policy.",
    relevanceToINTRACOMP:
      "Develops intercultural and multilingual education resources tailored to Pacific island contexts.",
    relationToITC:
      "Promotes Pacific cultural identity and multilingual learning as core components of quality education in the Pacific region.",
    thematicFocus: ["Inter- and Transculturality", "Education", "Culture"],
    geographicalScope: ["regional"],
    link: "https://example-spc.int/education/ite-pacific",
    impactInfluence: "advisory",
    connections: ["INS-NZ-002", "STK-NZ-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Operates across 27 Pacific island countries and territories.",
    languages: ["English", "French", "Tok Pisin"],
    equityAddressed:
      "Addresses education access gaps for remote island communities and gender equity in Pacific education.",
    intendedAudience: "Pacific governments, educators, community leaders",
    country: "New Zealand",
    lat: -41.2866,
    lng: 174.7756,
  },

  // --- Italy ---
  {
    id: "STK-IT-001",
    name: "Ministero dell'Istruzione – DGEFID",
    category: "stakeholders",
    actorType: "government",
    description:
      "Italian Ministry of Education directorate responsible for student financial aid, rights, and intercultural education policies in Italian schools.",
    relevanceToINTRACOMP:
      "Sets national policy for intercultural education in Italian schools and funds integration programmes for migrant students.",
    relationToITC:
      "Issues national circulars on intercultural education and mandates ITC integration in professional development for teachers working with diverse student populations.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["national"],
    link: "https://example-miur.it/intercultural-education",
    impactInfluence: "binding",
    connections: ["INS-IT-001", "INS-IT-002", "STK-IT-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Coordinates with UNHCR Italy on educational integration of refugee students.",
    languages: ["Italian", "English"],
    equityAddressed:
      "Targets newly arrived migrant and Roma students through tailored intercultural integration pathways.",
    intendedAudience: "Schools, teachers, local education authorities",
    country: "Italy",
    lat: 41.9028,
    lng: 12.4964,
  },
  {
    id: "STK-IT-002",
    name: "Università degli Studi di Bologna – FISPPA",
    category: "stakeholders",
    actorType: "academia",
    description:
      "Department of Philosophy, Sociology, Pedagogy and Applied Psychology at the University of Bologna, with strong research in intercultural pedagogy.",
    relevanceToINTRACOMP:
      "Produces research on intercultural competence in educational and social work contexts relevant to the INTRACOMP framework.",
    relationToITC:
      "Runs master's programmes in intercultural education and publishes extensively on ITC assessment and pedagogical models.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["national", "cross-regional"],
    link: "https://example-unibo.it/fisppa/itc-research",
    impactInfluence: "advisory",
    connections: ["STK-IT-001", "INS-IT-002", "STK-GR-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Collaborates with Erasmus+ projects on intercultural learning outcomes assessment.",
    languages: ["Italian", "English", "French"],
    equityAddressed:
      "Research addresses intersections of class, gender, and ethnicity in Italian intercultural education.",
    intendedAudience: "Researchers, educators, social workers",
    country: "Italy",
    lat: 44.4949,
    lng: 11.3426,
  },
  {
    id: "STK-IT-003",
    name: "COSPE – Cooperation for the Development of Emerging Countries",
    category: "stakeholders",
    actorType: "NGO",
    description:
      "Italian NGO working on intercultural dialogue, anti-discrimination, and global citizenship education across Italy and internationally.",
    relevanceToINTRACOMP:
      "Implements intercultural competence training in schools, workplaces, and community settings across Italy.",
    relationToITC:
      "Develops and delivers ITC training programmes for educators and manages intercultural mediation services in multicultural communities.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Migration"],
    geographicalScope: ["national"],
    link: "https://example-cospe.org/itc-training",
    impactInfluence: "symbolic",
    connections: ["INS-IT-001", "STK-IT-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Network of intercultural mediators operating in 15 Italian cities.",
    languages: ["Italian", "English", "Arabic", "French"],
    equityAddressed:
      "Prioritises refugee and asylum-seeker communities and stateless persons in intercultural integration services.",
    intendedAudience: "Immigrants, educators, community organisations",
    country: "Italy",
    lat: 43.7696,
    lng: 11.2558,
  },

  // --- Greece ---
  {
    id: "STK-GR-001",
    name: "Hellenic Ministry of Education and Religious Affairs",
    category: "stakeholders",
    actorType: "government",
    description:
      "Greek national ministry responsible for education policy, including intercultural schools programme and refugee education coordination.",
    relevanceToINTRACOMP:
      "Manages Greece's intercultural schools network and policies for educational integration of refugee and migrant children.",
    relationToITC:
      "Operates a dedicated network of 28 intercultural schools where ITC is embedded in daily pedagogical practice.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["national"],
    link: "https://example-minedu.gov.gr/intercultural-schools",
    impactInfluence: "binding",
    connections: ["INS-GR-001", "INS-GR-002", "STK-EU-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Greece's intercultural schools model is considered a European reference for ITC in high-migration contexts.",
    languages: ["Greek", "English"],
    equityAddressed:
      "Addresses educational exclusion of refugee and undocumented migrant children through dedicated intercultural schooling.",
    intendedAudience: "Schools, local authorities, refugee families",
    country: "Greece",
    lat: 37.9838,
    lng: 23.7275,
  },
  {
    id: "STK-GR-002",
    name: "Aristotle University of Thessaloniki – School of Education",
    category: "stakeholders",
    actorType: "academia",
    description:
      "Largest university in Greece with a School of Education conducting significant research in multicultural education and intercultural pedagogy.",
    relevanceToINTRACOMP:
      "Provides academic grounding for ITC frameworks adapted to southeast European and Balkan multicultural contexts.",
    relationToITC:
      "Hosts the Laboratory of Intercultural and Migration Studies, publishing on ITC in Greek and Balkan educational systems.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["regional", "national"],
    link: "https://example-auth.gr/education/intercultural",
    impactInfluence: "advisory",
    connections: ["STK-GR-001", "INS-GR-002", "STK-IT-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Participates in Horizon Europe projects on ITC and migration in southern Europe.",
    languages: ["Greek", "English"],
    equityAddressed:
      "Addresses marginalisation of Roma and Muslim minority students in Greek educational research.",
    intendedAudience: "Researchers, teachers, policy makers",
    country: "Greece",
    lat: 40.6401,
    lng: 22.9444,
  },
  {
    id: "STK-GR-003",
    name: "Generation 2.0 RED",
    category: "stakeholders",
    actorType: "civil society",
    description:
      "Greek civil society organisation led by second-generation immigrants, advocating for equal rights and intercultural inclusion in Greek society.",
    relevanceToINTRACOMP:
      "Bridges ITC policy and lived migrant experience, co-designing intercultural competence resources with affected communities.",
    relationToITC:
      "Delivers community-based ITC programmes and advocates for systemic change in how cultural diversity is addressed in Greek institutions.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["local and national"],
    link: "https://example-generation2.gr/itc-programmes",
    impactInfluence: "symbolic",
    connections: ["INS-GR-001", "STK-GR-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Co-facilitates the Intercultural Cities initiative in Athens with the Council of Europe.",
    languages: ["Greek", "English", "Albanian", "Bangla"],
    equityAddressed:
      "Focuses on second-generation immigrants and stateless persons facing racialised exclusion in Greece.",
    intendedAudience: "Immigrant communities, municipalities, educators",
    country: "Greece",
    lat: 38.2466,
    lng: 21.7346,
  },

  // --- Germany ---
  {
    id: "STK-DE-001",
    name: "Bundeszentrale für politische Bildung (bpb)",
    category: "stakeholders",
    actorType: "administration",
    description:
      "German Federal Agency for Civic Education promoting political literacy, democratic values, and intercultural understanding across Germany.",
    relevanceToINTRACOMP:
      "Develops and disseminates intercultural competence materials for formal and non-formal education in Germany.",
    relationToITC:
      "Publishes resources on cultural diversity, anti-discrimination, and ITC for teachers, youth workers, and the general public.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Culture",
      "Education",
    ],
    geographicalScope: ["national"],
    link: "https://example-bpb.de/intercultural",
    impactInfluence: "highly influential",
    connections: ["INS-DE-001", "INS-DE-002", "STK-DE-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Free publication service reaches over 1 million recipients annually.",
    languages: ["German", "English", "Turkish", "Arabic"],
    equityAddressed:
      "Addresses racialised and class-based barriers to civic participation for immigrants and marginalised groups.",
    intendedAudience: "General public, educators, youth workers, journalists",
    country: "Germany",
    lat: 52.52,
    lng: 13.405,
  },
  {
    id: "STK-DE-002",
    name: "Humboldt-Universität zu Berlin – Institute for Educational Sciences",
    category: "stakeholders",
    actorType: "academia",
    description:
      "Berlin's oldest university with leading research in critical pedagogy, migration, and intercultural education in European metropolitan contexts.",
    relevanceToINTRACOMP:
      "Contributes theoretical frameworks for ITC in diverse urban school environments to the INTRACOMP research base.",
    relationToITC:
      "Hosts the migrationpädagogik research group developing critical perspectives on intercultural competence in schools.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["regional", "national"],
    link: "https://example-hu-berlin.de/erzwiss/itc-research",
    impactInfluence: "advisory",
    connections: ["STK-DE-001", "INS-DE-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Participates in the DAAD-funded network on international teacher education reform.",
    languages: ["German", "English"],
    equityAddressed:
      "Critical research on racialisation and class in German schools informs equity-centred ITC approaches.",
    intendedAudience: "Researchers, teacher educators, curriculum designers",
    country: "Germany",
    lat: 48.1351,
    lng: 11.5820,
  },
  {
    id: "STK-DE-003",
    name: "Rat für Migration (Council for Migration)",
    category: "stakeholders",
    actorType: "civil society",
    description:
      "German academic and civil society network providing evidence-based policy recommendations on migration, integration, and intercultural policy.",
    relevanceToINTRACOMP:
      "Advocates for ITC-informed migration and integration policies at federal and state level in Germany.",
    relationToITC:
      "Publishes policy briefs and expert opinions on intercultural competence, diversity management, and institutional discrimination.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Education"],
    geographicalScope: ["national"],
    link: "https://example-rat-fuer-migration.de/itc-policy",
    impactInfluence: "advisory",
    connections: ["INS-DE-001", "STK-DE-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Engages directly with Bundestag committees on migration legislation.",
    languages: ["German", "English"],
    equityAddressed:
      "Addresses structural racism and antigypsyism in German institutions through policy advocacy.",
    intendedAudience: "Policy makers, NGOs, researchers",
    country: "Germany",
    lat: 53.5511,
    lng: 9.9937,
  },

  // --- Serbia ---
  {
    id: "STK-RS-001",
    name: "Ministry of Education, Science and Technological Development of Serbia",
    category: "stakeholders",
    actorType: "government",
    description:
      "Serbian national ministry shaping education policy, including national minority rights in education and intercultural dialogue programmes.",
    relevanceToINTRACOMP:
      "Leads national policy on minority-language education and intercultural competence integration in Serbian schools.",
    relationToITC:
      "Oversees curriculum development that includes ITC as part of Serbia's EU accession educational reforms.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-mpn.gov.rs/intercultural",
    impactInfluence: "binding",
    connections: ["INS-RS-001", "INS-RS-002", "STK-RS-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Coordinates with OSCE Mission to Serbia on minority education rights.",
    languages: ["Serbian", "English", "Hungarian", "Romani"],
    equityAddressed:
      "Provides mother-tongue instruction for Hungarian, Romani, Slovak, and other national minorities.",
    intendedAudience: "Schools, minorities, education authorities",
    country: "Serbia",
    lat: 44.8176,
    lng: 20.4633,
  },
  {
    id: "STK-RS-002",
    name: "University of Belgrade – Faculty of Philosophy",
    category: "stakeholders",
    actorType: "academia",
    description:
      "Serbia's flagship humanities faculty conducting research on multiculturalism, ethnic relations, and educational policy in post-conflict Western Balkan contexts.",
    relevanceToINTRACOMP:
      "Provides regionally specific research on ITC in post-conflict and EU-accession educational contexts.",
    relationToITC:
      "Publishes on intercultural dialogue in Serbian schools and trains researchers in multicultural education methodologies.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["regional", "national"],
    link: "https://example-f.bg.ac.rs/itc-research",
    impactInfluence: "advisory",
    connections: ["STK-RS-001", "INS-RS-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Collaborates with regional Balkan universities on post-conflict reconciliation and ITC.",
    languages: ["Serbian", "English"],
    equityAddressed:
      "Research emphasises Roma education, ethnic minority rights, and post-conflict reconciliation in the Western Balkans.",
    intendedAudience: "Researchers, policy makers, educators",
    country: "Serbia",
    lat: 45.2671,
    lng: 19.8335,
  },
  {
    id: "STK-RS-003",
    name: "Roma Education Fund – Serbia Office",
    category: "stakeholders",
    actorType: "NGO",
    description:
      "International NGO with Serbia office working to close the educational gap for Roma through scholarships, school mediation, and intercultural training.",
    relevanceToINTRACOMP:
      "Advances equity-centred ITC in Serbian schools by building intercultural competence among non-Roma educators working with Roma students.",
    relationToITC:
      "Trains school mediators and teachers in ITC to support Roma school inclusion and reduce discriminatory practices.",
    thematicFocus: ["Inter- and Transculturality", "Education", "Culture"],
    geographicalScope: ["local and national"],
    link: "https://example-romaeducationfund.org/serbia",
    impactInfluence: "symbolic",
    connections: ["INS-RS-001", "STK-RS-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Works across municipalities with significant Roma populations including Niš, Kragujevac, and Leskovac.",
    languages: ["Serbian", "Romani", "English"],
    equityAddressed:
      "Exclusively focused on Roma educational inclusion and anti-discrimination in the Serbian education system.",
    intendedAudience: "Roma communities, schools, municipalities",
    country: "Serbia",
    lat: 43.3209,
    lng: 21.8954,
  },
];

export const mockInstruments: Instrument[] = [
  // --- EU ---
  {
    id: "INS-EU-001",
    name: "European Reference Framework for Key Competences for Lifelong Learning",
    category: "instruments",
    instrumentType: "guideline",
    responsibleInstitution: "European Commission / Council of the EU",
    mainObjectives:
      "Define a common reference framework of eight key competences, including multilingual and cultural awareness competences, to guide EU education policy.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Provides the EU-level conceptual underpinning for ITC as a lifelong learning outcome across all educational systems.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["all of the above"],
    link: "https://example-ec.eu/key-competences-framework",
    impactInfluence: "highly influential",
    connections: ["STK-EU-001", "STK-EU-002", "INS-FI-001", "INS-NO-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "2018 revision strengthened cultural awareness and expression as a standalone key competence.",
    languages: ["English", "French", "German", "and all 24 EU languages"],
    equityAddressed:
      "Explicitly requires member states to ensure all learners, including disadvantaged groups, develop key competences.",
    intendedAudience: "Education ministries, curriculum developers, schools",
    country: "Belgium",
    lat: 50.8503,
    lng: 4.3517,
  },
  {
    id: "INS-EU-002",
    name: "Erasmus+ Programme 2021–2027",
    category: "instruments",
    instrumentType: "initiative",
    responsibleInstitution: "European Commission – DG EAC",
    mainObjectives:
      "Support learning mobility and cooperation in education, training, youth, and sport, with intercultural learning as a core dimension of all mobility activities.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Funds intercultural exchange and competence development projects across all INTRACOMP partner regions.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["all of the above"],
    link: "https://example-erasmusplus.eu/intercultural-learning",
    impactInfluence: "highly influential",
    connections: ["STK-EU-001", "INS-EU-001", "STK-FI-001", "STK-IT-001"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Budget of 26.2 billion EUR for 2021–2027, with inclusion as a cross-cutting priority.",
    languages: ["English", "French", "German", "and all 24 EU languages"],
    equityAddressed:
      "Inclusion and diversity strand specifically targets organisations working with disadvantaged learners.",
    intendedAudience: "Educational institutions, youth organisations, NGOs",
    country: "Belgium",
    lat: 50.8503,
    lng: 4.3517,
  },

  // --- Finland ---
  {
    id: "INS-FI-001",
    name: "National Core Curriculum for Basic Education – Multicultural Education Chapter",
    category: "instruments",
    instrumentType: "guideline",
    responsibleInstitution: "Finnish National Agency for Education (OPH)",
    mainObjectives:
      "Mandate the integration of intercultural competence outcomes across all subjects in Finnish basic education from grades 1–9.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Establishes Finland's national ITC standard for formal education, providing a legislative reference point for INTRACOMP.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-oph.fi/curricula/basic-education/multicultural",
    impactInfluence: "binding",
    connections: ["STK-FI-001", "STK-FI-003", "INS-EU-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks: "Revised in 2014; next revision anticipated 2026.",
    languages: ["Finnish", "Swedish"],
    equityAddressed:
      "Includes provisions for Finnish Sign Language, Sámi languages, and immigrant mother-tongue instruction.",
    intendedAudience: "Schools, teachers, local education authorities",
    country: "Finland",
    lat: 65.0121,
    lng: 25.4651,
  },
  {
    id: "INS-FI-002",
    name: "Helsinki Metropolitan Area Intercultural Strategy 2022–2025",
    category: "instruments",
    instrumentType: "strategy",
    responsibleInstitution: "City of Helsinki – Education Division",
    mainObjectives:
      "Develop a coherent metropolitan approach to intercultural education, teacher training, and community engagement in Helsinki's diverse school landscape.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Serves as a leading urban case study for metropolitan ITC strategy in the Nordic context.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["local and regional"],
    link: "https://example-hel.fi/education/intercultural-strategy-2025",
    impactInfluence: "advisory",
    connections: ["STK-FI-001", "STK-FI-002", "STK-FI-003"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Includes a dedicated action plan for schools in high-diversity neighbourhoods.",
    languages: ["Finnish", "Swedish", "English"],
    equityAddressed:
      "Targets schools in Itäinen and Koillinen districts with highest proportions of newly arrived immigrant students.",
    intendedAudience: "Teachers, school principals, community organisations",
    country: "Finland",
    lat: 62.2426,
    lng: 25.7473,
  },

  // --- Norway ---
  {
    id: "INS-NO-001",
    name: "Action Plan against Racism and Discrimination 2020–2023",
    category: "instruments",
    instrumentType: "strategy",
    responsibleInstitution: "Norwegian Ministry of Justice and Public Security",
    mainObjectives:
      "Develop a comprehensive government strategy to combat racism and discrimination in Norwegian society, including in education and public services.",
    implementationStatus: "evaluation",
    relevanceToINTRACOMP:
      "Provides the anti-discrimination policy context within which Norwegian ITC initiatives operate.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-regjeringen.no/racism-action-plan",
    impactInfluence: "binding",
    connections: ["STK-NO-001", "STK-NO-003", "INS-NO-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Successor plan for 2024–2027 under development with NGO consultation.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Specifically targets anti-Semitism, anti-Muslim hatred, and anti-Romani discrimination in Norwegian public life.",
    intendedAudience: "Government agencies, schools, employers",
    country: "Norway",
    lat: 58.9700,
    lng: 5.7331,
  },
  {
    id: "INS-NO-002",
    name: "Fagfornyelsen – Renewed Norwegian National Curriculum",
    category: "instruments",
    instrumentType: "guideline",
    responsibleInstitution: "Norwegian Directorate for Education and Training (Udir)",
    mainObjectives:
      "Modernise the Norwegian national curriculum through interdisciplinary themes including democracy and citizenship, embedding ITC across all subjects.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Anchors ITC in national legal mandate for Norwegian schools, making it a peer reference to Finland's OPH curriculum.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-udir.no/fagfornyelsen/itc",
    impactInfluence: "binding",
    connections: ["STK-NO-001", "STK-NO-002", "INS-NO-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks: "Implemented from 2020 across primary and secondary levels.",
    languages: ["Norwegian", "Sámi languages"],
    equityAddressed:
      "Contains a dedicated Sámi curriculum strand with culturally specific competence goals.",
    intendedAudience: "Schools, teachers, curriculum coordinators",
    country: "Norway",
    lat: 69.6489,
    lng: 18.9551,
  },
  {
    id: "INS-NO-003",
    name: "Mangfold og inkludering i barnehage og skole (Diversity Initiative)",
    category: "instruments",
    instrumentType: "initiative",
    responsibleInstitution: "Norwegian Ministry of Education and Research",
    mainObjectives:
      "Improve diversity management and inclusive practices in Norwegian kindergartens and schools through targeted professional development and guidance materials.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Translates national ITC curriculum goals into concrete school-level practice through teacher capacity building.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["national"],
    link: "https://example-regjeringen.no/diversity-schools-initiative",
    impactInfluence: "advisory",
    connections: ["STK-NO-001", "INS-NO-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Supported by a network of regional resource centres for multicultural education.",
    languages: ["Norwegian"],
    equityAddressed:
      "Targets schools with high proportions of minority-language students and newly arrived refugee children.",
    intendedAudience: "School leaders, teachers, kindergarten staff",
    country: "Norway",
    lat: 58.1467,
    lng: 7.9956,
  },

  // --- New Zealand & Pacific ---
  {
    id: "INS-NZ-001",
    name: "New Zealand Curriculum – Cultural Diversity Learning Area",
    category: "instruments",
    instrumentType: "guideline",
    responsibleInstitution: "New Zealand Ministry of Education",
    mainObjectives:
      "Integrate Māori, Pasifika, and multicultural perspectives across all learning areas as part of the New Zealand Curriculum refresh.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Represents a bicultural and multicultural ITC framework with unique indigenous and Pacific dimensions.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["national"],
    link: "https://example-nzcurriculum.tki.org.nz/cultural-diversity",
    impactInfluence: "binding",
    connections: ["STK-NZ-001", "STK-NZ-002", "INS-EU-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Curriculum refresh underway 2023–2025 with strengthened te Tiriti o Waitangi commitments.",
    languages: ["English", "Māori"],
    equityAddressed:
      "Treaty-based approach mandates equitable outcomes for Māori students and recognition of Pacific learner identities.",
    intendedAudience: "Schools, teachers, curriculum developers",
    country: "New Zealand",
    lat: -41.2865,
    lng: 174.7762,
  },
  {
    id: "INS-NZ-002",
    name: "Pacific Education Plan 2020–2030",
    category: "instruments",
    instrumentType: "strategy",
    responsibleInstitution: "New Zealand Ministry of Education",
    mainObjectives:
      "Improve educational achievement, wellbeing, and cultural identity of Pacific learners in New Zealand through culturally responsive policy and practice.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Provides a regional model for Pacific ITC integration within a national education system.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["national"],
    link: "https://example-education.govt.nz/pacific-education-plan",
    impactInfluence: "highly influential",
    connections: ["STK-NZ-001", "STK-NZ-003", "INS-NZ-001"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Guided by the Tapasā cultural competence framework for teachers of Pacific learners.",
    languages: ["English", "Samoan", "Tongan", "Cook Islands Māori"],
    equityAddressed:
      "Addresses persistent achievement gaps for Pacific learners through systemic equity interventions.",
    intendedAudience: "Teachers, school leaders, Pacific communities",
    country: "New Zealand",
    lat: -43.5321,
    lng: 172.6362,
  },

  // --- Italy ---
  {
    id: "INS-IT-001",
    name: "Piano Nazionale Integrazione (National Integration Plan) 2017",
    category: "instruments",
    instrumentType: "strategy",
    responsibleInstitution: "Italian Ministry of Interior",
    mainObjectives:
      "Define Italy's national framework for immigrant integration across housing, education, health, and cultural participation with intercultural competence as a cross-cutting theme.",
    implementationStatus: "evaluation",
    relevanceToINTRACOMP:
      "Establishes ITC as a national policy priority in Italy's integration architecture.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-interno.gov.it/piano-integrazione-2017",
    impactInfluence: "binding",
    connections: ["STK-IT-001", "STK-IT-003", "INS-IT-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Under review for 2025 update following significant changes in migration patterns.",
    languages: ["Italian"],
    equityAddressed:
      "Addresses integration barriers for newly arrived migrants across socioeconomic and cultural dimensions.",
    intendedAudience: "Government agencies, municipalities, NGOs",
    country: "Italy",
    lat: 40.8518,
    lng: 14.2681,
  },
  {
    id: "INS-IT-002",
    name: "Linee Guida per l'Accoglienza e l'Integrazione degli Alunni Stranieri",
    category: "instruments",
    instrumentType: "guideline",
    responsibleInstitution: "Italian Ministry of Education (MIUR)",
    mainObjectives:
      "Provide operational guidelines for Italian schools on reception, integration, and intercultural education for foreign pupils.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Core policy reference for ITC implementation in Italian schools, widely cited in European comparative analyses.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["national"],
    link: "https://example-miur.it/linee-guida-integrazione-alunni-stranieri",
    impactInfluence: "binding",
    connections: ["STK-IT-001", "STK-IT-002", "INS-IT-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "First issued 2006, updated 2014; revision expected post-2024 policy reform.",
    languages: ["Italian"],
    equityAddressed:
      "Mandates intercultural mediation services and mother-tongue support for newly arrived pupils.",
    intendedAudience: "School principals, teachers, intercultural mediators",
    country: "Italy",
    lat: 45.4654,
    lng: 9.1859,
  },
  {
    id: "INS-IT-003",
    name: "Tavola della Pace – Intercultural Education Initiative",
    category: "instruments",
    instrumentType: "initiative",
    responsibleInstitution: "Tavola della Pace – La Casa per la Pace",
    mainObjectives:
      "Coordinate a national network of schools and organisations engaged in peace education, global citizenship, and intercultural learning activities.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Represents civil society-led ITC programming that complements formal Italian education policy.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Education"],
    geographicalScope: ["national"],
    link: "https://example-tavoladellapace.it/intercultural-education",
    impactInfluence: "symbolic",
    connections: ["STK-IT-003", "INS-IT-002"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Annual national peace march brings together 10,000+ participants from Italian schools.",
    languages: ["Italian"],
    equityAddressed:
      "Focuses on youth from marginalised communities in developing global citizenship and intercultural awareness.",
    intendedAudience: "Schools, youth groups, civil society",
    country: "Italy",
    lat: 43.1122,
    lng: 12.3888,
  },

  // --- Greece ---
  {
    id: "INS-GR-001",
    name: "National Action Plan for the Integration of Third-Country Nationals",
    category: "instruments",
    instrumentType: "strategy",
    responsibleInstitution: "Greek Ministry of Migration and Asylum",
    mainObjectives:
      "Establish a national strategy for the social and cultural integration of third-country nationals in Greece, with intercultural competence as a key pillar.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Places ITC at the centre of Greece's legal integration framework, particularly relevant given high migration transit volumes.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-migration.gov.gr/action-plan-integration",
    impactInfluence: "binding",
    connections: ["STK-GR-001", "STK-GR-003", "INS-GR-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Co-funded by the EU Asylum, Migration and Integration Fund (AMIF).",
    languages: ["Greek", "English"],
    equityAddressed:
      "Addresses integration barriers for asylum seekers, recognised refugees, and long-term migrants in Greece.",
    intendedAudience: "Government agencies, integration service providers",
    country: "Greece",
    lat: 35.3387,
    lng: 25.1442,
  },
  {
    id: "INS-GR-002",
    name: "Programme DYEPTH – Intercultural Schools Network",
    category: "instruments",
    instrumentType: "initiative",
    responsibleInstitution: "Hellenic Ministry of Education – DYEPTH Directorate",
    mainObjectives:
      "Operate a network of 28 state intercultural schools in Greece providing differentiated multilingual education for pupils from diverse cultural backgrounds.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Greece's intercultural schools are a European model for institutionalised ITC practice in high-migration contexts.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Migration",
    ],
    geographicalScope: ["local and national"],
    link: "https://example-minedu.gov.gr/dyepth/intercultural-schools",
    impactInfluence: "highly influential",
    connections: ["STK-GR-001", "STK-GR-002", "INS-GR-001"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Intercultural schools are eligible for higher staffing ratios and specialised teacher training.",
    languages: ["Greek", "English", "Albanian", "Arabic"],
    equityAddressed:
      "Provides free multilingual education to recently arrived migrant and refugee pupils.",
    intendedAudience: "Migrant and refugee pupils, teachers, municipalities",
    country: "Greece",
    lat: 39.6390,
    lng: 22.4191,
  },

  // --- Germany ---
  {
    id: "INS-DE-001",
    name: "Nationaler Aktionsplan Integration (NAP-I)",
    category: "instruments",
    instrumentType: "strategy",
    responsibleInstitution: "German Federal Government – Commissioner for Migration",
    mainObjectives:
      "Provide a comprehensive national roadmap for immigrant integration in Germany, including intercultural opening of public institutions and education.",
    implementationStatus: "evaluation",
    relevanceToINTRACOMP:
      "Sets the federal policy environment for ITC in German integration policy and public institutions.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Education"],
    geographicalScope: ["national"],
    link: "https://example-bundesregierung.de/nap-integration",
    impactInfluence: "binding",
    connections: ["STK-DE-001", "STK-DE-003", "INS-DE-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Developed with civil society participation through the National Integration Summit.",
    languages: ["German", "English"],
    equityAddressed:
      "Addresses structural barriers to civic participation and employment for immigrants and people with migration backgrounds.",
    intendedAudience: "Federal agencies, Länder governments, NGOs",
    country: "Germany",
    lat: 50.1109,
    lng: 8.6821,
  },
  {
    id: "INS-DE-002",
    name: "Bundesprogramm Demokratie leben! (Living Democracy!)",
    category: "instruments",
    instrumentType: "initiative",
    responsibleInstitution: "German Federal Ministry for Family Affairs (BMFSFJ)",
    mainObjectives:
      "Fund local partnerships and civil society organisations working on democratic culture, intercultural dialogue, and extremism prevention in Germany.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Largest federal programme supporting ITC at community level in Germany, with direct relevance to intercultural learning outcomes.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Culture",
      "Education",
    ],
    geographicalScope: ["local and national"],
    link: "https://example-demokratie-leben.de/intercultural-projects",
    impactInfluence: "highly influential",
    connections: ["STK-DE-001", "STK-DE-002", "INS-DE-001"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Funds over 900 local democracy projects annually across all 16 Bundesländer.",
    languages: ["German", "English", "Turkish"],
    equityAddressed:
      "Specifically targets communities at risk of right-wing extremism and supports anti-racist intercultural projects.",
    intendedAudience: "Civil society, municipalities, youth organisations",
    country: "Germany",
    lat: 50.9333,
    lng: 6.9500,
  },

  // --- Serbia ---
  {
    id: "INS-RS-001",
    name: "Strategy for Social Inclusion of Roma in Serbia 2022–2030",
    category: "instruments",
    instrumentType: "strategy",
    responsibleInstitution: "Serbian Government – Office for Human and Minority Rights",
    mainObjectives:
      "Advance the educational, economic, and social inclusion of Roma citizens in Serbia through targeted intercultural and equity-oriented policy measures.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Addresses the most acute ITC and inclusion challenge in the Serbian education system.",
    thematicFocus: ["Inter- and Transculturality", "Education", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-inkluzija.gov.rs/roma-strategy-2030",
    impactInfluence: "binding",
    connections: ["STK-RS-001", "STK-RS-003", "INS-RS-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Aligned with EU Roma Strategic Framework 2020–2030 as part of Serbia's accession commitments.",
    languages: ["Serbian", "Romani", "English"],
    equityAddressed:
      "Exclusively focused on Roma inclusion across education, employment, housing, and healthcare.",
    intendedAudience: "Government agencies, Roma communities, NGOs",
    country: "Serbia",
    lat: 44.0165,
    lng: 20.9114,
  },
  {
    id: "INS-RS-002",
    name: "Zakon o osnovama sistema obrazovanja i vaspitanja (Education System Law)",
    category: "instruments",
    instrumentType: "law",
    responsibleInstitution: "National Assembly of Serbia",
    mainObjectives:
      "Establish the legal framework for the Serbian education system, including provisions for national minority mother-tongue instruction and intercultural education.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Provides the legal mandate for ITC and minority education rights in Serbian schools.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-slglasnik.rs/zakon-obrazovanje",
    impactInfluence: "binding",
    connections: ["STK-RS-001", "STK-RS-002", "INS-RS-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Last amended 2021; further amendments expected as part of EU accession Chapter 26 negotiations.",
    languages: ["Serbian", "Hungarian", "Slovak", "Romanian"],
    equityAddressed:
      "Guarantees mother-tongue instruction for recognised national minorities including Roma, Hungarians, and Bosniaks.",
    intendedAudience: "Schools, education authorities, national minorities",
    country: "Serbia",
    lat: 46.1000,
    lng: 19.6669,
  },
  {
    id: "INS-RS-003",
    name: "Interkulturalni dijalog u obrazovanju (Intercultural Dialogue in Education Initiative)",
    category: "instruments",
    instrumentType: "initiative",
    responsibleInstitution: "Belgrade Centre for Human Rights",
    mainObjectives:
      "Develop and pilot intercultural dialogue curricula in Serbian secondary schools in cooperation with the Ministry of Education.",
    implementationStatus: "development",
    relevanceToINTRACOMP:
      "Piloting ITC in Serbian schools provides an evidence base for scaling nationally aligned with EU standards.",
    thematicFocus: [
      "Inter- and Transcultural Competences",
      "Education",
      "Culture",
    ],
    geographicalScope: ["local and regional"],
    link: "https://example-bgcentar.org.rs/intercultural-education",
    impactInfluence: "symbolic",
    connections: ["STK-RS-002", "INS-RS-002"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Piloted in 12 secondary schools in Belgrade, Novi Sad, and Niš.",
    languages: ["Serbian", "English"],
    equityAddressed:
      "Curriculum explicitly addresses ethnic reconciliation and cross-community contact between Serbian, Albanian, and Roma youth.",
    intendedAudience: "Secondary school students, teachers, municipalities",
    country: "Serbia",
    lat: 43.8904,
    lng: 20.3493,
  },
];

export const mockEntities: (Stakeholder | Instrument)[] = [
  ...mockStakeholders,
  ...mockInstruments,
];
