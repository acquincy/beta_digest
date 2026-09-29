import { WeatherData } from "@/lib/types";

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export function interpretWeatherCode(code: number): string {
  return WMO_CODE_MAP[code] || "Variable conditions";
}

export function generateLifestyleAdvice(
  temperature: number,
  weatherCode: number,
  windSpeed: number
): string {
  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  const isSnow = [71, 73, 75].includes(weatherCode);

  let advice = "";
  if (isRain) {
    advice += "☔ Keep an umbrella on hand today. ";
  } else if (isSnow) {
    advice += "❄️ Bundle up and exercise caution on the roads. ";
  }

  if (temperature > 28) {
    advice += "Stay hydrated and wear sunscreen. High heat expected.";
  } else if (temperature < 5) {
    advice += "Cold day ahead — consider thermal layers and a heavy coat.";
  } else if (temperature < 15) {
    advice += "A light jacket or sweater will keep you comfortable.";
  } else {
    advice += "Pleasant temperatures for outdoor activities.";
  }

  if (windSpeed > 30) {
    advice += " Notable gusts today — secure outdoor items.";
  }

  return advice.trim();
}

export async function fetchWeather(
  latitude: number = 51.5074,
  longitude: number = -0.1278,
  cityName: string = "London",
  countryName: string = "United Kingdom"
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=4`;

  const response = await fetch(url, { next: { revalidate: 1800 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const data = await response.json();
  const current = data.current;
  const daily = data.daily;

  const conditionText = interpretWeatherCode(current.weather_code);
  const lifestyleAdvice = generateLifestyleAdvice(
    current.temperature_2m,
    current.weather_code,
    current.wind_speed_10m
  );

  const dailyForecast = (daily.time as string[]).slice(1).map((date, idx) => ({
    date,
    maxTemp: Math.round(daily.temperature_2m_max[idx + 1]),
    minTemp: Math.round(daily.temperature_2m_min[idx + 1]),
    conditionText: interpretWeatherCode(daily.weather_code[idx + 1]),
    weatherCode: daily.weather_code[idx + 1],
  }));

  return {
    city: cityName,
    country: countryName,
    latitude,
    longitude,
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(current.apparent_temperature),
    weatherCode: current.weather_code,
    conditionText,
    windSpeed: Math.round(current.wind_speed_10m),
    humidity: current.relative_humidity_2m,
    uvIndex: daily.uv_index_max ? daily.uv_index_max[0] : undefined,
    dailyForecast,
    lifestyleAdvice,
  };
}

export async function geocodeCity(query: string): Promise<{
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}[]> {
  if (!query || query.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((r: { name: string; country?: string; latitude: number; longitude: number }) => ({
      name: r.name,
      country: r.country || "",
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  } catch {
    return [];
  }
}
