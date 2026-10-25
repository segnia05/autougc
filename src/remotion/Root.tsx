import React from "react";
import { Composition } from "remotion";
import { UgcAdComposition } from "./compositions/UgcAdComposition";
import { DEFAULT_COMPOSITION_PROPS } from "./types";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UgcAd"
        component={UgcAdComposition}
        durationInFrames={450} // 15 seconds at 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={DEFAULT_COMPOSITION_PROPS}
      />
    </>
  );
};
