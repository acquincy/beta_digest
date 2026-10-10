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
      summary: "The legislative panel approved updated open-records guidelines aimed at accelerating public document disclosure and standardizing automated cataloging.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "pol-2",
      headline: "Municipal governance coalition establishes digital petition guidelines for regional councils.",
      summary: "Local government representatives agreed on uniform verification standards for community initiatives across suburban districts.",
      source: "Wire",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "pol-3",
      headline: "Civil service modernization initiative begins phased rollout for administrative departments.",
      summary: "Federal personnel offices introduced streamlined procurement and talent onboarding protocols to cut operational lag times.",
      source: "BetaDigest Desk",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  economy: [
    {
      id: "econ-1",
      headline: "Central banking authorities maintain baseline interest targets amid stable wholesale pricing indicators.",
      summary: "Monetary policy committees cited steady consumer demand and balanced employment metrics in their quarterly macroeconomic statement.",
      source: "BetaDigest Desk",
      timestamp: "1h ago",
      url: "#",
    },
    {
      id: "econ-2",
      headline: "Cross-border trade volumes register quarterly expansion led by regional industrial manufacturing.",
      summary: "Export clearing authorities reported an uptick in specialized equipment shipments and consumer electronics components.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "econ-3",
      headline: "Commercial credit markets report stable delinquency rates across mid-sized business portfolios.",
      summary: "Institutional lending benchmarks showed steady debt servicing and resilient working capital reserves through the fiscal period.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  health: [
    {
      id: "health-1",
      headline: "Public health agencies update seasonal respiratory advisory following clinic surveillance data.",
      summary: "Epidemiological teams observed manageable transmission rates alongside widespread availability of updated preventative vaccines.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "health-2",
      headline: "Clinical research network releases long-term nutritional study tracking metabolic health outcomes.",
      summary: "A ten-year observational dataset links consistent whole-food dietary patterns with reduced cardiovascular inflammation markers.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "health-3",
      headline: "Regional hospitals expand automated triage diagnostics in ambulatory emergency wings.",
      summary: "Medical center administrators reported a twenty percent reduction in non-critical emergency room wait times following telemetry integration.",
      source: "Wire",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  environment: [
    {
      id: "env-1",
      headline: "Coastal conservation alliance completes wetland restoration milestone to mitigate storm surges.",
      summary: "Civil engineers and marine biologists finalized protective salt marsh barriers covering sixty kilometers of vulnerable shoreline.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "env-2",
      headline: "Renewable energy cooperatives achieve record distribution efficiency on regional municipal grids.",
      summary: "Combined solar and battery storage installations supplied sixty percent of peak mid-day commercial electrical demand.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "env-3",
      headline: "Forestry management services deploy acoustic telemetry to track biodiversity recovery.",
      summary: "Wildlife conservationists recorded significant resurgence in native songbird populations across revitalized woodland reserves.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  crime: [
    {
      id: "crime-1",
      headline: "Judicial task force implements modernized electronic filing across metropolitan court jurisdictions.",
      summary: "Court clerks reported faster case scheduling and improved public access to docket summaries following the database transition.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "crime-2",
      headline: "Metropolitan public safety council reports decrease in property offenses across transit hubs.",
      summary: "Targeted lighting upgrades and community ambassador patrols contributed to a double-digit decline in commercial corridor incidents.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "crime-3",
      headline: "Cybersecurity task force issues warning regarding distributed fraudulent invoicing campaigns.",
      summary: "Financial intelligence analysts advised small businesses to verify payment accounts through out-of-band communication channels.",
      source: "Wire",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  international: [
    {
      id: "intl-1",
      headline: "Multilateral customs conference establishes harmonized documentation for maritime freight.",
      summary: "Port directors from twenty maritime nations adopted standardized digital bills of lading to reduce container yard turnaround delays.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "intl-2",
      headline: "Diplomatic delegations conclude initial round of bilateral river basin conservation talks.",
      summary: "Neighboring regional envoys established seasonal flow monitoring protocols to ensure equitable agricultural irrigation access.",
      source: "Wire",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "intl-3",
      headline: "International aviation council standardizes real-time high-altitude weather data sharing.",
      summary: "Meteorological agencies and commercial airlines agreed on automated turbulence warning streams across trans-oceanic flight corridors.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  education: [
    {
      id: "edu-1",
      headline: "Regional school districts report measurable reading gains following structured phonics curricula.",
      summary: "Early elementary literacy assessments showed steady improvements across foundational comprehension benchmarks over two academic terms.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "edu-2",
      headline: "University consortium establishes open-access repository for computational research datasets.",
      summary: "Higher education libraries joined forces to guarantee free global access to peer-reviewed datasets and scientific software pipelines.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "edu-3",
      headline: "Vocational apprenticeship programs expand partnerships with regional technical manufacturing firms.",
      summary: "State workforce boards announced subsidized apprenticeship placements for precision machining and renewable energy technician candidates.",
      source: "Wire",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  science: [
    {
      id: "sci-1",
      headline: "Astrophysical observatory detects unusual periodic radio pulses from nearby stellar cluster.",
      summary: "Researchers analyzing telemetry from orbital antenna arrays confirmed stable emissions originating from a dense binary star system.",
      source: "BetaDigest Desk",
      timestamp: "1h ago",
      url: "#",
    },
    {
      id: "sci-2",
      headline: "Materials laboratory develops resilient biodegradable polymers for electronic packaging.",
      summary: "Chemical engineers synthesized durable cellulose-based casing alternatives that break down safely in industrial compost facilities.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "sci-3",
      headline: "Geological survey mapping discovers deep geothermal reservoir suitable for clean municipal heating.",
      summary: "Subsurface seismic mapping revealed accessible subterranean thermal gradients capable of heating thousands of residential dwellings.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  society: [
    {
      id: "soc-1",
      headline: "National archive initiative completes high-resolution digitization of regional folk history records.",
      summary: "Historians and community volunteers made thousands of oral histories and vintage photographs freely searchable online.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "soc-2",
      headline: "Urban planning commission highlights community garden expansion in revitalized neighborhood parks.",
      summary: "Municipal green spaces reported record public participation as resident-managed plots supported local community food kitchens.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "soc-3",
      headline: "Public library systems register surge in community workshop attendance and tool-lending programs.",
      summary: "Neighborhood branches expanded evening adult continuing education classes, digital literacy circles, and repair clinics.",
      source: "Wire",
      timestamp: "6h ago",
      url: "#",
    },
  ],
  disasters: [
    {
      id: "dis-1",
      headline: "Civil protection bureaus complete annual readiness drills ahead of peak storm season.",
      summary: "Emergency logistics teams tested municipal generator backups, redundant radio networks, and evacuation corridor transit lanes.",
      source: "BetaDigest Desk",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "dis-2",
      headline: "Early warning seismic sensors successfully installed along active geological fault zones.",
      summary: "Geophysicists activated real-time acoustic monitors engineered to transmit rapid alert notifications to municipal transit systems.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "dis-3",
      headline: "Reservoir management authority implements automated flood control telemetry on major riverways.",
      summary: "Dam operators activated synchronized spillway sensors to regulate reservoir levels before anticipated seasonal rainfall events.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  technology: [
    {
      id: "tech-1",
      headline: "Open-source developer consortium releases high-efficiency runtime for asynchronous data processing.",
      summary: "The framework reduces memory allocation overhead and delivers deterministic latency curves across distributed server clusters.",
      source: "BetaDigest Desk",
      timestamp: "1h ago",
      url: "#",
    },
    {
      id: "tech-2",
      headline: "Semiconductor foundries initiate production verification on next-generation low-power microcontrollers.",
      summary: "Hardware engineering benchmarks indicate forty percent greater battery endurance for connected agricultural sensors.",
      source: "Wire",
      timestamp: "3h ago",
      url: "#",
    },
    {
      id: "tech-3",
      headline: "Web standards organization ratifies enhanced cryptographic standards for browser credentials.",
      summary: "The updated specification deprecates legacy password flows in favor of hardware-backed public key passkey authentication.",
      source: "BetaDigest Desk",
      timestamp: "5h ago",
      url: "#",
    },
  ],
  sports: [
    {
      id: "sports-1",
      headline: "National athletics championship schedule finalized with expanded youth division qualifying rounds.",
      summary: "Track and field federations announced venues and qualification standards for the upcoming summer tournament series.",
      source: "Wire",
      timestamp: "2h ago",
      url: "#",
    },
    {
      id: "sports-2",
      headline: "Continental football confederation introduces biometric referee communication headsets.",
      summary: "Match officiating crews across premier divisions will utilize low-latency encrypted audio gear to accelerate sideline reviews.",
      source: "BetaDigest Desk",
      timestamp: "4h ago",
      url: "#",
    },
    {
      id: "sports-3",
      headline: "Community sports alliance opens newly renovated public swimming and gymnastics facilities.",
      summary: "Municipal recreation authorities dedicated refurbished aquatic arenas and track complexes for local scholastic programs.",
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

