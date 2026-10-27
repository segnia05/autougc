"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
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
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F7F2] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#1F3824] hover:bg-[#162B1B] text-white font-semibold shadow-sm",
      secondary:
        "bg-[#ECEFE7] hover:bg-[#E2E9DC] text-[#1B231B] border border-[#CBD5C4]/70 shadow-xs",
      outline:
        "bg-transparent hover:bg-[#ECEFE7] text-[#1B231B] border border-[#CBD5C4]",
      ghost:
        "bg-transparent hover:bg-[#ECEFE7] text-[#4A544A] hover:text-[#1B231B]",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs",
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
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
