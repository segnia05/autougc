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
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-[var(--bg-surface)] border border-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-[var(--accent-primary)]" />
          <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Creator Voice Persona
          </h3>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">
          Hyper-realistic TTS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CREATOR_VOICE_PRESETS.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => onVoiceChange(voice.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-[var(--accent-primary)] bg-[var(--bg-surface-elevated)] shadow-glow-amber/20"
                  : "border-subtle bg-[var(--bg-app)] hover:border-prominent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  {voice.name}
                  {isSelected && <Volume2 className="h-3.5 w-3.5 text-[var(--accent-primary)] animate-pulse" />}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] capitalize">
                  {voice.gender}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1 leading-snug">
                {voice.style}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
