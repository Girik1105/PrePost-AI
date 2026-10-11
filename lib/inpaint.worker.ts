// Runs content-aware fill off the main thread so the page stays responsive.
import { inpaint } from "./inpaint";

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage: (message: unknown, transfer: Transferable[]) => void;
};

ctx.onmessage = (e: MessageEvent<{ id: number; data: Uint8ClampedArray; w: number; h: number; mask: Uint8Array }>) => {
  const { id, data, w, h, mask } = e.data;
  const out = inpaint(data, w, h, mask);
  ctx.postMessage({ id, out }, [out.buffer]);
};
