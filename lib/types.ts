export type WeatherTopicId =
  | "current-temperature"
  | "high-low"
  | "hourly-3h"
  | "forecast-3day"
  | "rain-chance"
  | "thunderstorm-chance"
  | "cloudiness"
  | "uv-index"
  | "air-quality"
  | "wind"
  | "humidity"
  | "sun-times";

export type NewsTopicId =
  | "politics"
  | "economy"
  | "health"
  | "environment"
  | "crime"
  | "international"
  | "education"
  | "science"
  | "society"
  | "disasters"
  | "technology"
  | "sports";

export const WEATHER_TOPIC_ORDER: WeatherTopicId[] = [
  "current-temperature",
  "high-low",
  "hourly-3h",
  "forecast-3day",
  "rain-chance",
  "thunderstorm-chance",
  "cloudiness",
  "uv-index",
  "air-quality",
  "wind",
  "humidity",
  "sun-times",
];

export const NEWS_TOPIC_ORDER: NewsTopicId[] = [
  "politics",
  "economy",
  "health",
  "environment",
  "crime",
  "international",
  "education",
  "science",
  "society",
  "disasters",
  "technology",
  "sports",
];

export const WEATHER_TOPIC_LABELS: Record<WeatherTopicId, string> = {
  "current-temperature": "Current temperature",
  "high-low": "Day's high/low",
  "hourly-3h": "3-hour breakdown",
  "forecast-3day": "3-day forecast",
  "rain-chance": "Rain chance",
  "thunderstorm-chance": "Thunderstorm chance",
  "cloudiness": "Cloudiness",
  "uv-index": "UV index",
  "air-quality": "Air quality",
  wind: "Wind",
  humidity: "Humidity",
  "sun-times": "Sunrise & sunset",
};

export const NEWS_TOPIC_LABELS: Record<NewsTopicId, string> = {
  politics: "Politics & Government",
  economy: "Economy & Business",
  health: "Health & Medicine",
  environment: "Environment & Climate",
  crime: "Crime & Justice",
  international: "International Relations",
  education: "Education & Academia",
  science: "Science & Innovation",
  society: "Society & Culture",
  disasters: "Disasters & Emergencies",
  technology: "Technology",
  sports: "Sports",
};

export interface Preferences {
  name: string;
  email: string;
  countryCode: string;
  city: string;
  cityIsCustom: boolean;
  deliveryHour: number; // integer 0-23, default 7
  weatherTopics: WeatherTopicId[]; // 0-3
  newsTopics: NewsTopicId[]; // 0-5
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  condition: string;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  rainProb: number;
}

export interface CityWeatherData {
  city: string;
  country: string;
  isUS: boolean;
  tempUnit: "°F" | "°C";
  windUnit: "mph" | "km/h";
  currentTemp: number;
  condition: string;
  high: number;
  low: number;
  rainProb: number;
  thunderstormProb: number;
  cloudiness: number;
  windSpeed: number;
  windDirection: string;
  windFormatted: string;
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
  topic: NewsTopicId;
  topicLabel: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  url: string;
}

export interface DigestPayload {
  previewText: string;
  weatherSummary: string;
  stories: EditorialStory[];
  city: CityWeatherData;
  formattedTime: string;
}
