"use client";

import React from "react";
import Image from "next/image";
import {
  Wind,
  Droplets,
  CloudRain,
  Sun,
  Sparkles,
  SlidersHorizontal,
  Wifi,
  Battery,
} from "lucide-react";
import { WeatherWidgetIcon } from "./WeatherWidgetIcon";

export const HeroDeviceMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none">
      {/* Sunrise Dawn Radial Spotlight behind devices */}
      <div
        className="absolute pointer-events-none -inset-10"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(218, 140, 98, 0.28) 0%, rgba(107, 98, 242, 0.16) 40%, transparent 72%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Main Container for MacBook and iPhone 18 */}
      <div className="relative z-10 w-full">
        {/* ======================================================== */}
        {/* 1. MACBOOK PRO 16 - DESKTOP DASHBOARD SHOWCASE          */}
        {/* ======================================================== */}
        <div className="relative w-full aspect-[4256/2834] group">
          {/* MacBook Screen Content Container (aligned to inner bezel cutout) */}
          <div
            className="absolute overflow-hidden rounded-t-[4px] sm:rounded-t-[6px] md:rounded-t-[8px] bg-gradient-to-br from-[#121626] via-[#0d0f1a] to-[#08090f] text-white flex flex-col"
            style={{
              left: "9.375%",
              top: "12.809%",
              width: "81.226%",
              height: "76.606%",
              zIndex: 1,
            }}
          >
            {/* Ambient inner glow */}
            <div
              className="absolute pointer-events-none inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(107, 98, 242, 0.25) 0%, transparent 60%)",
              }}
              aria-hidden="true"
            />

            {/* Laptop Display Top Chrome Bar */}
            <div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 border-b border-white/[0.08] bg-[#0c0d16]/90 backdrop-blur-md">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
                  <Image
                    src="/logo-mark.png"
                    alt="BetaDigest"
                    width={16}
                    height={16}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-display font-semibold text-[9px] sm:text-[11px] tracking-tight text-white/95">
                  BetaDigest
                </span>
                <span className="hidden sm:inline-block font-mono text-[8px] px-1.5 py-0.2 rounded-full bg-white/[0.08] border border-white/[0.08] text-white/70">
                  Daily Briefing
                </span>
              </div>

              {/* Utility Badges */}
              <div className="flex items-center gap-1.5 text-[8px] sm:text-[9.5px]">
                <span className="font-mono text-white/60 hidden sm:inline">
                  Thursday, October 18
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/80">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono">Live</span>
                </span>
              </div>
            </div>

            {/* Dashboard Interior Board */}
            <div className="relative z-10 flex-1 p-2.5 sm:p-3.5 flex flex-col gap-2 sm:gap-2.5 overflow-hidden">
              {/* Header Row: Greeting & Action Buttons */}
              <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-white/[0.08]">
                <div>
                  <div className="font-mono text-[7px] sm:text-[8.5px] uppercase tracking-[0.14em] text-white/60">
                    Daily Edition · Seattle
                  </div>
                  <h3 className="editorial-title text-[14px] sm:text-[18px] md:text-[20px] font-medium text-white leading-tight">
                    Hi, Alex
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[8px] sm:text-[9px] font-medium text-white/85 flex items-center gap-1">
                    <SlidersHorizontal className="w-2.5 h-2.5 text-white/70" />
                    <span className="hidden sm:inline">Preferences</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[8px] sm:text-[9px] font-medium text-white/70">
                    Sign out
                  </span>
                </div>
              </div>

              {/* 2-Column Dashboard Grid: Weather on Left, Top 5 Stories on Right */}
              <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[145px_1fr] gap-2 sm:gap-2.5 flex-1 min-h-0 items-stretch">
                {/* Weather Section (Left Rail - WeatherWidget.org style) */}
                <div className="dark-glass-panel p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[7px] sm:text-[8px] text-white/50 mb-1">
                      <span>CURRENT</span>
                      <span className="text-white/40">SEATTLE</span>
                    </div>

                    {/* Main Temperature Hero */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="p-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                        <WeatherWidgetIcon condition="partly cloudy" size={24} />
                      </div>
                      <div className="text-right">
                        <div className="editorial-title text-[18px] sm:text-[22px] font-medium text-white leading-none tabular-nums">
                          24°C
                        </div>
                        <div className="font-mono text-[7px] sm:text-[8px] text-white/60">
                          H: 26° · L: 16°
                        </div>
                      </div>
                    </div>

                    {/* Atmospheric Parameters Strip */}
                    <div className="grid grid-cols-4 gap-0.5 py-1 px-0.5 bg-white/[0.03] border border-white/[0.06] rounded-md text-center text-[6.5px] sm:text-[7.5px] font-mono text-white/70 mb-1.5">
                      <div>
                        <div className="text-white/40">WIND</div>
                        <div className="font-semibold text-white/90">14k</div>
                      </div>
                      <div className="border-l border-white/[0.06]">
                        <div className="text-white/40">HUM</div>
                        <div className="font-semibold text-white/90">62%</div>
                      </div>
                      <div className="border-l border-white/[0.06]">
                        <div className="text-white/40">RAIN</div>
                        <div className="font-semibold text-white/90">10%</div>
                      </div>
                      <div className="border-l border-white/[0.06]">
                        <div className="text-white/40">UV</div>
                        <div className="font-semibold text-white/90">3</div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Day Outlook Strip */}
                  <div className="pt-1 border-t border-white/[0.06] space-y-0.5 text-[7px] sm:text-[8px]">
                    <div className="flex items-center justify-between text-white/75">
                      <span>Today</span>
                      <WeatherWidgetIcon condition="partly cloudy" size={12} />
                      <span className="font-mono font-medium text-white">24° / 16°C</span>
                    </div>
                    <div className="flex items-center justify-between text-white/75">
                      <span>Fri</span>
                      <WeatherWidgetIcon condition="clear" size={12} />
                      <span className="font-mono font-medium text-white">26° / 17°C</span>
                    </div>
                    <div className="flex items-center justify-between text-white/75">
                      <span>Sat</span>
                      <WeatherWidgetIcon condition="rain" size={12} />
                      <span className="font-mono font-medium text-white">21° / 15°C</span>
                    </div>
                  </div>
                </div>

                {/* Top 5 Stories Section (Right Column) */}
                <div className="dark-glass-panel p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-baseline justify-between mb-1 pb-0.5 border-b border-white/[0.06]">
                    <span className="font-mono text-[7px] sm:text-[8.5px] font-semibold uppercase tracking-wider text-white/70">
                      Your Top 5 Stories
                    </span>
                    <span className="font-mono text-[7px] sm:text-[8px] text-white/45 hidden sm:inline">
                      Curated Daily
                    </span>
                  </div>

                  {/* Story list */}
                  <div className="divide-y divide-white/[0.05] space-y-0.5 sm:space-y-1">
                    {/* Story 1 */}
                    <div className="pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[6.5px] sm:text-[7.5px] px-1 py-0.2 rounded-full bg-white/[0.08] text-white/80 font-medium uppercase tracking-wider">
                          Economy
                        </span>
                        <span className="font-sans font-medium text-[8px] sm:text-[9.5px] text-white/95 truncate">
                          Central banks advance unified liquidity framework
                        </span>
                      </div>
                    </div>

                    {/* Story 2 */}
                    <div className="pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[6.5px] sm:text-[7.5px] px-1 py-0.2 rounded-full bg-white/[0.08] text-white/80 font-medium uppercase tracking-wider">
                          Technology
                        </span>
                        <span className="font-sans font-medium text-[8px] sm:text-[9.5px] text-white/95 truncate">
                          Offshore clean power exceeds seasonal benchmarks
                        </span>
                      </div>
                    </div>

                    {/* Story 3 */}
                    <div className="pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[6.5px] sm:text-[7.5px] px-1 py-0.2 rounded-full bg-white/[0.08] text-white/80 font-medium uppercase tracking-wider">
                          Science
                        </span>
                        <span className="font-sans font-medium text-[8px] sm:text-[9.5px] text-white/95 truncate">
                          Deep-sea telemetry array detects acoustic migration
                        </span>
                      </div>
                    </div>

                    {/* Story 4 */}
                    <div className="pt-0.5 hidden sm:block">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[7.5px] px-1 py-0.2 rounded-full bg-white/[0.08] text-white/80 font-medium uppercase tracking-wider">
                          Health
                        </span>
                        <span className="font-sans font-medium text-[9.5px] text-white/95 truncate">
                          Targeted mRNA therapies show promise in remission
                        </span>
                      </div>
                    </div>

                    {/* Story 5 */}
                    <div className="pt-0.5 hidden sm:block">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[7.5px] px-1 py-0.2 rounded-full bg-white/[0.08] text-white/80 font-medium uppercase tracking-wider">
                          Environment
                        </span>
                        <span className="font-sans font-medium text-[9.5px] text-white/95 truncate">
                          Alpine biosphere restores endangered wetland corridors
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Micro Footer */}
                  <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between text-[7px] sm:text-[8px] text-white/50 font-mono">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#6b62f2]" />
                      <span>5-minute read</span>
                    </span>
                    <span>Delivered at 07:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sourced MacBook Pro Chassis Overlay (with transparent screen cutout) */}
          <div className="absolute inset-0 pointer-events-none z-10 select-none">
            <Image
              src="/mockups/macbook-pro.png"
              alt="MacBook Pro"
              fill
              sizes="(max-width: 768px) 100vw, 620px"
              priority
              className="object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. IPHONE 18 PRO - MOBILE RESPONSIVE SHOWCASE            */}
        {/* ======================================================== */}
        <div className="absolute -bottom-5 -right-2 sm:-bottom-8 sm:-right-4 w-[33%] sm:w-[32%] max-w-[200px] aspect-[1406/2822] z-20 group/device drop-shadow-[0_22px_45px_rgba(0,0,0,0.85)] hover:scale-[1.03] transition-transform duration-300">
          {/* iPhone 18 Screen Content Container (aligned to inner bezel cutout) */}
          <div
            className="absolute overflow-hidden rounded-[18px] sm:rounded-[26px] bg-gradient-to-b from-[#14172a] via-[#0d0f1b] to-[#07080e] text-white flex flex-col justify-between"
            style={{
              left: "7.112%",
              top: "3.543%",
              width: "85.775%",
              height: "92.913%",
              zIndex: 1,
            }}
          >
            {/* Dynamic Island Cutout */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-3 rounded-full bg-black z-30 flex items-center justify-end px-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a24] border border-white/10" />
            </div>

            {/* Top Status Bar */}
            <div className="relative z-10 pt-2 px-2.5 flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-white/80">
              <span className="font-semibold">07:00</span>
              <div className="flex items-center gap-1 text-white/70">
                <Wifi className="w-2 h-2" />
                <Battery className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Mobile Dashboard Body */}
            <div className="relative z-10 p-2 sm:p-2.5 flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
              {/* Mobile Greeting Bar */}
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
                <div className="flex items-center gap-1">
                  <div className="relative w-3 h-3 shrink-0">
                    <Image
                      src="/logo-mark.png"
                      alt="BetaDigest"
                      width={12}
                      height={12}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="editorial-title text-[11px] sm:text-[13px] font-medium text-white leading-none">
                    Hi, Alex
                  </span>
                </div>
                <span className="font-mono text-[6.5px] sm:text-[7.5px] px-1.5 py-0.2 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/70">
                  Seattle
                </span>
              </div>

              {/* Mobile WeatherWidget Card */}
              <div className="dark-glass-panel p-1.5 sm:p-2 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="p-0.5 rounded-md bg-white/[0.05] border border-white/[0.08]">
                      <WeatherWidgetIcon condition="partly cloudy" size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-[8px] sm:text-[9.5px] text-white leading-tight">
                        Partly Cloudy
                      </div>
                      <div className="font-mono text-[6.5px] sm:text-[7.5px] text-white/60">
                        H: 26° · L: 16°
                      </div>
                    </div>
                  </div>
                  <div className="editorial-title text-[16px] sm:text-[19px] font-medium text-white tabular-nums leading-none">
                    24°C
                  </div>
                </div>

                {/* Mobile Weather Metrics */}
                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-white/[0.06] text-[6.5px] sm:text-[7.5px] font-mono text-white/70">
                  <div className="flex items-center gap-0.5">
                    <CloudRain className="w-2 h-2 text-cyan-400" />
                    <span>Rain: 10%</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Droplets className="w-2 h-2 text-sky-400" />
                    <span>Hum: 62%</span>
                  </div>
                </div>
              </div>

              {/* Mobile Stories Feed */}
              <div className="dark-glass-panel p-1.5 sm:p-2 flex-1 flex flex-col justify-between overflow-hidden">
                <div className="font-mono text-[6.5px] sm:text-[7.5px] font-semibold uppercase tracking-wider text-white/60 mb-1">
                  Top Stories
                </div>

                <div className="space-y-1">
                  <div className="flex items-start gap-1">
                    <span className="text-[6px] px-1 py-0.2 rounded bg-white/[0.08] text-white/80 shrink-0 font-medium uppercase">
                      Econ
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-medium text-white/95 leading-tight line-clamp-1">
                      Central banks advance unified liquidity framework
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-[6px] px-1 py-0.2 rounded bg-white/[0.08] text-white/80 shrink-0 font-medium uppercase">
                      Tech
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-medium text-white/95 leading-tight line-clamp-1">
                      Offshore clean power exceeds seasonal benchmarks
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-[6px] px-1 py-0.2 rounded bg-white/[0.08] text-white/80 shrink-0 font-medium uppercase">
                      Sci
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-medium text-white/95 leading-tight line-clamp-1">
                      Deep-sea telemetry array detects migration
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-white/50">
                  <span>5-min briefing</span>
                  <span>07:00 AM</span>
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="relative z-10 pb-1.5 flex justify-center">
              <div className="w-10 sm:w-12 h-0.5 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Sourced iPhone 18 Pro Chassis Overlay (with transparent screen cutout) */}
          <div className="absolute inset-0 pointer-events-none z-10 select-none">
            <Image
              src="/mockups/iphone-18-pro.png"
              alt="iPhone 18 Pro"
              fill
              sizes="(max-width: 768px) 120px, 200px"
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
