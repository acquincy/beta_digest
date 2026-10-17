"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { TopLeftLogo } from "@/components/TopLeftLogo";
import { CanvasB } from "@/components/CanvasB";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col pb-16">
      <CanvasB showConcentricCircles={false} />
      <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
        <TopLeftLogo />
      </header>
      <main className="w-full max-w-[640px] mx-auto px-4 md:px-6 flex flex-col items-center justify-center py-16 text-center my-auto">
        <div
          className="w-full bg-white rounded-[32px] p-8 md:p-12 border border-[var(--line)] shadow-sm flex flex-col items-center gap-6"
          style={{ boxShadow: "var(--shadow-slab)" }}
        >
          <div
            className="w-16 h-16 rounded-[20px] flex items-center justify-center"
            style={{ backgroundColor: "var(--lime)" }}
          >
            <AlertTriangle className="w-8 h-8 text-black" aria-hidden="true" />
          </div>

          <div>
            <h1 className="font-display font-[700] text-[26px] md:text-[30px] text-black">
              Unable to load your dashboard
            </h1>
            <p className="font-sans font-[400] text-[15px] text-[#6B6B5A] mt-2 max-w-md mx-auto">
              We encountered a temporary hiccup loading your personalized updates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[48px] px-6 rounded-full font-sans font-[600] text-[14px] text-black transition-colors"
              style={{ backgroundColor: "var(--lime)" }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try again</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[48px] px-6 rounded-full border border-black text-black hover:bg-black/5 font-sans font-[600] text-[14px] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
