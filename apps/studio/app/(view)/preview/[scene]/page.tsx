import { notFound } from "next/navigation"

import { DesignSystemProvider } from "@/components/design-system-provider"
import { SceneBlock } from "@/components/scenes"
import {
  PREVIEW_SCENES,
  parseStudioParams,
  type PreviewScene,
} from "@/lib/search-params"

export const metadata = {
  title: "tyohn Studio Preview",
  robots: { index: false, follow: false },
}

function isScene(value: string): value is PreviewScene {
  return (PREVIEW_SCENES as readonly string[]).includes(value)
}

/**
 * Iframe document — mirrors shadcn create /preview/[base]/[name].
 * Host posts design-system-params; DesignSystemProvider applies style-* on body.
 */
export default async function PreviewScenePage({
  params,
  searchParams,
}: {
  params: Promise<{ scene: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { scene: sceneParam } = await params
  if (!isScene(sceneParam)) notFound()

  const raw = await searchParams
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") qs.set(key, value)
    else if (Array.isArray(value) && value[0]) qs.set(key, value[0])
  }
  qs.set("scene", sceneParam)
  const initialParams = parseStudioParams(qs)

  return (
    <DesignSystemProvider initialParams={initialParams}>
      <SceneBlock scene={sceneParam} />
    </DesignSystemProvider>
  )
}
