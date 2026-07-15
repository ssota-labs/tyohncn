import { describe, expect, it } from "vitest"
import fs from "fs-extra"
import os from "node:os"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import {
  listOfficialPacks,
  resolvePack,
  scaffoldPack,
  validateManifest,
  readProvenance,
} from "../lib/pack.js"

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

describe("design packs", () => {
  it("lists and validates official packs", async () => {
    const packs = listOfficialPacks()
    expect(packs.map((p) => p.name).sort()).toEqual(["mira-vars", "ssota"])

    for (const p of packs) {
      const resolved = await resolvePack(p.name)
      const raw = await fs.readJson(path.join(resolved.dir, "pack.json"))
      const result = validateManifest(raw, resolved.dir)
      expect(result.ok).toBe(true)
    }
  })

  it("pack new → validate → add installs CSS only and records provenance", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tyohn-pack-"))
    await fs.writeJson(path.join(tmp, "package.json"), {
      name: "smoke-pack",
      private: true,
    })

    run(["init", "--style", "mira", "--icon", "lucide", "--css", "app/globals.css"], tmp)
    run(["add", "button"], tmp)

    const packParent = path.join(tmp, "my-packs")
    await fs.ensureDir(packParent)
    const packDir = await scaffoldPack("acme", packParent, "css-vars")

    const validated = validateManifest(
      await fs.readJson(path.join(packDir, "pack.json")),
      packDir
    )
    expect(validated.ok).toBe(true)

    const before = (await fs.stat(path.join(tmp, "components/ui/button.tsx")))
      .mtimeMs
    await new Promise((r) => setTimeout(r, 20))

    const out = run(["pack", "add", packDir], tmp)
    expect(out).toMatch(/Pack acme/)
    expect(await fs.pathExists(path.join(tmp, "styles/style-acme.css"))).toBe(
      true
    )
    expect(await fs.pathExists(path.join(tmp, "styles/theme-acme.css"))).toBe(
      true
    )
    expect(await fs.pathExists(path.join(tmp, ".tyohn/packs/acme"))).toBe(true)

    const after = (await fs.stat(path.join(tmp, "components/ui/button.tsx")))
      .mtimeMs
    expect(after).toBe(before)

    const cfg = await fs.readJson(path.join(tmp, "tyohncn.json"))
    expect(cfg.style).toBe("acme")
    expect(cfg.packs).toContain("acme")

    const provenance = await readProvenance(tmp)
    expect(provenance.packs.some((p) => p.name === "acme")).toBe(true)

    const globals = await fs.readFile(path.join(tmp, "app/globals.css"), "utf8")
    expect(globals).toContain("style-acme.css")
    expect(globals).toContain("theme-acme.css")
  })

  it("pack add ssota via apply --style uses pack path", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tyohn-ssota-"))
    await fs.writeJson(path.join(tmp, "package.json"), {
      name: "smoke-ssota",
      private: true,
    })
    run(["init", "--style", "mira", "--icon", "lucide", "--css", "app/globals.css"], tmp)
    run(["add", "button"], tmp)

    const before = (await fs.stat(path.join(tmp, "components/ui/button.tsx")))
      .mtimeMs
    await new Promise((r) => setTimeout(r, 20))

    const out = run(["apply", "--style", "ssota"], tmp)
    expect(out).toMatch(/Component TSX unchanged/)
    expect(await fs.pathExists(path.join(tmp, "styles/style-ssota.css"))).toBe(
      true
    )
    expect(await fs.pathExists(path.join(tmp, "styles/theme-ssota.css"))).toBe(
      true
    )

    const after = (await fs.stat(path.join(tmp, "components/ui/button.tsx")))
      .mtimeMs
    expect(after).toBe(before)

    const cfg = await fs.readJson(path.join(tmp, "tyohncn.json"))
    expect(cfg.style).toBe("ssota")
    expect(cfg.packs).toContain("ssota")
  })
})
