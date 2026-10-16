import { NextResponse, type NextRequest } from "next/server";

const BD_SESSION_COOKIE = "bd_session";
const BD_SESSION_MAX_AGE = 400 * 24 * 60 * 60; // 400 days

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(BD_SESSION_COOKIE)?.value;
  const response = NextResponse.next();

  // If a session cookie is present, refresh its Max-Age without calling n8n
  if (sessionToken && sessionToken.trim().length > 0) {
    response.cookies.set(BD_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: BD_SESSION_MAX_AGE,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled independently)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, fonts
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
