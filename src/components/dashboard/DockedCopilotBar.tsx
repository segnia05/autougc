"use client";

import React, { useState } from "react";
import { ArrowUp, Sparkles, Paperclip } from "lucide-react";

interface DockedCopilotBarProps {
  onSubmit?: (prompt: string, intent: string) => void;
  brandName?: string;
}

export default function DockedCopilotBar({
  onSubmit,
  brandName = "AutoUGC",
}: DockedCopilotBarProps) {
  const [prompt, setPrompt] = useState("");
  const [activeIntent, setActiveIntent] = useState<string>("Video");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    if (onSubmit) {
      onSubmit(prompt.trim(), activeIntent);
    }
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const CHIPS = ["Image", "Video", "Script", "Campaign"];

  return (
    <div className="w-full max-w-4xl mx-auto select-none pt-4">
      {/* Container with Fastlane glowing terracotta top border */}
      <div className="fastlane-card p-3.5 bg-white shadow-lg border border-[#EFECE6] relative overflow-hidden">
        {/* Subtle orange accent glow line on top border */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D95D39] to-transparent opacity-80" />

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Copilot for an ad, a campaign, or anything about ${brandName}`}
            className="flex-1 bg-transparent px-2 py-1.5 text-xs text-[#18181B] placeholder-[#8E8B85] focus:outline-none resize-none leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!prompt.trim()}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-[#18181B] hover:bg-[#09090B] disabled:opacity-30 disabled:hover:bg-[#18181B] text-white flex items-center justify-center transition-all shadow-xs"
            aria-label="Send message"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Chips & Shortcut Hints (Screenshot 3 Match) */}
        <div className="mt-2.5 pt-2 border-t border-[#EFECE6]/60 flex items-center justify-between gap-3 text-[11px]">
          {/* Quick Action Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#8E8B85] mr-1">
              <Paperclip className="w-3 h-3" />
            </span>
            {CHIPS.map((chip) => {
              const isSelected = activeIntent === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveIntent(chip)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isSelected
                      ? "bg-[#FAF8F5] border border-[#E5E0D8] text-[#18181B] font-semibold"
                      : "text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]"
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? "bg-[#D95D39]" : "bg-[#8E8B85]"
                    }`}
                  />
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>

          {/* Keyboard Hint */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#8E8B85]">
            <span>Enter to send</span>
            <span>·</span>
            <span>Shift Enter new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}

