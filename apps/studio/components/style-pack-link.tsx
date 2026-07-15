"use client"

import * as React from "react"

export type StylePackId =
  | "style-mira"
  | "style-vega"
  | "style-mira-vars"
  | "style-vega-vars"
  | "style-ssota"

const STYLE_PACK_HREF: Record<StylePackId, string> = {
  "style-mira": "/registry-styles/style-mira.css",
  "style-vega": "/registry-styles/style-vega.css",
  "style-mira-vars": "/registry-styles/style-mira-vars.css",
  "style-vega-vars": "/registry-styles/style-vega-vars.css",
  "style-ssota": "/registry-styles/style-ssota.css",
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
