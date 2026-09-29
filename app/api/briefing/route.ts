import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/services/weather";
import { generateMorningBriefing } from "@/services/briefing";
import { TopicCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "Emeka";
    const city = searchParams.get("city") || "Port Harcourt";
    const country = searchParams.get("country") || "Nigeria";
    const lat = parseFloat(searchParams.get("lat") || "4.8156");
    const lon = parseFloat(searchParams.get("lon") || "7.0498");
    const topicsParam = searchParams.get("topics");

    const topics: TopicCategory[] = topicsParam
      ? (topicsParam.split(",") as TopicCategory[])
      : ["tech", "ai", "business", "startups"];

    const weather = await fetchWeather(lat, lon, city, country);
    const briefing = generateMorningBriefing(name, weather, topics);

    return NextResponse.json(briefing);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load morning briefing";
    return NextResponse.json(
      { error: "We couldn't load today's briefing.", detail: message },
      { status: 500 }
    );
  }
}
