import { Command } from "commander"
import path from "node:path"
import fs from "fs-extra"
import kleur from "kleur"
import {
  assertExternalMode,
  findProjectRoot,
  readConfig,
  writeConfig,
  type TyohnConfig,
} from "../lib/project.js"
import {
  patchGlobalsForPackTheme,
  patchGlobalsForStyle,
} from "../lib/install.js"
import {
  installDesignPack,
  isBuiltinStyleName,
  isPackSource,
  listOfficialPacks,
  packsRoot,
  removeAgentsPointer,
  removePackRecord,
  resolvePack,
  scaffoldPack,
  validateManifest,
  readProvenance,
} from "../lib/pack.js"

export const packCommand = new Command("pack").description(
  "Manage design packs (style + theme manifests, Faraday-style)"
)

packCommand
  .command("list")
  .description("List official design packs")
  .option("--json", "JSON output")
  .action(async (opts) => {
    const packs = listOfficialPacks()
    if (opts.json) {
      console.log(JSON.stringify(packs.map(({ dir: _d, ...rest }) => rest), null, 2))
      return
    }
    if (packs.length === 0) {
      console.log(kleur.dim(`No official packs under ${packsRoot()}`))
      return
    }
    for (const p of packs) {
      console.log(
        `${kleur.cyan(p.name.padEnd(16))} ${p.displayName}${p.description ? kleur.dim(` — ${p.description}`) : ""}`
      )
    }
  })

packCommand
  .command("add")
  .description("Install a design pack into the current project")
  .argument("<source>", "Official name, local path, owner/repo, or npm:@scope/pack")
  .option("--cwd <path>", "Project working directory")
  .option("--json", "JSON output")
  .action(async (source: string, opts) => {
    const root = findProjectRoot(
      opts.cwd ? path.resolve(opts.cwd) : process.cwd()
    )
    const config = await readConfig(root)
    if (!config) {
      console.error(kleur.red("Missing tyohncn.json. Run: tyohncn init"))
      process.exit(1)
    }
    assertExternalMode(config)

    try {
      const result = await addPackToProject(root, config, source)
      if (opts.json) {
        console.log(JSON.stringify(result, null, 2))
        return
      }
      console.log(
        kleur.green("✔"),
        "Pack",
        kleur.cyan(result.name),
        "→",
        kleur.cyan(path.relative(root, result.styleDest))
      )
      if (result.themeDest) {
        console.log(
          kleur.green("✔"),
          "Theme →",
          kleur.cyan(path.relative(root, result.themeDest))
        )
      }
      console.log(kleur.green("✔"), "Active style:", kleur.cyan(result.name))
      console.log(
        kleur.dim(
          `Use root class "${result.scopeClass}" (file defines that scope).`
        )
      )
    } catch (err) {
      console.error(kleur.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

packCommand
  .command("remove")
  .description("Unregister a design pack (keeps copied CSS; reports paths)")
  .argument("<name>", "Installed pack name")
  .option("--cwd <path>", "Project working directory")
  .option("--json", "JSON output")
  .action(async (name: string, opts) => {
    const root = findProjectRoot(
      opts.cwd ? path.resolve(opts.cwd) : process.cwd()
    )
    const config = await readConfig(root)
    if (!config) {
      console.error(kleur.red("Missing tyohncn.json. Run: tyohncn init"))
      process.exit(1)
    }

    const skillDir = path.join(root, ".tyohn", "packs", name)
    const stylePath = path.join(root, config.css.stylesDir, `style-${name}.css`)
    const themePath = path.join(root, config.css.stylesDir, `theme-${name}.css`)

    await removeAgentsPointer(root, name)
    await removePackRecord(root, name)
    if (await fs.pathExists(skillDir)) {
      await fs.remove(skillDir)
    }

    const kept = [stylePath, themePath].filter((p) => fs.existsSync(p))

    if (opts.json) {
      console.log(JSON.stringify({ removed: name, keptCss: kept }, null, 2))
      return
    }
    console.log(kleur.green("✔"), "Unregistered pack", kleur.cyan(name))
    if (kept.length) {
      console.log(
        kleur.dim(
          "Left CSS on disk (edit-safe): " +
            kept.map((p) => path.relative(root, p)).join(", ")
        )
      )
    }
  })

packCommand
  .command("show")
  .description("Show pack skill guide / files")
  .argument("<source>", "Pack name or source")
  .argument("[file]", "Subfile under skill/")
  .option("--all", "Concatenate all skill markdown files")
  .action(async (source: string, file: string | undefined, opts) => {
    try {
      const resolved = await resolvePack(source)
      const skillRef = resolved.manifest.skill?.reference
      if (!skillRef) {
        console.log(kleur.dim("No skill half in this pack."))
        console.log(JSON.stringify(resolved.manifest, null, 2))
        return
      }
      const skillRoot = path.join(resolved.dir, skillRef)
      const st = await fs.stat(skillRoot)

      if (opts.all) {
        const files = st.isDirectory()
          ? (await walkMd(skillRoot))
          : [skillRoot]
        for (const f of files) {
          console.log(kleur.cyan(`--- ${path.relative(resolved.dir, f)} ---`))
          console.log(await fs.readFile(f, "utf8"))
        }
        return
      }

      if (file) {
        const target = st.isDirectory()
          ? path.join(skillRoot, file)
          : path.join(path.dirname(skillRoot), file)
        if (!(await fs.pathExists(target))) {
          console.error(kleur.red(`Missing ${file}`))
          process.exit(1)
        }
        console.log(await fs.readFile(target, "utf8"))
        return
      }

      const entry =
        resolved.manifest.skill?.entry ??
        (st.isDirectory()
          ? ["pack.md", "SKILL.md", "overview.md"].find((c) =>
              fs.existsSync(path.join(skillRoot, c))
            )
          : path.basename(skillRoot))

      if (!entry) {
        console.log(kleur.dim("Skill directory (no entry):"), skillRoot)
        return
      }
      const entryPath = st.isDirectory()
        ? path.join(skillRoot, entry)
        : skillRoot
      console.log(await fs.readFile(entryPath, "utf8"))
      if (st.isDirectory()) {
        const kids = (await fs.readdir(skillRoot)).filter((f) => f !== entry)
        if (kids.length) {
          console.log(kleur.dim(`\nOther files: ${kids.join(", ")}`))
        }
      }
    } catch (err) {
      console.error(kleur.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

packCommand
  .command("validate")
  .description("Validate a pack.json contract")
  .argument("<source>", "Pack name or source")
  .option("--json", "JSON output")
  .action(async (source: string, opts) => {
    try {
      const resolved = await resolvePack(source)
      const raw = await fs.readJson(path.join(resolved.dir, "pack.json"))
      const result = validateManifest(raw, resolved.dir)
      if (opts.json) {
        console.log(JSON.stringify(result, null, 2))
        return
      }
      if (!result.ok) {
        console.error(kleur.red("Invalid:"))
        for (const e of result.errors) console.error(" -", e)
        process.exit(1)
      }
      console.log(
        kleur.green("✔"),
        "Valid design pack",
        kleur.cyan(resolved.name),
        `(${resolved.manifest.displayName})`
      )
    } catch (err) {
      console.error(kleur.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

packCommand
  .command("new")
  .description("Scaffold a new design pack (authoring)")
  .argument("<name>", "Pack name (kebab-case)")
  .option("--at <dir>", "Parent directory", ".")
  .option("--mode <mode>", "apply | css-vars", "css-vars")
  .action(async (name: string, opts) => {
    const mode = opts.mode === "apply" ? "apply" : "css-vars"
    try {
      const root = await scaffoldPack(name, path.resolve(opts.at), mode)
      console.log(kleur.green("✔"), "Scaffolded", kleur.cyan(root))
      console.log(kleur.dim("Next: edit style.css / theme.css, then:"))
      console.log(kleur.dim(`  tyohncn pack validate ${root}`))
      console.log(kleur.dim(`  tyohncn pack add ${root}`))
    } catch (err) {
      console.error(kleur.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

async function walkMd(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...(await walkMd(p)))
    else if (ent.name.endsWith(".md")) out.push(p)
  }
  return out.sort()
}

export async function addPackToProject(
  root: string,
  config: TyohnConfig,
  source: string
) {
  const resolved = await resolvePack(source)
  for (const req of resolved.manifest.requires ?? []) {
    await addPackToProject(root, config, req)
  }

  const installed = await installDesignPack(root, config, resolved, {
    patchGlobalsStyle: patchGlobalsForStyle,
    patchGlobalsTheme: patchGlobalsForPackTheme,
  })

  config.style = installed.name
  const packs = new Set(config.packs ?? [])
  packs.add(installed.name)
  config.packs = [...packs].sort()
  await writeConfig(root, config)

  return installed
}

export { isBuiltinStyleName, isPackSource, readProvenance }
