# Studio

Studio is the local web catalog for tyohncn.

## Launch

```bash
npx tyohncn@latest studio
# → http://localhost:3001
```

Binds to the consumer project via `TYOHN_PROJECT_ROOT`.

## What it does

- Component catalog (button / input / card / …)
- Theme inspector (semantic CSS vars; color picker + text)
- Style inspector (`--cn-*` on `*-vars` packs; dimension controls)
- Preset + icon library switchers (**preview only**; registry Select popup)
- Icon sample row via `IconPlaceholder`
- Project meta: installed components, suggested CLI commands
- CSS export of token overrides

## Preview scope (vs shadcn create)

shadcn `create` = iframe + `style-*` on iframe `body`.  
tyohncn Studio = **page-level** `.style-*` catalog wrapper + compiled style packs bundled via PostCSS (`globals.css`). Inspectors inject CSS vars on the same wrapper for live overrides. No iframe.

## What it does not do (yet)

- Write files back to the project
- Replace `tyohncn apply`

After previewing a style, run:

```bash
tyohncn apply --style <preset>
```
