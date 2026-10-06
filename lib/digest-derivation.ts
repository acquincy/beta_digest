import { CityData, EditorialStory, MetricKey } from "./types";

export interface DigestDerivationOptions {
  city: CityData;
  activeMetrics: MetricKey[];
  stories: EditorialStory[];
  greeting?: string;
}

/**
 * Derives the exact emoji-free plain text for the DigestPreview based on the active metric configuration.
 * Single source of truth: ensures no duplicated copy or formatting discrepancies.
 */
export function deriveDigestText({
  city,
  activeMetrics,
  stories,
  greeting = "Good morning.",
}: DigestDerivationOptions): string {
  const parts: string[] = [];

  // Baseline greeting & current condition
  parts.push(`${greeting} ${city.currentTemp}°F, ${city.condition}.`);

  const activeSet = new Set(activeMetrics);

  // Weather metric fragments in strict editorial priority order
  if (activeSet.has("high_low")) {
    parts.push(`High ${city.high} / Low ${city.low}.`);
  }

  if (activeSet.has("rain_prob")) {
    parts.push(`Rain ${city.rainProb}% ${city.rainPeriod}.`);
  }

  if (activeSet.has("commute_wind")) {
    parts.push(`Wind ${city.wind}.`);
  }

  if (activeSet.has("uv_index")) {
    parts.push(`UV ${city.uvIndex} (${city.uvDescription}).`);
  }

  if (activeSet.has("air_quality")) {
    parts.push(`Air quality ${city.airQuality} (${city.airQualityDescription}).`);
  }

  if (activeSet.has("humidity")) {
    parts.push(`Humidity ${city.humidity}%.`);
  }

  if (activeSet.has("sun_events")) {
    parts.push(`Sunrise ${city.sunrise}, Sunset ${city.sunset}.`);
  }

  if (activeSet.has("hourly_breakdown") && city.hourly && city.hourly.length >= 3) {
    const h1 = city.hourly[0];
    const h2 = city.hourly[1];
    const h3 = city.hourly[2];
    parts.push(`Next 3h: ${h1.time} ${h1.temp}°F, ${h2.time} ${h2.temp}°F, ${h3.time} ${h3.temp}°F.`);
  }

  if (activeSet.has("three_day_forecast") && city.threeDay && city.threeDay.length >= 3) {
    const d1 = city.threeDay[0];
    const d2 = city.threeDay[1];
    const d3 = city.threeDay[2];
    parts.push(`3-day: ${d1.day} ${d1.high}/${d1.low}°F, ${d2.day} ${d2.high}/${d2.low}°F, ${d3.day} ${d3.high}/${d3.low}°F.`);
  }

  // Editorial news stories
  if (stories && stories.length > 0) {
    const storyList = stories
      .slice(0, 3)
      .map((s, idx) => `(${idx + 1}) ${s.headline.trim()}`)
      .join(" ");
    parts.push(`Top stories: ${storyList}`);
  }

  return parts.join(" ");
}
