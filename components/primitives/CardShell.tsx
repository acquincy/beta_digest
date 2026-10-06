import React from "react";
import { clsx } from "clsx";

export interface CardShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "default" | "review";
  className?: string;
}

export const CardShell: React.FC<CardShellProps> = ({
  children,
  footer,
  width = "default",
  className,
}) => {
  const isReview = width === "review";

  return (
    <div
      className={clsx(
        "bg-white mx-auto my-8 relative overflow-hidden transition-all duration-200",
        "w-[calc(100%-32px)] sm:w-full",
        isReview ? "max-w-[1024px]" : "max-w-[768px]",
        // Radius: 40px desktop, 32px mobile
        "rounded-[32px] md:rounded-[40px]",
        // Padding: 48px 48px 0 desktop, 24px 24px 0 mobile
        "p-6 pb-0 md:p-12 md:pb-0",
        // Shadow float for elevated wizard modal feeling
        "shadow-[var(--shadow-float)]",
        className
      )}
    >
      <div className="w-full">{children}</div>

      {footer && (
        <div
          className={clsx(
            "border-t border-[rgba(0,0,0,0.08)] flex items-center justify-between",
            // Mobile: margin 24px -24px 0, padding 16px 24px
            // Desktop: margin 32px -48px 0, padding 24px 48px
            "-mx-6 mt-6 px-6 py-4 md:-mx-12 md:mt-8 md:px-12 md:py-6"
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
