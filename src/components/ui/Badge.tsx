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
      "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border-subtle",
    amber:
      "bg-amber-500/10 text-[var(--accent-primary)] border-amber-500/25",
    emerald:
      "bg-emerald-500/10 text-[var(--accent-emerald)] border-emerald-500/25",
    rose:
      "bg-rose-500/10 text-[var(--accent-rose)] border-rose-500/25",
    neutral:
      "bg-zinc-800 text-[var(--text-secondary)] border-zinc-700",
    outline:
      "bg-transparent text-[var(--text-secondary)] border-prominent",
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
                ? "bg-emerald-400"
                : variant === "amber"
                ? "bg-amber-400"
                : "bg-white"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              variant === "emerald"
                ? "bg-[var(--accent-emerald)]"
                : variant === "amber"
                ? "bg-[var(--accent-primary)]"
                : "bg-white"
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
