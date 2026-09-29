import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/services/weather";
import { fetchNewsForTopics } from "@/services/feeds";
import { DailyDigest, TopicCategory } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const city = body.city || "San Francisco";
    const country = body.country || "United States";
    const lat = typeof body.latitude === "number" ? body.latitude : 37.7749;
    const lon = typeof body.longitude === "number" ? body.longitude : -122.4194;
    const topics: TopicCategory[] = Array.isArray(body.topics) && body.topics.length > 0
      ? body.topics
      : ["tech", "ai", "startups"];

    // Fetch weather and news in parallel
    const [weather, newsItems] = await Promise.all([
      fetchWeather(lat, lon, city, country),
      fetchNewsForTopics(topics),
    ]);

    const overview = `Good morning! In ${weather.city}, expect ${weather.conditionText.toLowerCase()} with temperatures around ${weather.temperature}°C. Today's brief covers ${newsItems.length} essential updates across ${topics.join(", ")}.`;

    const digest: DailyDigest = {
      id: `digest-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: `Daily Digest: ${weather.city} Forecast & Curated Briefs`,
      weather,
      newsItems,
      overview,
      generatedBy: "local_pipeline",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, digest });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate digest";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
