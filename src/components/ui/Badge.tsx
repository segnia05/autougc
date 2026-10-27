import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "amber" | "emerald" | "rose" | "neutral" | "outline";
  size?: "sm" | "md";
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-[#E2E9DC] text-[#1F3824] border-[#CBD5C4]",
    amber:
      "bg-[#FDF4E7] text-[#925B00] border-[#E8D4B0]",
    emerald:
      "bg-[#E2E9DC] text-[#1F3824] border-[#CBD5C4]",
    rose:
      "bg-[#FDECEC] text-[#9A2626] border-[#F1C2C2]",
    neutral:
      "bg-[#ECEFE7] text-[#4A544A] border-[#CBD5C4]",
    outline:
      "bg-transparent text-[#4A544A] border-[#CBD5C4]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              variant === "emerald"
                ? "bg-[#1F3824]"
                : variant === "amber"
                ? "bg-amber-500"
                : variant === "rose"
                ? "bg-rose-500"
                : "bg-[#1F3824]"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              variant === "emerald"
                ? "bg-[#1F3824]"
                : variant === "amber"
                ? "bg-amber-600"
                : variant === "rose"
                ? "bg-rose-600"
                : "bg-[#1F3824]"
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
