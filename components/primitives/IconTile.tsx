import React from "react";
import { clsx } from "clsx";
import { LucideIcon } from "lucide-react";

export interface GradientIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export const GradientIcon: React.FC<GradientIconProps> = ({
  icon: Icon,
  size = 26,
  className,
}) => {
  return (
    <Icon
      size={size}
      stroke="url(#iconGradient)"
      strokeWidth={1.5}
      className={clsx("shrink-0", className)}
      aria-hidden="true"
    />
  );
};

export interface IconTileProps {
  icon: LucideIcon;
  size?: 48 | 56 | 64 | 80 | 100 | number;
  iconSize?: number;
  radius?: number;
  className?: string;
  badge?: React.ReactNode;
}

export const IconTile: React.FC<IconTileProps> = ({
  icon: Icon,
  size = 48,
  iconSize,
  radius,
  className,
  badge,
}) => {
  let defaultRadius = 14;
  let defaultIconSize = 26;

  if (size === 48) {
    defaultRadius = 14;
    defaultIconSize = 26;
  } else if (size === 56) {
    defaultRadius = 16;
    defaultIconSize = 30;
  } else if (size === 64) {
    defaultRadius = 20;
    defaultIconSize = 34;
  } else if (size === 80) {
    defaultRadius = 24;
    defaultIconSize = 42;
  } else if (size === 100) {
    defaultRadius = 28;
    defaultIconSize = 52;
  }

  const effectiveRadius = radius ?? defaultRadius;
  const effectiveIconSize = iconSize ?? defaultIconSize;

  return (
    <div
      className={clsx(
        "relative bg-white flex items-center justify-center shrink-0 select-none",
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${effectiveRadius}px`,
        boxShadow: "var(--shadow-tile)",
      }}
    >
      <GradientIcon icon={Icon} size={effectiveIconSize} />
      {badge && <div className="absolute top-0 right-0">{badge}</div>}
    </div>
  );
};
