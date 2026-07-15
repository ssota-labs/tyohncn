# mira-vars design pack

Mira visual density with CSS custom properties (`--cn-*`) so Studio can live-edit tokens.

## Install

```bash
tyohncn pack add mira-vars
# or
tyohncn apply --style mira-vars
```

Scope class remains `style-mira` (same as the `@apply` mira pack). Wrap the root with `className="style-mira"`.

## Notes

- Style-only — does not replace the project theme.
- Prefer this over plain `mira` when editing density in Studio.
