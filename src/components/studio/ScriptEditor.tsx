"use client";

import React from "react";
import { Sparkles, Zap, MessageSquareQuote } from "lucide-react";

interface ScriptEditorProps {
  hookText: string;
  bodyText: string;
  ctaText: string;
  onHookChange: (val: string) => void;
  onBodyChange: (val: string) => void;
  onCtaChange: (val: string) => void;
  estimatedDuration: number;
}

const HOOK_PRESETS = [
  {
    name: "Relatable Confession",
    hook: "I love when someone responds 'Thanks for the detailed explanation!'... when all I did was feed it into WriteHuman.",
  },
  {
    name: "Pattern Interrupt",
    hook: "Stop coding under harsh fluorescent lights in 2026.",
  },
  {
    name: "Curiosity Gap",
    hook: "I tested 7 productivity workflows this month, but only this one stayed.",
  },
  {
    name: "Pain Agitation",
    hook: "If your eyes feel fatigued after 2 hours of screen time, you're making this mistake.",
  },
  {
    name: "Founder Proof",
    hook: "Over 1,400 founders quietly switched to this automated setup last week.",
  },
];

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  hookText,
  bodyText,
  ctaText,
  onHookChange,
  onBodyChange,
  onCtaChange,
  estimatedDuration,
}) => {
  const totalWords = (hookText + " " + bodyText + " " + ctaText).trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5 p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs text-[#18181B]">
      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-[#D95D39]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#18181B]">
            Script Copy & Kinetic Pacing
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#FFF2ED] text-[#D95D39]">
            {totalWords} words
          </span>
          <span className="text-xs font-mono text-[#8E8B85]">
            ~{estimatedDuration.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Quick Viral Hook Presets */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-[#52525B] flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#D95D39]" aria-hidden="true" /> One-Click Hook Templates:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="One-Click Hook Templates">
          {HOOK_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onHookChange(preset.hook)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] hover:bg-[#FFF2ED] hover:border-[#D95D39] text-[#18181B] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hook Section (0-3s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="script-hook-input" className="font-bold text-[#D95D39] uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Zap className="h-3 w-3" aria-hidden="true" />
            Hook (0:00 - 0:03)
          </label>
          <span className="text-[11px] text-[#8E8B85]">First 3-second thumb stopper</span>
        </div>
        <textarea
          id="script-hook-input"
          value={hookText}
          onChange={(e) => onHookChange(e.target.value)}
          rows={2}
          aria-label="Hook (0:00 - 0:03) First 3-second thumb stopper"
          className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-sm text-[#18181B] focus:border-[#D95D39] focus:bg-white focus:ring-1 focus:ring-[#D95D39]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] outline-none resize-none transition-all leading-snug font-medium"
          placeholder="Stop doing X in 2026..."
        />
      </div>

      {/* Body Section (3-11s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="script-body-input" className="font-bold text-[#52525B] uppercase tracking-wider text-[11px]">
            Body (0:03 - 0:11)
          </label>
          <span className="text-[11px] text-[#8E8B85]">Problem, Demo & Solution</span>
        </div>
        <textarea
          id="script-body-input"
          value={bodyText}
          onChange={(e) => onBodyChange(e.target.value)}
          rows={3}
          aria-label="Body (0:03 - 0:11) Problem, Demo and Solution"
          className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-sm text-[#18181B] focus:border-[#D95D39] focus:bg-white focus:ring-1 focus:ring-[#D95D39]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] outline-none resize-none transition-all leading-snug font-medium"
          placeholder="Here is why current solutions fail and how our tool automates it..."
        />
      </div>

      {/* Call to Action Section (11-15s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="script-cta-input" className="font-bold text-[#52525B] uppercase tracking-wider text-[11px]">
            Call to Action (0:11 - 0:15)
          </label>
          <span className="text-[11px] text-[#8E8B85]">Offer & Conversion Trigger</span>
        </div>
        <textarea
          id="script-cta-input"
          value={ctaText}
          onChange={(e) => onCtaChange(e.target.value)}
          rows={2}
          aria-label="Call to Action (0:11 - 0:15) Offer and Conversion Trigger"
          className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-sm text-[#18181B] focus:border-[#D95D39] focus:bg-white focus:ring-1 focus:ring-[#D95D39]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] outline-none resize-none transition-all leading-snug font-medium"
          placeholder="Click the link below and try it today..."
        />
      </div>
    </div>
  );
};
