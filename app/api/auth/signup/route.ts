import { NextRequest, NextResponse } from "next/server";
import { n8nSignup } from "@/lib/n8n";
import { validateOrigin, withPrivateCacheHeaders } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: "Forbidden: invalid origin" },
        { status: 403 }
      )
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawEmail || !rawEmail.includes("@") || rawEmail.length < 5) {
      return withPrivateCacheHeaders(
        NextResponse.json(
          { status: "error", message: "A valid email address is required." },
          { status: 400 }
        )
      );
    }

    const payload = {
      email: rawEmail,
      name: typeof body.name === "string" ? body.name.trim() : undefined,
      city: typeof body.city === "string" ? body.city.trim() : undefined,
      country_code: typeof body.country_code === "string" ? body.country_code.trim().toUpperCase() : undefined,
      news_categories: Array.isArray(body.news_categories) ? body.news_categories : undefined,
      weather_categories: Array.isArray(body.weather_categories) ? body.weather_categories : undefined,
      send_time: typeof body.send_time === "string" ? body.send_time : undefined,
    };

    // Forward to n8n server-side
    try {
      await n8nSignup(payload);
    } catch (n8nErr) {
      console.warn("n8n signup forwarding warning:", n8nErr);
    }

    // Always return an identical generic success response; NEVER return token or verification URL
    return withPrivateCacheHeaders(
      NextResponse.json({
        status: "success",
        success: true,
        message: "If that email address is valid, a verification link has been sent to your inbox.",
      })
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: `Failed to process signup: ${message}` },
        { status: 500 }
      )
    );
  }
}
