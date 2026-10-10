# created by kinjal
"""Remove the flat white background from generated art and export a 2x WebP.

Usage: python3 scripts/cutout.py <in.png> <out.webp> [--keep-bg] [--width N] [--key RRGGBB]
Flood-fills from the image border so white areas inside the art stay opaque.
"""
import sys
from collections import deque
from PIL import Image, ImageFilter

def cutout(im, tol=28, key=(255, 255, 255)):
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    mask = Image.new("L", (w, h), 255)
    mp = mask.load()
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        r, g, b, _ = px[x, y]
        dist = abs(r - key[0]) + abs(g - key[1]) + abs(b - key[2])
        if dist > tol * 3:
            continue
        mp[x, y] = 0
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                q.append((nx, ny))
    # soften the edge so pencil lines don't look jagged
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    im.putalpha(mask)
    bbox = mask.point(lambda v: 255 if v > 8 else 0).getbbox()
    return im.crop(bbox) if bbox else im

def main():
    src, out = sys.argv[1], sys.argv[2]
    keep = "--keep-bg" in sys.argv
    width = int(sys.argv[sys.argv.index("--width") + 1]) if "--width" in sys.argv else None
    im = Image.open(src)
    key = (255, 255, 255)
    tol = 28
    if "--key" in sys.argv:
        hx = sys.argv[sys.argv.index("--key") + 1].lstrip("#")
        key = tuple(int(hx[i:i + 2], 16) for i in (0, 2, 4))
        tol = 40
    if not keep:
        im = cutout(im, tol, key)
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(out, "WEBP", quality=82, method=6)
    print(out, im.size)

if __name__ == "__main__":
    main()
