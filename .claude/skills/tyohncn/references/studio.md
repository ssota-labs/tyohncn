# Studio

Studio is the local web catalog for tyohncn.

## Launch

```bash
npx tyohncn@latest studio
# → http://localhost:3001
```

Binds to the consumer project via `TYOHN_PROJECT_ROOT`.

## Architecture (shadcn create parity)

| Layer | Role |
|-------|------|
| Host (`/`) | Controls: style preset, radius, theme tokens, density, icons, CSS export |
| Iframe (`/preview`) | Cards / Components / Colors compositions |
| Bridge | `postMessage` (`tyohn-studio-preview`) — iframe `src` stays stable |

`style-*` is applied on the **iframe `<body>`** (not the host). That keeps Portals in-scope.

## What it does

- Style preset + radius (create-like design controls)
- Theme inspector (semantic CSS vars)
- Style inspector (`--cn-*` on `*-vars` / ssota)
- Dark / light for the preview iframe
- Horizontal-scroll Cards composition
- Full component catalog
- CSS export (clipboard; consumer scope for `*-vars`)

## What it does not do (yet)

- Write files back to the project
- Replace `tyohncn apply`

After previewing a style, run:

```bash
tyohncn apply --style <preset>
```
