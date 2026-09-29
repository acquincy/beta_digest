import { NextRequest, NextResponse } from "next/server";
import { UserPreferences } from "@/lib/types";

// In-memory preferences store for current session
let currentPreferences: UserPreferences = {
  name: "Emeka",
  email: "emeka@betadigest.app",
  city: "Port Harcourt",
  latitude: 4.8156,
  longitude: 7.0498,
  topics: ["tech", "ai", "business", "startups"],
  deliveryTime: "07:00",
  emailEnabled: true,
  pushEnabled: true,
};

export async function GET() {
  return NextResponse.json(currentPreferences);
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    currentPreferences = {
      ...currentPreferences,
      ...updates,
    };
    return NextResponse.json({ success: true, preferences: currentPreferences });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update preferences";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
