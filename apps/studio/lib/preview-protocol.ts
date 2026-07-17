import type { IconLibraryName } from "@/components/icon-placeholder"
import type { ScopeClass, VariableMap } from "@/lib/studio-presets"

export const STUDIO_PREVIEW_MESSAGE = "tyohn-studio-preview" as const
export const STUDIO_PREVIEW_READY = "tyohn-studio-preview-ready" as const

export type PreviewTab = "cards" | "components" | "colors"

export type StudioPreviewPayload = {
  scopeClass: ScopeClass
  tab: PreviewTab
  dark: boolean
  previewStyle: VariableMap
  iconLibrary: IconLibraryName
}

export type StudioPreviewMessage = {
  type: typeof STUDIO_PREVIEW_MESSAGE
  payload: StudioPreviewPayload
}

export type StudioPreviewReadyMessage = {
  type: typeof STUDIO_PREVIEW_READY
}

export function isStudioPreviewMessage(
  data: unknown
): data is StudioPreviewMessage {
  if (!data || typeof data !== "object") return false
  const msg = data as StudioPreviewMessage
  return msg.type === STUDIO_PREVIEW_MESSAGE && !!msg.payload
}

export function isStudioPreviewReadyMessage(
  data: unknown
): data is StudioPreviewReadyMessage {
  if (!data || typeof data !== "object") return false
  return (data as StudioPreviewReadyMessage).type === STUDIO_PREVIEW_READY
}
