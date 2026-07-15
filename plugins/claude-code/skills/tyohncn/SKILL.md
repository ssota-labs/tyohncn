---
name: tyohncn
description: >
  Help set up and manage tyohncn — an external-style shadcn/ui fork where
  components keep cn-* CVA hooks and visual treatment lives in CSS style packs.
  Use when someone wants tyohncn, external style, mira/vega presets, cn-* hooks,
  component studio, or to init/add/apply Base UI components without inlining
  Tailwind into TSX. Triggers on "tyohncn", "external style", "cn-*",
  "mira/vega", "style pack", "component studio".
---

# tyohncn — external-style component system

You help a creator (or coding agent) wire **tyohncn** into a project and manage
components via CLI + Studio. Prefer the **published** packages; fall back to the
monorepo during local development.

## Two zones (non-negotiable)

| Zone | Path | Rule |
|------|------|------|
| **Author area** | `components/ui/**`, `styles/style-*.css`, `tyohncn.json`, theme in globals | You write / CLI writes here |
| **Dependency** | `tyohncn`, `@tyohn/registry`, `@tyohn/studio` | Pinned npm packages — do not fork or vendor |

External mode only: **never** run shadcn `transformStyleMap` / strip `cn-*`.
Style preset changes are **CSS swaps** (`tyohncn apply --style`).

## Invoking the CLI

```bash
npx tyohncn@latest <args>                 # canonical (after publish)
# monorepo / pre-publish:
node /path/to/tyohncn/packages/cli/dist/index.js <args>
# or from the tyohncn repo:
pnpm cli:build && pnpm --filter tyohncn exec node dist/index.js <args>
```

## Build loop

1. **Init** — `npx tyohncn@latest init --style mira --icon lucide`
2. **Add** — `npx tyohncn@latest add button input card` (and more as needed)
3. **Install icon packages** printed by init (e.g. `pnpm add lucide-react`)
4. **Studio** — `npx tyohncn@latest studio` → open the printed localhost URL
5. **Preview** styles/icons in Studio (preview only)
6. **Confirm** with CLI: `tyohncn apply --style vega` / `tyohncn apply --icon tabler`
7. **Verify** — app builds; components still contain `cn-*` hooks

## Commands cheat sheet

| Command | Effect |
|---------|--------|
| `init --style --icon` | `tyohncn.json` + theme + style CSS |
| `add <names…>` | Copy components; resolve IconPlaceholder → icon lib |
| `apply --style` | CSS-only swap; TSX unchanged |
| `apply --icon` | Re-resolve icons from registry into installed TSX |
| `list components\|styles\|icons` | Catalog |
| `studio` | Open Studio bound to cwd (`TYOHN_PROJECT_ROOT`) |

See [references/cli.md](references/cli.md) and [references/studio.md](references/studio.md).

## Style & icon presets

Styles (shadcn packs): `mira` `lyra` `nova` `rhea` `luma` `maia` `vega` `sera`  
Plus vars: `mira-vars` `vega-vars` and brand `ssota`.

Icons: `lucide` `tabler` `hugeicons` `phosphor` `remixicon`

`mira` = `@apply`-only upstream pack. `mira-vars` = same look with `--cn-*` for Studio editing.

## Agent rules

1. Prefer `npx tyohncn@latest` once published; otherwise monorepo fallback.
2. After Studio preview, always confirm with `apply` — Studio does not write files yet.
3. Keep `cn-*` in component TSX; put look in `styles/style-*.css`.
4. Wrap the app root with the style scope class (e.g. `className="style-mira"`).
5. Do not invent Radix dual-base or inline style-map mode.

## Install this skill

```bash
npx skills add ssota-labs/tyohncn
```

Paste-ready creator prompt:

```text
이 앱에 tyohncn 깔고 mira + lucide로 button/input/card 넣고 Studio 열어줘
```
