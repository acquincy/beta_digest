import { NextResponse } from "next/server";
import { N8N_ENDPOINTS } from "@/lib/n8n";

export async function GET() {
  try {
    const n8nRes = await fetch(N8N_ENDPOINTS.dashboard, {
      method: "GET",
      next: { revalidate: 60 },
    });

    const data = await n8nRes.json().catch(() => ({}));

    if (!n8nRes.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || `Failed to fetch digest: HTTP ${n8nRes.status}`,
        },
        { status: n8nRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { status: "error", message: `Failed to connect to n8n: ${message}` },
      { status: 502 }
    );
  }
}
