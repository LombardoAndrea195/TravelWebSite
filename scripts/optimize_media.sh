#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p assets/img/optimized assets/video/optimized

grep -Eho "assets/img/[-A-Za-z0-9_./~ ]+\.(jpg|JPG|jpeg|JPEG|png|PNG)" \
  explore.html gallery.html vlog.html assets/js/gallery-images.js \
  | grep -v 'assets/img/optimized/' \
  | sort -u > /tmp/travel_image_list.txt

while IFS= read -r src; do
  [[ -z "$src" ]] && continue
  if [[ ! -f "$src" ]]; then
    echo "SKIP missing $src"
    continue
  fi

  rel="${src#assets/img/}"
  dir="$(dirname "$rel")"
  name="$(basename "$rel")"
  stem="${name%.*}"

  outdir="assets/img/optimized/$dir"
  mkdir -p "$outdir"

  for w in 480 768 1200; do
    jpg="$outdir/${stem}-${w}.jpg"
    webp="$outdir/${stem}-${w}.webp"
    avif="$outdir/${stem}-${w}.avif"

    ffmpeg -y -loglevel error -i "$src" -vf "scale='min(${w},iw)':-2" -q:v 3 "$jpg"
    cwebp -quiet -q 78 "$jpg" -o "$webp"
    avifenc -q 54 --speed 6 "$jpg" "$avif" >/dev/null
  done

  echo "DONE image $src"
done < /tmp/travel_image_list.txt

for v in 1 2 3 4; do
  in="assets/video/${v}.mp4"
  out="assets/video/optimized/${v}-opt.mp4"
  poster_jpg="assets/video/optimized/${v}-poster.jpg"
  poster_webp="assets/video/optimized/${v}-poster.webp"

  ffmpeg -y -loglevel error -i "$in" \
    -vf "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'" \
    -c:v libx264 -preset medium -crf 28 -movflags +faststart -an "$out"

  ffmpeg -y -loglevel error -ss 00:00:02 -i "$in" -frames:v 1 \
    -vf "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'" "$poster_jpg"

  cwebp -quiet -q 80 "$poster_jpg" -o "$poster_webp"
  echo "DONE video $in"
done

echo "ALL_CONVERSIONS_DONE"
