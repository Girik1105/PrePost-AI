//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookmarkSimple as Bookmark, CaretLeft as ChevronLeft, CaretRight as ChevronRight, FilmSlate as Clapperboard, Heart, House as Home, MapPin, ChatCircle as MessageCircle, MusicNotes as Music2, PlusSquare, MagnifyingGlass as Search, PaperPlaneTilt as Send, Tag, Users, DotsThree as Ellipsis } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { AppIcon } from "@/components/prototype/ui/kit";
import { CAPTION, HANDLE, MAIN } from "./photos";
import { hintCls } from "./PhotosScreens";
import { useFlow } from "./ShareFlowContext";

const IG_BLUE = "#0095F6";

function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span className="relative shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Image src="/assets/share/beachgirl.webp" alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

/* ---------------- Instagram: new post ---------------- */

export function Compose() {
  const { safeUrl, go, driven, playing } = useFlow();
  const [caption, setCaption] = useState("");

  // In the guided demo the caption types itself.
  useEffect(() => {
    if (!playing) return;
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setCaption(CAPTION.slice(0, i));
      if (i >= CAPTION.length) window.clearInterval(id);
    }, 70);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div className="absolute inset-0 bg-white pt-[54px] text-[#0C1014]">
      <div className="relative flex h-[44px] items-center justify-center">
        <button type="button" onClick={() => go("done")} aria-label="Back" className="absolute left-2">
          <ChevronLeft className="h-[28px] w-[28px]" aria-hidden />
        </button>
        <span className="text-[17px] font-bold">New post</span>
      </div>

      <div className="flex justify-center pt-4">
        <div className="relative h-[230px] w-[230px] overflow-hidden rounded-[6px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={safeUrl ?? MAIN.src} alt="The safe copy of the photo" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="px-4 pt-5">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          aria-label="Caption"
          rows={2}
          className="w-full resize-none bg-transparent text-[16px] outline-none placeholder:text-[#737373]"
        />
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {["Poll", "Prompt", "#hashtags"].map((c) => (
          <span key={c} className="shrink-0 rounded-[8px] bg-[#EFEFEF] px-3 py-[6px] text-[13px] font-semibold">
            {c}
          </span>
        ))}
      </div>

      <div className="border-t border-[#DBDBDB]">
        {[
          { I: Music2, l: "Add music" },
          { I: Tag, l: "Tag people" },
          { I: MapPin, l: "Add location", note: `Off · ${BRAND.name}` },
          { I: Users, l: "Audience", note: "Everyone" },
        ].map(({ I, l, note }) => (
          <div key={l} className="flex items-center gap-3 px-4 py-[13px]">
            <I className="h-[22px] w-[22px]" aria-hidden />
            <span className="flex-1 text-[16px]">{l}</span>
            {note && <span className="text-[14px] text-[#737373]">{note}</span>}
            <ChevronRight className="h-5 w-5 text-[#737373]" aria-hidden />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 px-4 pb-[34px] pt-3">
        <button
          type="button"
          data-tap="next"
          onClick={() => go("posted")}
          className={`h-[48px] w-full rounded-[10px] text-[16px] font-semibold text-white ${hintCls(!driven)}`}
          style={{ background: IG_BLUE }}
        >
          Share
        </button>
      </div>
    </div>
  );
}

/* ---------------- Instagram: feed after posting ---------------- */

export function Posted() {
  const { safeUrl } = useFlow();
  const [phase, setPhase] = useState<"posting" | "posted">("posting");
  const [banner, setBanner] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("posted"), 1800);
    const t2 = window.setTimeout(() => setBanner(true), 2600);
    const t3 = window.setTimeout(() => setBanner(false), 7600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const stories = ["mirror", "summit", "grads", "rooftop", "coffeewalk"];
  const img = safeUrl ?? MAIN.src;

  return (
    <div className="absolute inset-0 bg-white text-[#0C1014]">
      <div className="no-scrollbar absolute inset-0 overflow-y-auto pb-[90px] pt-[54px]">
        <div className="flex h-[44px] items-center justify-between px-4">
          <span className="text-[30px] leading-none" style={{ fontFamily: "var(--font-ig), cursive" }}>
            Instagram
          </span>
          <span className="flex items-center gap-5">
            <Heart className="h-[25px] w-[25px]" aria-hidden />
            <MessageCircle className="h-[25px] w-[25px]" aria-hidden />
          </span>
        </div>

        {/* stories */}
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 py-2">
          <span className="flex w-[70px] shrink-0 flex-col items-center gap-1">
            <span className="relative">
              <Avatar size={64} />
              <span className="absolute bottom-0 right-0 flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white text-[14px] font-bold leading-none text-white" style={{ background: IG_BLUE }}>
                +
              </span>
            </span>
            <span className="text-[11px] text-[#737373]">Your story</span>
          </span>
          {stories.map((s) => (
            <span key={s} className="flex w-[70px] shrink-0 flex-col items-center gap-1">
              <span className="rounded-full p-[2.5px]" style={{ background: "linear-gradient(45deg,#FEDA75,#FA7E1E,#D62976,#962FBF)" }}>
                <span className="relative block h-[60px] w-[60px] overflow-hidden rounded-full border-[2.5px] border-white">
                  <Image src={`/assets/share/${s}.webp`} alt="" fill sizes="60px" className="object-cover" />
                </span>
              </span>
              <span className="w-full truncate text-center text-[11px]">{s}_</span>
            </span>
          ))}
        </div>

        {/* upload status */}
        <AnimatePresence>
          {phase === "posting" && (
            <motion.div exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-y border-[#EFEFEF]">
              <div className="flex items-center gap-3 px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-[36px] w-[36px] rounded-[4px] object-cover" />
                <span className="flex-1 text-[14px]">Posting...</span>
              </div>
              <motion.div className="h-[2px]" style={{ background: IG_BLUE }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.7 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* the post */}
        <article className="pt-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar />
            <span className="flex-1 text-[14px] font-semibold">{HANDLE}</span>
            <Ellipsis className="h-5 w-5" aria-hidden />
          </div>
          <button type="button" onDoubleClick={() => setLiked(true)} className="relative block aspect-square w-full" aria-label="Your new post">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="The posted safe copy" className="h-full w-full object-cover" />
          </button>
          <div className="flex items-center gap-4 px-3 pt-3">
            <button type="button" onClick={() => setLiked(!liked)} aria-label="Like">
              <Heart className={`h-[25px] w-[25px] ${liked ? "text-[#FF3040]" : ""}`} weight={liked ? "fill" : "regular"} aria-hidden />
            </button>
            <MessageCircle className="h-[25px] w-[25px] -scale-x-100" aria-hidden />
            <Send className="h-[24px] w-[24px]" aria-hidden />
            <Bookmark className="ml-auto h-[25px] w-[25px]" aria-hidden />
          </div>
          <p className="px-3 pt-2 text-[14px] font-semibold">{phase === "posted" ? (liked ? "Liked by you and jake.m" : "Liked by jake.m and 3 others") : "Be the first to like this"}</p>
          <p className="px-3 pt-1 text-[14px]">
            <span className="font-semibold">{HANDLE}</span> {CAPTION}
          </p>
          <p className="px-3 pt-1 text-[12px] text-[#737373]">Just now</p>
        </article>
      </div>

      {/* SafePost notification */}
      <AnimatePresence>
        {banner && (
          <motion.div
            className="absolute inset-x-[10px] top-[50px] z-30 flex items-start gap-3 rounded-[22px] bg-white/80 p-3 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] ring-1 ring-black/5 backdrop-blur-2xl"
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            role="status"
          >
            <AppIcon size={36} />
            <div className="min-w-0 flex-1">
              <p className="flex justify-between text-[14px] font-semibold">
                {BRAND.name} <span className="text-[12px] font-normal text-[#6B6B73]">now</span>
              </p>
              <p className="text-[14px] leading-snug">Posted the safe copy. Your address and location stayed private.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* tab bar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[84px] items-start justify-around border-t border-[#EFEFEF] bg-white pt-[12px]">
        <Home className="h-[26px] w-[26px]" weight="fill" aria-hidden />
        <Search className="h-[26px] w-[26px]" aria-hidden />
        <PlusSquare className="h-[26px] w-[26px]" aria-hidden />
        <Clapperboard className="h-[26px] w-[26px]" aria-hidden />
        <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border-2 border-black">
          <Avatar size={22} />
        </span>
      </div>
    </div>
  );
}
