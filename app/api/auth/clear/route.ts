import { NextRequest, NextResponse } from "next/server";
import { BD_SESSION_COOKIE } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const nextParam = req.nextUrl.searchParams.get("next") || "/";
  // Safe redirect validation: must start with / and not //
  const safeNext = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";
  const redirectUrl = new URL(safeNext, req.nextUrl.origin);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete(BD_SESSION_COOKIE);
  response.cookies.set(BD_SESSION_COOKIE, "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
