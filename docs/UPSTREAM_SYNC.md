# Upstream sync playbook (Phase 4)

Manual, agent-driven sync from [shadcn-ui/ui](https://github.com/shadcn-ui/ui) into `@tyohn/registry`. There is no auto-merge bot; divergence is expected after the external-style fork.

## Goals

1. Port new or changed upstream components into `packages/registry/ui/`.
2. Preserve **cn-* CVA hooks** — do not bake Tailwind class strings into TSX.
3. Keep style treatment in `packages/registry/styles/style-*.css`.
4. Regenerate manifests and verify CLI `add` / `apply` smoke.

## When to sync

- Upstream ships a component you need in tyohncn consumers.
- Security or accessibility fix in upstream Base UI registry item.
- New style preset upstream (mira/lyra/nova/rhea/luma/maia/vega/sera) — copy into `packages/registry/styles/`.

Skip sync when upstream changes only inline `transformStyleMap` behavior; tyohncn intentionally does not use that path.

## Pre-flight

```bash
git fetch upstream   # add shadcn-ui/ui as upstream if missing
pnpm registry:build
pnpm cli:build
pnpm --filter tyohncn test
```

Record upstream commit SHA in your PR / agent notes.

## Sync workflow

### 1. Identify the upstream artifact

| Upstream path | tyohncn target |
|---------------|----------------|
| `apps/v4/registry/bases/base-ui/ui/<name>.tsx` | `packages/registry/ui/<name>.tsx` |
| `apps/v4/registry/bases/base-ui/hooks/*` | `packages/registry/hooks/*` |
| `apps/v4/registry/bases/base-ui/lib/utils.ts` | `packages/registry/lib/utils.ts` |
| Style JSON / CSS under registry styles | `packages/registry/styles/style-*.css` |
| Theme tokens | `packages/registry/theme/theme.css` |

Use Base UI base paths, not Radix, unless explicitly adding Radix support later.

### 2. Port component TSX (external transform)

For each file:

1. Copy upstream source into `packages/registry/ui/`.
2. **Keep** `cn-*` strings in CVA `className` maps and `data-slot` patterns.
3. **Remove** any upstream-only imports (`@shadcn/react/*` unless added as peer dep).
4. Replace Radix primitives with `@base-ui/react` equivalents when upstream already did; otherwise port manually.
5. Ensure imports use registry aliases: `@/lib/utils`, `@/components/ui/*`, `@/hooks/*`.
6. Do **not** run shadcn `transformStyleMap` or inline `.cn-*` rules into TSX.

Checklist per component:

- [ ] CVA variants reference `cn-<component>-*` hooks only
- [ ] No hard-coded density/radius chrome that belongs in style CSS
- [ ] `registryDependencies` resolvable (button, label, etc.)
- [ ] npm deps declared in manifest (build-manifest infers most)

### 3. Merge style CSS

1. Diff upstream `style-mira.css` (and vega/nova) against ours.
2. Scope rules under `.style-<preset> .cn-*` (tyohncn convention).
3. Prefer `@apply` for Phase 1 parity; use `*-vars` packs for CSS-variable experiments (Phase 2).
4. Add or update `style-ssota.css` only for brand-specific overrides (see `docs/SSOTA.md`).

### 4. Theme tokens

Merge semantic changes into `packages/registry/theme/theme.css`:

- `:root` / `.dark` variables
- `@theme inline` bridge for Tailwind utilities

Do not move variant/size chrome into theme — that stays in style packs.

### 5. Regenerate manifests

```bash
pnpm registry:build
```

Review `packages/registry/manifest/components.json` and `styles.json` diffs.
Update `scripts/build-manifest.mjs` overrides only when inference is wrong.

### 6. Verify CLI behavior

```bash
pnpm --filter tyohncn test
# or manual:
cd examples/smoke-app && pnpm smoke
tyohncn add <new-component>
tyohncn apply --style vega   # TSX mtime unchanged
```

Confirm added files still contain `cn-*` hooks.

### 7. Studio / docs (optional same PR)

- Studio catalog should list new components after manifest regen.
- Note breaking alias or peer dependency changes in `docs/MONOREPO.md` or package README.

## Conflict resolution

| Situation | Resolution |
|-----------|------------|
| Upstream inlines styles into TSX | Re-extract hooks to `cn-*` + style CSS; do not take inline form |
| Upstream removes `cn-*` | Restore hooks for external mode compatibility |
| New `@shadcn/react` primitive | Add peerDependency on `@tyohn/registry` or reimplement with Base UI |
| Duplicate component name | Keep tyohncn file; merge upstream logic behind our external contract |

## Agent prompt template

```text
Sync <component-name> from shadcn-ui/ui @<sha> into tyohncn @tyohn/registry.

Rules:
- Target: packages/registry/ui/<name>.tsx
- external mode: keep cn-* CVA hooks, no transformStyleMap
- style in packages/registry/styles/, theme in theme/theme.css
- run pnpm registry:build and pnpm --filter tyohncn test
- document npm/registry deps if build-manifest misses them
```

## Exit criteria (per sync batch)

- [ ] Manifests regenerated
- [ ] CLI smoke passes
- [ ] No `IconPlaceholder` or other upstream-only stubs left broken
- [ ] Style swap (`apply`) still leaves TSX untouched
- [ ] Upstream SHA noted for traceability

## Explicitly out of scope

- Automatic scheduled merges from upstream
- Dual inline + external mode in one CLI codepath
- Porting ssota product routes into this repo
