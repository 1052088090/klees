# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Post-apocalyptic sci-fi HUD-themed portfolio + blog template built with Next.js 14 (Pages Router), TypeScript, and SCSS. Features 3D effects (Three.js), GSAP animations, and a custom Node.js server with SSE real-time stats.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Production server (requires build first)
npm run lint     # ESLint via Next.js
```

## Architecture

### Routing & Pages
Next.js Pages Router. Key dynamic routes:
- `/blog/[slug]` — MDX blog posts from `content/blog/*.mdx`
- `/life/[slug]` — Life item detail views
- `/web/[id]` — Project detail views

### State Management
Pure React Context + custom hooks (no external state library):
- `contexts/AppContext` — Combines animation, power system, typing effects, column hover state
- `contexts/TransitionContext` — Page navigation animations with Web Animations API

### Custom Hooks (`hooks/`)
- `useAnimationSequence` — Loading and column entry animations
- `useLoadingSystem` — Loading screen state machine
- `usePowerSystem` — Power level, inversion mode, tesseract toggle
- `useTypingEffect` — Typewriter text animations
- `useColumnHover` — Navigation column hover text generation
- `useMediaQuery` — Responsive breakpoint detection

### Content System
- **Data-driven**: `data/` directory contains typed TypeScript arrays for projects, experience, life items, skills, friend links
- **Blog**: MDX files in `content/blog/` with YAML frontmatter (title, date, excerpt, tags). Parsed by `lib/blog.ts` using `gray-matter` + `next-mdx-remote`
- **Frontmatter fields**: title, date, excerpt, tags, dossierCode, recordType, relation, summary, notes

### Styling
- SCSS Modules per component (`.module.scss`)
- Global CSS variables in `styles/globals.scss` — dark theme with `--ark-*` prefix
- Responsive breakpoints: desktop (default), tablet (<1024px), mobile (<768px)
- Custom fonts: ZELDA Free (display), Dosis (HUD), Noto Sans/Serif SC (Chinese)

### 3D & Effects (`components/effects/`)
Three.js via `@react-three/fiber` + `@react-three/drei` + `@react-three/cannon`. GSAP for animation sequencing.

### Path Aliases (tsconfig.json)
`@/components/*`, `@/styles/*`, `@/hooks/*`, `@/contexts/*`, `@/data/*`, `@/types/*`, `@/lib/*` — all mapped to root-level directories.

## Configuration

- `.env.local` — `PORT` (default 3000), `NEXT_PUBLIC_SITE_URL` (for sitemap/RSS)
- SVG files are imported as React components via `@svgr/webpack`
- Bundle analysis: `ANALYZE=true npm run build`
- TypeScript strict mode is **off**
