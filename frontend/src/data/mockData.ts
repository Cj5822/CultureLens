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
      "DG EAC administers the Erasmus+ and Creative Europe programmes, coordinates the European Education Area framework, and issues Council Recommendations on key competences. Its mandate directly determines how intercultural competence is defined, funded, and evaluated across 27 member states and partner countries, making it the EU's primary institutional driver of intercultural learning policy.",
    relevanceToINTRACOMP:
      "As principal EU funder and policy architect for ITC, DG EAC's Erasmus+ programme guidelines and European Education Area framework directly shape how partner institutions design intercultural learning outcomes.",
    relationToITC:
      "DG EAC embeds ITC across multiple instruments: Erasmus+ programme guides define it as a mandatory learning outcome for mobility participants; the European Education Area framework positions cultural awareness as one of eight lifelong learning key competences; and the Council Recommendation on Key Competences (2018) makes intercultural dialogue a legally endorsed EU educational priority. The European Solidarity Corps further builds ITC through cross-border volunteer placements with structured reflection requirements.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["all of the above"],
    link: "https://example-ec.eu/dg-eac/intercultural",
    impactInfluence: "binding",
    connections: ["INS-EU-001", "INS-EU-002", "STK-EU-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Regular consultation windows during programming periods allow civil society, diaspora organisations, and minority education networks to input into ITC policy priorities. The 2021–2027 cycle introduced a dedicated inclusion strategy requiring each National Agency to develop country-specific inclusion plans. Post-2027 programme architecture is under active discussion, with intercultural dialogue expected to remain a core thematic priority across successor instruments.",
    languages: ["English", "French", "German"],
    equityAddressed:
      "DG EAC addresses socioeconomic exclusion through Erasmus+'s inclusion and diversity strand, lowering participation barriers for learners with disabilities, those in care, early school leavers, and youth from disadvantaged backgrounds. Targeted small-scale partnerships prioritise grassroots organisations serving marginalised communities, ensuring ITC benefits are not confined to privileged mobility participants. Inclusion action plans at national agency level require measurable equity targets.",
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
      "The Council of Europe's Education Department works across 46 member states to promote democratic values, human rights, and intercultural dialogue through formal and non-formal education. Its outputs include the Reference Framework of Competences for Democratic Culture (RFCDC), the Pestalozzi Teacher Training Programme, and CEFR-linked plurilingual education guidelines. The department's mandate extends beyond the EU, reaching states undergoing democratic transition and those with significant minority populations governed by Council of Europe conventions.",
    relevanceToINTRACOMP:
      "Develops the RFCDC and intercultural dialogue tools that provide INTRACOMP with internationally recognised conceptual benchmarks for ITC assessment, used across all 46 member states including every INTRACOMP partner country.",
    relationToITC:
      "The RFCDC positions intercultural dialogue competence among twenty competences required for democratic participation, integrating ITC into a legally recognised European benchmark. The Intercultural Cities programme, co-run with the European Commission, operationalises ITC at municipal governance level across 150+ cities. The CEFR companion volume (2020) incorporates intercultural and pluricultural competence dimensions. The No Hate Speech Movement equips young people with skills to counter discrimination, directly intersecting with relational ITC development.",
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
      "Maintains a network of national coordinators implementing RFCDC across all 46 member states. Current work focuses on developing RFCDC assessment instruments for school self-evaluation, with pilot countries reporting significant professional development impact. The Roma and Travellers Education project provides targeted curriculum tools for historically excluded communities. Pestalozzi training reaches teacher educators in countries with limited national capacity for diversity-responsive pedagogy.",
    languages: ["English", "French"],
    equityAddressed:
      "Frameworks explicitly address inclusion of national minorities, linguistic minorities, Roma and Travellers, migrants, and refugees in democratic civic life. The Pestalozzi training programme reaches teacher educators in smaller member states and those undergoing democratic transition that lack national ITC capacity. RFCDC competence descriptors are designed to be applicable regardless of cultural background, avoiding culturally biased assessment of intercultural capability.",
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
      "Opetushallitus (OPH) is Finland's central state authority for developing, steering, and monitoring education from early childhood through adult learning. Within Finland's decentralised educational governance, OPH sets national core curricula that municipalities and schools are legally required to implement. Its mandate explicitly includes promoting cultural diversity, multilingualism, and the educational integration of immigrant and indigenous populations. OPH also coordinates teacher training standards and manages EU-funded education projects including Erasmus+ at national agency level.",
    relevanceToINTRACOMP:
      "Integrates ITC outcomes into legally binding national core curricula across all educational levels, making OPH the key regulatory authority determining how Finnish schools develop intercultural competence under the Nordic welfare education model.",
    relationToITC:
      "OPH mandates ITC outcomes across all subjects in the National Core Curriculum for Basic Education (2014), requiring schools to develop pupils' ability to function respectfully in culturally diverse environments. Seven transversal competences include Cultural Competence, Interaction and Self-Expression (L2) and Multiliteracy (L4). OPH's guidelines for preparatory education provide ITC-focused transitional schooling for recently arrived migrant children. Teacher training standards co-developed with universities include intercultural pedagogy as a mandatory professional competence.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-oph.fi/intercultural-education",
    impactInfluence: "binding",
    connections: ["INS-FI-001", "INS-FI-002", "STK-FI-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "OPH publishes annual reports on multicultural education outcomes across Finnish municipalities, tracking language learning progress, attainment of immigrant-background pupils, and professional development uptake. The 2026 curriculum revision will strengthen digital multiliteracy and global citizenship alongside ITC. OPH collaborates formally with Sámi Parliament (Saamelaiskäräjät) on indigenous curriculum rights and with the Integration Department of the Ministry of Economic Affairs on migrant education pathways.",
    languages: ["Finnish", "Swedish", "English"],
    equityAddressed:
      "OPH addresses equity through three mechanisms: culturally responsive curriculum adaptations for Sámi communities including dedicated Inari Sámi, Northern Sámi, and Skolt Sámi curricula; targeted provisions acknowledging Roma pupils' distinct cultural and social situation within the national framework; and a separately funded preparatory education programme ensuring newly arrived migrants receive language and cultural orientation support before full school integration. Development projects additionally address underachievement in schools with high proportions of multilingual learners.",
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
      "Finland's most internationally prominent education research faculty, conducting longitudinal studies in multicultural pedagogy, intercultural learning, teacher education, and educational sociology. The faculty draws on Finland's unique position as a country that rapidly transformed from emigration to immigration society, producing data on immigrant integration and educational equity unavailable elsewhere in the Nordic context. Strong international partnerships span Nordic consortia and Horizon Europe research networks, positioning Finnish ITC scholarship within broader European comparative frameworks.",
    relevanceToINTRACOMP:
      "Produces peer-reviewed empirical research informing INTRACOMP theoretical frameworks, including longitudinal cohort studies on ITC development among Finnish pre-service and in-service teachers that provide the project with Nordic evidence on competence formation.",
    relationToITC:
      "Research centres on how teachers develop, enact, and assess ITC in increasingly diverse Finnish classrooms. Longitudinal studies track ITC growth across teacher education programmes, identifying pedagogical approaches that produce durable intercultural attitudes. Research on translanguaging in Finnish schools challenges monolingual curriculum assumptions and feeds into OPH's revision processes. International comparative projects situate Finnish ITC development within Nordic and European contexts, contributing cross-country comparative perspectives directly relevant to INTRACOMP's analytical framework.",
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
      "Active partner in Nordic research consortia examining intercultural education across Denmark, Sweden, Norway, and Finland. Researchers regularly serve on OPH expert panels for curriculum revision and are cited in Finnish government integration policy documents. Collaborative doctoral programmes with Nordic partner universities produce intercultural education researchers whose work spans multiple national contexts. Helsinki Metropolitan Area schools function as practitioner research sites, grounding academic ITC scholarship in lived classroom reality.",
    languages: ["Finnish", "English", "Swedish"],
    equityAddressed:
      "Research explicitly addresses educational equity for immigrant-background students, documenting achievement gaps, teacher expectation biases, and the protective role of cultural identity maintenance on educational outcomes. Projects examine the experiences of Somali, Iraqi, and East African communities — facing compound disadvantage from language barriers, discrimination, and socioeconomic precarity. Findings are translated into professional development for teachers in high-diversity schools in Helsinki and Tampere metropolitan areas, creating a direct pipeline from equity research to classroom practice.",
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
      "Moniheli is an umbrella network representing over 100 multicultural and immigrant-led associations across Finland, operating as a bridge between civil society, public institutions, and policy makers. Founded to strengthen the collective voice of immigrant communities in Finnish civic life, it advocates for cultural diversity, anti-discrimination, and equal participation across education, employment, and community life. Its member organisations represent diaspora communities from over 50 countries of origin, making it one of Finland's most culturally diverse civil society coalitions. Moniheli actively participates in national consultation processes on immigration, integration, and multicultural education policy.",
    relevanceToINTRACOMP:
      "Bridges ITC policy recommendations and grassroots intercultural practice, providing community-level implementation perspectives that complement formal education and administration viewpoints and ensuring INTRACOMP's analysis reflects civil society realities.",
    relationToITC:
      "Moniheli translates policy-level ITC goals into community practice through intercultural dialogue workshops, peer-learning events, and capacity-building programmes targeting both immigrant communities and Finnish majority society. Its Kulttuuriluotsit (Cultural Guide) programme trains bilingual community mediators to facilitate intercultural understanding between newly arrived migrants and Finnish institutions. Annual multicultural festivals and dialogue forums create public spaces for intercultural encounter beyond formal education, demonstrating the essential role of civil society in building ITC across populations that schools alone cannot reach.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Migration"],
    geographicalScope: ["national"],
    link: "https://example-moniheli.fi/en/itc-programmes",
    impactInfluence: "symbolic",
    connections: ["INS-FI-001", "STK-FI-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Offers co-design partnerships for developing intercultural training materials adapted to Finnish multicultural contexts, a valuable practical collaboration opportunity for INTRACOMP's applied research outputs. Involved in EU-funded social inclusion projects under ESF+ and maintains connections with local authorities in Helsinki, Tampere, and Turku. Recent expansion includes digital inclusion and online intercultural literacy programmes addressing specific vulnerabilities of immigrant communities in digital environments, reflecting emerging dimensions of ITC in Nordic welfare states.",
    languages: ["Finnish", "English", "Arabic", "Somali"],
    equityAddressed:
      "Specifically prioritises communities facing compound marginalisation: African and Middle Eastern diaspora communities experiencing racialised discrimination; women from conservative cultural backgrounds navigating barriers to civic participation; and undocumented migrants excluded from formal services. Advocacy targets structural barriers in Finnish institutions, pushing for anti-discrimination measures in hiring, housing, and education. The network documents and publicly reports on discrimination cases affecting member communities, contributing evidence-based equity advocacy to Finnish policy debates.",
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
      "Utdanningsdirektoratet (Udir) is Norway's national agency for implementing education policy across all schooling levels. Udir develops national curriculum frameworks, issues pedagogical guidance, manages quality assessment systems, and supports school improvement at municipal level. The Fagfornyelsen (curriculum renewal) process completed in 2020 — Udir's most significant recent undertaking — embedded democratic citizenship, critical thinking, and cultural diversity as interdisciplinary themes across all school subjects, fundamentally repositioning ITC within Norway's national educational mandate for the first time.",
    relevanceToINTRACOMP:
      "Implements ITC standards through the legally binding Fagfornyelsen curriculum renewal, positioning cultural awareness and democratic participation as cross-subject competences across all school levels — Norway's primary ITC regulatory mechanism.",
    relationToITC:
      "Udir's 2020 curriculum renewal introduced three interdisciplinary themes — Democracy and Citizenship, Sustainable Development, and Public Health and Life Mastery — each intersecting with intercultural competence. Subject curricula were redesigned for depth learning and cross-curricular competences, with cultural diversity embedded throughout. Udir provides guidance to municipalities on minority-language education provisions, coordinates with Sámi Parliament on curriculum for Sámi pupils, and manages Norway's PISA participation, contributing comparative equity data to international education discourse.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-udir.no/itc-curriculum",
    impactInfluence: "binding",
    connections: ["INS-NO-001", "INS-NO-002", "STK-NO-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Collaborates formally with the Sámi Parliament (Sametinget) on indigenous education rights, co-developing Sámi curriculum materials that reflect indigenous epistemologies rather than translating majority-culture content. Udir coordinates Norway's Erasmus+ participation, linking national curriculum work to European ITC priorities. Current development focus includes assessment frameworks for democratic citizenship competences drawing on Council of Europe RFCDC methodology. A post-Fagfornyelsen review of minority-language education provisions is ongoing.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Udir addresses equity through dedicated Sámi-language curricula in all Sámi languages, minority-language education rights for recognised minorities including Romani and Kven, and targeted guidance for schools serving newly arrived refugee and immigrant children. It funds multilingual learning support materials and coordinates with county authorities on interpreting services for families during school enrolment. Efforts to close attainment gaps between majority Norwegian and minority-background pupils are monitored through national quality registers with ethnic disaggregation.",
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
      "OsloMet is Norway's most professionally oriented university, with particular research strength in migration studies, multicultural education, social work in diverse contexts, and urban sociology. Located in a capital city where over 35% of residents have immigrant backgrounds, OsloMet's ITC research is grounded in the lived realities of one of Europe's most demographically diverse metropolitan populations. The Work Research Institute (AFI) and Centre for the Study of Professions (SPS) examine how professional practitioners — teachers, nurses, social workers — develop and deploy intercultural competence in Norwegian public services.",
    relevanceToINTRACOMP:
      "Key academic partner for research on ITC in vocational, professional, and higher education contexts, contributing empirical studies on intercultural communication in Norwegian workplaces, healthcare, and social services absent from other INTRACOMP partner portfolios.",
    relationToITC:
      "OsloMet's Centre for the Study of Professions leads research on how teachers, nurses, and social workers develop ITC through professional education and workplace practice, identifying gaps between ITC standards and the intercultural demands of multicultural workplaces. The MIGRATE research project (2019–2023) examined how newly arrived migrants experience Norwegian public services. OsloMet runs Norway's largest teacher education programme and has integrated intercultural pedagogy as a mandatory component of all teacher training qualifications, creating a research-to-professional-formation pipeline.",
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
      "Publishes research in Nordic and international journals including Intercultural Education and the Journal of Ethnic and Migration Studies. Collaborates with Nordic partners through Horizon Europe projects on migration and education. Proximity to Oslo city government enables close collaboration on urban inclusion policy and practitioner capacity building. Annual migration and diversity research conferences bring together Norwegian, Nordic, and European scholars to develop comparative ITC understanding across national educational contexts.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Research addresses intersections of gender, class, and ethnicity in Norwegian education and welfare, documenting how compound disadvantage affects migrants' access to quality intercultural support. Studies on second-generation immigrant youth in Oslo schools highlight racialisation processes within Norwegian educational institutions. Research on lone female migrants and unaccompanied asylum-seeking minors generates evidence for more equity-responsive integration policy. Professional education programmes train future social workers and healthcare staff to recognise structural inequalities facing migrant and minority communities.",
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
      "The Antirasistisk Senter is Norway's oldest civil society organisation dedicated to combating racism, xenophobia, and ethnic discrimination. Founded in 1990, it has evolved from crisis-response advocacy into a comprehensive education, training, and policy advocacy organisation. Operating nationally with close community connections in Oslo and major cities, the Centre monitors and documents racist incidents, provides anti-bias training to public institutions, and advocates for systemic reform of Norwegian legislation and practice to address structural racism in schools, workplaces, and public life.",
    relevanceToINTRACOMP:
      "Provides frontline anti-bias education and ITC training in schools and workplaces, translating ITC principles into practical tools for combating racism and discrimination — representing civil society's essential role in operationalising ITC beyond formal policy frameworks.",
    relationToITC:
      "The Centre develops practical ITC tools grounded in anti-oppression frameworks, distinguishing its approach from purely cultural-awareness-based models. School programmes include critical media literacy on racialisation, historical modules on Norwegian colonial history and immigration, and facilitated dialogue between students from diverse backgrounds. Workplace training helps employers recognise unconscious bias and structural discrimination, building institutional ITC capacity. Advocacy work connects ITC to anti-discrimination law, pushing for stronger hate crime legislation and enforcement.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Migration"],
    geographicalScope: ["national"],
    link: "https://example-antirasistisk.no/education",
    impactInfluence: "symbolic",
    connections: ["INS-NO-001", "STK-NO-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Offers consulting services to municipalities on inclusive intercultural policies and has advised the Norwegian government on hate crime legislation and anti-discrimination frameworks. Current initiatives include a digital media literacy programme targeting young Norwegians on online racism and a partnership with Norwegian trade unions on workplace anti-discrimination. The Centre grounds its ITC work in the lived experience of racialised communities, contributing survivor-centred perspectives to Norwegian intercultural education that academic and government actors cannot replicate.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Focuses specifically on communities experiencing racialised discrimination: Romani people and Sámi facing indigenous rights violations; sub-Saharan African diaspora communities experiencing anti-Black racism; Muslim communities subject to religious-racial profiling; Jewish communities facing persistent antisemitism; and South and Southeast Asian communities experiencing labour market discrimination. Legal advisory services support individuals who have experienced discrimination, generating evidence on the scale of discrimination in Norwegian society while providing direct equity support to affected individuals.",
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
      "Te Kete Ipurangi (TKI) is the Ministry of Education's national online education resource hub, providing curriculum guidance and teaching resources aligned with the New Zealand Curriculum and Te Marautanga o Aotearoa (the Māori-medium curriculum). The Ministry's mandate, underpinned by te Tiriti o Waitangi, requires giving effect to the partnership between Māori and the Crown in education. TKI's content spans bicultural education, Pacific learner achievement, multilingual learning, and inclusive education, reflecting New Zealand's constitutional commitment to honouring indigenous and Pacific identities within a nationally coherent framework.",
    relevanceToINTRACOMP:
      "Integrates te Tiriti o Waitangi-based bicultural principles and Pacific intercultural frameworks into the national curriculum, providing INTRACOMP with an indigenous-rights-based model of statutory ITC distinct from European migration-management approaches.",
    relationToITC:
      "The New Zealand Curriculum's key competences — 'relating to others' and 'participating and contributing' — are explicitly framed around cultural competence and understanding diverse perspectives. TKI operationalises these through culturally located teaching examples. The Tapasā framework for teachers of Pacific learners and Tātaiako framework for teachers of Māori learners provide ITC benchmarks tailored to indigenous and Pacific contexts. The ongoing curriculum refresh (2023–2025) deepens Treaty commitments through co-design with Māori iwi and Pacific communities.",
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
      "Maintains TKI as an open-access digital resource hub freely available to all New Zealand educators, supporting broad-based professional development without cost barriers. Current strategic priorities include closing digital equity gaps in access to culturally responsive resources for rural and low-decile schools. The Ministry collaborates with Māori tribal authorities and Pacific community organisations in resource development, ensuring TKI materials reflect authentic community voices rather than external interpretations of indigenous and Pacific cultures.",
    languages: ["English", "Māori"],
    equityAddressed:
      "The Treaty-based approach frames equitable outcomes for Māori students as a Crown obligation, not a welfare concession, under the Ka Hikitia — Ka Hāpaitia strategy. Pacific learner equity is addressed through the Tapasā framework and Pacific bilingual units. The curriculum refresh explicitly addresses historical exclusion of Māori and Pacific knowledge from the official curriculum, requiring all teachers to develop culturally responsive pedagogy as a professional standards requirement. Equity monitoring tracks Māori and Pasifika attainment with full ethnic disaggregation.",
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
      "Te Wānanga o Aotearoa is New Zealand's pan-tribal Māori tertiary institution and the country's second-largest tertiary provider by enrolments, serving over 25,000 learners annually. As a wānanga recognised in legislation, its mandate is to provide education grounded in mātauranga Māori (Māori knowledge) and tikanga Māori (cultural values and practices). Programmes span te reo Māori immersion to business, health, and social services, all designed around Māori epistemologies and community development goals. Governance by Māori communities for Māori communities embodies tino rangatiratanga (Māori self-determination) in tertiary education.",
    relevanceToINTRACOMP:
      "Represents an indigenous-led model of intercultural tertiary education centred on tikanga Māori and bicultural competence, offering INTRACOMP a non-Western ITC framework built around indigenous sovereignty rather than multicultural accommodation within a dominant culture.",
    relationToITC:
      "Te Wānanga o Aotearoa embeds ITC through complete immersion in Māori language, cultural values, and ways of knowing, directly challenging deficit-model approaches to indigenous education. Kaitiakitanga-based curricula integrate environmental stewardship, relational responsibility, and intergenerational knowledge transmission as intercultural competences essential to Māori identity. Programmes build cross-cultural understanding by framing Māori knowledge as a lens through which non-Māori learners can encounter radically different epistemological traditions. Pacific-focused programmes extend this to Samoan, Cook Islands Māori, and Tongan knowledge systems.",
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
      "Collaborates with Pacific Island nations through bilateral educational partnerships contributing to regional intercultural exchange. The affiliated research centre Ngā Pae o te Māramatanga (New Zealand's Māori Centre of Research Excellence) produces indigenous knowledge research of international significance for decolonial approaches to intercultural education. The wānanga model has attracted interest from First Nations institutions in Canada, indigenous universities in Australia, and tribal colleges in the United States as a reference for community-governed indigenous tertiary education.",
    languages: ["Māori", "English", "Samoan"],
    equityAddressed:
      "Prioritises Māori learners historically excluded from or alienated by mainstream higher education, including those from low-income backgrounds, without prior credentials, and older adults returning to learning. A no-prior-qualification entry model removes structural access barriers. The focus on te reo Māori revitalisation addresses the near-extinction of the language as a living community language — an acute equity issue with direct implications for cultural survival, intergenerational wellbeing, and identity security that no mainstream institution is positioned to address.",
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
      "The Pacific Community (SPC) is the principal intergovernmental scientific and technical organisation for the Pacific region, representing 27 Pacific island countries and territories plus metropolitan members including France, Australia, New Zealand, and the United States. The Human Development Programme spans education, health, social development, and cultural heritage. In education, SPC supports Pacific governments on curriculum development, teacher training, literacy, and multilingual education in a region of extraordinary linguistic diversity — over 1,200 languages — and unique geopolitical contexts of sovereignty, remoteness, and climate vulnerability.",
    relevanceToINTRACOMP:
      "Develops intercultural and multilingual education resources for Pacific island contexts, offering a unique regional model of ITC grounded in Pacific cultural identities, customary governance structures, and vernacular linguistic diversity absent from European comparators.",
    relationToITC:
      "SPC promotes Pacific cultural identity and multilingual learning as foundations of education quality. The Pacific Regional Education Framework (PacREF), co-developed with UNESCO and Pacific governments, positions cultural identity as a foundational pillar of education quality alongside literacy and numeracy. SPC's multilingual education programming supports mother-tongue-based instruction in Pacific vernacular languages, treating indigenous multilingualism as an educational asset. Community engagement recognises customary cultural authorities — chiefs, elders, church leaders — as legitimate education governance partners.",
    thematicFocus: ["Inter- and Transculturality", "Education", "Culture"],
    geographicalScope: ["regional"],
    link: "https://example-spc.int/education/ite-pacific",
    impactInfluence: "advisory",
    connections: ["INS-NZ-002", "STK-NZ-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Operates across an extraordinary range of political contexts — independent nations, French overseas territories, US territories, New Zealand dependencies, and Australian territories — requiring education frameworks adaptable to different governance structures. Current strategic priorities include climate-resilient education infrastructure and integrating traditional ecological knowledge (TEK) into Pacific science curricula as both cultural and scientific resource. Pacific-owned data systems support evidence-based education planning in countries with limited statistical capacity.",
    languages: ["English", "French", "Tok Pisin"],
    equityAddressed:
      "Addresses multiple intersecting Pacific equity challenges: geographic isolation of small island communities with limited school infrastructure; gender disparities in secondary and tertiary education in several Pacific nations; language access barriers for learners whose home languages lack written tradition; and climate-displacement-related disruption to schooling in low-lying atoll nations. The disability-inclusive education programme explicitly addresses marginalisation of learners with disabilities in Pacific school systems that lack specialist resources and inclusive pedagogy training.",
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
      "DGEFID (Direzione Generale per lo Studente, l'Integrazione e la Partecipazione) within the Italian Ministry of Education oversees student welfare, international policy coordination, and — critically — national frameworks for integrating foreign-born pupils, approximately one million of whom attend Italian state schools. DGEFID coordinates with regional education authorities (Uffici Scolastici Regionali) to implement intercultural integration guidelines and manages EU funding streams for migrant education under ESF+ and Erasmus+. Italy's highly centralised education governance makes DGEFID the pivotal authority for ITC policy implementation nationwide.",
    relevanceToINTRACOMP:
      "Sets national policy for intercultural education in Italian schools and administers integration programme funding for migrant students, making it the key regulatory authority in Italy's ITC policy landscape within the Mediterranean migration context.",
    relationToITC:
      "DGEFID issues national circulars constituting operational guidance for Italian schools on intercultural education, student reception protocols, and integration of foreign pupils. The landmark 2007 circular 'La via italiana per la scuola interculturale' established Italy's national intercultural education philosophy — distinguishing it from assimilationist models — and remains the foundational policy reference. DGEFID mandates ITC integration in teacher professional development for educators working with linguistically and culturally diverse student populations, supporting in-service training through national development programmes.",
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
      "Coordinates with UNHCR Italy on educational integration of refugee and asylum-seeking children, implementing Schools of Sanctuary approaches in Italian contexts. DGEFID manages Italy's PISA participation, using comparative data to track equity outcomes for immigrant-background pupils. Italy's high regional variation in immigration settlement patterns means DGEFID must coordinate policies across very different local contexts — from northern industrial cities with large established communities to southern coastal areas experiencing recent Mediterranean arrivals.",
    languages: ["Italian", "English"],
    equityAddressed:
      "Equity interventions target Italy's two most educationally vulnerable groups: newly arrived migrant children (neo-arrivati) requiring intensive language support and cultural mediation, and Roma pupils experiencing among Europe's highest dropout rates. Dedicated funding supports L2 Italian instruction, intercultural mediation services bridging school and family communication, and inclusion coordinators (referenti per l'intercultura) in high-diversity schools. Recent initiatives address second-generation immigrant students' identity needs, recognising ITC requirements differ across arrival cohorts and generational positions.",
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
      "The Department of Philosophy, Sociology, Pedagogy and Applied Psychology (FISPPA) at the University of Bologna brings together Italy's strongest interdisciplinary research capacity in educational philosophy, intercultural pedagogy, and social scientific approaches to cultural diversity in education. The University of Bologna's status as Europe's oldest university lends institutional authority to its engagement with intercultural questions. FISPPA's research is closely connected to Italian civil society and NGO networks, giving its scholarship a strongly applied and policy-facing orientation alongside theoretical rigour.",
    relevanceToINTRACOMP:
      "Produces peer-reviewed research on ITC in Italian educational and social work contexts, contributing Southern European theoretical and methodological perspectives to the INTRACOMP comparative framework that complement Nordic and Anglo-Saxon approaches.",
    relationToITC:
      "FISPPA runs Italy's most established master's programme in intercultural education (Didattica dell'Italiano come L2 e Educazione Interculturale), training practitioners for schools, NGOs, and public services. Its research agenda critically assesses Italy's official intercultural education model, examining gaps between ministerial rhetoric and classroom practice. Erasmus+ research partnerships connect FISPPA to German, French, and Greek intercultural education systems. Research on intercultural mediation — a profession unique to Italian educational contexts — provides evidence on cultural mediators as ITC facilitators between schools and migrant families.",
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
      "Collaborates on Erasmus+ projects examining intercultural learning outcomes across European university contexts and participates in comparative research on second-generation immigrant students in Southern European education systems. Editorial contributions span the Italian journal Educazione Interculturale and international journals including Intercultural Education. Ongoing research focuses on pedagogical challenges in highly multilingual Italian classrooms and on the professional identity development of intercultural mediators — a practitioner role FISPPA helped theorise and establish.",
    languages: ["Italian", "English", "French"],
    equityAddressed:
      "Research addresses intersections of class, gender, and ethnicity in Italian intercultural education, documenting how working-class migrant girls and racialised minority students experience compound disadvantage. Studies on educational tracking reveal how Italian streaming practices reproduce social inequality along ethnic and national-origin lines. Roma education research challenges deficit-based framings of underachievement, revealing instead the institutional failures that produce it. Participatory research designs ensure equity scholarship reflects perspectives of marginalised communities rather than only institutional viewpoints.",
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
      "COSPE (Cooperazione per lo Sviluppo dei Paesi Emergenti) is a Florence-based NGO founded in 1983 with a dual mandate of international development cooperation and domestic intercultural education and anti-discrimination work. Operating in over 25 countries and across all major Italian cities, COSPE bridges global and local dimensions of cultural diversity, human rights, and social justice. Its longstanding commitment to anti-racism situates ITC within a rights-based framework rather than purely a cultural enrichment or integration-efficiency rationale, distinguishing its approach from more accommodationist civil society actors.",
    relevanceToINTRACOMP:
      "Implements intercultural competence training across schools, workplaces, and community settings, representing grassroots NGO approaches to ITC that complement Italian government policy and academic research with direct community-facing practice insights.",
    relationToITC:
      "COSPE develops and delivers ITC training programmes for educators, social workers, and community organisations drawing on both intercultural education theory and anti-racism practice. Its Strade programme deploys trained cultural mediators in 15 Italian cities, facilitating communication between immigrant families and schools, hospitals, and public services. Global education work introduces teachers and students to connections between Italian local contexts and global inequality, building ITC alongside critical global citizenship competences. Training programmes are specifically adapted to healthcare, legal services, and juvenile justice professional contexts.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Migration"],
    geographicalScope: ["national"],
    link: "https://example-cospe.org/itc-training",
    impactInfluence: "symbolic",
    connections: ["INS-IT-001", "STK-IT-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Founding member of the Italian NGO coordination body CONCORD and participant in European anti-racism networks. Recent initiatives include a digital literacy programme for newly arrived migrants enabling access to online public services and a collaborative project with Italian trade unions on workplace anti-discrimination and ITC for migrant workers. COSPE's sport and intercultural integration programme uses football as an ITC development vehicle for youth in multicultural urban neighbourhoods, reaching communities not engaged through formal education channels.",
    languages: ["Italian", "English", "Arabic", "French"],
    equityAddressed:
      "Prioritises communities experiencing compounded vulnerability: refugees and asylum seekers navigating complex protection procedures, stateless persons lacking documentation and rights, unaccompanied foreign minors in the Italian care system, and trafficking survivors requiring specialised support. Intercultural mediation services address institutional barriers facing communities with limited Italian language proficiency, including newly arrived sub-Saharan African and Middle Eastern communities. Advocacy challenges institutional racism in Italian public services, combining direct service provision with systemic change orientation.",
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
      "The Hellenic Ministry of Education holds constitutional responsibility for Greece's national education system under highly centralised governance. Within the context of mass migration — Greece received over one million asylum seekers between 2015 and 2016 with ongoing arrivals — the Ministry has developed a distinctive intercultural education infrastructure including a network of 28 intercultural schools and a refugee education response programme. Its mandate also encompasses managing the relationship between Greek Orthodox religious education and pluralistic approaches to religious and cultural diversity, a constitutionally embedded tension unique to the Greek context.",
    relevanceToINTRACOMP:
      "Manages Greece's nationally mandated intercultural schools network and coordinates refugee education integration, providing INTRACOMP with a primary governmental case study from one of Europe's most pressured frontline intercultural education contexts.",
    relationToITC:
      "The Ministry operates 28 state intercultural schools (σχολεία διαπολιτισμικής αγωγής) where ITC is embedded in daily pedagogical practice through adapted curricula, multilingual instruction, and specialised teacher training. The DYEPTH Directorate's refugee education programme established Reception and Education Structures for Refugee Children in response to mass displacement. National curriculum includes an intercultural dialogue component in social studies and history, requiring critical engagement with Greek multicultural heritage alongside contemporary migration realities.",
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
      "Greece's intercultural schools model has been recognised by the Council of Europe and the European Commission as an innovative European reference for ITC in high-migration contexts. The Ministry collaborates with UNHCR Greece, UNICEF, and EUAA on refugee education coordination. Ongoing challenges include teacher retention in refugee education, resource constraints under sustained fiscal austerity, and the complex legal status of children born to undocumented parents. Reform discussions include extending intercultural principles beyond the 28 dedicated schools to all Greek schools serving diverse populations.",
    languages: ["Greek", "English"],
    equityAddressed:
      "The Ministry's intercultural mandate most directly addresses exclusion of refugee and undocumented migrant children, particularly those in reception facilities and urban informal settlements. Dedicated intercultural schools provide structured multilingual education prioritising children with significant educational disruption. Greek Roma communities, particularly in rural Epirus, Macedonia, and Thrace, represent a major equity focus with dedicated programmes targeting chronic absenteeism. Muslim minority education in Thrace, governed by specific constitutional and treaty provisions, adds a constitutionally distinct dimension to the Ministry's equity responsibilities.",
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
      "The Aristotle University of Thessaloniki (AUTH) is Greece's largest university. Its School of Education encompasses Early Childhood, Primary, and Secondary Education faculties engaged in research and teacher preparation across diverse pedagogical traditions. Located in Thessaloniki — historically the home of Jewish, Muslim, Romani, and diverse Christian communities as a former Ottoman capital — AUTH's education research is deeply informed by the Balkan region's complex history of intercultural coexistence and conflict, giving it a distinctive regional grounding absent from Western European ITC scholarship.",
    relevanceToINTRACOMP:
      "Provides ITC frameworks adapted to Balkan and Southeast European multicultural contexts, contributing regionally specific research perspectives from a post-Ottoman, post-conflict region that complements Nordic and Western European approaches in INTRACOMP.",
    relationToITC:
      "AUTH's Laboratory of Intercultural and Migration Studies (ΛΔΕΜ) produces empirical research on ITC in Greek schools, focusing on teacher attitudes, curriculum implementation, and educational experiences of migrant and minority students. Research examines how Greek teachers develop ITC through pre-service and in-service training. AUTH participates in Horizon Europe projects connecting Greek ITC development to European comparative contexts and addresses the tension between national identity formation — historically centred on Hellenic cultural continuity — and the demands of intercultural openness in a diverse democratic society.",
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
      "Participates in Horizon Europe projects on ITC and migration in southern Europe and maintains bilateral research partnerships with Italian, Turkish, and Balkan universities. AUTH collaborates with UNHCR Greece on teacher training resources for refugee education and with the Greek Ombudsman on school desegregation monitoring. Recent research examines digital intercultural learning during COVID-era distance education, revealing new inequalities in ITC development for students with limited digital access — a finding with implications for post-pandemic ITC policy across southern Europe.",
    languages: ["Greek", "English"],
    equityAddressed:
      "Research addresses marginalisation of Roma students in Greek schools, documenting high dropout rates, segregation in dedicated classes, and failures of assimilationist approaches. Studies on Muslim minority education in Western Thrace — governed by a constitutional and treaty framework granting partial religious autonomy — examine how this community navigates Greek educational institutions while maintaining cultural and religious distinctiveness. Research on asylum-seeker and refugee children in Thessaloniki schools generates evidence on Greek teachers' ITC capacity facing unprecedented classroom diversity following the 2015 mass displacement crisis.",
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
      "Generation 2.0 for Rights, Equality and Diversity (Generation 2.0 RED) is a Greek civil society organisation founded and led by second-generation immigrants and people of migrant background. Operating since 2011, it works on anti-discrimination advocacy, equal citizenship rights, and intercultural inclusion. Known for advocacy on Greek citizenship law reform, community-based intercultural programmes, and use of theatre, art, and storytelling as intercultural dialogue tools, it deliberately centres voices and expertise of people with lived migration experience, challenging paternalistic approaches to immigrant integration from outside the affected communities.",
    relevanceToINTRACOMP:
      "Bridges ITC policy and lived migrant experience in Greece, co-designing intercultural resources with communities directly affected by cultural exclusion — providing INTRACOMP with authentic community perspectives on ITC that policy and academic actors cannot replicate.",
    relationToITC:
      "Generation 2.0 RED delivers community-based ITC programmes that go beyond cultural awareness to address structural racism, citizenship inequality, and the politics of belonging in Greek society. Community theatre projects bring together youth from diverse cultural backgrounds to develop shared narratives, building relational ITC through creative practice. Advocacy on citizenship law reform challenges legal frameworks excluding second-generation immigrants from civic participation, connecting ITC to fundamental questions of democratic belonging. School-based programmes introduce students to diversity as a resource and challenge ethnically homogeneous representations of Greek national identity.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["local and national"],
    link: "https://example-generation2.gr/itc-programmes",
    impactInfluence: "symbolic",
    connections: ["INS-GR-001", "STK-GR-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Co-facilitates the Council of Europe's Intercultural Cities initiative in Athens, contributing Greek urban experience to a European network developing intercultural governance policies. Produces advocacy reports on discrimination and citizenship rights that feed into EU monitoring and Council of Europe human rights reporting. Collaboration with Greek universities on community-based participatory research enables rigorous evidence generation grounded in community experience. Recent programmes address digital discrimination and online hate speech targeting immigrant communities in Greece, reflecting the growing ITC dimension of digital public space.",
    languages: ["Greek", "English", "Albanian", "Bangla"],
    equityAddressed:
      "Focuses on second-generation immigrants — particularly those born in Greece to undocumented parents — who face statelessness or severely restricted civic rights despite cultural integration into Greek society. Advocates for simplified citizenship procedures, ending statelessness for Greek-born children, and equal access to higher education and employment for those with uncertain legal status. Programmes reach Albanian, Pakistani, and West African second-generation youth experiencing racial profiling, housing and employment discrimination, and barriers to political participation despite having grown up as fully socialised members of Greek society.",
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
      "The Bundeszentrale für politische Bildung (Federal Agency for Civic Education, bpb) is a federal authority under the Interior Ministry, mandated to strengthen political literacy, democratic values, and engagement across the German population. Founded in 1952 in the aftermath of National Socialism, bpb carries a historically grounded commitment to preventing authoritarianism through democratic education. It publishes accessible materials on political, historical, and social issues; operates exhibitions and educational events; manages educational funding for civil society democracy programmes; and integrates intercultural understanding throughout its work as a core dimension of democratic citizenship.",
    relevanceToINTRACOMP:
      "Develops and widely disseminates ITC materials for formal and non-formal education in Germany, positioning intercultural competence within a democratic culture framework — the specifically German approach to ITC grounded in post-1945 civic education traditions.",
    relationToITC:
      "bpb publishes extensively on migration, diversity, integration, and ITC, with its free publications database containing hundreds of titles on intercultural dialogue, racism, religious diversity, and immigration history. Flagship magazine Aus Politik und Zeitgeschichte (APuZ) regularly addresses intercultural themes for educated general audiences. bpb-funded events including the Federal Congress of Political Education bring together practitioners developing ITC across German schools, youth work, and adult education. The agency supports Demokratiezentren in all 16 Bundesländer, which include intercultural education as a component of local democracy programming.",
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
      "Free publication service reaches over one million recipients annually, making bpb one of Germany's most impactful civic education institutions by reach. Current strategic priorities include digital political education for younger audiences, addressing online hate speech and disinformation undermining intercultural competence, and developing ITC resources for Germany's diverse Muslim communities and diaspora populations from Turkey, Arab countries, and sub-Saharan Africa. bpb participates in European civic education networks and cooperates with the Council of Europe on RFCDC dissemination in Germany.",
    languages: ["German", "English", "Turkish", "Arabic"],
    equityAddressed:
      "Addresses racialised and class-based barriers to civic participation for immigrants, people of colour, and lower socioeconomic groups, recognising that democratic literacy — including ITC — is unequally distributed across German society. Multilingual publications in Arabic, Turkish, and English directly serve communities with limited German-language access to civic information. Work explicitly addressing antisemitism, anti-Muslim racism, and anti-Black racism acknowledges intersecting discrimination within German society. Special programmes address newly arrived migrants' civic education needs, including citizenship curriculum used in integration courses mandated under German immigration law.",
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
      "The Institute for Educational Sciences at Humboldt-Universität zu Berlin (HU Berlin) is one of Germany's most internationally prominent educational research centres, with particular strength in critical pedagogy, sociological approaches to education, and the study of migration and cultural diversity. Located in Berlin — Germany's most culturally diverse city and home to one of Europe's largest Turkish, Vietnamese, and Arab diaspora communities — HU Berlin's educational research operates within a unique urban laboratory of cultural multiplicity. Its critical tradition, drawing on Frankfurt School thought and Paulo Freire's pedagogy, positions ITC as a political and transformative enterprise.",
    relevanceToINTRACOMP:
      "Contributes critical theoretical frameworks for ITC in diverse urban school environments, challenging purely instrumental approaches and connecting intercultural education to questions of power and structural racism — advancing INTRACOMP's conceptual framework beyond technical competence models.",
    relationToITC:
      "The institute hosts the migrationspädagogik research group, which developed critical alternatives to mainstream multicultural education, challenging the culturalisation of social problems and pushing for racism-critical approaches to ITC in German schools. Research on Othering processes examines how institutional practices construct immigrant-background students as cultural outsiders even within nominally inclusive programmes. Work on DaZ (Deutsch als Zweitsprache) pedagogy combines language learning with intercultural and identity-affirming approaches, influencing national standards for teacher education.",
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
      "Participates in DAAD-funded networks on international teacher education reform and collaborates with teacher training programmes across Germany on integrating racism-critical ITC into initial teacher education. Cooperates with Berlin's Senate Department for Education on city-level intercultural school development. Current doctoral projects examine ITC development of newly qualified teachers in Berlin's multilingual schools, generating practitioner-level evidence on how critical ITC is formed in professional contexts and whether university-based critical approaches translate into classroom practice.",
    languages: ["German", "English"],
    equityAddressed:
      "Critical research directly addresses racialisation of class in German schools, documenting how Turkish, Arab, and sub-Saharan African-background students are disproportionately placed in lower school tracks (Hauptschule) regardless of potential — constituting systematic institutional discrimination. Research on Willkommenskultur (welcome culture) critically examines the limits and exclusions of German integration discourse, revealing how integration requirements are imposed unequally on different migrant communities. Studies on Sinti and Roma in Berlin schools provide evidence on the persistence of antigypsyism within German educational institutions.",
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
      "The Rat für Migration is a German network of scholars, researchers, and civil society experts providing independent evidence-based analysis of migration, integration, and diversity policy. Unlike traditional advocacy NGOs, it operates as a scholarly-civil society hybrid: combining rigorous academic expertise with explicit policy advocacy, challenging government narratives on migration through research-based counter-arguments. Members include social scientists, legal scholars, and practitioners from across Germany's university and civil society landscape, giving it both academic credibility and policy relevance. It engages directly with parliamentary processes, media, and public discourse.",
    relevanceToINTRACOMP:
      "Advocates for ITC-informed migration and integration policies at federal and state level, connecting academic ITC scholarship to German policy debates and providing evidence-based critique that complements INTRACOMP's academic research with policy advocacy perspectives.",
    relationToITC:
      "The Council for Migration publishes policy briefs and expert statements linking ITC to broader integration policy, arguing for rights-based rather than assimilationist approaches to cultural diversity management. Position papers on Willkommenskultur, diversity management in public institutions, and institutional anti-discrimination engage directly with policy frameworks shaping German ITC practice. Its critique of German Integrationskurse (integration courses) challenges purely instrumental language and civic education approaches, pushing for more genuinely bidirectional ITC-informed integration support.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Education"],
    geographicalScope: ["national"],
    link: "https://example-rat-fuer-migration.de/itc-policy",
    impactInfluence: "advisory",
    connections: ["INS-DE-001", "STK-DE-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Engages directly with Bundestag committees on migration legislation and provides expert testimony in parliamentary hearings. Contributes to European migration policy debates through partnerships with networks in the Netherlands, UK, and Scandinavian countries. Current advocacy focuses on reforming Germany's Integrationspolitik to reflect contemporary understandings of ITC and structural racism, and on ensuring new German citizenship legislation facilitates rather than hinders intercultural belonging. Media engagement through op-eds and public forums reaches both policy audiences and broader German public discourse.",
    languages: ["German", "English"],
    equityAddressed:
      "Explicitly addresses structural racism and antigypsyism in German institutions through policy advocacy, situating these as systemic features requiring legislative reform rather than individual prejudice problems. Work on racialised profiling by police and discrimination in employment and housing provides evidence connecting ITC deficits in German institutions to material inequality for minority communities. Advocates for rights of long-term residents denied German citizenship and voting rights, connecting intercultural inclusion to democratic participation and challenging the exclusion of settled communities from political voice.",
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
      "The Serbian Ministry of Education (Ministarstvo prosvete, nauke i tehnološkog razvoja) exercises comprehensive authority over education from pre-primary through higher education, including curriculum standards, teacher qualification requirements, and minority education rights. Serbia's EU accession process — candidate country since 2012 — has made educational reform a strategic priority, with Chapter 26 negotiations requiring alignment with EU standards on minority rights and educational quality. The Ministry must balance majority Serbian national identity affirmation with constitutionally mandated minority rights for over 20 recognised national minorities.",
    relevanceToINTRACOMP:
      "Leads national policy on minority-language education and ITC integration within EU accession reforms, providing a Western Balkan perspective on intercultural education governance operating under accession conditionality — a distinctive context absent from other INTRACOMP partner countries.",
    relationToITC:
      "The Ministry oversees curriculum development incorporating ITC as part of Serbia's EU accession educational reforms, embedding intercultural dialogue as a cross-curricular competence. Minority language instruction in Hungarian, Slovak, Romanian, Rusyn, Croatian, Albanian, and Romani represents institutionalised linguistic ITC provisions. The Ministry coordinates with the Office for Human and Minority Rights on National Minority Councils' educational rights and has developed dedicated teacher training on working with Roma pupils. Post-conflict reconciliation dimensions in history and social studies curricula add a specific ITC challenge: narrating shared Balkan histories in ways that promote rather than undermine intercultural understanding.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-mpn.gov.rs/intercultural",
    impactInfluence: "binding",
    connections: ["INS-RS-001", "INS-RS-002", "STK-RS-002"],
    recommendedNextSteps: "engage",
    additionalRemarks:
      "Coordinates with OSCE Mission to Serbia on minority education rights monitoring and implementation of international commitments. Participates in regional Balkan educational cooperation through the Regional Cooperation Council's Education Reform Initiative. EU accession Chapter 26 negotiations are driving accelerated curriculum reforms, with ITC-related outcomes explicitly referenced in EU progress reports. Ongoing challenges include underfunding of minority education provisions, shortage of qualified teachers for minority-language instruction, and need to align higher education legislation with Bologna Process standards.",
    languages: ["Serbian", "English", "Hungarian", "Romani"],
    equityAddressed:
      "Primary equity mechanisms include constitutionally guaranteed mother-tongue instruction for all recognised national minorities, Roma education support through pedagoški asistenti (education assistants) in schools with significant Roma enrolments, and targeted scholarships for students from marginalised communities. Reducing Roma educational exclusion — characterised by late enrolment, grade repetition, segregation, and early dropout — remains the most acute equity challenge. Hungarian communities in Vojvodina, Bosniak communities in Sandžak, and Albanian communities in Preševo Valley represent further distinct minority contexts requiring tailored intercultural approaches.",
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
      "The Faculty of Philosophy at the University of Belgrade (Filozofski fakultet) is Serbia's leading humanities and social sciences faculty, housing Philosophy, Sociology, Psychology, History, Pedagogy, and language departments. As Serbia's most prestigious humanities institution with over 10,000 students, it is the primary site of academic knowledge production on multiculturalism, ethnic relations, and educational policy in Serbia and the Western Balkans. Its research engages directly with the post-Yugoslav political landscape — contested narratives of 1990s conflicts, minority reconciliation, and the management of ethnic diversity in successor states — giving it a regionally irreplaceable scholarly perspective.",
    relevanceToINTRACOMP:
      "Provides regionally specific research on ITC in post-conflict, multi-ethnic, and EU-accession educational contexts unique to the Western Balkans, offering INTRACOMP perspectives on ITC development where intercultural tensions remain politically active rather than historically resolved.",
    relationToITC:
      "The Pedagogy Department publishes on intercultural dialogue in Serbian schools, examining how teachers navigate politically sensitive interethnic histories alongside contemporary diversity management. Research on multicultural education in Vojvodina — Serbia's most diverse province — provides granular study of ITC practice in a legally multilingual educational context. Collaborative research with universities in Bosnia-Herzegovina, North Macedonia, and Croatia contributes to understanding ITC challenges shared across Western Balkan post-conflict societies. The faculty trains pedagogical researchers and school counsellors who directly implement ITC-related educational practices in Serbian schools.",
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
      "Collaborates with regional Balkan universities on post-conflict reconciliation and minority rights through humanities research networks. Partner in EU-funded projects on Balkan reconciliation under the Western Balkans Research and Innovation Support mechanism. The Sociology Department contributes to European sociological research on migration and integration through European Sociological Association network membership. Doctoral dissertations regularly examine ITC-relevant themes including minority identity maintenance, intercultural marriage, and the sociology of multicultural schooling in Serbia's diverse regional contexts.",
    languages: ["Serbian", "English"],
    equityAddressed:
      "Research foregrounds Roma educational inclusion as Serbia's most urgent equity issue, generating evidence on structural mechanisms producing underachievement: socioeconomic poverty, discrimination in school access, inadequate Roma Education Assistants, and inappropriate placement of Roma children in special education. Studies on Bosniak Muslim communities in Sandžak and Albanian communities in Preševo Valley examine how political tensions complicate ITC in minority-majority relations marked by historical injustice. Post-conflict reconciliation research examines how shared Yugoslav histories can be taught in ways that build rather than foreclose intercultural understanding between Serbian, Croatian, Bosniak, and Albanian communities.",
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
      "The Roma Education Fund (REF) is an international foundation established following the Decade of Roma Inclusion initiative, operating national offices across Central and Eastern Europe. The Serbia office, based in Belgrade, implements REF's mandate to close educational gaps between Roma and non-Roma populations through scholarships, school desegregation advocacy, teacher training, and community engagement. REF Serbia works across over 50 municipalities with significant Roma populations, building partnerships with local authorities, schools, and Roma civil society organisations. Its approach is explicitly evidence-based, combining advocacy with rigorous data collection on Roma educational outcomes.",
    relevanceToINTRACOMP:
      "Advances equity-centred ITC in Serbian schools by building intercultural competence among non-Roma educators working with Roma students, representing the most focused civil society ITC intervention addressing structural exclusion of the most marginalised community in Serbian education.",
    relationToITC:
      "REF Serbia trains school mediators (pedagoški asistenti) in ITC approaches specifically designed for Roma-non-Roma school contact, challenging anti-Roma bias and developing educators' capacity for culturally responsive pedagogy. Teacher training addresses the distinctive cultural values, family structures, and learning backgrounds of Roma communities, helping non-Roma teachers move beyond deficit assumptions to recognise Roma children's strengths and knowledge. REF's advocacy against Roma school segregation — the practice of placing Roma children in separate classes or special schools — directly challenges institutional failures of ITC at the system level.",
    thematicFocus: ["Inter- and Transculturality", "Education", "Culture"],
    geographicalScope: ["local and national"],
    link: "https://example-romaeducationfund.org/serbia",
    impactInfluence: "symbolic",
    connections: ["INS-RS-001", "STK-RS-001"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Works across municipalities with significant Roma populations including Niš, Kragujevac, Leskovac, and Vranje, with particular focus on informal settlements excluded from mainstream public services. Collaborates with the European Roma Rights Centre (ERRC) on legal cases challenging school segregation. Recent initiatives include a digital inclusion programme providing tablets and internet access to Roma families whose children require remote schooling, addressing the severe digital divide exposed by COVID-era distance education. Annual monitoring reports on Roma educational outcomes in Serbia are used by the Serbian government, EU accession monitors, and OSCE in policy evaluation.",
    languages: ["Serbian", "Romani", "English"],
    equityAddressed:
      "Exclusively focused on Roma educational inclusion — widely recognised as one of Europe's most severe cases of educational exclusion. Roma children in Serbia face compounding barriers: poverty, lack of civil registration, discrimination by non-Roma educators, inadequate Serbian language preparation, frequent family mobility, and in some cases no permanent address required for enrolment. REF's scholarship programme supports Roma students through secondary and higher education with explicit gender equity attention, given particular pressures on Roma girls around early marriage and school dropout. Legal advocacy supports families whose children have been unlawfully refused enrolment or placed in segregated classes.",
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
      "The Framework defines eight key competences all citizens need for personal fulfilment, social participation, active citizenship, and employability, including multilingual competence and cultural awareness and expression. Member states are expected to integrate these competences across formal education from early childhood through adult learning, using the Framework as basis for curriculum design, assessment development, and teacher training standards. The cultural awareness and expression competence explicitly includes intercultural dialogue and the appreciation of cultural diversity as a standalone key competence since the 2018 revision.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Provides the EU-level conceptual underpinning for ITC as a lifelong learning outcome, supplying INTRACOMP with the formal European policy rationale that all partner countries' education systems are expected to address.",
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
      "The 2018 revision replacing the 2006 framework strengthened cultural awareness and expression as a standalone key competence and introduced citizenship competence with an explicit intercultural dialogue dimension. The Framework is referenced in national curriculum legislation across all 27 EU member states and informs Europass qualification recognition tools. The European Education and Training Monitor annually tracks member state progress in embedding key competences, with cultural and intercultural competences receiving increasing attention in country reports as migration and diversity reshape European societies.",
    languages: ["English", "French", "German", "and all 24 EU languages"],
    equityAddressed:
      "Explicitly requires member states to ensure all learners — including those from disadvantaged socioeconomic backgrounds, those with disabilities, early school leavers, and adults with low initial qualifications — have the opportunity to develop all eight key competences. Specific guidance addresses learners requiring additional support, including those learning in a second language and adult migrants acquiring host-country literacy. The 2018 recommendation strengthened the equity dimension by calling for validation of non-formal and informal learning, ensuring disadvantaged populations can have their competences recognised without formal credential pathways.",
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
      "Erasmus+ 2021–2027 operates with a budget of 26.2 billion euros to support mobility, cooperation, and innovation across education, training, youth, and sport in 33 programme countries and partner countries worldwide. Core actions cover individual mobility (KA1), cooperation partnerships and innovation (KA2), and support for policy development (KA3). Intercultural learning is a mandatory dimension of all mobility activities through Youthpass and Europass frameworks, with grant conditions requiring participants to engage in pre-departure, during-stay, and post-mobility structured intercultural reflection activities as formally assessed competence-building processes.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Funds intercultural exchange and ITC development projects across all INTRACOMP partner regions, with direct relevance to all partner institutions as both potential project leaders and contexts of Erasmus+ implementation analysis.",
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
      "Budget of 26.2 billion euros for 2021–2027 represents an 87% increase over 2014–2020, reflecting the EU's strategic commitment to intercultural exchange. The programme integrates Creative Europe cultural cooperation dimensions, creating synergies between educational and cultural intercultural learning. Small-scale partnerships, introduced in this cycle, enable smaller organisations including diaspora associations and grassroots community groups to access Erasmus+ funding without the administrative burden of large-scale projects. Post-2027 programme architecture is under discussion, with intercultural dialogue expected to remain a core priority.",
    languages: ["English", "French", "German", "and all 24 EU languages"],
    equityAddressed:
      "The inclusion and diversity strategy, a cross-cutting priority for 2021–2027, requires all National Agencies to develop action plans reaching organisations and learners historically excluded from Erasmus+: those with disabilities or health problems, those in care or post-care, those from low socioeconomic backgrounds, those from rural or remote areas, and newcomers to the EU including refugees and asylum seekers. Small-scale partnerships specifically enable grassroots actors serving marginalised communities to participate, ensuring ITC benefits are not confined to well-resourced institutional applicants.",
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
      "The National Core Curriculum for Basic Education mandates integration of intercultural competence outcomes across all subjects from grades 1–9. The 2014 reform introduced seven transversal competences including Cultural Competence, Interaction and Self-Expression (L2) and Multiliteracy (L4), collectively constituting Finland's formal ITC learning framework. Schools are legally required to implement curricula aligned with OPH's core curriculum, giving these provisions binding force at municipal and school level. A separately mandated preparatory education programme provides ITC-focused transitional schooling for newly arrived migrant pupils before mainstream integration.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Establishes Finland's legally binding national ITC standard for formal education, providing INTRACOMP with a Nordic reference model for statutory curriculum integration of intercultural competence across all school subjects and grade levels within a high-performing education system.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-oph.fi/curricula/basic-education/multicultural",
    impactInfluence: "binding",
    connections: ["STK-FI-001", "STK-FI-003", "INS-EU-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Revised in 2014; next comprehensive revision anticipated for 2026, when digital multiliteracy and global citizenship are expected to be further strengthened alongside ITC. OPH has published practical guidance materials supporting teachers in implementing transversal competences, including intercultural pedagogy examples and ITC assessment criteria. The curriculum revision process involves formal consultation with the Sámi Parliament on Sámi-specific curriculum provisions. Finland's high PISA performance provides comparative context for understanding how ITC is implemented within a high-achieving education system.",
    languages: ["Finnish", "Swedish"],
    equityAddressed:
      "Equity provisions include dedicated Sámi-language curricula in Inari Sámi, Northern Sámi, and Skolt Sámi; accommodations for Finnish Sign Language and Romani language learners; mother-tongue instruction for immigrant pupils in over 50 heritage languages funded by municipalities; and the separately mandated preparatory education programme for newly arrived migrants. Additional provisions address Roma pupils, traveller families with irregular attendance, and students returning from extended overseas residence, covering a breadth of marginalised learner situations absent from many comparable national frameworks.",
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
      "The Helsinki Metropolitan Area Intercultural Strategy establishes a coherent approach to intercultural education across approximately 110 Helsinki basic education schools, where 20% of pupils speak a language other than Finnish or Swedish as their home language, with over 70 languages represented. Strategic objectives include: mandatory cultural competence professional development for all teaching staff; strengthening mother-tongue instruction in languages beyond statutory Sámi and Romani; developing school-community partnerships with immigrant associations; and creating peer learning opportunities across schools with different diversity profiles. A dedicated action plan targets schools in eastern and north-eastern Helsinki with the highest concentrations of newly arrived pupils.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Serves as a leading European urban case study for metropolitan ITC strategy in the Nordic context, demonstrating how a high-capacity municipality translates national curriculum ITC mandates into targeted urban implementation programmes.",
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
      "Evaluated annually through an advisory group including school representatives, immigrant association leaders, and academic experts from the University of Helsinki. Helsinki's experience as an urban ITC laboratory is shared through Nordic city networks including the Nordic Network of Multicultural Cities. The 2025 strategy revision is expected to incorporate post-COVID learnings on digital inequality and the specific ITC challenges of hybrid schooling environments in high-diversity schools, responding to new dimensions of intercultural learning that emerged during pandemic-era distance education.",
    languages: ["Finnish", "Swedish", "English"],
    equityAddressed:
      "Specifically targets schools in Helsinki's Itäinen (Eastern) and Koillinen (North-Eastern) districts, which have the highest concentrations of newly arrived immigrant students and significant poverty-diversity intersection. Equity measures include additional teacher staffing ratios for schools exceeding diversity thresholds, priority professional development access for teachers in high-diversity schools, and targeted infrastructure investment in underinvested eastern neighbourhoods. Strategy addresses growing linguistic diversity among Somali, Arabic, Russian, Estonian, and Vietnamese communities, recognising equitable ITC provision must reach all communities systemically.",
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
      "Norway's Action Plan against Racism and Discrimination 2020–2023 establishes a whole-of-government strategy to combat racism and ethnic discrimination, with 60 specific measures across knowledge building, preventive work, hate crime response, and institutional accountability. In education, the plan targets both explicit racism incidents in schools and the structural dimensions of institutional discrimination disadvantaging ethnic minority and immigrant-background students. Measures include mandatory training for school staff in recognising and responding to discrimination, revised anti-discrimination guidance for school management, and public reporting requirements on discrimination incidents across the Norwegian school system.",
    implementationStatus: "evaluation",
    relevanceToINTRACOMP:
      "Provides the anti-discrimination policy context and legislative underpinning within which Norwegian ITC initiatives operate, situating intercultural competence within a rights-based framework of equality and non-discrimination rather than purely a cultural learning rationale.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-regjeringen.no/racism-action-plan",
    impactInfluence: "binding",
    connections: ["STK-NO-001", "STK-NO-003", "INS-NO-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Successor plan for 2024–2027 under development following NGO consultation coordinated by the Equality and Anti-Discrimination Ombud (LDO). Evaluation identifies significant implementation gaps in education-sector measures, particularly around mandatory training uptake and discrimination reporting quality. Development included formal consultation with Norwegian Islamic Council, the Jewish Community, Romani rights organisation Romanifolkets Riksforbund, and the National Association for Sámi Rights. International linkages include Norway's reporting to UN CERD and engagement with EU anti-racism monitoring frameworks.",
    languages: ["Norwegian", "English"],
    equityAddressed:
      "Specifically targets discrimination affecting Sámi people (recognising indigenous rights violations), Romani and traveller communities experiencing severe exclusion from mainstream Norwegian society, Muslim communities subject to Islamophobia and security stigmatisation, Jewish communities facing antisemitism, and Black and African diaspora experiencing racialised labour market discrimination. Intersectional dimensions are explicitly recognised, with specific attention to compound disadvantages experienced by Muslim women and Romani women. Legal amendments to the Equality and Anti-Discrimination Act were included in the plan's legislative package to strengthen institutional accountability.",
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
      "The Fagfornyelsen, completed in 2020 and implemented across Norwegian primary and secondary schools, redesigned the national curriculum around depth learning, interdisciplinary competences, and democratic citizenship. Three overarching interdisciplinary themes — Democracy and Citizenship, Sustainable Development, and Public Health and Life Mastery — run across all subjects, with cultural diversity and intercultural understanding central to the Democracy and Citizenship theme. Subject curricula were streamlined to reduce content overload while strengthening conceptual understanding, with cultural competence integrated as a core aspect of knowledge development in Norwegian, Social Studies, Religious Studies and Ethics, and Arts subjects.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Anchors ITC in national legal mandate for Norwegian schools from grades 1 through 13, providing a Nordic peer reference to Finland's OPH curriculum and enabling comparative analysis of statutory ITC integration approaches across the Nordic welfare education model.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-udir.no/fagfornyelsen/itc",
    impactInfluence: "binding",
    connections: ["STK-NO-001", "STK-NO-002", "INS-NO-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Implemented from August 2020 across all primary and secondary levels. The renewal process was one of Norway's most extensive educational reform consultations, involving teachers, parents, researchers, civil society, and specialist communities over five years. Post-implementation evaluation is ongoing, with early findings indicating uneven implementation of the Democracy and Citizenship interdisciplinary theme, particularly in rural schools with limited professional development access — an equity finding with implications for how curriculum ITC mandates translate into actual classroom practice.",
    languages: ["Norwegian", "Sámi languages"],
    equityAddressed:
      "Contains a dedicated Sámi curriculum strand (Samisk læreplan) developed in close collaboration with the Sámi Parliament through formal consultation rights, with culturally specific competence goals aligned with Sámi cultural values and knowledge traditions. Minority-language provisions for Romani and Kven communities are updated within the framework. Critically, the curriculum's explicit treatment of Norway's history of assimilation policies (Fornorskingspolitikken) toward Sámi and Kven communities integrates historical equity consciousness into the national curriculum for the first time, requiring all Norwegian pupils to engage with indigenous rights and historical injustice.",
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
      "The Mangfold og inkludering initiative provides targeted professional development, guidance materials, and resource networks supporting Norwegian early childhood education and school staff in developing inclusive diversity-responsive practices. Key components include online professional development modules on cultural diversity and ITC for kindergarten and school staff; a national network of regional resource centres providing consultancy and training to municipal authorities; specialist guidance on language support for multilingual children; and development of learning resources incorporating diverse cultural perspectives across all curriculum areas. The initiative complements the Fagfornyelsen curriculum framework by building practitioner capacity to implement ITC in daily educational practice.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Translates national ITC curriculum goals into concrete school-level professional development, representing Norway's primary capacity-building mechanism for practitioner ITC implementation and providing INTRACOMP with an implementation case study bridging policy mandate and classroom practice.",
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
      "Jointly administered by Udir and the Directorate of Integration and Diversity (IMDi), reflecting its cross-sectoral character. Evaluation findings indicate that schools engaging intensively with initiative resources show measurable improvements in minority-language student outcomes and teacher confidence in ITC delivery. Current development focus includes digital learning resources adaptable to different regional contexts and a strengthened focus on parental engagement strategies for families from communities with limited familiarity with Norwegian school culture — addressing a critical gap in most Norwegian ITC programmes.",
    languages: ["Norwegian"],
    equityAddressed:
      "Primarily targets kindergartens and schools with high proportions of minority-language children and newly arrived refugee and immigrant pupils, providing additional resources to settings where ITC demands on staff are greatest and existing capacity often thinnest. Geographic targeting includes northern Norway where Sámi-speaking children require specialist educator competence, and urban schools in Oslo, Bergen, and Stavanger serving large refugee and immigrant communities. A specific focus on unaccompanied asylum-seeking minors addresses the needs of a particularly vulnerable population typically placed in ordinary schools with minimal specialist intercultural support.",
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
      "The New Zealand Curriculum refresh (2023–2025) is deepening integration of te Tiriti o Waitangi principles, mātauranga Māori, and Pacific cultural perspectives across all curriculum learning areas. The Cultural Diversity dimension mandates that all schools ensure curricula affirm all students' cultural identities, incorporate New Zealand's diverse histories, and develop capacity for respectful engagement with cultural difference. Specific competences require understanding of te reo Māori and tikanga Māori, knowledge of Pacific cultures relevant to New Zealand, and intercultural skills for engaging with the country's diverse communities. Schools are required under the Education and Training Act 2020 to give effect to te Tiriti o Waitangi in their operations.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Represents a bicultural and multicultural ITC framework grounded in Treaty obligations and indigenous rights, offering INTRACOMP a non-European statutory ITC model centred on indigenous sovereignty rather than primarily migration management.",
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
      "Curriculum refresh includes unprecedented co-design with Māori iwi (tribal authorities) and Pacific community organisations, ensuring curriculum content reflects authentic community perspectives. Post-refresh implementation support includes a major teacher professional development investment under the Te Hurihanganui programme, addressing ITC development needs of non-Māori teachers working with Māori students. New Zealand's curriculum framework is being monitored internationally by Australia, Canada, and the United States as a model for Treaty-based intercultural curriculum reform in settler-colonial contexts.",
    languages: ["English", "Māori"],
    equityAddressed:
      "Treaty-based approach mandates equitable outcomes for Māori students as a Crown obligation rather than welfare concession, framing ITC equity as constitutional and rights-based. Pacific learner outcomes are addressed through curriculum content affirming Pacific identities and the Tapasā culturally responsive pedagogy framework. The refresh explicitly corrects historical exclusion of Māori and Pacific knowledge from the official curriculum, requiring all teachers to develop culturally responsive pedagogy as a professional standards requirement. Equity monitoring tracks Māori and Pasifika attainment with full ethnic disaggregation against national standards.",
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
      "The Pacific Education Plan establishes New Zealand's decade-long strategic commitment to improving outcomes, wellbeing, and cultural identity for Pacific learners — the largest Pacific student population outside Pacific Island nations. Strategic priorities include: increasing the proportion of Pacific learners achieving at or above national reading and mathematics standards; expanding Pacific bilingual and immersion education; growing the Pacific educator workforce to reflect community representation; strengthening school-community partnerships with Pacific families and churches; and embedding culturally responsive pedagogy across all schools serving Pacific communities. Specific targets include increasing Pacific teacher representation from 3% to 10% of the teaching workforce by 2030.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Provides a decade-long regional model for Pacific ITC integration within a national education system, demonstrating how a specific cultural community's educational needs can be addressed through a dedicated strategic framework alongside a general bicultural curriculum mandate.",
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
      "Guided by the Tapasā cultural competence framework for teachers of Pacific learners, providing specific competences for working effectively with Pacific students including understanding Pacific family structures, communication styles, and the central role of church communities in Pacific social organisation. Implementation monitoring is conducted annually with community consultation, and the Pacific advisory group includes representation from each major Pacific community and Pacific church denominations. International partnerships with Samoa, Tonga, and other Pacific nations support teacher exchange and curriculum development collaboration.",
    languages: ["English", "Samoan", "Tongan", "Cook Islands Māori"],
    equityAddressed:
      "Addresses persistent achievement gaps for Pacific learners — Samoan, Tongan, Cook Islands Māori, Niuean, Fijian, and other Pacific communities — who collectively underperform against national standards despite full citizenship or residence rights. Equity mechanisms include Tapasā-informed professional development; Pacific bilingual units in Auckland, Wellington, and Christchurch; and scholarships for Pacific students entering teacher education. The plan explicitly recognises Pacific educational underachievement as a product of structural inequalities including income poverty, overcrowded housing, and geographic concentration in under-resourced schools rather than as a cultural deficit.",
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
      "Italy's Piano Nazionale per l'Integrazione defines the national framework for immigrant integration across five strategic areas: reception, housing, education and vocational training, health, and cultural and civic participation. Cross-cutting intercultural competence is positioned as the connecting thread across all five areas, recognising integration as a bidirectional process requiring ITC development both among migrants and within Italian institutions. Education measures include expanding Italian L2 teaching capacity, developing intercultural education materials for all school levels, supporting intercultural mediation services, and implementing civic orientation programmes for newly arrived migrants in coordination across national, regional, and municipal governments.",
    implementationStatus: "evaluation",
    relevanceToINTRACOMP:
      "Establishes ITC as a cross-cutting national priority in Italy's integration architecture, situating intercultural education within a comprehensive national strategy and showing how ITC is integrated across sectoral policy domains in a major Mediterranean migration-receiving country.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-interno.gov.it/piano-integrazione-2017",
    impactInfluence: "binding",
    connections: ["STK-IT-001", "STK-IT-003", "INS-IT-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Under review for a 2025 update following significant changes in Italian migration patterns: increased Central Mediterranean arrivals from sub-Saharan Africa, secondary movements of Afghan and Syrian refugees from other EU countries, and significant Ukrainian populations following the 2022 Russian invasion. The review is contested in the current Italian political context, where restrictive migration policy priorities are in tension with the integration-facilitative premises of the 2017 plan. EU funding through AMIF and ESF+ partially conditions implementation, providing an external accountability mechanism for intercultural education measures.",
    languages: ["Italian"],
    equityAddressed:
      "Addresses integration barriers across multiple dimensions: language access barriers impeding civic participation; labour market discrimination preventing economic integration; housing segregation concentrating immigrant communities in disadvantaged urban zones; and cultural marginalisation from Italian civic life. Special provisions target unaccompanied minors in the Italian care system, women who have experienced trafficking or domestic violence, and migrants with limited formal education requiring accelerated L2 programmes adapted to non-literate or low-literacy adults. The plan recognises equitable integration requires developing ITC within Italian institutions themselves, not only changing migrants' competences.",
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
      "These guidelines provide Italian schools with comprehensive operational guidance on welcoming newly enrolled foreign-born students, assessing their educational backgrounds, planning appropriate linguistic and academic support, and developing ITC-informed classroom environments. Specific guidance covers assessment procedures that avoid penalising students for language rather than cognitive limitations; deployment of intercultural mediators (mediatori culturali) bridging schools and migrant families; strategies for heritage language maintenance alongside Italian L2 development; and approaches to integrating the cultural knowledge foreign-born pupils bring as learning resources rather than obstacles. The guidelines apply to all Italian state schools as mandatory reference points for educational planning.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Core policy reference for ITC implementation in Italian schools, widely cited in European comparative analyses — providing a Southern European country reference point for operationalising intercultural education within a mandatory national framework.",
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
      "First issued 2006, substantively updated 2014; revision expected post-2024 policy reform, particularly to address new patterns of Mediterranean arrivals including unaccompanied Nigerian and West African minors. The guidelines have been widely referenced in European comparative education policy studies as an example of how a Southern European country with limited prior experience of mass immigration developed a comprehensive educational integration framework. Implementation quality varies significantly: northern regions (Lombardy, Veneto, Emilia-Romagna) typically show stronger ITC infrastructure than southern regions with more recent and irregular migration patterns.",
    languages: ["Italian"],
    equityAddressed:
      "Mandates intercultural mediation services as a right for newly arrived families with insufficient Italian for full school participation, with particular provisions for Arabic, Chinese, Romanian, Albanian, and Urdu-speaking communities. Mother-tongue support is endorsed as an educational right, recognising the cognitive and identity value of maintaining heritage languages alongside Italian acquisition. Provisions for Roma pupils include recommended approaches to building trust with Roma families who have historically experienced hostility from Italian educational institutions, acknowledging the distinct cultural and social situation of this community within a dedicated section.",
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
      "The Tavola della Pace (Table of Peace) network coordinates civil society-led peace and intercultural education activities across Italian schools and communities through a national network of associations, schools, and local authorities. Its intercultural education initiative develops curriculum resources integrating peace education, global citizenship, and intercultural learning across all school levels. Annual events including the Perugia-Assisi Peace March — Italy's largest peace gathering with over 10,000 school participants — and the Schools for Peace project create shared educational experiences across Italian communities. Resources draw on Italian civil society traditions of pacifism, international development solidarity, and multicultural association rooted in the postwar democratic culture.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Represents civil society-led ITC programming that complements formal Italian education policy, demonstrating how NGO networks operationalise intercultural education through values-based approaches that government guidelines alone cannot achieve in a diverse, politically contested context.",
    thematicFocus: ["Inter- and Transculturality", "Culture", "Education"],
    geographicalScope: ["national"],
    link: "https://example-tavoladellapace.it/intercultural-education",
    impactInfluence: "symbolic",
    connections: ["STK-IT-003", "INS-IT-002"],
    recommendedNextSteps: "contact",
    additionalRemarks:
      "Annual national peace march engages 10,000+ participants and is a significant public occasion for intercultural encounter between students from different regional, cultural, and socioeconomic backgrounds. The Schools for Peace project has developed curriculum packages used in over 500 schools nationwide. Tavola della Pace participates in European peace and global education networks and contributes to Italian civil society advocacy on development cooperation and refugee rights. The initiative's voluntary and associative character makes it resilient to political changes in Italian government that have at times restricted NGO engagement in formal education settings.",
    languages: ["Italian"],
    equityAddressed:
      "Focuses on youth from marginalised communities — inner-city neighbourhood associations in Rome, Naples, and Palermo with high immigrant and minority populations — in developing global citizenship and intercultural awareness through participatory cultural activities. Work explicitly connects local experiences of marginalisation (poverty, racism, inadequate housing) to global systems of inequality, building ITC as part of a critical consciousness tradition rooted in Italian social movements. Collaboration with associations representing Moroccan, Senegalese, Chinese, and Filipino communities ensures ITC programming reflects community members' perspectives rather than only majority-society educators' interpretations.",
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
      "Greece's National Action Plan for Integration establishes a multi-year strategic framework for the social, cultural, and economic integration of third-country nationals holding protection status or long-term residence permits. The plan identifies five integration pillars: language learning and civic orientation; education and vocational training; employment and self-employment; housing and social services access; and cultural participation and intercultural dialogue. Targets and indicators are defined for each pillar across responsible ministries. Intercultural competence is explicitly positioned as a bidirectional necessity — not only migrants adapting to Greek society but Greek institutions developing culturally sensitive service capacity.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Places ITC at the centre of Greece's legal integration architecture, particularly relevant given Greece's position as a major EU entry point — providing INTRACOMP with a Southern European frontline perspective on ITC in one of Europe's highest-pressure migration contexts.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-migration.gov.gr/action-plan-integration",
    impactInfluence: "binding",
    connections: ["STK-GR-001", "STK-GR-003", "INS-GR-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Co-funded by the EU Asylum, Migration and Integration Fund (AMIF), which introduces EU-level accountability for implementation quality and non-discrimination compliance. Greece's context is complicated by being Europe's primary asylum seeker entry point, creating tensions between emergency reception and longer-term integration programming. Recent EU criticism of Greek border management practices creates a difficult political context for intercultural integration programming within an overall policy environment characterised by restriction. Civil society organisations play a crucial implementation role given state capacity limitations in the integration sector.",
    languages: ["Greek", "English"],
    equityAddressed:
      "Addresses integration barriers for asylum seekers with temporary protection, recognised refugees, and long-term migrants, all facing significant legal, language, and social barriers to civic participation. Special provisions target: unaccompanied minors in Greek state care; women who have experienced gender-based violence including trafficking; and migrants with serious health conditions requiring cross-cultural healthcare. The plan acknowledges particular vulnerability of sub-Saharan African migrants facing racial discrimination alongside immigration status challenges. AMIF co-funding requires attention to non-discrimination and gender equality as cross-cutting principles across all integration measures.",
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
      "The DYEPTH Directorate (Διαπολιτισμική Εκπαίδευση) operates Greece's network of 28 state intercultural schools providing differentiated multilingual education for pupils from diverse cultural backgrounds. Programme objectives include: Greek-language instruction that recognises pupils' diverse linguistic backgrounds; pedagogical approaches adapted to culturally diverse learning styles and prior educational experiences; teacher training in ITC and multilingual pedagogy; school environments affirming all pupils' cultural identities; and educational outcomes comparable to mainstream Greek schools despite significant learning challenges. Schools receive dedicated per-pupil funding premiums, smaller class sizes, and specialist teacher training allocations unavailable to mainstream schools.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Greece's intercultural schools network is considered a European model for institutionalised ITC practice in high-migration contexts, offering INTRACOMP a case study of a state-operated specialised intercultural education system serving the most educationally vulnerable populations.",
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
      "Eligible for higher staffing ratios (one teacher per 15 pupils vs. 25 in mainstream schools), specialised teacher training through the DIPODE post-graduate ITC programme, and dedicated curriculum guidance from the DYEPTH Directorate. Cited in Council of Europe and European Commission reports as an innovative Greek contribution to European intercultural education policy. Ongoing debates about whether the dedicated school model facilitates or hinders long-term integration — a significant ITC question — are shaping discussions about the network's future direction within Ministry of Education planning processes for the post-2025 period.",
    languages: ["Greek", "English", "Albanian", "Arabic"],
    equityAddressed:
      "Specifically serves Greece's most educationally vulnerable populations: recently arrived refugee and migrant children with significant educational interruption; pupils from Albanian, Pakistani, Chinese, and sub-Saharan African communities with limited Greek language proficiency; Roma pupils for whom mainstream school integration has historically been unsuccessful; and repatriated Pontian Greek pupils from former Soviet republics facing language and cultural re-adaptation challenges. The dedicated school model provides a supportive transitional environment, though it has been critiqued for potentially segregating minority pupils rather than building ITC through diverse mainstream school communities.",
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
      "The Nationaler Aktionsplan Integration provides Germany's comprehensive federal roadmap for immigrant integration, developed through the National Integration Summit (Integrationsgipfel) with civil society, migrant organisations, Länder governments, and federal ministries. Core strategic areas include: German language acquisition and recognition of foreign qualifications; employment integration and anti-discrimination in labour markets; educational integration from early childhood through higher education; intercultural opening of public institutions (interkulturelle Öffnung); and civic participation for people with migration backgrounds. Intercultural competence is positioned as a cross-cutting capacity required of both migrants navigating German institutions and German public servants working in diverse professional contexts.",
    implementationStatus: "evaluation",
    relevanceToINTRACOMP:
      "Sets the federal policy environment for ITC in German integration policy and public institutions, situating intercultural education within Germany's Integrationspolitik framework and enabling comparative analysis with other European national integration strategies.",
    thematicFocus: ["Inter- and Transculturality", "Migration", "Education"],
    geographicalScope: ["national"],
    link: "https://example-bundesregierung.de/nap-integration",
    impactInfluence: "binding",
    connections: ["STK-DE-001", "STK-DE-003", "INS-DE-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Developed with extensive civil society participation through the National Integration Summit (Integrationsgipfel), bringing together Federal Government, Länder, municipalities, and migrant organisations. Implementation responsibility is distributed across federal ministries, with the Federal Commissioner for Migration, Refugees and Integration coordinating cross-departmental action. The NAP-I has been critiqued by civil society for insufficiently addressing structural racism and focusing excessively on migrants' adaptation obligations rather than societal openness and anti-discrimination. Successor planning is taking place in a changed political environment following 2023–2024 federal coalition developments.",
    languages: ["German", "English"],
    equityAddressed:
      "Addresses structural barriers to civic participation and employment for immigrants and people with Migrationshintergrund (migration background), including credential non-recognition for foreign qualifications, systematic disadvantages in educational tracking concentrating immigrant-background students in lower school tracks, language-based exclusion from civic information, and institutional discrimination in public services and private employment. Special attention to recently arrived humanitarian migrants from Syria, Afghanistan, and Eritrea recognises that their educational needs differ from earlier labour-migration waves. Gender-specific measures address barriers facing migrant women in accessing language courses, employment, and civic participation.",
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
      "Demokratie leben! (Living Democracy!) is Germany's largest federal programme supporting democratic culture, intercultural dialogue, and extremism prevention at local level, with an annual budget of approximately 150 million euros from BMFSFJ. It funds three partnership types: local action plans in municipalities for democratic culture and diversity; model projects testing innovative approaches to intercultural dialogue, anti-discrimination, and democratic civic education; and competence centres providing specialist expertise on themes including antisemitism, anti-Muslim racism, right-wing extremism, and migrant community empowerment. Intercultural competence is embedded as a core component of democratic culture in the programme's theoretical and operational framework.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Largest federal programme supporting ITC at community level in Germany, funding direct intercultural dialogue and competence development projects across all 16 Bundesländer — providing INTRACOMP with insights into how ITC is operationalised through civil society and municipal actors in Germany's federal system.",
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
      "Funds over 900 local democracy projects annually across all 16 Bundesländer, making it a significant distributed system for grassroots ITC. The programme has been politically controversial, with right-wing parties challenging its funding of anti-racism and gender-equality projects. Academic evaluation, conducted by a consortium of German universities, provides evidence on what approaches to local ITC and democratic culture programming are most effective, directly informing INTRACOMP research on effective ITC interventions. International interest has come from Austria, Switzerland, and the Netherlands, which have developed comparable programmes.",
    languages: ["German", "English", "Turkish"],
    equityAddressed:
      "Specifically targets communities at risk of right-wing extremism and those who are targets of racialised discrimination, funding anti-racist intercultural projects across both categories. Competence centres explicitly addressing antigypsyism (anti-Roma racism), anti-Black racism, and anti-Asian racism fund projects that build ITC while directly addressing equity needs of targeted communities. Projects working with Muslim communities, Jewish communities, and Roma and Sinti communities receive specialised competence centre support. Inclusion of post-migration society perspectives in programme design — moving beyond a 'majority addresses minority' model — reflects advances in German ITC thinking toward genuinely bidirectional intercultural engagement.",
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
      "Serbia's Strategy for Social Inclusion of Roma 2022–2030 establishes the national framework for closing persistent gaps between Roma and non-Roma citizens across five priority areas: education, employment, housing, healthcare, and social protection. Education objectives include achieving school enrolment rates for Roma children equivalent to the national average by 2030; reducing grade repetition and dropout rates in Roma pupil cohorts; eliminating inappropriate placement of Roma children in special schools for children with developmental difficulties; expanding pre-school attendance among Roma families; and increasing Roma students completing secondary education and entering higher education. Pedagoški asistenti (education assistants) deployed in schools with significant Roma enrolments are a primary implementation mechanism.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Addresses the most acute ITC and inclusion challenge in the Serbian education system, providing INTRACOMP with a case study of how a comprehensive national strategy attempts to close gaps between dominant curriculum assumptions and the realities of Europe's most marginalised school community.",
    thematicFocus: ["Inter- and Transculturality", "Education", "Culture"],
    geographicalScope: ["national"],
    link: "https://example-inkluzija.gov.rs/roma-strategy-2030",
    impactInfluence: "binding",
    connections: ["STK-RS-001", "STK-RS-003", "INS-RS-002"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Aligned with the EU Roma Strategic Framework 2020–2030 as part of Serbia's accession commitments, making Roma inclusion a monitored conditionality in EU accession Chapter 23 (Judiciary and Fundamental Rights). Implementation is overseen by the Coordination Body for the Roma Inclusion Decade and the Office for Human and Minority Rights, with annual reporting to the Serbian government and EU accession monitoring bodies. The Roma Education Fund, UNICEF, and OSCE Mission to Serbia are key civil society and international partners. Persistent challenges include resistance from some non-Roma communities to school desegregation and difficulty reaching Roma families in informal settlements excluded from regular municipal services.",
    languages: ["Serbian", "Romani", "English"],
    equityAddressed:
      "Exclusively focused on Roma social inclusion, acknowledging that Roma citizens in Serbia face compound, systemic disadvantage rooted in centuries of exclusion, discrimination, and forced assimilation. Educational equity measures specifically address: the legacy of misdiagnosis of Roma children with learning difficulties leading to inappropriate special school placement; poverty-related barriers to school attendance including lack of materials, uniforms, and meals; absence of Roma cultural content from the national curriculum; and lack of pedagogical competence among non-Roma teachers in Roma cultural communication. The strategy explicitly targets Roma women and girls, who face additional barriers including early marriage and gender-specific exclusion from educational and employment opportunities.",
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
      "Serbia's Law on the Fundamentals of the Education System establishes the legal framework governing all levels of education from pre-primary through secondary, including rights of national minorities to mother-tongue instruction, the legal basis for intercultural education programmes, school governance structures, teacher qualification requirements, and quality assurance mechanisms. Minority education rights are operationalised through National Minority Councils' authority to propose mother-tongue textbooks, nominate teachers for minority-language instruction, and participate in school governance. The law mandates intercultural dialogue as a principle governing all educational institutions, applying the ITC obligation beyond schools serving only minority communities.",
    implementationStatus: "implementation",
    relevanceToINTRACOMP:
      "Provides the foundational legal mandate for ITC and minority education rights in Serbian schools within a constitutional framework guaranteeing collective minority cultural rights — a comparative example of how legal frameworks shape ITC implementation in a multi-ethnic post-socialist state under EU accession pressure.",
    thematicFocus: ["Inter- and Transcultural Competences", "Education"],
    geographicalScope: ["national"],
    link: "https://example-slglasnik.rs/zakon-obrazovanje",
    impactInfluence: "binding",
    connections: ["STK-RS-001", "STK-RS-002", "INS-RS-001"],
    recommendedNextSteps: "monitor",
    additionalRemarks:
      "Last substantively amended in 2021; further amendments expected under EU accession Chapter 26 negotiations on education and culture. The law has been praised by international monitors including OSCE HCNM for comprehensive minority language education provisions and critiqued for insufficient implementation mechanisms, particularly regarding Roma language instruction and anti-discrimination enforcement. Serbian legislation in this area is monitored under the Council of Europe's European Charter for Regional or Minority Languages (ECRML), to which Serbia is a signatory. Compatibility with EU acquis is under review within Chapter 26 screening, with particular attention to recognition of qualifications.",
    languages: ["Serbian", "Hungarian", "Slovak", "Romanian"],
    equityAddressed:
      "Guarantees mother-tongue instruction as a legal right for all recognised national minorities in Serbia — Hungarian, Slovak, Romanian, Rusyn, Croatian, Albanian, Bulgarian, and Ukrainian communities — where sufficient pupil numbers warrant it. Roma-language instruction is legally provided for but practically limited by the lack of standardised Romani orthography and insufficient trained teachers, making Roma the community for whom the legal equity guarantee is most weakly implemented in practice. Anti-discrimination provisions prohibit exclusion on grounds of ethnicity, language, religion, or disability, providing the legal basis for challenging Roma school segregation and other discriminatory institutional practices.",
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
      "The Intercultural Dialogue in Education Initiative, led by the Belgrade Centre for Human Rights in cooperation with the Serbian Ministry of Education, develops, pilots, and evaluates an intercultural dialogue curriculum for Serbian secondary schools in a context characterised by ethnic and religious diversity, post-conflict historical legacies, and EU accession reform pressures. Curriculum content addresses the history and contemporary reality of diversity in Serbia; competences for respectful dialogue across cultural and ethnic boundaries; historical perspectives on intercultural cooperation and conflict in Serbian and Yugoslav history; and critical media literacy on how diversity is represented in Serbian public discourse. The pilot phase involves structured evaluation in 12 secondary schools in Belgrade, Novi Sad, and Niš.",
    implementationStatus: "development",
    relevanceToINTRACOMP:
      "Piloting ITC in Serbian schools within a post-conflict context provides INTRACOMP with evidence on how ITC programmes are received and implemented in societies where intercultural tensions remain politically active — a dimension of ITC development absent from the Nordic and Western European partner contexts.",
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
      "Piloted in 12 secondary schools in Belgrade, Novi Sad, and Niš with teacher training and structured evaluation, positioning it for potential national scaling if results are positive. International support has been provided through the EU's Civil Society Facility for the Western Balkans and the Council of Europe's Action Plan for Serbia. The initiative's participatory approach to curriculum development — involving students and teachers from diverse ethnic backgrounds in content review — constitutes an ITC practice in itself: the co-creation process is as significant as the resulting curriculum resource for building genuine intercultural competence among participants.",
    languages: ["Serbian", "English"],
    equityAddressed:
      "Curriculum explicitly addresses ethnic reconciliation and cross-community contact between Serbian, Albanian, Roma, and other youth communities, recognising that genuine ITC in the Serbian context cannot be separated from unresolved political and historical legacies. Content on Roma history and the Holocaust (Porajmos) as it affected Serbian Roma communities addresses historical injustice rarely acknowledged in Serbian mainstream educational settings. Modules on Albanian communities in Preševo Valley and on Bosniak communities in Sandžak provide bases for discussion across current political divisions in ways that foster understanding without requiring agreed political positions on contested sovereignty questions.",
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
