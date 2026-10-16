import React, { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { TopicPreferencesEditor } from "@/components/preferences/TopicPreferencesEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Preferences — BetaDigest",
  description: "Update your daily weather and news topic preferences.",
};

export default async function PreferencesPage() {
  const sessionResult = await getSession();

  if (sessionResult.status === "unauthenticated") {
    redirect("/login");
  }

  if (sessionResult.status === "invalid") {
    redirect("/api/auth/clear?next=/login");
  }

  if (sessionResult.status === "error") {
    return (
      <main className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-[32px] shadow-[var(--shadow-float)]">
          <h1 className="text-2xl font-bold font-display text-black mb-3">Service Temporarily Unavailable</h1>
          <p className="text-[var(--text)] mb-6 text-sm">
            We are having trouble connecting to Beta Digest right now. Your session is active and safe.
          </p>
          <a
            href="/preferences"
            className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-neutral-800"
          >
            Retry
          </a>
        </div>
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-4">
          <div className="w-full max-w-[768px] h-[520px] bg-white rounded-[40px] animate-pulse" />
        </div>
      }
    >
      <TopicPreferencesEditor />
    </Suspense>
  );
}
