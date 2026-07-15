import { Command } from "commander"
import path from "node:path"
import fs from "fs-extra"
import kleur from "kleur"
import {
  assertExternalMode,
  findProjectRoot,
  readConfig,
  writeConfig,
} from "../lib/project.js"
import { installComponent, installStyle } from "../lib/install.js"
import {
  ICON_LIBRARY_NAMES,
  isIconLibraryName,
} from "../lib/icon-libraries.js"
import { collectIconPackages } from "../lib/transform-icons.js"

export const applyCommand = new Command("apply")
  .description(
    "Apply a style pack (CSS only) and/or re-resolve icons into component TSX"
  )
  .option("-s, --style <preset>", "Style preset (mira, vega, mira-vars, …)")
  .option(
    "-i, --icon <library>",
    `Icon library (${ICON_LIBRARY_NAMES.join(" | ")})`
  )
  .option("--cwd <path>", "Working directory")
  .action(async (opts) => {
    if (!opts.style && !opts.icon) {
      console.error(kleur.red("Provide --style and/or --icon"))
      process.exit(1)
    }

    const root = findProjectRoot(opts.cwd ? path.resolve(opts.cwd) : process.cwd())
    const config = await readConfig(root)
    if (!config) {
      console.error(kleur.red("Missing tyohncn.json. Run: tyohncn init"))
      process.exit(1)
    }
    assertExternalMode(config)

    if (opts.style) {
      const uiDir = path.join(root, config.aliases.ui.replace(/^@\//, ""))
      const before = await snapshotTsx(uiDir)

      const { dest, scopeClass } = await installStyle(root, config, opts.style)
      config.style = opts.style
      await writeConfig(root, config)

      const after = await snapshotTsx(uiDir)
      const touched = [...before.keys()].filter(
        (f) => before.get(f) !== after.get(f)
      )

      console.log(
        kleur.green("✔"),
        "Style CSS →",
        kleur.cyan(path.relative(root, dest))
      )
      console.log(kleur.green("✔"), "Active style:", kleur.cyan(opts.style))
      console.log(
        kleur.dim(`Use root class "${scopeClass}" (file defines that scope).`)
      )
      if (touched.length > 0) {
        console.error(
          kleur.red("Invariant violated: component TSX changed during style apply:")
        )
        for (const f of touched) console.error(" ", f)
        process.exit(1)
      } else {
        console.log(kleur.green("✔"), "Component TSX unchanged (CSS-only style apply)")
      }
    }

    if (opts.icon) {
      if (!isIconLibraryName(opts.icon)) {
        console.error(
          kleur.red(
            `Unknown icon library "${opts.icon}". Available: ${ICON_LIBRARY_NAMES.join(", ")}`
          )
        )
        process.exit(1)
      }

      config.iconLibrary = opts.icon
      await writeConfig(root, config)

      const uiDir = path.join(root, config.aliases.ui.replace(/^@\//, ""))
      const files = (await fs.pathExists(uiDir))
        ? (await fs.readdir(uiDir)).filter((f) => f.endsWith(".tsx"))
        : []

      const { loadComponentsManifest } = await import("../lib/project.js")
      const manifest = await loadComponentsManifest()
      const known = new Set(manifest.items.map((i) => i.name))

      const rewritten: string[] = []
      const done = new Set<string>()
      for (const file of files) {
        const name = file.replace(/\.tsx$/, "")
        if (!known.has(name)) continue
        rewritten.push(...(await installComponent(root, config, name, done)))
      }

      const pkgs = collectIconPackages(opts.icon)
      console.log(kleur.green("✔"), "Icon library →", kleur.cyan(opts.icon))
      console.log(
        kleur.green("✔"),
        `Re-resolved ${rewritten.length} component file(s) from registry`
      )
      console.log(kleur.dim(`Install icons: pnpm add ${pkgs.join(" ")}`))
    }
  })

async function snapshotTsx(uiDir: string) {
  const map = new Map<string, number>()
  if (!(await fs.pathExists(uiDir))) return map
  const files = (await fs.readdir(uiDir)).filter((f) => f.endsWith(".tsx"))
  for (const f of files) {
    const st = await fs.stat(path.join(uiDir, f))
    map.set(f, st.mtimeMs)
  }
  return map
}
