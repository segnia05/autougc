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
    <div className="min-h-screen bg-[#F6F7F2] text-[#1F3824] flex items-center justify-center p-6 selection:bg-[#1F3824] selection:text-[#F6F7F2]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#CBD5C4] shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-100/60 px-3 py-1 rounded-full inline-block">
            Automatic Recovery Active
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#1F3824]">
            Something unexpected occurred
          </h1>
          <p className="text-sm text-[#5A6E5D] leading-relaxed">
            The platform encountered an error during this operation. Our automated self-healing
            monitoring has captured the diagnostic trace.
          </p>
        </div>

        {error.digest && (
          <div className="bg-[#F6F7F2] rounded-lg p-3 text-left border border-[#CBD5C4]">
            <p className="text-xs text-[#5A6E5D] font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Incident Digest: <span className="text-[#1F3824] font-semibold">{error.digest}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1F3824] text-[#F6F7F2] font-medium text-sm hover:bg-[#162719] active:scale-98 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#CBD5C4] text-[#1F3824] font-medium text-sm hover:bg-[#F6F7F2] active:scale-98 transition"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
