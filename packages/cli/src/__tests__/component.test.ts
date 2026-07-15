import { describe, expect, it } from "vitest"
import fs from "fs-extra"
import os from "node:os"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import {
  buildTsxSource,
  checkComponentSource,
  scaffoldComponent,
} from "../lib/component-scaffold.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliEntry = path.resolve(__dirname, "../../dist/index.js")
const workspaceRoot = path.resolve(__dirname, "../../../..")
const registryRoot = path.join(workspaceRoot, "packages/registry")

function run(args: string[], cwd: string) {
  return execFileSync("node", [cliEntry, ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_PATH: path.join(workspaceRoot, "node_modules"),
    },
  })
}

describe("component scaffold + check", () => {
  it("buildTsxSource keeps only cn-* in variant/size maps", () => {
    const src = buildTsxSource({
      name: "callout",
      variants: ["default", "outline"],
      sizes: ["default", "sm"],
      base: "div",
    })
    expect(src).toContain("cn-callout")
    expect(src).toContain("cn-callout-variant-default")
    expect(src).toContain("cn-callout-size-sm")
    expect(src).not.toMatch(/variant:\s*\{[^}]*\bh-\d/)
    const issues = checkComponentSource(src, "callout")
    expect(issues.filter((i) => i.level === "error")).toHaveLength(0)
  })

  it("checkComponentSource fails when density is inlined into variant maps", () => {
    const bad = `
const x = cva("cn-bad", {
  variants: {
    variant: {
      default: "h-9 px-4 rounded-md bg-primary",
    },
    size: {
      default: "cn-bad-size-default",
    },
  },
})
`
    const issues = checkComponentSource(bad, "bad")
    expect(issues.some((i) => i.level === "error")).toBe(true)
  })

  it("component new → check passes in a consumer project", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tyohn-comp-"))
    await fs.writeJson(path.join(tmp, "package.json"), {
      name: "smoke-comp",
      private: true,
    })
    run(
      ["init", "--style", "mira", "--icon", "lucide", "--css", "app/globals.css"],
      tmp
    )

    // Apply mira-vars so style-mira-vars.css exists for stubs (or create via component)
    const out = run(
      [
        "component",
        "new",
        "callout",
        "--into",
        tmp,
        "--styles",
        "mira-vars",
        "--mode",
        "css-vars",
      ],
      tmp
    )
    expect(out).toMatch(/Created/)
    expect(await fs.pathExists(path.join(tmp, "components/ui/callout.tsx"))).toBe(
      true
    )
    expect(
      await fs.pathExists(path.join(tmp, "styles/style-mira-vars.css"))
    ).toBe(true)

    const css = await fs.readFile(
      path.join(tmp, "styles/style-mira-vars.css"),
      "utf8"
    )
    expect(css).toContain("tyohncn:component:callout")
    expect(css).toContain("--cn-callout-height")
    expect(css).toContain(".cn-callout-variant-default")

    const checkOut = run(["component", "check", "callout"], tmp)
    expect(checkOut).toMatch(/cn-\* separation OK/)
  })

  it("scaffold into registry updates tokens.json (temp copy)", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tyohn-reg-"))
    await fs.copy(path.join(registryRoot, "manifest"), path.join(tmp, "manifest"))
    await fs.ensureDir(path.join(tmp, "ui"))
    await fs.ensureDir(path.join(tmp, "styles"))
    // minimal mira-vars host file
    await fs.writeFile(
      path.join(tmp, "styles/style-mira-vars.css"),
      `/** fixture */\n.style-mira {\n}\n`
    )

    const result = await scaffoldComponent({
      name: "stat-pill",
      variants: ["default"],
      sizes: ["default", "sm"],
      mode: "css-vars",
      styles: ["mira-vars"],
      base: "div",
      into: tmp,
    })

    expect(result.mode).toBe("registry")
    expect(await fs.pathExists(result.tsxPath)).toBe(true)
    expect(result.tokensAdded.some((t) => t.includes("stat-pill"))).toBe(true)

    const tokens = await fs.readJson(path.join(tmp, "manifest/tokens.json"))
    expect(tokens.style.tokens).toContain("--cn-stat-pill-height")
  })
})
