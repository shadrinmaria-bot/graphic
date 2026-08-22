#!/usr/bin/env python3
"""Stamp the stylesheet and script links with a hash of their contents.

A browser that has already fetched assets/styles.css will keep using its
copy until the cache expires, so a layout change can land in the HTML while
the rules that make it work are still the old ones. That is not a visible
failure: the page renders, just wrongly, and it looks like a design fault.

Adding the file's own hash to the URL means the address changes whenever
the file does, so a new version is always a new fetch, and an unchanged one
still comes from cache.

Run this after editing assets/styles.css or assets/site.js:

    python3 tools/stamp-assets.py
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ["assets/styles.css", "assets/site.js"]


def short_hash(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


def main() -> int:
    stamps = {}
    for rel in ASSETS:
        f = ROOT / rel
        if not f.exists():
            print(f"missing {rel}", file=sys.stderr)
            return 1
        stamps[pathlib.PurePath(rel).name] = short_hash(f)

    pages = sorted(ROOT.glob("*.html")) + sorted(ROOT.glob("projects/*.html"))
    changed = 0
    for page in pages:
        text = original = page.read_text(encoding="utf-8")
        for name, digest in stamps.items():
            # Matches the file with or without an existing ?v= stamp.
            text = re.sub(
                rf'((?:\.\./)?assets/{re.escape(name)})(\?v=[0-9a-f]+)?"',
                rf'\g<1>?v={digest}"',
                text,
            )
        if text != original:
            page.write_text(text, encoding="utf-8")
            changed += 1

    for name, digest in stamps.items():
        print(f"{name}  v={digest}")
    print(f"{changed} of {len(pages)} pages updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
