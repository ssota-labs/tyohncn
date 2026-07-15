"use client"

import * as React from "react"

export type StylePackId =
  | "style-luma"
  | "style-lyra"
  | "style-maia"
  | "style-mira"
  | "style-mira-vars"
  | "style-nova"
  | "style-rhea"
  | "style-sera"
  | "style-ssota"
  | "style-vega"
  | "style-vega-vars"

const STYLE_PACK_HREF: Record<StylePackId, string> = {
  "style-luma": "/registry-styles/style-luma.css",
  "style-lyra": "/registry-styles/style-lyra.css",
  "style-maia": "/registry-styles/style-maia.css",
  "style-mira": "/registry-styles/style-mira.css",
  "style-mira-vars": "/registry-styles/style-mira-vars.css",
  "style-nova": "/registry-styles/style-nova.css",
  "style-rhea": "/registry-styles/style-rhea.css",
  "style-sera": "/registry-styles/style-sera.css",
  "style-ssota": "/registry-styles/style-ssota.css",
  "style-vega": "/registry-styles/style-vega.css",
  "style-vega-vars": "/registry-styles/style-vega-vars.css",
}

const LINK_ID = "tyohn-studio-style-pack"

export function StylePackLink({ packId }: { packId: StylePackId }) {
  React.useEffect(() => {
    const href = STYLE_PACK_HREF[packId]
    let link = document.getElementById(LINK_ID) as HTMLLinkElement | null

    if (!link) {
      link = document.createElement("link")
      link.id = LINK_ID
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }

    if (link.href !== new URL(href, window.location.origin).href) {
      link.href = href
    }
  }, [packId])

  return null
}
