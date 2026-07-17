import type { StudioParams } from "@/lib/search-params"

/** Matches shadcn create's parent → iframe message type name. */
export const DESIGN_SYSTEM_PARAMS_MESSAGE = "design-system-params" as const

export type DesignSystemParamsMessage = {
  type: typeof DESIGN_SYSTEM_PARAMS_MESSAGE
  data: StudioParams
}

export function isDesignSystemParamsMessage(
  data: unknown
): data is DesignSystemParamsMessage {
  if (!data || typeof data !== "object") return false
  const msg = data as DesignSystemParamsMessage
  return msg.type === DESIGN_SYSTEM_PARAMS_MESSAGE && !!msg.data
}
