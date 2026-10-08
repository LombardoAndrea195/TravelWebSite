/* Contact page: form submission + click-to-load Google Map. */
(function () {
  'use strict';

  var T = window.Travel;
  if (!T) {
    return;
  }

  /* ----------------------------------------------------------- map facade */

  var facade = document.querySelector('[data-map-facade]');
  var mapButton = facade && facade.querySelector('[data-map-load]');
  if (mapButton) {
    mapButton.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190049.30004634877!2d12.345797094335932!3d41.903172260082364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6196f9928ebb%3A0xb90f770693656e38!2sRoma%20RM!5e0!3m2!1sit!2sit!4v1705689684319!5m2!1sit!2sit';
      iframe.title = T.t('contact.mapTitle');
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      facade.classList.add('is-loaded');
      facade.replaceChildren(iframe);
    });
  }

  /* ----------------------------------------------------------------- form */

  var form = document.getElementById('form');
  if (!form) {
    return;
  }

  var statusEl = document.getElementById('contact-status');
  var submitBtn = form.querySelector('[type="submit"]');
  var card = form.closest('.contact-card');
  var sentPanel = document.getElementById('form-sent');
  var againLink = sentPanel && sentPanel.querySelector('[data-form-again]');

  function showSent() {
    card.classList.add('is-sent');
    setStatus('');
    sentPanel.focus({ preventScroll: true });
    sentPanel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  if (againLink) {
    againLink.addEventListener('click', function (event) {
      event.preventDefault();
      card.classList.remove('is-sent');
      if (window.location.hash === '#form-sent') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      form.querySelector('input[name="name"]').focus();
    });
  }
  var fields = Array.prototype.slice.call(
    form.querySelectorAll('input:not([type="hidden"]):not([name="botcheck"]), textarea')
  );

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.classList.toggle('is-error', kind === 'error');
    statusEl.classList.toggle('is-success', kind === 'success');
  }

  fields.forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) {
        field.removeAttribute('aria-invalid');
      }
    });
  });

  function validate() {
    var firstInvalid = null;
    fields.forEach(function (field) {
      if (field.value.trim() === '') {
        field.value = ''; // whitespace-only must fail `required`
      }
      if (field.checkValidity()) {
        field.removeAttribute('aria-invalid');
      } else {
        field.setAttribute('aria-invalid', 'true');
        firstInvalid = firstInvalid || field;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return !firstInvalid;
  }

  // GitHub Pages is static, so the form talks to Web3Forms directly
  // (same endpoint as the no-JS fallback in the form's `action`).
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validate()) {
      setStatus(T.t('contact.status.missing'), 'error');
      return;
    }

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      payload[key] = typeof value === 'string' ? value.trim() : value;
    });
    delete payload.redirect; // only meaningful for the no-JS HTML post

    submitBtn.disabled = true;
    form.setAttribute('aria-busy', 'true');
    setStatus(T.t('contact.status.sending'));

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().catch(function () {
          return { success: false };
        });
      })
      .then(function (result) {
        if (result && result.success) {
          form.reset();
          showSent();
        } else {
          setStatus((result && result.message) || T.t('contact.status.fail'), 'error');
        }
      })
      .catch(function () {
        setStatus(T.t('contact.status.network'), 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        form.removeAttribute('aria-busy');
      });
  });
})();
