import { NextRequest, NextResponse } from "next/server";
import { n8nVerify } from "@/lib/n8n";
import { generateSessionToken, hashToken, BD_SESSION_COOKIE, BD_SESSION_MAX_AGE } from "@/lib/session";
import { validateOrigin, withPrivateCacheHeaders } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return withPrivateCacheHeaders(
      NextResponse.json(
        { success: false, error: "Forbidden: invalid origin" },
        { status: 403 }
      )
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawToken = typeof body.token === "string" ? body.token.trim() : "";

    if (!rawToken) {
      return withPrivateCacheHeaders(
        NextResponse.json(
          { success: false, error: "Verification token is required." },
          { status: 400 }
        )
      );
    }

    // Generate fresh 32-byte session token on server
    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashToken(sessionToken);
    const userAgent = req.headers.get("user-agent") || undefined;

    const n8nRes = await n8nVerify({
      token: rawToken,
      session_token_hash: sessionTokenHash,
      user_agent: userAgent,
    });

    const data = await n8nRes.json().catch(() => ({}));

    if (!n8nRes.ok || !data?.success) {
      return withPrivateCacheHeaders(
        NextResponse.json(
          {
            success: false,
            error: data?.error || data?.message || "Verification link is invalid or has expired.",
          },
          { status: 400 }
        )
      );
    }

    const onboardingCompleted = Boolean(data.onboarding_completed);
    const destination = onboardingCompleted ? "/dashboard" : "/onboarding";

    const response = NextResponse.json({
      success: true,
      onboarding_completed: onboardingCompleted,
      destination,
    });

    // Set persistent session cookie (400 days max-age, sliding on each page request)
    response.cookies.set(BD_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: BD_SESSION_MAX_AGE,
    });

    return withPrivateCacheHeaders(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return withPrivateCacheHeaders(
      NextResponse.json(
        { success: false, error: `Verification failed: ${message}` },
        { status: 500 }
      )
    );
  }
}

export async function GET(req: NextRequest) {
  // Email scanners prefetch GET links — verification must never occur on GET
  const token = req.nextUrl.searchParams.get("token");
  if (token) {
    const verifyPageUrl = new URL("/verify", req.nextUrl.origin);
    verifyPageUrl.searchParams.set("token", token);
    return NextResponse.redirect(verifyPageUrl);
  }
  return withPrivateCacheHeaders(
    NextResponse.json(
      { error: "Method Not Allowed. Verification requires POST." },
      { status: 405 }
    )
  );
}
