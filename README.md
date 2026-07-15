# tyohncn

shadcn/ui를 포크한 **external style** 컴포넌트 시스템.

Theme(semantic)은 Tailwind `@theme`으로 두고, Style(variant·density·chrome)은 컴포넌트 TSX에 인라인하지 않고 **CSS로 분리**한다. Base UI 컴포넌트 + CLI + 웹 카탈로그로, 디자인 토큰을 바꾸며 컴포넌트를 바로 검증할 수 있게 만드는 것이 목표다.

> 방향은 [VISION.md](./VISION.md), 단계 계획은 [ROADMAP.md](./ROADMAP.md)를 본다.

## Why

shadcn은 내부적으로 Theme / Style / Component 3층을 갖고 있지만, `create` / `add` 시 Style(`.cn-*`)을 각 컴포넌트 TSX로 **컴파일해 넣는다**. 그 결과:

- `--primary` 같은 semantic theme 변경은 쉽다
- mira → vega처럼 density·radius chrome·size scale을 통째로 바꾸려면 **모든 컴포넌트 파일을 다시 써야** 한다

tyohncn은 Style 층을 CSS 파일로 남긴다. 스타일 프리셋 교체는 CSS import 교체이며, 컴포넌트 TSX는 `cn-*` 훅만 유지한다.

## Approach (ssota-style)

ssota에서 검증한 3층을 제품화한다.

| Layer | Role | Example |
|-------|------|---------|
| **Theme** | Semantic color / radius / font | `globals.css` `:root` + `@theme inline` → `bg-primary` |
| **Style** | Variant·size·density·chrome | `style-mira.css` → `.cn-button-variant-default { @apply … }` |
| **Component** | Base UI + CVA hooks only | `default: "cn-button-variant-default"` |

중기에는 Style을 `@apply`에서 **CSS custom properties**로 올려 Studio 라이브 편집과 맞춘다. 초기에는 ssota와 같이 `@apply` + `cn-*`를 유지한다.

## What this is / isn't

**Is**

- pnpm + Turborepo monorepo (`packages/cli`, `packages/registry`, `apps/studio`)
- shadcn registry·CLI 포크 (Base UI 기본)
- Style external이 기본인 CLI (`init` / `add` / `apply` — `cn-*` + style CSS 설치)
- 웹 스튜디오: 카탈로그 + theme/style 토큰 편집 + export (`pnpm dev:studio`)

**Isn't (yet)**

- npm publish / `npx tyohncn` 배포 (Phase 4)
- shadcn 인라인 모드의 완전 호환 레이어 (필요 시 옵션으로 검토)

## Monorepo quick start

```bash
pnpm install
pnpm registry:build    # manifest/components.json, styles.json
pnpm cli:build         # packages/cli/dist
pnpm --filter tyohncn test
```

Smoke consumer: `examples/smoke-app/`

## Docs

- [VISION.md](./VISION.md) — 목표, 원칙, 아키텍처
- [ROADMAP.md](./ROADMAP.md) — Phase 0–4
- [docs/MONOREPO.md](./docs/MONOREPO.md) — 패키지 레이아웃, skills.sh
- [docs/THEME_VS_STYLE.md](./docs/THEME_VS_STYLE.md) — theme vs style 토큰
- [docs/SSOTA.md](./docs/SSOTA.md) — ssota 소비자 경계
- [docs/UPSTREAM_SYNC.md](./docs/UPSTREAM_SYNC.md) — upstream 수동 동기화 플레이북
- [skills/tyohncn/SKILL.md](./skills/tyohncn/SKILL.md) — 에이전트용 CLI 스킬

## Status

**Phases 0–3 MVP landed** (monorepo, registry, external CLI, CSS-var styles, Studio). Phase 4 open: npm publish + ssota consumer migration.
