/* ============================================================
   Maria Lan — shared behaviour for every page.
   Plain vanilla JS, no libraries.

   Each block guards for its own markup, so the same file can be
   loaded by index.html and by every project page.
============================================================ */

/* ------------------------------------------------------------
   NAV — solid background once scrolled past the top
------------------------------------------------------------ */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

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

  // Walk the grid counting columns used. A half-width item that lands on a
  // fresh row with nothing to follow it would sit alone, so widen it.
  // Counting beats checking the previous item: that only recognised one
  // particular pattern, and galleries here mix full and half freely.
  let col = 0;
  items.forEach((el, i) => {
    const isFull = el.classList.contains('media--full');
    if (i === items.length - 1 && !isFull && col % 2 === 0) {
      el.classList.add('media--full');
      return;
    }
    col += isFull ? 2 : 1;
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

  const openLightbox = (source) => {
    stage.replaceChildren(); // clear whatever was shown before

    let node;
    if (source.tagName === 'VIDEO') {
      // Rebuild the video with controls; inline gallery clips have none.
      node = document.createElement('video');
      node.src = source.currentSrc || source.src;
      node.controls = true;
      node.autoplay = true;
      node.loop = true;
      node.playsInline = true;
    } else {
      node = document.createElement('img');
      node.src = source.currentSrc || source.src;
      node.alt = source.alt || '';
    }

    node.className = 'lightbox__media';
    stage.appendChild(node);

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // lock scroll while open
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    stage.replaceChildren(); // also stops any video playback
  };

  // One delegated listener covers carousel images and gallery media,
  // including the carousel clones created above.
  document.addEventListener('click', (e) => {
    const source = e.target.closest(
      '.carousel__item img, .media > img, .media > video'
    );
    if (!source) return;
    e.preventDefault();
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
