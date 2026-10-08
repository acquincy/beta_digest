import { CityWeatherData, EditorialStory, WeatherTopicId, WEATHER_TOPIC_ORDER } from "./types";

export interface DigestDerivationOptions {
  city: CityWeatherData;
  weatherTopics: WeatherTopicId[];
  stories?: EditorialStory[];
  greeting?: string;
}

/**
 * Derives the exact emoji-free plain text for the Digest preview based on selected weather details.
 * Single source of truth.
 */
export function deriveDigestText({
  city,
  weatherTopics,
  stories = [],
  greeting = "Good morning.",
}: DigestDerivationOptions): string {
  const parts: string[] = [];

  // Sort selected weather topics in fixed order
  const selectedSet = new Set(weatherTopics);
  const orderedSelected = WEATHER_TOPIC_ORDER.filter((t) => selectedSet.has(t));

  // Base line: greeting and current condition if current-temperature selected, or greeting
  if (selectedSet.has("current-temperature")) {
    parts.push(`${greeting} Weather in ${city.city}: ${city.currentTemp}${city.tempUnit}, ${city.condition}.`);
  } else {
    parts.push(`${greeting} Weather in ${city.city}: ${city.condition}.`);
  }

  for (const topic of orderedSelected) {
    switch (topic) {
      case "high-low":
        parts.push(`High ${city.high}${city.tempUnit} / low ${city.low}${city.tempUnit}.`);
        break;
      case "hourly-3h":
        if (city.hourly && city.hourly.length >= 3) {
          const hStr = city.hourly
            .slice(0, 3)
            .map((h) => `${h.time} ${h.temp}${city.tempUnit}`)
            .join(", ");
          parts.push(`3h breakdown: ${hStr}.`);
        }
        break;
      case "forecast-3day":
        if (city.threeDay && city.threeDay.length >= 3) {
          const dStr = city.threeDay
            .slice(0, 3)
            .map((d) => `${d.day} ${d.high}/${d.low}${city.tempUnit}`)
            .join(", ");
          parts.push(`3-day forecast: ${dStr}.`);
        }
        break;
      case "rain-chance":
        parts.push(`Rain chance ${city.rainProb}%.`);
        break;
      case "thunderstorm-chance":
        parts.push(`Thunderstorm chance ${city.thunderstormProb}%.`);
        break;
      case "cloudiness":
        parts.push(`Cloudiness ${city.cloudiness}%.`);
        break;
      case "uv-index":
        parts.push(`UV index ${city.uvIndex} (${city.uvDescription}).`);
        break;
      case "air-quality":
        parts.push(`Air quality ${city.airQuality} (${city.airQualityDescription}).`);
        break;
      case "wind":
        parts.push(`Wind ${city.windFormatted}.`);
        break;
      case "humidity":
        parts.push(`Humidity ${city.humidity}%.`);
        break;
      case "sun-times":
        parts.push(`Sunrise ${city.sunrise} / Sunset ${city.sunset}.`);
        break;
    }
  }

  if (stories && stories.length > 0) {
    const storyList = stories
      .slice(0, 3)
      .map((s, idx) => `(${idx + 1}) ${s.headline.trim()}`)
      .join(" ");
    parts.push(`Top stories: ${storyList}`);
  }

  return parts.join(" ");
}
