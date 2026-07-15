# CLI reference

## init

```bash
npx tyohncn@latest init --style mira --icon lucide --css app/globals.css
```

Writes `tyohncn.json`, installs theme into globals, copies `styles/style-<preset>.css`.

## add

```bash
npx tyohncn@latest add button input card dialog
```

Copies from `@tyohn/registry` with `cn-*` intact. Transforms `IconPlaceholder` to the configured icon library.

## apply

```bash
npx tyohncn@latest apply --style vega          # builtin CSS only
npx tyohncn@latest apply --style ssota         # official design pack
npx tyohncn@latest apply --style ./my-pack     # local pack
npx tyohncn@latest apply --icon tabler         # re-resolve icons
npx tyohncn@latest apply --style mira-vars --icon lucide
```

## pack

```bash
npx tyohncn@latest pack list
npx tyohncn@latest pack add ssota
npx tyohncn@latest pack add ./my-brand-pack
npx tyohncn@latest pack add some-org/acme-pack
npx tyohncn@latest pack new acme --mode css-vars
npx tyohncn@latest pack validate ./acme
npx tyohncn@latest pack show ssota
npx tyohncn@latest pack remove acme
```

See [packs.md](./packs.md) and [authoring-packs.md](./authoring-packs.md).

## list

```bash
npx tyohncn@latest list components
npx tyohncn@latest list styles
npx tyohncn@latest list icons
```

## studio

```bash
npx tyohncn@latest studio --port 3001
```

Requires `tyohncn.json` in the project. Sets `TYOHN_PROJECT_ROOT` and launches `@tyohn/studio`.
