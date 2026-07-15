#!/usr/bin/env node
/**
 * Sync tyohncn skill between plugins/ and .agents/skills/ (ssota ENV-02).
 * Canonical source: plugins/cursor/skills/tyohncn
 *
 *   node scripts/sync-skills.mjs
 *   node scripts/sync-skills.mjs --check
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const checkOnly = process.argv.includes("--check")

const SOURCE = path.join(root, "plugins/cursor/skills/tyohncn")
const TARGETS = [
  path.join(root, "plugins/claude-code/skills/tyohncn"),
  path.join(root, ".agents/skills/tyohncn"),
  path.join(root, ".cursor/skills/tyohncn"),
  path.join(root, ".claude/skills/tyohncn"),
  path.join(root, "skills/tyohncn"),
]

function copyDir(src, dest) {
  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.cpSync(src, dest, { recursive: true })
}

function dirFingerprint(dir) {
  if (!fs.existsSync(dir)) return null
  const files = []
  function walk(d, rel = "") {
    for (const name of fs.readdirSync(d).sort()) {
      const p = path.join(d, name)
      const r = rel ? `${rel}/${name}` : name
      const st = fs.statSync(p)
      if (st.isDirectory()) walk(p, r)
      else files.push(`${r}:${fs.readFileSync(p, "utf8")}`)
    }
  }
  walk(dir)
  return files.join("\n")
}

if (!fs.existsSync(path.join(SOURCE, "SKILL.md"))) {
  console.error(`Missing canonical skill at ${SOURCE}`)
  process.exit(1)
}

const sourceFp = dirFingerprint(SOURCE)

if (checkOnly) {
  let ok = true
  for (const target of TARGETS) {
    const fp = dirFingerprint(target)
    if (fp !== sourceFp) {
      console.error(`Drift: ${path.relative(root, target)}`)
      ok = false
    } else {
      console.log(`ok  ${path.relative(root, target)}`)
    }
  }
  process.exit(ok ? 0 : 1)
}

for (const target of TARGETS) {
  copyDir(SOURCE, target)
  console.log(`synced → ${path.relative(root, target)}`)
}
