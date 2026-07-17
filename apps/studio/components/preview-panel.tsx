"use client"

import * as React from "react"

import { Catalog } from "@/components/catalog"
import { CardsDemo } from "@/components/previews/cards-demo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ScopeClass, VariableMap } from "@/lib/studio-presets"

type PreviewPanelProps = {
  scopeClass: ScopeClass
  previewStyle: React.CSSProperties & Record<string, string>
  dark: boolean
}

export function PreviewPanel({
  scopeClass,
  previewStyle,
  dark,
}: PreviewPanelProps) {
  const [tab, setTab] = React.useState("cards")

  return (
    <div className="flex size-full min-h-0 flex-col overflow-hidden">
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="flex size-full min-h-0 flex-col overflow-hidden"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2">
          <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
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
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            .{scopeClass}
          </p>
        </div>

        <div
          className={cn(
            "relative min-h-0 flex-1 overflow-hidden bg-background",
            dark && "dark"
          )}
        >
          <div
            className={cn(scopeClass, "size-full min-h-0 overflow-hidden")}
            style={previewStyle}
          >
            <TabsContent
              value="cards"
              className="m-0 size-full min-h-0 overflow-hidden data-hidden:hidden"
            >
              <PreviewScrollSurface>
                <CardsDemo />
              </PreviewScrollSurface>
            </TabsContent>

            <TabsContent
              value="components"
              className="m-0 size-full min-h-0 overflow-hidden data-hidden:hidden"
            >
              <PreviewScrollSurface>
                <div className="min-w-[1100px] p-4 md:p-6">
                  <Catalog />
                </div>
              </PreviewScrollSurface>
            </TabsContent>

            <TabsContent
              value="colors"
              className="m-0 size-full min-h-0 overflow-hidden data-hidden:hidden"
            >
              <PreviewScrollSurface>
                <div className="min-w-[720px] p-4 md:p-6">
                  <ColorSwatches style={previewStyle} />
                </div>
              </PreviewScrollSurface>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

function PreviewScrollSurface({ children }: { children: React.ReactNode }) {
  return (
    <div className="size-full overflow-auto overscroll-contain">
      {children}
    </div>
  )
}

const SWATCHES: Array<[keyof VariableMap | string, string]> = [
  ["--background", "Background"],
  ["--foreground", "Foreground"],
  ["--card", "Card"],
  ["--primary", "Primary"],
  ["--secondary", "Secondary"],
  ["--muted", "Muted"],
  ["--accent", "Accent"],
  ["--destructive", "Destructive"],
  ["--border", "Border"],
  ["--input", "Input"],
  ["--ring", "Ring"],
]

function ColorSwatches({
  style,
}: {
  style: React.CSSProperties & Record<string, string>
}) {
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Color palette</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live semantic tokens applied to the preview root.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {SWATCHES.map(([token, label]) => (
          <div
            key={token}
            className="overflow-hidden rounded-xl border bg-card text-card-foreground"
          >
            <div
              className="h-20 border-b"
              style={{
                background:
                  style[token] ?? `var(${token})`,
              }}
            />
            <div className="grid gap-0.5 p-3 text-sm">
              <span className="font-medium">{label}</span>
              <code className="truncate text-xs text-muted-foreground">
                {token}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
