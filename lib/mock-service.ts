import {
  CityWeatherData,
  EditorialStory,
  NewsTopicId,
  NEWS_TOPIC_LABELS,
  NEWS_TOPIC_ORDER,
} from "./types";

// Neutral source labels per G7: "BetaDigest Desk", "Wire"
// Minimum 3 stories per topic for all 12 news topics (36 stories total)
export const FIXTURE_STORIES_BY_TOPIC: Record<NewsTopicId, Omit<EditorialStory, "topic" | "topicLabel">[]> = {
  politics: [
    {
      id: "pol-1",
      headline: "National legislative committee advances bipartisan transparency framework for executive agencies.",
      summary: "The legislative panel approved updated open-records guidelines aimed at accelerating public document disclosure and standardizing automated cataloging across all executive branch bureaus.\\n\\nUnder the newly adopted protocol, civil agencies must digitize and index public record requests within five business days, utilizing open data formats and cryptographic audit logs. Agency leaders noted that early testing across pilot departments reduced typical document retrieval backlogs by over forty percent while strengthening inter-agency transparency standards.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "pol-2",
      headline: "Municipal governance coalition establishes digital petition guidelines for regional councils.",
      summary: "Local government representatives from forty municipalities agreed on uniform verification standards for community-led ballot and advisory initiatives across suburban districts.\\n\\nCitizens will now be able to authenticate civic submissions through verified regional portals, eliminating manual signature verification delays. Civic oversight organizations praised the initiative, pointing to successful regional pilots where public petition processing times dropped from months to less than two weeks.",
      source: "Wire",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "pol-3",
      headline: "Civil service modernization initiative begins phased rollout for administrative departments.",
      summary: "Federal personnel offices introduced streamlined procurement and talent onboarding protocols to cut operational lag times and modernize legacy public sector workflows.\\n\\nDepartment directors confirmed that the updated digital infrastructure automates cross-departmental clearances and simplifies vendor contract reviews. Officials anticipate the overhaul will save millions in recurring administrative overhead while expediting essential civic project approvals.",
      source: "BetaDigest Desk",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  economy: [
    {
      id: "econ-1",
      headline: "Central banking authorities maintain baseline interest targets amid stable wholesale pricing indicators.",
      summary: "Monetary policy committees cited steady consumer demand, balanced employment metrics, and subdued core producer inflation in their quarterly macroeconomic statement.\\n\\nFinancial markets responded favorably as central bank governors emphasized a data-dependent path focused on long-term price stability. Analysts project baseline lending conditions will remain steady through the upcoming fiscal quarters, supporting predictable capital planning for industrial and infrastructure investments.",
      source: "BetaDigest Desk",
      timestamp: "1h ago",
      url: "#",
    },
    {
      id: "econ-2",
      headline: "Cross-border trade volumes register quarterly expansion led by regional industrial manufacturing.",
      summary: "Export clearing authorities reported an uptick in specialized equipment shipments and consumer electronics components moving through continental customs hubs.\\n\\nLogistics networks reported smoother container turnover and lower demurrage fees following the implementation of pre-cleared electronic manifests. Economists noted that resilient supply chain corridors have helped buffer manufacturing sectors against localized raw material price fluctuations.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "econ-3",
      headline: "Commercial credit markets report stable delinquency rates across mid-sized business portfolios.",
      summary: "Institutional lending benchmarks showed steady debt servicing and resilient working capital reserves through the fiscal period, surpassing conservative forecast models.\\n\\nCommercial lenders reported that diversified supplier contracts and conservative cash management enabled mid-tier enterprises to navigate shifting operating margins. Credit rating agencies noted that corporate default probabilities across core manufacturing and logistics categories remain near five-year lows.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  health: [
    {
      id: "health-1",
      headline: "Public health agencies update seasonal respiratory advisory following clinic surveillance data.",
      summary: "Epidemiological teams observed manageable transmission rates alongside widespread availability of updated preventative vaccines and community diagnostics.\\n\\nHealthcare networks reported steady clinical capacity and mild symptomatic presentations across monitored outpatient clusters. Health directors urged continued adherence to sensible preventive measures, particularly for older adults and vulnerable community members.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "health-2",
      headline: "Clinical research network releases long-term nutritional study tracking metabolic health outcomes.",
      summary: "A ten-year observational dataset encompassing more than twenty thousand participants links consistent whole-food dietary patterns with significantly reduced cardiovascular inflammation markers.\\n\\nResearchers observed marked improvements in insulin sensitivity and endothelial function among cohorts adhering to plant-forward Mediterranean nutritional habits. Public health faculties plan to incorporate the empirical findings into forthcoming regional preventative dietary guidelines.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "health-3",
      headline: "Regional hospitals expand automated triage diagnostics in ambulatory emergency wings.",
      summary: "Medical center administrators reported a twenty percent reduction in non-critical emergency room wait times following telemetry and automated intake integration.\\n\\nThe system cross-references real-time vital metrics with clinician triage protocols, enabling urgent care staff to prioritize high-acuity interventions without administrative delays. Hospital staff noted significant improvements in patient satisfaction and post-treatment clinical recovery metrics.",
      source: "Wire",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  environment: [
    {
      id: "env-1",
      headline: "Coastal conservation alliance completes wetland restoration milestone to mitigate storm surges.",
      summary: "Civil engineers and marine biologists finalized protective salt marsh barriers covering sixty kilometers of vulnerable shoreline along coastal lowlands.\\n\\nThe revitalized tidal zones dissipate tidal wave energy and filter watershed runoff before it reaches regional commercial fisheries. Local municipal leaders highlighted that natural vegetative defenses deliver superior long-term flood resilience at a fraction of the upkeep required for traditional concrete sea walls.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "env-2",
      headline: "Renewable energy cooperatives achieve record distribution efficiency on regional municipal grids.",
      summary: "Combined solar installations and utility-scale battery storage facilities supplied sixty percent of peak mid-day commercial electrical demand across three counties.\\n\\nGrid operators utilized automated phase-balancing algorithms to minimize transmission resistance across high-voltage distribution lines. The regional cooperative announced plans to reinvest operating surpluses into residential rooftop solar grants for low-income households.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "env-3",
      headline: "Forestry management services deploy acoustic telemetry to track biodiversity recovery.",
      summary: "Wildlife conservationists recorded a significant resurgence in native songbird and pollinator populations across revitalized woodland reserves using distributed acoustic sensor arrays.\\n\\nThe autonomous microphones continuously identify avian vocalizations using open-source bioacoustic models, generating dense ecological health heatmaps. Forestry stewards will use the empirical data to schedule selective thinning and protect vital breeding microclimates.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  crime: [
    {
      id: "crime-1",
      headline: "Judicial task force implements modernized electronic filing across metropolitan court jurisdictions.",
      summary: "Court clerks reported faster case scheduling and improved public access to docket summaries following a coordinated transition to unified digital casework databases.\\n\\nAttorneys and self-represented litigants can now submit pleadings, access evidentiary documents, and track hearing schedules securely from any web browser. Judicial administrators confirmed that average procedural processing times dropped by thirty percent in participating municipal circuits.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "crime-2",
      headline: "Metropolitan public safety council reports decrease in property offenses across transit hubs.",
      summary: "Targeted lighting upgrades, improved sightlines, and community ambassador patrols contributed to a double-digit decline in commercial corridor incidents over the past six months.\\n\\nUrban planning teams collaborated with transit authorities to redesign pedestrian concourses and improve real-time passenger assistance stations. Neighborhood merchant associations noted an immediate rebound in evening foot traffic and local retail patronage.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "crime-3",
      headline: "Cybersecurity task force issues warning regarding distributed fraudulent invoicing campaigns.",
      summary: "Financial intelligence analysts advised small businesses and non-profit organizations to verify vendor payment accounts through verified out-of-band communication channels.\\n\\nThe alert highlights automated spoofing attacks that mimic authentic recurring vendor invoices with altered wire routing instructions. Security specialists recommend enforcing mandatory secondary approvals on all supplier payment detail modifications.",
      source: "Wire",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  international: [
    {
      id: "intl-1",
      headline: "Multilateral customs conference establishes harmonized documentation for maritime freight.",
      summary: "Port directors and trade ministers from twenty maritime nations adopted standardized digital bills of lading to reduce container yard turnaround delays and bureaucratic friction.\\n\\nThe new intermodal standard guarantees mutual recognition of electronic cargo manifests across participating international ocean terminals. Freight logistics operators estimate the streamlined digital processing will eliminate thousands of administrative hours each week while tightening cargo tracking accuracy.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "intl-2",
      headline: "Diplomatic delegations conclude initial round of bilateral river basin conservation talks.",
      summary: "Neighboring regional envoys established seasonal flow monitoring protocols to ensure equitable agricultural irrigation access and riparian habitat preservation.\\n\\nThe joint accord creates a shared scientific advisory committee tasked with managing reservoir discharge rates during prolonged drought spells. Diplomatic observers hailed the technical cooperation as a pragmatic foundation for broader cross-border environmental agreements.",
      source: "Wire",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "intl-3",
      headline: "International aviation council standardizes real-time high-altitude weather data sharing.",
      summary: "Meteorological agencies and commercial airlines agreed on automated turbulence warning streams across trans-oceanic flight corridors, improving flight safety and routing efficiency.\\n\\nUnder the treaty framework, airborne commercial fleets will automatically relay atmospheric sensor observations to ground-based navigation towers. The synchronized telemetry enables flight dispatchers to route around severe convective systems, reducing turbulence injuries and fuel burn.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  education: [
    {
      id: "edu-1",
      headline: "Regional school districts report measurable reading gains following structured phonics curricula.",
      summary: "Early elementary literacy assessments showed steady improvements across foundational comprehension benchmarks over two consecutive academic terms.\\n\\nCurriculum directors credited intensive teacher professional development and explicit decoding exercises for accelerating reading fluency among struggling students. District superintendents announced plans to expand the evidence-based literacy program to kindergarten and middle school classrooms next fall.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "edu-2",
      headline: "University consortium establishes open-access repository for computational research datasets.",
      summary: "Higher education libraries joined forces to guarantee free global access to peer-reviewed datasets, simulation code, and scientific software pipelines.\\n\\nThe shared digital repository provides permanent digital object identifiers and reproducible execution environments for published academic research. Participating universities noted the platform lowers barriers for independent researchers and accelerates multidisciplinary collaboration.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "edu-3",
      headline: "Vocational apprenticeship programs expand partnerships with regional technical manufacturing firms.",
      summary: "State workforce boards announced subsidized apprenticeship placements for precision machining, industrial robotics, and renewable energy technician candidates.\\n\\nThe dual-track educational model pairs accredited classroom instruction with paid on-the-job training at advanced manufacturing facilities. Program graduates achieve ninety-four percent permanent placement rates within sixty days of completing their technical certifications.",
      source: "Wire",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  science: [
    {
      id: "sci-1",
      headline: "Astrophysical observatory detects unusual periodic radio pulses from nearby stellar cluster.",
      summary: "Researchers analyzing telemetry from orbital radio telescope arrays confirmed stable emissions originating from a dense binary star system four hundred light-years away.\\n\\nThe periodic signals recur every twenty-two minutes with extreme spectral consistency, leading astrophysicists to model novel magnetic plasma interactions. Ground-based observatories across three continents have scheduled coordinated follow-up observations to analyze the emission polarization.",
      source: "BetaDigest Desk",
      timestamp: "1h ago",
      url: "#",
    },
    {
      id: "sci-2",
      headline: "Materials laboratory develops resilient biodegradable polymers for electronic packaging.",
      summary: "Chemical engineers synthesized durable cellulose-based casing alternatives that break down safely in industrial compost facilities within ninety days without toxic residue.\\n\\nThe new bioplastic exhibits thermal conductivity and structural rigidity comparable to traditional petroleum-derived plastics. Consumer device manufacturers have begun testing the bio-composite for protective shipping inserts and lightweight internal chassis components.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "sci-3",
      headline: "Geological survey mapping discovers deep geothermal reservoir suitable for clean municipal heating.",
      summary: "Subsurface seismic mapping revealed accessible subterranean thermal gradients capable of heating thousands of residential dwellings across the metropolitan basin.\\n\\nEngineers identified porous basalt layers containing pressurized thermal brine at temperatures exceeding one hundred forty degrees Celsius. Feasibility studies indicate a district geothermal loop could replace legacy fossil fuel boilers, cutting municipal heating emissions by half.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  society: [
    {
      id: "soc-1",
      headline: "National archive initiative completes high-resolution digitization of regional folk history records.",
      summary: "Historians, curators, and community volunteers made thousands of oral histories, historic maps, and vintage photographs freely searchable online.\\n\\nThe open digital collection features transcribed audio recordings spanning nine decades of immigrant journeys, industrial heritage, and community traditions. Archivists implemented interactive educational toolkits to help secondary school teachers integrate primary source artifacts into local history lessons.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "soc-2",
      headline: "Urban planning commission highlights community garden expansion in revitalized neighborhood parks.",
      summary: "Municipal green spaces reported record public participation as resident-managed agricultural plots supported local community food kitchens and youth horticulture clubs.\\n\\nThe city parks department converted formerly vacant municipal lots into pollinator-friendly raised bed gardens equipped with rainwater catchment systems. Community organizers noted that the neighborhood gardens have fostered stronger multigenerational social ties while providing fresh organic produce.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "soc-3",
      headline: "Public library systems register surge in community workshop attendance and tool-lending programs.",
      summary: "Neighborhood library branches expanded evening adult continuing education classes, digital literacy circles, and household repair clinics to meet booming local demand.\\n\\nPatrons checked out over fifteen thousand pieces of technical equipment, woodworking tools, and home energy auditing sensors during the past quarter. Library trustees cited the success as evidence of modern public libraries evolving into vital community resource and collaboration centers.",
      source: "Wire",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  disasters: [
    {
      id: "dis-1",
      headline: "Civil protection bureaus complete annual readiness drills ahead of peak storm season.",
      summary: "Emergency logistics teams tested municipal generator backups, redundant radio communications networks, and evacuation corridor transit lanes during a three-day scenario.\\n\\nFirst responders coordinated with public transit operators to simulate rapid mass transit departures from vulnerable low-lying coastal flood sectors. Disaster response coordinators confirmed that emergency notification systems reached designated community focal points within ninety seconds.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "dis-2",
      headline: "Early warning seismic sensors successfully installed along active geological fault zones.",
      summary: "Geophysicists activated real-time acoustic monitors engineered to transmit rapid alert notifications to municipal transit systems, hospital generators, and utility grids.\\n\\nThe high-precision accelerometer array detects initial primary compression waves seconds before damaging shear waves reach populated valley centers. Automated interlocks will slow municipal rail trains and open elevator doors instantly upon seismic wave detection.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "dis-3",
      headline: "Reservoir management authority implements automated flood control telemetry on major riverways.",
      summary: "Dam operators activated synchronized spillway sensors and river basin telemetry to regulate reservoir levels ahead of anticipated seasonal rainfall events.\\n\\nComputerized predictive models continuously calculate upstream soil saturation and mountain snowpack runoff to determine safe discharge rates. The automated control system prevents downstream river cresting while ensuring maximum water conservation for summer agricultural allocations.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  technology: [
    {
      id: "tech-1",
      headline: "Open-source developer consortium releases high-efficiency runtime for asynchronous data processing.",
      summary: "The framework reduces memory allocation overhead and delivers deterministic latency curves across distributed server clusters running mission-critical background jobs.\\n\\nBenchmarking audits conducted by independent engineering teams showed a thirty-five percent drop in CPU utilization for high-throughput streaming pipelines. Core contributors credited a zero-copy buffer architecture and optimized garbage collection heuristics for the breakthrough performance.",
      source: "BetaDigest Desk",
      timestamp: "1h ago",
      url: "#",
    },
    {
      id: "tech-2",
      headline: "Semiconductor foundries initiate production verification on next-generation low-power microcontrollers.",
      summary: "Hardware engineering benchmarks indicate forty percent greater battery endurance for connected agricultural sensors, industrial meters, and medical telemetry tags.\\n\\nThe microcontrollers integrate hardware-level sleep states that wake in under two microseconds to execute sensor readings before returning to ultra-low standby. Volume shipments to equipment manufacturers are scheduled to commence at the beginning of next quarter.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "tech-3",
      headline: "Web standards organization ratifies enhanced cryptographic standards for browser credentials.",
      summary: "The updated specification deprecates legacy password flows in favor of hardware-backed public key passkey authentication across participating modern browsers.\\n\\nWeb application developers can implement phishing-resistant authentication APIs that store private keys within secure enclave processors on user devices. Major consumer identity providers have already pledged day-one compatibility for the newly ratified authentication standard.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  sports: [
    {
      id: "sports-1",
      headline: "National athletics championship schedule finalized with expanded youth division qualifying rounds.",
      summary: "Track and field federations announced venues and qualification standards for the upcoming summer tournament series across thirty regional sporting districts.\\n\\nOrganizers introduced expanded scholarship divisions and synchronized digital timing sensors to ensure transparent qualifying heats. Coaches praised the revamped tournament structure for widening collegiate scouting opportunities for emerging young athletes.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "sports-2",
      headline: "Continental football confederation introduces biometric referee communication headsets.",
      summary: "Match officiating crews across premier divisions will utilize low-latency encrypted audio gear to accelerate sideline reviews and improve field communication clarity.\\n\\nThe lightweight headsets incorporate noise-canceling bone conduction microphones and integrated heart-rate telemetry to monitor match official physical exertion. Trial matches demonstrated a forty percent reduction in review consultation delays during contentious penalty box rulings.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "sports-3",
      headline: "Community sports alliance opens newly renovated public swimming and gymnastics facilities.",
      summary: "Municipal recreation authorities dedicated refurbished aquatic arenas and track complexes for local scholastic programs, community leagues, and senior wellness clubs.\\n\\nThe renovated center features zero-depth accessible entry ramps, modern water filtration technology, and energy-efficient climate control systems. Neighborhood youth sports leagues have already scheduled their upcoming seasonal tournaments at the state-of-the-art community complex.",
      source: "Wire",
      timestamp: "5h ago",
      url: "#",
    },
  ],
};

// Deterministic string hash helper
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Generate realistic deterministic weather for any city and country
export function generateCityWeather(
  cityName: string = "Seattle",
  countryCode: string = "US"
): CityWeatherData {
  const seed = hashString(cityName.trim().toLowerCase());
  const isUS = countryCode.toUpperCase() === "US" || cityName.toLowerCase() === "seattle";

  // Base temperature in Celsius (10°C to 28°C)
  const baseC = 12 + (seed % 15);
  const conditionList = [
    "clear skies",
    "partly cloudy",
    "fair skies",
    "overcast",
    "scattered clouds",
    "light breeze",
  ];
  const condition = conditionList[seed % conditionList.length];

  // Unit conversions (G6)
  const tempUnit = isUS ? "°F" : "°C";
  const windUnit = isUS ? "mph" : "km/h";

  const currentTemp = isUS ? Math.round((baseC * 9) / 5 + 32) : baseC;
  const feelsLike = currentTemp + ((seed % 5) - 2);
  const high = currentTemp + 5 + (seed % 4);
  const low = currentTemp - 6 - (seed % 4);

  const rainProb = (seed * 7) % 70;
  const thunderstormProb = (seed * 3) % 35;
  const cloudiness = 15 + ((seed * 11) % 65);

  const baseWindSpeed = 5 + (seed % 14); // in mph
  const windSpeed = isUS ? baseWindSpeed : Math.round(baseWindSpeed * 1.60934);
  const directions = ["SW", "NW", "NE", "SE", "W", "E", "N", "S"];
  const windDirection = directions[seed % directions.length];
  const windFormatted = `${windSpeed} ${windUnit} ${windDirection}`;

  const uvIndex = 2 + (seed % 6);
  const uvDescriptions = ["Low", "Moderate", "Moderate", "High", "Very high", "Extreme"];
  const uvDescription = uvDescriptions[Math.min(uvIndex - 1, uvDescriptions.length - 1)] || "Moderate";

  const airQuality = 20 + ((seed * 13) % 55);
  let airQualityDescription = "Good";
  if (airQuality > 50) airQualityDescription = "Moderate";
  if (airQuality > 100) airQualityDescription = "Unhealthy";

  const humidity = 45 + ((seed * 17) % 40);

  const sunriseMin = 30 + (seed % 25);
  const sunsetMin = 10 + (seed % 35);
  const sunrise = `06:${sunriseMin.toString().padStart(2, "0")}`;
  const sunset = `19:${sunsetMin.toString().padStart(2, "0")}`;

  // 4 blocks at 3-hour intervals: 06:00, 09:00, 12:00, 15:00
  const hourly = [
    { time: "06:00", temp: currentTemp - 2, condition: "Clear" },
    { time: "09:00", temp: currentTemp, condition: "Partly Cloudy" },
    { time: "12:00", temp: high, condition: "Sunny" },
    { time: "15:00", temp: high - 1, condition: condition },
  ];

  // 3-day forecast
  const threeDay = [
    { day: "Tomorrow", date: "Fri, Oct 09", high: high + 1, low: low + 1, condition: "Partly Cloudy", rainProb: 20 },
    { day: "Saturday", date: "Sat, Oct 10", high: high + 2, low: low, condition: "Sunny", rainProb: 10 },
    { day: "Sunday", date: "Sun, Oct 11", high: high - 1, low: low - 2, condition: "Overcast", rainProb: 35 },
  ];

  return {
    city: cityName,
    country: isUS ? "United States" : "International",
    isUS,
    tempUnit,
    windUnit,
    currentTemp,
    feelsLike,
    condition,
    high,
    low,
    rainProb,
    thunderstormProb,
    cloudiness,
    windSpeed,
    windDirection,
    windFormatted,
    uvIndex,
    uvDescription,
    airQuality,
    airQualityDescription,
    humidity,
    sunrise,
    sunset,
    hourly,
    threeDay,
  };
}

// Round-robin selection of stories across selected news topics (D4)
// Always yields exactly 5 stories (including when 1 topic is selected)
export function getTop5Stories(selectedTopics: NewsTopicId[]): EditorialStory[] {
  if (!selectedTopics || selectedTopics.length === 0) {
    return [];
  }

  // Filter and order selected topics according to fixed NEWS_TOPIC_ORDER
  const orderedTopics = NEWS_TOPIC_ORDER.filter((t) => selectedTopics.includes(t));
  if (orderedTopics.length === 0) return [];

  const result: EditorialStory[] = [];
  const topicStoryIndex: Partial<Record<NewsTopicId, number>> = {};
  for (const t of orderedTopics) {
    topicStoryIndex[t] = 0;
  }

  let turn = 0;
  while (result.length < 5) {
    const topic = orderedTopics[turn % orderedTopics.length];
    const storiesForTopic = FIXTURE_STORIES_BY_TOPIC[topic] || [];
    if (storiesForTopic.length > 0) {
      const idx = (topicStoryIndex[topic] ?? 0) % storiesForTopic.length;
      const baseStory = storiesForTopic[idx];
      result.push({
        ...baseStory,
        id: `${baseStory.id}-${result.length + 1}`,
        topic,
        topicLabel: NEWS_TOPIC_LABELS[topic],
      });
      topicStoryIndex[topic] = (topicStoryIndex[topic] ?? 0) + 1;
    }
    turn++;
  }

  return result.slice(0, 5);
}

import { fetchCityWeatherDataLive } from "@/services/weather";
import { getTop5StoriesLive } from "@/services/news";

export { fetchCityWeatherDataLive, getTop5StoriesLive };

// Service helper supporting both synchronous baseline and live asynchronous fetches
export const mockService = {
  getWeather(cityName: string = "Seattle", countryCode: string = "US"): CityWeatherData {
    return generateCityWeather(cityName, countryCode);
  },
  getStories(topics: NewsTopicId[]): EditorialStory[] {
    return getTop5Stories(topics);
  },
  async getWeatherLive(cityName: string = "Seattle", countryCode: string = "US"): Promise<CityWeatherData> {
    return fetchCityWeatherDataLive(cityName, countryCode);
  },
  async getStoriesLive(topics: NewsTopicId[]): Promise<EditorialStory[]> {
    return getTop5StoriesLive(topics);
  },
};

