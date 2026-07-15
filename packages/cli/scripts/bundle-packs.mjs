#!/usr/bin/env node
/**
 * Bundle packages/official-packs → packages/cli/packs for publish.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const src = path.join(root, "packages/official-packs")
const dest = path.join(root, "packages/cli/packs")

if (!fs.existsSync(src)) {
  console.error("missing packages/official-packs")
  process.exit(1)
}

fs.rmSync(dest, { recursive: true, force: true })
fs.cpSync(src, dest, { recursive: true })
console.log(`Bundled official-packs → ${path.relative(root, dest)}`)
