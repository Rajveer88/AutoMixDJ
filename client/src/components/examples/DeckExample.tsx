import { useState } from "react";
import Deck from "../dj/Deck";

export default function DeckExample() {
  const [bpm, setBpm] = useState(128);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState<string | null>("example_track.mp3");
  const [duration, setDuration] = useState(240);
  const [targetDuration, setTargetDuration] = useState(240);

  return (
    <div className="bg-background p-4">
      <Deck
        deckId="A"
        bpm={bpm}
        onBpmChange={setBpm}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        fileName={fileName}
        onFileLoad={(file) => {
          console.log("File loaded:", file.name);
          setFileName(file.name);
        }}
        isLoading={false}
        playbackRate={1.0}
        duration={duration}
        targetDuration={targetDuration}
        onDurationChange={setTargetDuration}
      />
    </div>
  );
}
