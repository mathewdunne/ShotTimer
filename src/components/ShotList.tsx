import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/utils";
import type { Shot } from "@/types";

interface ShotListProps {
  shots: Shot[];
  pendingShot: Shot | null;
  onRemoveShot: (id: string) => void;
}

export function ShotList({ shots, pendingShot, onRemoveShot }: ShotListProps) {
  const completedShots = shots.filter(
    (s): s is Shot & { landingTime: number } => s.landingTime !== null,
  );
  const averageToF =
    completedShots.length > 1
      ? completedShots.reduce(
          (sum, s) => sum + (s.landingTime - s.shotTime),
          0,
        ) / completedShots.length
      : null;

  if (shots.length === 0 && !pendingShot) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
        No shots recorded yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {shots.map((shot, i) => (
        <div
          key={shot.id}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
        >
          <span className="w-6 shrink-0 text-muted-foreground">#{i + 1}</span>
          <div className="flex flex-1 flex-wrap gap-x-3 gap-y-0.5 font-mono text-xs">
            <span>
              Shot:{" "}
              <span className="text-foreground">
                {formatTime(shot.shotTime)}
              </span>
            </span>
            <span>
              Land:{" "}
              <span className="text-foreground">
                {shot.landingTime !== null
                  ? formatTime(shot.landingTime)
                  : "\u2014"}
              </span>
            </span>
            {shot.landingTime !== null && (
              <span className="text-primary">
                ToF: {(shot.landingTime - shot.shotTime).toFixed(3)}s
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRemoveShot(shot.id)}
            title="Remove shot"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ))}

      {pendingShot && (
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
          <span className="w-6 shrink-0">#{shots.length + 1}</span>
          <div className="flex flex-1 flex-wrap gap-x-3 gap-y-0.5 font-mono text-xs">
            <span>Shot: {formatTime(pendingShot.shotTime)}</span>
            <span>Land: {"\u2014"}</span>
          </div>
        </div>
      )}

      {averageToF !== null && (
        <>
          <Separator className="my-1" />
          <div className="px-2 py-1 text-sm font-medium">
            Average ToF:{" "}
            <span className="font-mono text-primary">
              {averageToF.toFixed(3)}s
            </span>
          </div>
        </>
      )}
    </div>
  );
}
