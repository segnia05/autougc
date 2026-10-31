"use client";

import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  SkipForward,
  Sliders,
  Play,
  Pause,
  Loader2,
} from "lucide-react";

export interface CampaignPost {
  id: string;
  index: number;
  totalPosts: number;
  title: string;
  hook: string;
  videoUrl?: string;
  thumbnailUrl: string;
  status: "draft" | "rendered" | "scheduled" | "live";
  format: "video" | "image";
}

interface CampaignAdViewerProps {
  currentPost: CampaignPost;
  onNext: () => void;
  onPrev: () => void;
  onSwap: () => void;
  onSkip: () => void;
  onEdit: () => void;
  onMake: () => Promise<void>;
  isRendering?: boolean;
}

export default function CampaignAdViewer({
  currentPost,
  onNext,
  onPrev,
  onSwap,
  onSkip,
  onEdit,
  onMake,
  isRendering = false,
}: CampaignAdViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center select-none py-2">
      {/* 9:16 Vertical Creative Preview Container (Screenshot 4 Match) */}
      <div className="relative w-72 sm:w-80 aspect-9/16 rounded-2xl overflow-hidden bg-[#18181B] border border-[#EFECE6] shadow-md group">
        {currentPost.videoUrl ? (
          <video
            ref={videoRef}
            src={currentPost.videoUrl}
            poster={currentPost.thumbnailUrl}
            playsInline
            loop
            onClick={togglePlay}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-cover cursor-pointer"
          />
        ) : (
          <div
            onClick={togglePlay}
            className="w-full h-full relative cursor-pointer"
            style={{
              backgroundImage: `url(${currentPost.thumbnailUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* Play / Pause Overlay Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center transition-opacity shadow-lg ${
            isPlaying ? "opacity-0 group-hover:opacity-80" : "opacity-90 hover:scale-105"
          }`}
          aria-label={isPlaying ? "Pause preview" : "Play preview"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Top Post Status Ribbon */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white">
            Post #{currentPost.index} of {currentPost.totalPosts}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#D95D39] text-[9px] font-bold uppercase tracking-wider text-white">
            {currentPost.status}
          </span>
        </div>
      </div>

      {/* Action Trio Pills (Screenshot 4 Match: [Swap 2] [Skip 4] [Edit 3]) */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onSwap}
          className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8 flex items-center gap-1.5 shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#52525B]" />
          <span>Swap 2</span>
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8 flex items-center gap-1.5 shadow-2xs"
        >
          <SkipForward className="w-3.5 h-3.5 text-[#52525B]" />
          <span>Skip 4</span>
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8 flex items-center gap-1.5 shadow-2xs"
        >
          <Sliders className="w-3.5 h-3.5 text-[#52525B]" />
          <span>Edit 3</span>
        </button>
      </div>

      {/* Primary Production Row: < [✦ Make 5 credits] > */}
      <div className="mt-3 flex items-center gap-3">
        {/* Previous Chevron Button */}
        <button
          type="button"
          onClick={onPrev}
          title="Previous post"
          className="w-9 h-9 rounded-full border border-[#E5E0D8] bg-white hover:bg-[#FAF9F6] text-[#18181B] flex items-center justify-center transition-all shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Central Production Action Button (Screenshot 4 Match) */}
        <button
          type="button"
          onClick={onMake}
          disabled={isRendering}
          className="btn-fastlane-black py-2.5 px-6 text-xs font-semibold gap-2.5 shadow-sm hover:scale-[1.01] transition-transform min-w-[200px] justify-center"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Rendering 9:16 Video...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Make 5 credits</span>
              <span className="w-4 h-2 rounded-full bg-white/30 inline-block ml-1" />
            </>
          )}
        </button>

        {/* Next Chevron Button */}
        <button
          type="button"
          onClick={onNext}
          title="Next post"
          className="w-9 h-9 rounded-full border border-[#E5E0D8] bg-white hover:bg-[#FAF9F6] text-[#18181B] flex items-center justify-center transition-all shadow-2xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

