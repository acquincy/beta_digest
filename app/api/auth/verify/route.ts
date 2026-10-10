import { NextRequest, NextResponse } from "next/server";
import { N8N_ENDPOINTS } from "@/lib/n8n";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Verification token is required." },
        { status: 400 }
      );
    }

    const n8nUrl = new URL(N8N_ENDPOINTS.verify);
    n8nUrl.searchParams.set("token", token);

    const n8nRes = await fetch(n8nUrl.toString(), {
      method: "GET",
    });

    const data = await n8nRes.json().catch(() => ({}));

    if (!n8nRes.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Verification token is invalid or has expired.",
        },
        { status: n8nRes.status }
      );
    }

    const responsePayload =
      data && Object.keys(data).length > 0
        ? data
        : { status: "success", verified: true, message: "Account verified successfully." };

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { status: "error", message: `Failed to connect to n8n: ${message}` },
      { status: 502 }
    );
  }
}
