"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserCheck, Sparkles, Check, Video, Bot } from "lucide-react";

export interface CreatorPersona {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  videoUrl: string;
  voiceId: string;
  vibe: string;
  tags: string[];
  characterType: "real_creator" | "ai_avatar";
}

export const CREATOR_PERSONAS: CreatorPersona[] = [
  {
    id: "sarah",
    name: "Sarah Miller",
    role: "Lifestyle & DTC Creator",
    imageUrl: "/images/creator-sarah.jpg",
    videoUrl: "/videos/creator-sarah.mp4",
    voiceId: "sarah_dtc_founder",
    vibe: "Authentic, energetic smartphone vlog walk-and-talk in 9:16",
    tags: ["Real Video", "High Energy", "Female"],
    characterType: "real_creator",
  },
  {
    id: "alex",
    name: "Alex Vance",
    role: "Tech Founder & Podcast Host",
    imageUrl: "/images/creator-alex.jpg",
    videoUrl: "/videos/creator-alex.mp4",
    voiceId: "alex_casual_dtc",
    vibe: "Podcast desk setup with mic & laptop, talking directly to camera",
    tags: ["Real Video", "Authoritative", "Male"],
    characterType: "real_creator",
  },
  {
    id: "workspace",
    name: "Clean Tech Workspace",
    role: "Architectural B-Roll",
    imageUrl: "/images/hero-landscape.jpg",
    videoUrl: "/videos/creator-workspace.mp4",
    voiceId: "marcus_deep_authority",
    vibe: "Ultra-clean workspace setup with code reflection",
    tags: ["Real Video", "Ambient", "Workspace"],
    characterType: "real_creator",
  },
  {
    id: "marcus_ai",
    name: "Marcus Thorne (AI)",
    role: "Digital Enterprise Presenter",
    imageUrl: "/images/creator-alex.jpg",
    videoUrl: "/videos/creator-alex.mp4",
    voiceId: "marcus_deep_authority",
    vibe: "Executive tone, synthetic corporate presenter",
    tags: ["AI Avatar", "Corporate", "Male"],
    characterType: "ai_avatar",
  },
  {
    id: "elena_ai",
    name: "Elena Rostova (AI)",
    role: "Global Fintech Creator",
    imageUrl: "/images/creator-sarah.jpg",
    videoUrl: "/videos/creator-sarah.mp4",
    voiceId: "sarah_dtc_founder",
    vibe: "Polished studio lighting, AI lip-sync persona",
    tags: ["AI Avatar", "Fintech", "Female"],
    characterType: "ai_avatar",
  },
];

interface CreatorVisualPickerProps {
  selectedImageUrl: string;
  onSelectPersona: (persona: CreatorPersona) => void;
}

export function CreatorVisualPicker({
  selectedImageUrl,
  onSelectPersona,
}: CreatorVisualPickerProps) {
  const [filter, setFilter] = useState<"all" | "real_creator" | "ai_avatar">("all");

  const filteredPersonas = CREATOR_PERSONAS.filter((p) => {
    if (filter === "all") return true;
    return p.characterType === filter;
  });

  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs text-[#18181B]">
      <div className="flex flex-wrap items-center justify-between border-b border-[#EFECE6] pb-3 gap-2">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#D95D39]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#18181B]">
            Creator & Character Library
          </h3>
        </div>

        {/* Filter Toggle: All vs Real Creators vs AI Avatars */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-full border border-[#E5E0D8] text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full transition-all font-semibold ${
              filter === "all"
                ? "bg-[#18181B] text-white shadow-xs"
                : "text-[#52525B] hover:text-[#18181B]"
            }`}
          >
            All ({CREATOR_PERSONAS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("real_creator")}
            className={`px-3 py-1 rounded-full transition-all font-semibold flex items-center gap-1 ${
              filter === "real_creator"
                ? "bg-[#18181B] text-white shadow-xs"
                : "text-[#52525B] hover:text-[#18181B]"
            }`}
          >
            <Video className="h-3 w-3" />
            Real Creators
          </button>
          <button
            type="button"
            onClick={() => setFilter("ai_avatar")}
            className={`px-3 py-1 rounded-full transition-all font-semibold flex items-center gap-1 ${
              filter === "ai_avatar"
                ? "bg-[#18181B] text-white shadow-xs"
                : "text-[#52525B] hover:text-[#18181B]"
            }`}
          >
            <Bot className="h-3 w-3" />
            AI Avatars
          </button>
        </div>
      </div>

      <p className="text-xs text-[#52525B] leading-relaxed">
        Choose between <strong>Real-Person Creators</strong> (real humans moving, holding phones, and reacting) or <strong>AI Avatars</strong> (digital synthetic presenters).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Select Creator Persona">
        {filteredPersonas.map((persona) => {
          const isSelected = selectedImageUrl === persona.imageUrl;
          const isReal = persona.characterType === "real_creator";

          return (
            <button
              type="button"
              key={persona.id}
              onClick={() => onSelectPersona(persona)}
              role="radio"
              aria-checked={isSelected}
              className={`group relative p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-2 ${
                isSelected
                  ? "border-[#D95D39] bg-[#FFF2ED]/30 ring-1 ring-[#D95D39] shadow-xs"
                  : "border-[#E5E0D8] hover:border-[#D95D39]/50 bg-white"
              }`}
            >
              {/* Creator Headshot */}
              <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-[#E5E0D8] shadow-xs">
                <Image
                  src={persona.imageUrl}
                  alt={persona.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="56px"
                />
                {isReal ? (
                  <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border border-white" title="Real Motion Video" />
                ) : (
                  <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-indigo-500 border border-white" title="AI Avatar" />
                )}
              </div>

              {/* Creator Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-[#18181B] truncate">
                    {persona.name}
                  </span>
                  {isSelected && (
                    <span className="h-4 w-4 rounded-full bg-[#D95D39] text-white flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#52525B] truncate mb-1">
                  {persona.role}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isReal ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-indigo-50 text-indigo-800 border border-indigo-200"
                  }`}>
                    {isReal ? "Real Creator" : "AI Avatar"}
                  </span>
                  {persona.tags.slice(0, 1).map((t) => (
                    <span key={t} className="text-[9px] text-[#71717A] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
