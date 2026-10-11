// Main-thread side of the on-device AI eraser (see lama.worker.ts).

export const LAMA_SIZE = 512;

export type EraserStatus =
  | { state: "idle" }
  | { state: "downloading"; progress: number }
  | { state: "ready"; provider: string }
  | { state: "failed"; message: string };

let worker: Worker | null = null;
let status: EraserStatus = { state: "idle" };
const listeners = new Set<(s: EraserStatus) => void>();
const pending = new Map<number, { resolve: (out: Uint8ClampedArray) => void; reject: (e: Error) => void; timer?: number }>();
/** Once the model is loaded, a single fill should take a few seconds. Past this, assume the GPU hung. */
const RUN_TIMEOUT_MS = 25_000;

function settle(id: number) {
  const p = pending.get(id);
  if (p?.timer) clearTimeout(p.timer);
  pending.delete(id);
  return p;
}

function armTimer(id: number) {
  const p = pending.get(id);
  if (!p || p.timer) return;
  p.timer = window.setTimeout(() => {
    // Start over with a fresh worker next time; this request falls back to the built-in eraser.
    worker?.terminate();
    worker = null;
    status = { state: "idle" };
    pending.forEach((q, qid) => {
      settle(qid);
      q.reject(new Error("The AI eraser stopped responding."));
    });
  }, RUN_TIMEOUT_MS);
}
let seq = 0;

function setStatus(s: EraserStatus) {
  status = s;
  listeners.forEach((l) => l(s));
}

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("./lama.worker.ts", import.meta.url));
  worker.onmessage = (e: MessageEvent) => {
    const m = e.data;
    if (m.type === "progress") setStatus({ state: "downloading", progress: m.loaded / m.total });
    else if (m.type === "ready") {
      setStatus({ state: "ready", provider: m.provider });
      pending.forEach((_, id) => armTimer(id));
    }
    else if (m.type === "failed") {
      setStatus({ state: "failed", message: m.message });
      pending.forEach((p) => p.reject(new Error(m.message)));
      pending.clear();
    } else if (m.type === "result") {
      settle(m.id)?.resolve(m.out);
    } else if (m.type === "error") {
      settle(m.id)?.reject(new Error(m.message));
    }
  };
  worker.onerror = () => {
    setStatus({ state: "failed", message: "The eraser could not start." });
    pending.forEach((p) => p.reject(new Error("The eraser could not start.")));
    pending.clear();
  };
  return worker;
}

export function eraserStatus() {
  return status;
}

export function onEraserStatus(cb: (s: EraserStatus) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Starts downloading the model early, e.g. while the scan runs. */
export function preloadEraser() {
  if (typeof Worker === "undefined" || status.state === "failed") return;
  if (status.state === "idle") setStatus({ state: "downloading", progress: 0 });
  getWorker().postMessage({ type: "load" });
}

/** Fills the masked pixels of a 512 x 512 RGBA crop. Rejects if the model is unavailable. */
export function lamaFill(rgba: Uint8ClampedArray, mask: Uint8Array): Promise<Uint8ClampedArray> {
  if (status.state === "failed") return Promise.reject(new Error(status.message));
  preloadEraser();
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    if (status.state === "ready") armTimer(id);
    getWorker().postMessage({ type: "run", id, rgba, mask }, [rgba.buffer, mask.buffer]);
  });
}
