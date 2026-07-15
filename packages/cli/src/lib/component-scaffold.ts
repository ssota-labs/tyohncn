import fs from "fs-extra"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  findProjectRoot,
  readConfig,
  resolveRegistryRoot,
  type TyohnConfig,
} from "./project.js"

export type ComponentScaffoldOptions = {
  name: string
  variants: string[]
  sizes: string[]
  mode: "css-vars" | "apply"
  styles: string[]
  base: "none" | "div" | "button"
  into?: string
  dryRun?: boolean
}

export type ScaffoldResult = {
  mode: "registry" | "consumer"
  root: string
  tsxPath: string
  stylePaths: string[]
  tokensPath: string | null
  tokensAdded: string[]
}

export type CheckIssue = {
  level: "error" | "warn"
  message: string
}

const DENSITY_UTIL_RE =
  /\b(?:h|w|min-h|min-w|max-h|max-w|p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|rounded|text|leading|tracking|shadow|ring|border)-\S+/

/** Tailwind size-* (icon buttons etc.) — not cn-*-size-* hooks */
const TW_SIZE_UTIL_RE = /\bsize-(?:\[[^\]]+\]|\d)/

function looksLikeDensityUtil(token: string): boolean {
  if (token.startsWith("cn-") || token.startsWith("group/")) return false
  return DENSITY_UTIL_RE.test(token) || TW_SIZE_UTIL_RE.test(token)
}

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
}

function toCamelCase(name: string): string {
  const pascal = toPascalCase(name)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

export function assertComponentName(name: string) {
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    throw new Error(
      `Invalid component name "${name}" (use kebab-case, e.g. callout-banner)`
    )
  }
}

export function parseCsvList(value: string | undefined, fallback: string[]): string[] {
  if (!value || !value.trim()) return fallback
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function resolveMonorepoRegistryUiDir(): string | null {
  try {
    const registry = resolveRegistryRoot()
    const ui = path.join(registry, "ui")
    if (fs.existsSync(ui)) return ui
  } catch {
    // ignore
  }
  // Walk up from CLI package for monorepo layout
  const here = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(here, "../../../registry/ui"),
    path.resolve(here, "../../registry/ui"),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return null
}

async function resolveConsumerDirs(root: string): Promise<{
  uiDir: string
  stylesDir: string
  config: TyohnConfig
}> {
  const config = await readConfig(root)
  if (!config) {
    throw new Error(
      `No tyohncn.json in ${root}. Run tyohncn init, or pass --into packages/registry`
    )
  }
  const uiRel = config.aliases.ui.replace(/^@\//, "")
  return {
    uiDir: path.join(root, uiRel),
    stylesDir: path.join(root, config.css.stylesDir),
    config,
  }
}

function scopeClassForStyleName(styleName: string): string {
  // mira-vars → style-mira; ssota → style-ssota
  if (styleName.endsWith("-vars")) {
    return `style-${styleName.replace(/-vars$/, "")}`
  }
  return `style-${styleName}`
}

function styleFileForName(stylesDir: string, styleName: string): string {
  return path.join(stylesDir, `style-${styleName}.css`)
}

export function buildTsxSource(opts: {
  name: string
  variants: string[]
  sizes: string[]
  base: "none" | "div" | "button"
}): string {
  const { name, variants, sizes, base } = opts
  const pascal = toPascalCase(name)
  const camel = toCamelCase(name)
  const variantsBlock = variants
    .map((v) => `        ${JSON.stringify(v)}: "cn-${name}-variant-${v}",`)
    .join("\n")
  const sizesBlock = sizes
    .map((s) => `        ${JSON.stringify(s)}: "cn-${name}-size-${s}",`)
    .join("\n")

  const hasVariants = variants.length > 0
  const hasSizes = sizes.length > 0

  let variantsConfig = ""
  if (hasVariants || hasSizes) {
    const parts: string[] = []
    if (hasVariants) {
      parts.push(`      variant: {\n${variantsBlock}\n      },`)
    }
    if (hasSizes) {
      parts.push(`      size: {\n${sizesBlock}\n      },`)
    }
    const defaults: string[] = []
    if (hasVariants) defaults.push(`      variant: ${JSON.stringify(variants[0])},`)
    if (hasSizes) defaults.push(`      size: ${JSON.stringify(sizes[0])},`)
    variantsConfig = `,
  {
    variants: {
${parts.join("\n")}
    },
    defaultVariants: {
${defaults.join("\n")}
    },
  }`
  }

  const rootClass = `cn-${name} group/${name}`
  const structural =
    base === "button"
      ? "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50"
      : "outline-none"

  if (base === "none") {
    return `import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ${camel}Variants = cva(
  "${rootClass} ${structural}",
${variantsConfig ? variantsConfig.slice(1) : "  {}"}
)

type ${pascal}Props = React.ComponentProps<"div"> &
  VariantProps<typeof ${camel}Variants>

function ${pascal}({
  className,
${hasVariants ? "  variant," : ""}
${hasSizes ? "  size," : ""}
  ...props
}: ${pascal}Props) {
  return (
    <div
      data-slot="${name}"
      className={cn(${camel}Variants({ ${[
        hasVariants ? "variant" : null,
        hasSizes ? "size" : null,
        "className",
      ]
        .filter(Boolean)
        .join(", ")} }))}
      {...props}
    />
  )
}

export { ${pascal}, ${camel}Variants }
`
  }

  if (base === "button") {
    return `import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ${camel}Variants = cva(
  "${rootClass} ${structural}",
${variantsConfig ? variantsConfig.slice(1) : "  {}"}
)

function ${pascal}({
  className,
${hasVariants ? `  variant = ${JSON.stringify(variants[0])},` : ""}
${hasSizes ? `  size = ${JSON.stringify(sizes[0])},` : ""}
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof ${camel}Variants>) {
  return (
    <ButtonPrimitive
      data-slot="${name}"
      className={cn(${camel}Variants({ ${[
        hasVariants ? "variant" : null,
        hasSizes ? "size" : null,
        "className",
      ]
        .filter(Boolean)
        .join(", ")} }))}
      {...props}
    />
  )
}

export { ${pascal}, ${camel}Variants }
`
  }

  // div
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ${camel}Variants = cva(
  "${rootClass} ${structural}",
${variantsConfig ? variantsConfig.slice(1) : "  {}"}
)

function ${pascal}({
  className,
${hasVariants ? `  variant = ${JSON.stringify(variants[0])},` : ""}
${hasSizes ? `  size = ${JSON.stringify(sizes[0])},` : ""}
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof ${camel}Variants>) {
  return (
    <div
      data-slot="${name}"
      className={cn(${camel}Variants({ ${[
        hasVariants ? "variant" : null,
        hasSizes ? "size" : null,
        "className",
      ]
        .filter(Boolean)
        .join(", ")} }))}
      {...props}
    />
  )
}

export { ${pascal}, ${camel}Variants }
`
}

export function buildStyleStub(opts: {
  name: string
  variants: string[]
  sizes: string[]
  mode: "css-vars" | "apply"
  scopeClass: string
}): string {
  const { name, variants, sizes, mode, scopeClass } = opts
  const markerStart = `/* tyohncn:component:${name} */`
  const markerEnd = `/* /tyohncn:component:${name} */`

  const variantRules = variants
    .map((v) => {
      if (v === "default") {
        return `  .cn-${name}-variant-default {
    @apply bg-primary text-primary-foreground;
  }`
      }
      if (v === "outline") {
        return `  .cn-${name}-variant-outline {
    @apply border border-border bg-background text-foreground;
  }`
      }
      if (v === "secondary") {
        return `  .cn-${name}-variant-secondary {
    @apply bg-secondary text-secondary-foreground;
  }`
      }
      if (v === "ghost") {
        return `  .cn-${name}-variant-ghost {
    @apply hover:bg-muted hover:text-foreground;
  }`
      }
      if (v === "destructive") {
        return `  .cn-${name}-variant-destructive {
    @apply bg-destructive/10 text-destructive;
  }`
      }
      return `  .cn-${name}-variant-${v} {
    /* TODO: style for variant ${v} */
  }`
    })
    .join("\n\n")

  if (mode === "apply") {
    const sizeRules = sizes
      .map((s) => {
        if (s === "default") {
          return `  .cn-${name}-size-default {
    @apply h-9 px-4 text-sm;
  }`
        }
        if (s === "sm") {
          return `  .cn-${name}-size-sm {
    @apply h-8 px-3 text-xs;
  }`
        }
        if (s === "lg") {
          return `  .cn-${name}-size-lg {
    @apply h-10 px-6 text-base;
  }`
        }
        return `  .cn-${name}-size-${s} {
    /* TODO: size ${s} */
  }`
      })
      .join("\n\n")

    return `${markerStart}
.${scopeClass} {
  .cn-${name} {
    @apply inline-flex items-center justify-center rounded-md font-medium;
  }

${variantRules}

${sizeRules}
}
${markerEnd}
`
  }

  // css-vars
  const tokenLines = [
    `  --cn-${name}-height: 2.25rem;`,
    `  --cn-${name}-padding-x: 1rem;`,
    `  --cn-${name}-radius: calc(var(--radius) - 2px);`,
    `  --cn-${name}-font-size: 0.875rem;`,
  ]
  for (const s of sizes) {
    if (s === "default") continue
    if (s === "sm") {
      tokenLines.push(`  --cn-${name}-height-sm: 2rem;`)
      tokenLines.push(`  --cn-${name}-padding-x-sm: 0.75rem;`)
    } else if (s === "lg") {
      tokenLines.push(`  --cn-${name}-height-lg: 2.5rem;`)
      tokenLines.push(`  --cn-${name}-padding-x-lg: 1.25rem;`)
    } else if (s === "xs") {
      tokenLines.push(`  --cn-${name}-height-xs: 1.75rem;`)
      tokenLines.push(`  --cn-${name}-padding-x-xs: 0.5rem;`)
    } else {
      tokenLines.push(`  --cn-${name}-height-${s}: 2.25rem;`)
      tokenLines.push(`  --cn-${name}-padding-x-${s}: 1rem;`)
    }
  }

  const sizeRules = sizes
    .map((s) => {
      if (s === "default") {
        return `  .cn-${name}-size-default {
    height: var(--cn-${name}-height);
    padding-inline: var(--cn-${name}-padding-x);
  }`
      }
      return `  .cn-${name}-size-${s} {
    height: var(--cn-${name}-height-${s}, var(--cn-${name}-height));
    padding-inline: var(--cn-${name}-padding-x-${s}, var(--cn-${name}-padding-x));
  }`
    })
    .join("\n\n")

  return `${markerStart}
.${scopeClass} {
${tokenLines.join("\n")}

  .cn-${name} {
    height: var(--cn-${name}-height);
    padding-inline: var(--cn-${name}-padding-x);
    border-radius: var(--cn-${name}-radius);
    font-size: var(--cn-${name}-font-size);
    @apply inline-flex items-center justify-center font-medium;
  }

${variantRules}

${sizeRules}
}
${markerEnd}
`
}

export function styleTokenNamesForComponent(
  name: string,
  sizes: string[]
): string[] {
  const tokens = [
    `--cn-${name}-height`,
    `--cn-${name}-padding-x`,
    `--cn-${name}-radius`,
    `--cn-${name}-font-size`,
  ]
  for (const s of sizes) {
    if (s === "default") continue
    tokens.push(`--cn-${name}-height-${s}`, `--cn-${name}-padding-x-${s}`)
  }
  return tokens
}

async function upsertStyleStub(
  stylePath: string,
  stub: string,
  name: string,
  scopeClass: string,
  dryRun: boolean
): Promise<"created" | "updated" | "unchanged"> {
  const markerStart = `/* tyohncn:component:${name} */`
  const markerEnd = `/* /tyohncn:component:${name} */`

  if (!(await fs.pathExists(stylePath))) {
    // Create a minimal scoped file
    const content = `/**
 * Generated style stubs for consumer/local components.
 */
.${scopeClass} {
}

${stub}
`
    if (!dryRun) {
      await fs.ensureDir(path.dirname(stylePath))
      await fs.writeFile(stylePath, content)
    }
    return "created"
  }

  let css = await fs.readFile(stylePath, "utf8")
  if (css.includes(markerStart)) {
    const re = new RegExp(
      `${escapeRegExp(markerStart)}[\\s\\S]*?${escapeRegExp(markerEnd)}\\n?`,
      "g"
    )
    const next = css.replace(re, `${stub.trimEnd()}\n`)
    if (next === css) return "unchanged"
    if (!dryRun) await fs.writeFile(stylePath, next)
    return "updated"
  }

  // Append stub. Prefer inserting inside existing .scopeClass block if simple —
  // for reliability, append after file (stub includes its own .scopeClass wrapper).
  // Nested duplicate .style-x blocks are valid in CSS nesting if postcss supports it;
  // mira-vars already uses one top-level .style-mira. Appending another .style-mira
  // block is fine (same specificity merge).
  css = `${css.trimEnd()}\n\n${stub.trimEnd()}\n`
  if (!dryRun) await fs.writeFile(stylePath, css)
  return "updated"
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function mergeTokensJson(
  tokensPath: string,
  tokenNames: string[],
  dryRun: boolean
): Promise<string[]> {
  if (!(await fs.pathExists(tokensPath))) return []
  const data = (await fs.readJson(tokensPath)) as {
    version: number
    theme: { tokens: string[] }
    style: { description?: string; tokens: string[] }
  }
  const existing = new Set(data.style?.tokens ?? [])
  const added: string[] = []
  for (const t of tokenNames) {
    if (!existing.has(t)) {
      existing.add(t)
      added.push(t)
    }
  }
  if (added.length && !dryRun) {
    data.style.tokens = [...existing].sort()
    await fs.writeJson(tokensPath, data, { spaces: 2 })
  }
  return added
}

export async function scaffoldComponent(
  opts: ComponentScaffoldOptions,
  cwd = process.cwd()
): Promise<ScaffoldResult> {
  assertComponentName(opts.name)

  const { mode, root, uiDir, stylesDir } = await resolveScaffoldTarget(
    opts.into,
    cwd
  )

  const tsxPath = path.join(uiDir, `${opts.name}.tsx`)
  if ((await fs.pathExists(tsxPath)) && !opts.dryRun) {
    throw new Error(`Component already exists: ${tsxPath}`)
  }

  const tsx = buildTsxSource({
    name: opts.name,
    variants: opts.variants,
    sizes: opts.sizes,
    base: opts.base,
  })

  const stylePaths: string[] = []
  for (const styleName of opts.styles) {
    const stylePath = styleFileForName(stylesDir, styleName)
    const scopeClass = scopeClassForStyleName(styleName)
    const stub = buildStyleStub({
      name: opts.name,
      variants: opts.variants,
      sizes: opts.sizes,
      mode: opts.mode,
      scopeClass,
    })
    await upsertStyleStub(
      stylePath,
      stub,
      opts.name,
      scopeClass,
      Boolean(opts.dryRun)
    )
    stylePaths.push(stylePath)
  }

  if (!opts.dryRun) {
    await fs.ensureDir(uiDir)
    await fs.writeFile(tsxPath, tsx)
  }

  let tokensPath: string | null = null
  let tokensAdded: string[] = []
  if (mode === "registry") {
    tokensPath = path.join(root, "manifest/tokens.json")
    tokensAdded = await mergeTokensJson(
      tokensPath,
      styleTokenNamesForComponent(opts.name, opts.sizes),
      Boolean(opts.dryRun)
    )
  }

  return {
    mode,
    root,
    tsxPath,
    stylePaths,
    tokensPath,
    tokensAdded,
  }
}

async function resolveScaffoldTarget(
  into: string | undefined,
  cwd: string
): Promise<{
  mode: "registry" | "consumer"
  root: string
  uiDir: string
  stylesDir: string
}> {
  if (into) {
    const abs = path.resolve(into)
    if (
      (await fs.pathExists(path.join(abs, "ui"))) &&
      (await fs.pathExists(path.join(abs, "styles")))
    ) {
      return {
        mode: "registry",
        root: abs,
        uiDir: path.join(abs, "ui"),
        stylesDir: path.join(abs, "styles"),
      }
    }
    const projectRoot = findProjectRoot(abs)
    const consumer = await resolveConsumerDirs(projectRoot)
    return {
      mode: "consumer",
      root: projectRoot,
      uiDir: consumer.uiDir,
      stylesDir: consumer.stylesDir,
    }
  }

  // Auto: monorepo registry if present and cwd looks like the tyohncn repo
  const registryUi = resolveMonorepoRegistryUiDir()
  if (registryUi) {
    const registryRoot = path.dirname(registryUi)
    const repoHint =
      (await fs.pathExists(path.join(registryRoot, "manifest"))) &&
      ((await fs.pathExists(path.join(registryRoot, "..", "cli"))) ||
        (await fs.pathExists(path.join(cwd, "packages", "registry"))))
    if (repoHint || cwd.includes("tyohncn") || cwd.includes("/workspace")) {
      return {
        mode: "registry",
        root: registryRoot,
        uiDir: registryUi,
        stylesDir: path.join(registryRoot, "styles"),
      }
    }
  }

  const projectRoot = findProjectRoot(cwd)
  const consumer = await resolveConsumerDirs(projectRoot)
  return {
    mode: "consumer",
    root: projectRoot,
    uiDir: consumer.uiDir,
    stylesDir: consumer.stylesDir,
  }
}

/**
 * Extract CVA variant/size string map values from source for density lint.
 */
export function extractCvaClassStrings(source: string): string[] {
  const out: string[] = []
  // Match quoted class strings that look like CVA map values
  const re = /:\s*["'`]([^"'`]+)["'`]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source))) {
    out.push(m[1]!)
  }
  return out
}

export function checkComponentSource(
  source: string,
  name: string
): CheckIssue[] {
  const issues: CheckIssue[] = []
  const rootHook = `cn-${name}`
  if (!source.includes(rootHook)) {
    issues.push({
      level: "error",
      message: `Missing root hook "${rootHook}" in TSX`,
    })
  }

  // Flag density utils inside quoted strings that are NOT cn-* only
  const classStrings = extractCvaClassStrings(source)
  for (const cls of classStrings) {
    const tokens = cls.split(/\s+/).filter(Boolean)
    const density = tokens.filter((t) => looksLikeDensityUtil(t))
    // Allow structural utilities on the root cva base string
    const isRootBase = tokens.includes(rootHook)
    if (density.length && tokens.every((t) => !t.startsWith("cn-"))) {
      // variant map value with only density utils, no cn-*
      issues.push({
        level: "error",
        message: `Density/chrome utilities in CVA map without cn-* hook: "${cls}"`,
      })
    } else if (
      density.length &&
      tokens.some(
        (t) =>
          t.startsWith(`cn-${name}-variant-`) ||
          t.startsWith(`cn-${name}-size-`)
      )
    ) {
      issues.push({
        level: "error",
        message: `Variant/size class should be cn-* only: "${cls}"`,
      })
    } else if (!isRootBase && density.length && tokens.some((t) => t.startsWith("cn-"))) {
      issues.push({
        level: "warn",
        message: `Mixed cn-* and density utilities: "${cls}"`,
      })
    }
  }

  // Stronger check: variant/size map values should be exactly one cn-* token
  const variantMapRe =
    /(?:variant|size)\s*:\s*\{([\s\S]*?)\}(?:\s*,|\s*\})/g
  let vm: RegExpExecArray | null
  while ((vm = variantMapRe.exec(source))) {
    const body = vm[1]!
    const entryRe = /["']?[\w-]+["']?\s*:\s*["'`]([^"'`]+)["'`]/g
    let em: RegExpExecArray | null
    while ((em = entryRe.exec(body))) {
      const value = em[1]!.trim()
      const parts = value.split(/\s+/).filter(Boolean)
      if (parts.length !== 1 || !parts[0]!.startsWith("cn-")) {
        issues.push({
          level: "error",
          message: `CVA variant/size value must be a single cn-* hook (got "${value}")`,
        })
      } else if (parts.some((p) => looksLikeDensityUtil(p))) {
        issues.push({
          level: "error",
          message: `CVA variant/size value looks like a density utility: "${value}"`,
        })
      }
    }
  }

  if (/transformStyleMap/.test(source)) {
    issues.push({
      level: "error",
      message: "transformStyleMap must not appear in component sources",
    })
  }

  return issues
}

export async function checkComponent(
  nameOrPath: string,
  opts: { stylesDir?: string; styles?: string[] } = {}
): Promise<{ name: string; tsxPath: string; issues: CheckIssue[] }> {
  let tsxPath: string
  let name: string

  if (nameOrPath.endsWith(".tsx") || nameOrPath.includes("/") || nameOrPath.startsWith(".")) {
    tsxPath = path.resolve(nameOrPath)
    name = path.basename(tsxPath, ".tsx")
  } else {
    name = nameOrPath
    assertComponentName(name)
    const registryUi = resolveMonorepoRegistryUiDir()
    const projectRoot = findProjectRoot()
    const config = await readConfig(projectRoot)
    const candidates = [
      registryUi ? path.join(registryUi, `${name}.tsx`) : null,
      config
        ? path.join(projectRoot, config.aliases.ui.replace(/^@\//, ""), `${name}.tsx`)
        : null,
    ].filter(Boolean) as string[]
    const found = candidates.find((c) => fs.existsSync(c))
    if (!found) {
      throw new Error(
        `Cannot find component "${name}". Tried: ${candidates.join(", ")}`
      )
    }
    tsxPath = found
  }

  const source = await fs.readFile(tsxPath, "utf8")
  const issues = checkComponentSource(source, name)

  // Prefer styles next to the component (registry/ui → ../styles, components/ui → ../../styles)
  const candidateStyleDirs = [
    path.join(path.dirname(tsxPath), "..", "styles"),
    path.join(path.dirname(tsxPath), "..", "..", "styles"),
    opts.stylesDir,
  ].filter(Boolean) as string[]

  let stylesDir: string | null = null
  for (const d of candidateStyleDirs) {
    if (await fs.pathExists(d)) {
      stylesDir = d
      break
    }
  }

  const styleNames = opts.styles ?? ["mira-vars", "ssota"]
  if (stylesDir) {
    for (const styleName of styleNames) {
      const stylePath = path.join(stylesDir, `style-${styleName}.css`)
      if (!(await fs.pathExists(stylePath))) continue
      const css = await fs.readFile(stylePath, "utf8")
      if (!css.includes(`.cn-${name}`)) {
        issues.push({
          level: "warn",
          message: `Style file ${path.basename(stylePath)} has no .cn-${name} rules`,
        })
      }
    }
  }

  return { name, tsxPath, issues }
}
