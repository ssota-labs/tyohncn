import { Command } from "commander"
import kleur from "kleur"
import { loadComponentsManifest, loadStylesManifest } from "../lib/project.js"
import { iconLibraries, ICON_LIBRARY_NAMES } from "../lib/icon-libraries.js"

export const listCommand = new Command("list")
  .description("List available components, styles, or icon libraries")
  .argument("<kind>", "components | styles | icons")
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
    if (kind === "icons" || kind === "icon") {
      for (const name of ICON_LIBRARY_NAMES) {
        const lib = iconLibraries[name]
        console.log(
          `${kleur.cyan(name.padEnd(12))} ${kleur.dim(lib.title.padEnd(16))} ${lib.packages.join(", ")}`
        )
      }
      return
    }
    console.error('Expected "components", "styles", or "icons"')
    process.exit(1)
  })
