# ssota boundary & style-ssota

tyohncn generalizes patterns first proven in **ssota**. This doc defines what lives in each repo and how `style-ssota` fits the style-pack model.

## Roles

| | **tyohncn** (infra) | **ssota** (consumer) |
|---|---------------------|----------------------|
| Owns | CLI, `@tyohn/registry`, style packs, Studio | Product UI, brand, Design Lab experience |
| Ships | `npx tyohncn`, mira/vega/nova + vars packs | App routes, business logic, brand tokens |
| Pattern source | Generalizes ssota 3-layer model | Origin of Theme / Style / Component split |

**Rule:** Do not vendor ssota product code into tyohncn. ssota installs components and styles via the CLI like any external consumer.

## Three layers (shared model)

```text
Theme   →  theme.css (:root + @theme inline)     semantic color, radius, font
Style   →  style-*.css (.style-<preset> .cn-*)   density, chrome, size scale
Component →  Base UI + cva(cn-*)                 structure + hooks only
```

ssota's `globals.css` + `style-ssota.css` + `cn-*` CVA pattern is the reference implementation. tyohncn extracts that into reusable packages.

## style-ssota

`packages/registry/styles/style-ssota.css` is the **brand preset** for ssota:

- Scoped under `.style-ssota`
- Mode: `css-vars` (see `manifest/styles.json`)
- Intended for ssota apps using `tyohncn apply --style ssota` or `init --style ssota`

Other consumers should default to `mira`, `vega`, or `nova` unless they intentionally adopt ssota branding.

### Consumer wiring (ssota app)

```bash
tyohncn init --style ssota --css app/globals.css
# or migrate:
tyohncn apply --style ssota
```

`globals.css` should import:

1. Theme — `@tyohn/registry/theme.css` (or project copy from init)
2. Active style — `styles/style-ssota.css` with `.style-ssota` scope class on root layout

Component TSX in the consumer keeps `cn-*` hooks; visual changes flow from CSS only.

## What moves where (migration checklist)

| Concern | From ssota | To tyohncn |
|---------|------------|------------|
| Button/card/etc. registry TSX | Design Lab copies | `@tyohn/registry` via `tyohncn add` |
| `style-ssota.css` | App styles dir | `packages/registry/styles/style-ssota.css` |
| Semantic tokens | `globals.css` :root | `packages/registry/theme/theme.css` |
| Catalog / token editors | Design Lab pages | `@tyohn/studio` (Phase 3) |
| Auth, billing, product routes | ssota app | **stays in ssota** |

## Drift prevention

- `pnpm registry:build` — component/style manifests + `tokens.json`
- Studio reads the same manifests as CLI (`docs/THEME_VS_STYLE.md`)
- ssota should pin tyohncn version once published; until then, workspace or git ref

## Agent guidance

1. **Infra changes** (new component, CLI flag, style pack) → tyohncn repo.
2. **Brand tweaks** (ssota-specific density, marketing chrome) → `style-ssota.css` in registry, not scattered in ssota TSX.
3. **Product behavior** → ssota only.
4. When ssota needs a new primitive, add to registry upstream-sync path (`docs/UPSTREAM_SYNC.md`), then `tyohncn add` in ssota.

## Success signal (Phase 4 exit)

ssota runs on tyohncn CLI + `style-ssota` with no duplicated registry TSX in the ssota repo, and preset switches in tyohncn Studio match ssota Design Lab expectations.
