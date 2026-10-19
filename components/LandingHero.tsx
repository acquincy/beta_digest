"use client";

import React from "react";
import Link from "next/link";
import { HandDrawnEllipse } from "./HandDrawnEllipse";
import { HeroDeviceMockup } from "./HeroDeviceMockup";

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

        {/* Right Column: MacBook & iPhone 18 Dashboard Device Showcase */}
        <div className="w-full lg:w-[50%] relative flex justify-center lg:justify-end mt-4 lg:mt-0">
          <HeroDeviceMockup />
        </div>
      </div>
    </section>
  );
};
