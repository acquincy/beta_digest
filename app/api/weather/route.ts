import { NextRequest, NextResponse } from "next/server";
import { fetchWeather, geocodeCity, fetchCityWeatherDataLive } from "@/services/weather";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // Geocoding query
  if (query) {
    try {
      const results = await geocodeCity(query);
      return NextResponse.json({ results });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Geocoding error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const city = searchParams.get("city") || "London";
  const country = searchParams.get("country") || "GB";
  const format = searchParams.get("format");

  // If format=full or lat/lon not explicitly passed, return live CityWeatherData
  if (format === "full" || (!searchParams.has("lat") && !searchParams.has("lon"))) {
    try {
      const weatherData = await fetchCityWeatherDataLive(city, country);
      return NextResponse.json(weatherData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch city weather";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const lat = parseFloat(searchParams.get("lat") || "51.5074");
  const lon = parseFloat(searchParams.get("lon") || "-0.1278");

  try {
    const weather = await fetchWeather(lat, lon, city, country);
    return NextResponse.json(weather);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Weather fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
