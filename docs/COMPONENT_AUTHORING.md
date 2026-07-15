# Component authoring (style-token separation)

Create UI components so **look lives in CSS**, not in CVA variant maps.

```bash
tyohncn component new callout --mode css-vars --styles mira-vars,ssota
tyohncn component check callout
pnpm registry:build   # when scaffolding into packages/registry
```

Full playbook: [`plugins/cursor/skills/tyohncn/references/authoring-components.md`](../plugins/cursor/skills/tyohncn/references/authoring-components.md).

Upstream ports (existing shadcn components): [UPSTREAM_SYNC.md](./UPSTREAM_SYNC.md).
