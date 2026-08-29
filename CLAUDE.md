# House rules for this site

## Typography

**Never use long dashes in anything a visitor can see.** No em dash (—),
en dash (–) or horizontal bar (―) in page copy, headings, `alt` text,
`<title>`, or `meta description`. This holds even when supplied text
contains them: replace or drop them before the text goes on the page.

Use instead:
- a colon, for an explanation that follows
- parentheses or commas, for an aside inside a sentence
- a middle dot `·`, to separate parts of a title
- a plain hyphen, only inside compound words (`lived-in`)

Code comments are exempt, as nobody reads those on the site.

## Files

Filenames must be lowercase ASCII with no spaces. Hebrew, Cyrillic and
spaces all need percent-encoding in a URL and break on some hosts.
Rename on the way in.

When listing files through git, pass `-c core.quotePath=false`. Without
it, non-ASCII names come back escaped and wrapped in quotes, so a filter
like `name.endswith(".png")` skips them without a word. That is how a
transparent PNG got missed and flattened onto a background.

Check for an alpha channel before converting any PNG. Flattening one to
JPEG paints a background behind cut-out artwork.

Images: 1800-2000 px on the long side, JPG q88 (q90 for flat colour with
hard edges). GitHub's web uploader rejects anything over 25 MB, and git
itself refuses files over 100 MB.

## Cache

Every local asset is linked with a hash of its own contents
(`assets/styles.css?v=cab524e5`, `cover.webp?v=dedf742e`). The address is
the only thing a browser looks at, so replacing a file while its address
stays the same means the visitor carries on seeing the old one. Nothing
breaks visibly: the page loads, it is simply out of date, and it reads as
though the change was never made.

That has already cost two rounds here. A stylesheet edit came back as a
two-column layout rendering like a broken one-column one, against rules a
browser had cached. Later a project cover was replaced and the old one
kept appearing, because a picture's URL was not stamped at all.

**After changing anything under `assets/`, pictures included, run:**

    python3 tools/stamp-assets.py

It rewrites the links on every page: stylesheet, script, images, video,
posters, favicons, the CVs and the link-preview cards. Running it twice
changes nothing, so run it whenever in doubt. Commit the result with the
change. It exits non-zero and names any link with no file behind it, so
it doubles as a check for broken references.

Uploading a replacement under the same filename is fine and is the normal
way to do it. Just run the stamper afterwards.

## Hebrew

Inria Serif and DM Sans carry no Hebrew; Frank Ruhl Libre and Heebo pick
those glyphs up through the font stack. Hebrew titles use `dir="auto"`,
Hebrew paragraphs `lang="he" dir="rtl"`. Where a Hebrew line sits inside
the otherwise left-to-right layout, give it `text-align: left` so it
stays on the page margin instead of drifting to the far edge.
