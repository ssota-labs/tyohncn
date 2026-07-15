import { describe, expect, it } from "vitest"
import fs from "fs-extra"
import os from "node:os"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliEntry = path.resolve(__dirname, "../../dist/index.js")
const repoRoot = path.resolve(__dirname, "../../..")

function run(args: string[], cwd: string) {
  return execFileSync("node", [cliEntry, ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_PATH: path.join(repoRoot, "node_modules"),
    },
  })
}

describe("tyohncn external mode", () => {
  it("init → add → apply swaps CSS only and keeps cn-* hooks", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tyohncn-"))
    await fs.writeJson(path.join(tmp, "package.json"), {
      name: "smoke",
      private: true,
    })

    run(["init", "--style", "mira", "--icon", "lucide", "--css", "app/globals.css"], tmp)
    expect(await fs.pathExists(path.join(tmp, "tyohncn.json"))).toBe(true)
    const cfg = await fs.readJson(path.join(tmp, "tyohncn.json"))
    expect(cfg.iconLibrary).toBe("lucide")
    expect(await fs.pathExists(path.join(tmp, "styles/style-mira.css"))).toBe(
      true
    )
    expect(await fs.pathExists(path.join(tmp, "app/globals.css"))).toBe(true)

    run(["add", "button", "input", "card", "dialog"], tmp)
    const button = await fs.readFile(
      path.join(tmp, "components/ui/button.tsx"),
      "utf8"
    )
    expect(button).toContain("cn-button-variant-default")
    expect(button).toContain("cn-button-size-default")
    // Must NOT be inlined to bg-primary etc. as sole replacement of cn-*
    expect(button).toMatch(/cn-button/)

    const dialog = await fs.readFile(
      path.join(tmp, "components/ui/dialog.tsx"),
      "utf8"
    )
    expect(dialog).toContain('from "lucide-react"')
    expect(dialog).toContain("XIcon")
    expect(dialog).not.toContain("IconPlaceholder")

    // Switch icon library by re-resolving from registry
    run(["apply", "--icon", "tabler"], tmp)
    const dialogTabler = await fs.readFile(
      path.join(tmp, "components/ui/dialog.tsx"),
      "utf8"
    )
    expect(dialogTabler).toContain("@tabler/icons-react")
    expect(dialogTabler).toContain("IconX")
    expect(dialogTabler).not.toContain("IconPlaceholder")

    const beforeMtime = (
      await fs.stat(path.join(tmp, "components/ui/button.tsx"))
    ).mtimeMs

    // Ensure distinct mtime granularity
    await new Promise((r) => setTimeout(r, 20))
    const out = run(["apply", "--style", "vega"], tmp)
    expect(out).toMatch(/Component TSX unchanged/)
    expect(await fs.pathExists(path.join(tmp, "styles/style-vega.css"))).toBe(
      true
    )

    const afterMtime = (
      await fs.stat(path.join(tmp, "components/ui/button.tsx"))
    ).mtimeMs
    expect(afterMtime).toBe(beforeMtime)

    const globals = await fs.readFile(path.join(tmp, "app/globals.css"), "utf8")
    expect(globals).toContain("style-vega.css")
    expect(globals).not.toMatch(/style-mira\.css/)
  })
})
