---
name: tyohncn
description: >
  Use the tyohncn CLI to init, add, and apply external-style shadcn
  components. Keeps cn-* CVA hooks in TSX; style presets live in CSS.
  Use when scaffolding or updating a consumer app with @tyohn/registry.
---

# tyohncn CLI (Phase 4)

tyohncn is an **external-style** fork of shadcn/ui. Components ship with
`cn-*` class hooks; visual treatment lives in scoped `style-*.css` files.
`apply --style` swaps CSS only — component TSX is never rewritten.

## When to use

- Bootstrapping a new app with Base UI + external style packs
- Adding registry components without inlining Tailwind into CVA
- Switching mira → vega (or `mira-vars`, `style-ssota`) via CSS import only
- Verifying smoke: `button`, `input`, `card` after init

## Prerequisites

- Node `>=22`
- Built CLI in monorepo: `pnpm cli:build` (or `npx tyohncn` once published)
- Registry manifests: `pnpm registry:build`

## Commands

### `tyohncn init`

Creates `tyohncn.json`, copies theme + initial style CSS, wires
`globals.css` import, and records the icon library.

```bash
tyohncn init --style mira --icon lucide --css app/globals.css
```

Icon libraries (same as shadcn): `lucide` | `tabler` | `hugeicons` | `phosphor` | `remixicon`

Config defaults (`mode: external`, `base: base-ui`):

- `styles/style-<preset>.css` — scoped under `.style-<preset>`
- `app/globals.css` — `@import` theme + active style
- `tyohncn.json` — aliases, css paths, active style, `iconLibrary`

### `tyohncn add <components...>`

Copies components from `@tyohn/registry` with **cn-* hooks intact**.
Resolves `IconPlaceholder` into the configured icon library (like shadcn
`transformIcons`). Never runs `transformStyleMap` or strips `cn-*`.

```bash
tyohncn add button input card dialog
```

Installs transitive registry deps and `lib/utils.ts` / hooks as needed.

### `tyohncn apply`

```bash
# CSS only — component TSX unchanged
tyohncn apply --style vega

# Re-resolve icons from registry into installed components
tyohncn apply --icon tabler
```

### `tyohncn list <kind>`

```bash
tyohncn list components
tyohncn list styles
tyohncn list icons
```

## Style presets

| Name | Mode | Notes |
|------|------|-------|
| `mira` | apply | Default density / chrome (`@apply`) |
| `vega` | apply | Alternate preset |
| `nova` | apply | Alternate preset |
| `mira-vars` | css-vars | CSS custom properties (Phase 2) |
| `vega-vars` | css-vars | CSS custom properties |
| `ssota` | css-vars | Brand preset for ssota consumer |

See `docs/THEME_VS_STYLE.md` for theme vs style token boundaries.

## Monorepo smoke

From repo root after build:

```bash
pnpm registry:build && pnpm cli:build
cd examples/smoke-app && pnpm smoke
```

Or run CLI tests: `pnpm --filter tyohncn test`

## Agent rules

1. **External mode only** — never inline style maps into component TSX.
2. **CSS swap for preset changes** — use `apply --style`, not file rewrites.
3. **Registry source of truth** — `packages/registry`; run `registry:build` after component/style edits.
4. **Upstream sync** — follow `docs/UPSTREAM_SYNC.md` when porting from shadcn-ui/ui.
5. **ssota boundary** — tyohncn is infra; ssota consumes `style-ssota` (see `docs/SSOTA.md`).

## Related docs

- `docs/MONOREPO.md` — layout, naming, skills.sh
- `docs/THEME_VS_STYLE.md` — theme vs style tokens
- `docs/UPSTREAM_SYNC.md` — agent manual upstream port
- `docs/SSOTA.md` — consumer vs infra boundary
