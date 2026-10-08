import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export const Header: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <header className={`w-full pt-10 pl-6 lg:pl-[80px] pb-6 flex items-center ${className}`}>
      <Link
        href="/"
        className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-lg"
        aria-label="BetaDigest Home"
      >
        {/* Mail outline icon: 26px, black 2px stroke, 9px lime dot at top-right */}
        <div className="relative w-[26px] h-[26px] shrink-0" aria-hidden="true">
          <Mail className="w-[26px] h-[26px] text-black stroke-[2]" aria-hidden="true" />
          {/* 9px lime dot at its top-right */}
          <div
            className="absolute -top-[3px] -right-[3px] w-[9px] h-[9px] rounded-full"
            style={{ backgroundColor: "var(--lime)" }}
          />
        </div>

        {/* Wordmark: Red Hat Display 800, 28px, tracking -0.02em, black */}
        <span
          className="font-display font-[800] text-[28px] leading-none text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          BetaDigest
        </span>
      </Link>
    </header>
  );
};
