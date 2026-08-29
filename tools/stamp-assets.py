#!/usr/bin/env python3
"""Stamp every local asset link with a hash of that file's contents.

A browser that has already fetched a file will keep using its copy until the
cache expires, and the address is the only thing it looks at. So replacing a
picture, or a stylesheet, while the address stays the same means the visitor
carries on seeing the old one. That is not a visible failure: the page loads,
it is simply out of date, and it reads as though the change was never made.
It has already happened twice here, once with the stylesheet and once with a
project cover.

Adding the file's own hash to the URL means the address changes whenever the
file does, so a new version is always a new fetch, and an unchanged one still
comes from cache.

Run this after changing anything under assets/:

    python3 tools/stamp-assets.py

It rewrites the links on every page. Commit the result with the change.
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://marialandzn.com"

# Links are written three ways: relative from the home page, relative from a
# project page, and absolute in the link-preview tags. All three are stamped.
LINK = re.compile(
    r'(?P<prefix>"|\')'
    r'(?P<url>(?:' + re.escape(SITE) + r'/|\.\./|/)?'
    r'(?:assets/[^"\'?#]+|favicon\.ico))'
    r'(?:\?v=[0-9a-f]+)?'
    r'(?P<suffix>["\'])'
)


def short_hash(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


def resolve(url: str, page: pathlib.Path) -> pathlib.Path | None:
    """The file on disk that a link in this page points at."""
    if url.startswith(SITE + "/"):
        return ROOT / url[len(SITE) + 1:]
    if url.startswith("/"):
        return ROOT / url[1:]
    return page.parent / url


def main() -> int:
    pages = sorted(ROOT.glob("*.html")) + sorted(ROOT.glob("projects/*.html"))
    if not pages:
        print("no pages found", file=sys.stderr)
        return 1

    cache: dict[pathlib.Path, str] = {}
    missing: list[str] = []
    changed = 0
    stamped = 0

    for page in pages:
        text = original = page.read_text(encoding="utf-8")

        def stamp(m: re.Match) -> str:
            nonlocal stamped
            url = m.group("url")
            f = resolve(url, page)
            if f is None or not f.is_file():
                missing.append(f"{page.relative_to(ROOT)}: {url}")
                return m.group(0)
            f = f.resolve()
            if f not in cache:
                cache[f] = short_hash(f)
            stamped += 1
            return f'{m.group("prefix")}{url}?v={cache[f]}{m.group("suffix")}'

        text = LINK.sub(stamp, text)
        if text != original:
            page.write_text(text, encoding="utf-8")
            changed += 1

    if missing:
        print("links with no file behind them:", file=sys.stderr)
        for line in missing:
            print(f"  {line}", file=sys.stderr)

    print(f"{stamped} links stamped across {len(pages)} pages, {changed} rewritten")
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
