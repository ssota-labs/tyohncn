"use client"

import * as React from "react"

import { PreviewPanel } from "@/components/preview-panel"
import {
  StudioControls,
  type ProjectInfo,
} from "@/components/studio-controls"
import {
  ICON_LIBRARY_OPTIONS,
  IconLibraryProvider,
  type IconLibraryName,
} from "@/components/icon-placeholder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RADII,
  buildCssExport,
  presets,
  themeDarkDefaults,
  themeDefaults,
  type PresetId,
  type RadiusName,
  type VariableMap,
} from "@/lib/studio-presets"

type VariableStyles = React.CSSProperties & Record<string, string>

/**
 * Studio shell — intentionally simple.
 *
 * Root causes we hit with the previous tweakcn clone:
 * 1. style-* on <html> restyled the editor chrome itself
 * 2. 1px resizable handle was covered by preview content → dead clicks
 * 3. missing isolation made horizontal scroll feel like clipping
 *
 * So: fixed sidebar, preview-only style scope, no overlapping hit targets.
 */
export function StudioShell() {
  const [presetId, setPresetId] = React.useState<PresetId>("mira-vars")
  const [iconLibrary, setIconLibrary] =
    React.useState<IconLibraryName>("lucide")
  const [radius, setRadius] = React.useState<RadiusName>("medium")
  const [dark, setDark] = React.useState(false)
  const [themeOverrides, setThemeOverrides] = React.useState<VariableMap>({})
  const [styleOverrides, setStyleOverrides] = React.useState<VariableMap>({})
  const [project, setProject] = React.useState<ProjectInfo | null>(null)
  const [mobileTab, setMobileTab] = React.useState<"controls" | "preview">(
    "preview"
  )

  React.useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 5000)

    const demoFallback = (): ProjectInfo => ({
      mode: "demo",
      root: null,
      config: null,
      components: [],
      styles: [],
      packs: [],
      suggestedCli: [],
      note: "Could not load project info. Showing Studio demo mode.",
    })

    void fetch("/api/project", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Project request failed (${response.status})`)
        }
        return (await response.json()) as ProjectInfo
      })
      .then((data) => {
        if (cancelled) return
        setProject({
          ...data,
          packs: data.packs ?? [],
        })
        const style = data.config?.style
        if (style && style in presets) {
          applyPreset(
            style as PresetId,
            setPresetId,
            setRadius,
            setStyleOverrides,
            setThemeOverrides
          )
        }
        const icon = data.config?.iconLibrary
        if (icon && ICON_LIBRARY_OPTIONS.some((o) => o.id === icon)) {
          setIconLibrary(icon as IconLibraryName)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProject(demoFallback())
        }
      })
      .finally(() => {
        window.clearTimeout(timeoutId)
      })

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [])

  // Dark mode only on <html>. NEVER put style-* on documentElement —
  // that leaks density packs into Studio chrome and breaks affordances.
  React.useEffect(() => {
    const root = document.documentElement
    const previous = Array.from(root.classList).filter((c) =>
      c.startsWith("style-")
    )
    for (const c of previous) root.classList.remove(c)
    root.classList.toggle("dark", dark)
    root.style.colorScheme = dark ? "dark" : "light"
    return () => {
      root.classList.remove("dark")
      root.style.colorScheme = ""
    }
  }, [dark])

  const preset = presets[presetId]
  const radiusValue =
    RADII.find((item) => item.name === radius)?.value ??
    themeDefaults["--radius"]
  const modeDefaults = dark ? themeDarkDefaults : {}

  // Only inject mode defaults + user overrides into the preview root.
  // Do not re-declare every light token — let theme.css own the base.
  const previewStyle = {
    ...modeDefaults,
    ...themeOverrides,
    "--radius": themeOverrides["--radius"] ?? radiusValue,
    ...(preset.editableStyle ? styleOverrides : {}),
  } as VariableStyles

  const cssExport = buildCssExport(
    preset.exportScopeClass,
    {
      ...themeOverrides,
      ...(themeOverrides["--radius"] || radius !== "default"
        ? { "--radius": previewStyle["--radius"] }
        : {}),
    },
    preset.editableStyle ? styleOverrides : {}
  )

  function updateToken(
    token: string,
    value: string,
    defaults: VariableMap,
    setter: React.Dispatch<React.SetStateAction<VariableMap>>
  ) {
    setter((current) => {
      const next = { ...current }
      if (!value.trim() || value === defaults[token]) {
        delete next[token]
      } else {
        next[token] = value
      }
      return next
    })
  }

  function handlePresetChange(nextId: PresetId) {
    applyPreset(
      nextId,
      setPresetId,
      setRadius,
      setStyleOverrides,
      setThemeOverrides
    )
  }

  function handleRadiusChange(next: RadiusName) {
    setRadius(next)
    const value = RADII.find((item) => item.name === next)?.value
    if (!value) return
    setThemeOverrides((current) => {
      const nextOverrides = { ...current }
      if (value === themeDefaults["--radius"]) {
        delete nextOverrides["--radius"]
      } else {
        nextOverrides["--radius"] = value
      }
      return nextOverrides
    })
  }

  const controls = (
    <StudioControls
      project={project}
      presetId={presetId}
      onPresetChange={handlePresetChange}
      radius={radius}
      onRadiusChange={handleRadiusChange}
      iconLibrary={iconLibrary}
      onIconLibraryChange={setIconLibrary}
      dark={dark}
      onDarkChange={setDark}
      themeOverrides={themeOverrides}
      styleOverrides={styleOverrides}
      onThemeTokenChange={(token, value) =>
        updateToken(token, value, themeDefaults, setThemeOverrides)
      }
      onStyleTokenChange={(token, value) =>
        updateToken(token, value, preset.styleDefaults, setStyleOverrides)
      }
      onResetTheme={() => {
        setThemeOverrides({})
        setRadius(preset.forcedRadius ?? "medium")
      }}
      onResetStyle={() => setStyleOverrides({})}
      cssExport={cssExport}
    />
  )

  const preview = (
    <PreviewPanel
      scopeClass={preset.scopeClass}
      previewStyle={previewStyle}
      dark={dark}
    />
  )

  return (
    <IconLibraryProvider library={iconLibrary}>
      <div className="flex h-svh overflow-hidden bg-background text-foreground">
        {/* Desktop: fixed sidebar — no overlapping resize hit-target */}
        <aside className="hidden w-[340px] shrink-0 border-r md:flex md:flex-col">
          {controls}
        </aside>
        <main className="hidden min-h-0 min-w-0 flex-1 flex-col md:flex">
          {preview}
        </main>

        {/* Mobile */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:hidden">
          <Tabs
            value={mobileTab}
            onValueChange={(value) =>
              setMobileTab(value as "controls" | "preview")
            }
            className="flex size-full min-h-0 flex-col"
          >
            <div className="shrink-0 border-b px-2 py-2">
              <TabsList className="w-full">
                <TabsTrigger value="controls" className="flex-1">
                  Controls
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="controls"
              className="m-0 min-h-0 min-w-0 flex-1 overflow-hidden data-hidden:hidden"
            >
              {controls}
            </TabsContent>
            <TabsContent
              value="preview"
              className="m-0 min-h-0 min-w-0 flex-1 overflow-hidden data-hidden:hidden"
            >
              {preview}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </IconLibraryProvider>
  )
}

function applyPreset(
  nextId: PresetId,
  setPresetId: React.Dispatch<React.SetStateAction<PresetId>>,
  setRadius: React.Dispatch<React.SetStateAction<RadiusName>>,
  setStyleOverrides: React.Dispatch<React.SetStateAction<VariableMap>>,
  setThemeOverrides: React.Dispatch<React.SetStateAction<VariableMap>>
) {
  const next = presets[nextId]
  setPresetId(nextId)
  setStyleOverrides({})
  if (next.forcedRadius) {
    setRadius(next.forcedRadius)
    const value = RADII.find((item) => item.name === next.forcedRadius)?.value
    setThemeOverrides((current) => {
      const nextOverrides = { ...current }
      if (!value || value === themeDefaults["--radius"]) {
        delete nextOverrides["--radius"]
      } else {
        nextOverrides["--radius"] = value
      }
      return nextOverrides
    })
  } else if (next.disallowRadius?.includes("large")) {
    setRadius((current) => (current === "large" ? "medium" : current))
  }
}
