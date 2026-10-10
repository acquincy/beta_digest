import { NextRequest, NextResponse } from "next/server";
import { N8N_ENDPOINTS } from "@/lib/n8n";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { status: "error", message: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Determine current app origin for verification URL callback
    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const payload = {
      ...body,
      frontend_url: body.frontend_url || origin,
    };

    // Forward to n8n webhook
    const n8nRes = await fetch(N8N_ENDPOINTS.signup, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await n8nRes.json().catch(() => ({}));

    if (!n8nRes.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || `n8n webhook responded with status ${n8nRes.status}`,
        },
        { status: n8nRes.status }
      );
    }

    const responsePayload =
      data && Object.keys(data).length > 0
        ? data
        : { status: "success", message: "Verification email dispatched." };

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { status: "error", message: `Failed to connect to n8n: ${message}` },
      { status: 502 }
    );
  }
}
