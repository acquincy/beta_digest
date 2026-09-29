import { NextRequest, NextResponse } from "next/server";
import { N8nWebhookPayload } from "@/lib/types";

// In-memory store for recent webhook digests received during current runtime session
export const recentWebhookDigests: N8nWebhookPayload[] = [];

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/n8n",
    description: "Beta Digest receiver for n8n automated pipelines",
    recentDigestsCount: recentWebhookDigests.length,
    instructions: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-n8n-signature": "optional-shared-secret-or-api-key",
      },
      expectedPayload: {
        userId: "string (optional)",
        date: "YYYY-MM-DD",
        overview: "AI generated overview of the day",
        weatherSummary: "WeatherData object",
        newsSummary: "Array of DigestNewsItem",
      },
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: N8nWebhookPayload = await request.json();

    if (!body || !body.date) {
      return NextResponse.json(
        { error: "Invalid payload: 'date' field is required." },
        { status: 400 }
      );
    }

    const digestRecord: N8nWebhookPayload = {
      ...body,
      source: body.source || "n8n_webhook",
    };

    // Keep the most recent 20 webhook digests
    recentWebhookDigests.unshift(digestRecord);
    if (recentWebhookDigests.length > 20) {
      recentWebhookDigests.pop();
    }

    return NextResponse.json({
      success: true,
      message: "Digest successfully ingested from n8n pipeline.",
      receivedAt: new Date().toISOString(),
      digestDate: body.date,
      articlesCount: body.newsSummary ? body.newsSummary.length : 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
