export type PresetId =
  | "luma"
  | "lyra"
  | "maia"
  | "mira"
  | "mira-vars"
  | "nova"
  | "rhea"
  | "sera"
  | "ssota"
  | "vega"
  | "vega-vars"

/** Studio preview scopes. *-vars packs use distinct classes so they coexist in one CSS bundle. */
export type ScopeClass =
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

/** Consumer/CLI scope class written into exported CSS. */
export type ExportScopeClass =
  | "style-luma"
  | "style-lyra"
  | "style-maia"
  | "style-mira"
  | "style-nova"
  | "style-rhea"
  | "style-sera"
  | "style-ssota"
  | "style-vega"

export type VariableMap = Record<string, string>

export const RADII = [
  { name: "default", label: "Default", value: "0.625rem" },
  { name: "none", label: "None", value: "0" },
  { name: "small", label: "Small", value: "0.45rem" },
  { name: "medium", label: "Medium", value: "0.625rem" },
  { name: "large", label: "Large", value: "0.875rem" },
] as const

export type RadiusName = (typeof RADII)[number]["name"]

export const themeTokenGroups = [
  {
    id: "primary",
    label: "Primary",
    tokens: [
      ["--primary", "Background"],
      ["--primary-foreground", "Foreground"],
    ],
  },
  {
    id: "secondary",
    label: "Secondary",
    tokens: [
      ["--secondary", "Background"],
      ["--secondary-foreground", "Foreground"],
    ],
  },
  {
    id: "accent",
    label: "Accent",
    tokens: [
      ["--accent", "Background"],
      ["--accent-foreground", "Foreground"],
    ],
  },
  {
    id: "base",
    label: "Base",
    tokens: [
      ["--background", "Background"],
      ["--foreground", "Foreground"],
    ],
  },
  {
    id: "card",
    label: "Card",
    tokens: [
      ["--card", "Background"],
      ["--card-foreground", "Foreground"],
    ],
  },
  {
    id: "muted",
    label: "Muted",
    tokens: [
      ["--muted", "Background"],
      ["--muted-foreground", "Foreground"],
    ],
  },
  {
    id: "destructive",
    label: "Destructive",
    tokens: [
      ["--destructive", "Background"],
      ["--destructive-foreground", "Foreground"],
    ],
  },
  {
    id: "border",
    label: "Border & input",
    tokens: [
      ["--border", "Border"],
      ["--input", "Input"],
      ["--ring", "Ring"],
    ],
  },
] as const

export const themeDefaults: VariableMap = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0% 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0% 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0% 0 0)",
  "--primary": "oklch(0% 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.97 0 0)",
  "--secondary-foreground": "oklch(0.205 0 0)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--destructive-foreground": "oklch(0.97 0.01 17)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--radius": "0.625rem",
}

export const styleTokens = [
  ["--cn-button-height", "Button height"],
  ["--cn-button-padding-x", "Button padding X"],
  ["--cn-button-radius", "Button radius"],
  ["--cn-button-font-size", "Button font size"],
  ["--cn-button-ring-width", "Button ring width"],
  ["--cn-input-height", "Input height"],
  ["--cn-input-padding-x", "Input padding X"],
  ["--cn-input-radius", "Input radius"],
  ["--cn-input-font-size", "Input font size"],
  ["--cn-card-radius", "Card radius"],
  ["--cn-card-spacing", "Card spacing"],
  ["--cn-card-font-size", "Card font size"],
] as const

const miraDefaults: VariableMap = {
  "--cn-button-height": "1.75rem",
  "--cn-button-padding-x": "0.625rem",
  "--cn-button-radius": "var(--radius-md, 0.5rem)",
  "--cn-button-font-size": "0.75rem",
  "--cn-button-ring-width": "2px",
  "--cn-input-height": "1.75rem",
  "--cn-input-padding-x": "0.5rem",
  "--cn-input-radius": "var(--radius-md, 0.5rem)",
  "--cn-input-font-size": "0.875rem",
  "--cn-card-radius": "var(--radius-lg, 0.625rem)",
  "--cn-card-spacing": "1rem",
  "--cn-card-font-size": "0.75rem",
}

const lyraDefaults: VariableMap = {
  ...miraDefaults,
  "--cn-button-height": "2rem",
  "--cn-button-padding-x": "0.75rem",
  "--cn-button-font-size": "0.8125rem",
  "--cn-input-height": "2rem",
  "--cn-input-padding-x": "0.625rem",
  "--cn-card-spacing": "1.125rem",
  "--cn-card-font-size": "0.8125rem",
}

const vegaDefaults: VariableMap = {
  "--cn-button-height": "2.25rem",
  "--cn-button-padding-x": "1rem",
  "--cn-button-radius": "var(--radius-md, 0.5rem)",
  "--cn-button-font-size": "0.875rem",
  "--cn-button-ring-width": "3px",
  "--cn-input-height": "2.25rem",
  "--cn-input-padding-x": "0.625rem",
  "--cn-input-radius": "var(--radius-md, 0.5rem)",
  "--cn-input-font-size": "1rem",
  "--cn-card-radius": "var(--radius-xl, 0.875rem)",
  "--cn-card-spacing": "1.5rem",
  "--cn-card-font-size": "0.875rem",
}

const seraDefaults: VariableMap = {
  ...vegaDefaults,
  "--cn-button-height": "2.5rem",
  "--cn-button-padding-x": "1.125rem",
  "--cn-button-font-size": "0.9375rem",
  "--cn-input-height": "2.5rem",
  "--cn-input-font-size": "1.0625rem",
  "--cn-card-spacing": "1.75rem",
}

const ssotaDefaults: VariableMap = {
  "--cn-button-height": "2rem",
  "--cn-button-padding-x": "0.875rem",
  "--cn-button-radius": "calc(var(--radius) * 0.9)",
  "--cn-button-font-size": "0.8125rem",
  "--cn-button-ring-width": "2px",
  "--cn-input-height": "2rem",
  "--cn-input-padding-x": "0.75rem",
  "--cn-input-radius": "calc(var(--radius) * 0.9)",
  "--cn-input-font-size": "0.875rem",
  "--cn-card-radius": "calc(var(--radius) * 1.2)",
  "--cn-card-spacing": "1.25rem",
  "--cn-card-font-size": "0.8125rem",
}

export const presets: Record<
  PresetId,
  {
    label: string
    scopeClass: ScopeClass
    exportScopeClass: ExportScopeClass
    description: string
    styleDefaults: VariableMap
    editableStyle: boolean
    /** shadcn-create style constraints */
    forcedRadius?: RadiusName
    disallowRadius?: RadiusName[]
  }
> = {
  mira: {
    label: "mira",
    scopeClass: "style-mira",
    exportScopeClass: "style-mira",
    description: "Most compact (h-7). Dense product surfaces.",
    styleDefaults: miraDefaults,
    editableStyle: false,
  },
  lyra: {
    label: "lyra",
    scopeClass: "style-lyra",
    exportScopeClass: "style-lyra",
    description: "Compact-medium density (h-8). Forces radius none.",
    styleDefaults: lyraDefaults,
    editableStyle: false,
    forcedRadius: "none",
  },
  nova: {
    label: "nova",
    scopeClass: "style-nova",
    exportScopeClass: "style-nova",
    description: "Balanced medium density (h-8).",
    styleDefaults: lyraDefaults,
    editableStyle: false,
  },
  rhea: {
    label: "rhea",
    scopeClass: "style-rhea",
    exportScopeClass: "style-rhea",
    description: "Medium density with rhea chrome (h-8).",
    styleDefaults: lyraDefaults,
    editableStyle: false,
    disallowRadius: ["large"],
  },
  luma: {
    label: "luma",
    scopeClass: "style-luma",
    exportScopeClass: "style-luma",
    description: "Roomier default size (h-9).",
    styleDefaults: vegaDefaults,
    editableStyle: false,
  },
  maia: {
    label: "maia",
    scopeClass: "style-maia",
    exportScopeClass: "style-maia",
    description: "Roomier with maia treatment (h-9).",
    styleDefaults: vegaDefaults,
    editableStyle: false,
  },
  vega: {
    label: "vega",
    scopeClass: "style-vega",
    exportScopeClass: "style-vega",
    description: "Roomier preset with larger controls (h-9).",
    styleDefaults: vegaDefaults,
    editableStyle: false,
  },
  sera: {
    label: "sera",
    scopeClass: "style-sera",
    exportScopeClass: "style-sera",
    description: "Largest density (h-10). Forces radius none.",
    styleDefaults: seraDefaults,
    editableStyle: false,
    forcedRadius: "none",
  },
  "mira-vars": {
    label: "mira-vars",
    scopeClass: "style-mira-vars",
    exportScopeClass: "style-mira",
    description: "Mira density backed by editable --cn-* variables.",
    styleDefaults: miraDefaults,
    editableStyle: true,
  },
  "vega-vars": {
    label: "vega-vars",
    scopeClass: "style-vega-vars",
    exportScopeClass: "style-vega",
    description: "Vega density backed by editable --cn-* variables.",
    styleDefaults: vegaDefaults,
    editableStyle: true,
  },
  ssota: {
    label: "ssota",
    scopeClass: "style-ssota",
    exportScopeClass: "style-ssota",
    description: "First consumer brand preset.",
    styleDefaults: ssotaDefaults,
    editableStyle: true,
  },
}

export function buildCssExport(
  exportScopeClass: ExportScopeClass,
  themeOverrides: VariableMap,
  styleOverrides: VariableMap
) {
  const sections: string[] = []

  if (Object.keys(themeOverrides).length) {
    sections.push(formatRule(":root", themeOverrides))
  }

  if (Object.keys(styleOverrides).length) {
    sections.push(formatRule(`.${exportScopeClass}`, styleOverrides))
  }

  return sections.length
    ? sections.join("\n\n")
    : "/* No overrides yet. Edit tokens to generate CSS. */"
}

function formatRule(selector: string, values: VariableMap) {
  const body = Object.entries(values)
    .map(([token, value]) => `  ${token}: ${value};`)
    .join("\n")

  return `${selector} {\n${body}\n}`
}
