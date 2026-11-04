import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex items-center justify-center p-6 selection:bg-[#D95D39] selection:text-white">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E0D8] shadow-sm p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-[#FAF8F5] text-[#D95D39] rounded-full flex items-center justify-center mx-auto border border-[#E5E0D8]">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B] bg-[#FAF8F5] px-3 py-1 rounded-full inline-block border border-[#E5E0D8]">
            404 • Resource Not Found
          </span>
          <h1 className="text-2xl font-display font-semibold text-[#18181B]">
            Page does not exist
          </h1>
          <p className="text-sm text-[#52525B] leading-relaxed">
            The page or asset you are looking for has been moved, archived, or is currently unavailable.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#18181B] text-white font-medium text-sm hover:bg-[#27272A] transition shadow-sm w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}
