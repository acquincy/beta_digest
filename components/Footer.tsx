import React from "react";
import Link from "next/link";

export const Footer: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <footer className={`w-full bg-black text-center flex flex-col items-center select-none ${className}`}>
      {/* Feedback notice */}
      <p className="font-sans text-[16px] text-white mb-6">
        Please email{" "}
        <a
          href="mailto:help@betadigest.com"
          className="underline hover:text-[var(--lime)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--lime)]"
        >
          help@betadigest.com
        </a>{" "}
        with any feedback, ideas, or issues.
      </p>

      {/* Row 1: Feature links */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-[16px] text-[#94A3B8] font-sans mb-3">
        <Link href="/signup" className="hover:text-white transition-colors">
          Daily Weather Report
        </Link>
        <Link href="/signup" className="hover:text-white transition-colors">
          Daily News Digest
        </Link>
        <Link href="/signup" className="hover:text-white transition-colors">
          Sports Scores SMS
        </Link>
        <Link href="/signup" className="hover:text-white transition-colors">
          Stock Alerts SMS
        </Link>
        <Link href="/signup" className="hover:text-white transition-colors">
          Daily Horoscope Text
        </Link>
      </div>

      {/* Row 2: Legal links */}
      <div className="flex items-center justify-center gap-6 text-[16px] text-[#94A3B8] font-sans">
        <Link href="/credits" className="hover:text-white transition-colors">
          Terms & Conditions
        </Link>
        <Link href="/credits" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};
