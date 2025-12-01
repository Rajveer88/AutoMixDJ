import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AudioContextOverlay from "./AudioContextOverlay";
import Header from "./Header";
import Deck from "./Deck";
import Mixer from "./Mixer";

declare global {
  interface Window {
    Tone: any;
  }
}

interface DeckState {
  bpm: number;
  isPlaying: boolean;
  fileName: string | null;
  isLoading: boolean;
  playbackRate: number;
  duration: number;
  targetDuration: number;
  playbackStartTime?: number;
}

export default function DJApplication() {
  const { toast } = useToast();
  const [audioStarted, setAudioStarted] = useState(false);
  const [masterBpm, setMasterBpm] = useState(120);
  const [crossfade, setCrossfade] = useState(0.5);
  const [isSynced, setIsSynced] = useState(false);
  const [autoMixEnabled, setAutoMixEnabled] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(8);

  const [deckA, setDeckA] = useState<DeckState>({
    bpm: 120,
    isPlaying: false,
    fileName: null,
    isLoading: false,
    playbackRate: 1.0,
    duration: 0,
    targetDuration: 0,
  });

  const [deckB, setDeckB] = useState<DeckState>({
    bpm: 120,
    isPlaying: false,
    fileName: null,
    isLoading: false,
    playbackRate: 1.0,
    duration: 0,
    targetDuration: 0,
  });

  const grainPlayerA = useRef<any>(null);
  const grainPlayerB = useRef<any>(null);
  const channelA = useRef<any>(null);
  const channelB = useRef<any>(null);
  const crossFadeNode = useRef<any>(null);
  const audioInitialized = useRef(false);
  const autoMixMonitorRef = useRef<number | null>(null);
  const isAutoSwitchingRef = useRef(false);

  const initializeAudio = useCallback(async () => {
    if (audioInitialized.current) return;
    
    if (typeof window.Tone === "undefined") {
      toast({
        title: "Audio Error",
        description: "Tone.js library failed to load. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      await window.Tone.start();
      console.log("Audio context started:", window.Tone.context.state);

      crossFadeNode.current = new window.Tone.CrossFade().toDestination();
      channelA.current = new window.Tone.Channel().connect(crossFadeNode.current.a);
      channelB.current = new window.Tone.Channel().connect(crossFadeNode.current.b);
      crossFadeNode.current.fade.value = crossfade;

      audioInitialized.current = true;
      setAudioStarted(true);

      toast({
        title: "Audio Engine Started",
        description: "Ready to load and mix tracks!",
      });
    } catch (error) {
      console.error("Failed to start audio context:", error);
      toast({
        title: "Audio Error",
        description: "Failed to initialize audio. Please try again.",
        variant: "destructive",
      });
    }
  }, [crossfade, toast]);

  useEffect(() => {
    if (crossFadeNode.current) {
      crossFadeNode.current.fade.value = crossfade;
    }
  }, [crossfade]);

  useEffect(() => {
    if (!audioStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case "q":
          e.preventDefault();
          if (deckA.fileName) togglePlayDeck("A");
          break;
        case "w":
          e.preventDefault();
          if (deckB.fileName) togglePlayDeck("B");
          break;
        case "s":
          e.preventDefault();
          syncTracks();
          break;
        case " ":
          e.preventDefault();
          if (deckA.fileName) togglePlayDeck("A");
          if (deckB.fileName) togglePlayDeck("B");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audioStarted, deckA.fileName, deckB.fileName]);

  const loadAudioFile = useCallback(async (file: File, deck: "A" | "B") => {
    const setDeck = deck === "A" ? setDeckA : setDeckB;
    const grainPlayer = deck === "A" ? grainPlayerA : grainPlayerB;
    const channel = deck === "A" ? channelA : channelB;

    if (!file.type.match(/audio\/(mpeg|wav|mp3|x-wav)/)) {
      toast({
        title: "Invalid File",
        description: "Please upload an MP3 or WAV file.",
        variant: "destructive",
      });
      return;
    }

    setDeck((prev) => ({ ...prev, isLoading: true, isPlaying: false }));

    try {
      if (grainPlayer.current) {
        try {
          grainPlayer.current.stop();
        } catch (e) {
          // Ignore stop errors
        }
        grainPlayer.current.dispose();
        grainPlayer.current = null;
      }

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await window.Tone.context.decodeAudioData(arrayBuffer);
      
      const toneBuffer = new window.Tone.ToneAudioBuffer();
      toneBuffer.set(audioBuffer);

      grainPlayer.current = new window.Tone.GrainPlayer({
        url: toneBuffer,
        loop: true,
        grainSize: 0.1,
        overlap: 0.05,
        playbackRate: 1,
      }).connect(channel.current);

      await window.Tone.loaded();

      setDeck((prev) => ({
        ...prev,
        fileName: file.name,
        isLoading: false,
        duration: audioBuffer.duration,
        targetDuration: audioBuffer.duration,
        playbackRate: 1.0,
      }));

      toast({
        title: `Track Loaded - Deck ${deck}`,
        description: file.name,
      });

      console.log(`Loaded ${file.name} into Deck ${deck} (${audioBuffer.duration.toFixed(1)}s)`);
    } catch (error) {
      console.error(`Error loading audio file:`, error);
      setDeck((prev) => ({ ...prev, isLoading: false }));
      toast({
        title: "Load Error",
        description: `Failed to load ${file.name}. The file may be corrupted.`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const togglePlayDeck = useCallback((deck: "A" | "B") => {
    const grainPlayer = deck === "A" ? grainPlayerA : grainPlayerB;
    const setDeck = deck === "A" ? setDeckA : setDeckB;
    const deckState = deck === "A" ? deckA : deckB;

    if (!grainPlayer.current) {
      toast({
        title: "No Track Loaded",
        description: `Load a track into Deck ${deck} first.`,
      });
      return;
    }

    try {
      if (deckState.isPlaying) {
        grainPlayer.current.stop();
        console.log(`Deck ${deck} stopped`);
      } else {
        grainPlayer.current.start();
        const startTime = window.Tone.context.currentTime;
        console.log(`Deck ${deck} started`);
        setDeck((prev) => ({ ...prev, isPlaying: true, playbackStartTime: startTime }));
        return;
      }
      setDeck((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    } catch (error) {
      console.error(`Error toggling playback:`, error);
      toast({
        title: "Playback Error",
        description: "An error occurred during playback.",
        variant: "destructive",
      });
    }
  }, [deckA.isPlaying, deckB.isPlaying, toast]);

  const syncTracks = useCallback(() => {
    if (deckA.bpm <= 0 || deckB.bpm <= 0) {
      toast({
        title: "Invalid BPM",
        description: "Please set valid BPM values for both decks.",
        variant: "destructive",
      });
      return;
    }

    const rateA = masterBpm / deckA.bpm;
    const rateB = masterBpm / deckB.bpm;

    const clampRate = (rate: number) => Math.max(0.5, Math.min(2.0, rate));
    const clampedRateA = clampRate(rateA);
    const clampedRateB = clampRate(rateB);

    if (grainPlayerA.current) {
      grainPlayerA.current.playbackRate = clampedRateA;
    }
    if (grainPlayerB.current) {
      grainPlayerB.current.playbackRate = clampedRateB;
    }

    setDeckA((prev) => ({ ...prev, playbackRate: clampedRateA }));
    setDeckB((prev) => ({ ...prev, playbackRate: clampedRateB }));
    setIsSynced(true);

    toast({
      title: "Tracks Synchronized",
      description: `Master BPM: ${masterBpm} | A: ${clampedRateA.toFixed(2)}x | B: ${clampedRateB.toFixed(2)}x`,
    });

    console.log(`Synced: Deck A rate = ${clampedRateA.toFixed(3)}, Deck B rate = ${clampedRateB.toFixed(3)}`);
  }, [masterBpm, deckA.bpm, deckB.bpm, toast]);

  const handleMasterBpmChange = useCallback((bpm: number) => {
    const clampedBpm = Math.max(60, Math.min(200, bpm || 60));
    setMasterBpm(clampedBpm);
    setIsSynced(false);
  }, []);

  const handleDeckABpmChange = useCallback((bpm: number) => {
    const clampedBpm = Math.max(60, Math.min(200, bpm || 60));
    setDeckA((prev) => ({ ...prev, bpm: clampedBpm }));
    setIsSynced(false);
  }, []);

  const handleDeckBBpmChange = useCallback((bpm: number) => {
    const clampedBpm = Math.max(60, Math.min(200, bpm || 60));
    setDeckB((prev) => ({ ...prev, bpm: clampedBpm }));
    setIsSynced(false);
  }, []);

  const handleDeckDurationChange = useCallback((deck: "A" | "B", targetDuration: number) => {
    if (targetDuration <= 0) return;

    const setDeck = deck === "A" ? setDeckA : setDeckB;
    const deckState = deck === "A" ? deckA : deckB;
    const grainPlayer = deck === "A" ? grainPlayerA : grainPlayerB;

    const newRate = deckState.duration / targetDuration;
    const clampedRate = Math.max(0.5, Math.min(2.0, newRate));

    if (grainPlayer.current) {
      grainPlayer.current.playbackRate = clampedRate;
    }

    setDeck((prev) => ({
      ...prev,
      targetDuration,
      playbackRate: clampedRate,
    }));
  }, [deckA.duration, deckB.duration]);

  const performAutoMix = useCallback(() => {
    const activeDeck = deckA.isPlaying ? "A" : "B";
    const nextDeck = activeDeck === "A" ? "B" : "A";
    const activeState = activeDeck === "A" ? deckA : deckB;
    const nextState = nextDeck === "A" ? deckA : deckB;
    const activeGrainPlayer = activeDeck === "A" ? grainPlayerA : grainPlayerB;
    const nextGrainPlayer = nextDeck === "A" ? grainPlayerA : grainPlayerB;
    const activeSetDeck = activeDeck === "A" ? setDeckA : setDeckB;
    const nextSetDeck = nextDeck === "A" ? setDeckA : setDeckB;

    if (!nextState.fileName || isAutoSwitchingRef.current) return;

    isAutoSwitchingRef.current = true;
    const crossfadeSec = crossfadeDuration;
    
    console.log(`Auto-mixing: Deck ${activeDeck} → Deck ${nextDeck} (${crossfadeSec}s crossfade)`);

    try {
      // Start next deck immediately for overlap
      if (nextGrainPlayer.current && !nextState.isPlaying) {
        nextGrainPlayer.current.start();
        const nextStartTime = window.Tone.now();
        nextSetDeck((prev) => ({ ...prev, isPlaying: true, playbackStartTime: nextStartTime }));
        console.log(`Deck ${nextDeck} started for crossfade`);
      }

      // Smoothly animate crossfade value from current position to new position
      const startTime = window.Tone.now();
      const startCrossfade = activeDeck === "A" ? 0 : 1;
      const endCrossfade = activeDeck === "A" ? 1 : 0;
      const animationDuration = crossfadeSec;

      const crossfadeInterval = setInterval(() => {
        const elapsed = window.Tone.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const newCrossfade = startCrossfade + (endCrossfade - startCrossfade) * progress;
        
        setCrossfade(newCrossfade);

        if (progress >= 1) {
          clearInterval(crossfadeInterval);
          
          // Stop active deck after crossfade completes
          try {
            if (activeGrainPlayer.current) {
              activeGrainPlayer.current.stop();
              activeSetDeck((prev) => ({ ...prev, isPlaying: false }));
              console.log(`Deck ${activeDeck} stopped after crossfade`);
            }
          } catch (e) {
            console.error(`Error stopping Deck ${activeDeck}:`, e);
          }
          
          isAutoSwitchingRef.current = false;
          console.log(`Auto-mix complete. Now playing: Deck ${nextDeck}`);
        }
      }, 20);
    } catch (e) {
      console.error("Error during auto-mix:", e);
      isAutoSwitchingRef.current = false;
    }
  }, [deckA, deckB, crossfadeDuration]);

  // Auto-mix monitoring effect
  useEffect(() => {
    if (!autoMixEnabled || !audioStarted || (!deckA.isPlaying && !deckB.isPlaying)) {
      if (autoMixMonitorRef.current) {
        clearInterval(autoMixMonitorRef.current);
        autoMixMonitorRef.current = null;
      }
      return;
    }

    autoMixMonitorRef.current = window.setInterval(() => {
      const activeDeck = deckA.isPlaying ? "A" : "B";
      const activeState = activeDeck === "A" ? deckA : deckB;
      
      if (!activeState.playbackStartTime) return;

      const elapsed = window.Tone.now() - activeState.playbackStartTime;
      const trackDuration = activeState.duration / activeState.playbackRate;
      const timeUntilEnd = trackDuration - elapsed;

      // Start crossfade crossfadeDuration seconds before end
      if (timeUntilEnd <= crossfadeDuration && timeUntilEnd > 0) {
        performAutoMix();
      }
    }, 100);

    return () => {
      if (autoMixMonitorRef.current) {
        clearInterval(autoMixMonitorRef.current);
        autoMixMonitorRef.current = null;
      }
    };
  }, [autoMixEnabled, audioStarted, deckA.isPlaying, deckB.isPlaying, deckA, deckB, crossfadeDuration, performAutoMix]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AudioContextOverlay 
        isVisible={!audioStarted} 
        onStart={initializeAudio} 
      />

      {audioStarted && (
        <>
          <Header />
          
          <main className="flex flex-1 flex-wrap items-stretch justify-center gap-6 p-6">
            <Deck
              deckId="A"
              bpm={deckA.bpm}
              onBpmChange={handleDeckABpmChange}
              isPlaying={deckA.isPlaying}
              onPlayPause={() => togglePlayDeck("A")}
              fileName={deckA.fileName}
              onFileLoad={(file) => loadAudioFile(file, "A")}
              isLoading={deckA.isLoading}
              playbackRate={deckA.playbackRate}
              duration={deckA.duration}
              targetDuration={deckA.targetDuration}
              onDurationChange={(targetDuration) => handleDeckDurationChange("A", targetDuration)}
              playbackStartTime={deckA.playbackStartTime}
              autoMixActive={autoMixEnabled}
              crossfadeDuration={crossfadeDuration}
            />

            <Mixer
              masterBpm={masterBpm}
              onMasterBpmChange={handleMasterBpmChange}
              crossfade={crossfade}
              onCrossfadeChange={setCrossfade}
              onSync={syncTracks}
              isSynced={isSynced}
              autoMixEnabled={autoMixEnabled}
              onAutoMixChange={setAutoMixEnabled}
              crossfadeDuration={crossfadeDuration}
              onCrossfadeDurationChange={setCrossfadeDuration}
            />

            <Deck
              deckId="B"
              bpm={deckB.bpm}
              onBpmChange={handleDeckBBpmChange}
              isPlaying={deckB.isPlaying}
              onPlayPause={() => togglePlayDeck("B")}
              fileName={deckB.fileName}
              onFileLoad={(file) => loadAudioFile(file, "B")}
              isLoading={deckB.isLoading}
              playbackRate={deckB.playbackRate}
              duration={deckB.duration}
              targetDuration={deckB.targetDuration}
              onDurationChange={(targetDuration) => handleDeckDurationChange("B", targetDuration)}
              playbackStartTime={deckB.playbackStartTime}
              autoMixActive={autoMixEnabled}
              crossfadeDuration={crossfadeDuration}
            />
          </main>

          <footer className="border-t border-border bg-background/80 px-6 py-3 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground md:gap-8">
              <span>Deck A: {deckA.fileName || "No Track"}</span>
              <span className="hidden text-cyan md:inline">|</span>
              <span>Master: {masterBpm} BPM</span>
              <span className="hidden text-magenta md:inline">|</span>
              <span>Deck B: {deckB.fileName || "No Track"}</span>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-[10px] text-muted-foreground/60">
              <span>[Q] Play/Pause A</span>
              <span>[W] Play/Pause B</span>
              <span>[S] Sync</span>
              <span>[Space] Toggle Both</span>
            </div>
            <div className="mt-3 text-center text-[10px] font-mono tracking-wider">
              <span className="text-cyan/80 drop-shadow-lg" style={{ textShadow: "0 0 8px rgba(0, 212, 255, 0.6)" }}>
                WARPD © Rajveer Ahir
              </span>
            </div>
          </footer>
        </>
      )}

      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
