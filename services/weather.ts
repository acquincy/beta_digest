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
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  highTemp: number;
  lowTemp: number;
  precipitationProbability: number;
  weatherCode: number;
  conditionText: string;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  commuteAdvice: string;
  lifestyleAdvice: string;
  hourlyTimeline: HourlyForecastPoint[];
  dailyForecast: {
    date: string;
    maxTemp: number;
    minTemp: number;
    conditionText: string;
    weatherCode: number;
  }[];
}

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

  if (windSpeed > 30) {
    advice += " Breezy conditions; hold onto lightweight gear.";
  }

  return advice.trim();
}

export const FALLBACK_HOURLY_PORT_HARCOURT: HourlyForecastPoint[] = [
  { time: "07:00", fullTime: "2026-09-30T07:00", temperature: 25, precipitationProbability: 10, weatherCode: 0, conditionText: "Clear", isCommuteWindow: true },
  { time: "08:00", fullTime: "2026-09-30T08:00", temperature: 26, precipitationProbability: 15, weatherCode: 0, conditionText: "Clear", isCommuteWindow: true },
  { time: "09:00", fullTime: "2026-09-30T09:00", temperature: 28, precipitationProbability: 20, weatherCode: 1, conditionText: "Mainly clear", isCommuteWindow: true },
  { time: "10:00", fullTime: "2026-09-30T10:00", temperature: 29, precipitationProbability: 25, weatherCode: 2, conditionText: "Partly cloudy", isCommuteWindow: false },
  { time: "11:00", fullTime: "2026-09-30T11:00", temperature: 30, precipitationProbability: 35, weatherCode: 2, conditionText: "Partly cloudy", isCommuteWindow: false },
  { time: "12:00", fullTime: "2026-09-30T12:00", temperature: 31, precipitationProbability: 40, weatherCode: 80, conditionText: "Light showers", isCommuteWindow: false },
  { time: "13:00", fullTime: "2026-09-30T13:00", temperature: 31, precipitationProbability: 45, weatherCode: 80, conditionText: "Showers", isCommuteWindow: false },
  { time: "14:00", fullTime: "2026-09-30T14:00", temperature: 30, precipitationProbability: 55, weatherCode: 61, conditionText: "Rain", isCommuteWindow: false },
];

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
  sunrise: "06:18",
  sunset: "18:24",
  commuteAdvice: "Clear morning commute (07:00–09:00, 25°–28°). Rain probability rises to 55% by 14:00.",
  lifestyleAdvice: "Warm and bright morning. High UV around midday, light afternoon rain possible.",
  hourlyTimeline: FALLBACK_HOURLY_PORT_HARCOURT,
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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=4`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) {
      return { ...FALLBACK_WEATHER_PORT_HARCOURT, city: cityName, country: countryName, latitude, longitude };
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const conditionText = interpretWeatherCode(current.weather_code || 0);
    const lifestyleAdvice = generateLifestyleAdvice(
      current.temperature_2m || 28,
      current.weather_code || 0,
      current.wind_speed_10m || 10
    );

    // Extract next 8 hours of timeline
    let hourlyTimeline: HourlyForecastPoint[] = [];
    if (hourly.time && Array.isArray(hourly.time)) {
      const nowIso = new Date().toISOString();
      let startIndex = hourly.time.findIndex((t: string) => t >= nowIso.slice(0, 13));
      if (startIndex < 0) startIndex = 0;

      hourlyTimeline = hourly.time.slice(startIndex, startIndex + 8).map((t: string, i: number) => {
        const actualIdx = startIndex + i;
        const timePart = t.split("T")[1]?.slice(0, 5) || "00:00";
        const hourNum = parseInt(timePart.split(":")[0], 10);
        const code = hourly.weather_code?.[actualIdx] ?? 0;
        return {
          time: timePart,
          fullTime: t,
          temperature: Math.round(hourly.temperature_2m?.[actualIdx] ?? 25),
          precipitationProbability: hourly.precipitation_probability?.[actualIdx] ?? 0,
          weatherCode: code,
          conditionText: interpretWeatherCode(code),
          isCommuteWindow: [7, 8, 9, 17, 18].includes(hourNum),
        };
      });
    }

    if (hourlyTimeline.length === 0) {
      hourlyTimeline = FALLBACK_HOURLY_PORT_HARCOURT;
    }

    // Compute commute advisory
    const morningPoints = hourlyTimeline.slice(0, 3);
    const maxRainMorning = Math.max(...morningPoints.map((p) => p.precipitationProbability), 0);
    let commuteAdvice = `Smooth morning conditions (${morningPoints[0]?.temperature ?? 26}°C).`;
    if (maxRainMorning >= 40) {
      commuteAdvice = `Commute alert: Rain probability peaks at ${maxRainMorning}% during morning hours. Carry an umbrella.`;
    } else {
      const laterHighRain = hourlyTimeline.find((p) => p.precipitationProbability >= 50);
      if (laterHighRain) {
        commuteAdvice = `Clear morning commute. Rain probability climbs to ${laterHighRain.precipitationProbability}% around ${laterHighRain.time}.`;
      }
    }

    const dailyForecast = (daily.time as string[] || []).slice(1).map((date, idx) => ({
      date,
      maxTemp: Math.round(daily.temperature_2m_max?.[idx + 1] ?? 30),
      minTemp: Math.round(daily.temperature_2m_min?.[idx + 1] ?? 24),
      conditionText: interpretWeatherCode(daily.weather_code?.[idx + 1] ?? 1),
      weatherCode: daily.weather_code?.[idx + 1] ?? 1,
    }));

    const sunrise = daily.sunrise?.[0] ? daily.sunrise[0].split("T")[1]?.slice(0, 5) : "06:18";
    const sunset = daily.sunset?.[0] ? daily.sunset[0].split("T")[1]?.slice(0, 5) : "18:24";

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
      sunrise,
      sunset,
      commuteAdvice,
      hourlyTimeline,
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

import { CityWeatherData, HourlyForecastItem, DailyForecastItem } from "@/lib/types";

const weatherCache = new Map<string, { data: CityWeatherData; timestamp: number }>();
const WEATHER_CACHE_TTL = 15 * 60 * 1000;

function degreesToCompass(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}

function getUvDescription(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

export async function fetchCityWeatherDataLive(
  cityName: string = "London",
  countryCode: string = "GB"
): Promise<CityWeatherData> {
  const cacheKey = `${cityName.toLowerCase()}_${countryCode.toLowerCase()}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL) {
    return cached.data;
  }

  const isUS = countryCode === "US" || cityName.toLowerCase() === "new york" || cityName.toLowerCase() === "seattle";
  const tempUnit: "°F" | "°C" = isUS ? "°F" : "°C";
  const windUnit: "mph" | "km/h" = isUS ? "mph" : "km/h";

  let lat = 51.5074;
  let lon = -0.1278;
  let resolvedCountry = isUS ? "United States" : "United Kingdom";

  try {
    const geo = await geocodeCity(cityName);
    if (geo && geo.length > 0) {
      lat = geo[0].latitude;
      lon = geo[0].longitude;
      resolvedCountry = geo[0].country || resolvedCountry;
    }
  } catch {}

  const toTemp = (celsius: number) => (isUS ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius));
  const toWind = (kmh: number) => (isUS ? Math.round(kmh * 0.621371) : Math.round(kmh));

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=4`;

  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const daily = data.daily || {};
      const hourly = data.hourly || {};

      const currentTemp = toTemp(current.temperature_2m ?? 18);
      const condition = interpretWeatherCode(current.weather_code ?? 0);
      const high = toTemp(daily.temperature_2m_max?.[0] ?? (current.temperature_2m ?? 18) + 3);
      const low = toTemp(daily.temperature_2m_min?.[0] ?? (current.temperature_2m ?? 18) - 3);
      const rainProb = Math.round(daily.precipitation_probability_max?.[0] ?? 20);
      const thunderstormProb = [95, 96, 99].includes(current.weather_code) ? 80 : Math.round(rainProb * 0.3);
      const cloudiness = [2, 3].includes(current.weather_code) ? 75 : current.weather_code === 1 ? 30 : 10;
      const rawWind = current.wind_speed_10m ?? 12;
      const windSpeed = toWind(rawWind);
      const windDirection = degreesToCompass(current.wind_direction_10m ?? 210);
      const windFormatted = `${windSpeed} ${windUnit} ${windDirection}`;
      const uvIndex = Math.round(daily.uv_index_max?.[0] ?? 4);
      const uvDescription = getUvDescription(uvIndex);
      const humidity = Math.round(current.relative_humidity_2m ?? 65);
      const sunrise = daily.sunrise?.[0] ? daily.sunrise[0].split("T")[1]?.slice(0, 5) : "06:30";
      const sunset = daily.sunset?.[0] ? daily.sunset[0].split("T")[1]?.slice(0, 5) : "18:45";

      // 3-hour hourly breakdown
      const hourlyItems: HourlyForecastItem[] = [];
      if (hourly.time && Array.isArray(hourly.time)) {
        const nowIso = new Date().toISOString();
        let startIndex = hourly.time.findIndex((t: string) => t >= nowIso.slice(0, 13));
        if (startIndex < 0) startIndex = 0;

        for (let i = 0; i < 3; i++) {
          const idx = startIndex + i + 1;
          if (hourly.time[idx]) {
            const timePart = hourly.time[idx].split("T")[1]?.slice(0, 5) || "12:00";
            const tempVal = toTemp(hourly.temperature_2m?.[idx] ?? 18);
            const cond = interpretWeatherCode(hourly.weather_code?.[idx] ?? 0);
            hourlyItems.push({ time: timePart, temp: tempVal, condition: cond });
          }
        }
      }

      // 3-day forecast
      const threeDayItems: DailyForecastItem[] = [];
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      if (daily.time && Array.isArray(daily.time)) {
        for (let i = 1; i <= 3; i++) {
          if (daily.time[i]) {
            const d = new Date(daily.time[i]);
            const dayName = days[d.getDay()] || "Upcoming";
            const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            threeDayItems.push({
              day: dayName,
              date: dateStr,
              high: toTemp(daily.temperature_2m_max?.[i] ?? 20),
              low: toTemp(daily.temperature_2m_min?.[i] ?? 14),
              condition: interpretWeatherCode(daily.weather_code?.[i] ?? 0),
              rainProb: Math.round(daily.precipitation_probability_max?.[i] ?? 15),
            });
          }
        }
      }

      const result: CityWeatherData = {
        city: cityName,
        country: resolvedCountry,
        isUS,
        tempUnit,
        windUnit,
        currentTemp,
        condition,
        high,
        low,
        rainProb,
        thunderstormProb,
        cloudiness,
        windSpeed,
        windDirection,
        windFormatted,
        uvIndex,
        uvDescription,
        airQuality: 32,
        airQualityDescription: "Good",
        humidity,
        sunrise,
        sunset,
        hourly: hourlyItems.length > 0 ? hourlyItems : [
          { time: "14:00", temp: currentTemp + 1, condition },
          { time: "15:00", temp: currentTemp + 2, condition },
          { time: "16:00", temp: currentTemp, condition },
        ],
        threeDay: threeDayItems.length > 0 ? threeDayItems : [
          { day: "Tomorrow", date: "Tomorrow", high: high + 1, low, condition, rainProb },
          { day: "Day 2", date: "In 2 days", high, low: low - 1, condition, rainProb },
          { day: "Day 3", date: "In 3 days", high: high - 1, low: low - 2, condition, rainProb },
        ],
      };

      weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }
  } catch {}

  // Fallback real-scale estimation if network blocked
  const fallbackResult: CityWeatherData = {
    city: cityName,
    country: resolvedCountry,
    isUS,
    tempUnit,
    windUnit,
    currentTemp: isUS ? 68 : 20,
    condition: "Partly cloudy",
    high: isUS ? 73 : 23,
    low: isUS ? 57 : 14,
    rainProb: 20,
    thunderstormProb: 5,
    cloudiness: 40,
    windSpeed: isUS ? 8 : 13,
    windDirection: "SW",
    windFormatted: `${isUS ? 8 : 13} ${windUnit} SW`,
    uvIndex: 4,
    uvDescription: "Moderate",
    airQuality: 28,
    airQualityDescription: "Good",
    humidity: 62,
    sunrise: "06:30",
    sunset: "18:45",
    hourly: [
      { time: "14:00", temp: isUS ? 70 : 21, condition: "Partly cloudy" },
      { time: "15:00", temp: isUS ? 72 : 22, condition: "Partly cloudy" },
      { time: "16:00", temp: isUS ? 69 : 20, condition: "Clear skies" },
    ],
    threeDay: [
      { day: "Tomorrow", date: "Tomorrow", high: isUS ? 74 : 23, low: isUS ? 58 : 14, condition: "Partly cloudy", rainProb: 15 },
      { day: "Day 2", date: "In 2 days", high: isUS ? 72 : 22, low: isUS ? 56 : 13, condition: "Clear skies", rainProb: 10 },
      { day: "Day 3", date: "In 3 days", high: isUS ? 70 : 21, low: isUS ? 55 : 13, condition: "Light drizzle", rainProb: 35 },
    ],
  };

  return fallbackResult;
}

