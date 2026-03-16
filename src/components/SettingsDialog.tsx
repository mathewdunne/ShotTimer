import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Settings } from "@/types";

interface SettingsDialogProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function SettingsDialog({ settings, onSave }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [fps, setFps] = useState(settings.fps);

  const handleOpen = (value: boolean) => {
    if (value) {
      setFps(settings.fps);
    }
    setOpen(value);
  };

  const handleSave = () => {
    const clampedFps = Math.max(1, Math.min(240, fps));
    onSave({ fps: clampedFps });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" title="Settings" />}
      >
        <SettingsIcon className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure video analysis parameters.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <label htmlFor="fps-input" className="text-sm font-medium">
              Video FPS
            </label>
            <Input
              id="fps-input"
              type="number"
              min={1}
              max={240}
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="w-24"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Frames per second of your video. Used for frame-step calculations.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
