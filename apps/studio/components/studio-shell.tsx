"use client"

import * as React from "react"

import { Customizer, type ProjectInfo } from "@/components/customizer"
import { Preview } from "@/components/preview"
import {
  ICON_LIBRARY_OPTIONS,
  IconLibraryProvider,
  type IconLibraryName,
} from "@/components/icon-placeholder"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DEFAULT_STUDIO_PARAMS,
  type PreviewScene,
  type StudioParams,
} from "@/lib/search-params"
import {
  RADII,
  buildCssExport,
  presets,
  themeDefaults,
  type PresetId,
  type RadiusName,
  type VariableMap,
} from "@/lib/studio-presets"

/**
 * Studio host shell — Customizer + Preview (create page layout).
 * Preview runs in one iframe; style-* never lands on the host document.
 */
export function StudioShell() {
  const [params, setParams] = React.useState<StudioParams>(DEFAULT_STUDIO_PARAMS)
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
          setParams((current) =>
            applyPresetToParams(style as PresetId, current)
          )
        }
        const icon = data.config?.iconLibrary
        if (icon && ICON_LIBRARY_OPTIONS.some((o) => o.id === icon)) {
          setParams((current) => ({
            ...current,
            iconLibrary: icon as IconLibraryName,
          }))
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
    root.classList.toggle("dark", params.dark)
    root.style.colorScheme = params.dark ? "dark" : "light"
    return () => {
      root.classList.remove("dark")
      root.style.colorScheme = ""
    }
  }, [params.dark])

  React.useEffect(() => {
    document.body.dataset.studioShell = ""
    return () => {
      delete document.body.dataset.studioShell
    }
  }, [])

  const preset = presets[params.style]
  const radiusValue =
    RADII.find((item) => item.name === params.radius)?.value ??
    themeDefaults["--radius"]
  const exportRadius =
    params.themeOverrides["--radius"] ??
    (params.radius !== "default" ? radiusValue : undefined)

  const cssExport = buildCssExport(
    preset.exportScopeClass,
    {
      ...params.themeOverrides,
      ...(exportRadius ? { "--radius": exportRadius } : {}),
    },
    preset.editableStyle ? params.styleOverrides : {}
  )

  function updateToken(
    token: string,
    value: string,
    defaults: VariableMap,
    key: "themeOverrides" | "styleOverrides"
  ) {
    setParams((current) => {
      const nextMap = { ...current[key] }
      if (!value.trim() || value === defaults[token]) {
        delete nextMap[token]
      } else {
        nextMap[token] = value
      }
      return { ...current, [key]: nextMap }
    })
  }

  function handlePresetChange(nextId: PresetId) {
    setParams((current) => applyPresetToParams(nextId, current))
  }

  function handleRadiusChange(next: RadiusName) {
    setParams((current) => {
      const value = RADII.find((item) => item.name === next)?.value
      const themeOverrides = { ...current.themeOverrides }
      if (!value || value === themeDefaults["--radius"]) {
        delete themeOverrides["--radius"]
      } else {
        themeOverrides["--radius"] = value
      }
      return { ...current, radius: next, themeOverrides }
    })
  }

  return (
    <IconLibraryProvider library={params.iconLibrary}>
      <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground md:flex-row">
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
          <Customizer
            project={project}
            presetId={params.style}
            onPresetChange={handlePresetChange}
            radius={params.radius}
            onRadiusChange={handleRadiusChange}
            iconLibrary={params.iconLibrary}
            onIconLibraryChange={(id) =>
              setParams((current) => ({ ...current, iconLibrary: id }))
            }
            dark={params.dark}
            onDarkChange={(dark) =>
              setParams((current) => ({ ...current, dark }))
            }
            themeOverrides={params.themeOverrides}
            styleOverrides={params.styleOverrides}
            onThemeTokenChange={(token, value) =>
              updateToken(token, value, themeDefaults, "themeOverrides")
            }
            onStyleTokenChange={(token, value) =>
              updateToken(token, value, preset.styleDefaults, "styleOverrides")
            }
            onResetTheme={() => {
              setParams((current) => ({
                ...current,
                themeOverrides: {},
                radius: presets[current.style].forcedRadius ?? "medium",
              }))
            }}
            onResetStyle={() =>
              setParams((current) => ({ ...current, styleOverrides: {} }))
            }
            cssExport={cssExport}
          />
        </aside>

        <main
          className={
            mobileTab === "preview"
              ? "flex min-h-0 min-w-0 flex-1 flex-col"
              : "hidden min-h-0 min-w-0 flex-1 flex-col md:flex"
          }
        >
          <Preview
            params={params}
            onSceneChange={(scene: PreviewScene) =>
              setParams((current) => ({ ...current, scene }))
            }
          />
        </main>
      </div>
    </IconLibraryProvider>
  )
}

function applyPresetToParams(
  nextId: PresetId,
  current: StudioParams
): StudioParams {
  const next = presets[nextId]
  let radius = current.radius
  let themeOverrides = { ...current.themeOverrides }

  if (next.forcedRadius) {
    radius = next.forcedRadius
    const value = RADII.find((item) => item.name === next.forcedRadius)?.value
    if (!value || value === themeDefaults["--radius"]) {
      delete themeOverrides["--radius"]
    } else {
      themeOverrides["--radius"] = value
    }
  } else if (next.disallowRadius?.includes("large") && radius === "large") {
    radius = "medium"
  }

  return {
    ...current,
    style: nextId,
    radius,
    styleOverrides: {},
    themeOverrides,
  }
}
