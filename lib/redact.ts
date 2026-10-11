// Bakes redactions into the pixels of a photo, so the saved file is safe on its own.
// Redrawing on a canvas also means the exported JPEG carries no EXIF.

export type RedactStyle = "blur" | "pixelate" | "erase";
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Detection boxes are approximate, so grow each one a little before hiding it. */
const PAD = 0.015;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Average color of a thin ring just outside the box, used to paint the object out. */
function surroundColor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, W: number, H: number): string {
  const ring = 6;
  const strips = [
    [x, y - ring, w, ring],
    [x, y + h, w, ring],
    [x - ring, y, ring, h],
    [x + w, y, ring, h],
  ];
  let r = 0, g = 0, b = 0, n = 0;
  for (const [sx, sy, sw, sh] of strips) {
    const cx = Math.max(0, sx), cy = Math.max(0, sy);
    const cw = Math.min(W, sx + sw) - cx, ch = Math.min(H, sy + sh) - cy;
    if (cw <= 0 || ch <= 0) continue;
    const d = ctx.getImageData(cx, cy, cw, ch).data;
    for (let i = 0; i < d.length; i += 4) {
      r += d[i];
      g += d[i + 1];
      b += d[i + 2];
      n++;
    }
  }
  if (!n) return "rgb(128,128,128)";
  return `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
}

/** Returns a JPEG data URL with every box blurred, pixelated or painted out. */
export async function redact(src: string, boxes: Box[], style: RedactStyle): Promise<string> {
  const img = await loadImage(src);
  const W = img.naturalWidth, H = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d")!;

  for (const b of boxes) {
    const x = Math.max(0, Math.floor((b.x - PAD) * W));
    const y = Math.max(0, Math.floor((b.y - PAD) * H));
    const w = Math.min(W - x, Math.ceil((b.w + PAD * 2) * W));
    const h = Math.min(H - y, Math.ceil((b.h + PAD * 2) * H));
    if (w < 2 || h < 2) continue;

    if (style === "erase") {
      ctx.fillStyle = surroundColor(ctx, x, y, w, h, W, H);
      ctx.fillRect(x, y, w, h);
      continue;
    }
    // Shrink the region to a handful of cells and scale it back up:
    // smooth scaling reads as a heavy blur, nearest-neighbour as pixel blocks.
    const cells = style === "pixelate" ? 14 : 6;
    const cell = Math.max(w, h) / cells;
    tmp.width = Math.max(1, Math.round(w / cell));
    tmp.height = Math.max(1, Math.round(h / cell));
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(canvas, x, y, w, h, 0, 0, tmp.width, tmp.height);
    ctx.imageSmoothingEnabled = style === "blur";
    ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, w, h);
    ctx.imageSmoothingEnabled = true;
  }
  return canvas.toDataURL("image/jpeg", 0.9);
}
