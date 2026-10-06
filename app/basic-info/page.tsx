import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BasicInfoFlow } from "@/components/BasicInfoFlow";

export const metadata: Metadata = {
  title: "Your Basic Information — BetaDigest",
  description: "Set your location, name, and delivery preferences for BetaDigest.",
};

export default function BasicInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-4">
          <div className="w-full max-w-[768px] h-[480px] bg-white rounded-[40px] animate-pulse" />
        </div>
      }
    >
      <BasicInfoFlow />
    </Suspense>
  );
}
