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

React 19 + TypeScript + Vite 8 single-page application using Bun as the package manager.

**Styling:** Tailwind CSS 4 with OKLch CSS custom properties for theming (light/dark/system). Components use Class Variance Authority (CVA) for type-safe variants.

**UI primitives:** Built on `@base-ui/react` (headless components) with shadcn-style wrappers in `src/components/ui/`. Feature components (e.g., theme) live in `src/components/theme/`.

**State:** React Context for theming (`ThemeProvider` + `useTheme` hook, persists to localStorage). No external state library.

**Path aliases:** `@/*` maps to `./src/*` (configured in both tsconfig and vite.config.ts).

## Code Style

- **Formatter/Linter:** Biome — 2-space indent, double quotes, recommended rules, auto-organized imports
- **TypeScript:** Strict mode with `noUnusedLocals`, `noUnusedParameters`, target ES2023
- **File naming:** kebab-case for multi-word files (e.g., `theme-provider.tsx`)
- **Component naming:** PascalCase exports
