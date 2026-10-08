/* Vlog page: renders a trip diary from vlog-data.js.
   - responsive images via media-manifest.js (hero eager, days lazy)
   - one-shot reveal on scroll (IntersectionObserver, transform/opacity only)
   - Leaflet (self-hosted) is only downloaded when the map approaches the viewport */
(function () {
  'use strict';

  var root = document.querySelector('[data-vlog]');
  var data = window.travelVlogData;
  if (!root || !data || !window.Travel) {
    return;
  }

  var T = window.Travel;
  var TRIP_ORDER = ['America', 'Thailandia', 'Bolivia', 'China', 'Scotland', 'SriLanka'];
  var COVERS = {
    America: 'assets/img/usa/IMG_1018.JPG',
    Thailandia: 'assets/img/thailandia/PXL_20231230_104316392.jpg',
    Bolivia: 'assets/img/cile/IMG-20230817-WA0078.jpg',
    China: 'assets/img/china/20240803_130024-5f3f.jpg',
    Scotland: 'assets/img/scotland/20200731_093809.jpg',
    SriLanka: 'assets/img/sri_lanka/PXL_20250825_014654984.MP.jpg'
  };
  var LEAFLET = 'assets/vendor/leaflet-1.9.4/';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var trip = new URLSearchParams(window.location.search).get('trip');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var els = {
    heroMedia: root.querySelector('[data-hero-media]'),
    title: root.querySelector('[data-trip-title]'),
    coords: root.querySelector('[data-trip-coords]'),
    facts: root.querySelector('[data-trip-facts]'),
    days: root.querySelector('[data-days]'),
    mapSection: root.querySelector('[data-map-section]'),
    mapTitle: root.querySelector('[data-map-title]'),
    map: root.querySelector('[data-map]'),
    stops: root.querySelector('[data-stops]'),
    next: root.querySelector('[data-next-trip]')
  };

  function dictionary() {
    return data[T.getLanguage()] || data.it;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function keywordPattern(dict) {
    var base = T.getLanguage() === 'en'
      ? ['road trip', 'sunset', 'sunrise', 'street food', 'temple', 'market', 'beach', 'snorkeling', 'safari']
      : ['road trip', 'tramonto', 'alba', 'street food', 'tempio', 'mercato', 'spiaggia', 'snorkeling', 'safari'];
    var places = ((dict.maps[trip] || {}).points || []).map(function (p) { return p.name; });
    var words = Array.from(new Set(base.concat(places))).sort(function (a, b) { return b.length - a.length; });
    // Whole words only, so "alba" doesn't light up inside "albatros".
    return new RegExp('(^|[^\\p{L}])(' + words.map(escapeRegExp).join('|') + ')(?=$|[^\\p{L}])', 'giu');
  }

  function highlight(text, pattern) {
    return escapeHtml(text).replace(pattern, '$1<mark class="kw">$2</mark>');
  }

  /* ---------------------------------------------------------------- hero */

  var heroImg = null;

  function renderHero(dict, days) {
    var name = dict.labels.tripNames[trip] || trip;
    els.title.textContent = name;

    // GPS-style coordinates of the first stop next to the kicker.
    var first = ((dict.maps[trip] || {}).points || [])[0];
    if (first && els.coords) {
      els.coords.textContent = Math.abs(first.lat).toFixed(2) + '°' + (first.lat >= 0 ? 'N' : 'S') + ' ' +
        Math.abs(first.lng).toFixed(2) + '°' + (first.lng >= 0 ? 'E' : 'W');
    }
    document.title = name + ' — ' + T.t('title.vlog');

    var stops = new Set(((dict.maps[trip] || {}).points || []).map(function (p) { return p.name; })).size;
    els.facts.innerHTML = '';
    [T.t('vlog.days', { n: days.length }), stops ? T.t('vlog.stops', { n: stops }) : null]
      .filter(Boolean)
      .forEach(function (fact) {
        var span = document.createElement('span');
        span.textContent = fact;
        els.facts.appendChild(span);
      });

    if (stops) {
      var mapLink = document.createElement('a');
      mapLink.href = '#mappa';
      mapLink.className = 'trip-map-link';
      mapLink.innerHTML = '<span>' + escapeHtml(T.t('vlog.toMap')) + '</span>' + ARROW;
      els.facts.appendChild(mapLink);
    }

    if (!heroImg) {
      heroImg = T.image(COVERS[trip] || days[0].immagine, {
        alt: '',
        eager: true,
        sizes: '(max-width: 1240px) 100vw, 1240px'
      });
      heroImg.classList.remove('fade-in'); // LCP element: paint immediately.
      els.heroMedia.appendChild(heroImg);
    }
  }

  /* ---------------------------------------------------------------- days */

  var revealObserver = null;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
  }

  var dayImages = [];

  function renderDays(dict, days) {
    var pattern = keywordPattern(dict);
    var name = dict.labels.tripNames[trip] || trip;
    var firstRender = dayImages.length === 0;
    var fragment = document.createDocumentFragment();

    days.forEach(function (day, i) {
      var li = document.createElement('li');
      li.className = 'day';
      if (revealObserver) {
        li.classList.add('reveal');
      }

      var num = document.createElement('p');
      num.className = 'day-num';
      num.innerHTML = '<span class="day-label">' + escapeHtml(dict.labels.days) + '</span>' +
        '<span class="display day-n">' + String(day.giorni).padStart(2, '0') + '</span>';

      var media = document.createElement('figure');
      media.className = 'day-media media-frame';
      var img = firstRender
        ? T.image(day.immagine, { sizes: '(max-width: 860px) 100vw, 560px' })
        : dayImages[i];
      img.alt = dict.labels.days + ' ' + day.giorni + ' — ' + name + ': ' + day.titolo;
      dayImages[i] = img;
      media.appendChild(img);

      var body = document.createElement('div');
      body.className = 'day-body';
      body.innerHTML =
        '<h2 class="display day-title">' + escapeHtml(day.titolo) + '</h2>' +
        '<ul class="day-list">' + day.testo.map(function (line) {
          return '<li>' + highlight(line, pattern) + '</li>';
        }).join('') + '</ul>';

      li.appendChild(num);
      li.appendChild(media);
      li.appendChild(body);
      fragment.appendChild(li);
    });

    els.days.textContent = '';
    els.days.appendChild(fragment);

    if (revealObserver) {
      els.days.querySelectorAll('.reveal').forEach(function (li) {
        if (!firstRender) {
          li.classList.add('is-visible'); // language switch: no replay
        } else {
          revealObserver.observe(li);
        }
      });
    }
  }

  /* ----------------------------------------------------------------- map */

  var leafletPromise = null;
  var map = null;
  var markers = [];

  function loadLeaflet() {
    if (window.L) {
      return Promise.resolve(window.L);
    }
    if (!leafletPromise) {
      leafletPromise = new Promise(function (resolve, reject) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = LEAFLET + 'leaflet.css';
        document.head.appendChild(css);

        var script = document.createElement('script');
        script.src = LEAFLET + 'leaflet.js';
        script.onload = function () { resolve(window.L); };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    return leafletPromise;
  }

  function uniquePoints(points) {
    // The Sri Lanka loop ends where it starts: keep the line, number stops once.
    var seen = {};
    return points.filter(function (p) {
      var key = p.lat + ',' + p.lng;
      if (seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  function renderStops(points) {
    els.stops.textContent = '';
    uniquePoints(points).forEach(function (point, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stop';
      btn.innerHTML = '<span class="stop-n">' + (i + 1) + '</span><span>' + escapeHtml(point.name) + '</span>';
      btn.addEventListener('click', function () {
        if (map && markers[i]) {
          map.flyTo(markers[i].getLatLng(), Math.max(map.getZoom(), 8), { duration: reduceMotion ? 0 : 0.8 });
          markers[i].openPopup();
        }
      });
      li.appendChild(btn);
      els.stops.appendChild(li);
    });
  }

  function buildMap(L, points) {
    if (map) {
      map.remove();
      markers = [];
    }
    els.map.textContent = '';
    map = L.map(els.map, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var line = points.map(function (p) { return [p.lat, p.lng]; });
    L.polyline(line, { color: '#5fd4c4', weight: 3, opacity: 0.9, dashArray: '6 8' }).addTo(map);

    uniquePoints(points).forEach(function (point, i) {
      var marker = L.marker([point.lat, point.lng], {
        title: point.name,
        icon: L.divIcon({ className: 'map-pin', html: '<span>' + (i + 1) + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] })
      }).addTo(map);
      marker.bindPopup(escapeHtml(point.name));
      markers.push(marker);
    });

    map.fitBounds(line, { padding: [32, 32] });
  }

  function renderMap(dict) {
    var config = dict.maps[trip];
    if (!config || !config.points || !config.points.length) {
      els.mapSection.hidden = true;
      return;
    }
    els.mapSection.hidden = false;
    els.mapTitle.textContent = dict.labels.mapTitle;
    renderStops(config.points);

    if (map) {
      return; // Already built: names don't change between languages.
    }

    var start = function () {
      loadLeaflet().then(function (L) {
        buildMap(L, config.points);
      }).catch(function () {
        els.mapSection.hidden = true;
      });
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          io.disconnect();
          start();
        }
      }, { rootMargin: '600px 0px' });
      io.observe(els.mapSection);
    } else {
      start();
    }
  }

  /* ----------------------------------------------------------- next trip */

  function renderNext(dict) {
    var index = TRIP_ORDER.indexOf(trip);
    if (index === -1) {
      els.next.hidden = true;
      return;
    }
    var nextTrip = TRIP_ORDER[(index + 1) % TRIP_ORDER.length];
    els.next.hidden = false;
    els.next.setAttribute('aria-label', T.t('vlog.next'));
    els.next.innerHTML =
      '<a class="next-link" href="vlog.html?trip=' + encodeURIComponent(nextTrip) + '">' +
      '<span class="kicker">' + escapeHtml(T.t('vlog.next')) + '</span>' +
      '<span class="display next-name">' + escapeHtml(dict.labels.tripNames[nextTrip] || nextTrip) + ARROW + '</span>' +
      '</a>';
  }

  /* --------------------------------------------------------------- empty */

  function renderEmpty(dict) {
    root.querySelector('[data-trip-hero]').hidden = true;
    els.mapSection.hidden = true;
    els.next.hidden = true;
    els.days.innerHTML =
      '<li class="empty-state">' +
      '<h1 class="display">' + escapeHtml(dict.labels.emptyTitle) + '</h1>' +
      '<p class="lede">' + escapeHtml(dict.labels.emptyText) + '</p>' +
      '<div class="empty-links">' + TRIP_ORDER.map(function (key) {
        return '<a class="chip" href="vlog.html?trip=' + key + '">' + escapeHtml(dict.labels.tripNames[key]) + '</a>';
      }).join('') + '</div></li>';
  }

  /* -------------------------------------------------------------- render */

  function render() {
    var dict = dictionary();
    var days = dict.trips[trip];
    if (!days || !days.length) {
      renderEmpty(dict);
      return;
    }
    renderHero(dict, days);
    renderDays(dict, days);
    renderMap(dict);
    renderNext(dict);
  }

  document.addEventListener('languagechange', render);
  render();
})();
