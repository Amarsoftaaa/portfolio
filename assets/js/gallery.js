/**
 * gallery.js
 * ──────────────────────────────────────────────────────────────
 * Isolated gallery logic — no global variable leaks.
 * Depends on GALLERY_DATA from gallery-data.js (load that first).
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Constants ──────────────────────────────────────────────── */
  var ITEMS_PER_PAGE  = 6;
  var SLIDE_INTERVAL  = 3000;
  var CATEGORY_LABELS = {
    'web-app': 'Web App',
    'design':  'Design',
    'mobile':  'Mobile'
  };

  /* ── State ──────────────────────────────────────────────────── */
  var activeFilter  = 'all';
  var currentPage   = 0;
  var filteredItems = [];
  var cycleTimers   = [];

  /* ── Lightbox state ─────────────────────────────────────────── */
  var lb            = null;   /* lightbox DOM element */
  var lbItem        = null;   /* current GALLERY_DATA item */
  var lbIdx         = 0;      /* current image index */

  /* ── DOM refs ───────────────────────────────────────────────── */
  var grid, filtersEl, dotsEl;

  /* ────────────────────────────────────────────────────────────
     INIT
  ──────────────────────────────────────────────────────────── */
  function init () {
    if (typeof GALLERY_DATA === 'undefined') {
      console.warn('[gallery.js] GALLERY_DATA not found — load gallery-data.js first.');
      return;
    }

    grid      = document.getElementById('galleryGrid');
    filtersEl = document.getElementById('galleryFilters');
    dotsEl    = document.getElementById('galleryDots');

    if (!grid || !filtersEl || !dotsEl) return;

    filtersEl.addEventListener('click', onFilterClick);
    buildLightbox();
    renderCards();
    observeSection();
  }

  /* ────────────────────────────────────────────────────────────
     FILTER
  ──────────────────────────────────────────────────────────── */
  function onFilterClick (e) {
    var btn = e.target.closest('.gallery-filter-btn');
    if (!btn) return;
    filtersEl.querySelectorAll('.gallery-filter-btn').forEach(function (b) {
      b.classList.remove('gallery-filter-active');
    });
    btn.classList.add('gallery-filter-active');
    activeFilter = btn.dataset.filter;
    currentPage  = 0;
    renderCards();
  }

  function getFiltered () {
    if (activeFilter === 'all') return GALLERY_DATA.slice();
    return GALLERY_DATA.filter(function (item) { return item.category === activeFilter; });
  }

  /* ────────────────────────────────────────────────────────────
     RENDER CARDS
  ──────────────────────────────────────────────────────────── */
  function renderCards () {
    stopAllCycles();
    grid.querySelectorAll('.gallery-card').forEach(function (card) {
      card.removeEventListener('mousemove',  onTiltMove);
      card.removeEventListener('mouseleave', onTiltLeave);
    });

    filteredItems = getFiltered();
    var start     = currentPage * ITEMS_PER_PAGE;
    var pageItems = filteredItems.slice(start, start + ITEMS_PER_PAGE);

    grid.innerHTML = '';

    if (pageItems.length === 0) {
      grid.innerHTML = '<p style="color:rgba(255,255,255,0.3);font-size:0.85rem;padding:2rem 0;">No items in this category yet.</p>';
      dotsEl.innerHTML = '';
      return;
    }

    pageItems.forEach(function (item) { grid.appendChild(createCard(item)); });

    requestAnimationFrame(function () {
      grid.querySelectorAll('.gallery-card').forEach(function (card, i) {
        setTimeout(function () { card.classList.add('gallery-visible'); }, i * 70);
      });
    });

    renderDots();
    bindTilt();
    bindImageCycling();
    bindCardClick();
  }

  /* ── Normalise imagePaths ───────────────────────────────────── */
  function getImagePaths (item) {
    if (Array.isArray(item.imagePaths) && item.imagePaths.length) return item.imagePaths.filter(Boolean);
    if (typeof item.imagePath === 'string' && item.imagePath)     return [item.imagePath];
    return [];
  }

  /* ── Build card element ─────────────────────────────────────── */
  function createCard (item) {
    var card  = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-title',    item.title);

    var paths = getImagePaths(item);
    var label = CATEGORY_LABELS[item.category] || item.category;
    var multi = paths.length > 1;

    var slidesHTML = paths.map(function (src, i) {
      return (
        '<div class="gallery-slide' + (i === 0 ? ' gallery-slide-active' : '') + '">' +
          '<img class="gallery-card-img"' +
               ' src="' + escAttr(src) + '"' +
               ' alt="' + escAttr(item.title) + (multi ? ' ' + (i + 1) : '') + '"' +
               ' loading="lazy"' +
               ' onerror="this.closest(\'.gallery-slide\').classList.add(\'gallery-slide-error\')">' +
        '</div>'
      );
    }).join('');

    var imgDotsHTML = multi
      ? '<div class="gallery-img-dots">' +
          paths.map(function (_, i) {
            return '<span class="gallery-img-dot' + (i === 0 ? ' gallery-img-dot-active' : '') + '"></span>';
          }).join('') +
        '</div>'
      : '';

    var fallbackHTML =
      '<div class="gallery-card-img-fallback">' +
        '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"' +
             ' stroke="rgba(255,255,255,0.15)" stroke-width="1.5">' +
          '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
          '<circle cx="8.5" cy="8.5" r="1.5"/>' +
          '<polyline points="21 15 16 10 5 21"/>' +
        '</svg>' +
      '</div>';

    card.innerHTML =
      '<div class="gallery-card-img-wrap">' +
        slidesHTML + imgDotsHTML + fallbackHTML +
      '</div>' +
      '<div class="gallery-card-body">' +
        '<div class="gallery-card-meta">' +
          '<span class="gallery-card-category">' + escHTML(label) + '</span>' +
          '<span class="gallery-card-arrow">&#8599;</span>' +
        '</div>' +
        '<h3 class="gallery-card-title">' + escHTML(item.title) + '</h3>' +
        '<p class="gallery-card-desc">'   + escHTML(item.description) + '</p>' +
        '<span class="gallery-card-cta">View Project &#8599;</span>' +
      '</div>' +
      '<div class="gallery-card-shine"></div>';

    return card;
  }

  /* ────────────────────────────────────────────────────────────
     CARD CLICK → open lightbox at the currently-visible slide
  ──────────────────────────────────────────────────────────── */
  function bindCardClick () {
    grid.querySelectorAll('.gallery-card').forEach(function (card, cardIdx) {
      card.addEventListener('click', function () {
        /* Find which GALLERY_DATA item this card corresponds to */
        var start = currentPage * ITEMS_PER_PAGE;
        var item  = filteredItems[start + cardIdx];
        if (!item) return;

        /* Find which slide is currently active */
        var slides     = card.querySelectorAll('.gallery-slide');
        var startIndex = 0;
        slides.forEach(function (slide, i) {
          if (slide.classList.contains('gallery-slide-active')) startIndex = i;
        });

        openLightbox(item, startIndex);
      });
    });
  }

  /* ────────────────────────────────────────────────────────────
     LIGHTBOX
  ──────────────────────────────────────────────────────────── */
  function buildLightbox () {
    lb = document.createElement('div');
    lb.className = 'gallery-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');

    lb.innerHTML =
      '<button class="gallery-lb-close" aria-label="Close">&#x2715;</button>' +
      '<div class="gallery-lb-frame">' +
        '<div class="gallery-lb-img-wrap">' +
          '<button class="gallery-lb-prev" aria-label="Previous image">&#8592;</button>' +
          '<img class="gallery-lb-img" src="" alt="">' +
          '<button class="gallery-lb-next" aria-label="Next image">&#8594;</button>' +
        '</div>' +
        '<div class="gallery-lb-bar">' +
          '<span class="gallery-lb-title"></span>' +
          '<div class="gallery-lb-dots"></div>' +
          '<span class="gallery-lb-counter"></span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(lb);

    /* Wire controls */
    lb.querySelector('.gallery-lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.gallery-lb-prev').addEventListener('click', function (e) { e.stopPropagation(); lbNavigate(-1); });
    lb.querySelector('.gallery-lb-next').addEventListener('click', function (e) { e.stopPropagation(); lbNavigate(+1); });

    /* Click backdrop to close */
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('gallery-lb-open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   lbNavigate(-1);
      if (e.key === 'ArrowRight')  lbNavigate(+1);
    });
  }

  function openLightbox (item, startIndex) {
    lbItem = item;
    lbIdx  = startIndex || 0;

    lbRenderImage();
    lbBuildDots();

    lb.classList.add('gallery-lb-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox () {
    lb.classList.remove('gallery-lb-open');
    document.body.style.overflow = '';
  }

  function lbNavigate (delta) {
    var paths = getImagePaths(lbItem);
    lbIdx = (lbIdx + delta + paths.length) % paths.length;
    lbRenderImage();
    lbUpdateDots();
  }

  function lbRenderImage () {
    var paths   = getImagePaths(lbItem);
    var imgEl   = lb.querySelector('.gallery-lb-img');
    var titleEl = lb.querySelector('.gallery-lb-title');
    var countEl = lb.querySelector('.gallery-lb-counter');
    var prevBtn = lb.querySelector('.gallery-lb-prev');
    var nextBtn = lb.querySelector('.gallery-lb-next');

    /* Fade out → swap src → fade in */
    imgEl.classList.add('gallery-lb-fading');
    setTimeout(function () {
      imgEl.src = escAttr(paths[lbIdx]);
      imgEl.alt = escAttr(lbItem.title) + (paths.length > 1 ? ' ' + (lbIdx + 1) : '');
      imgEl.classList.remove('gallery-lb-fading');
    }, 220);

    titleEl.textContent = lbItem.title;
    countEl.textContent = paths.length > 1 ? (lbIdx + 1) + ' / ' + paths.length : '';

    var single = paths.length <= 1;
    prevBtn.classList.toggle('gallery-lb-hidden', single);
    nextBtn.classList.toggle('gallery-lb-hidden', single);
  }

  function lbBuildDots () {
    var paths   = getImagePaths(lbItem);
    var dotsWrap = lb.querySelector('.gallery-lb-dots');
    dotsWrap.innerHTML = '';
    if (paths.length <= 1) return;

    paths.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'gallery-lb-dot' + (i === lbIdx ? ' gallery-lb-dot-active' : '');
      dot.setAttribute('aria-label', 'Image ' + (i + 1));
      dot.dataset.lbDot = i;
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        lbIdx = parseInt(e.currentTarget.dataset.lbDot, 10);
        lbRenderImage();
        lbUpdateDots();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function lbUpdateDots () {
    lb.querySelectorAll('.gallery-lb-dot').forEach(function (dot, i) {
      dot.classList.toggle('gallery-lb-dot-active', i === lbIdx);
    });
  }

  /* ────────────────────────────────────────────────────────────
     IMAGE CYCLING (card thumbnails)
  ──────────────────────────────────────────────────────────── */
  function bindImageCycling () {
    if (!window.IntersectionObserver) return;
    var cycleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) startCycle(entry.target);
        else                       stopCycle(entry.target);
      });
    }, { threshold: 0.3 });

    grid.querySelectorAll('.gallery-card').forEach(function (card) {
      if (card.querySelectorAll('.gallery-slide').length > 1) cycleObserver.observe(card);
    });
  }

  function startCycle (card) {
    if (card._galleryTimer) return;
    var slides = card.querySelectorAll('.gallery-slide');
    var dots   = card.querySelectorAll('.gallery-img-dot');
    if (slides.length < 2) return;
    var idx = 0;
    card._galleryTimer = setInterval(function () {
      slides[idx].classList.remove('gallery-slide-active');
      if (dots[idx]) dots[idx].classList.remove('gallery-img-dot-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('gallery-slide-active');
      if (dots[idx]) dots[idx].classList.add('gallery-img-dot-active');
    }, SLIDE_INTERVAL);
    cycleTimers.push({ card: card, timer: card._galleryTimer });
  }

  function stopCycle (card) {
    if (!card._galleryTimer) return;
    clearInterval(card._galleryTimer);
    card._galleryTimer = null;
  }

  function stopAllCycles () {
    cycleTimers.forEach(function (e) { clearInterval(e.timer); if (e.card) e.card._galleryTimer = null; });
    cycleTimers = [];
  }

  /* ────────────────────────────────────────────────────────────
     PAGE DOTS NAVIGATION
  ──────────────────────────────────────────────────────────── */
  function renderDots () {
    var totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    dotsEl.innerHTML = '';
    if (totalPages <= 1) return;
    for (var i = 0; i < totalPages; i++) {
      var dot = document.createElement('button');
      dot.className  = 'gallery-dot' + (i === currentPage ? ' gallery-dot-active' : '');
      dot.setAttribute('aria-label', 'Page ' + (i + 1));
      dot.dataset.page = i;
      dot.addEventListener('click', onDotClick);
      dotsEl.appendChild(dot);
    }
  }

  function onDotClick (e) {
    currentPage = parseInt(e.currentTarget.dataset.page, 10);
    renderCards();
    var section = document.getElementById('gallery');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ────────────────────────────────────────────────────────────
     3-D TILT
  ──────────────────────────────────────────────────────────── */
  function bindTilt () {
    grid.querySelectorAll('.gallery-card').forEach(function (card) {
      card.addEventListener('mousemove',  onTiltMove);
      card.addEventListener('mouseleave', onTiltLeave);
    });
  }

  function onTiltMove (e) {
    var card = e.currentTarget;
    var rect = card.getBoundingClientRect();
    var dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    var dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    var rotX = -dy * 9;
    var rotY =  dx * 9;
    card.style.transform = 'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(12px)';
    card.style.boxShadow = (-rotY * 2.5) + 'px ' + (rotX * 2.5) + 'px 40px rgba(0,0,0,0.55), 0 0 30px rgba(194,50,50,0.15)';
  }

  function onTiltLeave (e) {
    var card = e.currentTarget;
    card.style.transform = '';
    card.style.boxShadow = '';
  }

  /* ────────────────────────────────────────────────────────────
     SCROLL REVEAL
  ──────────────────────────────────────────────────────────── */
  function observeSection () {
    if (!window.IntersectionObserver) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('#gallery .reveal').forEach(function (el) { observer.observe(el); });
  }

  /* ────────────────────────────────────────────────────────────
     HELPERS
  ──────────────────────────────────────────────────────────── */
  function escHTML (str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function escAttr (str) { return String(str).replace(/"/g, '&quot;'); }

  /* ── Boot ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
