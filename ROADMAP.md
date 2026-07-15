# Roadmap

pnpm + Turborepo monorepo에서 구현 중이다. 원칙: **ssota 방식**, shadcn **포크**, Style CSS variables는 **중기(Phase 2)**, upstream 이탈은 **에이전트 수동 동기화**.

---

## Phase 0 — Scope & docs

**Status:** done

- [x] 레포 `tyohncn` 생성
- [x] README / VISION / ROADMAP
- [x] 패키지·npm 스코프 이름 확정 (`tyohncn` / `@tyohn/*`)
- [x] 모노레포 레이아웃 (CLI / registry / studio / docs) — `docs/MONOREPO.md`
- [x] ssota 레퍼런스 경계 (소비자 vs 인프라) — `docs/SSOTA.md`

**Exit:** 문서와 레이아웃으로 방향 고정. ✅

---

## Phase 1 — Fork + CLI external mode (MVP)

**Status:** done (MVP)

**Goal:** shadcn을 포크하고, Style을 TSX에 인라인하지 않는 CLI가 동작한다.

- [x] CLI+registry 모노레포 구성 (`packages/cli`, `packages/registry`)
- [x] Base UI registry bases 기본
- [x] `transformStyleMap` 비활성 (external 기본, `mode: external`)
- [x] `init` / `add`가 theme + style CSS + `cn-*` 컴포넌트 설치
- [x] `cn-*` strip 로직 없음 (`assertExternalMode`)
- [x] `apply --style <preset>` = CSS 교체만 (TSX 무변경) — vitest smoke
- [x] smoke: button / input / card (`packages/cli` test + `examples/smoke-app`)

**Exit:** external init → mira → `apply` vega 시 CSS만 바뀌고 `cn-*` 유지. ✅

---

## Phase 2 — Style token depth (mid-term)

**Status:** done (MVP)

**Goal:** Style을 `@apply` 중심에서 **CSS custom properties**로 올려 Studio 편집과 맞춘다.

- [x] Near-term: `.cn-* { @apply … }` (mira / vega / nova)
- [x] Mid 시작: `style-mira-vars.css`, `style-vega-vars.css`, `style-ssota.css`
- [x] Theme vs Style 스키마 문서 — `docs/THEME_VS_STYLE.md`, `manifest/tokens.json`
- [x] Manifest 생성 — `pnpm registry:build`
- [x] semantic `@theme` / `bg-primary` 경로 Studio 연동

**Exit:** 주요 density·size·radius가 var로 노출; `@apply` 하위 호환 유지. ✅

---

## Phase 3 — Studio (web catalog)

**Status:** done (MVP)

**Goal:** 웹에서 theme·style 토큰을 수정하며 컴포넌트 카탈로그를 테스트한다.

- [x] 컴포넌트 카탈로그 (`apps/studio`, button / input / card)
- [x] Theme inspector (semantic vars)
- [x] Style inspector (`--cn-*` CSS vars)
- [x] 프리셋 스위처 (mira / vega / mira-vars / vega-vars / ssota)
- [x] 라이브 오버라이드 → CSS export
- [ ] (후속) 파일 write-back / diff / PR-ready output

**Exit:** Studio만으로 토큰 변경·export·재현 가능. ✅ (`pnpm dev:studio`)

---

## Phase 4 — Coverage, publish, first consumer

**Status:** in progress

**Goal:** 제품화하고 ssota로 검증한다.

- [x] registry 컴포넌트 대량 이식 (60+ ui, `cn-*` hooks)
- [x] docs / agent skill — `docs/UPSTREAM_SYNC.md`, `skills/tyohncn/SKILL.md`
- [x] Faraday-style skillization (`npx skills add`, `tyohncn studio`)
- [x] Community design packs (`tyohncn pack`, `packages/official-packs`)
- [x] Component authoring with style-token separation (`tyohncn component new|check`)
- [ ] `npx tyohncn` publish
- [ ] ssota 첫 소비자 마이그레이션 (`style-ssota` / `pack add ssota`)
- [x] upstream sync 플레이북 — `docs/UPSTREAM_SYNC.md`

**Exit:** 외부 CLI 설치 + ssota가 tyohncn style pack 소비.

---

## Out of order / later ideas

- Radix base 동등 지원
- 인라인(style-map) 모드 dual support
- 자동 upstream merge bot
- Design token Figma 연동
- Hosted design-pack marketplace / search index
- Studio pack authoring + publish
- 멀티 브랜드 runtime theme packing

---

## Decision log

| Date | Decision |
|------|----------|
| 2026-07-15 | 레포명 `tyohncn` |
| 2026-07-15 | shadcn 포크 후 컴포넌트 이탈은 에이전트 수동 처리 |
| 2026-07-15 | ssota 3-layer 방식 채택 |
| 2026-07-15 | Style CSS variables는 Phase 2(중기); MVP는 `@apply` + `cn-*` |
| 2026-07-15 | Phase 0 문서-only로 시작 |
| 2026-07-15 | pnpm + Turborepo, `@tyohn/*` 스코프, 구현 착수 |
| 2026-07-15 | Next.js 앱은 skills.sh 스킬 기준으로 진행 (ssota ENV-02 미러) |
| 2026-07-15 | 아이콘 라이브러리 선택 (lucide/tabler/hugeicons/phosphor/remixicon) — shadcn과 동일 |
| 2026-07-15 | Design packs (Faraday-style): style+theme 매니페스트, official/local/github/npm |
| 2026-07-15 | `tyohncn component new\|check` — cn-* + style CSS stub authoring |
