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
import { installStyle } from "../lib/install.js"

export const applyCommand = new Command("apply")
  .description("Swap the active style pack (CSS only — no component TSX rewrite)")
  .requiredOption("-s, --style <preset>", "Style preset (mira, vega, mira-vars, …)")
  .option("--cwd <path>", "Working directory")
  .action(async (opts) => {
    const root = findProjectRoot(opts.cwd ? path.resolve(opts.cwd) : process.cwd())
    const config = await readConfig(root)
    if (!config) {
      console.error(kleur.red("Missing tyohncn.json. Run: tyohncn init"))
      process.exit(1)
    }
    assertExternalMode(config)

    // Snapshot component mtimes to prove we don't touch TSX
    const uiDir = path.join(root, config.aliases.ui.replace(/^@\//, ""))
    const before = await snapshotTsx(uiDir)

    const { dest, scopeClass } = await installStyle(root, config, opts.style)
    config.style = opts.style
    await writeConfig(root, config)

    const after = await snapshotTsx(uiDir)
    const touched = [...before.keys()].filter(
      (f) => before.get(f) !== after.get(f)
    )

    console.log(kleur.green("✔"), "Style CSS →", kleur.cyan(path.relative(root, dest)))
    console.log(kleur.green("✔"), "Active style:", kleur.cyan(opts.style))
    console.log(
      kleur.dim(`Use root class "${scopeClass}" (file defines that scope).`)
    )
    if (touched.length > 0) {
      console.error(
        kleur.red("Invariant violated: component TSX changed during apply:")
      )
      for (const f of touched) console.error(" ", f)
      process.exit(1)
    } else {
      console.log(kleur.green("✔"), "Component TSX unchanged (CSS-only apply)")
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
