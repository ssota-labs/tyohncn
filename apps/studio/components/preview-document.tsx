"use client"

/**
 * Runs INSIDE the preview iframe (shadcn create pattern).
 * Puts style-* on <body> so Portals (Select/Popover/Dialog) stay in-scope.
 */
import * as React from "react"

import { Catalog } from "@/components/catalog"
import { CardsDemo } from "@/components/previews/cards-demo"
import { IconLibraryProvider } from "@/components/icon-placeholder"
import {
  STUDIO_PREVIEW_READY,
  isStudioPreviewMessage,
  type PreviewTab,
  type StudioPreviewPayload,
} from "@/lib/preview-protocol"
import type { VariableMap } from "@/lib/studio-presets"

const DEFAULT_PAYLOAD: StudioPreviewPayload = {
  scopeClass: "style-mira-vars",
  tab: "cards",
  dark: false,
  previewStyle: {},
  iconLibrary: "lucide",
}

export function PreviewDocument() {
  const [payload, setPayload] =
    React.useState<StudioPreviewPayload>(DEFAULT_PAYLOAD)

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (!isStudioPreviewMessage(event.data)) return
      setPayload(event.data.payload)
    }

    window.addEventListener("message", onMessage)
    window.parent.postMessage({ type: STUDIO_PREVIEW_READY }, window.location.origin)

    return () => window.removeEventListener("message", onMessage)
  }, [])

  React.useLayoutEffect(() => {
    const body = document.body
    const root = document.documentElement

    body.dataset.studioPreview = ""
    // Preview document must scroll (Cards horizontal track); host shell stays locked.
    body.style.overflow = "auto"
    body.style.height = "100%"

    for (const className of Array.from(body.classList)) {
      if (className.startsWith("style-")) body.classList.remove(className)
    }
    body.classList.add(payload.scopeClass)
    root.classList.toggle("dark", payload.dark)
    root.style.colorScheme = payload.dark ? "dark" : "light"

    // Clear previous injected vars, then apply overrides.
    for (const key of Array.from(body.style)) {
      if (key.startsWith("--")) body.style.removeProperty(key)
    }
    for (const [key, value] of Object.entries(payload.previewStyle)) {
      if (value) body.style.setProperty(key, value)
    }

    return () => {
      body.classList.remove(payload.scopeClass)
      delete body.dataset.studioPreview
    }
  }, [payload.scopeClass, payload.dark, payload.previewStyle])

  return (
    <IconLibraryProvider library={payload.iconLibrary}>
      <div className="min-h-svh bg-background text-foreground">
        <PreviewTabContent tab={payload.tab} style={payload.previewStyle} />
      </div>
    </IconLibraryProvider>
  )
}

function PreviewTabContent({
  tab,
  style,
}: {
  tab: PreviewTab
  style: VariableMap
}) {
  if (tab === "colors") {
    return (
      <div className="p-6">
        <ColorSwatches style={style} />
      </div>
    )
  }

  if (tab === "components") {
    return (
      <div className="w-[1100px] p-6">
        <Catalog />
      </div>
    )
  }

  return <CardsDemo />
}

const SWATCHES: Array<[string, string]> = [
  ["--background", "Background"],
  ["--foreground", "Foreground"],
  ["--card", "Card"],
  ["--primary", "Primary"],
  ["--secondary", "Secondary"],
  ["--muted", "Muted"],
  ["--accent", "Accent"],
  ["--destructive", "Destructive"],
  ["--border", "Border"],
  ["--input", "Input"],
  ["--ring", "Ring"],
]

function ColorSwatches({ style }: { style: VariableMap }) {
  return (
    <div className="grid max-w-3xl gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Color palette</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Semantic tokens on the iframe body (portals stay in scope).
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {SWATCHES.map(([token, label]) => (
          <div
            key={token}
            className="overflow-hidden rounded-xl border bg-card text-card-foreground"
          >
            <div
              className="h-20 border-b"
              style={{ background: style[token] ?? `var(${token})` }}
            />
            <div className="grid gap-0.5 p-3 text-sm">
              <span className="font-medium">{label}</span>
              <code className="truncate text-xs text-muted-foreground">
                {token}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
