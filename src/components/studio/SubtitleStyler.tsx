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
    name: "AutoUGC Terracotta",
    highlightColor: "#D95D39",
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
    { name: "AutoUGC Terracotta", hex: "#D95D39" },
    { name: "Viral Yellow", hex: "#FFE600" },
    { name: "Pure White", hex: "#FFFFFF" },
    { name: "Electric Cyan", hex: "#06B6D4" },
    { name: "Warm Amber", hex: "#F59E0B" },
  ];

  return (
    <div className="flex flex-col gap-5 p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs text-[#18181B]">
      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-[#D95D39]" />
          <h3 className="text-sm font-semibold text-[#18181B]">
            Kinetic Subtitles & Typography
          </h3>
        </div>
        <span className="text-xs text-[#D95D39] bg-[#FFF2ED] px-2.5 py-0.5 rounded-full font-semibold">
          TikTok & Reels Safe Zone
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#52525B] uppercase tracking-wider text-[11px] flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#D95D39]" /> Caption Style Presets:
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
                    ? "border-2 border-[#D95D39] bg-[#FFF2ED] text-[#D95D39] font-bold shadow-xs"
                    : "border-[#E5E0D8] bg-[#FAF8F5] text-[#52525B] hover:bg-[#F4F1EA]"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="h-3 w-3 rounded-full border border-black/20"
                    style={{ backgroundColor: preset.highlightColor }}
                  />
                  <span className="text-[11px] font-bold truncate text-[#18181B]">
                    {preset.name.split(" ")[0]}
                  </span>
                </div>
                <span className="text-[10px] text-[#8E8B85] font-mono">
                  {preset.fontSize}px Pop
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Highlight Color & Live Word Preview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#52525B] uppercase tracking-wider text-[11px]">
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
                aria-label={`Select ${c.name} subtitle highlight color`}
                aria-pressed={subtitleStyle.highlightColor === c.hex}
                className={`h-7 w-7 rounded-full border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-2 ${
                  subtitleStyle.highlightColor === c.hex
                    ? "ring-2 ring-[#D95D39] ring-offset-2 ring-offset-white scale-110 shadow-sm"
                    : "border-[#E5E0D8] opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Live Typography Preview Pill */}
        <div className="px-4 py-2.5 rounded-xl bg-[#18181B] text-white flex items-center gap-1.5 shadow-sm">
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
          <label className="text-xs font-semibold text-[#52525B] uppercase tracking-wider text-[11px]">
            Font Scale
          </label>
          <span className="font-mono text-xs text-[#D95D39] font-bold">
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
          aria-label="Subtitle Font Scale"
          aria-valuemin={38}
          aria-valuemax={66}
          aria-valuenow={subtitleStyle.fontSize}
          aria-valuetext={`${subtitleStyle.fontSize} pixels`}
          className="w-full accent-[#D95D39] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
        />
      </div>
    </div>
  );
};
