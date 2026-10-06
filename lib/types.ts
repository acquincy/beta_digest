export type MetricKey =
  | "high_low"
  | "rain_prob"
  | "commute_wind"
  | "uv_index"
  | "air_quality"
  | "humidity"
  | "sun_events"
  | "hourly_breakdown"
  | "three_day_forecast";

export interface MetricDefinition {
  key: MetricKey;
  label: string;
  defaultActive: boolean;
}

export const AVAILABLE_METRICS: MetricDefinition[] = [
  { key: "high_low", label: "High/Low", defaultActive: true },
  { key: "rain_prob", label: "Rain probability", defaultActive: true },
  { key: "commute_wind", label: "Commute wind", defaultActive: false },
  { key: "uv_index", label: "UV index", defaultActive: true },
  { key: "air_quality", label: "Air quality", defaultActive: true },
  { key: "humidity", label: "Humidity", defaultActive: false },
  { key: "sun_events", label: "Sunrise/Sunset", defaultActive: false },
  { key: "hourly_breakdown", label: "3-hour breakdown", defaultActive: false },
  { key: "three_day_forecast", label: "3-day forecast", defaultActive: false },
];

export interface HourlyForecastItem {
  time: string;
  temp: number;
  condition: string;
  rainProb: number;
  windSpeed: number;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  rainProb: number;
}

export interface CityData {
  city: string;
  country: string;
  timezone: string;
  currentTemp: number;
  condition: string;
  high: number;
  low: number;
  rainProb: number;
  rainPeriod: string;
  wind: string;
  uvIndex: number;
  uvDescription: string;
  airQuality: number;
  airQualityDescription: string;
  humidity: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecastItem[];
  threeDay: DailyForecastItem[];
}

export interface EditorialStory {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  category: "markets" | "transit" | "infrastructure" | "policy" | "climate";
  url: string;
}

export type DeliveryChannel = "email" | "sms";

export interface EditionSelection {
  morning: boolean;
  midday: boolean;
  evening: boolean;
}

export interface UserPreferences {
  city: string;
  timezone: string;
  channel: DeliveryChannel;
  email: string;
  phone?: string;
  dispatchTime: string;
  editions: EditionSelection;
  activeMetrics: MetricKey[];
  isPaused: boolean;
  pausedAt?: string | null;
}

export interface DigestPayload {
  previewText: string;
  weatherSummary: string;
  stories: EditorialStory[];
  city: CityData;
  formattedTime: string;
}

export interface ServiceResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

/* -------------------------------------------------------------
   Backwards-Compatible Types for Existing Weather & Feeds Stack
------------------------------------------------------------- */
export type TopicCategory =
  | "tech"
  | "ai"
  | "startups"
  | "business"
  | "sports"
  | "science"
  | "world";

export interface HourlyForecastPoint {
  time: string;
  fullTime: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  conditionText: string;
  isCommuteWindow: boolean;
}

export interface WeatherData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  highTemp?: number;
  lowTemp?: number;
  precipitationProbability?: number;
  weatherCode: number;
  conditionText: string;
  windSpeed: number;
  humidity: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
  commuteAdvice?: string;
  hourlyTimeline?: HourlyForecastPoint[];
  dailyForecast: {
    date: string;
    maxTemp: number;
    minTemp: number;
    conditionText: string;
    weatherCode: number;
  }[];
  lifestyleAdvice?: string;
}

export interface BriefingStory {
  id: string;
  number: string;
  category: TopicCategory;
  categoryLabel: string;
  categoryIcon: string;
  title: string;
  summary: string;
  whyItMatters: string;
  source: string;
  publishedAt: string;
  readingTime: string;
  url: string;
  isBookmarked?: boolean;
}

export interface MorningBriefing {
  id: string;
  date: string;
  dateFormatted: string;
  dayOfWeek: string;
  recipientName: string;
  overview: string;
  commuteSnippet: string;
  storiesCount: number;
  estimatedReadTime: string;
  weather: WeatherData;
  stories: BriefingStory[];
  generatedAt: string;
}

export interface DigestNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: TopicCategory;
  publishedAt: string;
  aiTakeaway?: string;
  whyItMatters?: string;
}

export interface DailyDigest {
  id: string;
  date: string;
  title: string;
  weather: WeatherData;
  newsItems: DigestNewsItem[];
  overview: string;
  generatedBy: "n8n_workflow" | "local_pipeline";
  createdAt: string;
}
