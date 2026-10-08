/* Explore carousel: native scroll-snap + small enhancements
   (chips, arrows, counter, keyboard and mouse drag). ~2 KB instead of Swiper. */
(function () {
  'use strict';

  var carousel = document.querySelector('[data-carousel]');
  if (!carousel) {
    return;
  }

  var track = carousel.querySelector('.carousel-track');
  var cards = Array.prototype.slice.call(track.children);
  var chips = Array.prototype.slice.call(document.querySelectorAll('.explore-chips .chip'));
  var chipRail = document.querySelector('.explore-chips');
  var prevBtn = document.querySelector('.round-btn[data-dir="-1"]');
  var nextBtn = document.querySelector('.round-btn[data-dir="1"]');
  var countEl = document.querySelector('[data-count]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var behavior = reduceMotion ? 'auto' : 'smooth';

  var current = -1;
  var stepSize = 1;

  function measure() {
    stepSize = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  }

  function clamp(index) {
    return Math.max(0, Math.min(cards.length - 1, index));
  }

  function scrollToIndex(index) {
    track.scrollTo({ left: clamp(index) * stepSize, behavior: behavior });
  }

  function setCurrent(index) {
    if (index === current) {
      return;
    }
    current = index;

    chips.forEach(function (chip, i) {
      chip.setAttribute('aria-pressed', String(i === current));
    });
    if (countEl) {
      countEl.textContent = String(current + 1).padStart(2, '0');
    }
    if (prevBtn) {
      prevBtn.disabled = current === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = current === cards.length - 1;
    }

    // Keep the active chip visible on the phone chip rail.
    if (chipRail && chipRail.scrollWidth > chipRail.clientWidth && chips[current]) {
      chipRail.scrollTo({
        left: chips[current].offsetLeft - chips[0].offsetLeft - 16,
        behavior: behavior
      });
    }
  }

  // State only (no animation) — read one value per frame at most.
  var ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      setCurrent(clamp(Math.round(track.scrollLeft / stepSize)));
    });
  }, { passive: true });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      scrollToIndex(Number(chip.getAttribute('data-target')));
    });
  });

  [prevBtn, nextBtn].forEach(function (btn) {
    if (btn) {
      btn.addEventListener('click', function () {
        scrollToIndex(current + Number(btn.getAttribute('data-dir')));
      });
    }
  });

  track.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToIndex(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  /* ---- mouse drag (touch & trackpads already scroll natively) ---- */

  var drag = null;
  var suppressClick = false;

  track.addEventListener('dragstart', function (event) {
    event.preventDefault();
  });

  track.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }
    drag = { x: event.clientX, left: track.scrollLeft, moved: false };
  });

  window.addEventListener('pointermove', function (event) {
    if (!drag) {
      return;
    }
    var dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) {
      drag.moved = true;
      carousel.classList.add('is-dragging');
    }
    if (drag.moved) {
      track.scrollLeft = drag.left - dx;
    }
  });

  window.addEventListener('pointerup', function () {
    if (!drag) {
      return;
    }
    var moved = drag.moved;
    var startLeft = drag.left;
    drag = null;
    if (!moved) {
      return;
    }
    suppressClick = true;
    window.setTimeout(function () {
      suppressClick = false;
    }, 0);
    carousel.classList.remove('is-dragging');
    // Small flick bias: a 15% drag is enough to move to the next card.
    var delta = (track.scrollLeft - startLeft) / stepSize;
    var base = Math.round(startLeft / stepSize);
    scrollToIndex(base + (Math.abs(delta) > 0.15 ? Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta))) : 0));
  });

  track.addEventListener('click', function (event) {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  /* ---- init ---- */

  if ('ResizeObserver' in window) {
    new ResizeObserver(measure).observe(track);
  } else {
    window.addEventListener('resize', measure);
  }
  measure();
  setCurrent(0);
})();
