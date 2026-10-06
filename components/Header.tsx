import React from "react";
import Link from "next/link";

export const Header: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <header className={`w-full pt-10 pl-6 lg:pl-[80px] pb-6 flex items-center ${className}`}>
      <Link
        href="/"
        className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-lg"
        aria-label="BetaDigest Home"
      >
        {/* Chat-bubble outline icon: 26px, black 2px stroke, three dots inside, 9px lime dot at top-right */}
        <div className="relative w-[26px] h-[26px] shrink-0" aria-hidden="true">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Bubble outline */}
            <path
              d="M3 5.5C3 4.11929 4.11929 3 5.5 3H20.5C21.8807 3 23 4.11929 23 5.5V17.5C23 18.8807 21.8807 20 20.5 20H8.5L4 23.5V20H5.5"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Three dots inside */}
            <circle cx="8" cy="11.5" r="1.25" fill="#000000" />
            <circle cx="13" cy="11.5" r="1.25" fill="#000000" />
            <circle cx="18" cy="11.5" r="1.25" fill="#000000" />
          </svg>
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
