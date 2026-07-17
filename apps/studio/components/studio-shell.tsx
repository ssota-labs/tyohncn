"use client"

import * as React from "react"

import { PreviewFrame } from "@/components/preview-frame"
import {
  StudioControls,
  type ProjectInfo,
} from "@/components/studio-controls"
import {
  ICON_LIBRARY_OPTIONS,
  IconLibraryProvider,
  type IconLibraryName,
} from "@/components/icon-placeholder"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StudioPreviewPayload } from "@/lib/preview-protocol"
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

/**
 * Studio host shell — controls stay in the parent document.
 * Preview runs in an iframe (shadcn create pattern) so Portals inherit style-*.
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

  // Host chrome: dark mode only. Never put style-* on the host document.
  React.useEffect(() => {
    const root = document.documentElement
    for (const className of Array.from(root.classList)) {
      if (className.startsWith("style-")) root.classList.remove(className)
    }
    root.classList.toggle("dark", dark)
    root.style.colorScheme = dark ? "dark" : "light"
    return () => {
      root.classList.remove("dark")
      root.style.colorScheme = ""
    }
  }, [dark])

  React.useEffect(() => {
    document.body.dataset.studioShell = ""
    return () => {
      delete document.body.dataset.studioShell
    }
  }, [])

  const preset = presets[presetId]
  const radiusValue =
    RADII.find((item) => item.name === radius)?.value ??
    themeDefaults["--radius"]
  const previewStyle = React.useMemo(() => {
    return {
      ...(dark ? themeDarkDefaults : {}),
      ...themeOverrides,
      "--radius": themeOverrides["--radius"] ?? radiusValue,
      ...(preset.editableStyle ? styleOverrides : {}),
    } satisfies VariableMap
  }, [dark, themeOverrides, radiusValue, preset.editableStyle, styleOverrides])

  const previewPayload = React.useMemo<StudioPreviewPayload>(
    () => ({
      scopeClass: preset.scopeClass,
      tab: "cards",
      dark,
      previewStyle,
      iconLibrary,
    }),
    [preset.scopeClass, dark, previewStyle, iconLibrary]
  )

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

  const controlsProps = {
    project,
    presetId,
    onPresetChange: handlePresetChange,
    radius,
    onRadiusChange: handleRadiusChange,
    iconLibrary,
    onIconLibraryChange: setIconLibrary,
    dark,
    onDarkChange: setDark,
    themeOverrides,
    styleOverrides,
    onThemeTokenChange: (token: string, value: string) =>
      updateToken(token, value, themeDefaults, setThemeOverrides),
    onStyleTokenChange: (token: string, value: string) =>
      updateToken(token, value, preset.styleDefaults, setStyleOverrides),
    onResetTheme: () => {
      setThemeOverrides({})
      setRadius(preset.forcedRadius ?? "medium")
    },
    onResetStyle: () => setStyleOverrides({}),
    cssExport,
  } as const

  return (
    <IconLibraryProvider library={iconLibrary}>
      <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground md:flex-row">
        {/* Mobile-only Controls / Preview switch — single StudioControls instance below */}
        <div className="relative z-20 shrink-0 border-b px-2 py-2 md:hidden">
          <Tabs
            value={mobileTab}
            onValueChange={(value) =>
              setMobileTab(value as "controls" | "preview")
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="controls" className="flex-1 cursor-pointer">
                Controls
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 cursor-pointer">
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <aside
          className={
            mobileTab === "controls"
              ? "relative z-10 flex min-h-0 w-full flex-1 flex-col border-r md:w-[340px] md:flex-none"
              : "relative z-10 hidden w-[340px] shrink-0 flex-col border-r md:flex"
          }
        >
          <StudioControls {...controlsProps} />
        </aside>

        <main
          className={
            mobileTab === "preview"
              ? "flex min-h-0 min-w-0 flex-1 flex-col"
              : "hidden min-h-0 min-w-0 flex-1 flex-col md:flex"
          }
        >
          <PreviewFrame
            payload={previewPayload}
            scopeClass={preset.scopeClass}
          />
        </main>
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
