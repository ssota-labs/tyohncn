# tyohncn

shadcn/ui를 포크한 **external style** 컴포넌트 시스템.

Theme(semantic)은 Tailwind `@theme`으로 두고, Style(variant·density·chrome)은 컴포넌트 TSX에 인라인하지 않고 **CSS로 분리**한다. Base UI 컴포넌트 + CLI + 웹 카탈로그로, 디자인 토큰을 바꾸며 컴포넌트를 바로 검증할 수 있게 만드는 것이 목표다.

> 아직 구현 전이다. 방향은 [VISION.md](./VISION.md), 단계 계획은 [ROADMAP.md](./ROADMAP.md)를 본다.

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

- shadcn registry·CLI 포크 (Base UI 기본)
- Style external이 기본인 CLI (`init` / `add`가 `cn-*` + style CSS 설치)
- 웹 스튜디오: 카탈로그 + theme/style 토큰 편집 + export

**Isn't (yet)**

- 구현된 npm 패키지 / 배포된 CLI
- shadcn 인라인 모드의 완전 호환 레이어 (필요 시 옵션으로 검토)

## Docs

- [VISION.md](./VISION.md) — 목표, 원칙, 아키텍처
- [ROADMAP.md](./ROADMAP.md) — Phase 0–4

## Status

**Docs only.** 포크·CLI·Studio 구현은 로드맵 Phase 1부터.
