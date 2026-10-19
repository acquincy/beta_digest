import { CityWeatherData, EditorialStory, WeatherTopicId } from "./types";

export const MOCKUP_USER_NAME = "Alex";
export const MOCKUP_CITY = "Seattle";
export const MOCKUP_COUNTRY = "United States";
export const MOCKUP_DATE = "Thursday, October 18";

export const MOCKUP_WEATHER_TOPICS: WeatherTopicId[] = [
  "current-temperature",
  "rain-chance",
  "uv-index",
];

export const MOCKUP_WEATHER: CityWeatherData = {
  city: "Seattle",
  country: "United States",
  isUS: true,
  tempUnit: "°F",
  windUnit: "mph",
  currentTemp: 68,
  feelsLike: 70,
  condition: "Partly Cloudy",
  high: 72,
  low: 54,
  rainProb: 15,
  thunderstormProb: 0,
  cloudiness: 35,
  windSpeed: 8,
  windDirection: "NNW",
  windFormatted: "8 mph NNW",
  uvIndex: 4,
  uvDescription: "Moderate",
  airQuality: 32,
  airQualityDescription: "Good",
  humidity: 58,
  sunrise: "6:42 AM",
  sunset: "7:18 PM",
  hourly: [
    { time: "9 AM", temp: 64, condition: "Partly Cloudy" },
    { time: "12 PM", temp: 70, condition: "Partly Cloudy" },
    { time: "3 PM", temp: 72, condition: "Sunny" },
    { time: "6 PM", temp: 68, condition: "Clear" },
  ],
  threeDay: [
    { day: "Today", date: "Oct 18", high: 72, low: 54, condition: "Partly Cloudy", rainProb: 15 },
    { day: "Fri", date: "Oct 19", high: 74, low: 56, condition: "Sunny", rainProb: 5 },
    { day: "Sat", date: "Oct 20", high: 69, low: 52, condition: "Rain", rainProb: 65 },
  ],
};

export const MOCKUP_STORIES: EditorialStory[] = [
  {
    id: "mockup-1",
    topic: "economy",
    topicLabel: "Economy",
    headline: "Global Central Banks Advance Unified Digital Settlement Standard",
    summary:
      "Major regulatory bodies agree on core interoperability guidelines to accelerate international trade clearance without intermediaries.\n\nInstitutional pilot transfers verified seamless liquidity balancing while eliminating foreign exchange settlement delays across cross-border wholesale corridors.",
    source: "Global Financial Wire",
    timestamp: "28m ago",
    url: "#",
  },
  {
    id: "mockup-2",
    topic: "technology",
    topicLabel: "Technology",
    headline: "Next-Generation Clean Energy Grid Achieves Zero-Loss Transmission",
    summary:
      "Field trials demonstrate ultra-conductive power routing capable of stabilizing regional renewable networks during peak demand.\n\nGrid operators utilized automated phase-balancing algorithms to minimize transmission resistance across high-voltage distribution lines, cutting curtailment waste by over forty percent.",
    source: "Tech Dispatch",
    timestamp: "1h ago",
    url: "#",
  },
  {
    id: "mockup-3",
    topic: "science",
    topicLabel: "Science",
    headline: "Oceanic Telemetry Network Maps Deep-Sea Thermal Currents",
    summary:
      "Autonomous sensors provide first-of-their-kind measurements detailing seasonal ocean heat transfer patterns across the Pacific.\n\nResearchers deploying deep-sea gliders recorded sub-surface convective plumes that directly influence continental weather forecasts and long-term climate modeling.",
    source: "Science Review",
    timestamp: "2h ago",
    url: "#",
  },
  {
    id: "mockup-4",
    topic: "health",
    topicLabel: "Health",
    headline: "Targeted Cellular Therapies Show High Long-Term Efficacy in Clinical Trials",
    summary:
      "Multi-center clinical studies report sustained biomarker recovery and low side-effect profiles across adult patient cohorts.\n\nInvestigators observed marked biomarker clearance within the initial eight weeks of intervention without requiring high-dose systemic immunosuppression.",
    source: "Health Daily",
    timestamp: "3h ago",
    url: "#",
  },
  {
    id: "mockup-5",
    topic: "environment",
    topicLabel: "Environment",
    headline: "Alpine Reforestation Initiative Exceeds Biodiversity Benchmarks",
    summary:
      "Collaborative conservation teams restore 40,000 hectares of high-altitude forest, revitalizing native wildlife migration corridors.\n\nBiologists recorded significant resurgence in native pollinator populations and stabilized mountainside watersheds ahead of spring snowmelt.",
    source: "Earth Chronicle",
    timestamp: "4h ago",
    url: "#",
  },
];
