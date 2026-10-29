"use client";

import React, { useRef, useState, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { UgcAdComposition } from "@/remotion/compositions/UgcAdComposition";
import { UgcAdCompositionProps } from "@/remotion/types";
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Disc,
  Wifi,
  Battery,
  ShieldCheck,
  Volume2,
  VolumeX,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

interface CanvasPlayerProps {
  compositionProps: UgcAdCompositionProps;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
  onSelectMedia?: (mediaUrl: string, isVideo?: boolean) => void;
}

type PreviewViewMode = "clean" | "safe_zone" | "in_feed";

export const CanvasPlayer: React.FC<CanvasPlayerProps> = ({
  compositionProps,
  className,
  onSelectMedia,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<PreviewViewMode>("clean");
  const [isMuted, setIsMuted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 450; // 15 seconds at 30 fps

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onFrameUpdate = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("frameupdate", onFrameUpdate);

    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("frameupdate", onFrameUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isPlaying()) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const restartVideo = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value, 10);
    setCurrentFrame(frame);
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
    }
  };

  const formatTime = (frame: number) => {
    const seconds = Math.floor(frame / 30);
    const ms = Math.floor(((frame % 30) / 30) * 10);
    return `00:${seconds < 10 ? "0" : ""}${seconds}.${ms}`;
  };

  const hasActiveVideo = Boolean(compositionProps.videoUrl);

  return (
    <div className={`relative flex flex-col items-center gap-4 ${className || ""}`}>
      {/* 9:16 Phone Frame Mockup in Natural Titanium Finish */}
      <div className="relative w-[300px] sm:w-[340px] md:w-[360px] aspect-[9/16] rounded-[52px] p-3.5 bg-gradient-to-b from-[#E2E7DC] via-[#D5DDCF] to-[#CBD5C4] shadow-[0_30px_70px_-20px_rgba(31,56,36,0.25)] border border-[#BDC8B7] select-none">
        {/* Chamfered Inner Bezel */}
        <div className="relative w-full h-full rounded-[44px] p-0.5 bg-gradient-to-b from-white/95 via-[#CBD5C4]/60 to-[#CBD5C4]/95 shadow-xs">
          {/* Screen Display Container */}
          <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-[#1B231B] shadow-inner">
            {/* Top iOS Status Bar */}
            <div className="absolute top-0 inset-x-0 h-10 px-6 z-40 flex items-center justify-between text-[11px] font-semibold text-white/90 drop-shadow-md pointer-events-none" aria-hidden="true">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-white/90">
                <span className="text-[10px] font-bold tracking-tighter">5G</span>
                <Wifi className="h-3 w-3 stroke-[2.5]" />
                <Battery className="h-3.5 w-3.5 stroke-[2]" />
              </div>
            </div>

            {/* Dynamic Island Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#111611] rounded-full z-40 flex items-center justify-between px-2.5 shadow-md pointer-events-none border border-white/10" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-[#1F3824] ring-1 ring-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#4A544A]" />
            </div>

            {/* Remotion Player Canvas with Keyboard Access */}
            <div
              role="region"
              aria-label="Interactive video ad canvas preview"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  togglePlay();
                }
              }}
              onClick={togglePlay}
              className="relative w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-inset"
            >
              <Player
                ref={playerRef}
                component={UgcAdComposition}
                inputProps={compositionProps}
                durationInFrames={totalFrames}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                acknowledgeRemotionLicense
                controls={false}
                autoPlay={false}
                loop
              />
            </div>

            {/* Permanent Pinned iOS Home Indicator Bar */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full z-45 pointer-events-none shadow-sm" aria-hidden="true" />

            {/* MODE 2: Official 2026 TikTok & Instagram Reels Broadcast Safe Zone HUD */}
            {viewMode === "safe_zone" && (
              <div className="absolute inset-0 z-35 pointer-events-none flex flex-col justify-between p-2 select-none" role="region" aria-label="Broadcast Safe Zone Overlay">
                {/* Top Exclusion Zone (12%) */}
                <div className="h-16 border-b border-dashed border-rose-400/80 bg-rose-500/15 rounded-t-3xl flex items-center justify-center p-1">
                  <span className="text-[9px] font-mono font-bold text-rose-300 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-full">
                    Top Platform Header (12%)
                  </span>
                </div>

                {/* Central Protected Safe Box */}
                <div className="flex-1 mx-2 my-2 border-2 border-emerald-400/90 rounded-2xl flex flex-col items-center justify-between p-2 relative bg-emerald-500/5">
                  <span className="text-[9px] font-mono font-bold text-emerald-300 uppercase tracking-wider bg-[#1F3824]/90 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                    ✓ Protected Subtitle & Hook Safe Area
                  </span>

                  {/* Right Exclusion Rail Marker */}
                  <div className="absolute right-0 top-12 bottom-12 w-14 border-l border-dashed border-amber-400/80 bg-amber-500/15 flex items-center justify-center rounded-r-xl">
                    <span className="text-[8px] font-mono font-bold text-amber-200 uppercase -rotate-90 whitespace-nowrap">
                      Buttons (18%)
                    </span>
                  </div>

                  <span className="text-[8px] font-mono text-emerald-300/80">
                    100% Unobstructed on TikTok • Reels • Shorts
                  </span>
                </div>

                {/* Bottom Platform Danger Zone (22%) */}
                <div className="h-28 border-t border-dashed border-rose-400/80 bg-rose-500/15 rounded-b-3xl flex flex-col items-center justify-center p-2 gap-1">
                  <span className="text-[9px] font-mono font-bold text-rose-300 uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded-full">
                    ⚠️ Bottom UI Zone: Native Captions & Audio Bar (22%)
                  </span>
                  <span className="text-[8px] font-mono text-rose-200/80 text-center">
                    Do not place text or logos here
                  </span>
                </div>
              </div>
            )}

            {/* MODE 3: High-Fidelity In-Feed Feed Mockup with Protective Gradient Scrim */}
            {viewMode === "in_feed" && (
              <>
                {/* Protective Bottom Gradient Scrim - Eliminates any visual clash with background video */}
                <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/92 via-black/60 to-transparent pointer-events-none z-28" aria-hidden="true" />

                <div className="absolute inset-x-3.5 bottom-7 z-30 pointer-events-none flex items-end justify-between gap-3 text-white" role="region" aria-label="Simulated in-feed display">
                  {/* Left: Native Profile Handle, Hook Caption, and Audio Marquee */}
                  <div className="flex flex-col gap-1.5 max-w-[74%] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-tight">
                        @{compositionProps.brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.official
                      </span>
                      <CheckCircle className="h-3.5 w-3.5 text-sky-400 fill-sky-400/20" aria-hidden="true" />
                    </div>

                    <p className="text-[11px] text-white/95 line-clamp-2 leading-snug font-medium">
                      {compositionProps.hookText}{" "}
                      <span className="text-white/70 font-normal">#ugc #ad</span>
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-white/85 font-mono mt-0.5">
                      <span className="animate-pulse" aria-hidden="true">♫</span>
                      <span className="truncate">
                        Original Sound • {compositionProps.brandName} UGC
                      </span>
                    </div>
                  </div>

                  {/* Right: Vertical TikTok Engagement Stack */}
                  <div className="flex flex-col items-center gap-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-white shrink-0 pb-1" aria-hidden="true">
                    {/* Creator Avatar Pill */}
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full border-2 border-white bg-[#1F3824] flex items-center justify-center font-bold text-xs text-white shadow-md">
                        {compositionProps.brandName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white font-black leading-none ring-1 ring-white">
                        +
                      </div>
                    </div>

                    {/* Like */}
                    <div className="flex flex-col items-center">
                      <Heart className="h-5 w-5 fill-white/20 stroke-white stroke-[2]" />
                      <span className="text-[9px] font-bold">48.2K</span>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col items-center">
                      <MessageCircle className="h-5 w-5 stroke-white stroke-[2]" />
                      <span className="text-[9px] font-bold">1.4K</span>
                    </div>

                    {/* Bookmark */}
                    <div className="flex flex-col items-center">
                      <Bookmark className="h-5 w-5 stroke-white stroke-[2]" />
                      <span className="text-[9px] font-bold">8.9K</span>
                    </div>

                    {/* Share */}
                    <div className="flex flex-col items-center">
                      <Share2 className="h-5 w-5 stroke-white stroke-[2]" />
                      <span className="text-[9px] font-bold">2.1K</span>
                    </div>

                    {/* Rotating Vinyl Record */}
                    <div className="h-6 w-6 rounded-full bg-black/90 border border-white/40 flex items-center justify-center animate-spin">
                      <Disc className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pro Studio Transport Scrubber & Playback Controls */}
      <div className="w-full max-w-[360px] bg-white border border-[#CBD5C4]/80 rounded-2xl p-3 flex flex-col gap-2.5 shadow-sm">
        {/* Scrubber Slider with Full Accessible Range Semantics */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={totalFrames}
            value={currentFrame}
            onChange={handleSeek}
            aria-label="Video Timeline Scrubber"
            aria-valuemin={0}
            aria-valuemax={totalFrames}
            aria-valuenow={currentFrame}
            aria-valuetext={formatTime(currentFrame)}
            className="w-full h-1.5 bg-[#E2E9DC] rounded-lg appearance-none cursor-pointer accent-[#1F3824] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
          />
          <span className="text-[11px] font-mono font-semibold text-[#1F3824] shrink-0" aria-live="off">
            {formatTime(currentFrame)}
          </span>
        </div>

        {/* Transport Toolbar */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video playback" : "Play video playback"}
              className="h-8 px-3 rounded-xl bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={restartVideo}
              aria-label="Replay video from the beginning"
              title="Replay from start"
              className="h-8 w-8 rounded-xl bg-[#ECEFE7] hover:bg-[#E2E9DC] text-[#1B231B] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
              title={isMuted ? "Unmute" : "Mute"}
              className="h-8 w-8 rounded-xl bg-[#ECEFE7] hover:bg-[#E2E9DC] text-[#1B231B] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* 3-Mode Segmented View Selector: Clean (Hero) | Safe Zone | In-Feed */}
          <div
            role="tablist"
            aria-label="Preview display modes"
            className="flex items-center bg-[#F6F7F2] p-0.5 rounded-xl border border-[#CBD5C4] text-[10px] font-bold"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "clean"}
              onClick={() => setViewMode("clean")}
              title="Clean Studio Mode (No overlays)"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] ${
                viewMode === "clean"
                  ? "bg-[#1F3824] text-white shadow-xs"
                  : "text-[#4A544A] hover:text-[#1B231B]"
              }`}
            >
              Clean
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "safe_zone"}
              onClick={() => setViewMode("safe_zone")}
              title="Safe Zone Guides (TikTok & Reels boundaries)"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] ${
                viewMode === "safe_zone"
                  ? "bg-[#1F3824] text-white shadow-xs"
                  : "text-[#4A544A] hover:text-[#1B231B]"
              }`}
            >
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              <span>Safe Zone</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "in_feed"}
              onClick={() => setViewMode("in_feed")}
              title="In-Feed Mockup Preview (Realistic TikTok feed)"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] ${
                viewMode === "in_feed"
                  ? "bg-[#1F3824] text-white shadow-xs"
                  : "text-[#4A544A] hover:text-[#1B231B]"
              }`}
            >
              In-Feed
            </button>
          </div>
        </div>
      </div>

      {/* Quick Visual Persona & Clean Footage Switcher */}
      {onSelectMedia && (
        <div className="w-full max-w-[360px] bg-white border border-[#CBD5C4]/80 rounded-2xl p-2.5 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] px-1 font-semibold text-[#1B231B]">
            <span>Active Creator Footage:</span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                hasActiveVideo
                  ? "text-amber-800 bg-amber-100"
                  : "text-emerald-800 bg-emerald-100"
              }`}
            >
              {hasActiveVideo ? "🎥 Video Clip" : "📸 Clean Studio Persona"}
            </span>
          </div>

          {/* If video has burnt-in captions, offer instant reset to clean persona */}
          {hasActiveVideo && (
            <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10px]">
              <span>Using external video footage.</span>
              <button
                type="button"
                onClick={() => onSelectMedia("/images/creator-glasses.jpg", false)}
                className="font-bold underline hover:text-amber-950 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" />
                Reset to Clean Persona
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Quick creator footage presets">
            <button
              type="button"
              onClick={() => onSelectMedia("/images/study-creator.jpg", false)}
              aria-label="Select Emma UK creator footage"
              className={`px-2 py-1.5 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] ${
                !hasActiveVideo && compositionProps.productImageUrl === "/images/study-creator.jpg"
                  ? "bg-[#1F3824] text-white border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] text-[#4A544A] border-[#CBD5C4] hover:bg-[#E2E9DC]"
              }`}
            >
              👩 Emma (UK)
            </button>
            <button
              type="button"
              onClick={() => onSelectMedia("/images/creator-glasses.jpg", false)}
              aria-label="Select Sarah US creator footage"
              className={`px-2 py-1.5 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] ${
                !hasActiveVideo && compositionProps.productImageUrl === "/images/creator-glasses.jpg"
                  ? "bg-[#1F3824] text-white border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] text-[#4A544A] border-[#CBD5C4] hover:bg-[#E2E9DC]"
              }`}
            >
              👩 Sarah (US)
            </button>
            <button
              type="button"
              onClick={() => onSelectMedia("/images/creator-male.jpg", false)}
              aria-label="Select Alex Tech creator footage"
              className={`px-2 py-1.5 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] ${
                !hasActiveVideo && compositionProps.productImageUrl === "/images/creator-male.jpg"
                  ? "bg-[#1F3824] text-white border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] text-[#4A544A] border-[#CBD5C4] hover:bg-[#E2E9DC]"
              }`}
            >
              👨 Alex (Tech)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
