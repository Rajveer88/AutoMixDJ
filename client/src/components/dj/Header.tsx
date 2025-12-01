import { Volume2, Headphones, Keyboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  return (
    <header 
      className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm"
      data-testid="header"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-magenta">
          <Headphones className="h-6 w-6 text-background" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider">
            WARP<span className="text-cyan">D</span><span className="text-magenta">RIVE</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex cursor-help items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
              <Keyboard className="h-4 w-4 text-muted-foreground" />
              <span className="hidden text-xs uppercase tracking-wider text-muted-foreground sm:inline">
                Shortcuts
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1 text-xs">
              <p><span className="font-mono font-bold text-cyan">Q</span> - Play/Pause Deck A</p>
              <p><span className="font-mono font-bold text-magenta">W</span> - Play/Pause Deck B</p>
              <p><span className="font-mono font-bold">S</span> - Sync Tracks</p>
              <p><span className="font-mono font-bold">Space</span> - Toggle Both</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
          <Volume2 className="h-4 w-4 text-green-500" />
          <span className="hidden text-xs uppercase tracking-wider text-muted-foreground sm:inline">
            Audio Active
          </span>
        </div>
        
        <div className="hidden text-xs text-muted-foreground md:block">
          v1.0.0
        </div>
      </div>
    </header>
  );
}
