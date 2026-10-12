import React, { Suspense } from "react";
import type { Metadata } from "next";
import { VerificationPendingContent } from "./VerificationPendingContent";

export const metadata: Metadata = {
  title: "Verify Your Email — Beta Digest",
  description: "Awaiting email verification confirmation for your Beta Digest account.",
};

export default function VerifyPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-4">
          <div className="w-full max-w-[666px] h-[400px] bg-white rounded-[32px] md:rounded-[40px] animate-pulse" />
        </div>
      }
    >
      <VerificationPendingContent />
    </Suspense>
  );
}
