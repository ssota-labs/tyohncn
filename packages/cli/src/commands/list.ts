import { Command } from "commander"
import kleur from "kleur"
import { loadComponentsManifest, loadStylesManifest } from "../lib/project.js"

export const listCommand = new Command("list")
  .description("List available components or styles")
  .argument("<kind>", "components | styles")
  .action(async (kind: string) => {
    if (kind === "components" || kind === "component") {
      const manifest = await loadComponentsManifest()
      for (const item of manifest.items) {
        console.log(
          `${kleur.cyan(item.name.padEnd(22))} ${kleur.dim(item.file)}`
        )
      }
      return
    }
    if (kind === "styles" || kind === "style") {
      const manifest = await loadStylesManifest()
      for (const item of manifest.items) {
        console.log(
          `${kleur.cyan(item.name.padEnd(14))} ${kleur.dim(item.mode.padEnd(10))} ${item.file}`
        )
      }
      return
    }
    console.error('Expected "components" or "styles"')
    process.exit(1)
  })
