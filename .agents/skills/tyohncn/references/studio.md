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
- Theme inspector (semantic CSS vars)
- Style inspector (`--cn-*` on `*-vars` packs)
- Preset + icon library switchers (**preview only**)
- Project meta: installed components, suggested CLI commands
- CSS export of token overrides

## What it does not do (yet)

- Write files back to the project
- Replace `tyohncn apply`

After previewing a style, run:

```bash
tyohncn apply --style <preset>
```
