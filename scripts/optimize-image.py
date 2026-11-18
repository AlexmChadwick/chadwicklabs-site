#!/usr/bin/env python3
"""Downscale a screenshot into WebP (one per width) plus a PNG fallback.

Usage: scripts/optimize-image.py SRC NAME WIDTH [WIDTH ...]

Writes src/img/NAME-<w>.webp for every width and src/img/NAME.png at the
smallest width. Widths larger than the source are clamped, never upscaled.
Pixels are copied into a fresh image, so EXIF, ICC, XMP and text chunks are
dropped. The PNG stays truecolor (only IHDR, IDAT and IEND chunks) and is only
fetched by browsers without WebP support. Set QUALITY (default 80) to
re-encode at a different WebP quality. Prints the final size of each file.
"""
import os
import sys
from pathlib import Path

from PIL import Image

src, name, *widths = sys.argv[1:]
root = Path(__file__).resolve().parent.parent
out = root / "src" / "img"
out.mkdir(parents=True, exist_ok=True)

im = Image.open(src)
im.load()
has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
if has_alpha and im.convert("RGBA").getextrema()[3][0] == 255:
    has_alpha = False  # alpha channel present but fully opaque
mode = "RGBA" if has_alpha else "RGB"
im = im.convert(mode)
# Fresh image with no info dict: nothing from the source file survives.
clean = Image.frombytes(mode, im.size, im.tobytes())

def resized(w):
    w = min(int(w), clean.width)
    h = round(clean.height * w / clean.width)
    if w == clean.width:
        return Image.frombytes(mode, clean.size, clean.tobytes())
    return clean.resize((w, h), Image.LANCZOS)

ws = sorted({min(int(w), clean.width) for w in widths})
for w in ws:
    r = resized(w)
    p = out / f"{name}-{w}.webp"
    r.save(p, "WEBP", quality=int(os.environ.get("QUALITY", "80")), method=6, exif=b"", icc_profile=b"", xmp=b"")
    print(p.name, r.size, p.stat().st_size)

r = resized(ws[0])
p = out / f"{name}.png"
r.save(p, "PNG", optimize=True)
print(p.name, r.size, p.stat().st_size)
