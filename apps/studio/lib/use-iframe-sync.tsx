"use client"

import * as React from "react"

import {
  DESIGN_SYSTEM_PARAMS_MESSAGE,
  isDesignSystemParamsMessage,
  type DesignSystemParamsMessage,
} from "@/lib/preview-protocol"
import type { StudioParams } from "@/lib/search-params"

export function isInIframe() {
  if (typeof window === "undefined") return false
  return window.self !== window.top
}

/**
 * Listen for host → iframe design-system-params (create pattern).
 * No-op when not inside an iframe.
 */
export function useIframeMessageListener(
  onMessage: (data: StudioParams) => void
) {
  const onMessageRef = React.useRef(onMessage)

  React.useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  React.useEffect(() => {
    if (!isInIframe()) return

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (!isDesignSystemParamsMessage(event.data)) return
      onMessageRef.current(event.data.data)
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}

export function sendToIframe(
  iframe: HTMLIFrameElement | null,
  data: StudioParams
) {
  if (!iframe?.contentWindow) return

  const message: DesignSystemParamsMessage = {
    type: DESIGN_SYSTEM_PARAMS_MESSAGE,
    data,
  }
  iframe.contentWindow.postMessage(message, window.location.origin)
}
