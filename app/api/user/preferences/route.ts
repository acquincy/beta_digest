import { NextRequest, NextResponse } from "next/server";
import { n8nUpdatePreferences, n8nFetchDashboard } from "@/lib/n8n";
import { hashToken, BD_SESSION_COOKIE } from "@/lib/session";
import { validateOrigin, withPrivateCacheHeaders } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(BD_SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: "Unauthorized: active session required." },
        { status: 401 }
      )
    );
  }

  try {
    const sessionTokenHash = hashToken(sessionCookie);
    const n8nRes = await n8nFetchDashboard(sessionTokenHash);
    const data = await n8nRes.json().catch(() => ({}));

    if (!n8nRes.ok) {
      return withPrivateCacheHeaders(
        NextResponse.json(
          {
            status: "error",
            message: data?.message || `Failed to fetch preferences: HTTP ${n8nRes.status}`,
          },
          { status: n8nRes.status }
        )
      );
    }

    const userData = data?.user || {};
    return withPrivateCacheHeaders(
      NextResponse.json({
        status: "success",
        user: userData,
        preferences: {
          name: userData.name || "",
          city: userData.city || "",
          countryCode: userData.country_code || "",
          newsTopics: Array.isArray(userData.news_categories) ? userData.news_categories : [],
          weatherTopics: Array.isArray(userData.weather_categories) ? userData.weather_categories : [],
          sendTime: userData.send_time || "07:00:00",
        },
      })
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: `Failed to load preferences: ${message}` },
        { status: 500 }
      )
    );
  }
}

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: "Forbidden: invalid origin" },
        { status: 403 }
      )
    );
  }

  const sessionCookie = req.cookies.get(BD_SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: "Unauthorized: active session required." },
        { status: 401 }
      )
    );
  }

  try {
    const sessionTokenHash = hashToken(sessionCookie);
    const body = await req.json().catch(() => ({}));

    let city = typeof body.city === "string" ? body.city.trim() : undefined;
    if (city && (city.length < 2 || city.length > 60)) city = undefined;

    let countryCode = typeof body.country_code === "string" ? body.country_code.trim().toUpperCase() : undefined;
    if (countryCode && !/^[A-Z]{2}$/.test(countryCode)) countryCode = undefined;

    const news = Array.isArray(body.news_categories)
      ? body.news_categories.filter((c: unknown): c is string => typeof c === "string").slice(0, 5)
      : Array.isArray(body.categories)
      ? body.categories.filter((c: unknown): c is string => typeof c === "string").slice(0, 5)
      : undefined;

    const weather = Array.isArray(body.weather_categories)
      ? body.weather_categories.filter((c: unknown): c is string => typeof c === "string").slice(0, 3)
      : undefined;

    let sendTime = typeof body.send_time === "string" ? body.send_time.trim() : undefined;
    if (sendTime && /^\d{1,2}:\d{2}$/.test(sendTime)) {
      sendTime = sendTime.padStart(5, "0") + ":00";
    }

    const n8nRes = await n8nUpdatePreferences({
      session_token_hash: sessionTokenHash,
      city,
      country_code: countryCode,
      news_categories: news,
      weather_categories: weather,
      send_time: sendTime,
    });

    const data = await n8nRes.json().catch(() => ({}));
    if (!n8nRes.ok) {
      return withPrivateCacheHeaders(
        NextResponse.json(
          {
            status: "error",
            message: data?.message || `Failed to update preferences: HTTP ${n8nRes.status}`,
          },
          { status: n8nRes.status }
        )
      );
    }

    return withPrivateCacheHeaders(
      NextResponse.json({
        status: "success",
        success: true,
        message: "Preferences updated successfully.",
        preferences: data?.preferences,
        user: data?.user,
      })
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: `Failed to update preferences: ${message}` },
        { status: 500 }
      )
    );
  }
}
