# Official design packs

Faraday-style **design packs** shipped with tyohncn.

```text
packages/official-packs/
  pack.schema.json
  design/
    ssota/       # brand pack (style + theme)
    mira-vars/   # density vars (style only)
```

Install in a consumer project:

```bash
tyohncn pack list
tyohncn pack add ssota
tyohncn pack add mira-vars
```

Community packs use the same `pack.json` contract and can be added via local path, GitHub (`owner/repo`), or `npm:@scope/pack`.

Sync CSS from `@tyohn/registry` into these folders:

```bash
pnpm sync:official-packs
```
