# chadwicklabs.com

Alex Chadwick's index of works. A static site: plain HTML and CSS, one small script for the optional light theme (dark is the default), self-hosted fonts, no third-party requests.

## Layout

- `src/` is the site. `index.html`, `404.html`, `styles.css`, `theme.js`, fonts, icons, `og.png`, `robots.txt`, `sitemap.xml` and project screenshots in `img/`.
- `scripts/optimize-image.py` turns a source screenshot into WebP files plus a truecolor PNG fallback in `src/img/`, with all metadata dropped.
- `build.sh` copies `src/` into `dist/` and adds `CNAME` and `.nojekyll`.
- `scripts/render-assets.mjs` regenerates `src/og.png` (1200x630, from `scripts/og/og.html`), `src/apple-touch-icon.png` and `src/favicon-32.png`. Needs Node and the `playwright` package; set `CHROME_PATH` to use a system Chrome.
- `.github/workflows/pages.yml` builds and deploys `dist/` to GitHub Pages on every push to `main`. No secrets needed.

## Build and preview

```sh
./build.sh
cd dist && python3 -m http.server 8000
```

All asset paths are relative, so `dist/` works from any static host or a subfolder. The canonical URL and the OG image URL are absolute on purpose. The 404 page uses root-absolute asset paths so it still styles when GitHub Pages serves it for a nested missing URL.

## Editing entries

Entries live in `src/index.html` inside `<ol class="index">`, numbered [01], [02] and so on. Live things go first. If you add or remove one, update the numbers, the "08 entries" note and the counts in the hero line and readout, then re-run `scripts/render-assets.mjs` to refresh `og.png`.

To pull the Toontown entry quickly, delete the element marked `data-pending="toontown"`, renumber, and update the counts.

## Screenshots

Every entry has one screenshot slot after its text. With a capture it is a `<figure class="shot ...">` holding a `<picture>` (WebP `srcset` plus PNG `img` with width, height, alt, `loading="lazy"`) and a short caption. Without one it is `<div class="shot shot--empty" aria-hidden="true">`, which draws the hatched "No capture yet" panel. To add a capture:

1. `python3 scripts/optimize-image.py <source.png> <name> 640 1200` (use smaller widths for small sources; it never upscales).
2. Replace the empty div with a figure copied from another entry, pointing at `img/<name>-*.webp` and `img/<name>.png`, and write alt text that says what the screen shows.
3. Use `shot--wide` for landscape captures, `shot--tall` for phone portraits and `shot--native` for small captures that should stay at actual size.

Only use captures that are cleared to be public: no personal data, hostnames, addresses or build details in the pixels.

## Fonts

Big Shoulders Display (headlines), Inter Tight (body), JetBrains Mono (labels) and Silkscreen (pixel accents), subset to Latin and served as woff2. All four are under the SIL Open Font License 1.1; the license texts are in `src/fonts/`.
