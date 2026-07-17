"use client"

/**
 * Runs INSIDE the preview iframe (shadcn create DesignSystemProvider pattern).
 * Applies style-* on <body> and theme CSS vars via a managed <style> tag so
 * Portals (Select/Popover/Dialog) stay in scope.
 */
import * as React from "react"

import { IconLibraryProvider } from "@/components/icon-placeholder"
import { useIframeMessageListener } from "@/lib/use-iframe-sync"
import {
  parseStudioParams,
  type StudioParams,
} from "@/lib/search-params"
import {
  RADII,
  presets,
  themeDarkDefaults,
  themeDefaults,
  type VariableMap,
} from "@/lib/studio-presets"

const THEME_STYLE_ELEMENT_ID = "studio-theme-vars"
const MANAGED_BODY_CLASS_PREFIXES = ["style-"] as const

function removeManagedBodyClasses(body: Element) {
  for (const className of Array.from(body.classList)) {
    if (
      MANAGED_BODY_CLASS_PREFIXES.some((prefix) => className.startsWith(prefix))
    ) {
      body.classList.remove(className)
    }
  }
}

function buildCssRule(selector: string, cssVars: VariableMap) {
  const declarations = Object.entries(cssVars)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => {
      const prop = key.startsWith("--") ? key : `--${key}`
      return `  ${prop}: ${value};`
    })
    .join("\n")

  if (!declarations) return `${selector} {}\n`
  return `${selector} {\n${declarations}\n}\n`
}

function buildPreviewCssVars(params: StudioParams): {
  light: VariableMap
  dark: VariableMap
} {
  const preset = presets[params.style]
  const radiusValue =
    RADII.find((item) => item.name === params.radius)?.value ??
    themeDefaults["--radius"]

  const light: VariableMap = {
    ...themeDefaults,
    ...params.themeOverrides,
    "--radius": params.themeOverrides["--radius"] ?? radiusValue,
    ...(preset.editableStyle ? params.styleOverrides : {}),
  }

  const dark: VariableMap = {
    ...themeDefaults,
    ...themeDarkDefaults,
    ...params.themeOverrides,
    "--radius": params.themeOverrides["--radius"] ?? radiusValue,
    ...(preset.editableStyle ? params.styleOverrides : {}),
  }

  return { light, dark }
}

export function DesignSystemProvider({
  children,
  initialParams,
}: {
  children: React.ReactNode
  /** Seeded from /preview/[scene]?… on first paint */
  initialParams?: StudioParams
}) {
  const [params, setParams] = React.useState<StudioParams>(() => {
    if (initialParams) return initialParams
    if (typeof window === "undefined") {
      return parseStudioParams("")
    }
    return parseStudioParams(window.location.search)
  })
  const [isReady, setIsReady] = React.useState(false)

  useIframeMessageListener(setParams)

  React.useEffect(() => {
    document.body.dataset.studioPreview = ""
    document.body.style.overflow = "auto"
    document.body.style.height = "100%"
    return () => {
      delete document.body.dataset.studioPreview
    }
  }, [])

  React.useLayoutEffect(() => {
    const body = document.body
    const root = document.documentElement
    const preset = presets[params.style]

    removeManagedBodyClasses(body)
    body.classList.add(preset.scopeClass)

    root.classList.toggle("dark", params.dark)
    root.style.colorScheme = params.dark ? "dark" : "light"

    const { light, dark } = buildPreviewCssVars(params)
    let styleElement = document.getElementById(
      THEME_STYLE_ELEMENT_ID
    ) as HTMLStyleElement | null
    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = THEME_STYLE_ELEMENT_ID
      document.head.appendChild(styleElement)
    }
    styleElement.textContent = [
      buildCssRule(":root", light),
      buildCssRule(".dark", dark),
      // Also set vars on body so scoped utilities under .style-* see overrides.
      buildCssRule("body", params.dark ? dark : light),
    ].join("\n")

    setIsReady(true)

    return () => {
      body.classList.remove(preset.scopeClass)
    }
  }, [params])

  if (!isReady) return null

  return (
    <IconLibraryProvider library={params.iconLibrary}>
      <div className="min-h-svh bg-background text-foreground">{children}</div>
    </IconLibraryProvider>
  )
}
