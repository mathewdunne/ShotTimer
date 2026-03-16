# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start Vite dev server with HMR
bun run build    # TypeScript check + Vite production build
bun run preview  # Preview production build locally
bun run format   # Format and lint with Biome (bunx --bun @biomejs/biome check --write .)
```

No test runner is configured yet.

## Architecture

React 19 + TypeScript + Vite 8 single-page application using Bun as the package manager. ShotTimer is a video analysis tool for measuring shot-to-landing Time of Flight (ToF) using native HTML5 `<video>`.

**Styling:** Tailwind CSS 4 with OKLch CSS custom properties for theming (light/dark/system). Components use Class Variance Authority (CVA) for type-safe variants.

**UI primitives:** Built on `@base-ui/react` (headless components) with shadcn-style wrappers in `src/components/ui/`. Feature components (e.g., theme) live in `src/components/theme/`.

**State:** React Context for theming (`ThemeProvider` + `useTheme` hook, persists to localStorage). No external state library. App-level state lives in `App.tsx` and custom hooks.

**Path aliases:** `@/*` maps to `./src/*` (configured in tsconfig, vite.config.ts, and components.json). Imports use `@/components/...`, `@/hooks/...`, `@/lib/...`, `@/types/...` — never `@/src/`.

## Project Structure

```
src/
├── types/index.ts              # Shot & Settings interfaces
├── hooks/
│   ├── use-video-controller.ts # Video playback: play/pause, seek, frame step, playback rate
│   └── use-shots.ts            # Shot state: mark shot, mark landing, clear, remove
├── components/
│   ├── VideoPlayer.tsx          # Native <video> element wrapper
│   ├── PlaybackControls.tsx     # Scrubber (Slider), time display, transport buttons, speed selector
│   ├── MarkerControls.tsx       # Mark Shot / Mark Landing buttons + pending shot status
│   ├── ShotList.tsx             # Shot list with ToF calculation + average ToF
│   ├── SettingsDialog.tsx       # FPS settings dialog (persisted to localStorage)
│   ├── KeyboardLegend.tsx       # Keyboard shortcut reference card (desktop only)
│   ├── theme/
│   │   ├── theme-provider.tsx   # ThemeProvider context (dark/light/system)
│   │   └── mode-toggle.tsx      # Theme toggle dropdown
│   └── ui/                      # shadcn/base-ui primitives (button, slider, select, dialog, input, separator, dropdown-menu)
├── lib/utils.ts                 # cn() utility + formatTime(seconds) → "M:SS.mmm"
├── App.tsx                      # Main app: upload screen ↔ player UI, keyboard shortcuts
├── App.css                      # Tailwind imports, OKLch theme variables, base layer
└── main.tsx                     # Entry point with ThemeProvider
```

## Key Patterns

- **Two screens:** Upload screen (when `videoFile === null`) and Player UI (when file loaded). Controlled by `videoFile` state in `App.tsx`.
- **Video source:** Uses `URL.createObjectURL(file)` for the video src. Object URLs are revoked on clip change to prevent memory leaks.
- **Frame-accurate playback:** `useVideoController` uses `requestVideoFrameCallback` for time sync (falls back to `timeupdate` event). Frame stepping uses `1 / fps` increments.
- **Shot workflow:** Mark shot time → mark landing time → completed shot with ToF. A "pending shot" tracks the in-progress marking.
- **Settings persistence:** FPS setting stored in localStorage under key `"shottimer-settings"`.
- **Keyboard shortcuts:** Space (play/pause), `,`/`.` (frame step), arrows (1s step), S (mark shot), L (mark landing), X (clear pending). Guarded to not fire in input fields.

## Code Style

- **Formatter/Linter:** Biome — 2-space indent, double quotes, recommended rules, auto-organized imports
- **TypeScript:** Strict mode with `noUnusedLocals`, `noUnusedParameters`, target ES2023
- **File naming:** kebab-case for multi-word files (e.g., `theme-provider.tsx`, `use-video-controller.ts`)
- **Component naming:** PascalCase exports
- **Hook naming:** `use-*.ts` files exporting `use*()` functions
