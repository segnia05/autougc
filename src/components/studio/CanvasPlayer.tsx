"use client";

import React, { useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { UgcAdComposition } from "@/remotion/compositions/UgcAdComposition";
import { UgcAdCompositionProps } from "@/remotion/types";

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

  return (
    <div className={`relative flex items-center justify-center ${className || ""}`}>
      {/* 9:16 Phone Frame Mockup */}
      <div className="relative w-[300px] sm:w-[340px] md:w-[380px] aspect-[9/16] rounded-[36px] p-3 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-2xl border border-prominent">
        {/* Phone Speaker & Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 ml-auto mr-3" />
        </div>

        {/* Remotion Player Container */}
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black shadow-inner">
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
            controls
            autoPlay={false}
            loop
          />
        </div>
      </div>
    </div>
  );
};
