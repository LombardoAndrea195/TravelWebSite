# TravelWebSite-name: RoamingWithGang-roaming aroudn
The idea of the project is to create a carousel home page with the goal to catch the reader to enter in the web site and have possibility to be interested on the trips I've made.

VIAGGIA PER PERDERTI, PER RITROVARTI, PER LASCIARE QUALCOSA DI TE E RIPORTA NEL TUO BAGAGLIO UNA PARTE DI TE CHE NON CONOSCEVI.

## Structure

Static site, no build step, no runtime dependencies.

- `index.html` · `explore.html` · `gallery.html` · `vlog.html?trip=<Name>` · `about.html` · `contact.html` · `privacy.html`
- `assets/css/styles.css` — shared design system (tokens, header, footer, buttons); one extra CSS file per page
- `assets/js/main.js` — shared runtime: IT/EN i18n (`data-i18n*` attributes), menu, responsive image helper
- `assets/js/<page>.js` — page logic (home slideshow, explore carousel, gallery lightbox, vlog renderer, contact form)
- `assets/js/vlog-data.js` — trip diaries; `assets/js/gallery-images.js` — gallery list
- `assets/vendor/leaflet-1.9.4/` — self-hosted, loaded only when a trip map scrolls into view
- Media pipeline and rules: see `MEDIA_POLICY.md`

Local preview: `python3 -m http.server` from the repo root.

## Hosting (GitHub Pages)

Published at https://lombardoandrea195.github.io/TravelWebSite/ from the repository branch.
`_config.yml` excludes originals, tooling and docs from the published site.

## Contact form

GitHub Pages is static, so `contact.html` posts directly to Web3Forms (`https://api.web3forms.com/submit`):

- with JS (`assets/js/contact.js`): `fetch` + inline validation, success panel, error/network messages;
- without JS: plain HTML post; Web3Forms redirects back to `contact.html#form-sent` (CSS `:target` shows the thank-you panel).

The access key in the HTML is public by design (Web3Forms has no secret keys for static sites).
Protect it from the Web3Forms dashboard: allow only the `lombardoandrea195.github.io` domain.
Spam: the hidden `botcheck` honeypot is checked by Web3Forms.
