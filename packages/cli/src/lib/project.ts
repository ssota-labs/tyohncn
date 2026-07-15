import fs from "fs-extra"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)

export type TyohnConfig = {
  style: string
  base: "base-ui"
  mode: "external"
  aliases: {
    components: string
    utils: string
    hooks: string
    ui: string
  }
  css: {
    globals: string
    stylesDir: string
  }
  tailwind: boolean
  rsc: boolean
}

export const DEFAULT_CONFIG: TyohnConfig = {
  style: "mira",
  base: "base-ui",
  mode: "external",
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    hooks: "@/hooks",
    ui: "@/components/ui",
  },
  css: {
    globals: "app/globals.css",
    stylesDir: "styles",
  },
  tailwind: true,
  rsc: true,
}

export function findProjectRoot(cwd = process.cwd()): string {
  let dir = cwd
  while (true) {
    if (
      fs.existsSync(path.join(dir, "package.json")) ||
      fs.existsSync(path.join(dir, "tyohncn.json"))
    ) {
      return dir
    }
    const parent = path.dirname(dir)
    if (parent === dir) return cwd
    dir = parent
  }
}

export function configPath(root: string) {
  return path.join(root, "tyohncn.json")
}

export async function readConfig(root: string): Promise<TyohnConfig | null> {
  const file = configPath(root)
  if (!(await fs.pathExists(file))) return null
  return fs.readJson(file)
}

export async function writeConfig(root: string, config: TyohnConfig) {
  await fs.writeJson(configPath(root), config, { spaces: 2 })
}

/** Resolve @tyohn/registry package root (workspace or published). */
export function resolveRegistryRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))

  // tsup bundles to dist/index.js — here is packages/cli/dist
  const candidates = [
    path.resolve(here, "../../registry"),
    path.resolve(here, "../../../registry"),
    path.resolve(here, "../node_modules/@tyohn/registry"),
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "manifest/components.json"))) {
      return candidate
    }
  }

  try {
    const pkgJson = require.resolve("@tyohn/registry/package.json")
    return path.dirname(pkgJson)
  } catch {
    throw new Error(
      "Cannot resolve @tyohn/registry. Run from the tyohncn monorepo or install the package."
    )
  }
}

export async function loadComponentsManifest() {
  const root = resolveRegistryRoot()
  return fs.readJson(path.join(root, "manifest/components.json")) as Promise<{
    version: number
    base: string
    items: Array<{
      name: string
      type: string
      file: string
      npmDependencies: string[]
      registryDependencies: string[]
    }>
  }>
}

export async function loadStylesManifest() {
  const root = resolveRegistryRoot()
  return fs.readJson(path.join(root, "manifest/styles.json")) as Promise<{
    version: number
    items: Array<{
      name: string
      file: string
      scopeClass: string
      mode: string
    }>
  }>
}

/**
 * External mode: NEVER run transformStyleMap / cn-* strip.
 * Components are copied with cn-* class hooks intact.
 */
export function assertExternalMode(config: TyohnConfig) {
  if (config.mode !== "external") {
    throw new Error(
      `tyohncn only supports external style mode (got mode=${config.mode})`
    )
  }
}

export function aliasToFsPath(root: string, aliasPath: string, aliases: TyohnConfig["aliases"]) {
  // Map @/components/ui/button -> <root>/components/ui/button
  let rel = aliasPath
  if (rel.startsWith("@/")) {
    rel = rel.slice(2)
  }
  return path.join(root, rel)
}

export function rewriteComponentSource(source: string, config: TyohnConfig) {
  return source
    .replaceAll("@/lib/utils", config.aliases.utils)
    .replaceAll("@/hooks/use-mobile", `${config.aliases.hooks}/use-mobile`)
    .replaceAll("@/components/ui/", `${config.aliases.ui}/`)
}
