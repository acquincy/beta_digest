import React from "react";
import { clsx } from "clsx";

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  children,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-[24px] p-6 border transition-all duration-150",
        className
      )}
      style={{
        borderColor: "var(--line)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
