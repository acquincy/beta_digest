import { NextRequest, NextResponse } from "next/server";
import { n8nFetchDashboard } from "@/lib/n8n";
import { hashToken, BD_SESSION_COOKIE } from "@/lib/session";
import { withPrivateCacheHeaders } from "@/lib/security";

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
            message: data?.message || `Failed to fetch dashboard: HTTP ${n8nRes.status}`,
          },
          { status: n8nRes.status }
        )
      );
    }

    return withPrivateCacheHeaders(NextResponse.json(data));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: `Failed to connect to dashboard service: ${message}` },
        { status: 502 }
      )
    );
  }
}
