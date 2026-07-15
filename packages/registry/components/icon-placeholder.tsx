"use client"

import * as React from "react"
import { SquareIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import * as TablerIcons from "@tabler/icons-react"
import * as PhosphorIcons from "@phosphor-icons/react"
import * as RemixIcons from "@remixicon/react"
import { HugeiconsIcon } from "@hugeicons/react"
import * as HugeIcons from "@hugeicons/core-free-icons"

export type IconLibraryName =
  | "lucide"
  | "tabler"
  | "hugeicons"
  | "phosphor"
  | "remixicon"

export const ICON_LIBRARY_OPTIONS: Array<{
  id: IconLibraryName
  label: string
}> = [
  { id: "lucide", label: "Lucide" },
  { id: "tabler", label: "Tabler" },
  { id: "hugeicons", label: "HugeIcons" },
  { id: "phosphor", label: "Phosphor" },
  { id: "remixicon", label: "Remix Icon" },
]

type IconPlaceholderProps = {
  lucide: string
  tabler: string
  hugeicons: string
  phosphor: string
  remixicon: string
} & Omit<React.ComponentProps<"svg">, "ref">

const IconLibraryContext = React.createContext<IconLibraryName>("lucide")

export function IconLibraryProvider({
  library,
  children,
}: {
  library: IconLibraryName
  children: React.ReactNode
}) {
  return (
    <IconLibraryContext.Provider value={library}>
      {children}
    </IconLibraryContext.Provider>
  )
}

export function useIconLibrary() {
  return React.useContext(IconLibraryContext)
}

type AnyIcon = React.ComponentType<Record<string, unknown>>

function pick(
  mod: Record<string, unknown>,
  name: string
): AnyIcon | null {
  const value = mod[name]
  return typeof value === "function" ? (value as AnyIcon) : null
}

export function IconPlaceholder(props: IconPlaceholderProps) {
  const library = useIconLibrary()
  const {
    lucide,
    tabler,
    hugeicons,
    phosphor,
    remixicon,
    ...rest
  } = props

  if (library === "lucide") {
    const Icon = pick(LucideIcons as Record<string, unknown>, lucide)
    return Icon ? <Icon {...rest} /> : <SquareIcon {...rest} />
  }

  if (library === "tabler") {
    const Icon = pick(TablerIcons as Record<string, unknown>, tabler)
    return Icon ? <Icon {...rest} /> : <SquareIcon {...rest} />
  }

  if (library === "phosphor") {
    const Icon = pick(PhosphorIcons as Record<string, unknown>, phosphor)
    return Icon ? <Icon strokeWidth={2} {...rest} /> : <SquareIcon {...rest} />
  }

  if (library === "remixicon") {
    const Icon = pick(RemixIcons as Record<string, unknown>, remixicon)
    return Icon ? <Icon {...rest} /> : <SquareIcon {...rest} />
  }

  if (library === "hugeicons") {
    const iconData = (HugeIcons as Record<string, unknown>)[hugeicons]
    if (!iconData) return <SquareIcon {...rest} />
    return (
      <HugeiconsIcon
        icon={iconData as never}
        strokeWidth={2}
        {...(rest as Record<string, unknown>)}
      />
    )
  }

  return <SquareIcon {...rest} />
}
