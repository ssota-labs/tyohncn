# Theme tokens vs Style tokens

## Theme (semantic)

Lives in `packages/registry/theme/theme.css`.

- `:root` / `.dark` CSS variables (`--primary`, `--radius`, …)
- Bridged into Tailwind via `@theme inline` → utilities like `bg-primary`

Theme answers: “what is primary / muted / radius?”

## Style (visual treatment)

Lives in `packages/registry/styles/style-*.css`, scoped under `.style-<preset>`.

| Horizon | Representation | Files |
|---------|----------------|-------|
| Near (Phase 1) | `.cn-* { @apply … }` | `style-mira.css`, `style-vega.css`, `style-nova.css` |
| Mid (Phase 2) | `.cn-* { --cn-*: …; height: var(--cn-*) }` | `style-mira-vars.css`, `style-vega-vars.css`, `style-ssota.css` |

Style answers: “how dense / rounded / chrome-y is the button?”

## SSOT / drift prevention

- `packages/registry/manifest/tokens.json` — declared theme + style token names
- `packages/registry/manifest/styles.json` — style pack inventory (`mode: apply | css-vars`)
- `pnpm registry:build` regenerates component/style manifests from disk

Studio reads the same manifests so inspectors stay aligned with shipped CSS.

## Migration (@apply → vars)

1. Keep `@apply` packs working.
2. Prefer `*-vars` packs for Studio editing / live override.
3. `tyohncn apply --style mira-vars` swaps CSS only; component TSX stays on `cn-*`.
