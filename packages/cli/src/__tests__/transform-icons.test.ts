import { describe, expect, it } from "vitest"
import { transformIconPlaceholders } from "../lib/transform-icons.js"

describe("transformIconPlaceholders", () => {
  const sample = `import * as React from "react"
import { IconPlaceholder } from "@/components/icon-placeholder"

export function Close() {
  return (
    <IconPlaceholder
      lucide="XIcon"
      tabler="IconX"
      hugeicons="Cancel01Icon"
      phosphor="XIcon"
      remixicon="RiCloseLine"
      className="size-4"
    />
  )
}
`

  it("resolves lucide", () => {
    const out = transformIconPlaceholders(sample, "lucide")
    expect(out).toContain('import { XIcon } from "lucide-react"')
    expect(out).toContain('<XIcon className="size-4" />')
    expect(out).not.toContain("IconPlaceholder")
  })

  it("resolves tabler", () => {
    const out = transformIconPlaceholders(sample, "tabler")
    expect(out).toContain('import { IconX } from "@tabler/icons-react"')
    expect(out).toContain('<IconX className="size-4" />')
  })

  it("resolves phosphor with strokeWidth", () => {
    const out = transformIconPlaceholders(sample, "phosphor")
    expect(out).toContain('import { XIcon } from "@phosphor-icons/react"')
    expect(out).toContain('<XIcon strokeWidth={2} className="size-4" />')
  })

  it("resolves remixicon", () => {
    const out = transformIconPlaceholders(sample, "remixicon")
    expect(out).toContain('import { RiCloseLine } from "@remixicon/react"')
    expect(out).toContain('<RiCloseLine className="size-4" />')
  })

  it("resolves hugeicons wrapper", () => {
    const out = transformIconPlaceholders(sample, "hugeicons")
    expect(out).toContain("HugeiconsIcon")
    expect(out).toContain("@hugeicons/core-free-icons")
    expect(out).toContain("icon={Cancel01Icon}")
  })
})
