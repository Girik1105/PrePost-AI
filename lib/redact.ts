// Bakes redactions into the pixels of a photo, so the saved file is safe on its own.
// Redrawing on a canvas also means the exported JPEG carries no EXIF.
import { inpaint } from "./inpaint";
import { LAMA_SIZE, lamaFill } from "./lama";

export type RedactStyle = "blur" | "pixelate" | "erase";
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Detection boxes are approximate, so grow each one a little before hiding it. */
const PAD = 0.008;
const PAD_PX = 4;
/** Erased areas fade into the photo over this many pixels so no hard rectangle shows. */
const FEATHER = 6;
/** Erase rebuilds texture, not people. Boxes bigger than this share of the photo get blurred instead. */
const MAX_ERASE_SHARE = 0.1;
/** Content-aware fill works on at most this many hole pixels; bigger holes are solved smaller and scaled up. */
const MAX_HOLE_PX = 45_000;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function toRect(b: Box, W: number, H: number): Rect {
  const x = Math.max(0, Math.floor((b.x - PAD) * W) - PAD_PX);
  const y = Math.max(0, Math.floor((b.y - PAD) * H) - PAD_PX);
  return {
    x,
    y,
    w: Math.min(W - x, Math.ceil((b.w + PAD * 2) * W) + PAD_PX * 2),
    h: Math.min(H - y, Math.ceil((b.h + PAD * 2) * H) + PAD_PX * 2),
  };
}

/** Draws the filled crop over the photo through a soft-edged mask of the box. */
function drawFeathered(ctx: CanvasRenderingContext2D, fill: HTMLCanvasElement, crop: Rect, rect: Rect) {
  const layer = document.createElement("canvas");
  layer.width = crop.w;
  layer.height = crop.h;
  const lctx = layer.getContext("2d")!;
  lctx.drawImage(fill, 0, 0, fill.width, fill.height, 0, 0, crop.w, crop.h);
  // The fill is solid inside the box and fades out across a band just outside it,
  // so every original pixel of the object stays fully covered.
  const mask = document.createElement("canvas");
  mask.width = crop.w;
  mask.height = crop.h;
  const mctx = mask.getContext("2d")!;
  mctx.filter = `blur(${FEATHER / 2}px)`;
  mctx.fillStyle = "#000";
  mctx.fillRect(rect.x - crop.x - FEATHER / 2, rect.y - crop.y - FEATHER / 2, rect.w + FEATHER, rect.h + FEATHER);
  mctx.filter = "none";
  mctx.fillRect(rect.x - crop.x, rect.y - crop.y, rect.w, rect.h);
  lctx.globalCompositeOperation = "destination-in";
  lctx.drawImage(mask, 0, 0);
  ctx.drawImage(layer, crop.x, crop.y);
}

// One shared worker for content-aware fill. Falls back to the main thread if workers are unavailable.
let worker: Worker | null | undefined;
let seq = 0;
const pending = new Map<number, (out: Uint8ClampedArray) => void>();

function runInpaint(data: Uint8ClampedArray, w: number, h: number, mask: Uint8Array): Promise<Uint8ClampedArray> {
  if (worker === undefined) {
    try {
      worker = new Worker(new URL("./inpaint.worker.ts", import.meta.url));
      worker.onmessage = (e: MessageEvent<{ id: number; out: Uint8ClampedArray }>) => {
        pending.get(e.data.id)?.(e.data.out);
        pending.delete(e.data.id);
      };
    } catch {
      worker = null;
    }
  }
  if (!worker) return Promise.resolve(inpaint(data, w, h, mask));
  const id = ++seq;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    worker!.postMessage({ id, data, w, h, mask }, [data.buffer, mask.buffer]);
  });
}

// Fills are expensive, so keep them per photo + box. Every detected box is excluded as a
// source, so a fill never depends on which boxes are switched on, only on where they all are.
const fillCache = new Map<string, { canvas: HTMLCanvasElement; crop: Rect }>();
const inflight = new Map<string, Promise<{ canvas: HTMLCanvasElement; crop: Rect }>>();

/** The area around a box that the fill learns texture from. */
function cropFor(rect: Rect, W: number, H: number): Rect {
  const margin = Math.round(Math.max(rect.w, rect.h) * 0.9) + 24;
  const x = Math.max(0, rect.x - margin), y = Math.max(0, rect.y - margin);
  return { x, y, w: Math.min(W, rect.x + rect.w + margin) - x, h: Math.min(H, rect.y + rect.h + margin) - y };
}

async function eraseFill(img: HTMLImageElement, key: string, rect: Rect, crop: Rect, avoid: Rect[]) {
  const hit = fillCache.get(key);
  if (hit) return hit;
  const scale = Math.min(1, Math.sqrt(MAX_HOLE_PX / (rect.w * rect.h)), 700 / Math.max(crop.w, crop.h));
  const w = Math.max(8, Math.round(crop.w * scale)), h = Math.max(8, Math.round(crop.h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);

  // Unknown = inside any sensitive box. Those pixels are rebuilt and never copied from.
  const mask = new Uint8Array(w * h);
  for (const a of avoid) {
    const x0 = Math.max(0, Math.floor((a.x - crop.x) * scale) - 1), x1 = Math.min(w, Math.ceil((a.x + a.w - crop.x) * scale) + 1);
    const y0 = Math.max(0, Math.floor((a.y - crop.y) * scale) - 1), y1 = Math.min(h, Math.ceil((a.y + a.h - crop.y) * scale) + 1);
    for (let y = y0; y < y1; y++) mask.fill(1, y * w + Math.max(0, x0), y * w + Math.max(0, x1));
  }

  const out = await runInpaint(data.data, w, h, mask);
  ctx.putImageData(new ImageData(new Uint8ClampedArray(out), w, h), 0, 0);
  const result = { canvas, crop };
  fillCache.set(key, result);
  return result;
}

/** Square area around a box that the AI eraser sees: the box plus plenty of surroundings. */
function aiCropFor(rect: Rect, W: number, H: number): Rect | null {
  const side = Math.min(Math.min(W, H), Math.max(320, Math.round(Math.max(rect.w, rect.h) * 2.4)));
  if (side < Math.max(rect.w, rect.h) + 16) return null;
  const x = Math.min(W - side, Math.max(0, Math.round(rect.x + rect.w / 2 - side / 2)));
  const y = Math.min(H - side, Math.max(0, Math.round(rect.y + rect.h / 2 - side / 2)));
  return { x, y, w: side, h: side };
}

/** On-device AI fill (LaMa). Masks every sensitive box in the crop, so none of them leak into the result. */
async function aiFill(img: HTMLImageElement, key: string, crop: Rect, avoid: Rect[]) {
  const hit = fillCache.get(key) ?? inflight.get(key);
  if (hit) return hit;
  const job = runAiFill(img, crop, avoid).then((r) => {
    fillCache.set(key, r);
    return r;
  });
  inflight.set(key, job);
  return job.finally(() => inflight.delete(key));
}

async function runAiFill(img: HTMLImageElement, crop: Rect, avoid: Rect[]) {
  const S = LAMA_SIZE, k = S / crop.w;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, S, S);
  const mask = new Uint8Array(S * S);
  for (const a of avoid) {
    const x0 = Math.max(0, Math.floor((a.x - crop.x) * k) - 2), x1 = Math.min(S, Math.ceil((a.x + a.w - crop.x) * k) + 2);
    const y0 = Math.max(0, Math.floor((a.y - crop.y) * k) - 2), y1 = Math.min(S, Math.ceil((a.y + a.h - crop.y) * k) + 2);
    for (let y = y0; y < y1; y++) if (x1 > x0) mask.fill(1, y * S + x0, y * S + x1);
  }
  const out = await lamaFill(ctx.getImageData(0, 0, S, S).data, mask);
  ctx.putImageData(new ImageData(new Uint8ClampedArray(out), S, S), 0, 0);
  return { canvas, crop };
}

/**
 * Returns a JPEG data URL with every hidden box blurred, pixelated or erased.
 * avoid lists every sensitive box in the photo, hidden or not, so erase never copies from them.
 */
export async function redact(
  src: string,
  boxes: Box[],
  style: RedactStyle,
  avoid: Box[] = boxes,
  onProgress?: (done: number, total: number) => void,
): Promise<string> {
  const img = await loadImage(src);
  const W = img.naturalWidth, H = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);

  if (style === "erase") {
    // Every sensitive box, once each, so cache keys don't change when a toggle flips.
    const seen = new Set<string>();
    const avoidRects = [...avoid, ...boxes]
      .map((b) => toRect(b, W, H))
      .filter((r) => {
        const k = `${r.x},${r.y},${r.w},${r.h}`;
        return !seen.has(k) && !!seen.add(k);
      })
      .sort((a, b) => a.y - b.y || a.x - b.x);
    const photoKey = `${src.length}:${src.slice(-48)}`;
    let done = 0;
    for (const b of boxes) {
      onProgress?.(done++, boxes.length);
      const rect = toRect(b, W, H);
      if (rect.w < 2 || rect.h < 2) continue;
      if (b.w * b.h > MAX_ERASE_SHARE) {
        blurRect(ctx, rect, "blur");
        continue;
      }
      const inside = (area: Rect) =>
        avoidRects.filter((a) => a.x < area.x + area.w && a.x + a.w > area.x && a.y < area.y + area.h && a.y + a.h > area.y);
      let filled: { canvas: HTMLCanvasElement; crop: Rect } | null = null;
      // Prefer the AI eraser; fall back to texture synthesis if the model can't run here.
      const aiArea = aiCropFor(rect, W, H);
      if (aiArea) {
        const near = inside(aiArea);
        filled = await aiFill(img, `ai|${photoKey}|${JSON.stringify(aiArea)}|${JSON.stringify(near)}`, aiArea, near).catch(() => null);
      }
      if (!filled) {
        const area = cropFor(rect, W, H);
        const near = inside(area);
        filled = await eraseFill(img, `${photoKey}|${JSON.stringify(rect)}|${JSON.stringify(near)}`, rect, area, near);
      }
      const { canvas: fill, crop } = filled;
      // Only this box (and a soft rim around it) is replaced; neighbours keep whatever their own toggle says.
      drawFeathered(ctx, fill, crop, rect);
    }
    return canvas.toDataURL("image/jpeg", 0.92);
  }

  for (const b of boxes) {
    const rect = toRect(b, W, H);
    if (rect.w >= 2 && rect.h >= 2) blurRect(ctx, rect, style);
  }
  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * Shrinks the region to a handful of cells and scales it back up:
 * smooth scaling reads as a heavy blur, nearest-neighbour as pixel blocks.
 */
function blurRect(ctx: CanvasRenderingContext2D, { x, y, w, h }: Rect, style: "blur" | "pixelate") {
  const tmp = document.createElement("canvas");
  const cells = style === "pixelate" ? 14 : 6;
  const cell = Math.max(w, h) / cells;
  tmp.width = Math.max(1, Math.round(w / cell));
  tmp.height = Math.max(1, Math.round(h / cell));
  const tctx = tmp.getContext("2d")!;
  tctx.drawImage(ctx.canvas, x, y, w, h, 0, 0, tmp.width, tmp.height);
  ctx.imageSmoothingEnabled = style === "blur";
  ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, w, h);
  ctx.imageSmoothingEnabled = true;
}
