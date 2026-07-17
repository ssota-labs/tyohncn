"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { sendToIframe } from "@/lib/use-iframe-sync"
import {
  PREVIEW_SCENES,
  serializeStudioSearchParams,
  scopeClassForStyle,
  type PreviewScene,
  type StudioParams,
} from "@/lib/search-params"
import { cn } from "@/lib/utils"

const SCENE_LABELS: Record<PreviewScene, string> = {
  cards: "Cards",
  catalog: "Components",
  colors: "Colors",
}

type PreviewProps = {
  params: StudioParams
  onSceneChange: (scene: PreviewScene) => void
}

/**
 * Host-side iframe wrapper (shadcn create Preview pattern).
 * iframe src seeds scene + stable knobs; live updates go through postMessage.
 */
export function Preview({ params, onSceneChange }: PreviewProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  // Stable initial src — only remount when scene changes (create: key=base+item).
  const iframeSrc = React.useMemo(() => {
    return serializeStudioSearchParams(`/preview/${params.scene}`, params, {
      includeOverrides: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: seed once per scene
  }, [params.scene])

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const sendParams = () => {
      sendToIframe(iframe, params)
    }

    if (iframe.contentWindow) {
      sendParams()
    }

    iframe.addEventListener("load", sendParams)
    return () => {
      iframe.removeEventListener("load", sendParams)
    }
  }, [params])

  return (
    <div className="relative flex size-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b bg-background px-3 py-2">
        <div className="flex items-center gap-1">
          {PREVIEW_SCENES.map((scene) => (
            <Button
              key={scene}
              type="button"
              size="sm"
              variant="ghost"
              data-active={params.scene === scene}
              className={cn(
                "h-8 cursor-pointer px-3 text-xs font-medium text-muted-foreground",
                "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              )}
              onClick={() => onSceneChange(scene)}
            >
              {SCENE_LABELS[scene]}
            </Button>
          ))}
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          .{scopeClassForStyle(params.style)}
        </p>
      </div>

      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-muted/30">
        <iframe
          key={params.scene}
          ref={iframeRef}
          title="tyohn Studio preview"
          src={iframeSrc}
          className="z-10 size-full border-0 bg-background"
        />
      </div>
    </div>
  )
}
