# AGENTS.md

## Cursor Cloud specific instructions

- **Current state: pnpm + Turborepo monorepo with Faraday-style skillization + design packs.** Packages: `tyohncn` CLI, `@tyohn/registry`, `@tyohn/studio`, `packages/official-packs`.
- **Build & verify:** `pnpm install`, `pnpm registry:build`, `pnpm cli:build`, `pnpm --filter tyohncn test`, `pnpm sync:official-packs`, `pnpm sync:skills`, `pnpm publish:packages:dry`.
- **CLI contract:** external mode only — never `transformStyleMap` / strip `cn-*`. `apply --style` swaps CSS only (builtin or pack source). `pack add/new/validate` for community design packs. `component new/check` for cn-* + style-token authoring. `studio` opens project-bound Studio (`TYOHN_PROJECT_ROOT`).
- **Skills:** Install via `npx skills add ssota-labs/tyohncn`. Canonical `.agents/skills/` + plugin mirrors; lockfile `skills-lock.json`.
- **ssota boundary:** tyohncn = infra; ssota = consumer (`pack add ssota` / `style-ssota`). See `docs/SSOTA.md`.
- **Upstream:** manual agent sync from shadcn-ui/ui — `docs/UPSTREAM_SYNC.md`.
- **Update script:** lockfile-guarded `pnpm` install on startup. Node 22+, pnpm 10 preinstalled.
