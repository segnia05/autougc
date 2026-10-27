"use client";

import React, { useRef, useState } from "react";
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
} from "lucide-react";

interface CanvasPlayerProps {
  compositionProps: UgcAdCompositionProps;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export const CanvasPlayer: React.FC<CanvasPlayerProps> = ({
  compositionProps,
  className,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  React.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);

    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
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

  return (
    <div className={`relative flex flex-col items-center gap-4 ${className || ""}`}>
      {/* 9:16 Phone Frame Mockup in Luxury Natural Titanium Chassis */}
      <div className="relative w-[300px] sm:w-[340px] md:w-[370px] aspect-[9/16] rounded-[48px] p-3 bg-gradient-to-b from-[#E7EBE2] via-[#DFE5D9] to-[#D5DDCF] shadow-[0_25px_60px_-15px_rgba(31,56,36,0.18)] border border-[#C2CCBC] select-none">

        {/* CNC Chamfer Inner Ring */}
        <div className="relative w-full h-full rounded-[40px] p-0.5 bg-gradient-to-b from-white/90 via-[#CBD5C4]/50 to-[#CBD5C4]/90 shadow-xs">

          {/* Screen Display Container */}
          <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-[#F6F7F2] shadow-inner">

            {/* Top iOS Status Bar */}
            <div className="absolute top-0 inset-x-0 h-10 px-6 z-40 flex items-center justify-between text-[11px] font-semibold text-white/90 drop-shadow-md pointer-events-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-white/90">
                <span className="text-[10px] font-bold tracking-tighter">5G</span>
                <Wifi className="h-3 w-3 stroke-[2.5]" />
                <Battery className="h-3.5 w-3.5 stroke-[2]" />
              </div>
            </div>

            {/* Dynamic Island Pill Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1B231B] rounded-full z-40 flex items-center justify-between px-2.5 shadow-md pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-[#2D382E] ring-1 ring-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#4A544A]" />
            </div>

            {/* Remotion Player Container */}
            <div className="relative w-full h-full">
              <Player
                ref={playerRef}
                component={UgcAdComposition}
                inputProps={compositionProps}
                durationInFrames={450}
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

            {/* Simulated TikTok / Reels In-Feed Overlay */}
            {showOverlay && (
              <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 pt-12 pb-6">
                {/* Spacer */}
                <div />

                {/* Bottom Overlay Row: Meta Details + Vertical Action Bar */}
                <div className="flex items-end justify-between gap-3">
                  {/* Left: Creator Handle & Caption */}
                  <div className="flex flex-col gap-1.5 max-w-[70%] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      @{compositionProps.brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.growth
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <p className="text-[11px] text-white/95 line-clamp-2 leading-tight font-medium">
                      {compositionProps.hookText}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-white/80 font-mono">
                      <span>♫</span>
                      <span className="truncate">Original Sound • AutoUGC High-Converting UGC</span>
                    </div>
                  </div>

                  {/* Right: Vertical TikTok Engagement Stack */}
                  <div className="flex flex-col items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">
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
                      <span className="text-[10px] font-bold">24.8K</span>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col items-center">
                      <MessageCircle className="h-6 w-6 stroke-white stroke-[2]" />
                      <span className="text-[10px] font-bold">842</span>
                    </div>

                    {/* Bookmark */}
                    <div className="flex flex-col items-center">
                      <Bookmark className="h-6 w-6 stroke-white stroke-[2]" />
                      <span className="text-[10px] font-bold">4.1K</span>
                    </div>

                    {/* Share */}
                    <div className="flex flex-col items-center">
                      <Share2 className="h-6 w-6 stroke-white stroke-[2]" />
                      <span className="text-[10px] font-bold">1.2K</span>
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

      {/* Modern Studio Control Bar */}
      <div className="flex items-center justify-between gap-3 w-full max-w-[370px] px-2 py-1.5 bg-white border border-[#CBD5C4]/70 rounded-full shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className="h-8 px-3 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
            className="h-8 w-8 rounded-full bg-[#ECEFE7] hover:bg-[#E2E9DC] text-[#1B231B] flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Overlay Toggle Button */}
          <button
            type="button"
            onClick={() => setShowOverlay(!showOverlay)}
            className={`h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${showOverlay
              ? "bg-[#E2E9DC] border-[#1F3824] text-[#1F3824]"
              : "bg-transparent border-[#CBD5C4] text-[#4A544A] hover:bg-[#ECEFE7]"
              }`}
          >
            {showOverlay ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>In-Feed UI</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Clean</span>
              </>
            )}
          </button>

          <span className="hidden sm:inline-flex text-[10px] font-mono font-medium text-[#717E6C] px-2 py-0.5 rounded-full bg-[#F6F7F2] border border-[#CBD5C4]/60">
            9:16 HD
          </span>
        </div>
      </div>
    </div>
  );
};
