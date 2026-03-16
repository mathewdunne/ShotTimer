import { Crosshair, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import type { Shot } from "@/types";

interface MarkerControlsProps {
  currentTime: number;
  pendingShot: Shot | null;
  onMarkShot: (time: number) => void;
  onMarkLanding: (time: number) => void;
  onClearPending: () => void;
}

export function MarkerControls({
  currentTime,
  pendingShot,
  onMarkShot,
  onMarkLanding,
  onClearPending,
}: MarkerControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button className="flex-1" onClick={() => onMarkShot(currentTime)}>
          <Crosshair className="size-4" />
          Mark Shot
        </Button>
        <Button
          className="flex-1"
          variant="secondary"
          onClick={() => onMarkLanding(currentTime)}
          disabled={!pendingShot}
        >
          <Target className="size-4" />
          Mark Landing
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {pendingShot ? (
          <>
            <span>
              Shot marked at{" "}
              <span className="font-mono">
                {formatTime(pendingShot.shotTime)}
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onClearPending}
              title="Clear pending shot"
            >
              <X className="size-3" />
            </Button>
          </>
        ) : (
          <span>No shot marked</span>
        )}
      </div>
    </div>
  );
}
