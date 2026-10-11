// Runs LaMa (an open object-removal model) on the viewer's own device with ONNX Runtime Web.
// The photo never leaves the browser; only the model file is downloaded, once, then cached.

const ORT_VERSION = "1.30.0";
const ORT_BASE = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
const MODEL_URL = "https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx";
const CACHE = "safepost-lama-v1";
const SIZE = 512;

interface OrtTensor {
  data: Float32Array;
}
interface OrtSession {
  run(feeds: Record<string, OrtTensor>): Promise<Record<string, OrtTensor>>;
  outputNames: string[];
}
interface Ort {
  env: { wasm: { wasmPaths: string; numThreads: number } };
  Tensor: new (type: "float32", data: Float32Array, dims: number[]) => OrtTensor;
  InferenceSession: { create(model: Uint8Array, opts: { executionProviders: string[] }): Promise<OrtSession> };
}

const scope = self as unknown as {
  importScripts: (url: string) => void;
  ort: Ort;
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
  navigator: Navigator & { gpu?: unknown };
};

let model: Uint8Array | null = null;
let session: OrtSession | null = null;
let provider = "";
let loading: Promise<void> | null = null;

async function download(): Promise<Uint8Array> {
  const cache = await caches.open(CACHE).catch(() => null);
  const hit = await cache?.match(MODEL_URL);
  if (hit) return new Uint8Array(await hit.arrayBuffer());

  const res = await fetch(MODEL_URL);
  if (!res.ok || !res.body) throw new Error(`Model download failed (${res.status})`);
  const total = Number(res.headers.get("content-length")) || 208_044_816;
  const reader = res.body.getReader();
  const buf = new Uint8Array(total);
  let loaded = 0;
  let lastSent = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf.set(value, loaded);
    loaded += value.length;
    if (loaded - lastSent > total / 100) {
      lastSent = loaded;
      scope.postMessage({ type: "progress", loaded, total });
    }
  }
  const bytes = buf.subarray(0, loaded);
  await cache?.put(MODEL_URL, new Response(bytes)).catch(() => undefined);
  return bytes;
}

async function makeSession(useGpu: boolean) {
  session = await scope.ort.InferenceSession.create(model!, { executionProviders: useGpu ? ["webgpu"] : ["wasm"] });
  provider = useGpu ? "webgpu" : "wasm";
}

function load() {
  loading ??= (async () => {
    scope.importScripts(`${ORT_BASE}ort.webgpu.min.js`);
    scope.ort.env.wasm.wasmPaths = ORT_BASE;
    scope.ort.env.wasm.numThreads = 1; // threads need cross-origin isolation, which this site does not set
    model = await download();
    try {
      if (!scope.navigator.gpu) throw new Error("no WebGPU");
      await makeSession(true);
    } catch {
      await makeSession(false);
    }
    scope.postMessage({ type: "ready", provider });
  })().catch((err: unknown) => {
    loading = null;
    scope.postMessage({ type: "failed", message: err instanceof Error ? err.message : String(err) });
    throw err;
  });
  return loading;
}

async function infer(rgba: Uint8ClampedArray, mask: Uint8Array): Promise<Uint8ClampedArray> {
  const n = SIZE * SIZE;
  const img = new Float32Array(3 * n);
  const msk = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    img[i] = rgba[i * 4] / 255;
    img[n + i] = rgba[i * 4 + 1] / 255;
    img[2 * n + i] = rgba[i * 4 + 2] / 255;
    msk[i] = mask[i] ? 1 : 0;
  }
  const feeds = {
    image: new scope.ort.Tensor("float32", img, [1, 3, SIZE, SIZE]),
    mask: new scope.ort.Tensor("float32", msk, [1, 1, SIZE, SIZE]),
  };
  let result: Record<string, OrtTensor>;
  try {
    result = await session!.run(feeds);
  } catch (err) {
    // Some GPUs lack an op LaMa needs; retry once on the CPU.
    if (provider !== "webgpu") throw err;
    await makeSession(false);
    result = await session!.run(feeds);
  }
  const out = result[session!.outputNames[0]].data;
  // LaMa returns 0..255 values in CHW order.
  const rgbaOut = new Uint8ClampedArray(4 * n);
  for (let i = 0; i < n; i++) {
    rgbaOut[i * 4] = out[i];
    rgbaOut[i * 4 + 1] = out[n + i];
    rgbaOut[i * 4 + 2] = out[2 * n + i];
    rgbaOut[i * 4 + 3] = 255;
  }
  return rgbaOut;
}

scope.onmessage = async (e: MessageEvent<{ type: "load" } | { type: "run"; id: number; rgba: Uint8ClampedArray; mask: Uint8Array }>) => {
  const msg = e.data;
  if (msg.type === "load") {
    load().catch(() => undefined);
    return;
  }
  try {
    await load();
    const t0 = performance.now();
    const out = await infer(msg.rgba, msg.mask);
    scope.postMessage({ type: "result", id: msg.id, out, ms: Math.round(performance.now() - t0), provider }, [out.buffer]);
  } catch (err) {
    scope.postMessage({ type: "error", id: msg.id, message: err instanceof Error ? err.message : String(err) });
  }
};
