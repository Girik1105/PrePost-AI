//created by kinjal
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowsHorizontal as ChevronsLeftRight, DownloadSimple as Download, ImageSquare as ImagePlus, CircleNotch as LoaderCircle, GpsSlash as MapPinOff, ArrowUUpRight as Redo2, ArrowCounterClockwise as RotateCcw, MagnifyingGlass as ScanSearch, Selection as SquareDashedMousePointer, Trash as Trash2, ArrowUUpLeft as Undo2, UploadSimple as Upload } from "@phosphor-icons/react/dist/ssr";
import { CATEGORY_ICON } from "@/components/prototype/screens/Detail";
import { VERDICT_LABEL, scoreWord, type Category, type Verdict } from "@/lib/scenes";
import { redact, type Box, type RedactStyle } from "@/lib/redact";
import HideMethodPicker from "./HideMethodPicker";
import ShareBar from "./ShareBar";
import FileDataCard from "./FileDataCard";
import { readFileData, type FileData } from "@/lib/fileData";
import { onEraserStatus, preloadEraser, eraserStatus, type EraserStatus } from "@/lib/lama";

interface Item {
  id: string;
  label: string;
  category: Category;
  reason?: string;
  box: Box;
  hidden: boolean;
  manual?: boolean;
}

interface Summary {
  exposureScore: number;
  verdict: Exclude<Verdict, null> | null;
  whyItMatters: string;
}

type Phase = "idle" | "scanning" | "ready" | "error";
type Tool = "compare" | "draw";

const STATUS = ["Removing location data", "Looking for names, numbers and places", "Deciding what to hide"];

const STEPS = [
  { Icon: MapPinOff, title: "Location comes off", body: "Your browser strips GPS, device and time data before anything is sent." },
  { Icon: ScanSearch, title: "Risky details get found", body: "Names, numbers, cards, signs, plus anything you mark yourself." },
  { Icon: Download, title: "You save a clean copy", body: "Blur, pixelate or erase each one, then download the safe version." },
];

const VERDICT_INK: Record<Exclude<Verdict, null>, string> = { safe: "ink-safe", caution: "ink-caution", dont_post: "ink-danger" };

/** Redraws the photo on a canvas, which drops EXIF (location, device, time). */
function toJpeg(bitmap: ImageBitmap, maxSide: number, quality: number): { url: string; width: number; height: number } {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return { url: canvas.toDataURL("image/jpeg", quality), width: canvas.width, height: canvas.height };
}

function scoreInk(score: number) {
  if (score >= 80) return "text-danger";
  if (score >= 40) return "text-caution";
  return "text-safe";
}

/** Visual on/off knob. The row around it is the actual button. */
function Knob({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-integrity" : "bg-line"}`}>
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-[left] ${on ? "left-[22px]" : "left-0.5"}`} />
    </span>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full border border-line bg-paper2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            value === o.id ? "bg-card text-ink shadow-soft" : "text-muted hover:text-ink"
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function PhotoChecker() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState("photo");
  const [original, setOriginal] = useState<string | null>(null);
  const [safe, setSafe] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  // undefined until the file has been read; null when it could not be read.
  const [fileData, setFileData] = useState<FileData | null | undefined>(undefined);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<RedactStyle>("erase");
  const [rendering, setRendering] = useState(false);
  const [eraser, setEraser] = useState<EraserStatus>({ state: "idle" });
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // Undo history for every change to the list: toggles, new boxes, deletions.
  const [past, setPast] = useState<Item[][]>([]);
  const [future, setFuture] = useState<Item[][]>([]);
  const [tool, setTool] = useState<Tool>("compare");
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState(0);
  const [draft, setDraft] = useState<Box | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const photoBox = useRef<HTMLDivElement>(null);
  const [photoMaxH, setPhotoMaxH] = useState<number | null>(null);
  const prevPhase = useRef<Phase>("idle");
  const drawStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    fetch("/api/scan")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    setEraser(eraserStatus());
    return onEraserStatus(setEraser);
  }, []);

  // When a photo comes in, bring the whole workspace into view once, so photo and panel fit the window.
  useEffect(() => {
    const from = prevPhase.current;
    prevPhase.current = phase;
    if ((from === "idle" || from === "error" || from === "scanning") && (phase === "scanning" || phase === "ready") && from !== phase) {
      requestAnimationFrame(() => {
        const el = workspace.current;
        if (!el) return;
        // Just under the fixed nav, so the summary strip is never tucked behind it.
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: reduce ? "auto" : "smooth" });
      });
    }
  }, [phase, reduce]);

  // On wide screens the photo gets exactly the room its card has left, measured live.
  useEffect(() => {
    const box = photoBox.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const measure = () => setPhotoMaxH(wide.matches ? Math.max(240, Math.floor(box.clientHeight) - 26) : null);
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    wide.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, [phase]);

  // Step through the status lines while the scan runs.
  useEffect(() => {
    if (phase !== "scanning") return;
    setStatus(0);
    const t = setInterval(() => setStatus((s) => Math.min(s + 1, STATUS.length - 1)), 2200);
    return () => clearInterval(t);
  }, [phase]);

  // Bake the current choices into a fresh safe copy.
  useEffect(() => {
    if (!original || phase !== "ready") return;
    let stale = false;
    setRendering(true);
    redact(
      original,
      items.filter((i) => i.hidden).map((i) => i.box),
      style,
      items.map((i) => i.box),
      (done, total) => !stale && setProgress({ done, total }),
    )
      .then((url) => !stale && setSafe(url))
      .catch(() => !stale && setSafe(null))
      .finally(() => {
        if (stale) return;
        setRendering(false);
        setProgress(null);
      });
    return () => {
      stale = true;
    };
  }, [original, items, style, phase]);

  const commit = (next: Item[]) => {
    setPast((p) => [...p, items]);
    setFuture([]);
    setItems(next);
  };
  const undo = () => {
    if (!past.length) return;
    setFuture((f) => [items, ...f]);
    setItems(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
  };
  const redo = () => {
    if (!future.length) return;
    setPast((p) => [...p, items]);
    setItems(future[0]);
    setFuture((f) => f.slice(1));
  };
  const toggle = (id: string) => commit(items.map((x) => (x.id === id ? { ...x, hidden: !x.hidden } : x)));

  // Cmd/Ctrl+Z to undo, Shift+Cmd/Ctrl+Z or Ctrl+Y to redo.
  useEffect(() => {
    if (phase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.target instanceof Element && e.target.closest("input:not([type=range]), textarea")) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const reset = () => {
    setPast([]);
    setFuture([]);
    setActive(null);
    setPhase("idle");
    setOriginal(null);
    setSafe(null);
    setItems([]);
    setSummary(null);
    setFileData(undefined);
    setNotice(null);
    setError(null);
    setTool("compare");
    setSplit(50);
  };

  const start = useCallback(
    async (file: File) => {
      reset();
      if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) {
        setError("That file isn't a photo. Choose a JPEG, PNG or HEIC image.");
        setPhase("error");
        return;
      }
      // Read what the original file carries before the canvas redraw drops it.
      const fileDataRead = readFileData(file);
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(file);
      } catch {
        setError("Your browser can't open this photo format. Try a JPEG or PNG.");
        setPhase("error");
        return;
      }
      const full = toJpeg(bitmap, 2400, 0.92).url;
      const forScan = toJpeg(bitmap, 1400, 0.85);
      setFileName(file.name.replace(/\.[^.]+$/, "") || "photo");
      // Fetch the on-device eraser while the scan runs, so it is ready when the results land.
      preloadEraser();
      setOriginal(full);
      setFileData(await fileDataRead);

      if (!enabled) {
        setNotice("Automatic scanning is off on this copy of the site. Draw a box over anything you want hidden.");
        setTool("draw");
        setPhase("ready");
        return;
      }

      setPhase("scanning");
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: forScan.url, width: forScan.width, height: forScan.height }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "The scan didn't finish.");
        const found: Item[] = data.detections.map(
          (d: { label: string; category: Category; reason: string; box: Box }, i: number) => ({ ...d, id: `ai-${i}`, hidden: true }),
        );
        setItems(found);
        setSummary({ exposureScore: data.exposureScore, verdict: data.verdict, whyItMatters: data.whyItMatters });
        if (!found.length) setNotice("Nothing personal found. If you spot something, draw a box over it.");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "The scan didn't finish.";
        setNotice(`${msg} You can still draw a box over anything you want hidden.`);
        setTool("draw");
      }
      setPhase("ready");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled],
  );

  const toFraction = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };
  const boxFrom = (a: { x: number; y: number }, b: { x: number; y: number }): Box => ({
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  });

  const onDown = (e: React.PointerEvent) => {
    if (tool !== "draw") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawStart.current = toFraction(e);
    setDraft({ ...drawStart.current, w: 0, h: 0 });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawStart.current) return;
    setDraft(boxFrom(drawStart.current, toFraction(e)));
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drawStart.current) return;
    const box = boxFrom(drawStart.current, toFraction(e));
    drawStart.current = null;
    setDraft(null);
    if (box.w < 0.015 || box.h < 0.015) return;
    commit([
      ...items,
      { id: `you-${Date.now()}`, label: `Your box ${items.filter((i) => i.manual).length + 1}`, category: "Identity", box, hidden: true, manual: true },
    ]);
  };

  const found = items.filter((i) => !i.manual);
  const shownFound = found.filter((i) => !i.hidden).length;
  const after = summary
    ? found.length
      ? Math.round((summary.exposureScore * shownFound) / found.length) || Math.min(summary.exposureScore, 4)
      : summary.exposureScore
    : null;

  const pct = (v: number) => `${v * 100}%`;

  const heading =
    phase === "scanning" ? "Looking closely." : phase === "ready" ? "Here\u2019s your safe version." : "Check it before it\u2019s ink.";
  const sub =
    phase === "scanning"
      ? "SafePost is reading the photo the way a stranger would. This takes a few seconds."
      : phase === "ready"
        ? "Drag across the photo to see what changed. Save it when you\u2019re happy."
        : "Drop in a photo. SafePost finds what it gives away, hides it, and hands you a clean copy to post.";

  return (
    <div className="relative isolate overflow-clip">
      {/* Sky that fades into paper, echoing the landing hero */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[640px]">
        <Image src="/assets/hero-sky.webp" alt="" fill priority sizes="100vw" className="object-cover object-[50%_30%]" />
        <div className="hero-dim absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/70 to-paper" />
      </div>
      <Image src="/assets/cloud-a.webp" alt="" aria-hidden width={800} height={516} className="pointer-events-none absolute -left-24 top-28 -z-10 w-[260px] opacity-80 sm:w-[340px]" />
      <Image src="/assets/cloud-b.webp" alt="" aria-hidden width={966} height={254} className="pointer-events-none absolute -right-28 top-72 -z-10 hidden w-[420px] opacity-90 md:block" />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-display text-[2.6rem] font-medium leading-[1.04] tracking-tight text-ink [text-shadow:0_1px_18px_rgb(var(--paper)/0.9)] sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink/75 sm:text-xl">{sub}</p>
        </header>

        <input
          ref={input}
          type="file"
          accept="image/*,.heic,.heif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) start(f);
            e.target.value = "";
          }}
        />

        {(phase === "idle" || phase === "error") && (
          <>
            <div className="relative mx-auto mt-28 max-w-2xl sm:mt-32">
              {/* The brownie peeks over the top edge of the print */}
              <Image
                src="/assets/brownie-peek.webp"
                alt=""
                aria-hidden
                width={400}
                height={396}
                priority
                className={`pointer-events-none absolute left-1/2 z-10 w-[112px] -translate-x-1/2 transition-[top] duration-300 sm:w-[132px] ${
                  dragging ? "-top-[118px]" : "-top-[98px] sm:-top-[114px]"
                }`}
              />
              <motion.div
                initial={false}
                animate={reduce ? undefined : { rotate: dragging ? 0 : -1.6, scale: dragging ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="rounded-[10px] bg-white p-3 pb-12 shadow-lift ring-1 ring-black/5 sm:p-4 sm:pb-14"
              >
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) start(f);
                  }}
                  className={`flex flex-col items-center rounded-[4px] border-2 border-dashed px-6 py-16 text-center transition-colors sm:py-24 ${
                    dragging ? "border-[#E8846B] bg-[#FCE9E1]" : "border-[#DCCFBC] bg-[#F5EDE1]"
                  }`}
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#2B3A67] shadow-soft">
                    <ImagePlus size={26} aria-hidden />
                  </span>
                  <h2 className="mt-5 font-display text-3xl font-medium text-[#1E2440] sm:text-4xl">
                    {dragging ? "Let go to check it." : "Drop a photo here"}
                  </h2>
                  <p className="mt-2 text-[#585E78]">or pick one from your device</p>
                  <button
                    type="button"
                    onClick={() => input.current?.click()}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#E8846B] px-7 py-3.5 text-base font-semibold text-[#1E2440] shadow-lift transition-transform hover:-translate-y-0.5"
                  >
                    <Upload size={18} aria-hidden />
                    Choose a photo
                  </button>
                  {error && (
                    <p role="alert" className="mt-5 max-w-md font-medium text-[#9A4230]">
                      {error}
                    </p>
                  )}
                </div>
                <p className="mt-4 text-center font-display text-[15px] italic text-[#8A8790]">JPEG, PNG or HEIC</p>
              </motion.div>
            </div>

            <ol className="mx-auto mt-20 grid max-w-4xl gap-8 sm:grid-cols-3 sm:gap-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative text-center sm:text-left">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-respect/10 text-respect sm:mx-0">
                    <s.Icon size={21} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mx-auto mt-12 max-w-md text-center text-sm leading-relaxed text-muted">
              {enabled === false
                ? "Automatic scanning is off on this copy of the site, so you\u2019ll mark what to hide yourself."
                : "This is a test build. Please use photos of adults or objects, not children."}
            </p>
          </>
        )}

        {(phase === "scanning" || phase === "ready") && original && (
          <div
            ref={workspace}
            className={`mt-14 grid scroll-mt-20 gap-4 [overflow-anchor:none] lg:h-[max(780px,calc(100svh-6.5rem))] lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[minmax(0,1fr)]`}
          >
            {/* Photo stage: on wide screens the workspace fills the window, so the photo never scrolls away */}
            <div className="flex min-h-0 flex-col rounded-[2rem] border border-line bg-paper2 p-3 shadow-soft sm:p-4">
              {phase === "ready" && (
                <div className="mb-2.5">
                  <HideMethodPicker value={style} onChange={setStyle} />
                </div>
              )}
              {phase === "ready" && (
                <div className="flex flex-wrap items-center gap-3">
                  <Segmented<Tool>
                    label="What the photo does when you drag"
                    value={tool}
                    onChange={setTool}
                    options={[
                      { id: "compare", label: "Compare", icon: <ChevronsLeftRight size={16} aria-hidden /> },
                      { id: "draw", label: "Add a box", icon: <SquareDashedMousePointer size={16} aria-hidden /> },
                    ]}
                  />
                  <p className="min-w-0 flex-1 truncate text-sm text-muted sm:text-center">
                    {tool === "compare" ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="font-semibold text-ink">Original</span>
                        <ChevronsLeftRight size={15} aria-hidden />
                        <span className="font-semibold text-ink">Safe version</span>
                        <span className="sr-only">Drag the slider on the photo to compare.</span>
                      </span>
                    ) : (
                      "Drag over anything to hide it"
                    )}
                  </p>
                  <div className="flex gap-1.5">
                    {[
                      { label: "Undo", Icon: Undo2, on: undo, can: past.length > 0, keys: "\u2318Z" },
                      { label: "Redo", Icon: Redo2, on: redo, can: future.length > 0, keys: "\u21e7\u2318Z" },
                    ].map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        onClick={b.on}
                        disabled={!b.can}
                        title={`${b.label} (${b.keys})`}
                        aria-label={b.label}
                        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <b.Icon size={17} aria-hidden />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={photoBox} className="flex min-h-0 flex-1 items-center justify-center pt-3">
                <div className="rounded-[6px] bg-white p-1.5 shadow-lift ring-1 ring-black/5 sm:p-2">
                <div
                  ref={stage}
                  className={`relative w-fit select-none ${tool === "draw" && phase === "ready" ? "cursor-crosshair touch-none" : ""}`}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={() => {
                    drawStart.current = null;
                    setDraft(null);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={phase === "ready" && safe ? safe : original}
                    alt={phase === "ready" ? "Safe version of your photo" : "Your photo, being checked"}
                    draggable={false}
                    className="block max-h-[64vh] w-auto max-w-full"
                    style={photoMaxH ? { maxHeight: photoMaxH } : undefined}
                  />

                  {phase === "scanning" && (
                    <>
                      <div className="absolute inset-0 bg-paper/30" />
                      <div className="scan-sweep absolute inset-x-0 h-24" aria-hidden />
                    </>
                  )}

                  {phase === "ready" && tool === "compare" && safe && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={original}
                        alt=""
                        draggable={false}
                        className="absolute inset-0 h-full w-full"
                        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                      />
                      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(30_36_64/0.25)]" style={{ left: `${split}%` }}>
                        <span className="compare-knob absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1E2440] shadow-lift">
                          <ChevronsLeftRight size={20} aria-hidden />
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={split}
                        onChange={(e) => setSplit(Number(e.target.value))}
                        aria-label="Slide between the original and the safe version"
                        className="compare-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                      />
                    </>
                  )}

                  {phase === "ready" &&
                    items.map((it) => (
                      <div
                        key={it.id}
                        className={`pointer-events-none absolute rounded-md transition-[border-color,box-shadow] ${
                          active === it.id
                            ? "z-10 border-[3px] border-compassion shadow-[0_0_0_4px_rgb(var(--compassion)/0.3)]"
                            : it.hidden
                              ? "border-2 border-white/85 shadow-[0_0_0_1px_rgb(30_36_64/0.25)]"
                              : "border-2 border-dashed border-compassion"
                        }`}
                        style={{ left: pct(it.box.x), top: pct(it.box.y), width: pct(it.box.w), height: pct(it.box.h) }}
                      >
                        {active === it.id && (
                          <span className="absolute -top-8 left-0 whitespace-nowrap rounded-full bg-[#1E2440] px-2.5 py-1 text-xs font-semibold text-white">
                            {it.hidden ? "Hidden" : "Showing"} · {it.label}
                          </span>
                        )}
                      </div>
                    ))}

                  {phase === "ready" && rendering && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#1E2440]/80 px-3 py-1.5 text-xs font-semibold text-white">
                      <LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" aria-hidden />
                      {style !== "erase"
                        ? "Updating"
                        : eraser.state === "downloading"
                          ? eraser.progress > 0
                            ? `Downloading the AI eraser · ${Math.round(eraser.progress * 100)}% (first time only)`
                            : "Getting the AI eraser ready"
                          : eraser.state === "failed"
                            ? "Rebuilding the background"
                            : progress && progress.total > 1
                            ? `Erasing with AI \u00b7 ${Math.min(progress.done + 1, progress.total)} of ${progress.total}`
                            : "Erasing with AI"}
                    </span>
                  )}

                  {draft && (
                    <div
                      className="pointer-events-none absolute rounded-md border-2 border-dashed border-white bg-white/20"
                      style={{ left: pct(draft.x), top: pct(draft.y), width: pct(draft.w), height: pct(draft.h) }}
                    />
                  )}
                </div>
                </div>
              </div>
            </div>

            {/* Right column: the score and the plain-language why, then the panel. */}
            <div className="flex min-h-0 flex-col gap-4">
            {fileData !== undefined && (phase === "scanning" || phase === "ready") && <FileDataCard data={fileData} compact={phase === "ready"} />}
            {summary && after !== null && phase === "ready" && (
              <section aria-label="Summary" className="shrink-0 rounded-[1.5rem] border border-line bg-card px-5 py-4 shadow-soft">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted">Exposure score</p>
                    <p className="mt-0.5 flex items-baseline gap-2.5 font-display">
                      <span className={`text-2xl text-muted line-through decoration-2 ${after === summary.exposureScore ? "hidden" : ""}`}>
                        {summary.exposureScore}
                      </span>
                      <span className={`text-5xl font-medium leading-none ${scoreInk(after)}`}>{after}</span>
                      <span className="text-base text-muted">of 100</span>
                    </p>
                  </div>
                  <p className="text-right text-sm text-muted">
                    {after === summary.exposureScore ? scoreWord(after) : `${scoreWord(after)} after your changes`}
                    {summary.verdict && <span className={`block font-semibold ${VERDICT_INK[summary.verdict]}`}>{VERDICT_LABEL[summary.verdict]}</span>}
                  </p>
                </div>
                {summary.whyItMatters && (
                  <p className="mt-3 text-pretty border-t border-line pt-3 text-sm leading-relaxed text-ink/85">{summary.whyItMatters}</p>
                )}
              </section>
            )}

            {/* Side panel */}
            <aside className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-line bg-card shadow-soft" aria-live="polite">
              {phase === "scanning" ? (
                <div className="p-6 sm:p-7">
                  <p className="font-display text-2xl font-medium text-ink">Checking your photo</p>
                  <ol className="mt-5 space-y-3">
                    {STATUS.map((s, i) => (
                      <li key={s} className={`flex items-center gap-3 text-[15px] ${i <= status ? "text-ink" : "text-muted/60"}`}>
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${i < status ? "bg-integrity" : i === status ? "animate-pulse bg-compassion" : "bg-line"}`} />
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <>
                  {items.length > 0 && (
                    <div className="flex shrink-0 items-baseline justify-between gap-3 px-5 pb-2 pt-5 sm:px-6">
                      <h3 className="font-semibold text-ink">What it gives away</h3>
                      <p className="text-sm text-muted">
                        {items.filter((i) => i.hidden).length} of {items.length} hidden
                      </p>
                    </div>
                  )}

                  {/* Only the list scrolls; the actions below stay put. */}
                  <div className="relative min-h-0 flex-1">
                  <div className="h-full overscroll-contain px-3 pb-3 sm:px-4 lg:overflow-y-auto">
                  {notice && <p className="mx-2 mb-3 mt-2 rounded-2xl bg-paper2 p-4 text-sm leading-relaxed text-ink/80">{notice}</p>}

                  {items.length > 0 && (
                      <ul>
                        {items.map((it) => {
                          const { Icon, bg } = CATEGORY_ICON[it.category] ?? CATEGORY_ICON.Identity;
                          const open = active === it.id;
                          return (
                            <li key={it.id} className="flex items-center gap-1">
                              <button
                                type="button"
                                aria-pressed={it.hidden}
                                aria-label={`Hide ${it.label}`}
                                aria-describedby={it.reason ? `why-${it.id}` : undefined}
                                onClick={() => toggle(it.id)}
                                onMouseEnter={() => setActive(it.id)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(it.id)}
                                onBlur={() => setActive(null)}
                                className={`flex min-w-0 flex-1 items-start gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors ${open ? "bg-paper2" : "hover:bg-paper2"}`}
                              >
                                <span
                                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-white transition-opacity ${it.hidden ? "" : "opacity-45"}`}
                                  style={{ background: it.manual ? "#7A7781" : bg }}
                                >
                                  {it.manual ? <SquareDashedMousePointer size={16} aria-hidden /> : <Icon size={16} aria-hidden />}
                                </span>
                                <span className="min-w-0 flex-1 pt-1">
                                  <span className={`block truncate font-medium leading-snug ${it.hidden ? "text-ink" : "text-muted line-through decoration-1"}`}>
                                    {it.label}
                                  </span>
                                  {/* The reason opens with the row, while its outline lights up on the photo. */}
                                  {it.reason && (
                                    <span
                                      id={`why-${it.id}`}
                                      className={`grid text-sm leading-snug text-muted transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none ${
                                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                      }`}
                                    >
                                      <span className="overflow-hidden">
                                        <span className="block pt-1">{it.reason}</span>
                                      </span>
                                    </span>
                                  )}
                                </span>
                                <Knob on={it.hidden} />
                              </button>
                              {it.manual && (
                                <button
                                  type="button"
                                  onClick={() => commit(items.filter((x) => x.id !== it.id))}
                                  aria-label={`Delete ${it.label}`}
                                  className="grid h-8 w-8 shrink-0 place-items-center self-start rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                                >
                                  <Trash2 size={15} aria-hidden />
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                  )}
                  </div>
                  {/* Fade at the bottom says there is more to scroll. */}
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-6 bg-gradient-to-t from-card to-transparent lg:block" />
                  </div>

                  <div className="shrink-0 border-t border-line bg-card px-5 pb-4 pt-5 sm:px-6">
                  <div className="flex flex-col gap-3.5">
                    <a
                      href={safe ?? undefined}
                      download={`${fileName}-safe.jpg`}
                      aria-disabled={!safe || rendering}
                      title="The saved copy has no location, device or time data."
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-compassion px-6 py-3 text-base font-semibold text-[#1E2440] shadow-lift transition-transform hover:-translate-y-0.5 ${
                        safe && !rendering ? "" : "pointer-events-none opacity-60"
                      }`}
                    >
                      <Download size={18} aria-hidden />
                      Save safe version
                    </a>
                    <ShareBar safe={safe} fileName={fileName} disabled={!safe || rendering} />
                    <div className="-mx-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => input.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-paper2"
                      >
                        <ImagePlus size={15} aria-hidden />
                        Check another photo
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-paper2 hover:text-ink"
                      >
                        <RotateCcw size={14} aria-hidden />
                        Start over
                      </button>
                    </div>
                  </div>
                  </div>
                </>
              )}
            </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
