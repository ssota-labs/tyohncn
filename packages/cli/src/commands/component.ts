import { Command } from "commander"
import path from "node:path"
import kleur from "kleur"
import {
  assertComponentName,
  checkComponent,
  parseCsvList,
  scaffoldComponent,
  resolveMonorepoRegistryUiDir,
} from "../lib/component-scaffold.js"
import { findProjectRoot, readConfig } from "../lib/project.js"
import fs from "fs-extra"

export const componentCommand = new Command("component").description(
  "Scaffold and lint components with cn-* / style-token separation"
)

componentCommand
  .command("new")
  .description(
    "Create a component with cn-* CVA hooks and style CSS stubs (no density in TSX)"
  )
  .argument("<name>", "Component name (kebab-case)")
  .option(
    "--variants <list>",
    "Comma-separated variants",
    "default,outline,secondary"
  )
  .option("--sizes <list>", "Comma-separated sizes", "default,sm,lg")
  .option("--mode <mode>", "css-vars | apply", "css-vars")
  .option(
    "--styles <list>",
    "Style files to stub (without style- prefix)",
    "mira-vars,ssota"
  )
  .option("--base <base>", "none | div | button", "div")
  .option(
    "--into <dir>",
    "Target: packages/registry or a consumer project root (default: auto)"
  )
  .option("--dry-run", "Print actions without writing")
  .action(async (name: string, opts) => {
    try {
      assertComponentName(name)
      const mode = opts.mode === "apply" ? "apply" : "css-vars"
      const base =
        opts.base === "button" || opts.base === "none" ? opts.base : "div"

      const result = await scaffoldComponent({
        name,
        variants: parseCsvList(opts.variants, ["default", "outline", "secondary"]),
        sizes: parseCsvList(opts.sizes, ["default", "sm", "lg"]),
        mode,
        styles: parseCsvList(opts.styles, ["mira-vars", "ssota"]),
        base,
        into: opts.into,
        dryRun: Boolean(opts.dryRun),
      })

      if (opts.dryRun) {
        console.log(kleur.dim("Dry run — would write:"))
      }

      console.log(
        kleur.green("✔"),
        opts.dryRun ? "Would create" : "Created",
        kleur.cyan(path.relative(process.cwd(), result.tsxPath) || result.tsxPath)
      )
      for (const sp of result.stylePaths) {
        console.log(
          kleur.green("✔"),
          "Style stub →",
          kleur.cyan(path.relative(process.cwd(), sp) || sp)
        )
      }
      if (result.tokensAdded.length) {
        console.log(
          kleur.green("✔"),
          "tokens.json +",
          kleur.cyan(result.tokensAdded.join(", "))
        )
      }

      console.log(
        kleur.dim(
          `Target: ${result.mode} @ ${path.relative(process.cwd(), result.root) || result.root}`
        )
      )
      if (result.mode === "registry") {
        console.log(kleur.dim("Next: pnpm registry:build && tyohncn add " + name))
      } else {
        console.log(
          kleur.dim(
            `Wrap app root with the active style scope class. Run: tyohncn component check ${name}`
          )
        )
      }
      console.log(
        kleur.dim(
          "Invariant: CVA variant/size maps stay cn-* only — density lives in CSS."
        )
      )
    } catch (err) {
      console.error(kleur.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

componentCommand
  .command("check")
  .description(
    "Lint a component for cn-* separation (fail on density-in-TSX variant maps)"
  )
  .argument("<name-or-path>", "Component name or path to .tsx")
  .option(
    "--styles <list>",
    "Style files to check for .cn-* coverage",
    "mira-vars,ssota"
  )
  .action(async (nameOrPath: string, opts) => {
    try {
      let stylesDir: string | undefined
      const registryUi = resolveMonorepoRegistryUiDir()
      if (registryUi) {
        stylesDir = path.join(path.dirname(registryUi), "styles")
      } else {
        const root = findProjectRoot()
        const config = await readConfig(root)
        if (config) stylesDir = path.join(root, config.css.stylesDir)
      }

      const result = await checkComponent(nameOrPath, {
        stylesDir,
        styles: parseCsvList(opts.styles, ["mira-vars", "ssota"]),
      })

      const errors = result.issues.filter((i) => i.level === "error")
      const warns = result.issues.filter((i) => i.level === "warn")

      console.log(
        kleur.cyan(result.name),
        kleur.dim(path.relative(process.cwd(), result.tsxPath) || result.tsxPath)
      )
      for (const w of warns) {
        console.log(kleur.yellow("⚠"), w.message)
      }
      for (const e of errors) {
        console.log(kleur.red("✖"), e.message)
      }

      if (errors.length === 0) {
        console.log(kleur.green("✔"), "cn-* separation OK")
        if (warns.length) {
          console.log(kleur.dim(`${warns.length} warning(s)`))
        }
      } else {
        process.exit(1)
      }
    } catch (err) {
      console.error(kleur.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

/** Resolve default --into when running inside the monorepo. */
export async function defaultComponentInto(cwd = process.cwd()): Promise<string | undefined> {
  const registryUi = resolveMonorepoRegistryUiDir()
  if (registryUi) return path.dirname(registryUi)
  const root = findProjectRoot(cwd)
  if (await fs.pathExists(path.join(root, "tyohncn.json"))) return root
  return undefined
}
