import {
  iconLibraries,
  type IconLibraryName,
} from "./icon-libraries.js"

const PLACEHOLDER_IMPORT_RE =
  /import\s*\{\s*IconPlaceholder\s*\}\s*from\s*["'][^"']*icon-placeholder["']\s*;?\n?/

const SELF_CLOSING_RE = /<IconPlaceholder\b([^>]*?)\/>/gs

/**
 * Transform IconPlaceholder JSX into the selected icon library components.
 * Mirrors shadcn's transformIcons behavior without ts-morph.
 */
export function transformIconPlaceholders(
  source: string,
  iconLibrary: IconLibraryName
): string {
  const library = iconLibraries[iconLibrary]
  const icons = new Set<string>()

  let next = source.replace(SELF_CLOSING_RE, (full, attrs: string) => {
    const iconMatch = attrs.match(
      new RegExp(`\\b${iconLibrary}=["']([^"']+)["']`)
    )
    if (!iconMatch) return full

    const iconName = iconMatch[1]
    icons.add(iconName)

    // Strip all library-specific props, keep the rest (className, aria-*, etc.)
    let rest = attrs
    for (const name of Object.keys(iconLibraries)) {
      rest = rest.replace(new RegExp(`\\s*\\b${name}=["'][^"']*["']`, "g"), "")
    }
    rest = rest.trim()

    const usage = library.usage
    if (usage.includes("HugeiconsIcon")) {
      const props = [`icon={${iconName}}`, "strokeWidth={2}"]
      if (rest) props.push(rest)
      return `<HugeiconsIcon ${props.join(" ")} />`
    }

    if (usage.includes("strokeWidth={2}") && !/\bstrokeWidth=/.test(rest)) {
      return rest
        ? `<${iconName} strokeWidth={2} ${rest} />`
        : `<${iconName} strokeWidth={2} />`
    }

    return rest ? `<${iconName} ${rest} />` : `<${iconName} />`
  })

  if (icons.size === 0) {
    return source
  }

  next = next.replace(PLACEHOLDER_IMPORT_RE, "")

  const iconList = [...icons]
  const importLines = library.import
    .split("\n")
    .map((line) => {
      if (line.includes("{ ICON }")) {
        return line.replace("ICON", iconList.join(", "))
      }
      return line
    })
    .join("\n")

  // Prefer inserting after "use client" directive
  if (next.startsWith('"use client"') || next.startsWith("'use client'")) {
    return next.replace(/^(["']use client["'];?\n\n?)/, `$1${importLines}\n`)
  }

  return `${importLines}\n${next}`
}

export function collectIconPackages(iconLibrary: IconLibraryName): string[] {
  return [...iconLibraries[iconLibrary].packages]
}
