"use client";

import React from "react";
import { clsx } from "clsx";
import { CityWeatherData, EditorialStory, WeatherTopicId } from "@/lib/types";
import { deriveDigestText } from "@/lib/digest-derivation";
import { Mail } from "lucide-react";

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
          className="relative z-10 w-full max-w-[490px] p-6 sm:p-7 rounded-[32px] border border-white/10 bg-[#161616] text-[#ededed] shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-200"
        >
          <div className="flex flex-col gap-1.5 pb-3 border-b border-white/10 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="text-[#8E9096] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                From: <strong className="text-white font-semibold">BetaDigest</strong> &lt;dispatch@betadigest.com&gt;
              </span>
              <span className="tabular-nums text-[#8E9096] font-medium">
                07:00 AM
              </span>
            </div>
            <div className="text-white font-medium">
              Subject: Your morning digest · {city.city} ({city.currentTemp}{city.tempUnit})
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#686868]">
              DAILY DIGEST
            </div>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-[#ededed] font-normal whitespace-pre-wrap">
              {previewText}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
