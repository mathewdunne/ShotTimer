import { Crosshair, FilePlus2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { KeyboardLegend } from "@/components/KeyboardLegend";
import { MarkerControls } from "@/components/MarkerControls";
import { PlaybackControls } from "@/components/PlaybackControls";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ShotList } from "@/components/ShotList";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useShots } from "@/hooks/use-shots";
import { useVideoController } from "@/hooks/use-video-controller";
import type { Settings } from "@/types";

const SETTINGS_KEY = "shottimer-settings";
const DEFAULT_SETTINGS: Settings = { fps: 30 };

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!videoFile) {
      setVideoSrc(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const controller = useVideoController({ fps: settings.fps });
  const shotsState = useShots();

  const handleSaveSettings = useCallback((s: Settings) => {
    setSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }, []);

  const handleNewClip = useCallback(() => {
    setVideoFile(null);
    shotsState.clearAll();
  }, [shotsState]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setVideoFile(file);
    },
    [],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) {
      setVideoFile(file);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!videoFile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          controller.togglePlayPause();
          break;
        case ",":
          e.preventDefault();
          controller.stepFrames(-1);
          break;
        case ".":
          e.preventDefault();
          controller.stepFrames(1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          controller.stepSeconds(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          controller.stepSeconds(1);
          break;
        case "s":
        case "S":
          e.preventDefault();
          shotsState.markShot(controller.currentTime);
          break;
        case "l":
        case "L":
          e.preventDefault();
          shotsState.markLanding(controller.currentTime);
          break;
        case "x":
        case "X":
          e.preventDefault();
          shotsState.clearPending();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [videoFile, controller, shotsState]);

  // Upload screen
  if (!videoSrc) {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: drop zone for file upload
      <div
        className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-4"
        onDragOver={(_e) => _e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="absolute top-3 right-3">
          <ModeToggle />
        </div>
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <Crosshair className="size-7" />
          ShotTimer
        </div>
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 p-12 transition-colors hover:border-muted-foreground/50 hover:bg-muted/50">
          <FilePlus2 className="size-10 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Drop a video file here or click to browse
          </span>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>
    );
  }

  // Player UI
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 border-b px-4 py-2">
        <div className="flex items-center gap-2 font-semibold">
          <Crosshair className="size-4" />
          ShotTimer
        </div>
        <div className="flex-1" />
        <SettingsDialog settings={settings} onSave={handleSaveSettings} />
        <ModeToggle />
        <Button variant="outline" size="sm" onClick={handleNewClip}>
          New Clip
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left: Video + Controls */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <VideoPlayer videoRef={controller.videoRef} src={videoSrc} />

          <PlaybackControls
            currentTime={controller.currentTime}
            duration={controller.duration}
            isPlaying={controller.isPlaying}
            playbackRate={controller.playbackRate}
            onSeek={controller.seek}
            onTogglePlayPause={controller.togglePlayPause}
            onStepFrames={controller.stepFrames}
            onStepSeconds={controller.stepSeconds}
            onSetPlaybackRate={controller.setPlaybackRate}
            onPause={controller.pause}
          />

          <Separator />

          <MarkerControls
            currentTime={controller.currentTime}
            pendingShot={shotsState.pendingShot}
            onMarkShot={shotsState.markShot}
            onMarkLanding={shotsState.markLanding}
            onClearPending={shotsState.clearPending}
          />

          <KeyboardLegend />
        </div>

        {/* Right: Shot list */}
        <div className="flex w-full flex-col border-t md:w-80 md:border-t-0 md:border-l">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h2 className="text-sm font-medium">Shots</h2>
            {shotsState.shots.length > 0 && (
              <Button
                variant="ghost"
                size="xs"
                onClick={shotsState.clearAll}
                className="text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ShotList
              shots={shotsState.shots}
              pendingShot={shotsState.pendingShot}
              onRemoveShot={shotsState.removeShot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
