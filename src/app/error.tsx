"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to console & telemetry
    console.error("[AutoUGC Runtime Error Boundary Captured]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex items-center justify-center p-6 selection:bg-[#D95D39] selection:text-white">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E0D8] shadow-sm p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-100/60 px-3 py-1 rounded-full inline-block">
            Automatic Recovery Active
          </span>
          <h1 className="text-2xl font-display font-semibold text-[#18181B]">
            Something unexpected occurred
          </h1>
          <p className="text-sm text-[#52525B] leading-relaxed">
            The platform encountered an error during this operation. Our automated self-healing
            monitoring has captured the diagnostic trace.
          </p>
        </div>

        {error.digest && (
          <div className="bg-[#FAF8F5] rounded-xl p-3 text-left border border-[#E5E0D8]">
            <p className="text-xs text-[#52525B] font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Incident Digest: <span className="text-[#18181B] font-semibold">{error.digest}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#18181B] text-white font-medium text-sm hover:bg-[#27272A] active:scale-98 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E0D8] text-[#18181B] font-medium text-sm hover:bg-[#FAF8F5] active:scale-98 transition"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
