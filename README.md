# TravelWebSite-name: RoamingWithGang-roaming aroudn
The idea of the project is to create a carousel home page with the goal to catch the reader to enter in the web site and have possibility to be interested on the trips I've made.

VIAGGIA PER PERDERTI, PER RITROVARTI, PER LASCIARE QUALCOSA DI TE E RIPORTA NEL TUO BAGAGLIO UNA PARTE DI TE CHE NON CONOSCEVI.

## Contact form security

The contact page now submits to a serverless endpoint at `/api/contact`.
This keeps the Web3Forms access key out of the frontend source.

### Required environment variable

Create an environment variable in your hosting platform:

- `WEB3FORMS_ACCESS_KEY`: your private Web3Forms key

Use `.env.example` as a reference for local/deployment setup.

### Deployment note

The `api/contact.js` route is compatible with Vercel serverless functions.
If you deploy on a different platform (for example Netlify), create an equivalent function endpoint and keep the frontend action/fetch target as `/api/contact`.