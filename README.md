# ShotTimer

A browser-based video analysis tool for measuring **Time of Flight (ToF)** of game pieces launched by FRC robot shooters. Built for tuning shooters during the 2026 *FIRST* Robotics Competition game, **Rebuilt**.

## What it does

ShotTimer lets you load a slow-motion or regular-speed video of your robot shooting, then step through it frame-by-frame to mark the exact moment a game piece leaves the shooter and the moment it lands. It calculates the Time of Flight between those two events so you can compare shooter configurations and tune launch parameters.

### Workflow

1. Record a video of your robot shooting (higher FPS = more precision)
2. Drop the video file into ShotTimer
3. Configure the video's FPS by clicking on the settings gear
4. Scrub or step frame-by-frame to the moment the game piece leaves the shooter — press **S** or tap **Mark Shot**
5. Step forward to the moment it lands — press **L** or tap **Mark Landing**
6. ShotTimer records the ToF and keeps a running average across all shots

## Features

- Frame-by-frame stepping (uses `requestVideoFrameCallback` for accuracy)
- Configurable FPS to match your camera's recording rate
- Adjustable playback speed (0.25x - 2x)
- Shot list with individual ToF and running average
- Keyboard shortcuts for fast workflow
- Works entirely in the browser — no uploads, no server, no internet required
- Dark/light/system theme

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| `,` / `.` | Step back / forward one frame |
| Left / Right Arrow | Step back / forward one second |
| S | Mark shot |
| L | Mark landing |
| X | Clear pending shot |

## Development

Requires [Bun](https://bun.sh).

```bash
bun install        # Install dependencies
bun dev            # Start dev server with HMR
bun run build      # TypeScript check + production build
bun run format     # Format and lint with Biome
```

## Tech Stack

React 19, TypeScript, Vite 8, Tailwind CSS 4, shadcn/ui (base-ui), Biome
