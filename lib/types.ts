export type TopicCategory =
  | "tech"
  | "ai"
  | "startups"
  | "business"
  | "science"
  | "world";

export interface WeatherData {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  conditionText: string;
  windSpeed: number;
  humidity: number;
  uvIndex?: number;
  dailyForecast: {
    date: string;
    maxTemp: number;
    minTemp: number;
    conditionText: string;
    weatherCode: number;
  }[];
  lifestyleAdvice?: string;
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
