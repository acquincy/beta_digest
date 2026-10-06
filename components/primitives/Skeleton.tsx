import React from "react";
import { clsx } from "clsx";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variantStyles = {
    text: "h-4 rounded-md my-1",
    rectangular: "rounded-xl",
    circular: "rounded-full shrink-0",
  };

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "bg-[#E8E8E8] animate-pulse",
        variantStyles[variant],
        className
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...props}
    />
  );
};
