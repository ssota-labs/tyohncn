import fs from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ProjectInfo = {
  mode: "project" | "demo"
  root: string | null
  config: {
    style?: string
    iconLibrary?: string
    mode?: string
    packs?: string[]
    aliases?: Record<string, string>
    css?: { globals?: string; stylesDir?: string }
  } | null
  components: string[]
  styles: string[]
  packs: string[]
  suggestedCli: string[]
  note: string
}

async function listTsxNames(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir)
    return entries
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => f.replace(/\.tsx$/, ""))
      .sort()
  } catch {
    return []
  }
}

async function listStyleNames(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir)
    return entries
      .filter((f) => f.startsWith("style-") && f.endsWith(".css"))
      .map((f) => f.replace(/^style-/, "").replace(/\.css$/, ""))
      .sort()
  } catch {
    return []
  }
}

async function readInstalledPacks(root: string): Promise<string[]> {
  try {
    const raw = await fs.readFile(
      path.join(root, ".tyohn", "provenance.json"),
      "utf8"
    )
    const data = JSON.parse(raw) as { packs?: Array<{ name?: string }> }
    return (data.packs ?? [])
      .map((p) => p.name)
      .filter((n): n is string => typeof n === "string")
      .sort()
  } catch {
    return []
  }
}

export async function GET() {
  const root = process.env.TYOHN_PROJECT_ROOT
    ? path.resolve(process.env.TYOHN_PROJECT_ROOT)
    : null

  if (!root) {
    const body: ProjectInfo = {
      mode: "demo",
      root: null,
      config: null,
      components: [],
      styles: [],
      packs: [],
      suggestedCli: [
        "tyohncn init --style mira --icon lucide",
        "tyohncn add button input card",
        "tyohncn component new callout --mode css-vars",
        "tyohncn studio",
      ],
      note: "Demo mode — set TYOHN_PROJECT_ROOT or run `tyohncn studio` from a project.",
    }
    return NextResponse.json(body)
  }

  let config: ProjectInfo["config"] = null
  try {
    const raw = await fs.readFile(path.join(root, "tyohncn.json"), "utf8")
    config = JSON.parse(raw)
  } catch {
    config = null
  }

  const uiRel = (config?.aliases?.ui ?? "@/components/ui").replace(/^@\//, "")
  const stylesRel = config?.css?.stylesDir ?? "styles"
  const components = await listTsxNames(path.join(root, uiRel))
  const styles = await listStyleNames(path.join(root, stylesRel))
  const packs = await readInstalledPacks(root)

  const style = config?.style ?? "mira"

  const body: ProjectInfo = {
    mode: "project",
    root,
    config,
    components,
    styles,
    packs,
    suggestedCli: [
      packs.includes("ssota")
        ? "tyohncn pack add mira-vars"
        : "tyohncn pack add ssota",
      `tyohncn apply --style ${style === "mira" ? "vega" : "mira"}`,
      "tyohncn component new callout --mode css-vars --styles mira-vars",
      "tyohncn pack new my-brand --mode css-vars",
    ],
    note: "Preview only — confirm style/icon/pack changes with tyohncn apply or pack add (no write-back from Studio yet).",
  }
  return NextResponse.json(body)
}
