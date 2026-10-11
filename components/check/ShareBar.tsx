//created by kinjal
"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, DownloadSimple as Download, DotsThree as Ellipsis, ArrowSquareOut as ExternalLink, DeviceMobile as Smartphone, X as Close } from "@phosphor-icons/react/dist/ssr";
import { BRAND_PATHS, type BrandId } from "@/lib/brandIcons";

// Websites can't attach a photo to someone else's post composer through a link, and SafePost never
// uploads the photo anywhere. So each button hands the photo over the way that platform accepts it:
// copied to the clipboard (paste with ⌘V) or saved to downloads (upload), then opens the platform.
type Handoff = "paste" | "upload";

interface Platform {
  id: BrandId;
  name: string;
  url: string;
  handoff: Handoff;
  featured?: boolean;
}

const PLATFORMS: Platform[] = [
  { id: "whatsapp", name: "WhatsApp", url: "https://web.whatsapp.com/", handoff: "paste", featured: true },
  { id: "instagram", name: "Instagram", url: "https://www.instagram.com/", handoff: "upload", featured: true },
  { id: "facebook", name: "Facebook", url: "https://www.facebook.com/", handoff: "paste", featured: true },
  { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/feed/", handoff: "paste", featured: true },
  { id: "x", name: "X", url: "https://x.com/intent/post", handoff: "paste", featured: true },
  { id: "threads", name: "Threads", url: "https://www.threads.com/intent/post", handoff: "upload" },
  { id: "bluesky", name: "Bluesky", url: "https://bsky.app/", handoff: "paste" },
  { id: "telegram", name: "Telegram", url: "https://web.telegram.org/", handoff: "paste" },
  { id: "messenger", name: "Messenger", url: "https://www.messenger.com/", handoff: "paste" },
  { id: "discord", name: "Discord", url: "https://discord.com/channels/@me", handoff: "paste" },
  { id: "reddit", name: "Reddit", url: "https://www.reddit.com/submit", handoff: "upload" },
  { id: "pinterest", name: "Pinterest", url: "https://www.pinterest.com/pin-creation-tool/", handoff: "upload" },
];

const INSTAGRAM_BG = "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)";

function BrandIcon({ id, size = 18 }: { id: BrandId; size?: number }) {
  if (id === "linkedin") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <text x="12" y="17.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="15" fill="#fff">
          in
        </text>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="#fff">
      <path d={BRAND_PATHS[id].path} />
    </svg>
  );
}

function brandBg(id: BrandId) {
  if (id === "instagram") return INSTAGRAM_BG;
  if (id === "linkedin") return "#0A66C2";
  return BRAND_PATHS[id].hex;
}

async function dataUrlToBlob(url: string) {
  return (await fetch(url)).blob();
}

/** Clipboard images must be PNG in most browsers. */
async function toPng(jpeg: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(jpeg);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG failed"))), "image/png"));
}

interface Toast {
  text: string;
  link?: { href: string; label: string };
  offerSave?: boolean;
}

export default function ShareBar({ safe, fileName, disabled }: { safe: string | null; fileName: string; disabled: boolean }) {
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [native, setNative] = useState(false);
  const file = useRef<File | null>(null);
  const png = useRef<Blob | null>(null);
  const toastTimer = useRef<number>();
  const firstInSheet = useRef<HTMLButtonElement>(null);
  const name = `${fileName}-safe.jpg`;
  const pasteKey = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘V" : "Ctrl+V";

  // Prepare the photo as a file (for the share sheet) and a PNG (for the clipboard) ahead of the click,
  // so the browser still counts the click as the user's own action when we use them.
  useEffect(() => {
    file.current = null;
    png.current = null;
    if (!safe) return;
    let stale = false;
    const t = window.setTimeout(async () => {
      try {
        const blob = await dataUrlToBlob(safe);
        if (stale) return;
        file.current = new File([blob], name, { type: "image/jpeg" });
        setNative(!!navigator.canShare?.({ files: [file.current] }));
        const p = await toPng(blob);
        if (!stale) png.current = p;
      } catch {
        /* sharing falls back to saving */
      }
    }, 350);
    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [safe, name]);

  useEffect(() => {
    if (!sheet) return;
    firstInSheet.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const say = (t: Toast) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 9000);
  };

  const save = () => {
    if (!safe) return;
    const a = document.createElement("a");
    a.href = safe;
    a.download = name;
    a.click();
  };

  const copy = async () => {
    if (!png.current || !navigator.clipboard?.write || typeof ClipboardItem === "undefined") return false;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": png.current })]);
      return true;
    } catch {
      return false;
    }
  };

  const openSite = (p: Platform) => {
    const w = window.open(p.url, "_blank");
    if (w) w.opener = null;
    return !!w;
  };

  const shareNative = async () => {
    if (!file.current) return;
    try {
      await navigator.share({ files: [file.current] });
    } catch (e) {
      if ((e as DOMException)?.name !== "AbortError") say({ text: "Your device couldn't open the share menu. Save the photo instead.", offerSave: true });
    }
  };

  const shareTo = async (p: Platform) => {
    if (!safe || disabled) return;
    setSheet(false);
    // Phones and tablets: the system share sheet hands the photo straight to the app.
    if (native && window.matchMedia("(pointer: coarse)").matches) {
      await shareNative();
      return;
    }
    if (p.handoff === "upload") {
      save();
      const opened = openSite(p);
      say({
        text: `Saved ${name} to your downloads. In ${p.name}, start a new post and add it.`,
        link: opened ? undefined : { href: p.url, label: `Open ${p.name}` },
      });
      return;
    }
    const copied = await copy();
    if (!copied) save();
    const opened = openSite(p);
    say({
      text: copied
        ? `Photo copied. In ${p.name}, open a chat or new post and paste it with ${pasteKey}.`
        : `Saved ${name} to your downloads. In ${p.name}, add it to a chat or new post.`,
      link: opened ? undefined : { href: p.url, label: `Open ${p.name}` },
      offerSave: copied,
    });
  };

  const featured = PLATFORMS.filter((p) => p.featured);
  const iconBtn = "grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-soft transition-transform hover:-translate-y-0.5 disabled:pointer-events-none";

  return (
    <>
      <div className={`flex items-center gap-2 ${disabled ? "opacity-50" : ""}`}>
        <span className="mr-auto text-sm font-medium text-muted">Share to</span>
        {featured.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => shareTo(p)}
            aria-label={`Share to ${p.name}`}
            title={p.name}
            className={iconBtn}
            style={{ background: brandBg(p.id) }}
          >
            <BrandIcon id={p.id} />
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setSheet(true)}
          aria-label="More ways to share"
          title="More"
          className={`${iconBtn} border border-line bg-card text-ink`}
        >
          <Ellipsis size={18} aria-hidden />
        </button>
      </div>

      {sheet && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[#151829]/60 p-4 sm:items-center"
          onClick={(e) => e.target === e.currentTarget && setSheet(false)}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="share-title" className="max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-[1.75rem] border border-line bg-card p-5 shadow-lift sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="share-title" className="font-display text-2xl font-medium text-ink">
                  Share your safe photo
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  SafePost never uploads your photo. Pick where it goes, and it&apos;s copied or saved so you can add it there.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSheet(false)}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-paper2 hover:text-ink"
              >
                <Close size={18} aria-hidden />
              </button>
            </div>

            <ul className="mt-5 grid grid-cols-4 gap-x-2 gap-y-4">
              {PLATFORMS.map((p, i) => (
                <li key={p.id}>
                  <button
                    ref={i === 0 ? firstInSheet : undefined}
                    type="button"
                    onClick={() => shareTo(p)}
                    className="flex w-full flex-col items-center gap-1.5 rounded-2xl py-1.5 text-xs font-medium text-ink hover:bg-paper2"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full shadow-soft" style={{ background: brandBg(p.id) }}>
                      <BrandIcon id={p.id} size={22} />
                    </span>
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid gap-2 border-t border-line pt-4">
              {native && (
                <button
                  type="button"
                  onClick={() => {
                    setSheet(false);
                    shareNative();
                  }}
                  className="inline-flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-paper2"
                >
                  <Smartphone size={18} aria-hidden className="text-respect" />
                  Share with an app on this device
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  setSheet(false);
                  say((await copy()) ? { text: `Photo copied. Paste it anywhere with ${pasteKey}.` } : { text: "This browser can't copy images. Save the photo instead.", offerSave: true });
                }}
                className="inline-flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-paper2"
              >
                <Copy size={18} aria-hidden className="text-respect" />
                Copy photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setSheet(false);
                  save();
                }}
                className="inline-flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-paper2"
              >
                <Download size={18} aria-hidden className="text-respect" />
                Save photo
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed inset-x-4 bottom-5 z-[80] mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-[#1E2440] px-4 py-3 text-sm text-white shadow-lift">
          <p className="flex-1 leading-relaxed">
            {toast.text}
            {toast.link && (
              <a href={toast.link.href} target="_blank" rel="noopener noreferrer" className="ml-1.5 inline-flex items-center gap-1 font-semibold underline underline-offset-2">
                {toast.link.label}
                <ExternalLink size={13} aria-hidden />
              </a>
            )}
            {toast.offerSave && (
              <button type="button" onClick={save} className="ml-1.5 font-semibold underline underline-offset-2">
                Save it too
              </button>
            )}
          </p>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="shrink-0 rounded-full p-0.5 text-white/70 hover:text-white">
            <Close size={16} aria-hidden />
          </button>
        </div>
      )}
    </>
  );
}
