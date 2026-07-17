"use client"

import * as React from "react"
import {
  Check,
  ChevronDown,
  Copy,
  Eye,
  FolderGit2,
  Moon,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Terminal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ICON_LIBRARY_OPTIONS,
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
import {
  RADII,
  presets,
  styleTokens,
  themeDarkDefaults,
  themeDefaults,
  themeTokenGroups,
  type PresetId,
  type RadiusName,
  type VariableMap,
} from "@/lib/studio-presets"

export type ProjectInfo = {
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

type StudioControlsProps = {
  project: ProjectInfo | null
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
  radius: RadiusName
  onRadiusChange: (radius: RadiusName) => void
  iconLibrary: IconLibraryName
  onIconLibraryChange: (id: IconLibraryName) => void
  dark: boolean
  onDarkChange: (dark: boolean) => void
  themeOverrides: VariableMap
  styleOverrides: VariableMap
  onThemeTokenChange: (token: string, value: string) => void
  onStyleTokenChange: (token: string, value: string) => void
  onResetTheme: () => void
  onResetStyle: () => void
  cssExport: string
}

export function StudioControls({
  project,
  presetId,
  onPresetChange,
  radius,
  onRadiusChange,
  iconLibrary,
  onIconLibraryChange,
  dark,
  onDarkChange,
  themeOverrides,
  styleOverrides,
  onThemeTokenChange,
  onStyleTokenChange,
  onResetTheme,
  onResetStyle,
  cssExport,
}: StudioControlsProps) {
  const preset = presets[presetId]
  const [copied, setCopied] = React.useState(false)
  const [controlTab, setControlTab] = React.useState<
    "design" | "theme" | "style" | "project"
  >("design")

  const radiusOptions = RADII.filter((item) => {
    if (preset.forcedRadius) return item.name === preset.forcedRadius
    if (preset.disallowRadius?.includes(item.name)) return false
    return true
  })

  async function copyCss() {
    await navigator.clipboard.writeText(cssExport)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="flex size-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">
            tyohn Studio
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            Style · theme · density
          </p>
        </div>
        <Button
          size="icon-sm"
          variant={dark ? "secondary" : "ghost"}
          type="button"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
          onClick={() => onDarkChange(!dark)}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <div className="flex shrink-0 gap-1 overflow-x-auto border-b px-2 py-2 no-scrollbar">
        {(
          [
            ["design", "Design"],
            ["theme", "Theme"],
            ["style", "Style"],
            ["project", "Project"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setControlTab(id)}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              controlTab === id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
        {controlTab === "design" ? (
          <div className="grid gap-4">
            <Panel title="Style" icon={<Palette className="size-4" />}>
              <div className="grid gap-2 text-sm font-medium">
                Active preset
                <OptionPopover
                  valueLabel={preset.label}
                  options={Object.entries(presets).map(([id, item]) => ({
                    value: id,
                    label: item.label,
                  }))}
                  value={presetId}
                  onChange={(value) => onPresetChange(value as PresetId)}
                />
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                {preset.description}
              </p>
              <p className="rounded-lg bg-muted px-3 py-2 text-[11px] leading-5 text-muted-foreground">
                Preview only. Confirm with{" "}
                <code className="text-[10px]">tyohncn apply --style</code>.
              </p>
            </Panel>

            <Panel title="Radius" icon={<SlidersHorizontal className="size-4" />}>
              <div className="grid grid-cols-2 gap-2">
                {radiusOptions.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onRadiusChange(item.name)}
                    className={cn(
                      "rounded-md border px-2.5 py-2 text-left text-xs transition-colors",
                      radius === item.name
                        ? "border-foreground bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {item.value || "theme default"}
                    </div>
                  </button>
                ))}
              </div>
              {preset.forcedRadius ? (
                <p className="text-[11px] text-muted-foreground">
                  This style forces radius {preset.forcedRadius}.
                </p>
              ) : null}
            </Panel>

            <Panel title="Icon library" icon={<Eye className="size-4" />}>
              <OptionPopover
                valueLabel={
                  ICON_LIBRARY_OPTIONS.find((item) => item.id === iconLibrary)
                    ?.label ?? iconLibrary
                }
                options={ICON_LIBRARY_OPTIONS.map((item) => ({
                  value: item.id,
                  label: item.label,
                }))}
                value={iconLibrary}
                onChange={(value) =>
                  onIconLibraryChange(value as IconLibraryName)
                }
              />
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
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="CSS export"
              icon={<Copy className="size-4" />}
              action={
                <Button size="xs" variant="outline" type="button" onClick={copyCss}>
                  {copied ? (
                    <>
                      <Check data-icon="inline-start" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy data-icon="inline-start" />
                      Copy
                    </>
                  )}
                </Button>
              }
            >
              <pre className="max-h-48 overflow-auto rounded-lg border bg-muted/40 p-3 text-[11px] leading-5">
                <code>{cssExport}</code>
              </pre>
            </Panel>
          </div>
        ) : null}

        {controlTab === "theme" ? (
          <Panel
            title="Theme tokens"
            icon={<SlidersHorizontal className="size-4" />}
            action={
              <ResetButton onClick={onResetTheme}>Reset</ResetButton>
            }
          >
            <div className="grid gap-4">
              {themeTokenGroups.map((group) => (
                <div key={group.id} className="grid gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {group.label}
                  </p>
                  <TokenGrid
                    tokens={group.tokens}
                    defaults={dark ? { ...themeDefaults, ...themeDarkDefaults } : themeDefaults}
                    overrides={themeOverrides}
                    onChange={onThemeTokenChange}
                  />
                </div>
              ))}
            </div>
          </Panel>
        ) : null}

        {controlTab === "style" ? (
          <Panel
            title="Style density"
            icon={<Eye className="size-4" />}
            action={
              <ResetButton onClick={onResetStyle}>Reset</ResetButton>
            }
          >
            <TokenGrid
              tokens={styleTokens}
              defaults={preset.styleDefaults}
              overrides={styleOverrides}
              disabled={!preset.editableStyle}
              onChange={onStyleTokenChange}
            />
            {!preset.editableStyle ? (
              <p className="rounded-lg bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
                Density variables are editable on *-vars / ssota packs. Apply
                packs still switch look via scoped CSS.
              </p>
            ) : null}
          </Panel>
        ) : null}

        {controlTab === "project" ? (
          <ProjectMetaPanel project={project} />
        ) : null}
      </div>
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
            <p className="mt-1 font-medium">{project.config?.style ?? "—"}</p>
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
    <section className="rounded-xl border bg-card p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
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

function OptionPopover({
  value,
  valueLabel,
  options,
  onChange,
}: {
  value: string
  valueLabel: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm font-normal outline-none transition focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        <span className="truncate">{valueLabel}</span>
        <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-[var(--anchor-width)] gap-0 border border-border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <div className="max-h-64 overflow-y-auto" role="listbox">
          {options.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  selected && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
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
    <div className="grid gap-1.5 text-xs font-medium">
      <span className="flex items-center justify-between gap-3">
        {label}
        <code className="text-[0.6875rem] font-normal text-muted-foreground">
          {token}
        </code>
      </span>
      {kind === "color" && !disabled ? (
        <ColorTokenControl
          label={label}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
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
    </div>
  )
}

function ColorTokenControl({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const hex = cssColorToHex(value)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        aria-label={`${label} color`}
        title={`${label} color`}
        className="size-9 shrink-0 rounded-md border border-border shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: value }}
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="color"
        tabIndex={-1}
        aria-hidden
        value={hex}
        disabled={disabled}
        onChange={(event) =>
          onChange(hexToCssColor(event.target.value, value))
        }
        className="pointer-events-none absolute size-0 opacity-0"
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
      <RotateCcw data-icon="inline-start" className="size-3" />
      {children}
    </Button>
  )
}
