import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SignupFlow } from "@/components/SignupFlow";

export const metadata: Metadata = {
  title: "Subscribe — BetaDigest",
  description: "Configure your five-minute daily news and hyperlocal weather briefing.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--text)] flex flex-col justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-[666px] mx-auto px-4 py-20">
            <div className="w-full h-[400px] bg-white rounded-[40px] animate-pulse" />
          </div>
        }
      >
        <SignupFlow />
      </Suspense>
    </main>
  );
}

