# Media Policy

## Keep in Git
- `assets/img/optimized/`
- `assets/video/optimized/`
- code and layout files (`*.html`, `assets/js/*.js`, `assets/css/*.css`)

## Keep Out of Git
- `mega_upload/`
- original image folders:
  - `assets/img/cile/`
  - `assets/img/china/`
  - `assets/img/scotland/`
  - `assets/img/sri_lanka/`
  - `assets/img/thailandia/`
  - `assets/img/usa/`
  - `assets/img/other/`
- original video files:
  - `assets/video/1.mp4` to `assets/video/6.mp4`

## MEGA Mapping
- Root folder link: `https://mega.nz/folder/9iwGgIgY#WCTXZi8Q-n2rVn_-wQHFwA`
- Current implementation uses the root folder as the fallback for image/video links.
- If separate MEGA subfolder links become available later, update `assets/js/mega-links.js` with those URLs.

## Notes
- The site still depends on the optimized assets in `assets/img/optimized/` and `assets/video/optimized/`.
- The original media stays on MEGA as the archive/source of truth.
