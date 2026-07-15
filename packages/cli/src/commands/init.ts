import { Command } from "commander"
import fs from "fs-extra"
import path from "node:path"
import kleur from "kleur"
import {
  DEFAULT_CONFIG,
  findProjectRoot,
  writeConfig,
  type TyohnConfig,
} from "../lib/project.js"
import { ensureUtils, installStyle, installTheme } from "../lib/install.js"

export const initCommand = new Command("init")
  .description("Initialize tyohncn external style mode in the current project")
  .option("-s, --style <preset>", "Style preset", "mira")
  .option("--css <path>", "Path to globals.css", "app/globals.css")
  .option("--styles-dir <path>", "Directory for style-*.css", "styles")
  .option("--cwd <path>", "Working directory")
  .action(async (opts) => {
    const root = findProjectRoot(opts.cwd ? path.resolve(opts.cwd) : process.cwd())
    const config: TyohnConfig = {
      ...DEFAULT_CONFIG,
      style: opts.style,
      css: {
        globals: opts.css,
        stylesDir: opts.stylesDir,
      },
    }

    await writeConfig(root, config)
    await ensureUtils(root, config)
    await installStyle(root, config, config.style)
    await installTheme(root, config)

    // Hint: wrap app root with style scope class
    const scope = `style-${config.style.replace(/-vars$/, "")}`
    // mira-vars file uses .style-mira — keep that
    const stylesManifestHint =
      config.style.includes("-vars") || config.style === "ssota"
        ? config.style === "ssota"
          ? "style-ssota"
          : `style-${config.style.replace(/-vars$/, "")}`
        : `style-${config.style}`

    console.log(kleur.green("✔"), "Wrote", kleur.cyan("tyohncn.json"))
    console.log(kleur.green("✔"), "Installed theme →", kleur.cyan(config.css.globals))
    console.log(
      kleur.green("✔"),
      "Installed style →",
      kleur.cyan(`${config.css.stylesDir}/style-${config.style}.css`)
    )
    console.log(
      kleur.dim(
        `Wrap your app root with className="${stylesManifestHint}" (e.g. <html class="${stylesManifestHint}">).`
      )
    )
    console.log(kleur.dim(`Next: tyohncn add button input card`))
    void scope
    void fs
  })
