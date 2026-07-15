#!/usr/bin/env node
/**
 * Sync registry CSS → packages/official-packs (one-way, registry is SSOT for CSS).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const COPIES = [
  {
    from: "packages/registry/styles/style-ssota.css",
    to: "packages/official-packs/design/ssota/style.css",
  },
  {
    from: "packages/registry/theme/theme.css",
    to: "packages/official-packs/design/ssota/theme.css",
  },
  {
    from: "packages/registry/styles/style-mira-vars.css",
    to: "packages/official-packs/design/mira-vars/style.css",
  },
]

let changed = 0
for (const { from, to } of COPIES) {
  const src = path.join(root, from)
  const dest = path.join(root, to)
  if (!fs.existsSync(src)) {
    console.error(`missing source: ${from}`)
    process.exit(1)
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const next = fs.readFileSync(src)
  const prev = fs.existsSync(dest) ? fs.readFileSync(dest) : null
  if (!prev || !prev.equals(next)) {
    fs.writeFileSync(dest, next)
    console.log(`synced ${from} → ${to}`)
    changed++
  } else {
    console.log(`ok      ${to}`)
  }
}
console.log(changed ? `Updated ${changed} file(s).` : "All packs already in sync.")
