"use client"

import * as React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  STUDIO_PREVIEW_MESSAGE,
  isStudioPreviewReadyMessage,
  type PreviewTab,
  type StudioPreviewPayload,
} from "@/lib/preview-protocol"
import type { ScopeClass } from "@/lib/studio-presets"

type PreviewFrameProps = {
  payload: StudioPreviewPayload
  scopeClass: ScopeClass
}

/**
 * Host-side iframe wrapper (shadcn create Preview pattern).
 * iframe src stays stable; live updates go through postMessage.
 */
export function PreviewFrame({ payload, scopeClass }: PreviewFrameProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = React.useState(false)
  const [tab, setTab] = React.useState<PreviewTab>(payload.tab)

  const send = React.useCallback(
    (next: StudioPreviewPayload) => {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      win.postMessage(
        { type: STUDIO_PREVIEW_MESSAGE, payload: next },
        window.location.origin
      )
    },
    []
  )

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (!isStudioPreviewReadyMessage(event.data)) return
      setReady(true)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  // Push latest payload whenever controls change (after iframe is ready).
  React.useEffect(() => {
    if (!ready) return
    send({ ...payload, tab })
  }, [ready, payload, tab, send])

  return (
    <div className="flex size-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b bg-background px-3 py-2">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as PreviewTab)}
        >
          <TabsList variant="line" className="h-9 w-max">
            <TabsTrigger value="cards" className="px-3">
              Cards
            </TabsTrigger>
            <TabsTrigger value="components" className="px-3">
              Components
            </TabsTrigger>
            <TabsTrigger value="colors" className="px-3">
              Colors
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          .{scopeClass}
        </p>
      </div>

      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-muted/30">
        <iframe
          ref={iframeRef}
          title="tyohn Studio preview"
          src="/preview"
          className="size-full border-0 bg-background"
          onLoad={() => {
            // Ready message may race; re-send after load too.
            send({ ...payload, tab })
          }}
        />
        {!ready ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Loading preview…
          </div>
        ) : null}
      </div>
    </div>
  )
}
