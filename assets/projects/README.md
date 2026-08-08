# Where to put project photos

One folder per project. Upload photos into the matching folder:

| # | Project              | Folder                              | Page                            |
|---|----------------------|-------------------------------------|---------------------------------|
| 1 | דומובוי עולה לארץ    | `assets/projects/domovoy/`          | `projects/domovoy.html`          |
| 2 | Honeest              | `assets/projects/honeest/`          | `projects/honeest.html`          |
| 3 | T2Med                | `assets/projects/t2med/`            | `projects/t2med.html`            |
| 4 | הדלת הפתוחה          | `assets/projects/hadelet-haptucha/` | `projects/hadelet-haptucha.html` |
| 5 | צ'יק צ'אק            | `assets/projects/chik-chak/`        | `projects/chik-chak.html`        |

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
| 1 | דומובוי עולה לארץ    | Illustration & Storytelling  | 2026 |
| 2 | Honeest              | Branding & Identity          | 2026 |
| 3 | T2Med                | Branding & Identity          | 2025 |
| 4 | הדלת הפתוחה          | Design                       | 2025 |
| 5 | צ'יק צ'אק            | Branding & Identity          | 2026 |

The category shows on the home page card and in the project page's
detail row, alongside the year.

## Still to fill in

Only the writing: the one-line lead under each title, and the
description paragraphs. Both are marked with `[ ... ]` on the page.

## Export sizes

Measured from the live layout — this is the most any slot ever shows,
on a 2560px screen:

| Slot                | Shown at | Export at        |
|---------------------|----------|------------------|
| Carousel item       | 270 px   | **800 px** square |
| Home page card      | 769 px   | 2000 px long side |
| Gallery, full width | 1068 px  | 2000 px long side |
| Gallery, half width | 518 px   | 2000 px long side |
| Project cover       | full width | 2400 px wide    |

So: **800 px for the carousel, 2000 px for everything else**, JPG at
quality 85. That lands around 100 KB and 500 KB per file.

Exporting larger does not make anything look better — the browser
just scales it back down to the sizes above on every page load. It
only makes the page slower.

GitHub's web uploader rejects files over 25 MB. A full-resolution PNG
export easily passes that; the same picture as a 2000 px JPG will not.
PNG is the usual culprit — use JPG for photographs, and keep PNG only
where transparency is needed (like the p1–p5 sprigs).
