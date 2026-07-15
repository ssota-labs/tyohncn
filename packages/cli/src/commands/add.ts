import { Command } from "commander"
import path from "node:path"
import kleur from "kleur"
import {
  assertExternalMode,
  findProjectRoot,
  readConfig,
} from "../lib/project.js"
import { ensureUtils, installComponent } from "../lib/install.js"

export const addCommand = new Command("add")
  .description("Add components with cn-* hooks preserved (no style inlining)")
  .argument("<components...>", "Component names (e.g. button input card)")
  .option("--cwd <path>", "Working directory")
  .action(async (components: string[], opts) => {
    const root = findProjectRoot(opts.cwd ? path.resolve(opts.cwd) : process.cwd())
    const config = await readConfig(root)
    if (!config) {
      console.error(kleur.red("Missing tyohncn.json. Run: tyohncn init"))
      process.exit(1)
    }
    assertExternalMode(config)
    await ensureUtils(root, config)

    const written: string[] = []
    for (const name of components) {
      written.push(...(await installComponent(root, config, name)))
    }

    for (const file of written) {
      console.log(kleur.green("✔"), "Added", kleur.cyan(path.relative(root, file)))
    }
    console.log(
      kleur.dim(
        "Style stays in CSS — component TSX keeps cn-* hooks (transformStyleMap disabled)."
      )
    )
  })
