import { NextRequest, NextResponse } from "next/server";
import { N8N_ENDPOINTS } from "@/lib/n8n";
import { tokenStore } from "@/lib/token-store";
import { sendVerificationEmail } from "@/lib/email";

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
    const configuredAppUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "https://betadigest.online"
    ).replace(/\/+$/, "");

    const requestOrigin = req.headers.get("origin") || req.nextUrl.origin;
    // Prefer non-localhost origin or configured public appUrl so email links work everywhere
    const effectiveOrigin =
      requestOrigin &&
      !requestOrigin.includes("localhost") &&
      !requestOrigin.includes("127.0.0.1")
        ? requestOrigin
        : !configuredAppUrl.includes("localhost")
        ? configuredAppUrl
        : requestOrigin || "https://betadigest.online";

    const payload = {
      ...body,
      frontend_url:
        body.frontend_url &&
        !body.frontend_url.includes("localhost") &&
        !body.frontend_url.includes("127.0.0.1")
          ? body.frontend_url
          : effectiveOrigin,
    };

    let data: any = null;
    let n8nSuccess = false;
    try {
      // Forward to n8n webhook
      const n8nRes = await fetch(N8N_ENDPOINTS.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      data = await n8nRes.json().catch(() => ({}));
      if (n8nRes.ok && data?.status === "success") {
        n8nSuccess = true;
      }
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

    let verificationUrl = data?.verification_url;
    if (
      !verificationUrl ||
      verificationUrl.includes("localhost") ||
      verificationUrl.includes("127.0.0.1")
    ) {
      verificationUrl = `${effectiveOrigin}/verify?token=${token}`;
    } else if (verificationUrl.includes("/api/auth/verify")) {
      verificationUrl = verificationUrl.replace("/api/auth/verify", "/verify");
    }

    // Store token record in resilient token store
    tokenStore.set(token, {
      email,
      name: body.name || "",
      city: body.city || "",
      country_code: body.country_code || "",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // If n8n forwarding was unsuccessful or unavailable, ensure email is sent via Resend
    if (!n8nSuccess) {
      await sendVerificationEmail({
        to: email,
        name: body.name || "",
        verificationUrl,
      }).catch((e) => console.warn("Fallback direct Resend dispatch:", e));
    }

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
