import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, Upload, Music, Zap } from "lucide-react";
import WaveformCanvas from "./WaveformCanvas";

type DeckType = "A" | "B";

interface DeckProps {
  deckId: DeckType;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  fileName: string | null;
  onFileLoad: (file: File) => void;
  isLoading: boolean;
  playbackRate: number;
  duration: number;
  targetDuration: number;
  onDurationChange: (duration: number) => void;
  playbackStartTime?: number;
  autoMixActive?: boolean;
  crossfadeDuration?: number;
}

export default function Deck({
  deckId,
  bpm,
  onBpmChange,
  isPlaying,
  onPlayPause,
  fileName,
  onFileLoad,
  isLoading,
  playbackRate,
  duration,
  targetDuration,
  onDurationChange,
  playbackStartTime,
  autoMixActive,
  crossfadeDuration = 8,
}: DeckProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!isPlaying || !playbackStartTime || !duration) {
      setElapsedTime(0);
      setTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = window.Tone?.context?.currentTime - playbackStartTime;
      setElapsedTime(elapsed);
      const trackDuration = duration / playbackRate;
      setTimeRemaining(Math.max(0, trackDuration - elapsed));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackStartTime, duration, playbackRate]);

  const deckColor = deckId === "A" ? "cyan" : "magenta";
  const glowClass = deckId === "A" 
    ? "shadow-[0_0_20px_rgba(0,212,255,0.2)]" 
    : "shadow-[0_0_20px_rgba(255,0,170,0.2)]";
  const borderClass = deckId === "A" ? "border-cyan/30" : "border-magenta/30";
  const headerBorderClass = deckId === "A" ? "border-cyan" : "border-magenta";
  const textColorClass = deckId === "A" ? "text-cyan" : "text-magenta";

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "audio/mpeg" || file.type === "audio/wav")) {
      onFileLoad(file);
    }
  };

  return (
    <div 
      className={`flex-1 rounded-xl border ${borderClass} ${glowClass} bg-card/50 p-6 backdrop-blur-sm`}
      data-testid={`deck-${deckId.toLowerCase()}`}
    >
      <div className={`mb-4 border-b-2 ${headerBorderClass} pb-2 flex items-center justify-between`}>
        <h2 className={`text-2xl font-bold uppercase tracking-widest ${textColorClass}`}>
          Deck {deckId}
        </h2>
        {isPlaying && (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full animate-pulse ${deckColor === 'cyan' ? 'bg-cyan' : 'bg-magenta'}`} />
            <span className="text-xs font-mono text-muted-foreground">LIVE</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,audio/mpeg,audio/wav"
          onChange={handleFileChange}
          className="hidden"
          data-testid={`input-file-${deckId.toLowerCase()}`}
        />

        <div
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all duration-200 ${
            isDragging
              ? deckId === "A"
                ? "border-cyan bg-cyan/10"
                : "border-magenta bg-magenta/10"
              : "border-muted-foreground/30 hover:border-muted-foreground/50"
          }`}
          data-testid={`dropzone-${deckId.toLowerCase()}`}
        >
          {isLoading ? (
            <div className={`h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${
              deckId === "A" ? "border-cyan" : "border-magenta"
            }`} />
          ) : fileName ? (
            <>
              <Music className={`h-5 w-5 ${textColorClass}`} />
              <span className="max-w-[200px] truncate text-sm text-foreground">{fileName}</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Drop MP3/WAV or Click</span>
            </>
          )}
        </div>

        <WaveformCanvas 
          deckColor={deckColor} 
          isPlaying={isPlaying} 
          hasAudio={!!fileName}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <Label 
              htmlFor={`bpm-${deckId}`} 
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Original BPM
            </Label>
            <Input
              id={`bpm-${deckId}`}
              type="number"
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              min={60}
              max={200}
              className={`h-14 w-32 text-center font-mono text-2xl font-bold ${
                deckId === "A" 
                  ? "border-cyan/30 focus:border-cyan focus:ring-cyan/30" 
                  : "border-magenta/30 focus:border-magenta focus:ring-magenta/30"
              }`}
              data-testid={`input-bpm-${deckId.toLowerCase()}`}
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              onClick={onPlayPause}
              disabled={!fileName}
              size="icon"
              className={`h-16 w-16 rounded-full transition-all duration-200 ${
                deckId === "A"
                  ? isPlaying
                    ? "bg-cyan text-cyan-foreground shadow-[0_0_20px_rgba(0,212,255,0.5)]"
                    : "bg-cyan/80 text-cyan-foreground hover:bg-cyan"
                  : isPlaying
                    ? "bg-magenta text-magenta-foreground shadow-[0_0_20px_rgba(255,0,170,0.5)]"
                    : "bg-magenta/80 text-magenta-foreground hover:bg-magenta"
              } disabled:opacity-30`}
              data-testid={`button-play-${deckId.toLowerCase()}`}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 translate-x-0.5" />
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              {isPlaying ? "PLAYING" : "PAUSED"}
            </span>
          </div>

          <div className="flex-1 text-right">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Playback Rate
            </Label>
            <div className={`font-mono text-2xl font-bold ${textColorClass}`}>
              {playbackRate.toFixed(2)}x
            </div>
          </div>
        </div>

        {duration > 0 && (
          <>
            {isPlaying && (
              <div className="mt-4 space-y-2 border-t border-muted/30 pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Playback Progress
                  </Label>
                  <div className="text-xs font-mono text-muted-foreground">
                    {elapsedTime.toFixed(1)}s / {(duration / playbackRate).toFixed(1)}s
                  </div>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${deckId === 'A' ? 'bg-cyan' : 'bg-magenta'}`}
                    style={{ width: `${(elapsedTime / (duration / playbackRate)) * 100}%` }}
                  />
                </div>
                {autoMixActive && timeRemaining <= crossfadeDuration && timeRemaining > 0 && (
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${deckId === 'A' ? 'bg-cyan/10 border border-cyan/30' : 'bg-magenta/10 border border-magenta/30'}`}>
                    <Zap className={`h-3 w-3 animate-pulse ${textColorClass}`} />
                    <span className="text-[10px] font-mono font-bold text-yellow-400">AUTO-MIX IN {timeRemaining.toFixed(1)}s</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-muted/30 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Duration Stretch
                </Label>
                <div className="text-xs font-mono text-muted-foreground">
                  {duration.toFixed(1)}s → {targetDuration.toFixed(1)}s
                </div>
              </div>
              <input
                type="range"
                min="15"
                max={Math.max(duration * 2, 300)}
                step="5"
                value={targetDuration}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all ${
                  deckId === "A"
                    ? "bg-cyan/20 accent-cyan"
                    : "bg-magenta/20 accent-magenta"
                }`}
                data-testid={`slider-duration-${deckId.toLowerCase()}`}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>15s</span>
                <span className={`font-mono font-bold ${textColorClass}`}>
                  {(duration / targetDuration).toFixed(2)}x
                </span>
                <span>{Math.max(duration * 2, 300).toFixed(0)}s</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
