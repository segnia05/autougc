"use client";

import { Music, Volume2, Check } from "lucide-react";

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
    id: "cinematic_drive",
    name: "Cinematic Synthwave",
    genre: "Future Retro",
    bpm: 110,
    energy: "High",
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
    <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-2xs flex flex-col gap-4 text-[#18181B]">
      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-[#D95D39]" />
          <h3 className="text-sm font-semibold text-[#18181B]">
            Dynamic B-Roll Music & Ducking
          </h3>
        </div>
        <span className="text-xs font-mono text-[#D95D39] bg-[#FFF2ED] px-2.5 py-0.5 rounded-full font-semibold">
          Auto-ducking: {duckingLevelDb}dB
        </span>
      </div>

      <p className="text-xs text-[#52525B] leading-relaxed">
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
              className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                isSelected
                  ? "border-2 border-[#D95D39] bg-[#FFF2ED] text-[#18181B] shadow-xs"
                  : "border-[#E5E0D8] bg-[#FAF8F5] hover:border-[#D95D39]/50 text-[#52525B]"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#18181B]">{track.name}</span>
                <span className="text-[11px] text-[#8E8B85] font-mono">
                  {track.genre} {track.bpm > 0 ? `• ${track.bpm} BPM` : ""}
                </span>
              </div>
              {isSelected ? (
                <div className="h-5 w-5 rounded-full bg-[#D95D39] flex items-center justify-center text-white">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#8E8B85]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
