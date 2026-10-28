import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#1F3824] flex items-center justify-center p-6 selection:bg-[#1F3824] selection:text-[#F6F7F2]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#CBD5C4] shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-[#F6F7F2] text-[#1F3824] rounded-full flex items-center justify-center mx-auto border border-[#CBD5C4]">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5A6E5D] bg-[#F6F7F2] px-3 py-1 rounded-full inline-block border border-[#CBD5C4]">
            404 • Resource Not Found
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#1F3824]">
            Page does not exist
          </h1>
          <p className="text-sm text-[#5A6E5D] leading-relaxed">
            The page or asset you are looking for has been moved, archived, or is currently unavailable.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1F3824] text-[#F6F7F2] font-medium text-sm hover:bg-[#162719] transition shadow-sm w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}
