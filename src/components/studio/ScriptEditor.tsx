"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

interface ScriptEditorProps {
  hookText: string;
  bodyText: string;
  ctaText: string;
  onHookChange: (val: string) => void;
  onBodyChange: (val: string) => void;
  onCtaChange: (val: string) => void;
  estimatedDuration: number;
}

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
    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-[var(--bg-surface)] border border-subtle">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
          Script & Timing
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant={totalWords > 55 ? "rose" : "amber"} size="sm">
            {totalWords} words
          </Badge>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            ~{estimatedDuration.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Hook Section (0-3s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-[var(--accent-primary)] font-mono">
            HOOK (0:00 - 0:03)
          </label>
          <span className="text-[11px] text-[var(--text-muted)]">Thumb-stopper</span>
        </div>
        <textarea
          value={hookText}
          onChange={(e) => onHookChange(e.target.value)}
          rows={2}
          className="w-full p-3 rounded-lg bg-[var(--bg-app)] border border-subtle text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none resize-none transition-all leading-snug"
          placeholder="Stop doing X in 2026..."
        />
      </div>

      {/* Body Section (3-11s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-[var(--text-secondary)] font-mono">
            BODY (0:03 - 0:11)
          </label>
          <span className="text-[11px] text-[var(--text-muted)]">Problem & Solution</span>
        </div>
        <textarea
          value={bodyText}
          onChange={(e) => onBodyChange(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-lg bg-[var(--bg-app)] border border-subtle text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none resize-none transition-all leading-snug"
          placeholder="Explain the pain point and how the product fixes it in seconds..."
        />
      </div>

      {/* CTA Section (11-15s) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-[var(--accent-emerald)] font-mono">
            CALL TO ACTION (0:11 - 0:15)
          </label>
          <span className="text-[11px] text-[var(--text-muted)]">Urgent CTA</span>
        </div>
        <input
          type="text"
          value={ctaText}
          onChange={(e) => onCtaChange(e.target.value)}
          className="w-full px-3 h-10 rounded-lg bg-[var(--bg-app)] border border-subtle text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all"
          placeholder="Click the link below to get yours..."
        />
      </div>
    </div>
  );
};
