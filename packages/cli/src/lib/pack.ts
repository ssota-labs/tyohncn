import fs from "fs-extra"
import path from "node:path"
import os from "node:os"
import { execFileSync } from "node:child_process"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import { createWriteStream } from "node:fs"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import type { TyohnConfig } from "./project.js"

const require = createRequire(import.meta.url)

export type DesignPackManifest = {
  name?: string
  displayName: string
  description?: string
  kind: "design"
  style: {
    file: string
    scopeClass: string
    mode: "apply" | "css-vars"
  }
  theme?: { file: string }
  skill?: {
    reference: string
    entry?: string
    loadWhen?: string
  }
  quality?: string
  requires?: string[]
}

export type ResolvedPack = {
  name: string
  dir: string
  source: string
  manifest: DesignPackManifest
}

export type ProvenanceEntry = {
  name: string
  source: string
  installedAt: string
}

export type Provenance = {
  version: 1
  packs: ProvenanceEntry[]
}

export function packsRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  // packages/cli/dist → repo official-packs; or bundled packs/ next to package
  const candidates = [
    path.resolve(here, "../../../official-packs"),
    path.resolve(here, "../../official-packs"),
    path.resolve(here, "../packs"),
    path.resolve(here, "../../packs"),
  ]
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "design")) || fs.existsSync(path.join(c, "pack.schema.json"))) {
      return c
    }
  }
  // published: packages/cli/packs
  try {
    const pkgJson = require.resolve("tyohncn/package.json")
    const bundled = path.join(path.dirname(pkgJson), "packs")
    if (fs.existsSync(bundled)) return bundled
  } catch {
    // ignore
  }
  return path.resolve(here, "../../../official-packs")
}

export function listOfficialPacks(): Array<{
  name: string
  displayName: string
  description?: string
  dir: string
}> {
  const root = packsRoot()
  const designDir = path.join(root, "design")
  if (!fs.existsSync(designDir)) return []
  const out: Array<{
    name: string
    displayName: string
    description?: string
    dir: string
  }> = []
  for (const name of fs.readdirSync(designDir).sort()) {
    const dir = path.join(designDir, name)
    const manifestPath = path.join(dir, "pack.json")
    if (!fs.existsSync(manifestPath)) continue
    const manifest = fs.readJsonSync(manifestPath) as DesignPackManifest
    out.push({
      name: manifest.name ?? name,
      displayName: manifest.displayName,
      description: manifest.description,
      dir,
    })
  }
  return out
}

export function validateManifest(
  manifest: unknown,
  packDir?: string
): { ok: true; manifest: DesignPackManifest } | { ok: false; errors: string[] } {
  const errors: string[] = []
  if (!manifest || typeof manifest !== "object") {
    return { ok: false, errors: ["pack.json must be an object"] }
  }
  const m = manifest as Record<string, unknown>

  if (typeof m.displayName !== "string" || !m.displayName.trim()) {
    errors.push("displayName is required")
  }
  if (m.kind !== "design") {
    errors.push('kind must be "design"')
  }
  if (m.name !== undefined) {
    if (typeof m.name !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(m.name)) {
      errors.push("name must match ^[a-z0-9][a-z0-9-]*$")
    }
  }

  const style = m.style as Record<string, unknown> | undefined
  if (!style || typeof style !== "object") {
    errors.push("style is required")
  } else {
    if (typeof style.file !== "string" || !style.file) errors.push("style.file is required")
    if (typeof style.scopeClass !== "string" || !/^style-[a-z0-9][a-z0-9-]*$/.test(style.scopeClass)) {
      errors.push('style.scopeClass must match ^style-[a-z0-9][a-z0-9-]*$')
    }
    if (style.mode !== "apply" && style.mode !== "css-vars") {
      errors.push('style.mode must be "apply" or "css-vars"')
    }
  }

  if (m.theme !== undefined) {
    const theme = m.theme as Record<string, unknown>
    if (!theme || typeof theme !== "object" || typeof theme.file !== "string") {
      errors.push("theme.file is required when theme is set")
    }
  }

  if (m.skill !== undefined) {
    const skill = m.skill as Record<string, unknown>
    if (!skill || typeof skill !== "object" || typeof skill.reference !== "string") {
      errors.push("skill.reference is required when skill is set")
    }
  }

  if (m.requires !== undefined && !Array.isArray(m.requires)) {
    errors.push("requires must be an array of strings")
  }

  // Extra keys not in schema
  const allowed = new Set([
    "name",
    "displayName",
    "description",
    "kind",
    "style",
    "theme",
    "skill",
    "quality",
    "requires",
  ])
  for (const key of Object.keys(m)) {
    if (!allowed.has(key)) errors.push(`unknown field: ${key}`)
  }

  if (packDir && errors.length === 0) {
    const styleFile = path.join(packDir, String((m.style as { file: string }).file))
    if (!fs.existsSync(styleFile)) {
      errors.push(`missing style file: ${(m.style as { file: string }).file}`)
    }
    if (m.theme && typeof (m.theme as { file?: string }).file === "string") {
      const themeFile = path.join(packDir, (m.theme as { file: string }).file)
      if (!fs.existsSync(themeFile)) {
        errors.push(`missing theme file: ${(m.theme as { file: string }).file}`)
      }
    }
    if (m.skill && typeof (m.skill as { reference?: string }).reference === "string") {
      const skillPath = path.join(packDir, (m.skill as { reference: string }).reference)
      if (!fs.existsSync(skillPath)) {
        errors.push(`missing skill reference: ${(m.skill as { reference: string }).reference}`)
      }
    }
  }

  if (errors.length) return { ok: false, errors }
  return { ok: true, manifest: m as unknown as DesignPackManifest }
}

function looksLikeLocalPath(source: string): boolean {
  return (
    source.startsWith(".") ||
    source.startsWith("/") ||
    source.startsWith("~") ||
    path.isAbsolute(source) ||
    (source.includes(path.sep) && !source.includes(":"))
  )
}

function looksLikeNpm(source: string): boolean {
  return source.startsWith("npm:")
}

function looksLikeGithub(source: string): boolean {
  // owner/repo or owner/repo/sub/path — not a local path, not npm:
  if (looksLikeLocalPath(source) || looksLikeNpm(source)) return false
  if (source.includes("://")) return false
  const parts = source.split("/")
  return parts.length >= 2 && /^[A-Za-z0-9_.-]+$/.test(parts[0]!) && /^[A-Za-z0-9_.-]+$/.test(parts[1]!)
}

async function extractTarball(tgz: string, dest: string): Promise<string> {
  await fs.ensureDir(dest)
  execFileSync("tar", ["-xzf", tgz, "-C", dest], { stdio: "pipe" })
  const entries = await fs.readdir(dest)
  // npm/github tarballs usually have a single top-level folder
  if (entries.length === 1) {
    const only = path.join(dest, entries[0]!)
    if ((await fs.stat(only)).isDirectory()) return only
  }
  return dest
}

async function downloadToFile(url: string, dest: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "tyohncn" },
    redirect: "follow",
  })
  if (!res.ok || !res.body) {
    throw new Error(`Download failed (${res.status}): ${url}`)
  }
  await fs.ensureDir(path.dirname(dest))
  const file = createWriteStream(dest)
  await pipeline(Readable.fromWeb(res.body as import("node:stream/web").ReadableStream), file)
}

function cacheDir(): string {
  return path.join(os.homedir(), ".tyohn", "cache")
}

async function resolveGithub(source: string): Promise<{ dir: string; source: string }> {
  const parts = source.split("/")
  const owner = parts[0]!
  const repo = parts[1]!
  const sub = parts.slice(2).join("/")
  const cache = path.join(cacheDir(), "github", `${owner}-${repo}`)
  await fs.remove(cache)
  await fs.ensureDir(cache)
  const tgz = path.join(cache, "repo.tgz")
  const url = `https://codeload.github.com/${owner}/${repo}/tar.gz/HEAD`
  await downloadToFile(url, tgz)
  const extracted = await extractTarball(tgz, path.join(cache, "extract"))
  const dir = sub ? path.join(extracted, sub) : extracted
  if (!fs.existsSync(path.join(dir, "pack.json"))) {
    // try design/<name> convention
    const designCandidate = path.join(extracted, "design", repo.replace(/^tyohn-?pack-?/, "") || "pack")
    if (fs.existsSync(path.join(designCandidate, "pack.json"))) {
      return { dir: designCandidate, source: `github:${source}` }
    }
    throw new Error(`No pack.json in github source ${source}`)
  }
  return { dir, source: `github:${source}` }
}

async function resolveNpm(source: string): Promise<{ dir: string; source: string }> {
  const spec = source.slice("npm:".length)
  const cache = path.join(cacheDir(), "npm", spec.replace(/[/@]/g, "_"))
  await fs.remove(cache)
  await fs.ensureDir(cache)
  execFileSync("npm", ["pack", spec, "--pack-destination", cache], {
    stdio: "pipe",
    cwd: cache,
  })
  const tgz = (await fs.readdir(cache)).find((f) => f.endsWith(".tgz"))
  if (!tgz) throw new Error(`npm pack produced no tarball for ${spec}`)
  const extracted = await extractTarball(path.join(cache, tgz), path.join(cache, "extract"))
  // package root or design/<name>
  if (fs.existsSync(path.join(extracted, "pack.json"))) {
    return { dir: extracted, source: `npm:${spec}` }
  }
  const designDir = path.join(extracted, "design")
  if (fs.existsSync(designDir)) {
    const kids = await fs.readdir(designDir)
    for (const k of kids) {
      const d = path.join(designDir, k)
      if (fs.existsSync(path.join(d, "pack.json"))) {
        return { dir: d, source: `npm:${spec}` }
      }
    }
  }
  throw new Error(`No pack.json in npm package ${spec}`)
}

export async function resolvePack(source: string): Promise<ResolvedPack> {
  const trimmed = source.trim()
  let dir: string
  let resolvedSource: string

  // Official name
  const official = listOfficialPacks().find((p) => p.name === trimmed)
  if (official) {
    dir = official.dir
    resolvedSource = trimmed
  } else if (looksLikeNpm(trimmed)) {
    const r = await resolveNpm(trimmed)
    dir = r.dir
    resolvedSource = r.source
  } else if (looksLikeGithub(trimmed)) {
    const r = await resolveGithub(trimmed)
    dir = r.dir
    resolvedSource = r.source
  } else if (looksLikeLocalPath(trimmed) || fs.existsSync(path.resolve(trimmed))) {
    dir = path.resolve(trimmed.replace(/^~(?=$|[/\\])/, os.homedir()))
    resolvedSource = dir
  } else {
    // try official again with helpful error
    const names = listOfficialPacks()
      .map((p) => p.name)
      .join(", ")
    throw new Error(
      `Cannot resolve pack "${trimmed}". Official: ${names || "(none)"}. Use a local path, owner/repo, or npm:@scope/pack.`
    )
  }

  const manifestPath = path.join(dir, "pack.json")
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error(`No pack.json at ${dir}`)
  }
  const raw = await fs.readJson(manifestPath)
  const validated = validateManifest(raw, dir)
  if (!validated.ok) {
    throw new Error(`Invalid pack.json:\n- ${validated.errors.join("\n- ")}`)
  }
  const name = validated.manifest.name ?? path.basename(dir)
  return {
    name,
    dir,
    source: resolvedSource,
    manifest: { ...validated.manifest, name },
  }
}

export function provenancePath(projectRoot: string) {
  return path.join(projectRoot, ".tyohn", "provenance.json")
}

export async function readProvenance(projectRoot: string): Promise<Provenance> {
  const file = provenancePath(projectRoot)
  if (!(await fs.pathExists(file))) return { version: 1, packs: [] }
  const raw = (await fs.readJson(file)) as Provenance
  return {
    version: 1,
    packs: Array.isArray(raw.packs) ? raw.packs : [],
  }
}

export async function writeProvenance(projectRoot: string, provenance: Provenance) {
  const file = provenancePath(projectRoot)
  await fs.ensureDir(path.dirname(file))
  await fs.writeJson(file, provenance, { spaces: 2 })
}

export async function recordPackInstall(
  projectRoot: string,
  entry: Omit<ProvenanceEntry, "installedAt">
) {
  const provenance = await readProvenance(projectRoot)
  provenance.packs = provenance.packs.filter((p) => p.name !== entry.name)
  provenance.packs.push({ ...entry, installedAt: new Date().toISOString() })
  await writeProvenance(projectRoot, provenance)
}

export async function removePackRecord(projectRoot: string, name: string) {
  const provenance = await readProvenance(projectRoot)
  provenance.packs = provenance.packs.filter((p) => p.name !== name)
  await writeProvenance(projectRoot, provenance)
}

/**
 * Install design pack CSS (+ optional theme/skill) into a consumer project.
 * Does not mutate component TSX.
 */
export async function installDesignPack(
  projectRoot: string,
  config: TyohnConfig,
  resolved: ResolvedPack,
  opts: {
    patchGlobalsStyle: (
      root: string,
      config: TyohnConfig,
      styleName: string,
      scopeClass: string
    ) => Promise<void>
    patchGlobalsTheme?: (
      root: string,
      config: TyohnConfig,
      packName: string
    ) => Promise<void>
  }
): Promise<{
  styleDest: string
  themeDest: string | null
  scopeClass: string
  name: string
}> {
  const { manifest, dir, name, source } = resolved
  const stylesDir = path.join(projectRoot, config.css.stylesDir)
  await fs.ensureDir(stylesDir)

  const styleDest = path.join(stylesDir, `style-${name}.css`)
  await fs.copy(path.join(dir, manifest.style.file), styleDest)

  let themeDest: string | null = null
  if (manifest.theme?.file) {
    themeDest = path.join(stylesDir, `theme-${name}.css`)
    await fs.copy(path.join(dir, manifest.theme.file), themeDest)
    if (opts.patchGlobalsTheme) {
      await opts.patchGlobalsTheme(projectRoot, config, name)
    }
  }

  await opts.patchGlobalsStyle(
    projectRoot,
    config,
    name,
    manifest.style.scopeClass
  )

  // Skill half
  if (manifest.skill?.reference) {
    const skillSrc = path.join(dir, manifest.skill.reference)
    const skillDest = path.join(projectRoot, ".tyohn", "packs", name)
    await fs.remove(skillDest)
    await fs.ensureDir(path.dirname(skillDest))
    const st = await fs.stat(skillSrc)
    if (st.isDirectory()) {
      await fs.copy(skillSrc, skillDest)
    } else {
      await fs.ensureDir(skillDest)
      await fs.copy(skillSrc, path.join(skillDest, path.basename(skillSrc)))
    }
    await appendAgentsPointer(projectRoot, name, manifest.skill.loadWhen)
  }

  await recordPackInstall(projectRoot, { name, source })

  return {
    styleDest,
    themeDest,
    scopeClass: manifest.style.scopeClass,
    name,
  }
}

async function appendAgentsPointer(
  projectRoot: string,
  packName: string,
  loadWhen?: string
) {
  const agentsPath = path.join(projectRoot, "AGENTS.md")
  const marker = `<!-- tyohncn:pack:${packName} -->`
  const block = [
    "",
    marker,
    `## tyohncn pack: ${packName}`,
    loadWhen ? `Load when: ${loadWhen}` : null,
    `Skill files: \`.tyohn/packs/${packName}/\``,
    `<!-- /tyohncn:pack:${packName} -->`,
    "",
  ]
    .filter((l) => l !== null)
    .join("\n")

  if (await fs.pathExists(agentsPath)) {
    const existing = await fs.readFile(agentsPath, "utf8")
    if (existing.includes(marker)) return
    await fs.writeFile(agentsPath, `${existing.trimEnd()}\n${block}`)
  } else {
    await fs.writeFile(
      agentsPath,
      `# AGENTS\n\nProject agent notes for tyohncn design packs.\n${block}`
    )
  }
}

export async function removeAgentsPointer(projectRoot: string, packName: string) {
  const agentsPath = path.join(projectRoot, "AGENTS.md")
  if (!(await fs.pathExists(agentsPath))) return
  let text = await fs.readFile(agentsPath, "utf8")
  const re = new RegExp(
    `\\n?<!-- tyohncn:pack:${packName} -->[\\s\\S]*?<!-- /tyohncn:pack:${packName} -->\\n?`,
    "g"
  )
  text = text.replace(re, "\n")
  await fs.writeFile(agentsPath, text.trimEnd() + "\n")
}

export async function scaffoldPack(
  name: string,
  destDir: string,
  mode: "apply" | "css-vars" = "css-vars"
) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    throw new Error(`Invalid pack name "${name}" (use kebab-case)`)
  }
  const root = path.join(destDir, name)
  if (await fs.pathExists(root)) {
    throw new Error(`Directory already exists: ${root}`)
  }

  await fs.ensureDir(path.join(root, "skill"))
  const scopeClass = `style-${name}`

  const packJson: DesignPackManifest = {
    name,
    displayName: name,
    description: `Design pack ${name}`,
    kind: "design",
    style: {
      file: "style.css",
      scopeClass,
      mode,
    },
    theme: {
      file: "theme.css",
    },
    skill: {
      reference: "skill/pack.md",
      loadWhen: `the project uses the ${name} design pack`,
    },
    quality: "quality.md",
  }

  await fs.writeJson(path.join(root, "pack.json"), packJson, { spaces: 2 })

  const styleCss =
    mode === "css-vars"
      ? `/**
 * ${name} design pack — CSS vars density
 */
.${scopeClass} {
  --cn-button-height: 2.25rem;
  --cn-button-padding-x: 1rem;
  --cn-button-radius: calc(var(--radius) - 2px);
  --cn-input-height: 2.25rem;
  --cn-card-radius: calc(var(--radius) + 2px);

  .cn-button {
    height: var(--cn-button-height);
    padding-inline: var(--cn-button-padding-x);
    border-radius: var(--cn-button-radius);
    @apply inline-flex items-center justify-center font-medium;
  }

  .cn-button-variant-default {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }

  .cn-input {
    height: var(--cn-input-height);
    @apply w-full rounded-md border border-input bg-transparent px-3 text-sm;
  }

  .cn-card {
    border-radius: var(--cn-card-radius);
    @apply bg-card text-card-foreground border shadow-sm;
  }
}
`
      : `/**
 * ${name} design pack — @apply mode
 */
.${scopeClass} {
  .cn-button {
    @apply inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium;
  }

  .cn-button-variant-default {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }

  .cn-input {
    @apply flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm;
  }

  .cn-card {
    @apply rounded-xl border bg-card text-card-foreground shadow-sm;
  }
}
`

  await fs.writeFile(path.join(root, "style.css"), styleCss)
  await fs.writeFile(
    path.join(root, "theme.css"),
    `/* Semantic theme for ${name} — edit brand tokens here */

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.45 0.15 250);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.7 0.12 250);
  --primary-foreground: oklch(0.2 0.05 250);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
}
`
  )
  await fs.writeFile(
    path.join(root, "skill/pack.md"),
    `# ${name} design pack

Scope class: \`${scopeClass}\`.

\`\`\`bash
tyohncn pack add ./${name}
\`\`\`

Wrap the app root with \`className="${scopeClass}"\`.
`
  )
  await fs.writeFile(
    path.join(root, "quality.md"),
    `# ${name} quality bar

- [ ] \`tyohncn pack validate ./${name}\` passes
- [ ] Style scoped under \`.${scopeClass}\`
- [ ] Components keep \`cn-*\` after install
`
  )

  return root
}

/** Whether a style arg should go through pack resolve (not only registry builtin). */
export async function isBuiltinStyleName(name: string): Promise<boolean> {
  try {
    const { loadStylesManifest } = await import("./project.js")
    const styles = await loadStylesManifest()
    return styles.items.some((s) => s.name === name)
  } catch {
    return false
  }
}

export function isPackSource(source: string): boolean {
  const s = source.trim()
  if (looksLikeLocalPath(s) || looksLikeNpm(s) || looksLikeGithub(s)) return true
  // official pack name
  return listOfficialPacks().some((p) => p.name === s)
}
