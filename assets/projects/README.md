# Where to put project photos

One folder per project. Upload photos into the matching folder:

| # | Project              | Folder                              | Page                            |
|---|----------------------|-------------------------------------|---------------------------------|
| 1 | Honeest              | `assets/projects/honeest/`          | `projects/honeest.html`          |
| 2 | T2Med                | `assets/projects/t2med/`            | `projects/t2med.html`            |
| 3 | דומובוי עולה לארץ    | `assets/projects/domovoy/`          | `projects/domovoy.html`          |
| 4 | צ'יק צ'אק            | `assets/projects/chik-chak/`        | `projects/chik-chak.html`        |
| 5 | Kengo Kuma           | `assets/projects/kengo-kuma/`       | `projects/kengo-kuma.html`       |
| 6 | הדלת הפתוחה          | `assets/projects/hadelet-haptucha/` | `projects/hadelet-haptucha.html` |

## Naming

Number the files. `01` is the cover — it appears on the home page card
*and* at the top of the project page. `02` onward fill the gallery.

    01.jpg   <- cover
    02.jpg   03.jpg   04.jpg   05.jpg   06.jpg   07.jpg   <- gallery

Six gallery images fit the current layout; five or seven also work.
Any format is fine (jpg, png, webp) — the `.svg` files in each folder
now are placeholders, so delete them once your photos are in.

Filenames without spaces are easiest. If you upload with other names,
just say so and they will be wired up.

## Carousel

`assets/carousel/` — the strip under the intro. Any number of images,
square works best. Currently seven placeholders.

## Categories and years — already set

| # | Project              | Category                     | Year |
|---|----------------------|------------------------------|------|
| 1 | Honeest              | Branding & Identity          | 2026 |
| 2 | T2Med                | Branding & Identity          | 2025 |
| 3 | דומובוי עולה לארץ    | Illustration & Storytelling  | 2026 |
| 4 | צ'יק צ'אק            | Branding & Identity          | 2026 |
| 5 | Kengo Kuma           | Editorial & Print            | 2024 |
| 6 | הדלת הפתוחה          | Design                       | 2025 |

The category shows on the home page card and in the project page's
detail row, alongside the year.

## Cover and header can differ

`01` (or `cover.jpg`) is the card on the home page. If the header at the
top of the project page should show something else, add a `hero.jpg`
next to it and the page will use that instead. Domovoy does this: the
card is the crocheted Rusik, the header is the printed book.

The header frame is 16 by 9, which is what the covers are shot at, so a
cover lands in it almost whole. It used to be a viewport-relative height
that came out at 2.32 and cut about a quarter off the top and bottom of
every project.

## Adding to a project that already has photos

Carry on from the last number. Honeest currently ends at `07.jpg`, so
new packaging and label shots go in as `08.jpg`, `09.jpg`, `10.jpg`
and so on. Nothing needs renaming, and the gallery grows to fit: it
alternates full and half width rows on its own, and a lone item at
the end is widened automatically.

Process shots earn their place here. A label at three sizes, a
rejected direction, a printed sheet before it was cut: those show the
thinking, which finals cannot.

## Still to fill in

Only the writing: the one-line lead under each title, and the
description paragraphs. Both are marked with `[ ... ]` on the page.

## Video

Name it in the numbering like everything else (`07.mp4`). Upload the file
you have and it will be re-encoded: the ChikChak promo came in at 13.1 MB
and ships at 8.0 MB with no visible difference, mostly by bringing the
audio down from 317 kb/s, which is far more than a voiceover needs.

Short silent clips of an interface autoplay on a loop with no controls.
Anything with sound, or longer than about twenty seconds, gets controls
and a poster frame instead and waits for the viewer. Only the file header
is fetched until somebody presses play, so a long film costs nothing to
the people who scroll past it.

## Cut-out artwork (labels, die lines)

Artwork with a transparent background must keep its alpha: flattening it
to JPG paints a background behind the cut-out shape. Save those as WebP
instead of PNG. WebP keeps transparency and is far smaller: the ten
Honeest label and die line files came to 7.1 MB as PNG and 1.6 MB as
WebP, with no difference visible at the size the gallery renders them.

Every browser in use has supported WebP since 2020. The original PNGs
stay in the repository history if they are ever needed back.

## Export sizes

Measured from the live layout — this is the most any slot ever shows,
on a 2560px screen:

| Slot                | Shown at | Export at        |
|---------------------|----------|------------------|
| Carousel item       | 270 px   | 1800 px long side |
| Home page card      | 769 px   | 2000 px long side |
| Gallery, full width | 1068 px  | 2000 px long side |
| Gallery, half width | 518 px   | 2000 px long side |
| Project cover       | full width | 2400 px wide    |

So: **1800-2000 px on the long side**, JPG at quality 88. That lands
around 200-600 KB per file.

The carousel strip only shows 270 px, but clicking opens the lightbox
at up to 90vw / 88vh — about 1700 px on a large screen. That is why
carousel art needs full size too, not a thumbnail.

Exporting larger does not make anything look better — the browser
just scales it back down to the sizes above on every page load. It
only makes the page slower.

GitHub's web uploader rejects files over 25 MB. A full-resolution PNG
export easily passes that; the same picture as a 2000 px JPG will not.
PNG is the usual culprit — use JPG for photographs, and keep PNG only
where transparency is needed (like the p1–p5 sprigs).

## Kengo Kuma: waiting on photos

The folder and the page exist, and both hold placeholders: a flat
`cover.webp` for the home page card and a flat `hero.jpg` for the header.
Upload the brochure and poster shots into
`assets/projects/kengo-kuma/` and they replace those.

Worth having, in this order: the brochure open on a spread, the cover,
the poster whole, and any spread where the type does something the
others do not. Two tall or square ones will be lifted up beside the
writing, as on the other pages.

Until the pictures are there the page shows the write-up full width
rather than leaving an empty half-page beside it.
