# Authoring a design pack

## Layout

```text
my-pack/
├─ pack.json          # required
├─ style.css          # required — scoped under .style-<name>
├─ theme.css          # optional — :root / .dark tokens
├─ skill/pack.md      # optional — agent knowledge
└─ quality.md         # optional
```

## Minimal `pack.json`

```json
{
  "name": "acme",
  "displayName": "Acme Brand",
  "description": "Dense marketing UI",
  "kind": "design",
  "style": {
    "file": "style.css",
    "scopeClass": "style-acme",
    "mode": "css-vars"
  },
  "theme": { "file": "theme.css" },
  "skill": {
    "reference": "skill/pack.md",
    "loadWhen": "the project uses the Acme design pack"
  }
}
```

## Contracts

1. **`kind` must be `"design"`** (v1).
2. **Style** must target `.style-<name> { .cn-* { … } }` — never strip `cn-*` from TSX.
3. **`mode`**: `apply` (`@apply` utilities) or `css-vars` (`--cn-*` + var references). Prefer `css-vars` for Studio editing.
4. **Theme** is optional. Omit it to keep the consumer’s existing theme.
5. Publish the folder via git or npm; consumers install with `tyohncn pack add`.

## Scaffold

```bash
tyohncn pack new acme --at ./packs --mode css-vars
# edit style.css / theme.css
tyohncn pack validate ./packs/acme
```

## Quality bar

Ship a `quality.md` checklist. At minimum:

- validate passes
- scope class matches `style.scopeClass`
- install leaves component TSX unchanged
- app root uses the scope class
