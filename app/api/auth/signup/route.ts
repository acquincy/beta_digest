import { NextRequest, NextResponse } from "next/server";
import { N8N_ENDPOINTS } from "@/lib/n8n";
import { tokenStore } from "@/lib/token-store";

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

    let data: any = null;
    try {
      // Forward to n8n webhook
      const n8nRes = await fetch(N8N_ENDPOINTS.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      data = await n8nRes.json().catch(() => ({}));
    } catch (n8nErr) {
      console.warn("n8n signup forwarding error:", n8nErr);
    }

    // Generate fallback UUID token if n8n didn't supply one
    const token =
      data?.token ||
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

    const verificationUrl =
      data?.verification_url || `${origin}/verify?token=${token}`;

    // Store token record in resilient token store
    tokenStore.set(token, {
      email,
      name: body.name || "",
      city: body.city || "",
      country_code: body.country_code || "",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({
      status: "success",
      message: "Verification email dispatched.",
      token,
      verification_url: verificationUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { status: "error", message: `Failed to process signup: ${message}` },
      { status: 500 }
    );
  }
}
