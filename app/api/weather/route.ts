import { NextRequest, NextResponse } from "next/server";
import { fetchWeather, geocodeCity } from "@/services/weather";

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

  const lat = parseFloat(searchParams.get("lat") || "51.5074");
  const lon = parseFloat(searchParams.get("lon") || "-0.1278");
  const city = searchParams.get("city") || "London";
  const country = searchParams.get("country") || "United Kingdom";

  try {
    const weather = await fetchWeather(lat, lon, city, country);
    return NextResponse.json(weather);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Weather fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
