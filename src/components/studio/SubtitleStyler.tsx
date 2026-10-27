"use client";

import React from "react";
import { Type, Sparkles } from "lucide-react";
import { SubtitleStyleConfig } from "@/remotion/types";

interface SubtitleStylerProps {
  subtitleStyle: SubtitleStyleConfig;
  brandColor: string;
  onStyleChange: (updated: SubtitleStyleConfig) => void;
  onBrandColorChange: (color: string) => void;
}

const STYLE_PRESETS = [
  {
    name: "Viral TikTok Yellow",
    highlightColor: "#FFE600",
    primaryColor: "#FFFFFF",
    fontSize: 54,
  },
  {
    name: "Fluencify Emerald",
    highlightColor: "#10B981",
    primaryColor: "#FFFFFF",
    fontSize: 52,
  },
  {
    name: "High-Contrast White",
    highlightColor: "#FFFFFF",
    primaryColor: "rgba(255,255,255,0.7)",
    fontSize: 50,
  },
  {
    name: "Electric Cyan",
    highlightColor: "#06B6D4",
    primaryColor: "#FFFFFF",
    fontSize: 52,
  },
];

export const SubtitleStyler: React.FC<SubtitleStylerProps> = ({
  subtitleStyle,
  onStyleChange,
}) => {
  const highlightColors = [
    { name: "Viral Yellow", hex: "#FFE600" },
    { name: "Forest Emerald", hex: "#10B981" },
    { name: "Electric Cyan", hex: "#06B6D4" },
    { name: "Pure White", hex: "#FFFFFF" },
    { name: "Warm Amber", hex: "#F59E0B" },
  ];

  return (
    <div className="flex flex-col gap-5 p-6 rounded-3xl bg-white border border-[#CBD5C4]/70 shadow-sm text-[#1B231B]">
      <div className="flex items-center justify-between border-b border-[#CBD5C4]/50 pb-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-[#1F3824]" />
          <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
            Kinetic subtitles & typography
          </h3>
        </div>
        <span className="text-xs text-[#1F3824] bg-[#E2E9DC] px-2.5 py-0.5 rounded-full font-semibold">
          TikTok & Reels Safe Zone
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#4A544A] uppercase tracking-wider text-[11px] flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#1F3824]" /> Caption Style Presets:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STYLE_PRESETS.map((preset) => {
            const isSelected =
              subtitleStyle.highlightColor === preset.highlightColor &&
              subtitleStyle.fontSize === preset.fontSize;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  onStyleChange({
                    ...subtitleStyle,
                    highlightColor: preset.highlightColor,
                    primaryColor: preset.primaryColor,
                    fontSize: preset.fontSize,
                  })
                }
                className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#1F3824] bg-[#E2E9DC] text-[#1F3824] font-bold shadow-xs"
                    : "border-[#CBD5C4]/70 bg-[#F6F7F2] text-[#4A544A] hover:bg-[#ECEFE7]"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="h-3 w-3 rounded-full border border-black/20"
                    style={{ backgroundColor: preset.highlightColor }}
                  />
                  <span className="text-[11px] font-bold truncate text-[#1B231B]">
                    {preset.name.split(" ")[0]}
                  </span>
                </div>
                <span className="text-[10px] text-[#717E6C] font-mono">
                  {preset.fontSize}px Pop
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Highlight Color & Live Word Preview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#4A544A] uppercase tracking-wider text-[11px]">
            Active Word Color
          </label>
          <div className="flex items-center gap-2.5">
            {highlightColors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() =>
                  onStyleChange({ ...subtitleStyle, highlightColor: c.hex })
                }
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className={`h-7 w-7 rounded-full border transition-all cursor-pointer ${
                  subtitleStyle.highlightColor === c.hex
                    ? "ring-2 ring-[#1F3824] ring-offset-2 ring-offset-white scale-110 shadow-sm"
                    : "border-[#CBD5C4] opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Live Typography Preview Pill */}
        <div className="px-4 py-2.5 rounded-xl bg-[#1B231B] text-white flex items-center gap-1.5 shadow-sm">
          <span className="text-xs font-black uppercase text-white/50">Stop</span>
          <span
            className="text-xs font-black uppercase tracking-tight scale-105"
            style={{ color: subtitleStyle.highlightColor || "#FFE600" }}
          >
            Coding
          </span>
          <span className="text-xs font-black uppercase text-white">Under</span>
        </div>
      </div>

      {/* Font Scale Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-xs font-semibold text-[#4A544A] uppercase tracking-wider text-[11px]">
            Font Scale
          </label>
          <span className="font-mono text-xs text-[#1F3824] font-bold">
            {subtitleStyle.fontSize}px
          </span>
        </div>
        <input
          type="range"
          min="38"
          max="66"
          value={subtitleStyle.fontSize}
          onChange={(e) =>
            onStyleChange({ ...subtitleStyle, fontSize: Number(e.target.value) })
          }
          className="w-full accent-[#1F3824] cursor-pointer"
        />
      </div>
    </div>
  );
};
