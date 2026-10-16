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
        "bg-[#161616] text-[#ededed] rounded-[24px] p-6 border border-white/10 transition-all duration-150 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
