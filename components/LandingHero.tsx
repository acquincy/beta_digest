"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CloudSun,
  Mail,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";
import { DarkButton } from "./primitives/Button";
import { HandDrawnEllipse } from "./HandDrawnEllipse";
import { sendSignInLinkViaApi } from "@/lib/n8n";

export const LandingHero: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInEmail, setSignInEmail] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInSent, setSignInSent] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = signInEmail.trim().toLowerCase();
    if (!email) return;

    setSignInLoading(true);
    setSignInError(null);
    try {
      await sendSignInLinkViaApi(email);
      setSignInSent(true);
    } catch (err: unknown) {
      setSignInError(err instanceof Error ? err.message : "Failed to send link");
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <section
      aria-label="Introduction & Digest Overview"
      className="relative w-full pt-10 md:pt-14 min-h-[720px] pb-16 lg:pb-28 overflow-x-clip"
    >
      <div className="w-full max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between px-6 lg:px-12 gap-12 lg:gap-8">
        {/* Left Column */}
        <div className="w-full lg:w-[52%] flex flex-col pt-2 lg:pt-6">
          {/* Status Announcement Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141418]/80 backdrop-blur-xl border border-white/15 hover:border-white/30 text-xs font-medium text-[#ededed] shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)] mb-6 w-max select-none transition-all duration-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
            <span>The morning digest, in five minutes</span>
            <ArrowRight className="w-3 h-3 text-white/70" aria-hidden="true" />
          </div>

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
                className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-full bg-white text-black font-sans font-[500] text-[16px] hover:bg-[#eaeaea] active:scale-[0.98] transition-all duration-150 shadow-[0_2px_14px_rgba(255,255,255,0.15)] whitespace-nowrap"
              >
                <span>Get your daily digest</span>
                <ArrowRight className="w-4 h-4 text-black" aria-hidden="true" />
              </Link>
              {!showSignIn && (
                <button
                  type="button"
                  onClick={() => setShowSignIn(true)}
                  className="font-sans font-[500] text-[15px] text-white/90 hover:text-white h-[52px] px-6 rounded-full bg-[#141418]/60 backdrop-blur-xl border border-white/20 hover:border-white/35 hover:bg-[#141418]/80 active:scale-[0.98] transition-all duration-150 cursor-pointer inline-flex items-center gap-2 select-none shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                >
                  <span>Sign in on this device</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Inline Sign-in Disclosure Box */}
            {showSignIn && (
              <div className="mt-2 p-5 rounded-[24px] bg-[#161616] border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans font-[600] text-[14px] text-white">
                    Sign in on this device
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignIn(false);
                      setSignInSent(false);
                      setSignInError(null);
                    }}
                    className="text-xs text-white/70 hover:text-white cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
                <p className="font-sans text-[13px] text-white/75 mb-3">
                  Enter your verified email. We&apos;ll send a one-click login link to your inbox.
                </p>
                {signInSent ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Check your email! We sent a sign-in link if an account exists.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSignInSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="flex-1 px-4 py-2.5 rounded-full border border-white/15 bg-[#101010] text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                      disabled={signInLoading}
                    />
                    <button
                      type="submit"
                      disabled={signInLoading || !signInEmail.trim()}
                      className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 disabled:opacity-50 transition-opacity whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {signInLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : null}
                      <span>Send link</span>
                    </button>
                  </form>
                )}
                {signInError && (
                  <p className="text-xs text-rose-400 mt-2">{signInError}</p>
                )}
              </div>
            )}
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
          <div className="relative z-10 w-full max-w-[490px] rounded-[32px] bg-[#141418]/85 backdrop-blur-2xl border border-white/15 hover:border-white/25 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] p-6 sm:p-7 flex flex-col gap-5 transition-all duration-300">
            {/* Dispatch Header Row */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#202020] border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-white stroke-[2]" aria-hidden="true" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#6b62f2]" />
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
