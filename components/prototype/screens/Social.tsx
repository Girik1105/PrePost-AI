//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Heart, MessageCircle, Plus, Send, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { SCENES, type SceneId } from "@/lib/scenes";
import { useProto } from "../PrototypeController";
import { APP, AppIcon, NavBar } from "../ui/kit";
import SceneArt from "../scenes/SceneArt";

/** Invented social app icon. Not based on any real app. */
function SnaplineIcon({ size = 28 }: { size?: number }) {
  return (
    <span className="flex items-center justify-center rounded-[28%]" style={{ width: size, height: size, background: "linear-gradient(135deg,#7FA88B,#2B3A67)" }} aria-hidden>
      <span className="rounded-full border-[2.5px] border-white" style={{ width: size * 0.42, height: size * 0.42 }} />
    </span>
  );
}

export default function Social() {
  const { state, go, driven } = useProto();
  const [splash, setSplash] = useState(true);
  const [banner, setBanner] = useState(false);
  const [picker, setPicker] = useState(false);
  const safeFirst = (state.saved[0] ?? "school") as SceneId;

  useEffect(() => {
    const t1 = window.setTimeout(() => setSplash(false), 900);
    const t2 = window.setTimeout(() => setBanner(true), 1700);
    const t3 = state.cue?.name === "banner" ? window.setTimeout(() => setPicker(true), 5600) : 0;
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [state.cue]);

  return (
    <div className="absolute inset-0 bg-white">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto pb-[40px] pt-[54px]">
        <button type="button" onClick={() => go("home", { mode: "tab" })} className="ml-3 rounded px-1 text-[12px] font-medium text-[#2B3A67]">
          ◀ {BRAND.name}
        </button>
        <div className="flex h-[40px] items-center justify-between px-4">
          <span className="flex items-center gap-2">
            <SnaplineIcon size={26} />
            <span className="text-[22px] font-bold tracking-tight">{BRAND.socialApp}</span>
          </span>
          <button
            type="button"
            onClick={() => setPicker(true)}
            aria-label="New post"
            className={`flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#F2EFEA] ${!driven && !picker ? "tap-hint" : ""}`}
          >
            <Plus className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-3">
          {["#E8846B", "#8F80C2", "#7FA88B", "#D99A2B", "#2B3A67", "#F4A6B8"].map((c, i) => (
            <span key={c} className="flex flex-col items-center gap-1">
              <span className="h-[58px] w-[58px] rounded-full p-[3px]" style={{ background: `linear-gradient(135deg, ${c}, #F6D9B8)` }}>
                <span className="block h-full w-full rounded-full border-[3px] border-white" style={{ background: c, opacity: 0.55 }} />
              </span>
              <span className="text-[11px] text-[#6B6B73]">{["you", "jo", "sam", "lee", "ana", "kit"][i]}</span>
            </span>
          ))}
        </div>
        {(["sunset", "dog"] as const).map((id, i) => (
          <article key={id} className="pb-4">
            <div className="flex items-center gap-2 px-4 py-2">
              <span className="h-[32px] w-[32px] rounded-full" style={{ background: i ? "#8F80C2" : "#7FA88B" }} />
              <span className="text-[14px] font-semibold">{i ? "sam.k" : "jo.travels"}</span>
            </div>
            <SceneArt id={id} className="aspect-square w-full" />
            <div className="flex items-center gap-4 px-4 pt-3 text-[#1C1C1E]">
              <Heart className="h-6 w-6" aria-hidden />
              <MessageCircle className="h-6 w-6" aria-hidden />
              <Send className="h-6 w-6" aria-hidden />
              <Bookmark className="ml-auto h-6 w-6" aria-hidden />
            </div>
            <p className="px-4 pt-2 text-[14px]">
              <span className="font-semibold">{i ? "sam.k" : "jo.travels"}</span> {SCENES[id].title.toLowerCase()} ✨
            </p>
          </article>
        ))}
      </div>

      {/* SafePost banner */}
      <AnimatePresence>
        {banner && !picker && (
          <motion.div
            className="absolute inset-x-[10px] top-[54px] z-30"
            initial={{ y: -140, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -140, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="rounded-[22px] bg-white/90 p-3 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-2xl">
              <div className="flex items-start gap-3">
                <AppIcon size={36} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center justify-between text-[14px] font-semibold">
                    {BRAND.name}
                    <button type="button" aria-label="Dismiss" onClick={() => setBanner(false)} className="rounded p-[2px] text-[#8A8790]">
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </p>
                  <p className="mt-[2px] text-[14px] leading-snug">
                    Before you post: 1 of your last 5 photos was flagged. The safe version is in your Safe to Share album.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPicker(true)}
                className={`mt-3 h-[40px] w-full rounded-[12px] text-[15px] font-semibold text-white ${!driven ? "tap-hint" : ""}`}
                style={{ background: APP.sageDeep }}
              >
                Use the safe version
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* new post picker */}
      <AnimatePresence>
        {picker && (
          <motion.div
            className="absolute inset-0 z-40 bg-white pt-[54px]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            role="dialog"
            aria-label="New post"
          >
            <NavBar title="New post" backLabel="Cancel" onBack={() => setPicker(false)} />
            <div className="relative mx-4 overflow-hidden rounded-[16px]">
              <SceneArt id={safeFirst} edits={state.edits} className="aspect-[4/3] w-full" />
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-[4px] text-[12px] font-semibold text-white" style={{ background: APP.sageDeep }}>
                <ShieldCheck className="h-[14px] w-[14px]" aria-hidden /> Safe version from {BRAND.name}
              </span>
            </div>
            <p className="px-5 pb-2 pt-4 text-[13px] font-semibold uppercase tracking-wide text-[#8A8790]">Recents</p>
            <div className="grid grid-cols-4 gap-[2px] px-[2px]">
              {[safeFirst, ...state.saved.filter((s) => s !== safeFirst), "picnic", "sunset", "dog", "flowers"].slice(0, 8).map((id, i) => (
                <button key={`${id}-${i}`} type="button" onClick={() => go("album", { mode: "tab" })} className="relative aspect-square overflow-hidden" aria-label={SCENES[id as SceneId].title}>
                  <SceneArt id={id as SceneId} edits={state.edits} className="h-full w-full" />
                  {(i === 0 || state.saved.includes(id as SceneId)) && (
                    <span className="absolute bottom-1 right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white" style={{ background: APP.sage }}>
                      <ShieldCheck className="h-[10px] w-[10px] text-white" aria-hidden />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* app launch */}
      <AnimatePresence>
        {splash && (
          <motion.div className="absolute inset-0 z-50 flex items-center justify-center bg-white" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
              <SnaplineIcon size={88} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
