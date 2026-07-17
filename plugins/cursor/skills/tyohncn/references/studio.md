# Studio

Studio is the local web catalog for tyohncn.

## Launch

```bash
npx tyohncn@latest studio
# → http://localhost:3001
```

Binds to the consumer project via `TYOHN_PROJECT_ROOT`.

## What it does

- Full-viewport editor shell (tweakcn-style): resizable controls + preview
- Preview tabs: **Cards** composition, **Components** catalog, **Colors**
- Horizontal scroll for wide compositions (`min-w` layout — desktop arrangement stays intact)
- Design controls like shadcn `create`: style preset, radius, icon library
- Theme inspector (grouped semantic CSS vars; color picker + text)
- Style inspector (`--cn-*` on `*-vars` / ssota packs; dimension controls)
- Dark / light toggle for the preview surface
- Project meta: installed components, suggested CLI commands
- CSS export of token overrides (clipboard; consumer scope class for `*-vars`)

## Preview scope (vs shadcn create)

shadcn `create` = iframe + `style-*` on iframe `body`.  
tyohncn Studio = **page-level** `.style-*` preview root + compiled style packs bundled via PostCSS (`globals.css`). Inspectors inject CSS vars on the preview root for live overrides. No iframe.

## Layout notes

- Shell uses `h-svh` + `overflow-hidden` + `min-h-0` so nested scroll regions work.
- Cards / Components previews use a fixed design width and `overflow-auto` so the composition scrolls horizontally instead of crushing into a narrow column.
- Style pack switching is preview-only; confirm with CLI.

## What it does not do (yet)

- Write files back to the project
- Replace `tyohncn apply`

After previewing a style, run:

```bash
tyohncn apply --style <preset>
```
