"use client";

import React from "react";
import { CREATOR_VOICE_PRESETS } from "@/lib/audio/types";
import { Mic, Volume2 } from "lucide-react";

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onVoiceChange,
}) => {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs text-[#18181B]">
      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-[#D95D39]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#18181B]">
            Creator Voice Persona
          </h3>
        </div>
        <span className="text-xs text-[#8E8B85] font-mono">
          Hyper-realistic Neural TTS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label="Select Creator Voice Persona">
        {CREATOR_VOICE_PRESETS.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          return (
            <button
              type="button"
              key={voice.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onVoiceChange(voice.id)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-2 ${
                isSelected
                  ? "bg-[#FFF2ED] border-2 border-[#D95D39] shadow-xs"
                  : "bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#D95D39]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                  {voice.name}
                  {isSelected && <Volume2 className="h-3.5 w-3.5 text-[#D95D39] animate-pulse" aria-hidden="true" />}
                </span>
                <span className="text-[11px] font-mono text-[#8E8B85] capitalize">
                  {voice.gender}
                </span>
              </div>
              <p className="text-xs text-[#52525B] line-clamp-1 leading-snug">
                {voice.style}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
