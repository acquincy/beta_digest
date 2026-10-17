"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CloudSun,
  Mail,
  Sparkles,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";
import { HandDrawnEllipse } from "./HandDrawnEllipse";

export const LandingHero: React.FC = () => {

  return (
    <section
      aria-label="Introduction & Digest Overview"
      className="relative w-full pt-10 md:pt-14 min-h-[720px] pb-16 lg:pb-28 overflow-x-clip"
    >
      <div className="w-full max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between px-6 lg:px-12 gap-12 lg:gap-8">
        {/* Left Column */}
        <div className="w-full lg:w-[52%] flex flex-col pt-2 lg:pt-6">
          {/* H1 "Your Personal Daily News & Weather Digest" */}
          <h1
            className="font-display font-[700] text-[38px] sm:text-[50px] lg:text-[58px] leading-[1.06] tracking-[-0.035em] bg-clip-text text-transparent bg-gradient-to-b from-white via-[#f4f4f6] to-white/70"
          >
            Your Personal Daily News &amp; Weather Digest
          </h1>

          {/* Subhead with HandDrawnEllipse */}
          <p className="font-sans font-[500] text-[20px] sm:text-[22px] md:text-[24px] leading-[30px] md:leading-[34px] text-white/85 mt-5">
            Delivered daily to{" "}
            <HandDrawnEllipse>
              <span className="px-1 text-white font-[600]">your inbox</span>
            </HandDrawnEllipse>
          </p>

          {/* Concise Supporting Copy */}
          <p className="font-sans font-[400] text-[16px] md:text-[18px] leading-[26px] md:leading-[28px] text-white/75 max-w-[500px] mt-4">
            Skip the noisy feeds and weather apps full of ads. Get a simple,
            accurate digest in your inbox every morning. Know exactly what to
            expect before you step outside.
          </p>

          {/* CTA & Returning User Sign-in */}
          <div className="flex flex-col gap-4 max-w-[520px] mt-8">
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white text-white font-sans font-[500] text-[16px] hover:bg-white hover:text-black hover:border-white active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.25)] select-none whitespace-nowrap cursor-pointer"
              >
                <span>Get your Beta Digest</span>
              </Link>
              <Link
                href="/login"
                className="font-sans font-[500] text-[16px] text-white/90 hover:text-white h-[52px] px-7 rounded-full bg-[#141418]/60 hover:bg-white/[0.08] backdrop-blur-xl border border-white/20 hover:border-white active:scale-[0.98] transition-all duration-150 cursor-pointer inline-flex items-center justify-center select-none shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_14px_rgba(255,255,255,0.15)] whitespace-nowrap"
              >
                <span>Sign in</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Visually Compelling Product Preview */}
        <div className="w-full lg:w-[46%] relative flex justify-center lg:justify-end">
          {/* Sunrise Dawn Radial Spotlight behind the preview */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "480px",
              height: "480px",
              top: "-40px",
              right: "-20px",
              background: "radial-gradient(circle, rgba(218, 140, 98, 0.22) 0%, rgba(107, 98, 242, 0.10) 45%, transparent 70%)",
              zIndex: 0,
            }}
            aria-hidden="true"
          />

          {/* Product Preview Card */}
          <div className="relative z-10 w-full max-w-[490px] rounded-[32px] bg-[#141418]/85 hover:bg-white/[0.06] backdrop-blur-2xl border border-white/15 hover:border-white/40 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:shadow-[0_28px_72px_rgba(0,0,0,0.55),0_0_24px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.25)] p-6 sm:p-7 flex flex-col gap-5 transition-all duration-300">
            {/* Dispatch Header Row */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#181d30] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <Image
                    src="/logo-mark.png"
                    alt="BetaDigest"
                    width={22}
                    height={22}
                    className="w-[22px] h-[22px] object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-semibold text-[15px] text-white">
                      BetaDigest
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                      Daily Dispatch
                    </span>
                  </div>
                  <span className="font-sans text-[12px] text-white/70">
                    dispatch@betadigest.com · 07:00 AM
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium text-white/80 tabular-nums">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b62f2] animate-pulse" />
                now
              </span>
            </div>

            {/* Subject Line */}
            <div className="font-display font-[500] text-[18px] text-white tracking-tight -mt-1">
              Your morning digest · Seattle (52°F, Partly Cloudy)
            </div>

            {/* Weather Module Preview Card */}
            <div className="rounded-[22px] bg-gradient-to-b from-white/[0.045] to-white/[0.02] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] p-4 sm:p-5 flex flex-col gap-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                    <CloudSun className="w-6 h-6 text-[#ededed]" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-[15px] text-white">
                      Seattle, WA
                    </div>
                    <div className="font-sans text-[12px] text-white/70">
                      Partly cloudy · High 58° / Low 45°
                    </div>
                  </div>
                </div>
                <div className="font-display font-[600] text-[32px] leading-none text-white tabular-nums">
                  52°<span className="text-[18px] font-[400] text-white/70">F</span>
                </div>
              </div>

              {/* Weather Metrics Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-white/80 hover:bg-white/[0.08] transition-colors">
                  <Droplets className="w-3 h-3 text-[#6b62f2]" />
                  <span>Rain: 30% afternoon</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-white/80 hover:bg-white/[0.08] transition-colors">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>UV Index: 3 (Mod)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-white/80 hover:bg-white/[0.08] transition-colors">
                  <Wind className="w-3 h-3 text-emerald-400" />
                  <span>Air Quality: 28 (Good)</span>
                </div>
              </div>
            </div>

            {/* News Module Preview Section */}
            <div className="flex flex-col gap-2.5">
              <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-white/60">
                TOP 5 ESSENTIAL STORIES
              </div>

              {/* Story 1 */}
              <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-150">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white">
                    Economy
                  </span>
                  <span className="font-sans font-semibold text-[13px] text-white leading-snug">
                    Central banks advance unified liquidity framework
                  </span>
                </div>
                <p className="font-sans text-[12px] text-white/70 leading-relaxed line-clamp-1">
                  Updated capital adequacy reserves reduce cross-border transfer friction.
                </p>
              </div>

              {/* Story 2 */}
              <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-150">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white">
                    Technology
                  </span>
                  <span className="font-sans font-semibold text-[13px] text-white leading-snug">
                    Offshore clean power exceeds seasonal benchmarks
                  </span>
                </div>
                <p className="font-sans text-[12px] text-white/70 leading-relaxed line-clamp-1">
                  Utility storage clusters produce eighteen percent above projected autumn totals.
                </p>
              </div>

              {/* Story 3 */}
              <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-150">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white">
                    Transit
                  </span>
                  <span className="font-sans font-semibold text-[13px] text-white leading-snug">
                    Metropolitan rail deploys automated dispatch
                  </span>
                </div>
                <p className="font-sans text-[12px] text-white/70 leading-relaxed line-clamp-1">
                  Telemetry upgrades across commuter rail lines cut morning transfer delays.
                </p>
              </div>
            </div>

            {/* Footer Summary Strip */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[12px] text-white/70">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6b62f2]" />
                <span>5-minute read</span>
              </span>
              <span>Delivered at your chosen hour</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
