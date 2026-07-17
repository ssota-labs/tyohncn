# Studio

Studio is the local web catalog for tyohncn.

## Launch

```bash
npx tyohncn@latest studio
# → http://localhost:3001
```

Binds to the consumer project via `TYOHN_PROJECT_ROOT`.

## Architecture (shadcn create parity)

Three layers — not per-component iframes:

| Layer | Role |
|-------|------|
| Host (`/`) | Customizer: style, radius, theme/density tokens, icons, CSS export |
| Iframe (`/preview/[scene]`) | One scene block: `cards` \| `catalog` \| `colors` |
| Bridge | `postMessage` type `design-system-params`; iframe `src` seeds scene + knobs |

`DesignSystemProvider` applies `style-*` on the **iframe `<body>`** and injects theme vars. Host never gets `style-*`.

Key modules: `components/preview.tsx`, `components/design-system-provider.tsx`, `components/scenes/*`, `lib/search-params.ts`, `lib/use-iframe-sync.tsx`.

## What it does

- Style preset + radius (create-like design controls)
- Theme inspector (semantic CSS vars)
- Style inspector (`--cn-*` on `*-vars` / ssota)
- Dark / light for the preview iframe
- Horizontal-scroll Cards scene
- Full component catalog scene
- CSS export (clipboard; consumer scope for `*-vars`)

## What it does not do (yet)

- Write files back to the project
- Replace `tyohncn apply`

After previewing a style, run:

```bash
tyohncn apply --style <preset>
```
