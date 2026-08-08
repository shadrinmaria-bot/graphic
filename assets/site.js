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

  // Fisher-Yates: every ordering equally likely. Re-appending a node
  // that is already in the DOM moves it, so this reorders in place.
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  items.forEach((node) => track.appendChild(node));

  // Second identical half, so the wrap point is invisible.
  items.forEach((node) => {
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
}

/* ------------------------------------------------------------
   GALLERY (project pages) — the layout alternates full-width and
   half-width items. With an odd count the last half-width item
   would sit alone in its row, so promote it to full width.
   This is what lets a gallery hold anywhere from 5 to 7 pieces.
------------------------------------------------------------ */
document.querySelectorAll('.gallery').forEach((gallery) => {
  const items = Array.from(gallery.children);
  const last = items[items.length - 1];
  const prev = items[items.length - 2];
  const orphaned = last
    && !last.classList.contains('media--full')
    && (!prev || prev.classList.contains('media--full'));

  if (orphaned) last.classList.add('media--full');
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
