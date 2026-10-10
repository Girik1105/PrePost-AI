//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PhoneFrame from "./PhoneFrame";
import { CATEGORY_ICON } from "./screens/Detail";
import { ScoreRing, VerdictPill } from "./ui/bits";
import { APP, Card, ScreenBody, SectionHeader, Toggle } from "./ui/kit";
import { scoreWord, type Category, type Verdict } from "@/lib/scenes";

interface LiveResult {
  detections: { label: string; category: Category; reason: string; box: { x: number; y: number; w: number; h: number } }[];
  exposureScore: number;
  containsChild: boolean;
  verdict: Exclude<Verdict, null> | null;
  whyItMatters: string;
}

/** Redraws the photo on a canvas. That drops EXIF (location, device, time) before upload. */
async function toCleanJpeg(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function LiveScan() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<LiveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [hidden, setHidden] = useState<Record<number, boolean>>({});
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/scan")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  const pick = async (file: File) => {
    setOpen(true);
    setError(null);
    setResult(null);
    setBusy(true);
    try {
      const clean = await toCleanJpeg(file);
      setImage(clean);
      const res = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: clean }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Live mode is off in this demo.");
      setResult(data);
      setHidden(Object.fromEntries((data as LiveResult).detections.map((_, i) => [i, true])));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Live mode is off in this demo.");
    } finally {
      setBusy(false);
    }
  };

  if (enabled === null) return null;
  if (!enabled) return <p className="mt-4 text-center text-sm text-muted">Live mode is off in this demo.</p>;

  return (
    <div className="mt-6 text-center">
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Choose a photo to scan"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold text-ink shadow-soft hover:bg-paper"
      >
        <Upload className="h-4 w-4" aria-hidden /> Try your own photo
      </button>
      <p className="mx-auto mt-2 max-w-[300px] text-xs leading-snug text-muted">
        Don&apos;t upload photos of children or anything private. This live demo is for testing only.
      </p>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#151829]/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Live scan result"
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          >
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#1E2440]">
              <X className="h-5 w-5" aria-hidden />
            </button>
            <div className="w-full max-w-[320px]">
              <PhoneFrame label="Your photo, scanned">
                <ScreenBody>
                  <p className="py-[10px] text-center text-[17px] font-semibold">Your photo</p>
                  {image && (
                    <div className="relative w-full bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="The photo you uploaded" className="block w-full" />
                      {result?.detections.map((d, i) => (
                        <div
                          key={i}
                          className="absolute rounded-md border-2 border-white/90"
                          style={{
                            left: `${d.box.x * 100}%`,
                            top: `${d.box.y * 100}%`,
                            width: `${d.box.w * 100}%`,
                            height: `${d.box.h * 100}%`,
                            backdropFilter: hidden[i] ? "blur(14px)" : "none",
                            WebkitBackdropFilter: hidden[i] ? "blur(14px)" : "none",
                          }}
                        />
                      ))}
                      {busy && <div className="shimmer absolute inset-0 overflow-hidden bg-white/10" />}
                    </div>
                  )}
                  <div className="px-4 pt-4">
                    {busy && <p className="text-center text-[15px] text-[#6B6B73]">Checking your photo...</p>}
                    {error && <p className="text-center text-[15px] text-[#8E3A28]">{error}</p>}
                    {result && (
                      <Card className="flex items-center gap-4 p-4">
                        <ScoreRing value={result.exposureScore} />
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8A8790]">{scoreWord(result.exposureScore)}</p>
                          <p className="text-[15px] text-[#4A4852]">
                            {result.detections.length ? `${result.detections.length} thing${result.detections.length === 1 ? "" : "s"} found.` : "Nothing personal found."}
                          </p>
                          {result.verdict && (
                            <div className="mt-2">
                              <VerdictPill verdict={result.verdict} small />
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                  {result && result.detections.length > 0 && (
                    <>
                      <SectionHeader>What it gives away</SectionHeader>
                      <div className="mx-4 overflow-hidden rounded-[16px] bg-white text-left">
                        {result.detections.map((d, i) => {
                          const { Icon, bg } = CATEGORY_ICON[d.category] ?? CATEGORY_ICON.Identity;
                          return (
                            <div key={i} className="flex items-center gap-3 border-b border-[#ECE7DE] px-4 py-3 last:border-0">
                              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: bg }}>
                                <Icon className="h-[17px] w-[17px]" aria-hidden />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[15px] font-semibold">{d.label}</p>
                                <p className="text-[13px] leading-snug text-[#7A7781]">{d.reason}</p>
                              </div>
                              <Toggle on={!!hidden[i]} onChange={(v) => setHidden({ ...hidden, [i]: v })} label={`Blur ${d.label}`} />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {result?.whyItMatters && (
                    <div className="px-4 pt-4 text-left">
                      <Card className="p-4">
                        <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: APP.navy }}>
                          Why this matters
                        </p>
                        <p className="mt-2 text-[15px] leading-relaxed text-[#3A3842]">{result.whyItMatters}</p>
                      </Card>
                    </div>
                  )}
                </ScreenBody>
              </PhoneFrame>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
