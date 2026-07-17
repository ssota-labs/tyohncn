import type { PreviewScene } from "@/lib/search-params"

import { CardsScene } from "@/components/scenes/cards"
import { CatalogScene } from "@/components/scenes/catalog"
import { ColorsScene } from "@/components/scenes/colors"

export function SceneBlock({ scene }: { scene: PreviewScene }) {
  if (scene === "catalog") return <CatalogScene />
  if (scene === "colors") return <ColorsScene />
  return <CardsScene />
}

export { CardsScene, CatalogScene, ColorsScene }
