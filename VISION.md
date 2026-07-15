# Vision

## One-liner

**컴포넌트는 구조만, 스타일은 CSS로, 테마는 semantic token으로** — 바꾸면서 바로 카탈로그에서 검증한다.

## Problem

shadcn/ui의 `create` / `add`는 registry의 `.cn-*` style hooks를 Tailwind class string으로 **각 컴포넌트에 인라인**한다.

그 설계의 장점은 “스타일이 컴포넌트 파일 안에 보여서 복사·수정이 쉽다”는 것이다. 단점은 디자인 시스템 단위(밀도, 포커스 링, size scale, radius chrome)를 바꿀 때 **전 컴포넌트 재작성**이 필요하고, `apply`/`reinstall`은 로컬 커스텀까지 덮어쓰기 쉽다는 것이다.

Semantic theme(`--primary`, `--radius`)은 이미 CSS 변수로 외부화되어 있다. 아픈 지점은 theme이 아니라 **style preset 레이어**다.

## Goals

1. **Base UI 기반** shadcn 컴포넌트를 registry에 저장·배포한다.
2. **CLI**로 프로젝트에 external style 모드로 세팅한다 (`cn-*` 유지 + style CSS 설치).
3. **Semantic theme tokens**는 Tailwind `@theme` / CSS variables로 유지한다 (`bg-primary` 등).
4. **그 외 design tokens**(variant, size, density, chrome)는 전부 CSS에 둔다. 컴포넌트 TSX에 베이킹하지 않는다.
5. **웹 스튜디오**에서 theme·style 토큰을 수정하며 컴포넌트 카탈로그를 테스트·조정한다.

## Non-goals (초기)

- Radix를 기본으로 두기 (Base UI 우선; Radix는 후순위·선택)
- Style을 CSS variables로 완전 이전하기 (중기 — Roadmap Phase 2)
- shadcn upstream과 바이너리 호환 인라인 모드를 필수 지원하기
- ssota 제품 UI를 이 레포에 넣기 (ssota는 첫 소비자·레퍼런스)

## Principles

### 1. ssota-style three layers

```
Theme  →  :root / .dark + @theme inline     (semantic)
Style  →  style-*.css  .cn-* { @apply … }   (visual treatment)
Component → Base UI + cva(cn-*)             (structure + hooks)
```

ssota의 `globals.css` + `style-ssota.css` + `cn-*` CVA 패턴을 공식 모델로 채택한다.

### 2. External by default

CLI는 `transformStyleMap`으로 Style을 TSX에 녹이지 않는다. Style 프리셋 전환은 **CSS 파일 교체**다.

### 3. Semantic stays in Tailwind theme

색·radius·폰트 브리지는 shadcn과 동일하게 `@theme inline`을 쓴다. Style CSS는 `@apply bg-primary`처럼 semantic utility를 참조한다.

### 4. Fork, then diverge with agents

shadcn-ui/ui를 포크해 시작한다. 이후 upstream과 컴포넌트가 벌어지는 부분은 **수동 + 에이전트**로 동기화·이식한다. 완벽한 자동 머지를 전제하지 않는다.

### 5. Catalog is a first-class product

토큰 편집 → 라이브 프리뷰 → CSS export(이후 write-back)가 CLI만큼 중요하다. ssota Design Lab을 독립 제품(Studio)으로 키운다.

### 6. Progressive token depth

| Horizon | Style representation |
|---------|----------------------|
| Near    | `.cn-* { @apply … }` (ssota / mira 호환) |
| Mid     | `.cn-* { --cn-*: … }` CSS variables + Studio 편집 |
| Later   | Manifest ↔ CSS single source of truth |

## Architecture (target)

```text
┌─ Theme ──────────────────────────────────────────┐
│  tokens/theme.css  — semantic vars + @theme      │
└──────────────────────────────────────────────────┘
┌─ Style ──────────────────────────────────────────┐
│  styles/style-mira.css | style-vega.css | …      │
│  scoped (e.g. .style-mira .cn-button-…)          │
└──────────────────────────────────────────────────┘
┌─ Components ─────────────────────────────────────┐
│  registry bases (Base UI) — cn-* hooks only      │
└──────────────────────────────────────────────────┘
┌─ Studio ─────────────────────────────────────────┐
│  catalog · theme editor · style editor · export  │
└──────────────────────────────────────────────────┘
┌─ CLI ────────────────────────────────────────────┐
│  create / init / add — external style mode       │
│  apply --style — CSS swap, no TSX rewrite        │
└──────────────────────────────────────────────────┘
```

## Relationship to ssota

- **tyohncn**: 인프라 (fork CLI, registry, Studio, style packs)
- **ssota**: 브랜드 프리셋·소비자 (`style-ssota`, Design Lab 경험을 Studio로 이전 가능)

ssota에서 이미 검증된 패턴을 일반화하는 것이 이 프로젝트의 출발점이다.

## Success looks like

1. `npx tyohncn init` 후 mira로 깔고, style CSS만 vega로 바꿔도 전 UI 밀도가 바뀐다.
2. Studio에서 `--primary`와 button height를 바꾼 뒤 export한 CSS를 붙여 넣으면 카탈로그와 앱이 같은 모습이다.
3. 새 컴포넌트를 `add`해도 CVA에는 `cn-*`만 생기고, look은 style 파일에만 추가된다.
4. upstream shadcn 컴포넌트 변경은 에이전트가 가져와 external 형태로 이식할 수 있다.

## Status (2026-07)

**In progress.** Monorepo, `@tyohn/registry`, and external-mode `tyohncn` CLI (init / add / apply) are implemented. Studio catalog and npm publish remain Phase 3–4. See [ROADMAP.md](./ROADMAP.md).
