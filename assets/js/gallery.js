/* Gallery: responsive masonry (CSS columns), destination filters and a
   native <dialog> lightbox with keyboard + swipe navigation. */
(function () {
  'use strict';

  var grid = document.querySelector('[data-gallery]');
  var filtersEl = document.querySelector('[data-gallery-filters]');
  var dialog = document.querySelector('[data-lightbox]');
  if (!grid || !window.Travel) {
    return;
  }

  var T = window.Travel;
  var items = Array.isArray(window.travelGalleryImages) ? window.travelGalleryImages : [];

  var FOLDERS = [
    { id: 'usa', trip: 'trip.usa' },
    { id: 'thailandia', trip: 'trip.thailand' },
    { id: 'cile', trip: 'trip.bolivia' },
    { id: 'china', trip: 'trip.china' },
    { id: 'scotland', trip: 'trip.scotland' },
    { id: 'sri_lanka', trip: 'trip.srilanka' }
  ];

  var REGION = {
    cile: { it: 'Paesaggi tra Bolivia e Cile', en: 'Landscapes across Bolivia and Chile' },
    china: { it: 'Scatto urbano e culturale in Cina', en: 'Urban and cultural moment in China' },
    thailandia: { it: 'Atmosfere e natura in Thailandia', en: 'Atmosphere and nature in Thailand' },
    usa: { it: 'On the road negli Stati Uniti', en: 'On the road in the United States' },
    scotland: { it: 'Highlands e castelli in Scozia', en: 'Highlands and castles in Scotland' },
    sri_lanka: { it: 'Templi e oceano in Sri Lanka', en: 'Temples and ocean in Sri Lanka' }
  };

  var SIZES = '(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 300px';

  function folderOf(src) {
    var parts = src.split('/');
    return parts[parts.length - 2];
  }

  // Number photos per destination ("… 3") rather than globally ("… 87").
  var perFolderIndex = {};
  var entries = items.map(function (item) {
    var folder = folderOf(item.src);
    perFolderIndex[folder] = (perFolderIndex[folder] || 0) + 1;
    return { src: item.src, folder: folder, n: perFolderIndex[folder] };
  });

  function labelFor(entry) {
    var lang = T.getLanguage();
    var region = REGION[entry.folder];
    return (region ? region[lang] : T.t('gallery.moment')) + ' ' + entry.n;
  }

  /* ---------------------------------------------------------------- grid */

  var fragment = document.createDocumentFragment();
  entries.forEach(function (entry, index) {
    var link = document.createElement('a');
    link.className = 'g-item';
    link.href = T.imageUrl(entry.src, 1600);
    link.setAttribute('data-index', String(index));
    link.setAttribute('data-folder', entry.folder);

    var frame = document.createElement('span');
    frame.className = 'g-frame';
    var meta = T.mediaEntry(entry.src);
    if (meta) {
      frame.style.aspectRatio = meta[1] + ' / ' + meta[2];
    }

    // The first row is above the fold: fetch it eagerly.
    var img = T.image(entry.src, { sizes: SIZES, eager: index < 4 });
    frame.appendChild(img);
    link.appendChild(frame);

    var caption = document.createElement('span');
    caption.className = 'g-caption';
    link.appendChild(caption);

    entry.link = link;
    entry.img = img;
    entry.caption = caption;
    fragment.appendChild(link);
  });
  grid.appendChild(fragment);

  function applyLabels() {
    entries.forEach(function (entry) {
      var label = labelFor(entry);
      entry.img.alt = label;
      entry.caption.textContent = label;
    });
  }

  /* ------------------------------------------------------------- filters */

  var activeFilter = 'all';

  function renderFilters() {
    filtersEl.textContent = '';
    var options = [{ id: 'all', label: T.t('gallery.all'), count: entries.length }].concat(
      FOLDERS.map(function (folder) {
        return {
          id: folder.id,
          label: T.t(folder.trip),
          count: entries.filter(function (e) { return e.folder === folder.id; }).length
        };
      }).filter(function (option) { return option.count > 0; })
    );

    options.forEach(function (option) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.setAttribute('aria-pressed', String(option.id === activeFilter));
      chip.setAttribute('data-filter', option.id);
      chip.textContent = option.label + ' ';
      var count = document.createElement('span');
      count.className = 'chip-count';
      count.textContent = option.count;
      chip.appendChild(count);
      filtersEl.appendChild(chip);
    });
  }

  filtersEl.addEventListener('click', function (event) {
    var chip = event.target.closest('[data-filter]');
    if (!chip) {
      return;
    }
    activeFilter = chip.getAttribute('data-filter');
    filtersEl.querySelectorAll('[data-filter]').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el === chip));
    });
    entries.forEach(function (entry) {
      entry.link.hidden = activeFilter !== 'all' && entry.folder !== activeFilter;
    });
  });

  /* ------------------------------------------------------------ lightbox */

  if (!dialog || typeof dialog.showModal !== 'function') {
    applyLabels();
    renderFilters();
    return; // Links still open the high-res image directly.
  }

  var lbImg = dialog.querySelector('.lb-img');
  var lbLabel = dialog.querySelector('.lb-label');
  var lbCount = dialog.querySelector('.lb-count');
  var visible = [];
  var position = 0;
  var lastTrigger = null;
  var preloaded = {};

  function preload(url) {
    if (!preloaded[url]) {
      preloaded[url] = new Image();
      preloaded[url].decoding = 'async';
      preloaded[url].src = url;
    }
    return preloaded[url];
  }

  function show(pos) {
    position = (pos + visible.length) % visible.length;
    var entry = visible[position];
    var hiRes = T.imageUrl(entry.src, 1600);
    var meta = T.mediaEntry(entry.src);

    // Show the already-downloaded thumbnail instantly, then swap in high-res.
    lbImg.src = entry.img.currentSrc || entry.img.src;
    if (meta) {
      lbImg.width = meta[1];
      lbImg.height = meta[2];
    }
    lbImg.alt = labelFor(entry);
    lbLabel.textContent = labelFor(entry);
    lbCount.textContent = (position + 1) + ' / ' + visible.length;

    var full = preload(hiRes);
    var swap = function () {
      if (visible[position] === entry) {
        lbImg.src = hiRes;
      }
    };
    if (full.complete) {
      swap();
    } else {
      full.addEventListener('load', swap, { once: true });
    }

    // Warm neighbours so prev/next feel instant.
    [1, -1].forEach(function (offset) {
      var neighbour = visible[(position + offset + visible.length) % visible.length];
      preload(T.imageUrl(neighbour.src, 1600));
    });
  }

  function open(entry) {
    visible = entries.filter(function (e) { return !e.link.hidden; });
    lastTrigger = entry.link;
    dialog.showModal();
    show(visible.indexOf(entry));
  }

  grid.addEventListener('click', function (event) {
    var link = event.target.closest('.g-item');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    event.preventDefault();
    open(entries[Number(link.getAttribute('data-index'))]);
  });

  dialog.addEventListener('click', function (event) {
    var action = event.target.closest('[data-lb]');
    if (action) {
      var kind = action.getAttribute('data-lb');
      if (kind === 'close') {
        dialog.close();
      } else {
        show(position + (kind === 'next' ? 1 : -1));
      }
      return;
    }
    // Click on the backdrop/empty stage closes; clicks on the photo don't.
    if (event.target === dialog || event.target.classList.contains('lb-stage')) {
      dialog.close();
    }
  });

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      show(position + 1);
    } else if (event.key === 'ArrowLeft') {
      show(position - 1);
    }
  });

  dialog.addEventListener('close', function () {
    lbImg.removeAttribute('src');
    if (lastTrigger) {
      lastTrigger.focus({ preventScroll: true });
    }
  });

  var swipeX = null;
  dialog.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'mouse') {
      swipeX = event.clientX;
    }
  });
  dialog.addEventListener('pointerup', function (event) {
    if (swipeX === null) {
      return;
    }
    var dx = event.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 50) {
      show(position + (dx < 0 ? 1 : -1));
    }
  });

  /* ---------------------------------------------------------------- i18n */

  applyLabels();
  renderFilters();

  document.addEventListener('languagechange', function () {
    applyLabels();
    renderFilters();
    if (dialog.open && visible[position]) {
      lbLabel.textContent = labelFor(visible[position]);
    }
  });
})();
