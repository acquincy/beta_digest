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
        "bg-[#141418]/85 border border-white/15 text-[#ededed] mx-auto my-8 relative transition-all duration-200 backdrop-blur-2xl",
        "w-[calc(100%-32px)] sm:w-full",
        isReview ? "max-w-[620px]" : "max-w-[768px]",
        // Radius: 40px desktop, 32px mobile
        "rounded-[32px] md:rounded-[40px]",
        // Padding: 48px 48px 0 desktop, 24px 24px 0 mobile
        "p-6 pb-0 md:p-12 md:pb-0",
        // Elevated shadow and top specular highlight
        "shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
        className
      )}
    >
      <div className="w-full">{children}</div>

      {footer && (
        <div
          className={clsx(
            "sticky bottom-0 z-20 bg-[#141418]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-between rounded-b-[32px] md:rounded-b-[40px]",
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
