"use client";

import React from "react";
import { Music, Volume2, Sparkles, Check } from "lucide-react";

export interface BackgroundTrack {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  energy: "Low" | "Medium" | "High";
}

export const BACKGROUND_TRACKS: BackgroundTrack[] = [
  {
    id: "lofi_focus",
    name: "Subtle Lo-Fi Chill",
    genre: "Ambient Beats",
    bpm: 82,
    energy: "Low",
  },
  {
    id: "saas_hype",
    name: "Modern Tech Upbeat",
    genre: "Indie Pop & Drums",
    bpm: 118,
    energy: "High",
  },
  {
    id: "minimal_pulse",
    name: "Berlin Minimal Pulse",
    genre: "Deep Electronic",
    bpm: 124,
    energy: "Medium",
  },
  {
    id: "acoustic_organic",
    name: "Acoustic Warmth",
    genre: "Coffeehouse Strum",
    bpm: 95,
    energy: "Low",
  },
  {
    id: "none",
    name: "None (Voiceover Only)",
    genre: "Pure Dialog",
    bpm: 0,
    energy: "Low",
  },
];

interface MusicPickerProps {
  selectedTrackId: string;
  onTrackChange: (trackId: string) => void;
  duckingLevelDb?: number;
}

export function MusicPicker({
  selectedTrackId,
  onTrackChange,
  duckingLevelDb = -22,
}: MusicPickerProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-subtle rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-[var(--accent-primary)]" />
          <h3 className="text-sm font-semibold tracking-wide">
            Dynamic B-Roll Music & Ducking
          </h3>
        </div>
        <span className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--accent-glow)] px-2 py-0.5 rounded border border-[var(--accent-primary)]/20">
          Auto-ducking: {duckingLevelDb}dB
        </span>
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        Music volume automatically drops to -22dB whenever creator voiceover speaks, maintaining crystal dialogue clarity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {BACKGROUND_TRACKS.map((track) => {
          const isSelected = track.id === selectedTrackId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onTrackChange(track.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-150 flex items-center justify-between ${
                isSelected
                  ? "border-[var(--accent-primary)] bg-[var(--accent-glow)] text-[var(--text-primary)]"
                  : "border-subtle bg-[var(--bg-app)]/50 hover:border-zinc-700 text-[var(--text-secondary)]"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium">{track.name}</span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  {track.genre} {track.bpm > 0 ? `• ${track.bpm} BPM` : ""}
                </span>
              </div>
              {isSelected ? (
                <div className="h-4 w-4 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-zinc-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
