import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RefreshCw, Zap } from "lucide-react";

interface MixerProps {
  masterBpm: number;
  onMasterBpmChange: (bpm: number) => void;
  crossfade: number;
  onCrossfadeChange: (value: number) => void;
  onSync: () => void;
  isSynced: boolean;
  autoMixEnabled?: boolean;
  onAutoMixChange?: (enabled: boolean) => void;
  crossfadeDuration?: number;
  onCrossfadeDurationChange?: (duration: number) => void;
}

export default function Mixer({
  masterBpm,
  onMasterBpmChange,
  crossfade,
  onCrossfadeChange,
  onSync,
  isSynced,
  autoMixEnabled = false,
  onAutoMixChange,
  crossfadeDuration = 8,
  onCrossfadeDurationChange,
}: MixerProps) {
  return (
    <div 
      className="flex w-80 flex-col gap-6 rounded-xl border border-border bg-card/50 p-6 shadow-[0_0_30px_rgba(0,212,255,0.1),0_0_30px_rgba(255,0,170,0.1)] backdrop-blur-sm"
      data-testid="mixer-section"
    >
      <div className="border-b border-gradient-to-r from-cyan to-magenta pb-2">
        <h2 className="bg-gradient-to-r from-cyan to-magenta bg-clip-text text-center text-xl font-bold uppercase tracking-widest text-transparent">
          Mixer
        </h2>
      </div>

      <div className="space-y-2 text-center">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Master BPM
        </Label>
        <div className="flex items-center justify-center gap-2">
          <Input
            type="number"
            value={masterBpm}
            onChange={(e) => onMasterBpmChange(Number(e.target.value))}
            min={60}
            max={200}
            className="h-16 w-28 border-border bg-background/50 text-center font-mono text-4xl font-bold text-foreground focus:border-primary focus:ring-primary/30"
            data-testid="input-master-bpm"
          />
        </div>
        <Slider
          value={[masterBpm]}
          onValueChange={([value]) => onMasterBpmChange(value)}
          min={60}
          max={200}
          step={1}
          className="mt-2"
          data-testid="slider-master-bpm"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>60</span>
          <span>200</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={onSync}
          className={`relative h-14 w-full overflow-visible text-lg font-semibold uppercase tracking-wider transition-all duration-300 ${
            isSynced
              ? "bg-gradient-to-r from-cyan to-magenta text-background shadow-[0_0_20px_rgba(0,212,255,0.4),0_0_20px_rgba(255,0,170,0.4)]"
              : "bg-muted text-foreground hover:bg-gradient-to-r hover:from-cyan/80 hover:to-magenta/80 hover:text-background"
          }`}
          data-testid="button-sync"
        >
          <RefreshCw className={`mr-2 h-5 w-5 ${isSynced ? "animate-spin" : ""}`} />
          {isSynced ? "Synced" : "Sync Tracks"}
        </Button>

        <Button
          onClick={() => onAutoMixChange?.(!autoMixEnabled)}
          className={`relative h-12 w-full overflow-visible text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
            autoMixEnabled
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-background shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
          data-testid="button-auto-mix"
        >
          <Zap className={`mr-2 h-4 w-4 ${autoMixEnabled ? "animate-pulse" : ""}`} />
          {autoMixEnabled ? "Auto-Mix ON" : "Auto-Mix OFF"}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-cyan">A</span>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Crossfader
          </Label>
          <span className="text-lg font-bold text-magenta">B</span>
        </div>

        <div className="relative">
          <div className="absolute inset-0 h-3 rounded-full bg-gradient-to-r from-cyan via-muted to-magenta opacity-30" />
          <Slider
            value={[crossfade]}
            onValueChange={([value]) => onCrossfadeChange(value)}
            min={0}
            max={1}
            step={0.01}
            className="relative"
            data-testid="slider-crossfade"
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="text-cyan">100% A</span>
          <span className="text-magenta">100% B</span>
        </div>

        <div className="mt-2 flex justify-center gap-4 text-sm">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Deck A Vol</div>
            <div className="font-mono font-bold text-cyan">
              {Math.round((1 - crossfade) * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Deck B Vol</div>
            <div className="font-mono font-bold text-magenta">
              {Math.round(crossfade * 100)}%
            </div>
          </div>
        </div>
      </div>

      {autoMixEnabled && (
        <div className="space-y-2 border-t border-border pt-4">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Crossfade Duration
          </Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[crossfadeDuration]}
              onValueChange={([value]) => onCrossfadeDurationChange?.(value)}
              min={2}
              max={16}
              step={1}
              className="flex-1"
              data-testid="slider-crossfade-duration"
            />
            <span className="w-8 text-right font-mono text-sm text-foreground">{crossfadeDuration}s</span>
          </div>
        </div>
      )}

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center justify-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isSynced ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {isSynced ? "Tracks Synchronized" : "Not Synchronized"}
          </span>
        </div>
      </div>
    </div>
  );
}
