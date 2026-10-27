"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Soft Organic Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B231B]/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          "relative w-full max-h-[92vh] flex flex-col bg-white border border-[#CBD5C4] rounded-3xl shadow-2xl p-6 text-[#1B231B] z-10 animate-in zoom-in-95 duration-200 overflow-hidden",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        <div className="flex items-start justify-between pb-3 shrink-0 border-b border-[#CBD5C4]/40">
          <div className="flex flex-col gap-1 pr-4">
            {title && (
              <h3 className="text-lg font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B]">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[#4A544A]">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#717E6C] hover:text-[#1B231B] hover:bg-[#ECEFE7] transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-4">{children}</div>
      </div>
    </div>
  );
}
