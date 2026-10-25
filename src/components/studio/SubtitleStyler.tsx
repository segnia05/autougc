"use client";

import React from "react";
import { Type, Palette } from "lucide-react";
import { SubtitleStyleConfig } from "@/remotion/types";

interface SubtitleStylerProps {
  subtitleStyle: SubtitleStyleConfig;
  brandColor: string;
  onStyleChange: (updated: SubtitleStyleConfig) => void;
  onBrandColorChange: (color: string) => void;
}

export const SubtitleStyler: React.FC<SubtitleStylerProps> = ({
  subtitleStyle,
  brandColor,
  onStyleChange,
  onBrandColorChange,
}) => {
  const highlightColors = [
    { name: "Electric Amber", hex: "#F59E0B" },
    { name: "Neon Emerald", hex: "#10B981" },
    { name: "Vibrant Cyan", hex: "#06B6D4" },
    { name: "Hot Pink", hex: "#EC4899" },
    { name: "Pure White", hex: "#FFFFFF" },
  ];

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--bg-surface)] border border-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-[var(--accent-primary)]" />
          <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Kinetic Subtitle Styling
          </h3>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          TikTok Safe Zone
        </span>
      </div>

      {/* Highlight Color Picker */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Word Highlight Color
        </label>
        <div className="flex items-center gap-2.5">
          {highlightColors.map((c) => (
            <button
              key={c.hex}
              onClick={() =>
                onStyleChange({ ...subtitleStyle, highlightColor: c.hex })
              }
              title={c.name}
              style={{ backgroundColor: c.hex }}
              className={`h-7 w-7 rounded-full border transition-all ${
                subtitleStyle.highlightColor === c.hex
                  ? "ring-2 ring-white scale-110 border-white"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Font Size Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-[var(--text-secondary)]">
            Font Scale
          </label>
          <span className="font-mono text-[var(--text-muted)]">
            {subtitleStyle.fontSize || 52}px
          </span>
        </div>
        <input
          type="range"
          min={40}
          max={68}
          value={subtitleStyle.fontSize || 52}
          onChange={(e) =>
            onStyleChange({
              ...subtitleStyle,
              fontSize: Number(e.target.value),
            })
          }
          className="w-full accent-[var(--accent-primary)] cursor-pointer"
        />
      </div>
    </div>
  );
};
