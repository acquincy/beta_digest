import React, { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SignupFlow } from "@/components/SignupFlow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscribe — BetaDigest",
  description: "Configure your five-minute daily news and hyperlocal weather briefing.",
};

export default async function SignupPage() {
  const sessionResult = await getSession();

  if (sessionResult.status === "authenticated") {
    if (sessionResult.session.onboardingCompleted) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--text)] flex flex-col justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-[666px] mx-auto px-4 py-20">
            <div className="w-full h-[400px] bg-[#141418]/85 border border-white/15 rounded-[40px] animate-pulse" />
          </div>
        }
      >
        <SignupFlow />
      </Suspense>
    </main>
  );
}
