import React from "react";
import { ArrowRight } from "lucide-react";
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
    // Disabled button: reduced opacity, no hover effect, cursor not-allowed
    if (disabled) {
      return (
        <button
          ref={ref}
          disabled
          aria-disabled="true"
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] rounded-full select-none cursor-not-allowed whitespace-nowrap min-w-max transition-all duration-150",
            variant === "outline"
              ? "bg-white/[0.04] text-white/40 border border-white/10 opacity-40 shadow-none"
              : "bg-white text-black opacity-40 shadow-none",
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
              {rightIcon || (
                <ArrowRight className="w-4 h-4 text-black shrink-0" aria-hidden="true" />
              )}
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
            "inline-flex items-center justify-center font-sans font-[500] text-[16px] text-white/90 hover:text-white bg-[#141418]/60 hover:bg-white/[0.08] border border-white/20 hover:border-white rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
            "hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98] transition-all duration-200 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.2)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
            size === "cta"
              ? "h-[64px] md:h-[72px] px-8 text-[18px] md:text-[20px]"
              : size === "sm"
              ? "h-[40px] px-5 text-[14px]"
              : "h-[52px] px-[26px] text-[16px]",
            className
          )}
          {...props}
        >
          {leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
        </button>
      );
    }

    if (variant === "dark") {
      const isCta = size === "cta";

      return (
        <button
          ref={ref}
          className={clsx(
            "inline-flex items-center justify-center font-sans font-[500] text-white/90 hover:text-white bg-[#141418]/80 hover:bg-white/[0.1] border border-white/20 hover:border-white rounded-full select-none cursor-pointer whitespace-nowrap min-w-max",
            "hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98] transition-all duration-200 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.2)]",
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
          {rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
        </button>
      );
    }

    // PrimaryButton: Full white pill with subtle hover lift and arrow nudge
    const isCta = size === "cta";

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-sans font-[500] rounded-full select-none whitespace-nowrap min-w-max group cursor-pointer",
          "bg-white text-black shadow-[0_2px_12px_rgba(255,255,255,0.12)]",
          "hover:bg-[#f5f5f5] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
          "active:translate-y-0 active:scale-[0.98]",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
          isCta
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
            {rightIcon || (
              <ArrowRight
                className="w-4 h-4 text-black shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            )}
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
