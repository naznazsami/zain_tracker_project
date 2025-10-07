# Copilot Instructions for AI Coding Agents

## Project Overview

- This is a Next.js app (TypeScript, App Router) bootstrapped with `create-next-app`.
- Main app code is in `src/app/`, with feature areas as subfolders (e.g., `Admin/`, `Dashboard/`, `login/`, `register/`).
- Shared UI components are in `src/components/ui/`.
- Business logic and actions are in `src/actions.ts`.
- Utility functions are in `src/lib/utils.ts`.

## Key Patterns & Conventions

- **Routing:** Uses Next.js App Router. Each folder in `src/app/` with a `page.tsx` is a route. Nested folders represent nested routes/layouts.
- **Layouts:** Each major route (e.g., `Admin`, `Dashboard`) has its own `layout.tsx` for shared structure.
- **Components:** Prefer colocating feature-specific components (e.g., `Home/Categories.tsx`) and using `ui/` for reusable primitives.
- **Forms:** Login and registration forms are in `src/components/login-form.tsx` and `register-form.tsx`.
- **Sidebar/Nav:** Main navigation is in `app-sidebar.tsx` and `Navbar.tsx`.
- **Styling:** Uses global CSS (`globals.css`) and component-level styles. PostCSS config is present.
- **Icons/Assets:** SVGs are stored in `public/`.

## Developer Workflows

- **Start Dev Server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
- **Build:** `npm run build`.
- **Lint:** `npx eslint .` (config: `eslint.config.mjs`).
- **Typecheck:** `npx tsc` (config: `tsconfig.json`).
- **No built-in tests** (as of this analysis).

## Integration Points

- **External:** Next.js, TypeScript, PostCSS, ESLint.
- **Fonts:** Uses `next/font` for Geist font.
- **Deployment:** Vercel recommended (see README).

## Examples

- To add a new route: create a folder in `src/app/` with `page.tsx`.
- To add a reusable button: use or extend `src/components/ui/button.tsx`.
- To update navigation: edit `app-sidebar.tsx` or `Navbar.tsx`.

## Tips for AI Agents

- Follow Next.js App Router conventions for routing/layouts.
- Use TypeScript for all new code.
- Prefer colocated components for features, and `ui/` for shared primitives.
- Reference `actions.ts` for business logic entry points.
- Check `README.md` for basic commands and deployment info.

---

_If any section is unclear or missing, please provide feedback for improvement._
