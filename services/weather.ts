import { WeatherData } from "@/lib/types";

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP: Record<number, string> = {
  0: "Clear skies",
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
    advice += "Keep an umbrella on hand today. ";
  } else if (isSnow) {
    advice += "Bundle up and exercise caution on the roads. ";
  }

  if (temperature > 28) {
    advice += "Stay hydrated. Warm conditions expected through the afternoon.";
  } else if (temperature < 10) {
    advice += "Cold day ahead — consider thermal layers and a coat.";
  } else if (temperature < 18) {
    advice += "A light jacket or sweater will keep you comfortable.";
  } else {
    advice += "Pleasant temperatures for your morning commute.";
  }

  return advice.trim();
}

export const FALLBACK_WEATHER_PORT_HARCOURT: WeatherData = {
  city: "Port Harcourt",
  country: "Nigeria",
  latitude: 4.8156,
  longitude: 7.0498,
  temperature: 28,
  apparentTemperature: 30,
  highTemp: 31,
  lowTemp: 24,
  precipitationProbability: 35,
  weatherCode: 0,
  conditionText: "Clear skies",
  windSpeed: 11,
  humidity: 72,
  uvIndex: 7,
  lifestyleAdvice: "Warm and bright morning. High UV around midday, light afternoon rain possible.",
  dailyForecast: [
    {
      date: "Tomorrow",
      maxTemp: 31,
      minTemp: 24,
      conditionText: "Scattered showers",
      weatherCode: 80,
    },
    {
      date: "Wednesday",
      maxTemp: 30,
      minTemp: 23,
      conditionText: "Partly cloudy",
      weatherCode: 2,
    },
    {
      date: "Thursday",
      maxTemp: 29,
      minTemp: 24,
      conditionText: "Moderate rain",
      weatherCode: 63,
    },
  ],
};

export async function fetchWeather(
  latitude: number = 4.8156,
  longitude: number = 7.0498,
  cityName: string = "Port Harcourt",
  countryName: string = "Nigeria"
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=4`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) {
      return { ...FALLBACK_WEATHER_PORT_HARCOURT, city: cityName, country: countryName, latitude, longitude };
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const conditionText = interpretWeatherCode(current.weather_code || 0);
    const lifestyleAdvice = generateLifestyleAdvice(
      current.temperature_2m || 28,
      current.weather_code || 0,
      current.wind_speed_10m || 10
    );

    const dailyForecast = (daily.time as string[] || []).slice(1).map((date, idx) => ({
      date,
      maxTemp: Math.round(daily.temperature_2m_max?.[idx + 1] ?? 30),
      minTemp: Math.round(daily.temperature_2m_min?.[idx + 1] ?? 24),
      conditionText: interpretWeatherCode(daily.weather_code?.[idx + 1] ?? 1),
      weatherCode: daily.weather_code?.[idx + 1] ?? 1,
    }));

    return {
      city: cityName,
      country: countryName,
      latitude,
      longitude,
      temperature: Math.round(current.temperature_2m ?? 28),
      apparentTemperature: Math.round(current.apparent_temperature ?? 30),
      highTemp: Math.round(daily.temperature_2m_max?.[0] ?? 31),
      lowTemp: Math.round(daily.temperature_2m_min?.[0] ?? 24),
      precipitationProbability: daily.precipitation_probability_max?.[0] ?? 35,
      weatherCode: current.weather_code ?? 0,
      conditionText,
      windSpeed: Math.round(current.wind_speed_10m ?? 11),
      humidity: current.relative_humidity_2m ?? 72,
      uvIndex: daily.uv_index_max ? daily.uv_index_max[0] : 6,
      dailyForecast: dailyForecast.length > 0 ? dailyForecast : FALLBACK_WEATHER_PORT_HARCOURT.dailyForecast,
      lifestyleAdvice,
    };
  } catch {
    return {
      ...FALLBACK_WEATHER_PORT_HARCOURT,
      city: cityName,
      country: countryName,
      latitude,
      longitude,
    };
  }
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
