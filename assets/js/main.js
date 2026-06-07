document.addEventListener('DOMContentLoaded', function () {
  var STORAGE_KEY = 'travel-language';
  var pageName = window.location.pathname.split('/').pop() || 'index.html';
  var pageKey = pageName.replace('.html', '');

  var translations = {
    nav: {
      it: ['Home', 'Chi sono', 'Esplora', 'Galleria', 'Contatti'],
      en: ['Home', 'About', 'Explore', 'Gallery', 'Contact']
    },
    titles: {
      index: {
        it: 'Travel Blog | Andrea Lombardo',
        en: 'Travel Blog | Andrea Lombardo'
      },
      about: {
        it: 'Travel Blog | Chi sono',
        en: 'Travel Blog | About'
      },
      explore: {
        it: 'Travel Blog | Esplora',
        en: 'Travel Blog | Explore'
      },
      gallery: {
        it: 'Travel Blog | Galleria',
        en: 'Travel Blog | Gallery'
      },
      contact: {
        it: 'Travel Blog | Contatti',
        en: 'Travel Blog | Contact'
      },
      vlog: {
        it: 'Travel Blog | Vlog',
        en: 'Travel Blog | Vlog'
      }
    }
  };

  function getStoredLanguage() {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'it';
  }

  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function injectLanguageSwitcher(language) {
    var header = document.querySelector('header');
    var menuButton = document.querySelector('.menu-btn');

    if (!header || document.querySelector('.language-switch')) {
      return;
    }

    var switcher = document.createElement('div');
    switcher.className = 'language-switch';
    switcher.setAttribute('aria-label', language === 'it' ? 'Selettore lingua' : 'Language switcher');

    ['it', 'en'].forEach(function (code) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'language-btn';
      button.setAttribute('data-language', code);
      button.textContent = code.toUpperCase();
      button.setAttribute('aria-pressed', String(code === language));

      button.addEventListener('click', function () {
        applyLanguage(code);
      });

      switcher.appendChild(button);
    });

    if (menuButton) {
      header.insertBefore(switcher, menuButton);
    } else {
      header.appendChild(switcher);
    }
  }

  function updateLanguageButtons(language) {
    document.querySelectorAll('.language-btn').forEach(function (button) {
      var isActive = button.getAttribute('data-language') === language;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    var switcher = document.querySelector('.language-switch');
    if (switcher) {
      switcher.setAttribute('aria-label', language === 'it' ? 'Selettore lingua' : 'Language switcher');
    }
  }

  function translateNavigation(language) {
    var items = translations.nav[language];
    document.querySelectorAll('.navigation-items a').forEach(function (link, index) {
      if (items[index]) {
        link.textContent = items[index];
      }
    });
  }

  function translateMicrocopy(language) {
    var menuButton = document.querySelector('.menu-btn');
    if (menuButton) {
      menuButton.setAttribute('aria-label', language === 'it' ? 'Apri menu' : 'Open menu');
      if (!menuButton.hasAttribute('aria-expanded')) {
        menuButton.setAttribute('aria-expanded', 'false');
      }
    }

    var exploreJump = document.querySelector('.explore-jump');
    if (exploreJump) {
      exploreJump.setAttribute('aria-label', language === 'it' ? 'Vai a destinazione' : 'Go to destination');
    }
  }

  function translateIndex(language) {
    var slides = [
      {
        it: {
          title: 'America Westcost:',
          description: 'Tra deserti infiniti, città leggendarie e alcuni dei paesaggi più iconici del West americano.',
          cta: 'Guarda il viaggio'
        },
        en: {
          title: 'America West Coast:',
          description: 'Between endless deserts, legendary cities and some of the most iconic landscapes of the American West.',
          cta: 'Watch the trip'
        }
      },
      {
        it: {
          title: 'Thailandia:',
          description: 'Un sogno thailandese: tra spiagge da sogno, animali esotici, giochi di luci e templi millenari.',
          cta: 'Guarda il viaggio'
        },
        en: {
          title: 'Thailand:',
          description: 'A Thai dream among postcard beaches, exotic animals, light shows and ancient temples.',
          cta: 'Watch the trip'
        }
      },
      {
        it: {
          title: 'Bolivia & Cile:',
          description: 'Salar de Uyuni: Hai mai visto un posto dove cielo e terra si uniscono all orizzonte?',
          cta: 'Guarda il viaggio'
        },
        en: {
          title: 'Bolivia & Chile:',
          description: 'Salar de Uyuni: have you ever seen a place where sky and earth meet on the horizon?',
          cta: 'Watch the trip'
        }
      },
      {
        it: {
          title: 'Cina:',
          description: 'Una cultura lontana dal nostro mondo occidentale ma capace di sorprendere per il suo popolo gentile e le sue bellezze nascoste.',
          cta: 'Guarda il viaggio'
        },
        en: {
          title: 'China:',
          description: 'A culture far from our Western world yet able to amaze with its kind people and hidden beauty.',
          cta: 'Watch the trip'
        }
      },
      {
        it: {
          title: 'Scozia:',
          description: 'Highlands selvagge, castelli avvolti nella nebbia e paesaggi mozzafiato: la Scozia ti aspetta.',
          cta: 'Guarda il viaggio'
        },
        en: {
          title: 'Scotland:',
          description: 'Wild Highlands, castles wrapped in mist and breathtaking landscapes: Scotland is waiting for you.',
          cta: 'Watch the trip'
        }
      },
      {
        it: {
          title: 'Sri Lanka:',
          description: 'Oceano tropicale, templi antichi, treni tra le piantagioni di tè e safari nella natura selvaggia.',
          cta: 'Guarda il viaggio'
        },
        en: {
          title: 'Sri Lanka:',
          description: 'Tropical ocean, ancient temples, trains through tea plantations and safaris in the wild.',
          cta: 'Watch the trip'
        }
      }
    ];

    document.querySelectorAll('.home .content').forEach(function (content, index) {
      var translation = slides[index] && slides[index][language];
      if (!translation) {
        return;
      }

      var title = content.querySelector('h2');
      var description = content.querySelector('p');
      var cta = content.querySelector('a');

      if (title) {
        title.innerHTML = translation.title + '<br><span></span>';
      }
      if (description) {
        description.textContent = translation.description;
      }
      if (cta) {
        cta.textContent = translation.cta;
      }
    });
  }

  function translateAbout(language) {
    setText('.introduction h3', language === 'it'
      ? '- Quando la bussola interiore e sballata: prenota un viaggio, ti aiutera a ritrovare la tua strada -'
      : '- When your inner compass is off track, book a trip: it will help you find your way again -');
    setText('.introduction h1', language === 'it' ? 'Chi sono' : 'About me');
    setText('.profilo .descrizione h2', language === 'it'
      ? 'Sono Andrea Lombardo, classe 95, romano amante della tecnologia oltre che dei viaggi per scoprire nuove culture e vivere esperienze uniche.'
      : 'I am Andrea Lombardo, born in 1995, from Rome, passionate about technology and travel to discover new cultures and live unique experiences.');
    setText('.profilo .descrizione p', language === 'it'
      ? 'Ho scelto di combinare queste due grandi passioni - Tecnologia e Viaggi - dando vita a questo spazio virtuale.'
      : 'I chose to combine these two great passions - Technology and Travel - creating this virtual space.');
    setText('.about-metrics article:nth-child(3) p', 'Planned trips');
    setText('.footer-content p', language === 'it'
      ? '© 2024 Viaggiare e la piu potente forma di psicoterapia'
      : '© 2024 Travelling is the most powerful form of psychotherapy');

    var footerLinks = document.querySelectorAll('.footer-nav a');
    if (footerLinks.length === 3) {
      footerLinks[0].textContent = language === 'it' ? 'Chi siamo' : 'About';
      footerLinks[1].textContent = 'Privacy Policy';
      footerLinks[2].textContent = language === 'it' ? 'Contatti' : 'Contact';
    }
  }

  function translateContact(language) {
    var social = document.querySelectorAll('.Social');
    if (social[0]) {
      var heading = social[0].querySelector('h1');
      var paragraphs = social[0].querySelectorAll('p');
      if (heading) {
        heading.textContent = language === 'it' ? 'Benvenuti nel mio travel blog!' : 'Welcome to my travel blog!';
      }
      if (paragraphs[0]) {
        paragraphs[0].textContent = language === 'it'
          ? 'Questo travel blog nasce dalla mia passione per i viaggi e dall ardente desiderio di condividere le esperienze straordinarie che ho vissuto in giro per il mondo. E come un diario digitale che ho creato per me stesso e per tutti coloro che condividono la mia stessa passione per l esplorazione e la scoperta.'
          : 'This travel blog was born from my passion for travel and my strong desire to share the extraordinary experiences I have lived around the world. It is like a digital diary created for myself and for everyone who shares my passion for exploration and discovery.';
      }
      if (paragraphs[1]) {
        paragraphs[1].textContent = language === 'it'
          ? 'Qui troverai una raccolta di consigli, riflessioni e momenti catturati durante le mie avventure. Ogni viaggio e un opportunita unica per immergersi in culture diverse, esplorare luoghi mozzafiato e incontrare persone straordinarie.'
          : 'Here you will find a collection of tips, reflections and moments captured during my adventures. Every trip is a unique opportunity to dive into different cultures, explore breathtaking places and meet extraordinary people.';
      }
      if (paragraphs[2]) {
        paragraphs[2].textContent = language === 'it'
          ? 'Le pagine di questo blog sono piene di itinerari dettagliati, recensioni sincere e consigli pratici per aiutarti a pianificare il tuo prossimo viaggio.'
          : 'These pages are full of detailed itineraries, honest reviews and practical advice to help you plan your next trip.';
      }
      if (paragraphs[3]) {
        paragraphs[3].textContent = language === 'it'
          ? 'Mi auguro che questo spazio possa ispirarti, fornirti preziose informazioni e alimentare la tua voglia di esplorare il mondo. E se hai domande o curiosita, non esitare a contattarmi tramite il box sottostante.'
          : 'I hope this space can inspire you, provide useful information and fuel your desire to explore the world. And if you have questions or curiosities, feel free to contact me through the form below.';
      }
      if (paragraphs[4]) {
        paragraphs[4].textContent = language === 'it'
          ? 'Sono qui per condividere la mia passione e aiutarti a vivere esperienze indimenticabili in giro per il globo!'
          : 'I am here to share my passion and help you enjoy unforgettable experiences around the globe!';
      }
    }

    setText('.contact-info h4', language === 'it' ? 'Instagram Feed' : 'Instagram Feed');
    setText('.contact-form h1', language === 'it' ? 'Contattami' : 'Contact me');

    var nameInput = document.querySelector('input[name="name"]');
    var emailInput = document.querySelector('input[name="email"]');
    var messageInput = document.querySelector('textarea[name="message"]');
    var submitInput = document.querySelector('.contact-form-btn');
    if (nameInput) {
      nameInput.placeholder = language === 'it' ? 'Nome' : 'Name';
    }
    if (emailInput) {
      emailInput.placeholder = 'Email';
    }
    if (messageInput) {
      messageInput.placeholder = language === 'it' ? 'Messaggio' : 'Message';
    }
    if (submitInput) {
      submitInput.value = language === 'it' ? 'Invia' : 'Send';
    }

    setText('.footer-content p', language === 'it'
      ? '© 2024 Viaggiare e la piu potente forma di psicoterapia'
      : '© 2024 Travelling is the most powerful form of psychotherapy');
    var footerLinks = document.querySelectorAll('.footer-nav a');
    if (footerLinks.length === 3) {
      footerLinks[0].textContent = language === 'it' ? 'Chi siamo' : 'About';
      footerLinks[1].textContent = 'Privacy Policy';
      footerLinks[2].textContent = language === 'it' ? 'Contatti' : 'Contact';
    }
  }

  function translateExplore(language) {
    setText('.section-subheading', language === 'it'
      ? '- Viaggia per perderti, per ritrovarti, per lasciare qualcosa di te e riportare una parte che non conoscevi -'
      : '- Travel to get lost, to find yourself, to leave something of you behind and bring back a part you did not know -');
    setText('.section-heading', language === 'it' ? 'I miei viaggi' : 'My trips');
    setText('.explore-help', language === 'it'
      ? 'Scorri con il dito, usa i pulsanti sopra o le frecce per navigare.'
      : 'Swipe with your finger, use the buttons above or the arrows to navigate.');

    var jumpButtons = document.querySelectorAll('.jump-btn');
    var exploreLabels = [
      'USA',
      language === 'it' ? 'Thailandia' : 'Thailand',
      language === 'it' ? 'Bolivia & Cile' : 'Bolivia & Chile',
      language === 'it' ? 'Cina' : 'China',
      language === 'it' ? 'Scozia' : 'Scotland',
      'Sri Lanka'
    ];
    jumpButtons.forEach(function (button, index) {
      if (exploreLabels[index]) {
        button.textContent = exploreLabels[index];
      }
    });

    document.querySelectorAll('.slide-cta').forEach(function (item) {
      item.innerHTML = (language === 'it' ? 'Apri vlog' : 'Open vlog') + ' <ion-icon name="arrow-forward-outline"></ion-icon>';
    });

    var destinationNames = document.querySelectorAll('.destination-name');
    destinationNames.forEach(function (name, index) {
      if (exploreLabels[index]) {
        name.textContent = exploreLabels[index];
      }
    });
  }

  function translateGallery(language) {
    var heading = document.querySelector('.gallery-heading');
    if (heading) {
      heading.textContent = language === 'it' ? 'Galleria' : 'Gallery';
    }

    var subheading = document.querySelector('.gallery-subheading');
    if (subheading) {
      subheading.textContent = language === 'it'
        ? 'Una selezione di scatti dai viaggi: apri ogni foto in alta risoluzione.'
        : 'A curated selection of travel shots: open each photo in high resolution.';
    }
  }

  function applyPageTranslations(language) {
    if (pageKey === 'index') {
      translateIndex(language);
    }
    if (pageKey === 'about') {
      translateAbout(language);
    }
    if (pageKey === 'contact') {
      translateContact(language);
    }
    if (pageKey === 'explore') {
      translateExplore(language);
    }
    if (pageKey === 'gallery') {
      translateGallery(language);
    }
  }

  function applyLanguage(language) {
    var nextLanguage = language === 'en' ? 'en' : 'it';
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
    injectLanguageSwitcher(nextLanguage);
    updateLanguageButtons(nextLanguage);
    translateNavigation(nextLanguage);
    translateMicrocopy(nextLanguage);

    if (translations.titles[pageKey]) {
      document.title = translations.titles[pageKey][nextLanguage];
    }

    applyPageTranslations(nextLanguage);
    document.dispatchEvent(new CustomEvent('languagechange', {
      detail: { language: nextLanguage }
    }));
  }

  injectLanguageSwitcher(getStoredLanguage());
  applyLanguage(getStoredLanguage());

  var menuBtn = document.querySelector('.menu-btn');
  var navigation = document.querySelector('.navigation');
  var navLinks = document.querySelectorAll('.navigation-items a');

  if (menuBtn && navigation) {
    menuBtn.addEventListener('click', function () {
      var isOpen = menuBtn.classList.toggle('active');
      navigation.classList.toggle('active', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menuBtn.classList.remove('active');
        navigation.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var slides = document.querySelectorAll('.video-slide');
  var btns = document.querySelectorAll('.nav-btn');
  var contents = document.querySelectorAll('.content');

  if (slides.length && btns.length && contents.length) {
    var ensureVideoSourcesLoaded = function (slide) {
      if (!slide || slide.dataset.sourcesLoaded === 'true') {
        return;
      }

      var sources = slide.querySelectorAll('source[data-src]');
      if (!sources.length) {
        slide.dataset.sourcesLoaded = 'true';
        return;
      }

      sources.forEach(function (source) {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
      });

      if (typeof slide.load === 'function') {
        slide.load();
      }

      slide.dataset.sourcesLoaded = 'true';
    };

    var syncHomeVideos = function (activeIndex) {
      slides.forEach(function (slide, index) {
        if (typeof slide.pause === 'function' && typeof slide.play === 'function') {
          if (index === activeIndex) {
            ensureVideoSourcesLoaded(slide);
            var playPromise = slide.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(function () { });
            }
          } else {
            slide.pause();
          }
        }
      });
    };

    var sliderNav = function (manual) {
      btns.forEach(function (btn) {
        btn.classList.remove('active');
      });
      slides.forEach(function (slide) {
        slide.classList.remove('active');
      });
      contents.forEach(function (content) {
        content.classList.remove('active');
      });

      btns[manual].classList.add('active');
      slides[manual].classList.add('active');
      contents[manual].classList.add('active');
      syncHomeVideos(manual);
    };

    // Ensure only the active video plays on first load.
    var firstActiveIndex = 0;
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        firstActiveIndex = index;
      }
    });
    syncHomeVideos(firstActiveIndex);

    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        sliderNav(i);
      });
    });
  }

  if (typeof Swiper !== 'undefined' && document.querySelector('.tranding-slider')) {
    var trandingSlider = new Swiper('.tranding-slider', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 'auto',
      keyboard: {
        enabled: true,
      },
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 110,
        modifier: 2.2,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        0: {
          spaceBetween: 16,
        },
        768: {
          spaceBetween: 24,
        },
      },
    });

    var jumpButtons = document.querySelectorAll('[data-slide]');
    var prevArrow = document.querySelector('.tranding-slider-control .swiper-button-prev');
    var nextArrow = document.querySelector('.tranding-slider-control .swiper-button-next');

    var syncExploreJumpButtons = function () {
      var activeIndex = trandingSlider.realIndex;
      jumpButtons.forEach(function (button) {
        var isActive = Number(button.getAttribute('data-slide')) === activeIndex;
        button.classList.toggle('is-active', isActive);
      });
    };

    if (prevArrow) {
      prevArrow.addEventListener('click', function (event) {
        event.preventDefault();
        trandingSlider.slidePrev();
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', function (event) {
        event.preventDefault();
        trandingSlider.slideNext();
      });
    }

    jumpButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var target = Number(button.getAttribute('data-slide'));
        if (!Number.isNaN(target)) {
          trandingSlider.slideToLoop(target);
        }
      });
    });

    syncExploreJumpButtons();

    trandingSlider.on('slideChange', function () {
      syncExploreJumpButtons();
    });
  }

  var contactForm = document.getElementById('form');
  if (contactForm && pageKey === 'contact') {
    var contactStatus = document.getElementById('contact-status');

    var setContactStatus = function (text, isError) {
      if (!contactStatus) {
        return;
      }
      contactStatus.textContent = text;
      contactStatus.classList.toggle('is-error', Boolean(isError));
      contactStatus.classList.toggle('is-success', !isError && text.length > 0);
    };

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var formData = new FormData(contactForm);
      var payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        botcheck: String(formData.get('botcheck') || '').trim()
      };

      if (!payload.name || !payload.email || !payload.message) {
        setContactStatus(
          getStoredLanguage() === 'it'
            ? 'Compila tutti i campi richiesti prima di inviare.'
            : 'Please complete all required fields before sending.',
          true
        );
        return;
      }

      var submitButton = contactForm.querySelector('.contact-form-btn');
      if (submitButton) {
        submitButton.disabled = true;
      }

      setContactStatus(
        getStoredLanguage() === 'it' ? 'Invio in corso...' : 'Sending...',
        false
      );

      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().catch(function () {
            return { ok: false, message: 'Invalid response' };
          });
        })
        .then(function (result) {
          if (result && result.ok) {
            setContactStatus(
              getStoredLanguage() === 'it'
                ? 'Messaggio inviato con successo. Ti rispondero il prima possibile.'
                : 'Message sent successfully. I will reply as soon as possible.',
              false
            );
            contactForm.reset();
            return;
          }

          setContactStatus(
            (result && result.message)
              ? result.message
              : (getStoredLanguage() === 'it'
                ? 'Invio non riuscito. Riprova tra poco.'
                : 'Unable to send now. Please try again shortly.'),
            true
          );
        })
        .catch(function () {
          setContactStatus(
            getStoredLanguage() === 'it'
              ? 'Errore di rete. Controlla la connessione e riprova.'
              : 'Network error. Check your connection and try again.',
            true
          );
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
          }
        });
    });
  }
});
