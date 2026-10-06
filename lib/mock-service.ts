import { CityData, EditorialStory, MetricKey, UserPreferences, DigestPayload } from "./types";
import { deriveDigestText } from "./digest-derivation";
import { formatCurrentTimeInZone } from "./time-utils";

export const MOCK_STORIES: EditorialStory[] = [
  {
    id: "story-1",
    headline: "Global central banks outline unified liquidity safeguards for digital settlement rails.",
    summary:
      "A multilateral framework sets stricter capital adequacy floors for cross-border automated clearing houses, aimed at mitigating overnight counterparty friction.",
    source: "Financial Times",
    timestamp: "05:14",
    category: "markets",
    url: "https://www.ft.com",
  },
  {
    id: "story-2",
    headline: "Regional transit authority deploys automated dispatch grid across primary commute lines.",
    summary:
      "Telemetry upgrades across rail switches and municipal bus routes reduce peak morning transfer delays by an average of six minutes.",
    source: "Reuters",
    timestamp: "05:32",
    category: "transit",
    url: "https://www.reuters.com",
  },
  {
    id: "story-3",
    headline: "Offshore wind installations surpass seasonal generation benchmark ahead of schedule.",
    summary:
      "Grid operators report high-efficiency turbine clusters produced eighteen percent above projected autumn output during sustained coastal pressure fronts.",
    source: "Bloomberg",
    timestamp: "05:45",
    category: "infrastructure",
    url: "https://www.bloomberg.com",
  },
  {
    id: "story-4",
    headline: "Municipal reservoir system completes sensor retrofit for autumn catchment cycles.",
    summary:
      "Automated acoustic monitors along primary aqueducts enable proactive valve throttling ahead of heavy Pacific weather systems.",
    source: "Associated Press",
    timestamp: "05:58",
    category: "infrastructure",
    url: "https://apnews.com",
  },
  {
    id: "story-5",
    headline: "Intermodal freight corridor standardizes real-time freight tracking across regional terminals.",
    summary:
      "Logistics operators harmonize container manifest protocols to curb interchange wait times at major inland rail heads.",
    source: "The Wall Street Journal",
    timestamp: "06:05",
    category: "policy",
    url: "https://www.wsj.com",
  },
];

export const MOCK_CITIES: Record<string, CityData> = {
  Seattle: {
    city: "Seattle",
    country: "United States",
    timezone: "America/Los_Angeles",
    currentTemp: 52,
    condition: "partly cloudy",
    high: 58,
    low: 45,
    rainProb: 30,
    rainPeriod: "this afternoon",
    wind: "8 mph SW",
    uvIndex: 3,
    uvDescription: "Moderate",
    airQuality: 28,
    airQualityDescription: "Good",
    humidity: 65,
    sunrise: "06:42",
    sunset: "19:15",
    hourly: [
      { time: "06:00", temp: 50, condition: "Clear", rainProb: 10, windSpeed: 6 },
      { time: "07:00", temp: 51, condition: "Partly Cloudy", rainProb: 15, windSpeed: 7 },
      { time: "08:00", temp: 52, condition: "Partly Cloudy", rainProb: 20, windSpeed: 8 },
      { time: "09:00", temp: 54, condition: "Cloudy", rainProb: 25, windSpeed: 9 },
      { time: "10:00", temp: 55, condition: "Scattered Rain", rainProb: 35, windSpeed: 10 },
      { time: "11:00", temp: 57, condition: "Light Rain", rainProb: 40, windSpeed: 11 },
      { time: "12:00", temp: 58, condition: "Partly Cloudy", rainProb: 30, windSpeed: 8 },
      { time: "13:00", temp: 57, condition: "Partly Cloudy", rainProb: 20, windSpeed: 7 },
    ],
    threeDay: [
      { day: "Tomorrow", date: "Tue, Oct 06", high: 55, low: 44, condition: "Sunny", rainProb: 10 },
      { day: "Wednesday", date: "Wed, Oct 07", high: 48, low: 42, condition: "Rain Likely", rainProb: 75 },
      { day: "Thursday", date: "Thu, Oct 08", high: 52, low: 43, condition: "Overcast", rainProb: 20 },
    ],
  },
  London: {
    city: "London",
    country: "United Kingdom",
    timezone: "Europe/London",
    currentTemp: 14,
    condition: "light drizzle",
    high: 17,
    low: 11,
    rainProb: 60,
    rainPeriod: "before noon",
    wind: "12 mph NE",
    uvIndex: 2,
    uvDescription: "Low",
    airQuality: 22,
    airQualityDescription: "Good",
    humidity: 78,
    sunrise: "07:08",
    sunset: "18:29",
    hourly: [
      { time: "06:00", temp: 12, condition: "Overcast", rainProb: 40, windSpeed: 10 },
      { time: "07:00", temp: 13, condition: "Light Drizzle", rainProb: 60, windSpeed: 11 },
      { time: "08:00", temp: 14, condition: "Light Drizzle", rainProb: 65, windSpeed: 12 },
      { time: "09:00", temp: 15, condition: "Cloudy", rainProb: 50, windSpeed: 12 },
      { time: "10:00", temp: 16, condition: "Partly Cloudy", rainProb: 30, windSpeed: 10 },
      { time: "11:00", temp: 17, condition: "Clear", rainProb: 15, windSpeed: 9 },
      { time: "12:00", temp: 17, condition: "Clear", rainProb: 10, windSpeed: 8 },
      { time: "13:00", temp: 16, condition: "Cloudy", rainProb: 20, windSpeed: 9 },
    ],
    threeDay: [
      { day: "Tomorrow", date: "Tue, Oct 06", high: 16, low: 10, condition: "Breezy", rainProb: 25 },
      { day: "Wednesday", date: "Wed, Oct 07", high: 18, low: 12, condition: "Clear", rainProb: 10 },
      { day: "Thursday", date: "Thu, Oct 08", high: 15, low: 9, condition: "Showers", rainProb: 55 },
    ],
  },
  Lagos: {
    city: "Lagos",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    currentTemp: 27,
    condition: "humid haze",
    high: 31,
    low: 24,
    rainProb: 20,
    rainPeriod: "isolated evening showers",
    wind: "7 mph SW",
    uvIndex: 8,
    uvDescription: "Very High",
    airQuality: 64,
    airQualityDescription: "Moderate",
    humidity: 82,
    sunrise: "06:28",
    sunset: "18:34",
    hourly: [
      { time: "06:00", temp: 25, condition: "Hazy", rainProb: 10, windSpeed: 5 },
      { time: "07:00", temp: 26, condition: "Humid", rainProb: 10, windSpeed: 6 },
      { time: "08:00", temp: 27, condition: "Partly Sunny", rainProb: 15, windSpeed: 7 },
      { time: "09:00", temp: 29, condition: "Warm", rainProb: 20, windSpeed: 8 },
      { time: "10:00", temp: 30, condition: "Sun & Haze", rainProb: 20, windSpeed: 9 },
      { time: "11:00", temp: 31, condition: "Peak Sun", rainProb: 20, windSpeed: 9 },
      { time: "12:00", temp: 31, condition: "High Humidity", rainProb: 25, windSpeed: 8 },
      { time: "13:00", temp: 30, condition: "Overcast", rainProb: 30, windSpeed: 7 },
    ],
    threeDay: [
      { day: "Tomorrow", date: "Tue, Oct 06", high: 32, low: 25, condition: "Partly Sunny", rainProb: 20 },
      { day: "Wednesday", date: "Wed, Oct 07", high: 30, low: 24, condition: "Thunderstorms", rainProb: 65 },
      { day: "Thursday", date: "Thu, Oct 08", high: 31, low: 24, condition: "Hazy", rainProb: 15 },
    ],
  },
  Tokyo: {
    city: "Tokyo",
    country: "Japan",
    timezone: "Asia/Tokyo",
    currentTemp: 19,
    condition: "crisp and clear",
    high: 23,
    low: 15,
    rainProb: 5,
    rainPeriod: "dry through midnight",
    wind: "5 mph E",
    uvIndex: 5,
    uvDescription: "Moderate",
    airQuality: 16,
    airQualityDescription: "Excellent",
    humidity: 52,
    sunrise: "05:39",
    sunset: "17:21",
    hourly: [
      { time: "06:00", temp: 16, condition: "Clear", rainProb: 0, windSpeed: 4 },
      { time: "07:00", temp: 18, condition: "Sunny", rainProb: 0, windSpeed: 5 },
      { time: "08:00", temp: 19, condition: "Clear", rainProb: 5, windSpeed: 5 },
      { time: "09:00", temp: 21, condition: "Clear", rainProb: 5, windSpeed: 6 },
      { time: "10:00", temp: 22, condition: "Sunny", rainProb: 5, windSpeed: 6 },
      { time: "11:00", temp: 23, condition: "Sunny", rainProb: 5, windSpeed: 6 },
      { time: "12:00", temp: 23, condition: "Clear", rainProb: 5, windSpeed: 5 },
      { time: "13:00", temp: 22, condition: "Clear", rainProb: 5, windSpeed: 5 },
    ],
    threeDay: [
      { day: "Tomorrow", date: "Tue, Oct 06", high: 22, low: 14, condition: "Sunny", rainProb: 0 },
      { day: "Wednesday", date: "Wed, Oct 07", high: 20, low: 15, condition: "Partly Cloudy", rainProb: 15 },
      { day: "Thursday", date: "Thu, Oct 08", high: 21, low: 13, condition: "Clear", rainProb: 10 },
    ],
  },
  NewYork: {
    city: "New York",
    country: "United States",
    timezone: "America/New_York",
    currentTemp: 59,
    condition: "fair skies",
    high: 64,
    low: 51,
    rainProb: 15,
    rainPeriod: "slight late drizzle",
    wind: "10 mph NW",
    uvIndex: 4,
    uvDescription: "Moderate",
    airQuality: 32,
    airQualityDescription: "Good",
    humidity: 58,
    sunrise: "06:55",
    sunset: "18:32",
    hourly: [
      { time: "06:00", temp: 53, condition: "Clear", rainProb: 5, windSpeed: 8 },
      { time: "07:00", temp: 56, condition: "Sunny", rainProb: 5, windSpeed: 9 },
      { time: "08:00", temp: 59, condition: "Fair", rainProb: 10, windSpeed: 10 },
      { time: "09:00", temp: 61, condition: "Fair", rainProb: 10, windSpeed: 10 },
      { time: "10:00", temp: 63, condition: "Partly Sunny", rainProb: 15, windSpeed: 11 },
      { time: "11:00", temp: 64, condition: "Partly Sunny", rainProb: 15, windSpeed: 11 },
      { time: "12:00", temp: 64, condition: "Fair", rainProb: 15, windSpeed: 10 },
      { time: "13:00", temp: 63, condition: "Fair", rainProb: 20, windSpeed: 9 },
    ],
    threeDay: [
      { day: "Tomorrow", date: "Tue, Oct 06", high: 62, low: 49, condition: "Sunny", rainProb: 5 },
      { day: "Wednesday", date: "Wed, Oct 07", high: 58, low: 46, condition: "Overcast", rainProb: 30 },
      { day: "Thursday", date: "Thu, Oct 08", high: 60, low: 48, condition: "Clear", rainProb: 10 },
    ],
  },
};

// In-memory persistent state (swappable with database/API in production)
let currentPreferences: UserPreferences = {
  city: "Seattle",
  timezone: "America/Los_Angeles",
  channel: "email",
  email: "reader@betadigest.com",
  dispatchTime: "06:00",
  editions: {
    morning: true,
    midday: false,
    evening: false,
  },
  activeMetrics: ["high_low", "rain_prob", "uv_index", "air_quality"],
  isPaused: false,
  pausedAt: null,
};

export interface DigestServiceInterface {
  getForecast(city?: string): Promise<CityData>;
  getDigest(city?: string, activeMetrics?: MetricKey[]): Promise<DigestPayload>;
  getPreferences(): Promise<UserPreferences>;
  savePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences>;
  pauseDelivery(paused: boolean): Promise<{ success: boolean; paused: boolean }>;
}

export const digestService: DigestServiceInterface = {
  async getForecast(cityName: string = "Seattle"): Promise<CityData> {
    const key = Object.keys(MOCK_CITIES).find(
      (k) => k.toLowerCase() === cityName.toLowerCase()
    );
    return MOCK_CITIES[key || "Seattle"];
  },

  async getDigest(
    cityName: string = "Seattle",
    activeMetrics: MetricKey[] = ["high_low", "rain_prob", "uv_index", "air_quality"]
  ): Promise<DigestPayload> {
    const city = await this.getForecast(cityName);
    const stories = MOCK_STORIES;
    const previewText = deriveDigestText({
      city,
      activeMetrics,
      stories,
    });
    const formattedTime = formatCurrentTimeInZone(city.timezone);

    return {
      previewText,
      weatherSummary: `${city.currentTemp}°F, ${city.condition}. High ${city.high} / Low ${city.low}. Rain ${city.rainProb}% ${city.rainPeriod}.`,
      stories,
      city,
      formattedTime,
    };
  },

  async getPreferences(): Promise<UserPreferences> {
    return { ...currentPreferences };
  },

  async savePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    currentPreferences = {
      ...currentPreferences,
      ...prefs,
    };
    return { ...currentPreferences };
  },

  async pauseDelivery(paused: boolean): Promise<{ success: boolean; paused: boolean }> {
    currentPreferences.isPaused = paused;
    currentPreferences.pausedAt = paused ? new Date().toISOString() : null;
    return { success: true, paused };
  },
};
