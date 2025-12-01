import WaveformCanvas from "../dj/WaveformCanvas";

export default function WaveformCanvasExample() {
  return (
    <div className="flex flex-col gap-4 p-4 bg-background">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Deck A (Cyan) - Playing</p>
        <WaveformCanvas deckColor="cyan" isPlaying={true} hasAudio={true} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Deck B (Magenta) - Paused</p>
        <WaveformCanvas deckColor="magenta" isPlaying={false} hasAudio={true} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">No Audio Loaded</p>
        <WaveformCanvas deckColor="cyan" isPlaying={false} hasAudio={false} />
      </div>
    </div>
  );
}
