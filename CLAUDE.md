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

## Hebrew

Inria Serif and DM Sans carry no Hebrew; Frank Ruhl Libre and Heebo pick
those glyphs up through the font stack. Hebrew titles use `dir="auto"`,
Hebrew paragraphs `lang="he" dir="rtl"`. Where a Hebrew line sits inside
the otherwise left-to-right layout, give it `text-align: left` so it
stays on the page margin instead of drifting to the far edge.
