import Link from "next/link"

const concepts = [
  {
    title: "Packages & naming",
    summary:
      "pnpm workspaces, Turborepo, and the @tyohn/* scope for registry, Studio, and CLI.",
    href: "https://github.com/ssota-labs/tyohncn/blob/main/docs/MONOREPO.md#packages--naming",
    items: [
      "@tyohn/registry — Base UI + style packs + theme",
      "@tyohn/studio — component catalog and token inspectors",
      "tyohncn — CLI published as npx tyohncn",
    ],
  },
  {
    title: "Monorepo layout",
    summary:
      "apps/studio and apps/docs sit beside packages/cli and packages/registry.",
    href: "https://github.com/ssota-labs/tyohncn/blob/main/docs/MONOREPO.md#monorepo-layout",
    items: [
      "apps/studio — Next.js catalog (port 3001)",
      "apps/docs — this site (port 3002)",
      "packages/registry — shipped components and CSS",
      ".agents/skills — Next.js and shadcn skills (skills.sh)",
    ],
  },
  {
    title: "ssota boundary",
    summary:
      "tyohncn owns infra; ssota owns the product preset and Design Lab consumer.",
    href: "https://github.com/ssota-labs/tyohncn/blob/main/docs/MONOREPO.md#ssota-boundary",
    items: [
      "Fork CLI, registry, style packs, Studio → tyohncn",
      "style-ssota preset + product UI → ssota consumer",
      "Pattern source: Theme / Style / Component layers",
    ],
  },
  {
    title: "Theme vs style",
    summary:
      "Semantic colors live in theme.css; density and chrome live in scoped style packs.",
    href: "https://github.com/ssota-labs/tyohncn/blob/main/docs/THEME_VS_STYLE.md",
    items: [
      "Theme — --primary, --radius, bridged via @theme inline",
      "Style — .style-mira / .style-vega / .style-ssota scopes",
      "Vars packs — editable --cn-* hooks for Studio inspectors",
    ],
  },
] as const

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 md:px-8 md:py-14">
      <header className="flex flex-col gap-4 border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          tyohncn / docs
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Monorepo concepts
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          Thin docs surface for the tyohncn toolchain. Full playbooks live in the
          repository{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            docs/
          </code>{" "}
          folder; Studio is the live catalog.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="http://localhost:3001"
            className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Open Studio
          </Link>
          <a
            href="https://github.com/ssota-labs/tyohncn/tree/main/docs"
            className="inline-flex h-9 items-center rounded-md border border-border bg-card px-4 text-sm font-medium transition hover:bg-muted"
          >
            GitHub docs folder
          </a>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {concepts.map((concept) => (
          <article
            key={concept.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {concept.title}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {concept.summary}
              </p>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-sm leading-6">
              {concept.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={concept.href}
              className="mt-4 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              Read in MONOREPO.md
            </a>
          </article>
        ))}
      </div>
    </main>
  )
}
