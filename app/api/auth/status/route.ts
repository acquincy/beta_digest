import { NextRequest, NextResponse } from "next/server";
import { tokenStore } from "@/lib/token-store";
import { N8N_ENDPOINTS } from "@/lib/n8n";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

    // 1. Check local in-memory tokenStore
    if (token) {
      const entry = tokenStore.get(token);
      if (entry && entry.isVerified) {
        return NextResponse.json({
          status: "success",
          verified: true,
          userId: entry.userId || `usr_${token.slice(0, 8)}`,
          email: entry.email,
        });
      }
    }

    if (email) {
      for (const [, entry] of tokenStore.entries()) {
        if (entry.email.toLowerCase() === email && entry.isVerified) {
          return NextResponse.json({
            status: "success",
            verified: true,
            userId: entry.userId || `usr_${entry.email.slice(0, 8)}`,
            email: entry.email,
          });
        }
      }
    }

    // 2. If token is present, we can also check against n8n backend verification
    // Note: GET /auth/verify on n8n actually performs verification if called,
    // so here we only query if the token might already be marked verified.
    return NextResponse.json({
      status: "pending",
      verified: false,
      message: "Awaiting user email verification click.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { status: "error", message: `Status check failed: ${message}` },
      { status: 500 }
    );
  }
}
