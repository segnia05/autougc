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
  Eye,
  EyeOff,
  Wifi,
  Battery,
  ShieldCheck,
  Volume2,
  VolumeX,
} from "lucide-react";

interface CanvasPlayerProps {
  compositionProps: UgcAdCompositionProps;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
  onSelectMedia?: (mediaUrl: string, isVideo?: boolean) => void;
}

export const CanvasPlayer: React.FC<CanvasPlayerProps> = ({
  compositionProps,
  className,
  onSelectMedia,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showSafeZone, setShowSafeZone] = useState(false);
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

  return (
    <div className={`relative flex flex-col items-center gap-4 ${className || ""}`}>
      {/* 9:16 Phone Frame Mockup in Natural Titanium Architectural Finish */}
      <div className="relative w-[300px] sm:w-[340px] md:w-[360px] aspect-[9/16] rounded-[52px] p-3.5 bg-gradient-to-b from-[#E2E7DC] via-[#D5DDCF] to-[#CBD5C4] shadow-[0_30px_70px_-20px_rgba(31,56,36,0.25)] border border-[#BDC8B7] select-none">
        {/* Chamfered Bezel Ring */}
        <div className="relative w-full h-full rounded-[44px] p-0.5 bg-gradient-to-b from-white/95 via-[#CBD5C4]/60 to-[#CBD5C4]/95 shadow-xs">
          {/* Screen Display Container */}
          <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-[#1B231B] shadow-inner">
            {/* Top iOS Status Bar */}
            <div className="absolute top-0 inset-x-0 h-10 px-6 z-40 flex items-center justify-between text-[11px] font-semibold text-white/90 drop-shadow-md pointer-events-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-white/90">
                <span className="text-[10px] font-bold tracking-tighter">5G</span>
                <Wifi className="h-3 w-3 stroke-[2.5]" />
                <Battery className="h-3.5 w-3.5 stroke-[2]" />
              </div>
            </div>

            {/* Dynamic Island Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#111611] rounded-full z-40 flex items-center justify-between px-2.5 shadow-md pointer-events-none border border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#1F3824] ring-1 ring-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#4A544A]" />
            </div>

            {/* Remotion Player Container */}
            <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
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

            {/* Official TikTok & Instagram Reels Safe Zone Overlay */}
            {showSafeZone && (
              <div className="absolute inset-0 z-35 pointer-events-none border-2 border-emerald-400/80 m-3 rounded-2xl flex flex-col justify-between p-3">
                <div className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded self-center uppercase tracking-wider backdrop-blur-xs">
                  TikTok & Reels Safe Zone (Visible)
                </div>
                {/* Danger zone indicators */}
                <div className="h-28 border-t border-dashed border-rose-400/60 bg-rose-500/10 rounded-b-xl flex items-center justify-center">
                  <span className="text-[9px] font-mono text-rose-300 font-bold uppercase">
                    Bottom UI Zone (Captions & Buttons)
                  </span>
                </div>
              </div>
            )}

            {/* Simulated TikTok / Reels In-Feed Overlay */}
            {showOverlay && (
              <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 pt-12 pb-5">
                <div />

                {/* Bottom Overlay Row: Meta Details + Vertical Action Bar */}
                <div className="flex items-end justify-between gap-3">
                  {/* Left: Creator Handle & Caption */}
                  <div className="flex flex-col gap-1 max-w-[72%] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      @{compositionProps.brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.official
                      <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
                    </span>
                    <p className="text-[11px] text-white/95 line-clamp-2 leading-tight font-medium">
                      {compositionProps.hookText}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/80 font-mono mt-0.5">
                      <span>♫</span>
                      <span className="truncate">Original Sound • {compositionProps.brandName} UGC</span>
                    </div>
                  </div>

                  {/* Right: Vertical TikTok Engagement Stack */}
                  <div className="flex flex-col items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-white">
                    {/* Creator Avatar Pill */}
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full border-2 border-white bg-[#1F3824] flex items-center justify-center font-bold text-xs text-white shadow-md">
                        {compositionProps.brandName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white font-black leading-none">
                        +
                      </div>
                    </div>

                    {/* Like */}
                    <div className="flex flex-col items-center">
                      <Heart className="h-6 w-6 fill-white/20 stroke-white stroke-[2]" />
                      <span className="text-[10px] font-bold">48.2K</span>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col items-center">
                      <MessageCircle className="h-6 w-6 stroke-white stroke-[2]" />
                      <span className="text-[10px] font-bold">1.4K</span>
                    </div>

                    {/* Bookmark */}
                    <div className="flex flex-col items-center">
                      <Bookmark className="h-6 w-6 stroke-white stroke-[2]" />
                      <span className="text-[10px] font-bold">8.9K</span>
                    </div>

                    {/* Share */}
                    <div className="flex flex-col items-center">
                      <Share2 className="h-6 w-6 stroke-white stroke-[2]" />
                      <span className="text-[10px] font-bold">2.1K</span>
                    </div>

                    {/* Spinning Audio Disc */}
                    <div className="h-7 w-7 rounded-full bg-black/80 border border-white/40 flex items-center justify-center animate-spin">
                      <Disc className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-28 h-1 bg-white/70 rounded-full mx-auto mt-2" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pro Studio Transport Scrubber & Playback Controls */}
      <div className="w-full max-w-[360px] bg-white border border-[#CBD5C4]/80 rounded-2xl p-3 flex flex-col gap-2.5 shadow-sm">
        {/* Scrubber Slider */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={totalFrames}
            value={currentFrame}
            onChange={handleSeek}
            aria-label="Timeline Scrubber"
            className="w-full h-1.5 bg-[#E2E9DC] rounded-lg appearance-none cursor-pointer accent-[#1F3824]"
          />
          <span className="text-[11px] font-mono font-semibold text-[#1F3824] shrink-0">
            {formatTime(currentFrame)}
          </span>
        </div>

        {/* Transport Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              className="h-8 px-3 rounded-xl bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={restartVideo}
              title="Replay from start"
              className="h-8 w-8 rounded-xl bg-[#ECEFE7] hover:bg-[#E2E9DC] text-[#1B231B] flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute" : "Mute"}
              className="h-8 w-8 rounded-xl bg-[#ECEFE7] hover:bg-[#E2E9DC] text-[#1B231B] flex items-center justify-center transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-600" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Safe Zone Toggle */}
            <button
              type="button"
              onClick={() => setShowSafeZone(!showSafeZone)}
              title="Toggle Safe Zone Guides"
              className={`h-8 px-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                showSafeZone
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                  : "bg-transparent border-[#CBD5C4] text-[#4A544A] hover:bg-[#ECEFE7]"
              }`}
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Safe Zone</span>
            </button>

            {/* In-Feed Overlay Toggle */}
            <button
              type="button"
              onClick={() => setShowOverlay(!showOverlay)}
              title="Toggle TikTok UI Overlay"
              className={`h-8 px-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                showOverlay
                  ? "bg-[#E2E9DC] border-[#1F3824] text-[#1F3824]"
                  : "bg-transparent border-[#CBD5C4] text-[#4A544A] hover:bg-[#ECEFE7]"
              }`}
            >
              {showOverlay ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              <span>{showOverlay ? "In-Feed" : "Clean"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Visual Persona & Video Media Switcher */}
      {onSelectMedia && (
        <div className="w-full max-w-[360px] bg-white border border-[#CBD5C4]/80 rounded-2xl p-2.5 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] px-1 font-semibold text-[#1B231B]">
            <span>Active Creator Footage:</span>
            <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
              {compositionProps.videoUrl ? "🎥 Real UGC Video" : "📸 Handheld Creator"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onSelectMedia("/videos/organic_selfie.mp4", true)}
              className={`px-2 py-1.5 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer ${
                compositionProps.videoUrl === "/videos/organic_selfie.mp4"
                  ? "bg-[#1F3824] text-white border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] text-[#4A544A] border-[#CBD5C4] hover:bg-[#E2E9DC]"
              }`}
            >
              🎥 UGC Video
            </button>
            <button
              type="button"
              onClick={() => onSelectMedia("/images/creator-glasses.jpg", false)}
              className={`px-2 py-1.5 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer ${
                !compositionProps.videoUrl && compositionProps.productImageUrl === "/images/creator-glasses.jpg"
                  ? "bg-[#1F3824] text-white border-[#1F3824] shadow-xs"
                  : "bg-[#F6F7F2] text-[#4A544A] border-[#CBD5C4] hover:bg-[#E2E9DC]"
              }`}
            >
              👩 Sarah (US)
            </button>
            <button
              type="button"
              onClick={() => onSelectMedia("/images/creator-male.jpg", false)}
              className={`px-2 py-1.5 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer ${
                !compositionProps.videoUrl && compositionProps.productImageUrl === "/images/creator-male.jpg"
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
