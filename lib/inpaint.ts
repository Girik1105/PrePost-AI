// Content-aware fill. Rebuilds masked pixels from the texture around them, so an ID card
// on a wooden table turns back into wood. Multi-scale PatchMatch with EM voting
// (Wexler et al. 2007, Barnes et al. 2009). Pure function: runs in a worker or inline.

const R = 3; // patch radius, so patches are 7 x 7
const AREA = (2 * R + 1) * (2 * R + 1);

interface Level {
  w: number;
  h: number;
  img: Float32Array; // RGB
  mask: Uint8Array; // 1 = unknown, must be filled and never used as a source
}

function downsample(l: Level): Level {
  const w = Math.ceil(l.w / 2), h = Math.ceil(l.h / 2);
  const img = new Float32Array(w * h * 3);
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0, n = 0, hole = false;
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const sx = 2 * x + dx, sy = 2 * y + dy;
          if (sx >= l.w || sy >= l.h) continue;
          const i = sy * l.w + sx;
          if (l.mask[i]) hole = true;
          r += l.img[i * 3];
          g += l.img[i * 3 + 1];
          b += l.img[i * 3 + 2];
          n++;
        }
      }
      const j = y * w + x;
      mask[j] = hole ? 1 : 0;
      img[j * 3] = r / n;
      img[j * 3 + 1] = g / n;
      img[j * 3 + 2] = b / n;
    }
  }
  return { w, h, img, mask };
}

/** Rough first guess for the coarsest level: grow known colors inward, ring by ring. */
function onionFill(l: Level) {
  const { w, h, img } = l;
  const m = l.mask.slice();
  for (;;) {
    const ring: [number, number, number, number][] = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!m[i]) continue;
        let r = 0, g = 0, b = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx, yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            const k = yy * w + xx;
            if (m[k]) continue;
            r += img[k * 3];
            g += img[k * 3 + 1];
            b += img[k * 3 + 2];
            n++;
          }
        }
        if (n) ring.push([i, r / n, g / n, b / n]);
      }
    }
    if (!ring.length) return;
    for (const [i, r, g, b] of ring) {
      img[i * 3] = r;
      img[i * 3 + 1] = g;
      img[i * 3 + 2] = b;
      m[i] = 0;
    }
  }
}

function solveLevel(l: Level, prev: Level | null, prevNNF: Int32Array | null, iters: number, finest: boolean): Int32Array {
  const { w, h, img, mask } = l;
  const n = w * h;

  // A source patch must sit fully inside the image and fully on known pixels.
  const srcOK = new Uint8Array(n);
  const sources: number[] = [];
  for (let y = R; y < h - R; y++) {
    for (let x = R; x < w - R; x++) {
      let ok = 1;
      for (let dy = -R; dy <= R && ok; dy++) for (let dx = -R; dx <= R; dx++) if (mask[(y + dy) * w + x + dx]) { ok = 0; break; }
      if (ok) {
        srcOK[y * w + x] = 1;
        sources.push(y * w + x);
      }
    }
  }

  // Targets: every pixel whose patch touches an unknown pixel.
  const isTarget = new Uint8Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -R; dy <= R; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx;
          if (xx >= 0 && xx < w) isTarget[yy * w + xx] = 1;
        }
      }
    }
  }
  const targets: number[] = [];
  for (let i = 0; i < n; i++) if (isTarget[i]) targets.push(i);

  const nnf = new Int32Array(n).fill(-1);
  if (!sources.length) return nnf; // nothing to copy from; keep the rough fill

  const randomSource = () => sources[(Math.random() * sources.length) | 0];

  const dist = (t: number, s: number, cutoff: number) => {
    const tx = t % w, ty = (t / w) | 0, sx = s % w, sy = (s / w) | 0;
    const limit = cutoff * AREA;
    let d = 0, cnt = 0;
    for (let dy = -R; dy <= R; dy++) {
      const yy = ty + dy;
      if (yy < 0 || yy >= h) continue;
      for (let dx = -R; dx <= R; dx++) {
        const xx = tx + dx;
        if (xx < 0 || xx >= w) continue;
        const a = (yy * w + xx) * 3, b = ((sy + dy) * w + sx + dx) * 3;
        const dr = img[a] - img[b], dg = img[a + 1] - img[b + 1], db = img[a + 2] - img[b + 2];
        d += dr * dr + dg * dg + db * db;
        cnt++;
      }
      if (d > limit) return Infinity;
    }
    return d / cnt;
  };

  // Seed the nearest-neighbour field, from the coarser level when there is one.
  for (const t of targets) {
    let s = -1;
    if (prev && prevNNF) {
      const x = t % w, y = (t / w) | 0;
      const px = Math.min(prev.w - 1, x >> 1), py = Math.min(prev.h - 1, y >> 1);
      const ps = prevNNF[py * prev.w + px];
      if (ps >= 0) {
        const sx = Math.min(w - 1 - R, Math.max(R, (ps % prev.w) * 2 + (x & 1)));
        const sy = Math.min(h - 1 - R, Math.max(R, ((ps / prev.w) | 0) * 2 + (y & 1)));
        if (srcOK[sy * w + sx]) s = sy * w + sx;
      }
    }
    nnf[t] = s >= 0 ? s : randomSource();
  }
  const nnd = new Float32Array(n);

  const patchMatch = (passes: number) => {
    for (const t of targets) nnd[t] = dist(t, nnf[t], Infinity);
    for (let p = 0; p < passes; p++) {
      const dir = p % 2 === 0 ? 1 : -1;
      for (let k = 0; k < targets.length; k++) {
        const t = targets[dir === 1 ? k : targets.length - 1 - k];
        const tx = t % w, ty = (t / w) | 0;
        let best = nnf[t], bd = nnd[t];
        // Propagation: a neighbour's good match, shifted by one, is often good here too.
        const nx = tx - dir, ny = ty - dir;
        if (nx >= 0 && nx < w && isTarget[ty * w + nx]) {
          const c = nnf[ty * w + nx] + dir;
          if (c >= 0 && c < n && srcOK[c]) {
            const d = dist(t, c, bd);
            if (d < bd) { best = c; bd = d; }
          }
        }
        if (ny >= 0 && ny < h && isTarget[ny * w + tx]) {
          const c = nnf[ny * w + tx] + dir * w;
          if (c >= 0 && c < n && srcOK[c]) {
            const d = dist(t, c, bd);
            if (d < bd) { best = c; bd = d; }
          }
        }
        // Random search in shrinking windows around the current best.
        for (let rad = Math.max(w, h); rad >= 1; rad >>= 1) {
          const bx = best % w, by = (best / w) | 0;
          const cx = Math.min(w - 1 - R, Math.max(R, bx + Math.round((Math.random() * 2 - 1) * rad)));
          const cy = Math.min(h - 1 - R, Math.max(R, by + Math.round((Math.random() * 2 - 1) * rad)));
          const c = cy * w + cx;
          if (!srcOK[c]) continue;
          const d = dist(t, c, bd);
          if (d < bd) { best = c; bd = d; }
        }
        nnf[t] = best;
        nnd[t] = bd;
      }
    }
  };

  const vote = (sharp: boolean) => {
    const acc = new Float32Array(n * 3);
    const wsum = new Float32Array(n);
    const bestD = new Float32Array(n).fill(Infinity);
    const sorted = targets.map((t) => nnd[t]).sort((a, b) => a - b);
    const sigma = (sorted[(sorted.length * 0.75) | 0] || 1) + 1e-3;
    for (const t of targets) {
      const s = nnf[t];
      const tx = t % w, ty = (t / w) | 0, sx = s % w, sy = (s / w) | 0;
      const wt = Math.exp(-nnd[t] / (2 * sigma));
      for (let dy = -R; dy <= R; dy++) {
        const yy = ty + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -R; dx <= R; dx++) {
          const xx = tx + dx;
          if (xx < 0 || xx >= w) continue;
          const x = yy * w + xx;
          if (!mask[x]) continue;
          const src = ((sy + dy) * w + sx + dx) * 3;
          if (sharp) {
            // Final pass: each pixel takes its color from the single best patch, which keeps grain sharp.
            if (nnd[t] < bestD[x]) {
              bestD[x] = nnd[t];
              acc[x * 3] = img[src];
              acc[x * 3 + 1] = img[src + 1];
              acc[x * 3 + 2] = img[src + 2];
              wsum[x] = 1;
            }
          } else {
            acc[x * 3] += wt * img[src];
            acc[x * 3 + 1] += wt * img[src + 1];
            acc[x * 3 + 2] += wt * img[src + 2];
            wsum[x] += wt;
          }
        }
      }
    }
    for (let x = 0; x < n; x++) {
      if (!mask[x] || !wsum[x]) continue;
      img[x * 3] = acc[x * 3] / wsum[x];
      img[x * 3 + 1] = acc[x * 3 + 1] / wsum[x];
      img[x * 3 + 2] = acc[x * 3 + 2] / wsum[x];
    }
  };

  for (let it = 0; it < iters; it++) {
    patchMatch(it === 0 && !prev ? 4 : 2);
    vote(finest && it === iters - 1);
  }
  return nnf;
}

/**
 * Fills every pixel where mask is 1. rgba is width * height * 4.
 * Returns a new RGBA buffer; known pixels are left untouched.
 */
export function inpaint(rgba: Uint8ClampedArray, w: number, h: number, mask: Uint8Array): Uint8ClampedArray {
  const img = new Float32Array(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    img[i * 3] = rgba[i * 4];
    img[i * 3 + 1] = rgba[i * 4 + 1];
    img[i * 3 + 2] = rgba[i * 4 + 2];
  }
  const levels: Level[] = [{ w, h, img, mask }];
  // Stop while the coarsest level still has plenty of clean texture to copy from.
  while (Math.min(levels[levels.length - 1].w, levels[levels.length - 1].h) / 2 >= 48 && levels.length < 9) {
    levels.push(downsample(levels[levels.length - 1]));
  }
  onionFill(levels[levels.length - 1]);

  let prev: Level | null = null;
  let prevNNF: Int32Array | null = null;
  for (let li = levels.length - 1; li >= 0; li--) {
    const l = levels[li];
    if (prev) {
      // Start the unknown pixels from the coarser solution.
      for (let y = 0; y < l.h; y++) {
        for (let x = 0; x < l.w; x++) {
          const i = y * l.w + x;
          if (!l.mask[i]) continue;
          const p = Math.min(prev.h - 1, y >> 1) * prev.w + Math.min(prev.w - 1, x >> 1);
          l.img[i * 3] = prev.img[p * 3];
          l.img[i * 3 + 1] = prev.img[p * 3 + 1];
          l.img[i * 3 + 2] = prev.img[p * 3 + 2];
        }
      }
    }
    const iters = li === levels.length - 1 ? 8 : li === 0 ? 3 : 5;
    prevNNF = solveLevel(l, prev, prevNNF, iters, li === 0);
    prev = l;
  }

  const out = new Uint8ClampedArray(rgba);
  for (let i = 0; i < w * h; i++) {
    if (!mask[i]) continue;
    out[i * 4] = img[i * 3];
    out[i * 4 + 1] = img[i * 3 + 1];
    out[i * 4 + 2] = img[i * 3 + 2];
    out[i * 4 + 3] = 255;
  }
  return out;
}
