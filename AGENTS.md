# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/` contains route files like `index.astro`, dynamic routes (`[slug].astro`), and feed/output endpoints such as `rss.xml.ts` and `og/`.
- `src/components/` holds UI components (PascalCase `.astro` files).
- `src/layouts/` contains shared layouts like `BaseLayout.astro`.
- `src/lib/` hosts TypeScript utilities and data helpers (`rss.ts`, `slugify.ts`, `types.ts`, `waveform.ts`).
- `src/styles/` is for global styles (`global.css`).
- `public/` stores static assets served as-is.
- `dist/` is the production build output.

## Build, Test, and Development Commands
Run commands from the repo root:
- `bun install` installs dependencies.
- `bun dev` starts the Astro dev server at `localhost:4321`.
- `bun build` builds the static site into `dist/`.
- `bun preview` serves the production build locally.
- `bun astro check` runs Astro’s type and content checks.

## Coding Style & Naming Conventions
- Indentation is 2 spaces in `.astro` and `.ts` files.
- Use single quotes in TypeScript imports and strings to match existing files.
- Components are PascalCase (`Header.astro`), utilities are lower-case (`slugify.ts`).
- Tailwind CSS is used for styling; keep shared styles in `src/styles/global.css`.
- TypeScript is in strict mode (`astro/tsconfigs/strict`), and `@/` maps to `src/`.
- No formatter or linter is configured; keep formatting consistent with nearby files.

## Configuration & Deployment Notes
- The project is configured for Cloudflare via `@astrojs/cloudflare` in `astro.config.mjs` and uses `wrangler.toml` for compatibility settings. Update `compatibility_date` if Cloudflare tooling requires it.

## Deployment
- Deployment is manual. Run: `bun build && npx wrangler pages deploy dist`
