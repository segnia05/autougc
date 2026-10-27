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
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white border border-[#CBD5C4]/70 shadow-sm text-[#1B231B]">
      <div className="flex items-center justify-between border-b border-[#CBD5C4]/50 pb-3">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-[#1F3824]" />
          <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
            Creator voice persona
          </h3>
        </div>
        <span className="text-xs text-[#717E6C] font-mono">
          Hyper-realistic Neural TTS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CREATOR_VOICE_PRESETS.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => onVoiceChange(voice.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#E2E9DC] border-2 border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] border-[#CBD5C4]/60 hover:border-[#1F3824]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#1B231B] flex items-center gap-1.5">
                  {voice.name}
                  {isSelected && <Volume2 className="h-3.5 w-3.5 text-[#1F3824] animate-pulse" />}
                </span>
                <span className="text-[11px] font-mono text-[#717E6C] capitalize">
                  {voice.gender}
                </span>
              </div>
              <p className="text-xs text-[#4A544A] line-clamp-1 leading-snug">
                {voice.style}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
