# Design packs

Community (and official) **design packs** ship style + optional theme as a
manifest folder — Faraday module-pack style.

## Install

```bash
tyohncn pack list
tyohncn pack add ssota                 # official
tyohncn pack add mira-vars
tyohncn pack add ./my-brand-pack       # local
tyohncn pack add some-org/acme-pack    # GitHub owner/repo[/sub]
tyohncn pack add npm:@scope/acme-pack  # npm
```

`tyohncn apply --style <pack-or-builtin>` also resolves official packs and
external sources the same way.

## What gets written

| Path | Content |
|------|---------|
| `styles/style-<name>.css` | Style pack |
| `styles/theme-<name>.css` | Theme (if pack has `theme`) |
| `tyohncn.json` | `style`, `packs[]` |
| `.tyohn/packs/<name>/` | Skill half |
| `.tyohn/provenance.json` | Installed pack record |
| `AGENTS.md` | Pointer block (created/appended) |

Component TSX is never rewritten by pack install.

## Authoring

See [authoring-packs.md](./authoring-packs.md).

```bash
tyohncn pack new acme --mode css-vars
tyohncn pack validate ./acme
tyohncn pack add ./acme
```

## Builtin vs pack

- `tyohncn list styles` — registry builtins (`mira`, `vega`, …)
- `tyohncn pack list` — official design packs (`ssota`, `mira-vars`, …)
- Builtins stay in `@tyohn/registry`; packs are the community distribution path
