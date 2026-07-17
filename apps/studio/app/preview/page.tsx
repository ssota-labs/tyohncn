import { PreviewDocument } from "@/components/preview-document"

export const metadata = {
  title: "tyohn Studio Preview",
  robots: { index: false, follow: false },
}

/**
 * Iframe document — mirrors shadcn create's /preview route.
 * Host Studio posts design params; this page applies style-* on <body>.
 */
export default function PreviewPage() {
  return <PreviewDocument />
}
