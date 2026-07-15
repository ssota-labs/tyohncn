#!/usr/bin/env node
/**
 * Launch @tyohn/studio against TYOHN_PROJECT_ROOT (or cwd).
 * Used as the package bin and by `tyohncn studio`.
 */
import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const studioRoot = path.resolve(__dirname, "..")
const require = createRequire(import.meta.url)

function parseArgs(argv) {
  const out = { port: process.env.PORT || "3001", cwd: process.cwd(), help: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--help" || a === "-h") out.help = true
    else if (a === "--port" || a === "-p") out.port = argv[++i]
    else if (a === "--cwd") out.cwd = path.resolve(argv[++i])
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
if (args.help) {
  console.log(`Usage: tyohn-studio [--port 3001] [--cwd <project>]

Starts the tyohncn Studio web UI.
Set TYOHN_PROJECT_ROOT to bind Studio to a consumer project (tyohncn.json).
`)
  process.exit(0)
}

const projectRoot = process.env.TYOHN_PROJECT_ROOT
  ? path.resolve(process.env.TYOHN_PROJECT_ROOT)
  : args.cwd

process.env.TYOHN_PROJECT_ROOT = projectRoot
process.env.PORT = String(args.port)

const nextDir = path.join(studioRoot, ".next")
const standaloneServer = [
  path.join(studioRoot, ".next/standalone/apps/studio/server.js"),
  path.join(studioRoot, ".next/standalone/server.js"),
].find((p) => fs.existsSync(p))

console.log(`tyohn studio → http://localhost:${args.port}`)
console.log(`project root: ${projectRoot}`)

if (standaloneServer) {
  // Prefer production standalone build when present
  const staticSrc = path.join(studioRoot, ".next/static")
  const staticDestCandidates = [
    path.join(path.dirname(standaloneServer), ".next/static"),
    path.join(studioRoot, ".next/standalone/apps/studio/.next/static"),
    path.join(studioRoot, ".next/standalone/.next/static"),
  ]
  for (const dest of staticDestCandidates) {
    if (fs.existsSync(staticSrc) && !fs.existsSync(dest)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      try {
        fs.cpSync(staticSrc, dest, { recursive: true })
      } catch {
        // best-effort
      }
    }
  }
  const publicSrc = path.join(studioRoot, "public")
  const publicDest = path.join(path.dirname(standaloneServer), "public")
  if (fs.existsSync(publicSrc) && !fs.existsSync(publicDest)) {
    try {
      fs.cpSync(publicSrc, publicDest, { recursive: true })
    } catch {
      // best-effort
    }
  }

  process.chdir(path.dirname(standaloneServer))
  await import(pathToFileURL(standaloneServer).href)
} else if (fs.existsSync(nextDir)) {
  // Built but not standalone — use next start
  const nextBin = require.resolve("next/dist/bin/next")
  const child = spawn(
    process.execPath,
    [nextBin, "start", "--port", String(args.port)],
    {
      cwd: studioRoot,
      stdio: "inherit",
      env: process.env,
    }
  )
  child.on("exit", (code) => process.exit(code ?? 0))
} else {
  // Dev fallback
  const nextBin = require.resolve("next/dist/bin/next")
  const child = spawn(
    process.execPath,
    [nextBin, "dev", "--port", String(args.port)],
    {
      cwd: studioRoot,
      stdio: "inherit",
      env: process.env,
    }
  )
  child.on("exit", (code) => process.exit(code ?? 0))
}
