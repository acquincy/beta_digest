import React from "react";
import { clsx } from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  as: Component = "div",
  padding = "md",
  className,
  children,
  ...props
}) => {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <Component
      className={clsx(
        "bg-white border border-[var(--line)] rounded-[24px] transition-colors duration-150",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
