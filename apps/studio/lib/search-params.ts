import type { IconLibraryName } from "@/components/icon-placeholder"
import {
  RADII,
  presets,
  type PresetId,
  type RadiusName,
  type VariableMap,
} from "@/lib/studio-presets"

export const PREVIEW_SCENES = ["cards", "catalog", "colors"] as const
export type PreviewScene = (typeof PREVIEW_SCENES)[number]

export type StudioParams = {
  style: PresetId
  radius: RadiusName
  dark: boolean
  iconLibrary: IconLibraryName
  scene: PreviewScene
  /** Live token overrides — carried on postMessage; optional on URL as JSON. */
  themeOverrides: VariableMap
  styleOverrides: VariableMap
}

export const DEFAULT_STUDIO_PARAMS: StudioParams = {
  style: "mira-vars",
  radius: "medium",
  dark: false,
  iconLibrary: "lucide",
  scene: "cards",
  themeOverrides: {},
  styleOverrides: {},
}

const PRESET_IDS = Object.keys(presets) as PresetId[]
const RADIUS_NAMES = RADII.map((item) => item.name)
const ICON_LIBS: IconLibraryName[] = [
  "lucide",
  "tabler",
  "hugeicons",
  "phosphor",
  "remixicon",
]

function isPresetId(value: string): value is PresetId {
  return PRESET_IDS.includes(value as PresetId)
}

function isRadiusName(value: string): value is RadiusName {
  return (RADIUS_NAMES as readonly string[]).includes(value)
}

function isScene(value: string): value is PreviewScene {
  return (PREVIEW_SCENES as readonly string[]).includes(value)
}

function isIconLibrary(value: string): value is IconLibraryName {
  return ICON_LIBS.includes(value as IconLibraryName)
}

function parseOverrides(raw: string | null): VariableMap {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {}
    }
    const out: VariableMap = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value) out[key] = value
    }
    return out
  } catch {
    return {}
  }
}

/** Parse URLSearchParams / query string into StudioParams. */
export function parseStudioParams(
  input: URLSearchParams | string
): StudioParams {
  const params =
    typeof input === "string" ? new URLSearchParams(input) : input

  const styleRaw = params.get("style") ?? DEFAULT_STUDIO_PARAMS.style
  const radiusRaw = params.get("radius") ?? DEFAULT_STUDIO_PARAMS.radius
  const iconRaw = params.get("iconLibrary") ?? DEFAULT_STUDIO_PARAMS.iconLibrary
  const sceneRaw = params.get("scene") ?? DEFAULT_STUDIO_PARAMS.scene
  const darkRaw = params.get("dark")

  return {
    style: isPresetId(styleRaw) ? styleRaw : DEFAULT_STUDIO_PARAMS.style,
    radius: isRadiusName(radiusRaw) ? radiusRaw : DEFAULT_STUDIO_PARAMS.radius,
    dark: darkRaw === "1" || darkRaw === "true",
    iconLibrary: isIconLibrary(iconRaw)
      ? iconRaw
      : DEFAULT_STUDIO_PARAMS.iconLibrary,
    scene: isScene(sceneRaw) ? sceneRaw : DEFAULT_STUDIO_PARAMS.scene,
    themeOverrides: parseOverrides(params.get("theme")),
    styleOverrides: parseOverrides(params.get("density")),
  }
}

/**
 * Serialize stable knobs into a preview URL.
 * Heavy override maps are omitted unless includeOverrides is true
 * (postMessage carries them on every update).
 */
export function serializeStudioSearchParams(
  path: string,
  params: StudioParams,
  options?: { includeOverrides?: boolean }
): string {
  const search = new URLSearchParams()
  search.set("style", params.style)
  search.set("radius", params.radius)
  search.set("iconLibrary", params.iconLibrary)
  if (params.dark) search.set("dark", "1")
  if (options?.includeOverrides) {
    if (Object.keys(params.themeOverrides).length > 0) {
      search.set("theme", JSON.stringify(params.themeOverrides))
    }
    if (Object.keys(params.styleOverrides).length > 0) {
      search.set("density", JSON.stringify(params.styleOverrides))
    }
  }
  const qs = search.toString()
  return qs ? `${path}?${qs}` : path
}

export function scopeClassForStyle(style: PresetId) {
  return presets[style].scopeClass
}
