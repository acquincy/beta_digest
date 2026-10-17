import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardView } from "@/components/DashboardView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — BetaDigest",
  description: "Subscriber briefing dashboard: next dispatch countdown, hyperlocal weather, and curated editorial feed.",
};

export default async function DashboardPage() {
  const sessionResult = await getSession();

  if (sessionResult.status === "unauthenticated") {
    redirect("/");
  }

  if (sessionResult.status === "invalid") {
    redirect("/api/auth/clear?next=/");
  }

  if (sessionResult.status === "error") {
    return (
      <main className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-[32px] shadow-[var(--shadow-float)]">
          <h1 className="text-2xl font-bold font-display text-black mb-3">Service Temporarily Unavailable</h1>
          <p className="text-[var(--text)] mb-6 text-sm">
            We are unable to connect to the Beta Digest service right now. Your login session is active and safe.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-neutral-800"
          >
            Refresh Dashboard
          </a>
        </div>
      </main>
    );
  }

  if (sessionResult.status === "authenticated" && !sessionResult.session.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <main className="min-h-screen bg-transparent text-[var(--text)]">
      <DashboardView />
    </main>
  );
}
