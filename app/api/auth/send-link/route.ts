import { NextRequest, NextResponse } from "next/server";
import { n8nSendLink } from "@/lib/n8n";
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

    try {
      await n8nSendLink(rawEmail);
    } catch (n8nErr) {
      console.warn("n8n send-link forwarding warning:", n8nErr);
    }

    return withPrivateCacheHeaders(
      NextResponse.json({
        status: "success",
        success: true,
        message: "If that email is registered, a sign-in link has been dispatched to your inbox.",
      })
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return withPrivateCacheHeaders(
      NextResponse.json(
        { status: "error", message: `Failed to process sign-in link: ${message}` },
        { status: 500 }
      )
    );
  }
}
