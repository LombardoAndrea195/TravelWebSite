/* Site theme: Mediterraneo (default), Rivista, Foresta.
   Loaded synchronously in <head> so the saved theme applies before first paint
   (no flash). The picker buttons live in each page's footer.
   ?tema=<id> in the URL also works, handy for sharing a preview. */
(function () {
  'use strict';

  var THEMES = ['mediterraneo', 'rivista', 'foresta'];
  var KEY = 'travel-theme';
  var root = document.documentElement;

  function stored() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (error) {
      return null;
    }
  }

  function apply(id, persist) {
    root.setAttribute('data-theme', id);
    if (!persist) return;
    try {
      window.localStorage.setItem(KEY, id);
    } catch (error) { /* private mode: theme just won't persist */ }
  }

  var fromUrl = new URLSearchParams(window.location.search).get('tema');
  if (THEMES.indexOf(fromUrl) !== -1) {
    apply(fromUrl, true);
  } else {
    apply(THEMES.indexOf(stored()) !== -1 ? stored() : THEMES[0], false);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.theme-picker-btn');

    function sync() {
      var current = root.getAttribute('data-theme');
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.dataset.themeId === current));
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(btn.dataset.themeId, true);
        sync();
      });
    });
    sync();
  });
})();
