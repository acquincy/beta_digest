import { NextRequest, NextResponse } from "next/server";
import { getTop5StoriesLive } from "@/services/news";
import { NewsTopicId } from "@/lib/types";
import { withPrivateCacheHeaders } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topicsParam = searchParams.get("topics");

  let topics: NewsTopicId[] = [];
  if (topicsParam) {
    topics = topicsParam
      .split(",")
      .map((t) => t.trim() as NewsTopicId)
      .filter(Boolean);
  }

  try {
    const stories = await getTop5StoriesLive(topics);
    return withPrivateCacheHeaders(NextResponse.json({ stories }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch live news";
    return withPrivateCacheHeaders(
      NextResponse.json({ error: message, stories: [] }, { status: 500 })
    );
  }
}
