import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" title="How to use" />}
      >
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to Use</DialogTitle>
          <DialogDescription>
            Measure the Time of Flight (ToF) of game pieces from your shooter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Set your video's FPS in settings (gear icon)</li>
            <li>
              Step frame-by-frame to the <strong>shot</strong> moment and press{" "}
              <kbd className="rounded border bg-muted px-1 font-mono text-xs">
                S
              </kbd>{" "}
              or tap <strong>Mark Shot</strong>
            </li>
            <li>
              Step forward to the <strong>landing</strong> moment and press{" "}
              <kbd className="rounded border bg-muted px-1 font-mono text-xs">
                L
              </kbd>{" "}
              or tap <strong>Mark Landing</strong>
            </li>
            <li>Repeat for multiple shots to see the average ToF</li>
          </ol>

          <div className="space-y-2 rounded-lg border p-3">
            <div>
              <span className="font-medium">Shot</span>
              <span className="text-muted-foreground">
                {" "}
                — the first frame where you can see the ball moving out of the
                shooter
              </span>
            </div>
            <div>
              <span className="font-medium">Landing</span>
              <span className="text-muted-foreground">
                {" "}
                — the ball breaking the plane of the outer hub rim
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
