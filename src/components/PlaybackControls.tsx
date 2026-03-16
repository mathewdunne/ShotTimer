import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";

interface PlaybackControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  onSeek: (t: number) => void;
  onTogglePlayPause: () => void;
  onStepFrames: (n: number) => void;
  onStepSeconds: (n: number) => void;
  onSetPlaybackRate: (rate: number) => void;
  onPause: () => void;
}

const SPEED_OPTIONS = ["0.25x", "0.5x", "1x", "1.5x", "2x"];

export function PlaybackControls({
  currentTime,
  duration,
  isPlaying,
  playbackRate,
  onSeek,
  onTogglePlayPause,
  onStepFrames,
  onStepSeconds,
  onSetPlaybackRate,
  onPause,
}: PlaybackControlsProps) {
  return (
    <div className="space-y-3">
      {/* Scrubber */}
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 1}
        step={0.001}
        onValueChange={(val) => {
          const v = Array.isArray(val) ? val[0] : val;
          onPause();
          onSeek(v);
        }}
      />

      {/* Time display */}
      <div className="text-center font-mono text-sm text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Transport buttons + speed selector */}
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStepSeconds(-1)}
          title="-1 second"
          className="flex flex-col gap-0 h-auto py-1.5 w-9"
        >
          <ChevronsLeft className="size-4" />
          <span className="text-[9px] leading-none text-muted-foreground">
            1s
          </span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStepFrames(-1)}
          title="-1 frame"
          className="flex flex-col gap-0 h-auto py-1.5 w-9"
        >
          <ChevronLeft className="size-4" />
          <span className="text-[9px] leading-none text-muted-foreground">
            1f
          </span>
        </Button>
        <Button
          variant="default"
          size="icon-lg"
          onClick={onTogglePlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="size-5" />
          ) : (
            <Play className="size-5" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStepFrames(1)}
          title="+1 frame"
          className="flex flex-col gap-0 h-auto py-1.5 w-9"
        >
          <ChevronRight className="size-4" />
          <span className="text-[9px] leading-none text-muted-foreground">
            1f
          </span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onStepSeconds(1)}
          title="+1 second"
          className="flex flex-col gap-0 h-auto py-1.5 w-9"
        >
          <ChevronsRight className="size-4" />
          <span className="text-[9px] leading-none text-muted-foreground">
            1s
          </span>
        </Button>

        <div className="ml-2">
          <Select
            value={`${playbackRate}x`}
            onValueChange={(val) => {
              if (val) onSetPlaybackRate(Number.parseFloat(val));
            }}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="1x" />
            </SelectTrigger>
            <SelectContent>
              {SPEED_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
