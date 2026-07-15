#!/usr/bin/env node
/**
 * Publish tyohncn packages (registry → cli → studio).
 * Usage:
 *   node scripts/publish-packages.mjs --dry-run
 *   node scripts/publish-packages.mjs
 *   node scripts/publish-packages.mjs --version 0.1.1
 */
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const dryRun = process.argv.includes("--dry-run")
const versionArg = process.argv.find((a) => a.startsWith("--version="))
const versionFlagIdx = process.argv.indexOf("--version")
const bumpVersion =
  versionArg?.split("=")[1] ??
  (versionFlagIdx >= 0 ? process.argv[versionFlagIdx + 1] : null)

const PACKAGES = [
  { dir: "packages/registry", name: "@tyohn/registry" },
  { dir: "packages/cli", name: "tyohncn" },
  { dir: "apps/studio", name: "@tyohn/studio" },
]

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"))
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n")
}

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`)
  execSync(cmd, { stdio: "inherit", cwd: root, ...opts })
}

function setWorkspaceDepsToVersion(pkg, version) {
  for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
    const block = pkg[field]
    if (!block) continue
    for (const [dep, range] of Object.entries(block)) {
      if (range === "workspace:*" || range.startsWith("workspace:")) {
        block[dep] = `^${version}`
      }
    }
  }
}

// Resolve version
const registryPkgPath = path.join(root, "packages/registry/package.json")
const current = readJson(registryPkgPath).version
const version = bumpVersion ?? current

console.log(`Publishing tyohncn packages @ ${version}${dryRun ? " (dry-run)" : ""}`)

// Sync versions + rewrite workspace protocol for publish
const backups = []
for (const { dir } of PACKAGES) {
  const pkgPath = path.join(root, dir, "package.json")
  const original = fs.readFileSync(pkgPath, "utf8")
  backups.push({ pkgPath, original })
  const pkg = JSON.parse(original)
  pkg.version = version
  if (pkg.private === true && pkg.name === "@tyohn/studio") {
    delete pkg.private
  }
  setWorkspaceDepsToVersion(pkg, version)
  writeJson(pkgPath, pkg)
}

try {
  // Build artifacts
  run("pnpm registry:build")
  run("pnpm cli:build")
  run("pnpm --filter @tyohn/studio build")

  for (const { dir, name } of PACKAGES) {
    const abs = path.join(root, dir)
    if (dryRun) {
      run(`pnpm pack --pack-destination ${path.join(root, ".release")}`, {
        cwd: abs,
      })
      console.log(`packed ${name}`)
    } else {
      run(`pnpm publish --access public --no-git-checks`, { cwd: abs })
    }
  }

  console.log(dryRun ? "Dry-run complete." : "Publish complete.")
} finally {
  // Restore workspace package.json files
  for (const { pkgPath, original } of backups) {
    fs.writeFileSync(pkgPath, original)
  }
  console.log("Restored workspace package.json files.")
}
