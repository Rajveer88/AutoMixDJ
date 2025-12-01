import { useState } from "react";
import AudioContextOverlay from "../dj/AudioContextOverlay";

export default function AudioContextOverlayExample() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AudioContextOverlay
      isVisible={isVisible}
      onStart={() => {
        console.log("Audio context started");
        setIsVisible(false);
      }}
    />
  );
}
