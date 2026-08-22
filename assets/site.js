/* ============================================================
   Maria Lan — shared behaviour for every page.
   Plain vanilla JS, no libraries.

   Each block guards for its own markup, so the same file can be
   loaded by index.html and by every project page.
============================================================ */

/* ------------------------------------------------------------
   CAROUSEL (home page only)
   The strip is shuffled on every load, then duplicated so the CSS
   marquee — which travels -50% — loops with no visible seam.
------------------------------------------------------------ */
const track = document.getElementById('carouselTrack');
if (track) {
  const items = Array.from(track.children);

  // Every slot declares its own proportions in the markup, so orientation
  // is known before a single picture has loaded.
  const ratioOf = (el) => {
    const raw = el.style.aspectRatio || getComputedStyle(el).aspectRatio || '';
    const pair = raw.match(/([\d.]+)\s*\/\s*([\d.]+)/);
    if (pair) return parseFloat(pair[1]) / parseFloat(pair[2]);
    const single = parseFloat(raw);
    if (single > 0) return single;
    const img = el.querySelector('img');
    return img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 1;
  };

  // Fisher-Yates: every ordering equally likely.
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Group by orientation. Mixed at random, the strip jumped between a
  // narrow and a wide slot on almost every picture; grouped, it changes
  // width twice a lap. Order stays random inside each group, and which
  // group leads is random too, so no two visits look the same.
  const tall = [], wide = [];
  items.forEach((el) => (ratioOf(el) < 1 ? tall : wide).push(el));
  const ordered = (Math.random() < 0.5
    ? [shuffle(tall), shuffle(wide)]
    : [shuffle(wide), shuffle(tall)]).flat();

  // Re-appending a node already in the DOM moves it, so this reorders in place.
  ordered.forEach((node) => track.appendChild(node));

  // Second identical half, so the wrap point is invisible.
  ordered.forEach((node) => {
    const clone = node.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Pace the loop by distance rather than a fixed duration. With a fixed
  // duration the strip would race as more pictures are added, since it
  // still has to cover the whole track in the same time.
  const PX_PER_SECOND = 38;
  const setPace = () => {
    const half = track.scrollWidth / 2;
    if (!half) return;
    const secs = (half / PX_PER_SECOND).toFixed(1) + 's';
    if (track.style.animationDuration !== secs) track.style.animationDuration = secs;
  };
  setPace();
  window.addEventListener('resize', setPace, { passive: true });
  // Belt and braces: if a slot's size settles later than expected, remeasure.
  if ('ResizeObserver' in window) new ResizeObserver(setPace).observe(track);
}

/* ------------------------------------------------------------
   GALLERY (project pages) — the layout alternates full-width and
   half-width items. With an odd count the last half-width item
   would sit alone in its row, so promote it to full width.
   This is what lets a gallery hold anywhere from 5 to 7 pieces.
------------------------------------------------------------ */
document.querySelectorAll('.gallery').forEach((gallery) => {
  const items = Array.from(gallery.children);
  if (!items.length) return;

  // Walk the grid counting columns used. A half-width item that opens a row
  // with no half-width item behind it has nothing to share the row with, so
  // widen it. Checking what follows, rather than only the very last item,
  // matters because a gallery can hold a lone half anywhere in the sequence:
  // pulling two pictures out of a project left exactly that, and the old rule
  // saw only one of the two holes it made.
  const isFull = (el) => el.classList.contains('media--full');
  let col = 0;
  items.forEach((el, i) => {
    if (!isFull(el) && col % 2 === 0 && !(items[i + 1] && !isFull(items[i + 1]))) {
      el.classList.add('media--full');
      col += 2;
      return;
    }
    col += isFull(el) ? 2 : 1;
  });
});

/* ------------------------------------------------------------
   LIGHTBOX — built from scratch, handles images and video.
   Opens on carousel images and on gallery media; closes on
   backdrop click, the close button, or Escape.
------------------------------------------------------------ */
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const stage = document.getElementById('lightboxStage');
  const closeBtn = document.getElementById('lightboxClose');

  let opener = null;   // where to put focus back when it closes

  const openLightbox = (source) => {
    opener = source;
    stage.replaceChildren(); // clear whatever was shown before

    let node;
    if (source.tagName === 'VIDEO') {
      // Rebuild the video with controls; the short inline clips have none.
      node = document.createElement('video');
      node.src = source.currentSrc || source.src;
      node.controls = true;
      node.autoplay = true;
      node.playsInline = true;
      // Carry the source's own looping rather than forcing it. The interface
      // clips are a few silent seconds and should loop; the promo film runs
      // for nearly two minutes with sound, and restarting it would be rude.
      node.loop = source.loop;
      node.muted = source.muted;
    } else {
      node = document.createElement('img');
      node.src = source.currentSrc || source.src;
      node.alt = source.alt || '';
    }

    node.className = 'lightbox__media';
    stage.appendChild(node);

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // lock scroll while open
    closeBtn.focus();   // so Escape and the close button are reachable at once
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    stage.replaceChildren(); // also stops any video playback
    // Put focus back where it came from, so a keyboard visitor carries on
    // from the picture they opened rather than from the top of the page.
    if (opener && opener.isConnected) opener.focus();
    opener = null;
  };

  const OPENERS = '.carousel__item img, .media > img, .media > video';

  // An <img> takes no focus of its own, so until now the lightbox could
  // only be reached with a mouse. Announce each one as a button and put it
  // in the tab order. The carousel clones are aria-hidden duplicates, so
  // they stay out of it — otherwise every picture would be tabbed twice.
  document.querySelectorAll(OPENERS).forEach((el) => {
    if (el.closest('[aria-hidden="true"]')) return;
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    const what = el.alt || 'this piece';
    el.setAttribute('aria-label', `Open ${what} larger`);
  });

  // One delegated listener covers carousel images and gallery media,
  // including the carousel clones created above.
  document.addEventListener('click', (e) => {
    const source = e.target.closest(OPENERS);
    if (!source) return;
    e.preventDefault();
    openLightbox(source);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const source = e.target.closest && e.target.closest(OPENERS);
    if (!source) return;
    e.preventDefault();   // stops Space from scrolling the page
    openLightbox(source);
  });

  // Clicking the backdrop (but not the media itself) closes it.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

/* ------------------------------------------------------------
   SCROLL REVEAL — gentle fade-in for .reveal elements
------------------------------------------------------------ */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}
