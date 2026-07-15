#!/usr/bin/env node
/**
 * Build component + style manifests for the CLI and Studio.
 * Also emits Phase-2 token schema (SSOT) from styles/*.css + tokens.json seed.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const uiDir = path.join(root, "ui")
const stylesDir = path.join(root, "styles")
const manifestDir = path.join(root, "manifest")

fs.mkdirSync(manifestDir, { recursive: true })

const depsByComponent = {
  button: { npm: ["@base-ui/react", "class-variance-authority"], registry: [] },
  input: { npm: ["@base-ui/react"], registry: [] },
  card: { npm: [], registry: [] },
  label: { npm: ["@base-ui/react"], registry: [] },
  badge: { npm: ["class-variance-authority"], registry: [] },
  checkbox: { npm: ["@base-ui/react", "lucide-react"], registry: [] },
  dialog: {
    npm: ["@base-ui/react", "lucide-react"],
    registry: ["button"],
  },
  separator: { npm: ["@base-ui/react"], registry: [] },
  skeleton: { npm: [], registry: [] },
  switch: { npm: ["@base-ui/react"], registry: [] },
  textarea: { npm: [], registry: [] },
  spinner: { npm: ["lucide-react"], registry: [] },
}

function parseFileDeps(filePath) {
  const source = fs.readFileSync(filePath, "utf8")
  const registry = [
    ...source.matchAll(/from ["']@\/components\/ui\/([^"']+)["']/g),
  ].map((m) => m[1])
  const npm = []
  if (source.includes("@base-ui/react")) npm.push("@base-ui/react")
  if (source.includes("class-variance-authority"))
    npm.push("class-variance-authority")
  if (source.includes("lucide-react")) npm.push("lucide-react")
  if (source.includes("@shadcn/react")) npm.push("@shadcn/react")
  if (source.includes("sonner")) npm.push("sonner")
  if (source.includes("embla-carousel-react")) npm.push("embla-carousel-react")
  if (source.includes("input-otp")) npm.push("input-otp")
  if (source.includes("react-day-picker")) npm.push("react-day-picker")
  if (source.includes("cmdk")) npm.push("cmdk")
  if (source.includes("@radix-ui/react-use-controllable-state") || source.includes("vaul"))
    npm.push("vaul")
  return {
    npm: [...new Set(npm)],
    registry: [...new Set(registry)],
  }
}

const components = fs
  .readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx") && !f.startsWith("_"))
  .map((file) => {
    const name = file.replace(/\.tsx$/, "")
    const filePath = path.join(uiDir, file)
    const parsed = parseFileDeps(filePath)
    const override = depsByComponent[name]
    return {
      name,
      type: "registry:ui",
      file: `ui/${file}`,
      npmDependencies: override?.npm ?? parsed.npm,
      registryDependencies: override?.registry ?? parsed.registry,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const styleFiles = fs
  .readdirSync(stylesDir)
  .filter((f) => f.startsWith("style-") && f.endsWith(".css"))
  .map((file) => {
    const name = file.replace(/^style-/, "").replace(/\.css$/, "")
    return {
      name,
      file: `styles/${file}`,
      scopeClass: `style-${name}`,
      mode: name.endsWith("-vars") ? "css-vars" : "apply",
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const tokensPath = path.join(manifestDir, "tokens.json")
let tokens = {
  version: 1,
  theme: {
    description: "Semantic color / radius / font — lives in theme.css (:root + @theme inline)",
    tokens: [
      "--background",
      "--foreground",
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--muted",
      "--accent",
      "--destructive",
      "--border",
      "--input",
      "--ring",
      "--radius",
    ],
  },
  style: {
    description:
      "Visual treatment (density, size, chrome). Near-term: @apply. Mid-term: --cn-* CSS variables.",
    tokens: [
      "--cn-button-height",
      "--cn-button-padding-x",
      "--cn-button-radius",
      "--cn-button-font-size",
      "--cn-button-ring-width",
      "--cn-input-height",
      "--cn-input-padding-x",
      "--cn-input-radius",
      "--cn-input-font-size",
      "--cn-card-radius",
      "--cn-card-spacing",
      "--cn-card-font-size",
    ],
  },
}

if (fs.existsSync(tokensPath)) {
  tokens = { ...tokens, ...JSON.parse(fs.readFileSync(tokensPath, "utf8")) }
}

fs.writeFileSync(
  path.join(manifestDir, "components.json"),
  JSON.stringify({ version: 1, base: "base-ui", items: components }, null, 2) +
    "\n"
)
fs.writeFileSync(
  path.join(manifestDir, "styles.json"),
  JSON.stringify({ version: 1, items: styleFiles }, null, 2) + "\n"
)
fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2) + "\n")

console.log(
  `Wrote manifests: ${components.length} components, ${styleFiles.length} styles`
)
