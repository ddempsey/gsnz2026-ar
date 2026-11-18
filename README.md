# GSNZ 2026 poster: live film strip (WebAR)

Point a phone at the poster and the film strip plays the simulations. Image tracking with
MindAR 1.2.5 + A-Frame 1.5.0, served by GitHub Pages at https://ddempsey.github.io/gsnz2026-ar/

- `index.html`: the AR page. The target is the whole poster (1 unit = 84.1 cm wide); the video
  plane sits over the film band (see the comment in the scene).
- `poster.mind`: compiled image target. Rebuild whenever the poster layout changes:
  render the poster to PNG (~1000 px wide), then `node tools/compile_mind.js target.png poster.mind`.
- `media/run{A,B,C}.{mp4,webm}`: 15 s loops of the magma0 viewers, from
  `node tools/capture_full.js viewer.html framesDir 450 "label"` then ffmpeg
  (H.264 crf 24 + VP9 crf 38, 950x700, 30 fps).
- `viewers/`: the interactive magma0 viewers (bubbles restyled to match the poster).
- `tools/test_ar.js`: headless test with a fake camera fed a y4m clip of the poster.

Tools need `npm i playwright` and a Chromium; paths in the scripts point at a local install.
