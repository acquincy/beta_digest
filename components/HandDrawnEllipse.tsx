"use client";

import React, { useEffect, useState } from "react";
import { clsx } from "clsx";

export interface HandDrawnEllipseProps {
  children?: React.ReactNode;
  className?: string;
}

export const HandDrawnEllipse: React.FC<HandDrawnEllipseProps> = ({
  children,
  className,
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={clsx("relative inline-block whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 210 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] pointer-events-none select-none overflow-visible z-0"
      >
        <path
          d="M 24 24 C 24 10, 85 4, 155 5 C 192 6, 204 15, 202 27 C 200 39, 172 48, 100 49 C 40 50, 7 45, 6 28 C 5 13, 55 6, 130 5 C 170 4, 196 11, 200 20"
          stroke="var(--lime)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 700,
            strokeDashoffset: animated ? 0 : 700,
            transition: "stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="motion-reduce:!stroke-dashoffset-0 motion-reduce:!transition-none"
        />
      </svg>
    </span>
  );
};
