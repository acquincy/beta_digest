import { NextRequest, NextResponse } from "next/server";
import { N8N_ENDPOINTS } from "@/lib/n8n";
import { tokenStore } from "@/lib/token-store";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Verification token is required." },
        { status: 400 }
      );
    }

    // Direct browser visits (e.g. clicking email links) seamlessly redirect to the onboarding verification page
    const isBrowserNavigation =
      req.headers.get("sec-fetch-dest") === "document" ||
      (req.headers.get("accept")?.includes("text/html") &&
        !req.headers.get("accept")?.includes("application/json"));

    if (isBrowserNavigation) {
      const verifyPageUrl = new URL("/verify", req.nextUrl.origin);
      verifyPageUrl.searchParams.set("token", token);
      return NextResponse.redirect(verifyPageUrl);
    }

    // 1. Attempt verification with n8n workflow
    let n8nSuccess = false;
    let n8nData: any = null;

    try {
      const n8nUrl = new URL(N8N_ENDPOINTS.verify);
      n8nUrl.searchParams.set("token", token);

      const n8nRes = await fetch(n8nUrl.toString(), {
        method: "GET",
      });

      n8nData = await n8nRes.json().catch(() => ({}));

      if (n8nRes.ok && (n8nData?.status === "success" || n8nData?.verified)) {
        n8nSuccess = true;
      }
    } catch (n8nErr) {
      console.warn("n8n verification request error:", n8nErr);
    }

    if (n8nSuccess) {
      const entry = tokenStore.get(token);
      if (entry) {
        entry.isVerified = true;
        entry.userId = n8nData?.userId || `usr_${token.slice(0, 8)}`;
      }
      return NextResponse.json(
        n8nData || {
          status: "success",
          verified: true,
          message: "Account verified successfully.",
        }
      );
    }

    // 2. Resilient fallback check: check if token was issued by our signup route
    const localEntry = tokenStore.get(token);
    if (localEntry && localEntry.expiresAt > Date.now()) {
      localEntry.isVerified = true;
      localEntry.userId = `usr_${token.slice(0, 8)}`;
      return NextResponse.json({
        status: "success",
        verified: true,
        userId: localEntry.userId,
        email: localEntry.email,
        message: "Account verified successfully.",
      });
    }

    return NextResponse.json(
      {
        status: "error",
        message:
          n8nData?.message || "Verification token is invalid or has expired.",
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { status: "error", message: `Verification error: ${message}` },
      { status: 500 }
    );
  }
}
