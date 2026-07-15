# Authoring components (style-token separation)

Greenfield components must keep **density/chrome in CSS**, not in TSX CVA maps.

## Contract

| Layer | TSX | CSS |
|-------|-----|-----|
| Root | `cn-<name>` | `.cn-<name> { … }` |
| Variant | `cn-<name>-variant-<v>` | matching rule |
| Size | `cn-<name>-size-<s>` | matching rule + `--cn-<name>-*` |
| Subpart | `cn-<name>-<part>` | matching rule |

Allowed in the CVA **base** string: structural utilities (`inline-flex`, `outline-none`, `disabled:opacity-50`, …).  
**Forbidden** in variant/size map values: `h-*`, `px-*`, `rounded-*`, etc. — those belong in style CSS.

## Scaffold

```bash
# In the tyohncn monorepo (writes packages/registry by default):
tyohncn component new callout --mode css-vars --styles mira-vars,ssota

# In a consumer app:
tyohncn component new callout --into . --styles mira-vars

tyohncn component check callout
```

What `component new` writes:

1. `ui/<name>.tsx` — CVA with `cn-*` hooks only
2. Style stubs in selected `style-*.css` (marker `/* tyohncn:component:<name> */`)
3. Registry mode: merges `--cn-<name>-*` into `manifest/tokens.json`

Then: `pnpm registry:build` → consumers `tyohncn add <name>`.

## Upstream ports

For shadcn ports, follow [docs/UPSTREAM_SYNC.md](../../../../docs/UPSTREAM_SYNC.md).  
For **new** components (not upstream), prefer `component new` first, then flesh out Base UI primitives.

## Icons

Use `IconPlaceholder` in registry sources; CLI resolves the library on `add` / `apply --icon`.

## Checklist

- [ ] `tyohncn component check <name>` passes (no density-in-TSX errors)
- [ ] Style stubs cover every `cn-<name>*` hook used
- [ ] App root uses the style scope class (`style-mira`, `style-ssota`, …)
- [ ] Prefer `--mode css-vars` so Studio can edit `--cn-*`
