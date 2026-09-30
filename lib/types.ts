export type TopicCategory =
  | "tech"
  | "ai"
  | "startups"
  | "business"
  | "sports"
  | "science"
  | "world";

export interface HourlyForecastPoint {
  time: string; // e.g., "07:00", "08:00"
  fullTime: string; // ISO string
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

export interface UserPreferences {
  name: string;
  email: string;
  city: string;
  latitude: number;
  longitude: number;
  topics: TopicCategory[];
  deliveryTime: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

export interface N8nWebhookPayload {
  userId?: string;
  date: string;
  weatherSummary?: WeatherData;
  newsSummary?: DigestNewsItem[];
  overview?: string;
  source?: string;
}
