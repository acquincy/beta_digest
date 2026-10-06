import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SetUpReportsFlow } from "@/components/wizard/SetUpReportsFlow";

export const metadata: Metadata = {
  title: "Set Up Your Reports — BetaDigest",
  description: "Customize your daily delivery time, topics, and digest preview.",
};

export default function SetUpReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-4">
          <div className="w-full max-w-[768px] h-[520px] bg-white rounded-[40px] animate-pulse" />
        </div>
      }
    >
      <SetUpReportsFlow />
    </Suspense>
  );
}
