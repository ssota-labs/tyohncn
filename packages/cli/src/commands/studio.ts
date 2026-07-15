import { Command } from "commander"
import path from "node:path"
import { spawn } from "node:child_process"
import fs from "fs-extra"
import kleur from "kleur"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import { findProjectRoot, readConfig } from "../lib/project.js"

const require = createRequire(import.meta.url)

export const studioCommand = new Command("studio")
  .description(
    "Open tyohncn Studio for the current project (catalog + token inspectors)"
  )
  .option("-p, --port <port>", "Port", "3001")
  .option("--cwd <path>", "Project working directory")
  .action(async (opts) => {
    const root = findProjectRoot(
      opts.cwd ? path.resolve(opts.cwd) : process.cwd()
    )
    const config = await readConfig(root)
    if (!config) {
      console.error(
        kleur.red("Missing tyohncn.json. Run: tyohncn init --style mira")
      )
      process.exit(1)
    }

    const studioEntry = resolveStudioBin()
    if (!studioEntry) {
      console.error(
        kleur.red(
          "Cannot resolve @tyohn/studio. Install it: pnpm add -D @tyohn/studio"
        )
      )
      console.error(
        kleur.dim(
          "Monorepo fallback: pnpm --filter @tyohn/studio dev (set TYOHN_PROJECT_ROOT)"
        )
      )
      process.exit(1)
    }

    console.log(kleur.green("✔"), "Opening Studio for", kleur.cyan(root))
    console.log(
      kleur.dim(`http://localhost:${opts.port}  (style=${config.style}, icon=${config.iconLibrary})`)
    )
    console.log(
      kleur.dim(
        "Preview only — confirm presets with: tyohncn apply --style <preset>"
      )
    )

    const child = spawn(
      process.execPath,
      [studioEntry, "--port", String(opts.port), "--cwd", root],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          TYOHN_PROJECT_ROOT: root,
          PORT: String(opts.port),
        },
        cwd: path.dirname(studioEntry),
      }
    )

    child.on("exit", (code) => process.exit(code ?? 0))
  })

function resolveStudioBin(): string | null {
  // 1) Published / installed package
  try {
    const pkgJson = require.resolve("@tyohn/studio/package.json")
    const bin = path.join(path.dirname(pkgJson), "bin/tyohn-studio.mjs")
    if (fs.existsSync(bin)) return bin
  } catch {
    // continue
  }

  // 2) Monorepo relative to CLI package
  const here = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    // packages/cli/dist → repo root
    path.resolve(here, "../../../apps/studio/bin/tyohn-studio.mjs"),
    // packages/cli/src → repo root
    path.resolve(here, "../../../../apps/studio/bin/tyohn-studio.mjs"),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }

  return null
}
