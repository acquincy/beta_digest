"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { CityData, EditorialStory, MetricKey } from "@/lib/types";
import { deriveDigestText } from "@/lib/digest-derivation";
import { SegmentedControl } from "./primitives/SegmentedControl";
import { MessageSquare, Mail } from "lucide-react";

export interface DigestPreviewProps {
  city: CityData;
  activeMetrics: MetricKey[];
  stories: EditorialStory[];
  className?: string;
  showFrameToggle?: boolean;
}

export const DigestPreview: React.FC<DigestPreviewProps> = ({
  city,
  activeMetrics,
  stories,
  className,
  showFrameToggle = true,
}) => {
  const [frameType, setFrameType] = useState<"lockscreen" | "email">("lockscreen");

  // Primary digest text derived from active metrics
  const previewText = deriveDigestText({
    city,
    activeMetrics,
    stories,
  });

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      {showFrameToggle && (
        <div className="flex items-center justify-between gap-3">
          <span className="font-sans font-[600] text-[13px] text-[var(--text-muted-sm)]">
            Preview Format
          </span>
          <SegmentedControl
            value={frameType}
            onChange={(val) => setFrameType(val as "lockscreen" | "email")}
            options={[
              { value: "lockscreen", label: "Lock screen", icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { value: "email", label: "Email frame", icon: <Mail className="w-3.5 h-3.5" /> },
            ]}
          />
        </div>
      )}

      <div className="relative w-full flex items-center justify-center p-2 sm:p-4">
        <article
          aria-label="Daily Digest Live Preview"
          className="relative z-10 w-full max-w-[490px] p-6 sm:p-7 rounded-[32px] border border-[var(--line)] bg-white shadow-sm transition-all duration-200"
        >
          {frameType === "lockscreen" ? (
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ background: "var(--sms-green)" }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white fill-white" aria-hidden="true" />
                  </span>
                  <span className="font-sans text-[11px] font-bold tracking-widest text-[var(--text-muted-sm)] uppercase">
                    MESSAGES
                  </span>
                </div>
                <span className="font-sans text-[11px] tabular-nums text-[var(--text-muted-sm)] font-medium">
                  now
                </span>
              </div>

              <div className="pt-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-black">
                    BetaDigest
                  </span>
                  <span className="font-sans text-[11px] tabular-nums text-[var(--text-muted-sm)]">
                    {city.city}
                  </span>
                </div>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-black font-normal pt-1">
                  {previewText}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-1.5 pb-3 border-b border-[var(--line)] text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted-sm)]">
                    From: <strong className="text-black font-semibold">BetaDigest Dispatch</strong> &lt;dispatch@betadigest.com&gt;
                  </span>
                  <span className="tabular-nums text-[var(--text-muted-sm)] font-medium">
                    06:00 AM
                  </span>
                </div>
                <div className="text-black font-medium">
                  Subject: Today in five minutes · {city.city} ({city.currentTemp}°F)
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-black">
                  DAILY BRIEFING
                </div>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-black font-normal">
                  {previewText}
                </p>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
