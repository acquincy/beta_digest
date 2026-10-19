"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Wifi, Battery } from "lucide-react";
import { TopLeftLogo } from "./TopLeftLogo";
import { DashboardBoard } from "./dashboard";
import {
  MOCKUP_USER_NAME,
  MOCKUP_CITY,
  MOCKUP_COUNTRY,
  MOCKUP_DATE,
  MOCKUP_WEATHER_TOPICS,
  MOCKUP_WEATHER,
  MOCKUP_STORIES,
} from "@/lib/mockup-data";

export const HeroDeviceMockup: React.FC = () => {
  const [laptopScale, setLaptopScale] = useState<number>(0.494);
  const [mobileScale, setMobileScale] = useState<number>(0.476);
  const laptopScreenRef = useRef<HTMLDivElement>(null);
  const mobileScreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLaptopScale = () => {
      if (laptopScreenRef.current) {
        const w = laptopScreenRef.current.clientWidth;
        if (w > 0) {
          setLaptopScale(w / 1020);
        }
      }
    };

    const updateMobileScale = () => {
      if (mobileScreenRef.current) {
        const w = mobileScreenRef.current.clientWidth;
        if (w > 0) {
          setMobileScale(w / 360);
        }
      }
    };

    updateLaptopScale();
    updateMobileScale();

    const ro = new ResizeObserver(() => {
      updateLaptopScale();
      updateMobileScale();
    });

    if (laptopScreenRef.current) ro.observe(laptopScreenRef.current);
    if (mobileScreenRef.current) ro.observe(mobileScreenRef.current);

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-[620px] mx-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Soft Ambient Spotlight behind devices */}
      <div
        className="absolute pointer-events-none -inset-10"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(107, 98, 242, 0.20) 0%, rgba(155, 75, 127, 0.12) 40%, transparent 72%)",
          zIndex: 0,
        }}
      />

      {/* Main Container for Laptop and Handheld Device */}
      <div className="relative z-10 w-full">
        {/* ======================================================== */}
        {/* 1. LAPTOP SCREEN - DESKTOP DASHBOARD SHOWCASE            */}
        {/* ======================================================== */}
        <div className="relative w-full aspect-[4256/2834]">
          {/* Laptop Screen Content Container (aligned to inner bezel cutout) */}
          <div
            ref={laptopScreenRef}
            className="absolute overflow-hidden rounded-t-[4px] sm:rounded-t-[6px] md:rounded-t-[8px] bg-[#0c0d16] text-[#ededed]"
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
              className="absolute pointer-events-none inset-0 opacity-40 z-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(107, 98, 242, 0.25) 0%, transparent 60%)",
              }}
            />

            {/* Scaled Desktop Dashboard Content */}
            <div
              className="relative z-10 origin-top-left"
              style={{
                width: 1020,
                transform: `scale(${laptopScale})`,
              }}
            >
              <div className="px-7 pt-4 pb-2">
                <TopLeftLogo />
              </div>

              <div className="px-7 pb-6">
                <DashboardBoard
                  userName={MOCKUP_USER_NAME}
                  dateLabel={MOCKUP_DATE}
                  weather={MOCKUP_WEATHER}
                  cityName={MOCKUP_CITY}
                  countryName={MOCKUP_COUNTRY}
                  weatherTopics={MOCKUP_WEATHER_TOPICS}
                  stories={MOCKUP_STORIES}
                  weatherLastUpdated="07:00 AM"
                  readOnly={true}
                  forceSingleColumn={false}
                  maxStories={5}
                />
              </div>
            </div>
          </div>

          {/* Sourced Laptop Chassis Overlay (with transparent screen cutout) */}
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
        {/* 2. HANDHELD MOBILE DEVICE SHOWCASE                       */}
        {/* ======================================================== */}
        <div className="absolute -bottom-4 right-0 sm:-bottom-8 sm:-right-2 md:-right-4 w-[34%] sm:w-[32%] max-w-[200px] aspect-[1406/2822] z-20 drop-shadow-[0_22px_45px_rgba(0,0,0,0.85)]">
          {/* Mobile Screen Content Container (aligned to inner bezel cutout) */}
          <div
            ref={mobileScreenRef}
            className="absolute overflow-hidden rounded-[18px] sm:rounded-[26px] bg-[#0c0d16] text-[#ededed] flex flex-col justify-between"
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
            <div className="relative z-10 pt-2 px-3 flex items-center justify-between text-[7px] sm:text-[8px] font-sans text-white/80">
              <span className="font-semibold">07:00</span>
              <div className="flex items-center gap-1 text-white/70">
                <Wifi className="w-2 h-2" />
                <Battery className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Scaled Mobile Dashboard Content */}
            <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
              <div
                className="origin-top-left"
                style={{
                  width: 360,
                  transform: `scale(${mobileScale})`,
                }}
              >
                <div className="p-2.5">
                  <DashboardBoard
                    userName={MOCKUP_USER_NAME}
                    dateLabel={MOCKUP_DATE}
                    weather={MOCKUP_WEATHER}
                    cityName={MOCKUP_CITY}
                    countryName={MOCKUP_COUNTRY}
                    weatherTopics={MOCKUP_WEATHER_TOPICS.slice(0, 2)}
                    stories={MOCKUP_STORIES}
                    weatherLastUpdated="07:00 AM"
                    readOnly={true}
                    forceSingleColumn={true}
                    maxStories={2}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="relative z-10 pb-1.5 flex justify-center">
              <div className="w-10 sm:w-12 h-0.5 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Sourced Handheld Chassis Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 select-none">
            <Image
              src="/mockups/iphone-18-pro.png"
              alt="Mobile device display"
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
