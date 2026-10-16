import React from "react";
import Link from "next/link";

export const Footer: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <footer
      className={`w-full max-w-[1120px] mx-auto text-center flex flex-col items-center select-none pt-12 pb-16 px-6 border-t border-white/10 ${className}`}
    >
      {/* Feedback notice */}
      <p className="font-sans text-[15px] text-[#c2c2c2] mb-6">
        Please email{" "}
        <a
          href="mailto:help@betadigest.com"
          className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          help@betadigest.com
        </a>{" "}
        with any feedback, ideas, or issues.
      </p>

      {/* Row 1: Feature links */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] text-[#8E9096] font-sans mb-3">
        <Link href="/signup" className="hover:text-white transition-colors">
          Daily Weather Digest
        </Link>
        <Link href="/signup" className="hover:text-white transition-colors">
          Daily News Digest
        </Link>
      </div>

      {/* Row 2: Legal links */}
      <div className="flex items-center justify-center gap-6 text-[14px] text-[#8E9096] font-sans mb-6">
        <Link href="/credits" className="hover:text-white transition-colors">
          Terms &amp; Conditions
        </Link>
        <Link href="/credits" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
      </div>

      <div className="text-xs text-[#686868] font-sans">
        BetaDigest · The day, in five minutes.
      </div>
    </footer>
  );
};
