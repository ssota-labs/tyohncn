/**
 * Token inspector helpers — typed controls (color / dimension / text).
 */

export type TokenKind = "color" | "dimension" | "text"

const COLOR_TOKEN_RE =
  /^--(?:primary|secondary|muted|accent|destructive|background|foreground|card|popover|border|input|ring|sidebar)(?:-|$)/

const DIMENSION_TOKEN_RE =
  /(?:height|width|size|padding|radius|spacing|gap|font-size|line-height|ring-width)$/i

export function classifyToken(name: string, value: string): TokenKind {
  if (COLOR_TOKEN_RE.test(name)) return "color"
  if (
    /^(?:#|oklch\(|oklab\(|hsl\(|hsla\(|rgb\(|rgba\()/i.test(value.trim())
  ) {
    return "color"
  }
  if (DIMENSION_TOKEN_RE.test(name)) return "dimension"
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value.trim())) return "dimension"
  return "text"
}

export function parseDimension(
  value: string
): { amount: string; unit: string } {
  const m = value.trim().match(/^(-?\d*\.?\d+)\s*(px|rem|em|%)?$/i)
  if (!m) return { amount: value.replace(/[^\d.-]/g, "") || "0", unit: "rem" }
  return { amount: m[1]!, unit: (m[2] || "rem").toLowerCase() }
}

export function formatDimension(amount: string, unit: string): string {
  const n = Number(amount)
  if (Number.isNaN(n)) return `${amount}${unit}`
  return `${n}${unit}`
}

/** Best-effort convert CSS color → #rrggbb for <input type="color">. */
export function cssColorToHex(value: string): string {
  const v = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase()
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1]!
    const g = v[2]!
    const b = v[3]!
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }

  // Use canvas in browser; Node fallback for SSR
  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#000000"
        ctx.fillStyle = v
        const computed = ctx.fillStyle
        if (/^#[0-9a-fA-F]{6}$/i.test(computed)) return computed.toLowerCase()
        const rgb = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (rgb) {
          const hex = (n: string) =>
            Number(n).toString(16).padStart(2, "0")
          return `#${hex(rgb[1]!)}${hex(rgb[2]!)}${hex(rgb[3]!)}`
        }
      }
    } catch {
      // fall through
    }
  }

  // Rough oklch → sRGB for picker when canvas unavailable
  const oklch = v.match(
    /oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)/i
  )
  if (oklch) {
    let L = Number(oklch[1])
    if (L > 1) L = L / 100
    const C = Number(oklch[2])
    const H = Number(oklch[3])
    return oklchToApproxHex(L, C, H)
  }

  return "#000000"
}

function oklchToApproxHex(L: number, C: number, H: number): string {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)
  // OKLab → linear sRGB (simplified)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  const toSrgb = (c: number) => {
    const x = Math.min(1, Math.max(0, c))
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
  }
  const hex = (n: number) =>
    Math.round(toSrgb(n) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${hex(r)}${hex(g)}${hex(bl)}`
}

/** Prefer keeping oklch when editing via hex picker if original was oklch. */
export function hexToCssColor(hex: string, previous: string): string {
  const h = hex.startsWith("#") ? hex : `#${hex}`
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return previous
  if (/^oklch\(/i.test(previous.trim())) {
    // Convert hex → approximate oklch for theme tokens
    const r = parseInt(h.slice(1, 3), 16) / 255
    const g = parseInt(h.slice(3, 5), 16) / 255
    const b = parseInt(h.slice(5, 7), 16) / 255
    const toLin = (c: number) =>
      c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    const rl = toLin(r)
    const gl = toLin(g)
    const bl = toLin(b)
    const l =
      0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl
    const m =
      0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl
    const s =
      0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl
    const l_ = Math.cbrt(l)
    const m_ = Math.cbrt(m)
    const s_ = Math.cbrt(s)
    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
    const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
    const C = Math.sqrt(a * a + b2 * b2)
    let H = (Math.atan2(b2, a) * 180) / Math.PI
    if (H < 0) H += 360
    return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`
  }
  return h.toLowerCase()
}
