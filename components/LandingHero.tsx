"use client";

import React from "react";
import Link from "next/link";
import { CloudSun, MessageSquare } from "lucide-react";
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

          {/* Subhead "Delivered daily via SMS or email" with HandDrawnEllipse around "SMS or email" */}
          <p className="font-sans font-[600] text-[20px] leading-[28px] md:text-[24px] md:leading-[32px] text-[#374151]">
            Delivered daily via{" "}
            <HandDrawnEllipse>
              <span className="px-1 text-black font-[600]">SMS or email</span>
            </HandDrawnEllipse>
          </p>

          {/* 24px gap */}
          <div className="h-6" />

          {/* Paragraph (max-width 500px) */}
          <p className="font-sans font-[400] text-[18px] leading-[26px] md:text-[22px] md:leading-[28px] text-[var(--text)] text-opacity-80 max-w-[500px]">
            Skip the noisy feeds and weather apps full of ads. Get a simple,
            accurate digest on your phone every morning. Know exactly what to
            expect before you step outside.
          </p>

          {/* 32px gap */}
          <div className="h-8" />

          {/* DarkButton "Get your daily digest" with arrow */}
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
            {/* Radius 520px -> diameter 1040px at 18% opacity */}
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
            {/* Radius 380px -> diameter 760px at 22% opacity */}
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
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--sms-green)" }}
                  >
                    <MessageSquare className="w-4 h-4 text-white fill-white" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[22px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    MESSAGES
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

              {/* Body: full text, unobstructed by Card 2 */}
              <p className="font-sans font-[400] text-[15px] leading-[22px] text-black mt-2">
                Weather in Seattle: Current temperature is 52°F, partly cloudy.
                Today&apos;s high 58°F / low 45°F. Rain chance: 30% this
                afternoon. UV Index: 3 (Moderate). Air Quality: 28 (Good).
                Sunrise: 6:42am / Sunset: 7:15pm
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
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--sms-green)" }}
                  >
                    <MessageSquare className="w-4 h-4 text-white fill-white" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[22px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    MESSAGES
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

              {/* Body */}
              <div className="font-sans font-[400] text-[16px] leading-[24px] text-black mt-2 space-y-0.5">
                <div className="font-semibold">3-Day Forecast:</div>
                <div className="tabular-nums">Thu: 56°F / 44°F, showers</div>
                <div className="tabular-nums">Fri: 60°F / 46°F, partly cloudy</div>
                <div className="tabular-nums">Sat: 63°F / 48°F, sunny</div>
                <div className="tabular-nums">Wind: 8 mph SW</div>
                <div className="tabular-nums">Humidity: 65%</div>
              </div>
            </div>
          </div>

          {/* Mobile vertical stack: no overlap, 16px gap, no clipping */}
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
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--sms-green)" }}
                  >
                    <MessageSquare className="w-4 h-4 text-white fill-white" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[20px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    MESSAGES
                  </span>
                </div>
                <span className="font-sans text-[15px] text-[#7A7A7A] tabular-nums">
                  now
                </span>
              </div>
              <div className="font-display font-[600] text-[22px] text-black mt-4">
                BetaDigest
              </div>
              <p className="font-sans font-[400] text-[15px] leading-[22px] text-black mt-2">
                Weather in Seattle: Current temperature is 52°F, partly cloudy.
                Today&apos;s high 58°F / low 45°F. Rain chance: 30% this
                afternoon. UV Index: 3 (Moderate). Air Quality: 28 (Good).
                Sunrise: 6:42am / Sunset: 7:15pm
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
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--sms-green)" }}
                  >
                    <MessageSquare className="w-4 h-4 text-white fill-white" aria-hidden="true" />
                  </div>
                  <span
                    className="font-sans font-[300] text-[20px] uppercase text-black"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    MESSAGES
                  </span>
                </div>
                <span className="font-sans text-[15px] text-[#7A7A7A] tabular-nums">
                  now
                </span>
              </div>
              <div className="font-display font-[600] text-[22px] text-black mt-4">
                BetaDigest
              </div>
              <div className="font-sans font-[400] text-[15px] leading-[22px] text-black mt-2 space-y-0.5">
                <div className="font-semibold">3-Day Forecast:</div>
                <div className="tabular-nums">Thu: 56°F / 44°F, showers</div>
                <div className="tabular-nums">Fri: 60°F / 46°F, partly cloudy</div>
                <div className="tabular-nums">Sat: 63°F / 48°F, sunny</div>
                <div className="tabular-nums">Wind: 8 mph SW</div>
                <div className="tabular-nums">Humidity: 65%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
