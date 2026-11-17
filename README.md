# chadwicklabs.com

Alex Chadwick's index of works. A static site: plain HTML and CSS, one small script for the optional theme toggle, self-hosted fonts, no third-party requests.

## Layout

- `src/` is the site. `index.html`, `404.html`, `styles.css`, `theme.js`, fonts, icons, `og.png`, `robots.txt` and `sitemap.xml`.
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

Entries live in `src/index.html` inside `<ol class="index">`, numbered 01, 02 and so on, with matching rows in the hero contents list. Live things go first. If you add or remove one, update the numbers, the contents list and the "08 entries" note, then re-run `scripts/render-assets.mjs` to refresh `og.png`.

To pull the Toontown entry quickly, delete both elements marked `data-pending="toontown"`, renumber, and re-run `scripts/render-assets.mjs`.

## Fonts

Fraunces, Inter Tight and JetBrains Mono, subset to Latin and served as woff2. All three are under the SIL Open Font License 1.1; the license texts are in `src/fonts/`.
