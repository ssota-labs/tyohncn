"use client"

import * as React from "react"
import {
  Check,
  Copy,
  Eye,
  FolderGit2,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Terminal,
} from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ICON_LIBRARY_OPTIONS,
  IconLibraryProvider,
  IconPlaceholder,
  type IconLibraryName,
} from "@/components/icon-placeholder"
import { cn } from "@/lib/utils"
import {
  classifyToken,
  cssColorToHex,
  formatDimension,
  hexToCssColor,
  parseDimension,
} from "@/lib/token-controls"

type PresetId =
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
type ScopeClass =
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
type VariableMap = Record<string, string>
type VariableStyles = React.CSSProperties & Record<string, string>

type ProjectInfo = {
  mode: "project" | "demo"
  root: string | null
  config: {
    style?: string
    iconLibrary?: string
    mode?: string
    packs?: string[]
  } | null
  components: string[]
  styles: string[]
  packs: string[]
  suggestedCli: string[]
  note: string
}

const themeTokens = [
  ["--primary", "Primary"],
  ["--primary-foreground", "Primary foreground"],
  ["--secondary", "Secondary"],
  ["--secondary-foreground", "Secondary foreground"],
  ["--muted", "Muted"],
  ["--muted-foreground", "Muted foreground"],
  ["--accent", "Accent"],
  ["--accent-foreground", "Accent foreground"],
  ["--destructive", "Destructive"],
  ["--border", "Border"],
  ["--input", "Input"],
  ["--ring", "Ring"],
  ["--radius", "Radius"],
] as const

const themeDefaults: VariableMap = {
  "--primary": "oklch(0% 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.97 0 0)",
  "--secondary-foreground": "oklch(0.205 0 0)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--radius": "0.625rem",
}

const styleTokens = [
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

const presets: Record<
  PresetId,
  {
    label: string
    scopeClass: ScopeClass
    /** Consumer apply id (tyohncn apply --style). */
    applyId: PresetId
    description: string
    styleDefaults: VariableMap
    editableStyle: boolean
  }
> = {
  mira: {
    label: "mira",
    scopeClass: "style-mira",
    applyId: "mira",
    description: "Most compact (h-7). Dense product surfaces.",
    styleDefaults: miraDefaults,
    editableStyle: false,
  },
  lyra: {
    label: "lyra",
    scopeClass: "style-lyra",
    applyId: "lyra",
    description: "Compact-medium density (h-8).",
    styleDefaults: miraDefaults,
    editableStyle: false,
  },
  nova: {
    label: "nova",
    scopeClass: "style-nova",
    applyId: "nova",
    description: "Balanced medium density (h-8).",
    styleDefaults: miraDefaults,
    editableStyle: false,
  },
  rhea: {
    label: "rhea",
    scopeClass: "style-rhea",
    applyId: "rhea",
    description: "Medium density with rhea chrome (h-8).",
    styleDefaults: miraDefaults,
    editableStyle: false,
  },
  luma: {
    label: "luma",
    scopeClass: "style-luma",
    applyId: "luma",
    description: "Roomier default size (h-9).",
    styleDefaults: vegaDefaults,
    editableStyle: false,
  },
  maia: {
    label: "maia",
    scopeClass: "style-maia",
    applyId: "maia",
    description: "Roomier with maia treatment (h-9).",
    styleDefaults: vegaDefaults,
    editableStyle: false,
  },
  vega: {
    label: "vega",
    scopeClass: "style-vega",
    applyId: "vega",
    description: "Roomier preset with larger controls (h-9).",
    styleDefaults: vegaDefaults,
    editableStyle: false,
  },
  sera: {
    label: "sera",
    scopeClass: "style-sera",
    applyId: "sera",
    description: "Largest density (h-10).",
    styleDefaults: vegaDefaults,
    editableStyle: false,
  },
  "mira-vars": {
    label: "mira-vars",
    scopeClass: "style-mira-vars",
    applyId: "mira-vars",
    description: "Mira density backed by editable --cn-* variables.",
    styleDefaults: miraDefaults,
    editableStyle: true,
  },
  "vega-vars": {
    label: "vega-vars",
    scopeClass: "style-vega-vars",
    applyId: "vega-vars",
    description: "Vega density backed by editable --cn-* variables.",
    styleDefaults: vegaDefaults,
    editableStyle: true,
  },
  ssota: {
    label: "ssota",
    scopeClass: "style-ssota",
    applyId: "ssota",
    description: "First consumer brand preset.",
    styleDefaults: ssotaDefaults,
    editableStyle: true,
  },
}

const ICON_SAMPLES = [
  {
    lucide: "CheckIcon",
    tabler: "IconCheck",
    hugeicons: "Tick02Icon",
    phosphor: "CheckIcon",
    remixicon: "RiCheckLine",
  },
  {
    lucide: "ChevronDownIcon",
    tabler: "IconChevronDown",
    hugeicons: "ArrowDown01Icon",
    phosphor: "CaretDownIcon",
    remixicon: "RiArrowDownSLine",
  },
  {
    lucide: "XIcon",
    tabler: "IconX",
    hugeicons: "Cancel01Icon",
    phosphor: "XIcon",
    remixicon: "RiCloseLine",
  },
  {
    lucide: "SearchIcon",
    tabler: "IconSearch",
    hugeicons: "Search01Icon",
    phosphor: "MagnifyingGlassIcon",
    remixicon: "RiSearchLine",
  },
  {
    lucide: "PlusIcon",
    tabler: "IconPlus",
    hugeicons: "Add01Icon",
    phosphor: "PlusIcon",
    remixicon: "RiAddLine",
  },
  {
    lucide: "SettingsIcon",
    tabler: "IconSettings",
    hugeicons: "Settings01Icon",
    phosphor: "GearIcon",
    remixicon: "RiSettings3Line",
  },
] as const

const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

const buttonSizes = ["xs", "sm", "default", "lg"] as const

export function StudioShell() {
  const [presetId, setPresetId] = React.useState<PresetId>("mira-vars")
  const [iconLibrary, setIconLibrary] =
    React.useState<IconLibraryName>("lucide")
  const [themeOverrides, setThemeOverrides] = React.useState<VariableMap>({})
  const [styleOverrides, setStyleOverrides] = React.useState<VariableMap>({})
  const [copied, setCopied] = React.useState(false)
  const [project, setProject] = React.useState<ProjectInfo | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 5000)

    const demoFallback = (): ProjectInfo => ({
      mode: "demo",
      root: null,
      config: null,
      components: [],
      styles: [],
      packs: [],
      suggestedCli: [],
      note: "Could not load project info. Showing Studio demo mode.",
    })

    void fetch("/api/project", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Project request failed (${response.status})`)
        }
        return (await response.json()) as ProjectInfo
      })
      .then((data) => {
        if (cancelled) return
        setProject({
          ...data,
          packs: data.packs ?? [],
        })
        const style = data.config?.style
        if (style && style in presets) {
          setPresetId(style as PresetId)
        }
        const icon = data.config?.iconLibrary
        if (icon && ICON_LIBRARY_OPTIONS.some((o) => o.id === icon)) {
          setIconLibrary(icon as IconLibraryName)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProject(demoFallback())
        }
      })
      .finally(() => {
        window.clearTimeout(timeoutId)
      })

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [])

  const preset = presets[presetId]
  const previewStyle = {
    ...themeOverrides,
    ...(preset.editableStyle ? styleOverrides : {}),
  } as VariableStyles
  const cssExport = buildCssExport(
    preset.scopeClass,
    themeOverrides,
    preset.editableStyle ? styleOverrides : {}
  )

  function updateToken(
    token: string,
    value: string,
    defaults: VariableMap,
    setter: React.Dispatch<React.SetStateAction<VariableMap>>
  ) {
    setter((current) => {
      const next = { ...current }
      if (!value.trim() || value === defaults[token]) {
        delete next[token]
      } else {
        next[token] = value
      }
      return next
    })
  }

  async function copyCss() {
    await navigator.clipboard.writeText(cssExport)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <IconLibraryProvider library={iconLibrary}>
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 md:px-8 md:py-8">
        <header className="flex flex-col gap-6 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              tyohncn Studio
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Catalog, inspect, export.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Switch style scopes, tune semantic tokens, edit variable-backed
              density hooks, and copy the CSS needed to reproduce the preview.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-3 text-sm text-muted-foreground shadow-sm">
            Preview scope:{" "}
            <span className="font-medium text-foreground">
              .{preset.scopeClass}
            </span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="flex flex-col gap-4">
            <ProjectMetaPanel project={project} />

            <Panel title="Preset switcher" icon={<Palette className="size-4" />}>
              <div className="grid gap-2 text-sm font-medium">
                Active preset
                <Select
                  value={presetId}
                  onValueChange={(value) => {
                    if (value != null) {
                      setPresetId(value as PresetId)
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(presets).map(([id, item]) => (
                      <SelectItem key={id} value={id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {preset.description}
              </p>
              <p className="rounded-lg bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
                Preview only. Confirm with{" "}
                <code className="text-[0.7rem]">
                  tyohncn apply --style {preset.applyId}
                </code>
              </p>
            </Panel>

            <Panel title="Icon library" icon={<Eye className="size-4" />}>
              <div className="grid gap-2 text-sm font-medium">
                Active icons
                <Select
                  value={iconLibrary}
                  onValueChange={(value) => {
                    if (value != null) {
                      setIconLibrary(value as IconLibraryName)
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select icon library" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_LIBRARY_OPTIONS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5">
                {ICON_SAMPLES.map((sample) => (
                  <div
                    key={sample.lucide}
                    className="flex flex-col items-center gap-1 text-muted-foreground"
                    title={sample.lucide}
                  >
                    <IconPlaceholder
                      lucide={sample.lucide}
                      tabler={sample.tabler}
                      hugeicons={sample.hugeicons}
                      phosphor={sample.phosphor}
                      remixicon={sample.remixicon}
                      className="size-4"
                    />
                    <span className="text-[10px] leading-none">
                      {sample.lucide.replace(/Icon$/, "")}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-4 text-muted-foreground">
                Preview · CLI resolves IconPlaceholder on add/apply
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Same libraries as shadcn: Lucide, Tabler, HugeIcons, Phosphor,
                Remix. CLI bakes the choice at{" "}
                <code className="text-xs">add</code> /{" "}
                <code className="text-xs">apply --icon</code>.
              </p>
            </Panel>

            <Panel
              title="Theme inspector"
              icon={<SlidersHorizontal className="size-4" />}
              action={
                <ResetButton onClick={() => setThemeOverrides({})}>
                  Reset
                </ResetButton>
              }
            >
              <TokenGrid
                tokens={themeTokens}
                defaults={themeDefaults}
                overrides={themeOverrides}
                onChange={(token, value) =>
                  updateToken(token, value, themeDefaults, setThemeOverrides)
                }
              />
            </Panel>

            <Panel
              title="Style inspector"
              icon={<Eye className="size-4" />}
              action={
                <ResetButton onClick={() => setStyleOverrides({})}>
                  Reset
                </ResetButton>
              }
            >
              <TokenGrid
                tokens={styleTokens}
                defaults={preset.styleDefaults}
                overrides={styleOverrides}
                disabled={!preset.editableStyle}
                onChange={(token, value) =>
                  updateToken(
                    token,
                    value,
                    preset.styleDefaults,
                    setStyleOverrides
                  )
                }
              />
              {!preset.editableStyle ? (
                <p className="rounded-lg bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
                  Style variables are editable for the *-vars presets. This
                  preset still previews through its scoped style class.
                </p>
              ) : null}
            </Panel>
          </aside>

          <section className="grid gap-6">
            <div
              className={cn(
                preset.scopeClass,
                "rounded-2xl border bg-background p-4 shadow-sm md:p-6"
              )}
              style={previewStyle}
            >
              <Catalog />
            </div>

            <Panel
              title="CSS export"
              icon={<Copy className="size-4" />}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={copyCss}
                >
                  {copied ? (
                    <>
                      <Check data-icon="inline-start" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy data-icon="inline-start" />
                      Copy CSS
                    </>
                  )}
                </Button>
              }
            >
              <pre className="max-h-80 overflow-auto rounded-xl border bg-muted/40 p-4 text-xs leading-6 text-foreground">
                <code>{cssExport}</code>
              </pre>
            </Panel>
          </section>
        </section>
      </div>
    </main>
    </IconLibraryProvider>
  )
}

function Catalog() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Component catalog
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Button, input, and card from @tyohn/registry via tsconfig paths.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Button variants</CardTitle>
            <CardDescription>
              CVA variants remain cn-* hooks; the scope supplies the look.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {buttonSizes.map((size) => (
                <Button key={size} size={size} variant="outline">
                  {size}
                </Button>
              ))}
              <Button size="icon" aria-label="Confirm">
                <Check data-icon="inline-start" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Height, padding, font, and radius hooks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Input placeholder="Placeholder text" />
            <Input defaultValue="hello@tyohn.dev" type="email" />
            <Input aria-invalid placeholder="Invalid state" />
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Checkbox uses IconPlaceholder (switches with icon library)
            </label>
          </CardContent>
          <CardFooter className="justify-between border-t">
            <span className="text-sm text-muted-foreground">
              Uses @base-ui/react input
            </span>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card density</CardTitle>
            <CardDescription>
              Spacing and title scale change with the active style.
            </CardDescription>
            <CardAction>
              <Button size="sm" variant="secondary">
                Action
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              The preview root receives semantic variables and, for vars presets,
              --cn-* overrides. Component source stays stable.
            </p>
          </CardContent>
        </Card>

        <Card size="sm" className="md:col-span-2">
          <CardHeader>
            <CardTitle>Small card</CardTitle>
            <CardDescription>
              The registry card exposes a size data attribute for compact layouts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button size="xs" variant="outline">
                Inspect
              </Button>
              <Button size="xs" variant="ghost">
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function ProjectMetaPanel({ project }: { project: ProjectInfo | null }) {
  const [copiedCmd, setCopiedCmd] = React.useState<string | null>(null)

  async function copyCmd(cmd: string) {
    await navigator.clipboard.writeText(cmd)
    setCopiedCmd(cmd)
    window.setTimeout(() => setCopiedCmd(null), 1200)
  }

  if (!project) {
    return (
      <Panel title="Project" icon={<FolderGit2 className="size-4" />}>
        <p className="text-sm text-muted-foreground">Loading project…</p>
      </Panel>
    )
  }

  return (
    <Panel title="Project" icon={<FolderGit2 className="size-4" />}>
      <div className="grid gap-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mode
          </p>
          <p className="mt-1 font-medium">{project.mode}</p>
        </div>
        {project.root ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Root
            </p>
            <p className="mt-1 break-all font-mono text-xs leading-5">
              {project.root}
            </p>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Style
            </p>
            <p className="mt-1 font-medium">
              {project.config?.style ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Icons
            </p>
            <p className="mt-1 font-medium">
              {project.config?.iconLibrary ?? "—"}
            </p>
          </div>
        </div>
        {project.components.length > 0 ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Installed ({project.components.length})
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {project.components.join(", ")}
            </p>
          </div>
        ) : null}
        {project.packs.length > 0 ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Design packs ({project.packs.length})
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {project.packs.join(", ")}
            </p>
          </div>
        ) : null}
        <p className="rounded-lg bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
          {project.note}
        </p>
        {project.suggestedCli.length > 0 ? (
          <div className="grid gap-2">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Terminal className="size-3.5" />
              Suggested CLI
            </p>
            {project.suggestedCli.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => void copyCmd(cmd)}
                className="flex items-start justify-between gap-2 rounded-md border bg-background px-2.5 py-2 text-left font-mono text-[0.7rem] leading-5 hover:bg-muted/50"
              >
                <span className="break-all">{cmd}</span>
                {copiedCmd === cmd ? (
                  <Check className="mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <Copy className="mt-0.5 size-3.5 shrink-0 opacity-50" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </Panel>
  )
}

function Panel({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-muted-foreground">{icon}</span>
          {title}
        </h2>
        {action}
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}

function TokenGrid({
  tokens,
  defaults,
  overrides,
  disabled = false,
  onChange,
}: {
  tokens: readonly (readonly [string, string])[]
  defaults: VariableMap
  overrides: VariableMap
  disabled?: boolean
  onChange: (token: string, value: string) => void
}) {
  return (
    <div className="grid gap-3">
      {tokens.map(([token, label]) => {
        const value = overrides[token] ?? defaults[token] ?? ""
        return (
          <TokenControl
            key={token}
            token={token}
            label={label}
            value={value}
            disabled={disabled}
            onChange={(next) => onChange(token, next)}
          />
        )
      })}
    </div>
  )
}

function TokenControl({
  token,
  label,
  value,
  disabled,
  onChange,
}: {
  token: string
  label: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  const kind = classifyToken(token, value)
  const isComplexDimension =
    kind === "dimension" && /var\(|calc\(/i.test(value)

  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span className="flex items-center justify-between gap-3">
        {label}
        <code className="text-[0.6875rem] font-normal text-muted-foreground">
          {token}
        </code>
      </span>
      {kind === "color" && !disabled ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            aria-label={`${label} color`}
            value={cssColorToHex(value)}
            disabled={disabled}
            onChange={(event) =>
              onChange(hexToCssColor(event.target.value, value))
            }
            className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
          />
          <span
            className="size-9 shrink-0 rounded-md border border-border"
            style={{ background: value }}
            aria-hidden
          />
          <Input
            value={value}
            disabled={disabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onChange(event.target.value)
            }
            className="font-mono text-xs"
          />
        </div>
      ) : kind === "dimension" && !disabled && !isComplexDimension ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="any"
            value={parseDimension(value).amount}
            disabled={disabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const unit = parseDimension(value).unit
              onChange(formatDimension(event.target.value, unit))
            }}
            className="font-mono text-xs"
          />
          <select
            value={parseDimension(value).unit}
            disabled={disabled}
            onChange={(event) => {
              const amount = parseDimension(value).amount
              onChange(formatDimension(amount, event.target.value))
            }}
            className="h-9 rounded-md border border-input bg-background px-2 font-mono text-xs outline-none"
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="%">%</option>
          </select>
        </div>
      ) : (
        <Input
          value={value}
          disabled={disabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
          className="font-mono text-xs"
        />
      )}
    </label>
  )
}

function ResetButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button size="xs" variant="ghost" type="button" onClick={onClick}>
      <RotateCcw data-icon="inline-start" />
      {children}
    </Button>
  )
}

function buildCssExport(
  scopeClass: string,
  themeOverrides: VariableMap,
  styleOverrides: VariableMap
) {
  const sections: string[] = []

  if (Object.keys(themeOverrides).length) {
    sections.push(formatRule(":root", themeOverrides))
  }

  if (Object.keys(styleOverrides).length) {
    sections.push(formatRule(`.${scopeClass}`, styleOverrides))
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
