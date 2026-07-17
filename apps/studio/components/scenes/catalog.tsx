"use client"

import { Catalog } from "@/components/catalog"

/** Full-width catalog composition under the active style scope. */
export function CatalogScene() {
  return (
    <div className="w-[1100px] p-6">
      <Catalog />
    </div>
  )
}
