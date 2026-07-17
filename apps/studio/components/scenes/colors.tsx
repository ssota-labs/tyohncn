"use client"

const SWATCHES: Array<[string, string]> = [
  ["--background", "Background"],
  ["--foreground", "Foreground"],
  ["--card", "Card"],
  ["--primary", "Primary"],
  ["--secondary", "Secondary"],
  ["--muted", "Muted"],
  ["--accent", "Accent"],
  ["--destructive", "Destructive"],
  ["--border", "Border"],
  ["--input", "Input"],
  ["--ring", "Ring"],
]

/** Semantic color swatches — reads vars from iframe body (DesignSystemProvider). */
export function ColorsScene() {
  return (
    <div className="grid max-w-3xl gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Color palette</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Semantic tokens on the iframe body (portals stay in scope).
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {SWATCHES.map(([token, label]) => (
          <div
            key={token}
            className="overflow-hidden rounded-xl border bg-card text-card-foreground"
          >
            <div
              className="h-20 border-b"
              style={{ background: `var(${token})` }}
            />
            <div className="grid gap-0.5 p-3 text-sm">
              <span className="font-medium">{label}</span>
              <code className="truncate text-xs text-muted-foreground">
                {token}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
