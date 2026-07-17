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
| Near (Phase 1) | `.cn-* { @apply … }` | shadcn packs: `mira`, `lyra`, `nova`, `rhea`, `luma`, `maia`, `vega`, `sera` |
| Mid (Phase 2) | `.cn-* { --cn-*: …; height: var(--cn-*) }` | `style-mira-vars.css`, `style-vega-vars.css`, `style-ssota.css` |

Upstream shadcn ships eight visual presets. Density cue (default button height): mira `h-7` → lyra/nova/rhea `h-8` → luma/maia/vega `h-9` → sera `h-10`.

Style answers: “how dense / rounded / chrome-y is the button?”

## SSOT / drift prevention

- `packages/registry/manifest/tokens.json` — declared theme + style token names
- `packages/registry/manifest/styles.json` — style pack inventory (`mode: apply | css-vars`)
- `pnpm registry:build` regenerates component/style manifests from disk

Studio reads the same manifests so inspectors stay aligned with shipped CSS.

## Studio preview scope

shadcn `create` isolates the catalog in an **iframe** and puts `style-${preset}` on the iframe `body`. tyohncn Studio keeps a **page-level** `.style-*` preview root (tweakcn-style resizable shell + horizontal-scroll compositions) and swaps compiled style packs in the main document so Theme/Style inspectors can apply live `style={{ --primary, --cn-* }}` overrides without a reload. Design controls also cover style preset + radius (shadcn create parity). Consumer apps still wrap with `className="style-mira"` (same contract as CLI/skills).

## Migration (@apply → vars)

1. Keep `@apply` packs working.
2. Prefer `*-vars` packs for Studio editing / live override.
3. `tyohncn apply --style mira-vars` swaps CSS only; component TSX stays on `cn-*`.
