import { Command } from "commander"
import path from "node:path"
import kleur from "kleur"
import {
  DEFAULT_CONFIG,
  findProjectRoot,
  writeConfig,
  type TyohnConfig,
} from "../lib/project.js"
import { ensureUtils, installStyle, installTheme } from "../lib/install.js"
import {
  ICON_LIBRARY_NAMES,
  isIconLibraryName,
} from "../lib/icon-libraries.js"
import { collectIconPackages } from "../lib/transform-icons.js"

export const initCommand = new Command("init")
  .description("Initialize tyohncn external style mode in the current project")
  .option("-s, --style <preset>", "Style preset", "mira")
  .option(
    "-i, --icon <library>",
    `Icon library (${ICON_LIBRARY_NAMES.join(" | ")})`,
    "lucide"
  )
  .option("--css <path>", "Path to globals.css", "app/globals.css")
  .option("--styles-dir <path>", "Directory for style-*.css", "styles")
  .option("--cwd <path>", "Working directory")
  .action(async (opts) => {
    const root = findProjectRoot(opts.cwd ? path.resolve(opts.cwd) : process.cwd())

    if (!isIconLibraryName(opts.icon)) {
      console.error(
        kleur.red(
          `Unknown icon library "${opts.icon}". Available: ${ICON_LIBRARY_NAMES.join(", ")}`
        )
      )
      process.exit(1)
    }

    const config: TyohnConfig = {
      ...DEFAULT_CONFIG,
      style: opts.style,
      iconLibrary: opts.icon,
      css: {
        globals: opts.css,
        stylesDir: opts.stylesDir,
      },
    }

    await writeConfig(root, config)
    await ensureUtils(root, config)
    await installStyle(root, config, config.style)
    await installTheme(root, config)

    const stylesManifestHint =
      config.style.includes("-vars") || config.style === "ssota"
        ? config.style === "ssota"
          ? "style-ssota"
          : `style-${config.style.replace(/-vars$/, "")}`
        : `style-${config.style}`

    const iconPackages = collectIconPackages(config.iconLibrary)

    console.log(kleur.green("✔"), "Wrote", kleur.cyan("tyohncn.json"))
    console.log(kleur.green("✔"), "Installed theme →", kleur.cyan(config.css.globals))
    console.log(
      kleur.green("✔"),
      "Installed style →",
      kleur.cyan(`${config.css.stylesDir}/style-${config.style}.css`)
    )
    console.log(
      kleur.green("✔"),
      "Icon library →",
      kleur.cyan(config.iconLibrary),
      kleur.dim(`(${iconPackages.join(", ")})`)
    )
    console.log(
      kleur.dim(
        `Wrap your app root with className="${stylesManifestHint}" (e.g. <html class="${stylesManifestHint}">).`
      )
    )
    console.log(
      kleur.dim(
        `Install icons: pnpm add ${iconPackages.join(" ")}`
      )
    )
    console.log(kleur.dim(`Next: tyohncn add button input card`))
  })
