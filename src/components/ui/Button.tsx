"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#18181B] hover:bg-[#27272A] text-white font-semibold shadow-sm",
      secondary:
        "bg-white hover:bg-[#F4F1EA] text-[#18181B] border border-[#E5E0D8] shadow-2xs",
      outline:
        "bg-transparent hover:bg-white text-[#18181B] border border-[#E5E0D8]",
      ghost:
        "bg-transparent hover:bg-black/5 text-[#52525B] hover:text-[#18181B]",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-2xs",
    };

    const sizeStyles = {
      sm: "h-8 px-3.5 text-xs rounded-full gap-1.5",
      md: "h-10 px-5 text-xs uppercase tracking-wider rounded-full gap-2",
      lg: "h-12 px-7 text-xs uppercase tracking-widest rounded-full gap-2.5",
      icon: "h-9 w-9 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading ? "true" : undefined}
        aria-disabled={disabled || isLoading ? "true" : undefined}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
            <span className="sr-only">{loadingText || "Loading, please wait..."}</span>
          </>
        ) : (
          leftIcon && <span aria-hidden="true" className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span aria-hidden="true" className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
