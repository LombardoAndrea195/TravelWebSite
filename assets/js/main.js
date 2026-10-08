/* ==========================================================================
   Travel — shared runtime (loaded with `defer` on every page)
   - declarative i18n: data-i18n / data-i18n-html / data-i18n-attr
   - header scroll state, mobile menu
   - responsive image helper backed by media-manifest.js
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'travel-language';
  var root = document.documentElement;
  root.classList.add('js');

  /* ---------------------------------------------------------------- i18n */

  var dict = {
    it: {
      'skip': 'Vai al contenuto',
      'lang.label': 'Lingua',
      'menu.open': 'Apri menu',
      'menu.close': 'Chiudi menu',
      'nav.label': 'Navigazione principale',
      'nav.home': 'Home',
      'nav.about': 'Chi sono',
      'nav.explore': 'Esplora',
      'nav.gallery': 'Galleria',
      'nav.contact': 'Contatti',
      'footer.quote': 'Viaggiare è la più potente forma di <em>psicoterapia</em>.',
      'footer.copy': '© Andrea Lombardo — foto e video originali dai miei viaggi.',
      'footer.privacy': 'Privacy',
      'theme.label': 'Tema del sito',
      'theme.title': 'Tema',
      'theme.mediterraneo': 'Mediterraneo',
      'theme.rivista': 'Rivista',
      'theme.foresta': 'Foresta',

      'trip.usa': 'USA',
      'trip.thailand': 'Thailandia',
      'trip.bolivia': 'Bolivia & Cile',
      'trip.china': 'Cina',
      'trip.scotland': 'Scozia',
      'trip.srilanka': 'Sri Lanka',

      'title.index': 'Travel | Diario di viaggio di Andrea Lombardo',
      'title.about': 'Chi sono | Travel',
      'title.explore': 'Esplora i viaggi | Travel',
      'title.gallery': 'Galleria | Travel',
      'title.contact': 'Contatti | Travel',
      'title.privacy': 'Privacy Policy | Travel',
      'title.vlog': 'Diario di viaggio | Travel',

      'home.kicker': 'Diario di viaggio · 6 destinazioni',
      'home.cta': 'Guarda il viaggio',
      'home.chapters': 'Scegli il viaggio',
      'home.pause': 'Metti in pausa lo slideshow',
      'home.play': 'Riprendi lo slideshow',
      'home.s1.title': 'America <em>West Coast</em>',
      'home.s1.text': 'Tra deserti infiniti, città leggendarie e alcuni dei paesaggi più iconici del West americano.',
      'home.s2.title': 'Thailandia',
      'home.s2.text': 'Un sogno thailandese: spiagge da cartolina, animali esotici, giochi di luce e templi millenari.',
      'home.s3.title': 'Bolivia <em>&amp;</em> Cile',
      'home.s3.text': 'Salar de Uyuni: hai mai visto un posto dove cielo e terra si uniscono all’orizzonte?',
      'home.s4.title': 'Cina',
      'home.s4.text': 'Una cultura lontana dal nostro mondo occidentale, capace di sorprendere con la gentilezza della sua gente e le sue bellezze nascoste.',
      'home.s5.title': 'Scozia',
      'home.s5.text': 'Highlands selvagge, castelli avvolti nella nebbia e paesaggi mozzafiato: la Scozia ti aspetta.',
      'home.s6.title': 'Sri Lanka',
      'home.s6.text': 'Oceano tropicale, templi antichi, treni tra le piantagioni di tè e safari nella natura selvaggia.',
      'home.social': 'Social',

      'explore.kicker': 'Sei viaggi, un diario',
      'explore.title': 'I miei <em>viaggi</em>',
      'explore.quote': 'Viaggia per perderti, per ritrovarti, per lasciare qualcosa di te e riportare una parte che non conoscevi.',
      'explore.jump': 'Vai alla destinazione',
      'explore.open': 'Apri il diario',
      'explore.prev': 'Viaggio precedente',
      'explore.next': 'Viaggio successivo',
      'explore.help': 'Scorri, trascina o usa le frecce per navigare.',
      'explore.meta.usa': 'Ago 2022 · 12 giorni',
      'explore.meta.thailand': 'Dic 2023 · 15 giorni',
      'explore.meta.bolivia': 'Ago 2023 · 12 giorni',
      'explore.meta.china': 'Ago 2024 · 15 giorni',
      'explore.meta.scotland': 'Lug 2020 · 9 giorni',
      'explore.meta.srilanka': 'Ago 2025 · 12 giorni',

      'gallery.kicker': 'Archivio fotografico',
      'gallery.title': 'La <em>galleria</em>',
      'gallery.lede': 'Una selezione di scatti dai viaggi. Tocca una foto per aprirla a schermo intero.',
      'gallery.filter': 'Filtra per destinazione',
      'gallery.all': 'Tutte',
      'gallery.close': 'Chiudi',
      'gallery.prev': 'Foto precedente',
      'gallery.next': 'Foto successiva',
      'gallery.moment': 'Momento di viaggio',

      'vlog.kicker': 'Diario di viaggio',
      'vlog.back': 'Tutti i viaggi',
      'vlog.toMap': 'Vai alla mappa',
      'vlog.days': '{n} giorni',
      'vlog.stops': '{n} tappe',
      'vlog.next': 'Prossimo viaggio',
      'vlog.mapLoading': 'Caricamento mappa…',

      'about.kicker': 'Travel creator · Roma',
      'about.title': 'Chi <em>sono</em>',
      'about.quote': 'Quando la bussola interiore è sballata, prenota un viaggio: ti aiuterà a ritrovare la tua strada.',
      'about.intro': 'Sono Andrea Lombardo, classe ’95, romano. Amo la tecnologia quanto i viaggi: scoprire nuove culture e vivere esperienze uniche.',
      'about.body': 'Ho scelto di unire queste due passioni — <strong>tecnologia e viaggi</strong> — dando vita a questo spazio: un diario digitale fatto di itinerari reali, foto e video girati sul campo.',
      'about.caption': 'Da Roma al mondo, un viaggio alla volta.',
      'about.pillar1': 'Itinerari reali e onesti',
      'about.pillar2': 'Consigli pratici sul campo',
      'about.pillar3': 'Foto e video originali',
      'about.metric1': 'Destinazioni raccontate',
      'about.metric2': 'Scatti in galleria',
      'about.metric3': 'Viaggi in programma',
      'about.ctaExplore': 'Esplora i viaggi',
      'about.ctaContact': 'Scrivimi',

      'contact.kicker': 'Contatti',
      'contact.title': 'Benvenuti nel mio <em>travel blog</em>',
      'contact.p1': 'Questo travel blog nasce dalla mia passione per i viaggi e dal desiderio di condividere le esperienze straordinarie che ho vissuto in giro per il mondo. È un diario digitale che ho creato per me stesso e per chi condivide la stessa passione per l’esplorazione e la scoperta.',
      'contact.p2': 'Qui troverai consigli, riflessioni e momenti catturati durante le mie avventure. Ogni viaggio è un’opportunità per immergersi in culture diverse, esplorare luoghi mozzafiato e incontrare persone straordinarie.',
      'contact.p3': 'Le pagine del blog sono piene di itinerari dettagliati, recensioni sincere e consigli pratici per aiutarti a pianificare il tuo prossimo viaggio, insieme a immagini e video presi dal mio profilo Instagram.',
      'contact.p4': 'Spero che questo spazio possa ispirarti e alimentare la tua voglia di esplorare il mondo. Se hai domande, curiosità o vuoi semplicemente raccontarmi un viaggio, scrivimi qui accanto.',
      'contact.formTitle': 'Scrivimi',
      'contact.formLede': 'Rispondo di solito entro un paio di giorni.',
      'contact.name': 'Nome',
      'contact.namePh': 'Come ti chiami?',
      'contact.email': 'Email',
      'contact.emailPh': 'nome@email.com',
      'contact.message': 'Messaggio',
      'contact.messagePh': 'Raccontami il tuo prossimo viaggio…',
      'contact.send': 'Invia messaggio',
      'contact.mapTitle': 'Base: Roma, Italia',
      'contact.mapBtn': 'Mostra la mappa',
      'contact.mapNote': 'La mappa viene caricata da Google solo se la richiedi.',
      'contact.instagram': 'Seguimi su Instagram',
      'contact.sentTitle': 'Messaggio inviato',
      'contact.sentText': 'Grazie! Ti risponderò il prima possibile all’indirizzo che hai indicato.',
      'contact.sentAgain': 'Scrivi un altro messaggio',
      'contact.status.missing': 'Compila tutti i campi prima di inviare.',
      'contact.status.sending': 'Invio in corso…',
      'contact.status.ok': 'Messaggio inviato. Ti risponderò il prima possibile.',
      'contact.status.fail': 'Invio non riuscito. Riprova tra poco.',
      'contact.status.network': 'Errore di rete. Controlla la connessione e riprova.',

      'privacy.title': 'Privacy Policy',
      'privacy.p1': 'Questo sito raccoglie solo i dati che inserisci volontariamente nel modulo contatti (nome, email, messaggio) per rispondere alle tue richieste.',
      'privacy.p2': 'I dati vengono inviati tramite Web3Forms e non sono venduti né ceduti a terzi.',
      'privacy.p3': 'Per richiedere la modifica o la cancellazione dei tuoi dati, scrivimi dalla pagina <a href="contact.html">Contatti</a>.',
      'privacy.p4': 'La mappa nella pagina Contatti e le mappe dei diari di viaggio vengono caricate da servizi esterni (Google Maps, OpenStreetMap) solo quando le visualizzi.'
    },
    en: {
      'skip': 'Skip to content',
      'lang.label': 'Language',
      'menu.open': 'Open menu',
      'menu.close': 'Close menu',
      'nav.label': 'Main navigation',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.explore': 'Explore',
      'nav.gallery': 'Gallery',
      'nav.contact': 'Contact',
      'footer.quote': 'Travelling is the most powerful form of <em>therapy</em>.',
      'footer.copy': '© Andrea Lombardo — original photos and videos from my trips.',
      'footer.privacy': 'Privacy',
      'theme.label': 'Site theme',
      'theme.title': 'Theme',
      'theme.mediterraneo': 'Mediterranean',
      'theme.rivista': 'Magazine',
      'theme.foresta': 'Forest',

      'trip.usa': 'USA',
      'trip.thailand': 'Thailand',
      'trip.bolivia': 'Bolivia & Chile',
      'trip.china': 'China',
      'trip.scotland': 'Scotland',
      'trip.srilanka': 'Sri Lanka',

      'title.index': 'Travel | Andrea Lombardo’s travel journal',
      'title.about': 'About | Travel',
      'title.explore': 'Explore the trips | Travel',
      'title.gallery': 'Gallery | Travel',
      'title.contact': 'Contact | Travel',
      'title.privacy': 'Privacy Policy | Travel',
      'title.vlog': 'Travel journal | Travel',

      'home.kicker': 'Travel journal · 6 destinations',
      'home.cta': 'Watch the trip',
      'home.chapters': 'Choose a trip',
      'home.pause': 'Pause slideshow',
      'home.play': 'Resume slideshow',
      'home.s1.title': 'America <em>West Coast</em>',
      'home.s1.text': 'Endless deserts, legendary cities and some of the most iconic landscapes of the American West.',
      'home.s2.title': 'Thailand',
      'home.s2.text': 'A Thai dream: postcard beaches, exotic animals, light shows and ancient temples.',
      'home.s3.title': 'Bolivia <em>&amp;</em> Chile',
      'home.s3.text': 'Salar de Uyuni: have you ever seen a place where sky and earth meet on the horizon?',
      'home.s4.title': 'China',
      'home.s4.text': 'A culture far from our Western world, able to amaze with the kindness of its people and its hidden beauty.',
      'home.s5.title': 'Scotland',
      'home.s5.text': 'Wild Highlands, castles wrapped in mist and breathtaking landscapes: Scotland is waiting for you.',
      'home.s6.title': 'Sri Lanka',
      'home.s6.text': 'Tropical ocean, ancient temples, trains through tea plantations and safaris in the wild.',
      'home.social': 'Social',

      'explore.kicker': 'Six trips, one journal',
      'explore.title': 'My <em>trips</em>',
      'explore.quote': 'Travel to get lost, to find yourself, to leave something of you behind and bring back a part you did not know.',
      'explore.jump': 'Go to destination',
      'explore.open': 'Open the journal',
      'explore.prev': 'Previous trip',
      'explore.next': 'Next trip',
      'explore.help': 'Swipe, drag or use the arrows to navigate.',
      'explore.meta.usa': 'Aug 2022 · 12 days',
      'explore.meta.thailand': 'Dec 2023 · 15 days',
      'explore.meta.bolivia': 'Aug 2023 · 12 days',
      'explore.meta.china': 'Aug 2024 · 15 days',
      'explore.meta.scotland': 'Jul 2020 · 9 days',
      'explore.meta.srilanka': 'Aug 2025 · 12 days',

      'gallery.kicker': 'Photo archive',
      'gallery.title': 'The <em>gallery</em>',
      'gallery.lede': 'A selection of shots from the road. Tap a photo to view it full screen.',
      'gallery.filter': 'Filter by destination',
      'gallery.all': 'All',
      'gallery.close': 'Close',
      'gallery.prev': 'Previous photo',
      'gallery.next': 'Next photo',
      'gallery.moment': 'Travel moment',

      'vlog.kicker': 'Travel journal',
      'vlog.back': 'All trips',
      'vlog.toMap': 'Jump to map',
      'vlog.days': '{n} days',
      'vlog.stops': '{n} stops',
      'vlog.next': 'Next trip',
      'vlog.mapLoading': 'Loading map…',

      'about.kicker': 'Travel creator · Rome',
      'about.title': 'About <em>me</em>',
      'about.quote': 'When your inner compass is off, book a trip: it will help you find your way again.',
      'about.intro': 'I’m Andrea Lombardo, born in ’95, from Rome. I love technology as much as travel: discovering new cultures and living unique experiences.',
      'about.body': 'I chose to combine these two passions — <strong>technology and travel</strong> — and created this space: a digital journal of real itineraries, photos and videos shot on the road.',
      'about.caption': 'From Rome to the world, one trip at a time.',
      'about.pillar1': 'Real, honest itineraries',
      'about.pillar2': 'Practical tips from the field',
      'about.pillar3': 'Original photos and videos',
      'about.metric1': 'Destinations covered',
      'about.metric2': 'Shots in the gallery',
      'about.metric3': 'Trips being planned',
      'about.ctaExplore': 'Explore the trips',
      'about.ctaContact': 'Get in touch',

      'contact.kicker': 'Contact',
      'contact.title': 'Welcome to my <em>travel blog</em>',
      'contact.p1': 'This travel blog was born from my passion for travel and my wish to share the extraordinary experiences I have lived around the world. It is a digital diary I created for myself and for everyone who shares the same love for exploration and discovery.',
      'contact.p2': 'Here you will find tips, reflections and moments captured during my adventures. Every trip is a chance to dive into different cultures, explore breathtaking places and meet extraordinary people.',
      'contact.p3': 'These pages are full of detailed itineraries, honest reviews and practical advice to help you plan your next trip, along with photos and videos from my Instagram profile.',
      'contact.p4': 'I hope this space inspires you and fuels your desire to explore the world. If you have questions, curiosities or just want to tell me about a trip, write to me here.',
      'contact.formTitle': 'Write to me',
      'contact.formLede': 'I usually reply within a couple of days.',
      'contact.name': 'Name',
      'contact.namePh': 'What’s your name?',
      'contact.email': 'Email',
      'contact.emailPh': 'name@email.com',
      'contact.message': 'Message',
      'contact.messagePh': 'Tell me about your next trip…',
      'contact.send': 'Send message',
      'contact.mapTitle': 'Based in Rome, Italy',
      'contact.mapBtn': 'Show the map',
      'contact.mapNote': 'The map is loaded from Google only when you ask for it.',
      'contact.instagram': 'Follow me on Instagram',
      'contact.sentTitle': 'Message sent',
      'contact.sentText': 'Thank you! I will reply as soon as possible to the address you provided.',
      'contact.sentAgain': 'Send another message',
      'contact.status.missing': 'Please fill in every field before sending.',
      'contact.status.sending': 'Sending…',
      'contact.status.ok': 'Message sent. I will reply as soon as possible.',
      'contact.status.fail': 'Unable to send right now. Please try again shortly.',
      'contact.status.network': 'Network error. Check your connection and try again.',

      'privacy.title': 'Privacy Policy',
      'privacy.p1': 'This website only collects the data you voluntarily enter in the contact form (name, email, message) in order to reply to your requests.',
      'privacy.p2': 'The data is sent through Web3Forms and is never sold or shared with third parties.',
      'privacy.p3': 'To request changes to or deletion of your data, write to me from the <a href="contact.html">Contact</a> page.',
      'privacy.p4': 'The map on the Contact page and the trip maps are loaded from external services (Google Maps, OpenStreetMap) only when you view them.'
    }
  };

  function getLanguage() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'it';
    } catch (error) {
      return 'it';
    }
  }

  function t(key, vars) {
    var lang = getLanguage();
    var value = (dict[lang] && dict[lang][key]) || dict.it[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        value = value.replace('{' + name + '}', vars[name]);
      });
    }
    return value;
  }

  function applyTranslations(scope) {
    var host = scope || document;

    host.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    // Only used for our own static strings (never user input).
    host.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });

    host.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var parts = pair.split(':');
        el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
  }

  function setLanguage(lang, silent) {
    var next = lang === 'en' ? 'en' : 'it';
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      /* private mode: keep going without persistence */
    }
    root.lang = next;

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === next));
    });

    applyTranslations();
    syncMenuLabel();

    if (!silent) {
      document.dispatchEvent(new CustomEvent('languagechange', { detail: { language: next } }));
    }
  }

  /* ------------------------------------------------------- media helper */

  var IMG_PREFIX = 'assets/img/';
  var OPT_PREFIX = 'assets/img/optimized/';

  function mediaEntry(src) {
    var manifest = window.travelMedia;
    return manifest ? manifest[String(src).replace(IMG_PREFIX, '')] : null;
  }

  function imageUrl(src, width) {
    var entry = mediaEntry(src);
    return entry ? OPT_PREFIX + entry[0] + '-' + (width || 960) + '.webp' : src;
  }

  function markLoaded(img) {
    if (img.complete && img.naturalWidth) {
      img.classList.add('is-loaded');
      return;
    }
    var done = function () {
      img.classList.add('is-loaded');
    };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }

  /**
   * Builds a responsive <img> for an original path under assets/img.
   * opts: { alt, sizes, eager, className }
   */
  function createImage(src, opts) {
    var options = opts || {};
    var img = document.createElement('img');
    var entry = mediaEntry(src);

    img.alt = options.alt || '';
    img.decoding = 'async';
    img.loading = options.eager ? 'eager' : 'lazy';
    if (options.eager) {
      img.setAttribute('fetchpriority', 'high');
    }
    img.className = 'fade-in' + (options.className ? ' ' + options.className : '');

    if (entry) {
      var width = entry[1];
      var seen = {};
      var candidates = (window.travelMediaWidths || [480, 960, 1600])
        .map(function (target) {
          var real = Math.min(target, width);
          if (seen[real]) {
            return null;
          }
          seen[real] = true;
          return OPT_PREFIX + entry[0] + '-' + target + '.webp ' + real + 'w';
        })
        .filter(Boolean);

      img.width = entry[1];
      img.height = entry[2];
      img.sizes = options.sizes || '100vw';
      img.srcset = candidates.join(', ');
      img.src = OPT_PREFIX + entry[0] + '-960.webp';
    } else {
      img.src = src;
    }

    markLoaded(img);
    return img;
  }

  /* ------------------------------------------------------------- header */

  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');

  function isMenuOpen() {
    return root.hasAttribute('data-menu-open');
  }

  function syncMenuLabel() {
    if (menuBtn) {
      menuBtn.setAttribute('aria-label', t(isMenuOpen() ? 'menu.close' : 'menu.open'));
    }
  }

  function setMenu(open) {
    root.toggleAttribute('data-menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
    }
    document.querySelectorAll('body > main, body > footer').forEach(function (el) {
      el.inert = open;
    });
    syncMenuLabel();
    if (open && nav) {
      var first = nav.querySelector('a');
      if (first) {
        first.focus({ preventScroll: true });
      }
    }
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(!isMenuOpen());
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setMenu(false);
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (mq) {
      if (mq.matches && isMenuOpen()) {
        setMenu(false);
      }
    });
  }

  // Header background appears once the page scrolls (no scroll listeners).
  if (header && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:12px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  document.querySelectorAll('img.fade-in').forEach(markLoaded);

  /* ------------------------------------------------------------ public */

  window.Travel = {
    t: t,
    getLanguage: getLanguage,
    applyTranslations: applyTranslations,
    image: createImage,
    imageUrl: imageUrl,
    mediaEntry: mediaEntry
  };

  // HTML ships in Italian: only touch the DOM when another language is stored.
  if (getLanguage() !== 'it') {
    setLanguage(getLanguage(), true);
  } else {
    syncMenuLabel();
  }
})();
