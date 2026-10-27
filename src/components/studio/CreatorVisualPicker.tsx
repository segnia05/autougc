"use client";

import React from "react";
import Image from "next/image";
import { UserCheck, Sparkles, Check } from "lucide-react";

export interface CreatorPersona {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  voiceId: string;
  vibe: string;
  tags: string[];
}

export const CREATOR_PERSONAS: CreatorPersona[] = [
  {
    id: "sarah",
    name: "Sarah Miller",
    role: "SaaS & DTC Reviewer",
    imageUrl: "/images/creator-glasses.jpg",
    voiceId: "sarah_dtc_founder",
    vibe: "High credibility, conversational & energetic",
    tags: ["High Energy", "B2B / DTC", "Female"],
  },
  {
    id: "alex",
    name: "Alex Chen",
    role: "Tech Founder & Builder",
    imageUrl: "/images/creator-male.jpg",
    voiceId: "alex_casual_dtc",
    vibe: "Direct, founder-to-founder authority",
    tags: ["Authoritative", "Dev / SaaS", "Male"],
  },
  {
    id: "emma",
    name: "Emma Davis",
    role: "Productivity Specialist",
    imageUrl: "/images/study-creator.jpg",
    voiceId: "emma_storyteller",
    vibe: "Warm, relatable aesthetic workspace walk-through",
    tags: ["Relatable", "Productivity", "Female"],
  },
  {
    id: "workspace",
    name: "Minimalist Workspace",
    role: "Architectural B-Roll",
    imageUrl: "/images/hero-landscape.jpg",
    voiceId: "marcus_deep_authority",
    vibe: "Ultra-clean workspace setup for software demos",
    tags: ["Clean B-Roll", "Modern Desk", "Ambient"],
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
  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white border border-[#CBD5C4]/70 shadow-sm text-[#1B231B]">
      <div className="flex items-center justify-between border-b border-[#CBD5C4]/50 pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#1F3824]" />
          <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
            Creator visual & B-Roll persona
          </h3>
        </div>
        <span className="text-xs text-[#1F3824] bg-[#E2E9DC] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          4K Neural B-Roll
        </span>
      </div>

      <p className="text-xs text-[#4A544A] leading-relaxed">
        Select the visual creator persona featured in your 9:16 vertical ad. AutoUGC dynamically synchronizes voice, pacing, and subtitle hooks to their delivery.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CREATOR_PERSONAS.map((persona) => {
          const isSelected = selectedImageUrl === persona.imageUrl;
          return (
            <div
              key={persona.id}
              onClick={() => onSelectPersona(persona)}
              className={`group relative p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                isSelected
                  ? "bg-[#E2E9DC] border-2 border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] border-[#CBD5C4]/70 hover:border-[#1F3824]/50 hover:bg-[#FAFBF9]"
              }`}
            >
              {/* Creator Thumbnail */}
              <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-[#CBD5C4] shadow-xs">
                <Image
                  src={persona.imageUrl}
                  alt={persona.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="64px"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[#1F3824] flex items-center justify-center text-white shadow-sm">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-[#1B231B] truncate">
                    {persona.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#717E6C] shrink-0">
                    {persona.role.split("&")[0]}
                  </span>
                </div>
                <p className="text-[11px] text-[#4A544A] line-clamp-1 mt-0.5">
                  {persona.vibe}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {persona.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#CBD5C4]/70 text-[#1F3824]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
