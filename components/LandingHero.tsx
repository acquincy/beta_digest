"use client";

import React from "react";
import Link from "next/link";
import { CloudSun, Mail } from "lucide-react";
import { IconTile } from "./primitives/IconTile";
import { DarkButton } from "./primitives/Button";
import { HandDrawnEllipse } from "./HandDrawnEllipse";

export const LandingHero: React.FC = () => {
  return (
    <section
      aria-label="Introduction & Digest Overview"
      className="relative w-full pt-10 min-h-[720px] pb-16 lg:pb-24 overflow-x-clip"
    >
      <div className="w-full flex flex-col lg:flex-row items-start pl-6 lg:pl-[98px] pr-6 lg:pr-0">
        {/* Left Column: 55% width */}
        <div className="w-full lg:w-[55%] flex flex-col pt-4">
          {/* Eyebrow: IconTile 64px (CloudSun) + label "Daily Digest" inline, 16px gap */}
          <div className="flex items-center gap-4">
            <IconTile icon={CloudSun} size={64} radius={20} iconSize={34} />
            <span className="font-display font-[500] text-[22px] leading-none text-[#4B5563]">
              Daily Digest
            </span>
          </div>

          {/* 40px gap */}
          <div className="h-10" />

          {/* H1 "Your Personal Daily News & Weather Digest" (max-width 640px) */}
          <h1
            className="font-display font-[600] text-[38px] leading-[44px] md:text-[52px] md:leading-[60px] text-black max-w-[640px]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Your Personal Daily News &amp; Weather Digest
          </h1>

          {/* 24px gap */}
          <div className="h-6" />

          {/* Subhead "Delivered daily to your inbox" with HandDrawnEllipse around "your inbox" */}
          <p className="font-sans font-[600] text-[20px] leading-[28px] md:text-[24px] md:leading-[32px] text-[#374151]">
            Delivered daily to{" "}
            <HandDrawnEllipse>
              <span className="px-1 text-black font-[600]">your inbox</span>
            </HandDrawnEllipse>
          </p>

          {/* 24px gap */}
          <div className="h-6" />

          {/* Paragraph (max-width 500px) */}
          <p className="font-sans font-[400] text-[18px] leading-[26px] md:text-[22px] md:leading-[28px] text-[var(--text)] text-opacity-80 max-w-[500px]">
            Skip the noisy feeds and weather apps full of ads. Get a simple,
            accurate digest in your inbox every morning. Know exactly what to
            expect before you step outside.
          </p>

          {/* 32px gap */}
          <div className="h-8" />

          {/* DarkButton "Get your daily digest" */}
          <div>
            <Link href="/signup" tabIndex={-1}>
              <DarkButton>Get your daily digest</DarkButton>
            </Link>
          </div>
        </div>

        {/* Right Column: 45% width desktop */}
        <div className="w-full lg:w-[45%] relative mt-12 lg:mt-6">
          {/* Concentric white circles centered behind the message cards */}
          <div
            className="hidden lg:block absolute pointer-events-none"
            style={{
              top: "240px",
              left: "240px",
              width: "0",
              height: "0",
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            <div
              className="absolute rounded-full"
              style={{
                width: "1040px",
                height: "1040px",
                top: "-520px",
                left: "-520px",
                backgroundColor: "rgba(255, 255, 255, 0.18)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "760px",
                height: "760px",
                top: "-380px",
                left: "-380px",
                backgroundColor: "rgba(255, 255, 255, 0.22)",
              }}
            />
          </div>

          {/* Desktop stacked overlapping cards */}
          <div className="hidden lg:block relative min-h-[550px] w-full z-10">
            {/* Card 1 */}
            <div
              className="relative w-[447px] min-h-[320px] rounded-[32px] p-6 transition-all duration-200"
              style={{
                backgroundColor: "rgba(240, 240, 240, 0.78)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "var(--shadow-extrude)",
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white stroke-[2]" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[22px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    INBOX
                  </span>
                </div>
                <span className="font-sans text-[16px] text-[#7A7A7A] tabular-nums">
                  now
                </span>
              </div>

              {/* 16px gap */}
              <div className="h-4" />

              {/* Sender */}
              <div className="font-display font-[600] text-[24px] text-black">
                BetaDigest
              </div>

              {/* Subject */}
              <div className="font-sans font-[600] text-[16px] text-black mt-1">
                Your morning digest · Thu, Oct 8
              </div>

              {/* Preview body */}
              <p className="font-sans font-[400] text-[16px] leading-[24px] text-black mt-2">
                Weather in Seattle: 52°F, partly cloudy. High 58°F / low 45°F. Rain chance 30% this afternoon. UV index 3 (Moderate). Air quality 28 (Good).
              </p>
            </div>

            {/* Card 2: offset ~ +112px right, +228px top, z-index above, width 445px */}
            <div
              className="absolute z-20 w-[445px] rounded-[32px] p-6 transition-all duration-200"
              style={{
                top: "228px",
                left: "112px",
                backgroundColor: "rgba(244, 244, 244, 0.96)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "var(--shadow-extrude)",
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white stroke-[2]" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[22px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    INBOX
                  </span>
                </div>
                <span className="font-sans text-[16px] text-[#7A7A7A] tabular-nums">
                  now
                </span>
              </div>

              {/* 16px gap */}
              <div className="h-4" />

              {/* Subject */}
              <div className="font-display font-[600] text-[20px] text-black">
                Top stories today
              </div>

              {/* Three headline lines each with one-line grey summary */}
              <div className="mt-3 space-y-2.5">
                <div>
                  <div className="font-sans font-[600] text-[15px] leading-snug text-black">
                    Central banks advance unified liquidity framework
                  </div>
                  <div className="font-sans font-[400] text-[13px] text-[#6B6F76] truncate">
                    Updated capital adequacy reserves reduce cross-border transfer friction.
                  </div>
                </div>

                <div>
                  <div className="font-sans font-[600] text-[15px] leading-snug text-black">
                    Offshore clean power generation exceeds autumn benchmark
                  </div>
                  <div className="font-sans font-[400] text-[13px] text-[#6B6F76] truncate">
                    Utility storage clusters produce eighteen percent above projected seasonal totals.
                  </div>
                </div>

                <div>
                  <div className="font-sans font-[600] text-[15px] leading-snug text-black">
                    Metropolitan transit authority deploys automated dispatch
                  </div>
                  <div className="font-sans font-[400] text-[13px] text-[#6B6F76] truncate">
                    Telemetry upgrades across commuter rail lines cut morning transfer delays.
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(0,0,0,0.08)] font-sans font-[500] text-[14px] text-black">
                Read the full digest in your inbox
              </div>
            </div>
          </div>

          {/* Mobile vertical stack */}
          <div className="flex flex-col lg:hidden gap-4 w-full max-w-[447px]">
            {/* Card 1 */}
            <div
              className="w-full rounded-[32px] p-6"
              style={{
                backgroundColor: "rgba(240, 240, 240, 0.92)",
                boxShadow: "var(--shadow-extrude)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white stroke-[2]" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[20px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    INBOX
                  </span>
                </div>
                <span className="font-sans text-[15px] text-[#7A7A7A] tabular-nums">
                  now
                </span>
              </div>
              <div className="font-display font-[600] text-[22px] text-black mt-4">
                BetaDigest
              </div>
              <div className="font-sans font-[600] text-[15px] text-black mt-1">
                Your morning digest · Thu, Oct 8
              </div>
              <p className="font-sans font-[400] text-[15px] leading-[22px] text-black mt-2">
                Weather in Seattle: 52°F, partly cloudy. High 58°F / low 45°F. Rain chance 30% this afternoon. UV index 3 (Moderate). Air quality 28 (Good).
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="w-full rounded-[32px] p-6"
              style={{
                backgroundColor: "rgba(244, 244, 244, 0.96)",
                boxShadow: "var(--shadow-extrude)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white stroke-[2]" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[20px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    INBOX
                  </span>
                </div>
                <span className="font-sans text-[15px] text-[#7A7A7A] tabular-nums">
                  now
                </span>
              </div>
              <div className="font-display font-[600] text-[20px] text-black mt-4">
                Top stories today
              </div>
              <div className="mt-3 space-y-2.5">
                <div>
                  <div className="font-sans font-[600] text-[14px] leading-snug text-black">
                    Central banks advance unified liquidity framework
                  </div>
                  <div className="font-sans font-[400] text-[13px] text-[#6B6F76] truncate">
                    Updated capital adequacy reserves reduce cross-border transfer friction.
                  </div>
                </div>
                <div>
                  <div className="font-sans font-[600] text-[14px] leading-snug text-black">
                    Offshore clean power generation exceeds autumn benchmark
                  </div>
                  <div className="font-sans font-[400] text-[13px] text-[#6B6F76] truncate">
                    Utility storage clusters produce eighteen percent above projected seasonal totals.
                  </div>
                </div>
                <div>
                  <div className="font-sans font-[600] text-[14px] leading-snug text-black">
                    Metropolitan transit authority deploys automated dispatch
                  </div>
                  <div className="font-sans font-[400] text-[13px] text-[#6B6F76] truncate">
                    Telemetry upgrades across commuter rail lines cut morning transfer delays.
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[rgba(0,0,0,0.08)] font-sans font-[500] text-[14px] text-black">
                Read the full digest in your inbox
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
