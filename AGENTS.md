# AGENTS.md

## Cursor Cloud specific instructions

- **Current state: documentation-only repository (Roadmap Phase 0).** The repo contains only `README.md`, `VISION.md`, and `ROADMAP.md`. There is no source code, no package manifest, no build tooling, no config, and no runnable services yet. See `ROADMAP.md` (Phase 0 exit criteria is "코드 없음" / no code).
- **Nothing to build, lint, test, or run today.** Do not fabricate an application; implementation is planned to begin in Roadmap Phase 1.
- **Planned stack (for when implementation starts):** a Node/TypeScript monorepo — a `shadcn/ui` fork (CLI + Base UI component registry) plus a web Studio. Package manager is not yet decided (`README.md` Phase 0).
- **Update script:** the startup update script is a lockfile-guarded install (`pnpm`/`yarn`/`npm`), so it is a no-op while the repo is docs-only and automatically installs dependencies once a manifest/lockfile lands. Node 22, npm 10, pnpm 10, and Python 3.12 are preinstalled on the VM.
