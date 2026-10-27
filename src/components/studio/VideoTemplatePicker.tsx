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
        return <Video className="h-4 w-4" />;
      case "organic_selfie":
        return <Smartphone className="h-4 w-4" />;
      case "meme_reaction":
        return <Music2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white border border-[#CBD5C4]/70 shadow-sm text-[#1B231B]">
      <div className="flex items-center justify-between border-b border-[#CBD5C4]/50 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#1F3824]" />
          <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
            Video format & template archetype
          </h3>
        </div>
        <span className="text-xs text-[#1F3824] bg-[#E2E9DC] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          3 Core Formats
        </span>
      </div>

      <p className="text-xs text-[#4A544A] leading-relaxed">
        Choose your video ad archetype. Every format guarantees your website name is spoken or highlighted to maximize conversion.
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {templates.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${isSelected
                  ? "bg-[#E2E9DC] border-2 border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] border-[#CBD5C4]/70 hover:border-[#1F3824]/50 hover:bg-[#FAFBF9]"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border ${isSelected
                        ? "bg-[#1F3824] text-white border-[#1F3824]"
                        : "bg-white text-[#1F3824] border-[#CBD5C4]"
                      }`}
                  >
                    {getTemplateIcon(tmpl.id)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#1B231B]">
                    {tmpl.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {tmpl.hasVoiceover ? (
                    <span className="text-[10px] font-mono text-[#1F3824] bg-white px-2 py-0.5 rounded-full border border-[#CBD5C4] flex items-center gap-1">
                      <Mic className="h-2.5 w-2.5" /> Vocal Speech
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 font-semibold">
                      <Music2 className="h-2.5 w-2.5" /> Music Only
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#4A544A] leading-relaxed pl-9">
                {tmpl.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
