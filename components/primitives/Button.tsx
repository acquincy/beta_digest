import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "outline";
  size?: "default" | "cta" | "sm";
  showArrow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      showArrow,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Disabled button spec: bg #222222, text #686868, border hairline, cursor not-allowed
    if (disabled) {
      return (
        <button
          ref={ref}
          disabled
          aria-disabled="true"
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] rounded-full select-none cursor-not-allowed whitespace-nowrap min-w-max",
            "bg-[#1c1c1c] text-[#686868] border border-white/5",
            size === "cta"
              ? "h-[64px] md:h-[72px] px-8 text-[18px] md:text-[20px]"
              : size === "sm"
              ? "h-[40px] px-5 text-[14px]"
              : "h-[52px] px-7 text-[16px]",
            className
          )}
          {...props}
        >
          {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {(rightIcon || showArrow) && (
            <span className="ml-2 shrink-0">
              {rightIcon || <ArrowRight className="w-[18px] h-[18px] text-[#686868]" aria-hidden="true" />}
            </span>
          )}
        </button>
      );
    }

    if (variant === "outline") {
      return (
        <button
          ref={ref}
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] text-[16px] text-[#ededed] bg-white/[0.04] hover:bg-white/[0.09] hover:text-white border border-white/15 rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
            "h-[52px] px-[26px] gap-2 active:scale-[0.98] transition-all duration-150 backdrop-blur-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
            className
          )}
          {...props}
        >
          {leftIcon !== undefined ? (
            leftIcon
          ) : (
            <ArrowLeft className="w-[16px] h-[16px] text-[#ededed] shrink-0" aria-hidden="true" />
          )}
          <span>{children}</span>
          {rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
        </button>
      );
    }

    if (variant === "dark") {
      const isCta = size === "cta";
      const hasArrow = showArrow ?? true;

      return (
        <button
          ref={ref}
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] text-[#ededed] bg-[#161616] hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
            "active:scale-[0.98] transition-all duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.4)] backdrop-blur-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
            isCta
              ? "h-[64px] md:h-[72px] px-8 text-[18px] md:text-[20px]"
              : size === "sm"
              ? "h-[40px] px-5 text-[14px]"
              : "h-[52px] px-[28px] text-[16px]",
            className
          )}
          {...props}
        >
          {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {hasArrow && (
            <span className="ml-2 shrink-0">
              {rightIcon || <ArrowRight className="w-[18px] h-[18px] text-[#ededed]" aria-hidden="true" />}
            </span>
          )}
        </button>
      );
    }

    // PrimaryButton (Snow White pill per Dimension spec: #ffffff bg, #000000 text, 9999px radius)
    const isCta = size === "cta";
    const hasArrow = showArrow ?? true;

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-sans font-[500] text-black bg-white hover:bg-[#eaeaea] rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
          "active:scale-[0.98] transition-all duration-150 shadow-[0_2px_12px_rgba(255,255,255,0.12)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
          isCta
            ? "h-[64px] md:h-[72px] px-8 text-[18px] md:text-[20px]"
            : size === "sm"
            ? "h-[40px] px-5 text-[14px]"
            : "h-[52px] px-[28px] text-[16px]",
          className
        )}
        {...props}
      >
        {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {hasArrow && (
          <span className="ml-2 shrink-0">
            {rightIcon || <ArrowRight className="w-[18px] h-[18px] text-black" aria-hidden="true" />}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export const PrimaryButton = Button;

export const DarkButton: React.FC<ButtonProps> = (props) => (
  <Button variant="dark" {...props} />
);

export const OutlineButton: React.FC<ButtonProps> = (props) => (
  <Button variant="outline" {...props} />
);
