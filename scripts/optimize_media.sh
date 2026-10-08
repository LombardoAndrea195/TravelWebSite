#!/usr/bin/env bash
# Local media pipeline (not deployed).
#   bash scripts/optimize_media.sh            -> images + videos
#   bash scripts/optimize_media.sh videos     -> videos only
# Requires: node (+ `npm install` in scripts/), ffmpeg, cwebp.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "${1:-all}" != "videos" ]]; then
  (cd scripts && node optimize-images.mjs)
fi

mkdir -p assets/video/optimized

# 720p (short side), max 10s (slides rotate every ~6.5s), <=30fps, no audio, H.264 high profile, moov atom first
# so playback starts before the whole file is downloaded.
SCALE="scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'"

for v in 1 2 3 4 5 6; do
  in="assets/video/${v}.mp4"
  out="assets/video/optimized/${v}-opt.mp4"
  poster_jpg="/tmp/travel-${v}-poster.jpg"
  poster_webp="assets/video/optimized/${v}-poster.webp"

  [[ -f "$in" ]] || { echo "SKIP missing $in"; continue; }

  if [[ ! -f "$out" || "$in" -nt "$out" || "${FORCE:-0}" == "1" ]]; then
    ffmpeg -y -loglevel error -i "$in" \
      -vf "${SCALE}" -fpsmax 30 \
      -t 10 -c:v libx264 -preset slow -crf 31 -profile:v high -pix_fmt yuv420p \
      -movflags +faststart -an "$out"
  fi

  # Poster = first frame, so the swap poster -> video is seamless.
  ffmpeg -y -loglevel error -i "$in" -frames:v 1 -vf "${SCALE}" -q:v 3 "$poster_jpg"
  cwebp -quiet -q 72 "$poster_jpg" -o "$poster_webp"
  rm -f "$poster_jpg"

  echo "DONE video $in -> $(du -h "$out" | cut -f1)"
done

echo "ALL_CONVERSIONS_DONE"
