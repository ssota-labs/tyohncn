# AGENTS.md

## Cursor Cloud specific instructions

- **Current state: pnpm + Turborepo monorepo (Phases 0–3 MVP done; Phase 4 publish/ssota migration open).** Packages: `packages/cli` (`tyohncn`), `packages/registry` (`@tyohn/registry`), `apps/studio`, `apps/docs`. See `docs/MONOREPO.md` and `ROADMAP.md`.
- **Build & verify:** `pnpm install`, `pnpm registry:build`, `pnpm cli:build`, `pnpm --filter tyohncn test`, `pnpm --filter @tyohn/studio build`.
- **CLI contract:** external mode only — never `transformStyleMap` / strip `cn-*`. `apply --style` swaps CSS only.
- **Skills (required for Next.js):** Install/use via [skills.sh](https://skills.sh) like ssota — canonical `.agents/skills/`, mirrors `.cursor/skills/` + `.claude/skills/`, lockfile `skills-lock.json`. Do not edit mirrors directly. Key skills: `vercel-react-best-practices`, `next-dev-loop`, `shadcn`, `web-design-guidelines`. Repo-local CLI skill: `skills/tyohncn/SKILL.md`.
- **ssota boundary:** tyohncn = infra; ssota = consumer (`style-ssota`). See `docs/SSOTA.md`.
- **Upstream:** manual agent sync from shadcn-ui/ui — `docs/UPSTREAM_SYNC.md`.
- **Update script:** lockfile-guarded `pnpm` install on startup. Node 22+, pnpm 10 preinstalled.
