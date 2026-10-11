//created by kinjal
"use client";

import { motion } from "framer-motion";
import { CaretLeft as ChevronLeft, Copy, DotsThree as Ellipsis, EyeSlash as EyeOff, Heart, Info, Images, ImagesSquare as Library, EnvelopeSimple as Mail, ChatCircle as MessageCircle, Play, MagnifyingGlass as Search, Export as Share, PlusSquare as SquarePlus, Trash as Trash2, Television as Tv, User as UserRound, X, FolderOpen, DeviceMobile as Smartphone, Stack as Layers } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { BRAND_PATHS } from "@/lib/brandIcons";
import { BRAND } from "@/lib/brand";
import { MAIN, ROLL } from "./photos";
import { useFlow } from "./ShareFlowContext";

const BLUE = "#0066CC"; // iOS blue, one step darker so labels pass AA contrast

/** Pulsing ring on the next control when the visitor explores on their own. */
export function hintCls(on: boolean) {
  return on ? "tap-hint" : "";
}

/* ---------------- 1. Photos library ---------------- */

export function Gallery() {
  const { go, driven } = useFlow();
  const scroller = useRef<HTMLDivElement>(null);

  // Photos opens at the bottom, where the newest shots are.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div className="absolute inset-0 bg-white">
      <div ref={scroller} className="no-scrollbar absolute inset-0 overflow-y-auto pb-[150px] pt-[100px]">
        <div className="grid grid-cols-3 gap-[2px]">
          {ROLL.map((n) => (
            <div key={n} className="relative aspect-square bg-[#eee]">
              <Image src={`/assets/share/${n}.webp`} alt="" fill sizes="130px" className="object-cover" />
            </div>
          ))}
          <button
            type="button"
            data-tap="next"
            onClick={() => go("viewer")}
            aria-label="Open today's photo"
            className={`relative aspect-square bg-[#eee] ${hintCls(!driven)} z-10`}
          >
            <Image src={MAIN.src} alt={MAIN.alt} fill sizes="130px" className="object-cover" priority />
          </button>
        </div>
      </div>

      {/* top bar over the grid */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[132px] bg-gradient-to-b from-white from-40% via-white/90 to-transparent" />
      <div className="absolute inset-x-0 top-[54px] flex items-center justify-between px-4">
        <div>
          <p className="text-[28px] font-bold leading-none tracking-tight">Library</p>
          <p className="mt-1 text-[13px] font-medium text-[#8A8A8E]">Today</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#E9E9EB] px-3 py-[5px] text-[15px] font-semibold text-[#1C1C1E]">Select</span>
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E9E9EB]">
            <Ellipsis className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>

      {/* Years / Months / Days / All Photos */}
      <div className="absolute inset-x-0 bottom-[96px] flex justify-center">
        <div className="flex rounded-full bg-[#F2F2F7]/90 p-[3px] text-[13px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          {["Years", "Months", "Days", "All Photos"].map((t) => (
            <span key={t} className={`rounded-full px-[11px] py-[5px] ${t === "All Photos" ? "bg-white shadow-sm" : "text-[#3C3C43]"}`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* tab bar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[84px] justify-around border-t border-black/10 bg-[#F9F9F9]/95 pt-[7px] backdrop-blur-xl">
        {[
          { l: "Library", I: Library, on: true },
          { l: "For You", I: Heart, on: false },
          { l: "Albums", I: Images, on: false },
          { l: "Search", I: Search, on: false },
        ].map(({ l, I, on }) => (
          <span key={l} className="flex w-[80px] flex-col items-center gap-[2px]" style={{ color: on ? BLUE : "#6E6E73" }}>
            <I className="h-[24px] w-[24px]" aria-hidden />
            <span className="text-[10px] font-medium">{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 2. Photo viewer ---------------- */

export function Viewer({ dimmed = false }: { dimmed?: boolean }) {
  const { go, driven } = useFlow();
  const strip = ROLL.slice(-8);
  return (
    <div className="absolute inset-0 bg-white">
      <div className="absolute inset-x-0 top-[50px] flex h-[48px] items-center justify-between px-2">
        <button type="button" onClick={() => go("gallery")} className="flex items-center" style={{ color: BLUE }} aria-label="Back to library">
          <ChevronLeft className="h-[30px] w-[30px]" weight="bold" aria-hidden />
        </button>
        <div className="text-center leading-tight">
          <p className="text-[15px] font-semibold">Today</p>
          <p className="text-[12px] text-[#8A8A8E]">10:05 AM</p>
        </div>
        <span className="pr-3 text-[17px]" style={{ color: BLUE }}>
          Edit
        </span>
      </div>

      <motion.div
        className="absolute inset-x-0 top-[200px]"
        initial={{ scale: 0.35, opacity: 0, y: 220 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="relative aspect-square w-full">
          <Image src={MAIN.src} alt={MAIN.alt} fill sizes="390px" className="object-cover" priority />
        </div>
      </motion.div>

      {/* filmstrip */}
      <div className="absolute inset-x-0 bottom-[92px] flex justify-center gap-[2px]">
        {strip.map((n) => (
          <span key={n} className="relative h-[34px] w-[24px] overflow-hidden opacity-90">
            <Image src={`/assets/share/${n}.webp`} alt="" fill sizes="24px" className="object-cover" />
          </span>
        ))}
        <span className="relative mx-[3px] h-[34px] w-[34px] overflow-hidden rounded-[3px] ring-2 ring-white">
          <Image src={MAIN.src} alt="" fill sizes="34px" className="object-cover" />
        </span>
      </div>

      {/* toolbar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[84px] items-start justify-between border-t border-black/5 bg-[#F9F9F9]/95 px-6 pt-[14px]" style={{ color: BLUE }}>
        <button
          type="button"
          data-tap={dimmed ? undefined : "next"}
          onClick={() => go("sheet")}
          aria-label="Share"
          className={`-m-2 rounded-xl p-2 ${hintCls(!driven && !dimmed)}`}
        >
          <Share className="h-[26px] w-[26px]" aria-hidden />
        </button>
        <Heart className="h-[26px] w-[26px]" aria-hidden />
        <Info className="h-[26px] w-[26px]" aria-hidden />
        <Trash2 className="h-[26px] w-[26px]" aria-hidden />
      </div>
    </div>
  );
}

/* ---------------- 3. Share sheet ---------------- */

function BrandTile({ id }: { id: keyof typeof BRAND_PATHS }) {
  const b = BRAND_PATHS[id];
  const ig = id === "instagram";
  return (
    <span
      className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px]"
      style={{ background: ig ? "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" : b.hex }}
    >
      <svg viewBox="0 0 24 24" className="h-[32px] w-[32px]" fill="#fff" aria-hidden>
        <path d={b.path} />
      </svg>
    </span>
  );
}

function IconTile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] text-white" style={{ background: bg }}>
      {children}
    </span>
  );
}

function AirDropGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-[34px] w-[34px]" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
      <path d="M9.5 22.5a9 9 0 1 1 13 0" />
      <path d="M12.3 19.6a5 5 0 1 1 7.4 0" />
      <path d="M16 17v-0.5" />
      <path d="M16 21l-3 5h6z" fill="#fff" stroke="none" />
    </svg>
  );
}

export function ShareSheet() {
  const { go, driven } = useFlow();
  const people = [
    { n: "Mom", c: "#F4A6B8" },
    { n: "Jake", c: "#8EC5FC" },
    { n: "Priya", c: "#B8E0A6" },
    { n: "Sam", c: "#FFD48A" },
  ];
  return (
    <>
      <motion.button
        type="button"
        aria-label="Close share sheet"
        onClick={() => go("viewer")}
        className="absolute inset-0 z-20 bg-black/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        role="dialog"
        aria-label="Share"
        className="absolute inset-x-0 bottom-0 z-30 h-[690px] rounded-t-[14px] bg-[#F2F2F7] pb-[40px]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 330, damping: 34 }}
      >
        <div className="mx-auto mt-[6px] h-[5px] w-[36px] rounded-full bg-[#C7C7CC]" />
        <div className="flex items-center gap-3 px-4 pt-2">
          <span className="relative h-[46px] w-[46px] overflow-hidden rounded-[8px]">
            <Image src={MAIN.src} alt="" fill sizes="46px" className="object-cover" />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold">1 Photo Selected</p>
            <p className="text-[13px]" style={{ color: BLUE }}>
              Options ›
            </p>
          </div>
          <button type="button" onClick={() => go("viewer")} aria-label="Close" className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E3E3E8] text-[#8A8A8E]">
            <X className="h-4 w-4" weight="bold" aria-hidden />
          </button>
        </div>

        <div className="mt-3 border-t border-black/10" />
        {/* AirDrop suggestions */}
        <div className="no-scrollbar flex gap-5 overflow-x-auto px-4 pb-3 pt-4">
          {people.map((p) => (
            <span key={p.n} className="flex w-[64px] shrink-0 flex-col items-center gap-[6px]">
              <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full text-[22px] font-semibold text-white" style={{ background: `linear-gradient(160deg, ${p.c}, #8E8E93)` }}>
                {p.n[0]}
                <span className="absolute -bottom-[2px] -right-[2px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#F2F2F7]" style={{ background: "linear-gradient(#5AC8FA,#007AFF)" }}>
                  <svg viewBox="0 0 32 32" className="h-[13px] w-[13px]" fill="none" stroke="#fff" strokeWidth={3} aria-hidden>
                    <path d="M9.5 22.5a9 9 0 1 1 13 0" />
                  </svg>
                </span>
              </span>
              <span className="text-[11px] leading-tight text-[#3C3C43]">{p.n}</span>
            </span>
          ))}
        </div>

        <div className="mx-4 border-t border-black/10" />
        {/* apps */}
        <div className="no-scrollbar flex gap-[18px] overflow-x-auto px-4 pb-3 pt-4">
          <span className="flex w-[62px] shrink-0 flex-col items-center gap-[6px]">
            <IconTile bg="linear-gradient(#5AC8FA,#007AFF)">
              <AirDropGlyph />
            </IconTile>
            <span className="text-[11px] text-[#3C3C43]">AirDrop</span>
          </span>
          <span className="flex w-[62px] shrink-0 flex-col items-center gap-[6px]">
            <IconTile bg="linear-gradient(#67E26F,#2DBE38)">
              <MessageCircle className="h-[32px] w-[32px]" weight="fill" aria-hidden />
            </IconTile>
            <span className="text-[11px] text-[#3C3C43]">Messages</span>
          </span>
          <button
            type="button"
            data-tap="next"
            onClick={() => go("scan")}
            className={`flex w-[62px] shrink-0 flex-col items-center gap-[6px] rounded-[16px] ${hintCls(!driven)}`}
          >
            <Image sizes="60px" src="/assets/app-icon.webp" alt="" width={60} height={60} className="h-[60px] w-[60px] rounded-[14px] object-cover" />
            <span className="text-[11px] font-medium text-[#1C1C1E]">{BRAND.name}</span>
          </button>
          <span className="flex w-[62px] shrink-0 flex-col items-center gap-[6px]">
            <BrandTile id="instagram" />
            <span className="text-[11px] text-[#3C3C43]">Instagram</span>
          </span>
          <span className="flex w-[62px] shrink-0 flex-col items-center gap-[6px]">
            <IconTile bg="linear-gradient(#3EA5FF,#1A73E8)">
              <Mail className="h-[30px] w-[30px]" aria-hidden />
            </IconTile>
            <span className="text-[11px] text-[#3C3C43]">Mail</span>
          </span>
          <span className="flex w-[62px] shrink-0 flex-col items-center gap-[6px]">
            <BrandTile id="whatsapp" />
            <span className="text-[11px] text-[#3C3C43]">WhatsApp</span>
          </span>
        </div>

        {/* actions */}
        <div className="mx-4 mt-2 overflow-hidden rounded-[12px] bg-white">
          {[
            { l: "Copy Photo", I: Copy },
            { l: "Add to Shared Album", I: Layers },
            { l: "Add to Album", I: SquarePlus },
            { l: "Duplicate", I: Images },
            { l: "Hide", I: EyeOff },
            { l: "Slideshow", I: Play },
            { l: "AirPlay", I: Tv },
          ].map(({ l, I }, i, a) => (
            <div key={l} className={`flex items-center justify-between px-4 py-[11px] text-[16px] ${i < a.length - 1 ? "border-b border-black/10" : ""}`}>
              {l}
              <I className="h-[20px] w-[20px] text-[#1C1C1E]" aria-hidden />
            </div>
          ))}
        </div>
        <div className="mx-4 mt-3 overflow-hidden rounded-[12px] bg-white">
          {[
            { l: "Use as Wallpaper", I: Smartphone },
            { l: "Save to Files", I: FolderOpen },
            { l: "Assign to Contact", I: UserRound },
          ].map(({ l, I }, i, a) => (
            <div key={l} className={`flex items-center justify-between px-4 py-[11px] text-[16px] ${i < a.length - 1 ? "border-b border-black/10" : ""}`}>
              {l}
              <I className="h-[20px] w-[20px] text-[#1C1C1E]" aria-hidden />
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
