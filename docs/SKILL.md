# Faraday-style skillization

tyohncn follows the same agent-skill + published-CLI pattern as
[ssota-labs/faraday-academy](https://github.com/ssota-labs/faraday-academy).

## Install the skill

```bash
npx skills add ssota-labs/tyohncn
```

Canonical skill: [`plugins/cursor/skills/tyohncn`](../plugins/cursor/skills/tyohncn).  
Mirrors (`.agents/skills`, `.cursor/skills`, `.claude/skills`, `skills/`) are kept
in sync with `pnpm sync:skills`.

## Published packages

| Package | Role |
|---------|------|
| `tyohncn` | CLI (`init` / `add` / `apply` / `list` / `studio` / `pack`) |
| `@tyohn/registry` | Base UI sources + builtin style packs + theme |
| `@tyohn/studio` | Local Studio web UI |

Publish (maintainers):

```bash
pnpm publish:packages:dry
pnpm publish:packages
```

## Design packs

Faraday-style **design packs** (`pack.json` + style/theme CSS) live under
[`packages/official-packs`](../packages/official-packs). Anyone can author and
distribute a pack; consumers install with:

```bash
tyohncn pack add ssota
tyohncn pack add ./my-brand-pack
tyohncn pack add owner/repo
tyohncn pack add npm:@scope/pack
```

See skill refs: `references/packs.md`, `references/authoring-packs.md`.

## Studio binding

`tyohncn studio` sets `TYOHN_PROJECT_ROOT` to the consumer project and launches
`@tyohn/studio`. Studio is **preview + export**; file mutations stay on the CLI.
