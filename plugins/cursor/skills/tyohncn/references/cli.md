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
npx tyohncn@latest apply --style vega          # CSS only
npx tyohncn@latest apply --icon tabler         # re-resolve icons
npx tyohncn@latest apply --style mira-vars --icon lucide
```

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
