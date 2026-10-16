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
        "bg-[#161616] text-[#ededed] border border-white/10 rounded-[24px] transition-colors duration-150 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
