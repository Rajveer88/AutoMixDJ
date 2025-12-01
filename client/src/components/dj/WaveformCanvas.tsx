import { useEffect, useRef } from "react";

interface WaveformCanvasProps {
  deckColor: "cyan" | "magenta";
  isPlaying: boolean;
  hasAudio: boolean;
}

export default function WaveformCanvas({ deckColor, isPlaying, hasAudio }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const primaryColor = deckColor === "cyan" ? "#00d4ff" : "#ff00aa";
      const secondaryColor = deckColor === "cyan" ? "#00d4ff33" : "#ff00aa33";

      ctx.fillStyle = "rgba(15, 15, 20, 0.8)";
      ctx.fillRect(0, 0, width, height);

      if (!hasAudio) {
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.fillStyle = deckColor === "cyan" ? "#00d4ff66" : "#ff00aa66";
        ctx.font = "14px 'Rajdhani', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("NO TRACK LOADED", width / 2, height / 2 - 10);
        return;
      }

      const barCount = 64;
      const barWidth = width / barCount - 2;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        
        let barHeight: number;
        if (isPlaying) {
          const wave = Math.sin((i + offsetRef.current) * 0.2) * 0.5 + 0.5;
          const noise = Math.random() * 0.3;
          barHeight = (wave + noise) * (height * 0.4);
        } else {
          const staticWave = Math.sin(i * 0.15) * 0.3 + 0.3;
          barHeight = staticWave * (height * 0.3);
        }

        const gradient = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(0.5, secondaryColor);
        gradient.addColorStop(1, primaryColor);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, centerY - barHeight, barWidth, barHeight * 2);
      }

      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 1, 0);
      ctx.lineTo(width / 2 - 1, height);
      ctx.stroke();

      if (isPlaying) {
        offsetRef.current += 2;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [deckColor, isPlaying, hasAudio]);

  const glowColor = deckColor === "cyan" ? "shadow-[0_0_15px_rgba(0,212,255,0.3)]" : "shadow-[0_0_15px_rgba(255,0,170,0.3)]";
  const borderColor = deckColor === "cyan" ? "border-cyan/50" : "border-magenta/50";

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={128}
      className={`w-full h-32 rounded-lg border ${borderColor} ${glowColor}`}
      data-testid={`canvas-waveform-${deckColor}`}
    />
  );
}
