import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Onboarding — BetaDigest",
  description: "Complete your personal digest preferences.",
};

export default async function OnboardingPage() {
  const sessionResult = await getSession();

  if (sessionResult.status === "unauthenticated") {
    redirect("/signup");
  }

  if (sessionResult.status === "invalid") {
    redirect("/api/auth/clear?next=/signup");
  }

  if (sessionResult.status === "error") {
    return (
      <main className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-[32px] shadow-[var(--shadow-float)]">
          <h1 className="text-2xl font-bold font-display text-black mb-3">Service Temporarily Unavailable</h1>
          <p className="text-[var(--text)] mb-6 text-sm">
            We are having trouble connecting to our backend service. Your session is safe. Please refresh in a moment.
          </p>
          <a
            href="/onboarding"
            className="inline-block bg-white/[0.08] hover:bg-white hover:text-black border border-white text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
          >
            Retry
          </a>
        </div>
      </main>
    );
  }

  // Authenticated
  if (sessionResult.session.onboardingCompleted) {
    redirect("/dashboard");
  }

  redirect("/basic-info");
}
