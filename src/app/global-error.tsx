"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AutoUGC Global Critical Exception Captured]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex items-center justify-center p-6 antialiased">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E0D8] shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-display font-semibold text-[#18181B]">
              Application Error
            </h1>
            <p className="text-sm text-[#52525B] leading-relaxed">
              A root layout failure was detected. Our fail-safe circuit breaker has isolated the state
              to protect your data.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#18181B] text-white font-medium text-sm hover:bg-[#27272A] transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
