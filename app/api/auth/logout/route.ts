import { NextRequest, NextResponse } from "next/server";
import { n8nLogout } from "@/lib/n8n";
import { hashToken, BD_SESSION_COOKIE } from "@/lib/session";
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

  const sessionCookie = req.cookies.get(BD_SESSION_COOKIE)?.value;
  if (sessionCookie) {
    const tokenHash = hashToken(sessionCookie);
    try {
      await n8nLogout(tokenHash);
    } catch (e) {
      console.warn("n8n logout notification failed:", e);
    }
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete(BD_SESSION_COOKIE);
  response.cookies.set(BD_SESSION_COOKIE, "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return withPrivateCacheHeaders(response);
}
