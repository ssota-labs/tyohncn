#!/usr/bin/env python3
"""Replace IconPlaceholder with lucide-react icons in registry UI sources."""

from __future__ import annotations

import re
from pathlib import Path

UI_DIR = Path(__file__).resolve().parents[1] / "packages/registry/ui"
IMPORT_RE = re.compile(
    r'import \{ IconPlaceholder \} from "@/app/\(create\)/components/icon-placeholder"\n?'
)
PLACEHOLDER_RE = re.compile(r"<IconPlaceholder\b([^>]*?)/\s*>", re.S)


def transform(text: str) -> tuple[str, list[str]]:
    lucide_names = list(
        dict.fromkeys(re.findall(r'\blucide="([^"]+)"', text))
    )
    if not lucide_names:
        return text, []

    text = IMPORT_RE.sub("", text)
    lucide_import = (
        "import { " + ", ".join(lucide_names) + ' } from "lucide-react"\n'
    )

    if text.startswith('"use client"'):
        text = text.replace('"use client"\n', '"use client"\n\n' + lucide_import, 1)
    else:
        text = lucide_import + text

    def repl(match: re.Match[str]) -> str:
        attrs = match.group(1)
        lucide = re.search(r'\blucide="([^"]+)"', attrs)
        if not lucide:
            return match.group(0)
        name = lucide.group(1)
        cleaned = re.sub(
            r'\s+(lucide|tabler|hugeicons|phosphor|remixicon)="[^"]*"',
            "",
            attrs,
        )
        return f"<{name}{cleaned}/>"

    text = PLACEHOLDER_RE.sub(repl, text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text, lucide_names


def main() -> None:
    for path in sorted(UI_DIR.glob("*.tsx")):
        original = path.read_text()
        if "IconPlaceholder" not in original:
            continue
        updated, names = transform(original)
        path.write_text(updated)
        print(f"transformed {path.name}: {names}")


if __name__ == "__main__":
    main()
