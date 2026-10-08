import {
  Preferences,
  WeatherTopicId,
  NewsTopicId,
  WEATHER_TOPIC_ORDER,
  NEWS_TOPIC_ORDER,
} from "./types";

export const INITIAL_PREFERENCES: Preferences = {
  name: "Alex",
  email: "reader@betadigest.com",
  countryCode: "US",
  city: "Seattle",
  cityIsCustom: false,
  deliveryHour: 7,
  weatherTopics: ["current-temperature", "rain-chance", "uv-index"],
  newsTopics: ["economy", "technology", "science", "health", "environment"],
};

const STORAGE_KEY = "betadigest_preferences";
const LEGACY_STORAGE_KEY = "betadigest_wizard_state";

export function parseDeliveryHour(value: unknown): number {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 23) {
    return value;
  }
  if (typeof value === "string") {
    // Check for "07:00" or "7:00 AM" or "11:00 PM"
    const match = value.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const ampm = match[3]?.toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      if (h >= 0 && h <= 23) return h;
    }
  }
  return 7;
}

export function sanitizePreferences(raw: unknown): Preferences {
  if (!raw || typeof raw !== "object") {
    return { ...INITIAL_PREFERENCES };
  }

  const rec = raw as Record<string, unknown>;

  // Extract name
  const name =
    typeof rec.name === "string" && rec.name.trim()
      ? rec.name.trim()
      : typeof rec.firstName === "string" && rec.firstName.trim()
      ? rec.firstName.trim()
      : INITIAL_PREFERENCES.name;

  // Extract email
  const email =
    typeof rec.email === "string" && rec.email.trim()
      ? rec.email.trim()
      : INITIAL_PREFERENCES.email;

  // Extract countryCode
  let countryCode = INITIAL_PREFERENCES.countryCode;
  if (typeof rec.countryCode === "string" && rec.countryCode.trim()) {
    countryCode = rec.countryCode.trim().toUpperCase();
  } else if (
    rec.country &&
    typeof rec.country === "object" &&
    typeof (rec.country as Record<string, unknown>).code === "string"
  ) {
    countryCode = ((rec.country as Record<string, unknown>).code as string).trim().toUpperCase();
  }

  // Extract city
  const city =
    typeof rec.city === "string" && rec.city.trim()
      ? rec.city.trim()
      : typeof rec.locationValue === "string" && rec.locationValue.trim()
      ? rec.locationValue.trim()
      : INITIAL_PREFERENCES.city;

  const cityIsCustom = Boolean(rec.cityIsCustom);

  // Extract deliveryHour
  const deliveryHour = parseDeliveryHour(rec.deliveryHour ?? rec.dispatchTime);

  // Extract and sanitize weather topics
  let weatherTopics: WeatherTopicId[] = [];
  const validWeatherSet = new Set<WeatherTopicId>(WEATHER_TOPIC_ORDER);

  if (Array.isArray(rec.weatherTopics)) {
    weatherTopics = (rec.weatherTopics as unknown[]).filter((t): t is WeatherTopicId =>
      typeof t === "string" && validWeatherSet.has(t as WeatherTopicId)
    );
  } else if (Array.isArray(rec.weatherDetails)) {
    // Map legacy labels if present
    const legacyLabelMap: Record<string, WeatherTopicId> = {
      "Current temperature": "current-temperature",
      "Day's high/low temp": "high-low",
      "3-hour breakdown": "hourly-3h",
      "3-day forecast": "forecast-3day",
      "Rain chance": "rain-chance",
      "Thunderstorm chance": "thunderstorm-chance",
      "Cloudiness": "cloudiness",
      "UV index": "uv-index",
      "Air quality": "air-quality",
      "Wind": "wind",
      "Humidity": "humidity",
      "Sunrise time": "sun-times",
      "Sunset time": "sun-times",
    };
    for (const item of rec.weatherDetails as unknown[]) {
      if (typeof item === "string") {
        const mapped = legacyLabelMap[item];
        if (mapped && !weatherTopics.includes(mapped)) {
          weatherTopics.push(mapped);
        }
      }
    }
  }

  // Always enforce fixed order and cap at 3
  weatherTopics = WEATHER_TOPIC_ORDER.filter((t) => weatherTopics.includes(t)).slice(0, 3);

  // Extract and sanitize news topics
  let newsTopics: NewsTopicId[] = [];
  const validNewsSet = new Set<NewsTopicId>(NEWS_TOPIC_ORDER);

  if (Array.isArray(rec.newsTopics)) {
    newsTopics = (rec.newsTopics as unknown[]).filter((t): t is NewsTopicId =>
      typeof t === "string" && validNewsSet.has(t as NewsTopicId)
    );
  } else if (
    rec.newsConfig &&
    typeof rec.newsConfig === "object" &&
    Array.isArray((rec.newsConfig as Record<string, unknown>).focusAreas)
  ) {
    const legacyFocusMap: Record<string, NewsTopicId> = {
      "Politics & Government": "politics",
      "Economy & Business": "economy",
      "Health & Medicine": "health",
      "Environment & Climate": "environment",
      "Crime & Justice": "crime",
      "International Relations": "international",
      "Education & Academia": "education",
      "Science & Innovation": "science",
      "Society & Culture": "society",
      "Disasters & Emergencies": "disasters",
    };
    for (const fa of (rec.newsConfig as Record<string, unknown>).focusAreas as unknown[]) {
      if (typeof fa === "string") {
        const mapped = legacyFocusMap[fa];
        if (mapped && !newsTopics.includes(mapped)) {
          newsTopics.push(mapped);
        }
      }
    }
  }

  // Always enforce fixed order and cap at 5
  newsTopics = NEWS_TOPIC_ORDER.filter((t) => newsTopics.includes(t)).slice(0, 5);

  // Require at least 1 topic in total
  if (weatherTopics.length + newsTopics.length === 0) {
    weatherTopics = [...INITIAL_PREFERENCES.weatherTopics];
    newsTopics = [...INITIAL_PREFERENCES.newsTopics];
  }

  return {
    name,
    email,
    countryCode,
    city,
    cityIsCustom,
    deliveryHour,
    weatherTopics,
    newsTopics,
  };
}

export function loadPreferences(): Preferences {
  if (typeof window === "undefined") return { ...INITIAL_PREFERENCES };
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return { ...INITIAL_PREFERENCES };
    const parsed = JSON.parse(raw);
    return sanitizePreferences(parsed);
  } catch {
    return { ...INITIAL_PREFERENCES };
  }
}

export function savePreferences(prefs: Preferences): void {
  if (typeof window === "undefined") return;
  try {
    const sanitized = sanitizePreferences(prefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    // Clear legacy storage key so no old data lingers
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore quota errors
  }
}

// Backwards-compatibility helpers
export const loadWizardState = loadPreferences;
export const saveWizardState = savePreferences;
export type WizardState = Preferences;
