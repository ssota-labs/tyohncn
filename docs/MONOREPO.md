# Packages & naming

| Item | Decision |
|------|----------|
| Repo | `tyohncn` (`ssota-labs/tyohncn`) |
| npm scope | `@tyohn/*` |
| CLI package / bin | `tyohncn` (`npx tyohncn`) |
| Registry package | `@tyohn/registry` |
| Studio app | `@tyohn/studio` |
| Docs app | `@tyohn/docs` |
| Package manager | **pnpm** (workspaces) + **Turborepo** |
| Node | `>=22` (align with CI; ssota uses 24.x) |

## Monorepo layout

```text
tyohncn/
  apps/
    studio/          # Next.js Studio (@tyohn/studio; `tyohncn studio`)
    docs/            # Docs site
  packages/
    cli/             # published as `tyohncn`
    registry/        # Base UI components + styles + theme
  plugins/           # Faraday-style installable agent skills (skills.sh)
  examples/
    smoke-app/       # CLI smoke consumer
  docs/              # Architecture / playbooks (markdown)
  .agents/skills/    # ssota ENV-02 mirrors (sync via pnpm sync:skills)
  skills-lock.json
```

Publish dry-run: `pnpm publish:packages:dry` (packs `tyohncn`, `@tyohn/registry`, `@tyohn/studio`).  
Studio binds to a consumer project via `TYOHN_PROJECT_ROOT` (set by `tyohncn studio`).

## ssota boundary

| Concern | Owner |
|---------|-------|
| Fork CLI, registry, style packs, Studio | **tyohncn** (infra) |
| Brand preset `style-ssota`, product UI, Design Lab consumer | **ssota** (consumer) |
| Pattern source (3-layer Theme/Style/Component) | ssota → generalized here |

Do not vendor ssota product routes into this repo. ssota consumes tyohncn via CLI + style pack.

## Skills (Next.js apps)

Next.js work follows skills installed via [skills.sh](https://skills.sh) the same way ssota does:

- Canonical: `.agents/skills/`
- Mirrors: `.cursor/skills/`, `.claude/skills/`
- Lockfile: `skills-lock.json`

Key skills for Studio: `vercel-react-best-practices`, `next-dev-loop`, `shadcn`, `web-design-guidelines`, `frontend-design`.
