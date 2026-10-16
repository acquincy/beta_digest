import { NextRequest, NextResponse } from "next/server";

/**
 * Validate that state-changing requests originate from the expected domain/origin.
 */
export function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    // If no Origin header (e.g., direct same-origin fetch), verify Sec-Fetch-Site or Host
    const secFetchSite = req.headers.get("sec-fetch-site");
    if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
      return false;
    }
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const host = req.headers.get("host") || req.nextUrl.host;
    // Allow localhost during dev/test and matching host in production
    if (originUrl.host === host) return true;
    if (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1") return true;
    if (originUrl.hostname.endsWith("betadigest.online") || originUrl.hostname.endsWith("vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Add strict no-store cache control headers to private/personalized responses.
 */
export function withPrivateCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
