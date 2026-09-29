import { NextRequest, NextResponse } from "next/server";
import { EDITORIAL_STORIES, getFilteredBriefingStories } from "@/services/briefing";
import { TopicCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") as TopicCategory | null;

  if (topic) {
    const filtered = getFilteredBriefingStories([topic]);
    return NextResponse.json({ stories: filtered });
  }

  return NextResponse.json({ stories: EDITORIAL_STORIES });
}
