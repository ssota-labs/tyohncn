# Roadmap

구현은 아직 시작하지 않았다. 아래는 합의된 Phase 순서다.

원칙 요약: **ssota 방식**, shadcn **포크**, Style CSS variables는 **중기**, upstream 이탈은 **에이전트 수동 동기화**.

---

## Phase 0 — Scope & docs

**Status:** in progress (docs)

- [x] 레포 `tyohncn` 생성
- [x] README / VISION / ROADMAP
- [ ] 패키지·npm 스코프 이름 확정 (`tyohncn` / `@tyohn/*` 등)
- [ ] 모노레포 레이아웃 스케치 (CLI / registry / studio / docs)
- [ ] ssota 레퍼런스 경로·이관 경계 명시 (소비자 vs 인프라)

**Exit:** 문서만으로 방향이 흔들리지 않음. 코드 없음.

---

## Phase 1 — Fork + CLI external mode (MVP)

**Goal:** shadcn을 포크하고, Style을 TSX에 인라인하지 않는 CLI가 동작한다.

- [ ] `shadcn-ui/ui` 포크 (또는 CLI+registry에 필요한 트리만 가져와 모노레포 구성)
- [ ] Base UI registry bases를 기본으로 유지
- [ ] `transformStyleMap` 비활성 (external이 기본)
- [ ] `init` / `add`가 다음을 설치:
  - semantic theme → `globals.css` (`:root` + `@theme inline`)
  - style pack → `style-*.css` (mira 등) + import / scope class
  - components → `cn-*` CVA 훅 유지
- [ ] `cn-*` strip 로직 제거
- [ ] `apply --style <preset>` = **CSS 교체만** (컴포넌트 TSX 무변경) 검증
- [ ] 최소 smoke: button / input / card

**Exit:** 새 Next/Vite 앱에서 external init → mira 설치 → style만 vega로 바꿔 UI가 바뀜.

**Notes:** upstream 인라인 모드 호환은 필수 아님. 필요 시 이후 옵션.

---

## Phase 2 — Style token depth (mid-term)

**Goal:** Style을 `@apply` 중심에서 **CSS custom properties**로 올려 Studio 편집과 맞춘다.

- [ ] Near-term 유지: `.cn-* { @apply … }` (ssota / upstream style 파일 호환)
- [ ] Mid: `.cn-button { --cn-height: …; height: var(--cn-height); }` 형태로 승격
- [ ] Theme tokens vs Style tokens 스키마 문서화
- [ ] Manifest ↔ CSS drift 방지 (생성 또는 단일 SSOT)
- [ ] semantic은 계속 `@theme` / `bg-primary` 경로

**Exit:** Style의 주요 density·size·radius chrome이 var로 노출되고, `@apply`만으로도 동작하는 하위 호환 경로가 있거나 마이그레이션 가이드가 있음.

**Explicitly deferred from Phase 1:** CSS variable 승격은 이 Phase에서만 진행.

---

## Phase 3 — Studio (web catalog)

**Goal:** 웹에서 theme·style 토큰을 수정하며 컴포넌트 카탈로그를 테스트한다.

- [ ] 컴포넌트 카탈로그 (ssota Design Lab 패턴)
- [ ] Theme inspector (semantic vars)
- [ ] Style inspector (`cn-*` / 중기에는 CSS vars)
- [ ] 프리셋 스위처 (mira / vega / …)
- [ ] 라이브 오버라이드 → CSS export
- [ ] (후속) 파일 write-back / diff / PR-ready output

**Exit:** Studio만으로 토큰을 바꿔 카탈로그를 검증하고, export한 CSS를 프로젝트에 붙여 재현 가능.

---

## Phase 4 — Coverage, publish, first consumer

**Goal:** 제품화하고 ssota로 검증한다.

- [ ] registry 컴포넌트 `cn-*` 전수 (잔여 인라인 CVA 제거)
- [ ] docs 사이트 / agent skill
- [ ] `npx tyohncn` (또는 확정된 bin) publish
- [ ] ssota를 첫 소비자로 마이그레이션·검증 (`style-ssota` = brand preset)
- [ ] upstream sync 플레이북 (에이전트로 컴포넌트 이식하는 절차)

**Exit:** 외부에서 CLI로 설치 가능하고, ssota가 tyohncn style pack을 소비한다.

---

## Out of order / later ideas

우선순위에 넣지 않은 항목:

- Radix base 동등 지원
- 인라인(style-map) 모드 dual support
- 자동 upstream merge bot
- Design token Figma 연동
- 멀티 브랜드 runtime theme packing (앱 런타임에 여러 style 동시 로드)

---

## Decision log

| Date | Decision |
|------|----------|
| 2026-07-15 | 레포명 `tyohncn` |
| 2026-07-15 | shadcn 포크 후 컴포넌트 이탈은 에이전트 수동 처리 |
| 2026-07-15 | ssota 3-layer 방식 채택 |
| 2026-07-15 | Style CSS variables는 Phase 2(중기); MVP는 `@apply` + `cn-*` |
| 2026-07-15 | 지금은 문서만; 구현은 Phase 1부터 |
