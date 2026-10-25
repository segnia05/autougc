"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--text-secondary)] select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3.5 bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm rounded-lg border border-subtle shadow-tactile transition-all outline-none",
              "focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:bg-[var(--bg-surface-elevated)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightElement && "pr-12",
              error && "border-[var(--accent-rose)] focus:border-[var(--accent-rose)] focus:ring-[var(--accent-rose)]",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[var(--accent-rose)] font-medium mt-0.5">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
