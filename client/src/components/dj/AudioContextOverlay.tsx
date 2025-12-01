import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface AudioContextOverlayProps {
  onStart: () => void;
  isVisible: boolean;
}

export default function AudioContextOverlay({ onStart, isVisible }: AudioContextOverlayProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      data-testid="overlay-audio-context"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-cyan/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-magenta">
            <Volume2 className="h-12 w-12 text-background" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-wider text-foreground">
            AUTO<span className="text-cyan">MIX</span> <span className="text-magenta">DJ</span>
          </h1>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Browser-Based Audio Mixing
          </p>
        </div>

        <Button
          onClick={onStart}
          size="lg"
          className="relative h-16 w-64 overflow-visible bg-gradient-to-r from-cyan to-magenta text-lg font-semibold uppercase tracking-wider text-background transition-all duration-300"
          data-testid="button-start-audio"
        >
          <span className="absolute inset-0 animate-pulse rounded-md bg-gradient-to-r from-cyan/50 to-magenta/50 blur-md" />
          <span className="relative z-10">Start Audio Engine</span>
        </Button>

        <p className="max-w-md text-xs text-muted-foreground">
          Click to enable audio playback. Your browser requires user interaction before playing audio.
        </p>
      </div>
    </div>
  );
}
