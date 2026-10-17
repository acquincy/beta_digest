"use client";

import React from "react";
import { clsx } from "clsx";
import { CityWeatherData, EditorialStory, WeatherTopicId } from "@/lib/types";
import { deriveDigestText } from "@/lib/digest-derivation";
import Image from "next/image";

export interface DigestPreviewProps {
  city: CityWeatherData;
  weatherTopics: WeatherTopicId[];
  stories: EditorialStory[];
  className?: string;
}

export const DigestPreview: React.FC<DigestPreviewProps> = ({
  city,
  weatherTopics,
  stories,
  className,
}) => {
  const previewText = deriveDigestText({
    city,
    weatherTopics,
    stories,
  });

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className="relative w-full flex items-center justify-center p-2 sm:p-4">
        <article
          aria-label="Email Digest Preview"
          className="relative z-10 w-full max-w-[490px] p-6 sm:p-7 rounded-[32px] border border-white/15 hover:border-white/40 bg-[#141418]/85 hover:bg-white/[0.06] text-[#ededed] shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:shadow-[0_28px_72px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-200"
        >
          <div className="flex flex-col gap-1.5 pb-3 border-b border-white/10 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="text-white/70 flex items-center gap-1.5">
                <Image src="/logo-mark.png" alt="BetaDigest" width={16} height={16} className="w-3.5 h-3.5 object-contain" />
                From: <strong className="text-white font-semibold">BetaDigest</strong> &lt;dispatch@betadigest.com&gt;
              </span>
              <span className="tabular-nums text-white/70 font-medium">
                07:00 AM
              </span>
            </div>
            <div className="text-white font-medium">
              Subject: Your morning digest · {city.city} ({city.currentTemp}{city.tempUnit})
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-wider text-white/60">
              DAILY DIGEST
            </div>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-white/80 font-normal whitespace-pre-wrap">
              {previewText}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
