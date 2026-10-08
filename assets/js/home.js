/* Home hero: video slideshow.
   - Only the active slide's video is downloaded (posters cover the gap and are
     the first frame, so the swap is seamless).
   - No timers: the CSS progress bar drives the rotation via `animationend`,
     so pausing (hover, focus, hidden tab, pause button) is a single class.
   - Reduced motion / Save-Data: posters only, no auto-rotation. */
(function () {
  'use strict';

  var hero = document.querySelector('[data-hero]');
  if (!hero) {
    return;
  }

  var SLIDE_MS = 7000;
  var videos = Array.prototype.slice.call(hero.querySelectorAll('.hero-video'));
  var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
  var chapters = Array.prototype.slice.call(hero.querySelectorAll('.chapter'));
  var toggle = hero.querySelector('.hero-toggle');
  var region = hero.querySelector('.hero-slides');
  var interactive = [region, hero.querySelector('.hero-controls')];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var connection = navigator.connection || {};
  var lowData = Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType || '');
  var allowVideo = !reduceMotion && !lowData;

  var current = 0;
  var userPaused = false;
  var hovering = false;
  var focusInside = false;

  hero.style.setProperty('--slide-duration', SLIDE_MS + 'ms');

  function hydratePoster(video) {
    if (video && video.dataset.poster) {
      video.poster = video.dataset.poster;
      delete video.dataset.poster;
    }
  }

  function playVideo(video) {
    hydratePoster(video);
    if (!allowVideo || userPaused) {
      return;
    }
    if (video.dataset.src) {
      video.src = video.dataset.src;
      video.preload = 'auto';
      delete video.dataset.src;
    }
    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () { /* autoplay blocked: poster stays */ });
    }
  }

  function updatePausedState() {
    var paused = userPaused || hovering || focusInside || document.hidden;
    hero.classList.toggle('is-paused', paused);
    region.setAttribute('aria-live', paused || reduceMotion ? 'polite' : 'off');

    var active = videos[current];
    if (!active) {
      return;
    }
    if (userPaused || document.hidden) {
      active.pause();
    } else if (active.paused) {
      playVideo(active);
    }
  }

  function go(index) {
    var next = (index + slides.length) % slides.length;
    if (next === current) {
      return;
    }
    current = next;

    slides.forEach(function (slide, i) {
      var on = i === current;
      slide.classList.toggle('is-active', on);
      slide.inert = !on;
    });

    chapters.forEach(function (chapter, i) {
      if (i === current) {
        chapter.setAttribute('aria-current', 'true');
      } else {
        chapter.removeAttribute('aria-current');
      }
    });

    videos.forEach(function (video, i) {
      video.classList.toggle('is-active', i === current);
      if (i !== current) {
        video.pause();
      }
    });

    playVideo(videos[current]);
    hydratePoster(videos[(current + 1) % videos.length]);
  }

  /* ---- rotation driven by the progress bar ---- */

  hero.addEventListener('animationend', function (event) {
    if (event.animationName === 'chapter-progress') {
      go(current + 1);
    }
  });

  chapters.forEach(function (chapter, i) {
    chapter.addEventListener('click', function () {
      go(i);
    });
  });

  hero.querySelector('.chapters').addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    event.preventDefault();
    go(current + (event.key === 'ArrowRight' ? 1 : -1));
    chapters[current].focus();
  });

  /* ---- pausing ---- */

  interactive.forEach(function (el) {
    el.addEventListener('pointerenter', function (event) {
      if (event.pointerType === 'mouse') {
        hovering = true;
        updatePausedState();
      }
    });
    el.addEventListener('pointerleave', function () {
      hovering = false;
      updatePausedState();
    });
    el.addEventListener('focusin', function () {
      focusInside = true;
      updatePausedState();
    });
    el.addEventListener('focusout', function (event) {
      if (!el.contains(event.relatedTarget)) {
        focusInside = false;
        updatePausedState();
      }
    });
  });

  document.addEventListener('visibilitychange', updatePausedState);

  function syncToggleLabel() {
    var key = userPaused ? 'home.play' : 'home.pause';
    toggle.setAttribute('data-i18n-attr', 'aria-label:' + key);
    toggle.setAttribute('aria-label', window.Travel ? window.Travel.t(key) : '');
  }

  if (reduceMotion) {
    hero.classList.add('is-static');
    toggle.hidden = true;
  } else {
    toggle.addEventListener('click', function () {
      userPaused = !userPaused;
      toggle.setAttribute('aria-pressed', String(userPaused));
      syncToggleLabel();
      updatePausedState();
    });
  }

  /* ---- swipe (touch) ---- */

  var startX = null;
  var startY = null;
  hero.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'mouse') {
      startX = event.clientX;
      startY = event.clientY;
    }
  });
  hero.addEventListener('pointerup', function (event) {
    if (startX === null) {
      return;
    }
    var dx = event.clientX - startX;
    var dy = event.clientY - startY;
    startX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(current + (dx < 0 ? 1 : -1));
    }
  });
  hero.addEventListener('pointercancel', function () {
    startX = null;
  });

  /* ---- start ---- */

  playVideo(videos[0]);
  hydratePoster(videos[1]);
  updatePausedState();
})();
