"use client";

import React from "react";
import {
  VIDEO_TEMPLATES,
  VideoTemplateArchetype,
  VideoTemplateConfig,
} from "@/lib/templates/videoTemplates";
import { Layers, Sparkles, Music2, Mic, Smartphone, Video } from "lucide-react";

interface VideoTemplatePickerProps {
  selectedTemplate: VideoTemplateArchetype;
  onSelectTemplate: (template: VideoTemplateConfig) => void;
}

export function VideoTemplatePicker({
  selectedTemplate,
  onSelectTemplate,
}: VideoTemplatePickerProps) {
  const templates = Object.values(VIDEO_TEMPLATES);

  const getTemplateIcon = (id: VideoTemplateArchetype) => {
    switch (id) {
      case "studio_minimalist":
        return <Video className="h-4 w-4" aria-hidden="true" />;
      case "organic_selfie":
        return <Smartphone className="h-4 w-4" aria-hidden="true" />;
      case "meme_reaction":
        return <Music2 className="h-4 w-4" aria-hidden="true" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs text-[#18181B]">
      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#D95D39]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#18181B]">
            Video Format & Template Archetype
          </h3>
        </div>
        <span className="text-xs text-[#D95D39] bg-[#FFF2ED] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          3 Core Formats
        </span>
      </div>

      <p className="text-xs text-[#52525B] leading-relaxed">
        Choose your video ad archetype. Every format guarantees your website name is spoken or highlighted to maximize conversion.
      </p>

      <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-label="Select Video Format Archetype">
        {templates.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;

          return (
            <button
              type="button"
              key={tmpl.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectTemplate(tmpl)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-2 ${
                isSelected
                  ? "bg-[#FFF2ED] border-2 border-[#D95D39] shadow-xs"
                  : "bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#D95D39]/50 hover:bg-[#F4F1EA]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-[#D95D39] text-white border-[#D95D39]"
                        : "bg-white text-[#D95D39] border-[#E5E0D8]"
                    }`}
                  >
                    {getTemplateIcon(tmpl.id)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#18181B]">
                    {tmpl.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {tmpl.hasVoiceover ? (
                    <span className="text-[10px] font-mono text-[#18181B] bg-white px-2 py-0.5 rounded-full border border-[#E5E0D8] flex items-center gap-1">
                      <Mic className="h-2.5 w-2.5 text-[#D95D39]" aria-hidden="true" /> Vocal Speech
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 font-semibold">
                      <Music2 className="h-2.5 w-2.5" aria-hidden="true" /> Music Only
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#52525B] leading-relaxed pl-9">
                {tmpl.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
