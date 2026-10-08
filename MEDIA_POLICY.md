# Media Policy

## Served by the site
- `assets/img/optimized/<trip>/<name>-{480,960,1600}.webp` — responsive photo variants
- `assets/img/og-cover.jpg` — social preview (1200×630)
- `assets/video/optimized/<n>-opt.mp4` + `<n>-poster.webp` — home hero videos (720p, ≤10 s, no audio)
- `assets/js/media-manifest.js` — generated map *original path → optimized base + width/height*

## Not published (see `exclude` in `_config.yml`)
- `mega_upload/`
- original photos: `assets/img/{cile,china,scotland,sri_lanka,thailandia,usa,other}/`
- original videos: `assets/video/1.mp4` … `6.mp4`
- `scripts/` (local tooling)

## Adding or changing photos/videos
1. Drop the original into the right folder (e.g. `assets/img/usa/`, `assets/video/7.mp4`).
2. Reference the **original** path in `assets/js/gallery-images.js` or `assets/js/vlog-data.js`
   (the front-end resolves it to the optimized WebP through the manifest).
3. Regenerate:
   ```bash
   cd scripts && npm install   # first time only (installs sharp)
   cd .. && bash scripts/optimize_media.sh          # images + videos
   bash scripts/optimize_media.sh videos             # videos only
   ```
   Images are incremental (only new/changed files are encoded).
4. Commit `assets/img/optimized/`, `assets/video/optimized/` and `assets/js/media-manifest.js`.

## MEGA Mapping
- Root folder link: `https://mega.nz/folder/9iwGgIgY#WCTXZi8Q-n2rVn_-wQHFwA`
- The original media stays on MEGA as the archive/source of truth.
