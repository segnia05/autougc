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
    name: "Relatable Confession (video123)",
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
    <div className="flex flex-col gap-5 p-6 rounded-3xl bg-white border border-[#CBD5C4]/70 shadow-sm text-[#1B231B]">
      <div className="flex items-center justify-between border-b border-[#CBD5C4]/50 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-[#1F3824]" />
          <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
            Script copy & kinetic pacing
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
            {totalWords} words
          </span>
          <span className="text-xs font-mono text-[#717E6C]">
            ~{estimatedDuration.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Quick Viral Hook Presets */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-[#4A544A] flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#1F3824]" /> One-Click Hook Templates:
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {HOOK_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onHookChange(preset.hook)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#F6F7F2] border border-[#CBD5C4]/80 hover:bg-[#E2E9DC] hover:border-[#1F3824] text-[#1B231B] transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hook Section (0-3s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-[#1F3824] uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Hook (0:00 - 0:03)
          </label>
          <span className="text-[11px] text-[#717E6C]">First 3-second thumb stopper</span>
        </div>
        <textarea
          value={hookText}
          onChange={(e) => onHookChange(e.target.value)}
          rows={2}
          className="w-full p-3.5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4] text-sm text-[#1B231B] focus:border-[#1F3824] focus:bg-white focus:ring-1 focus:ring-[#1F3824]/20 outline-none resize-none transition-all leading-snug font-medium"
          placeholder="Stop doing X in 2026..."
        />
      </div>

      {/* Body Section (3-11s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-[#4A544A] uppercase tracking-wider text-[11px]">
            Body (0:03 - 0:11)
          </label>
          <span className="text-[11px] text-[#717E6C]">Problem, Demo & Solution</span>
        </div>
        <textarea
          value={bodyText}
          onChange={(e) => onBodyChange(e.target.value)}
          rows={3}
          className="w-full p-3.5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4] text-sm text-[#1B231B] focus:border-[#1F3824] focus:bg-white focus:ring-1 focus:ring-[#1F3824]/20 outline-none resize-none transition-all leading-snug font-medium"
          placeholder="Explain the pain point and how your software solves it effortlessly..."
        />
      </div>

      {/* CTA Section (11-15s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-[#1F3824] uppercase tracking-wider text-[11px]">
            Call to Action (0:11 - 0:15)
          </label>
          <span className="text-[11px] text-[#717E6C]">High-intent conversion punch</span>
        </div>
        <input
          type="text"
          value={ctaText}
          onChange={(e) => onCtaChange(e.target.value)}
          className="w-full px-4 h-11 rounded-full bg-[#F6F7F2] border border-[#CBD5C4] text-sm text-[#1B231B] focus:border-[#1F3824] focus:bg-white focus:ring-1 focus:ring-[#1F3824]/20 outline-none transition-all font-medium"
          placeholder="Click the link below to get started today..."
        />
      </div>
    </div>
  );
};
