//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Baby, CreditCard, Fingerprint, Heart, MapPin, MessageSquareText, Share, ShieldCheck, Sparkles, Users, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SCENES, liveScore, scoreWord, type Category } from "@/lib/scenes";
import { useProto } from "../PrototypeController";
import { APP, Brownie, Button, Card, NavBar, ScreenBody, SectionHeader, Toggle } from "../ui/kit";
import { DetectionOverlay, ScoreRing, VerdictPill } from "../ui/bits";
import SceneArt from "../scenes/SceneArt";

export const CATEGORY_ICON: Record<Category, { Icon: typeof MapPin; bg: string }> = {
  Location: { Icon: MapPin, bg: "#D98A3E" },
  Identity: { Icon: Fingerprint, bg: APP.navy },
  Financial: { Icon: CreditCard, bg: APP.brick },
  "Child safety": { Icon: Baby, bg: APP.lav },
  Metadata: { Icon: MapPin, bg: "#7A7781" },
};

export default function Detail() {
  const { state, setEdit, fixAll, strip, go, driven } = useProto();
  const scene = SCENES[state.scene];
  const scrollRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [glow, setGlow] = useState(false);
  const [sheet, setSheet] = useState(false);

  const stripped = !!state.stripped[scene.id];
  const score = liveScore(scene, state.edits, stripped);
  const openIds = scene.detections.filter((d) => (d.fix === "strip" ? !stripped : (state.edits[d.id] ?? "none") === "none")).map((d) => d.id);
  const allFixed = scene.detections.length > 0 && openIds.length === 0;

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 350);
    return () => window.clearTimeout(t);
  }, [scene.id]);

  // demo cues
  useEffect(() => {
    const c = state.cue;
    if (!c) return;
    const el = scrollRef.current;
    if (c.name === "why" && el && whyRef.current) {
      el.scrollTo({ top: whyRef.current.offsetTop - 70, behavior: "smooth" });
      setGlow(true);
      const t = window.setTimeout(() => setGlow(false), 5000);
      return () => window.clearTimeout(t);
    }
    if ((c.name === "top" || c.name === "reveal") && el) el.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.cue]);

  const fixIt = () => {
    fixAll(scene.id);
    strip(scene.id, true);
  };

  return (
    <>
      <ScreenBody scrollRef={scrollRef}>
        <NavBar
          title={scene.title}
          right={
            <button type="button" aria-label="Share" onClick={() => setSheet(true)} className="rounded-lg p-1 text-[#2B3A67]">
              <Share className="h-[22px] w-[22px]" aria-hidden />
            </button>
          }
        />

        <div className="relative aspect-[4/3] w-full bg-[#E9E3D8]">
          <SceneArt id={scene.id} edits={state.edits} className="h-full w-full" />
          {!scene.privateMoment && <DetectionOverlay detections={scene.detections} show={show} activeIds={openIds} />}
          <AnimatePresence>
            {allFixed && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-[6px] text-[13px] font-semibold shadow"
                style={{ color: APP.sageDeep }}
              >
                <ShieldCheck className="h-4 w-4" aria-hidden /> Safe version ready
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* score + verdict */}
        <div className="px-4 pt-4">
          <Card className="flex items-center gap-4 p-4">
            {score !== null ? (
              <ScoreRing value={score} play={show} />
            ) : (
              <span className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full" style={{ background: APP.lavSoft }}>
                <ShieldCheck className="h-10 w-10" style={{ color: APP.lavDeep }} aria-hidden />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8A8790]">
                {score !== null ? scoreWord(score) : "Stays on your phone"}
              </p>
              <p className="mt-[2px] text-[15px] leading-snug text-[#4A4852]">
                {scene.privateMoment
                  ? "Never sent to any AI or server."
                  : scene.detections.length === 0
                    ? "Nothing personal found."
                    : allFixed
                      ? "Everything risky is hidden."
                      : `${openIds.length} thing${openIds.length === 1 ? "" : "s"} to look at.`}
              </p>
              {scene.verdict && (
                <div className="mt-2">
                  <VerdictPill verdict={allFixed ? "safe" : scene.verdict} small />
                </div>
              )}
              <p className="mt-2 flex items-center gap-1 text-[12px] text-[#8A8790]">
                {scene.takenAt}
                {scene.location && (
                  <>
                    <span aria-hidden>·</span>
                    <MapPin className="h-3 w-3" aria-hidden />
                    <span className={stripped ? "line-through" : ""}>{scene.location}</span>
                    {stripped && <span style={{ color: APP.sageDeep }}>removed</span>}
                  </>
                )}
              </p>
            </div>
          </Card>
        </div>

        {/* findings */}
        {scene.detections.length > 0 && (
          <>
            <SectionHeader>What it gives away</SectionHeader>
            <div className="mx-4 overflow-hidden rounded-[16px] bg-white">
              {scene.detections.map((d, i) => {
                const { Icon, bg } = CATEGORY_ICON[d.category];
                const on = d.fix === "strip" ? stripped : (state.edits[d.id] ?? "none") !== "none";
                return (
                  <div key={d.id} className="flex items-start gap-3 pl-4">
                    <span className="mt-[13px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: bg }}>
                      <Icon className="h-[17px] w-[17px]" aria-hidden />
                    </span>
                    <div className={`flex min-w-0 flex-1 items-center gap-3 py-[12px] pr-4 ${i < scene.detections.length - 1 ? "border-b border-[#ECE7DE]" : ""}`}>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold leading-snug">{d.label}</p>
                        <p className="mt-[2px] text-[13px] leading-snug text-[#7A7781]">{d.reason}</p>
                        <p className="mt-[3px] text-[11px] font-semibold uppercase tracking-wide" style={{ color: on ? APP.sageDeep : "#A29FA8" }}>
                          {on ? (d.fix === "strip" ? "Removed" : state.edits[d.id] === "remove" ? "Removed" : "Blurred") : d.category}
                        </p>
                      </div>
                      <Toggle
                        on={on}
                        label={`${d.fix === "strip" ? "Strip" : "Blur"} ${d.label}`}
                        onChange={(v) => (d.fix === "strip" ? strip(scene.id, v) : setEdit(d.id, v ? "blur" : "none"))}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* why this matters */}
        {scene.why && (
          <div ref={whyRef} className="px-4 pt-5">
            <motion.div
              animate={glow ? { boxShadow: "0 0 0 4px rgba(143,128,194,0.45)" } : { boxShadow: "0 0 0 0px rgba(143,128,194,0)" }}
              transition={{ duration: 0.5 }}
              className="rounded-[18px]"
            >
              <Card className="overflow-hidden">
                <div className="p-4">
                  <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide" style={{ color: APP.navy }}>
                    <Heart className="h-4 w-4" aria-hidden /> Why this matters
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#3A3842]">{scene.why}</p>
                </div>
                {scene.question && (
                  <div className="flex items-center gap-3 px-4 py-3" style={{ background: APP.lavSoft }}>
                    <Brownie pose="thinking" size={54} />
                    <p className="flex-1 text-[17px] font-semibold leading-snug" style={{ color: "#4A3B8C" }}>
                      {scene.question}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}

        {/* actions */}
        <div className="space-y-[10px] px-4 pb-4 pt-5">
          {scene.detections.length > 0 && !allFixed && (
            <Button onClick={fixIt} hint={!driven} icon={<Wand2 className="h-5 w-5" aria-hidden />}>
              Fix it for me
            </Button>
          )}
          {allFixed && (
            <Button onClick={() => go("compare")} hint={!driven} variant="navy" icon={<Sparkles className="h-5 w-5" aria-hidden />}>
              See before and after
            </Button>
          )}
          {scene.detections.length > 0 && (
            <Button onClick={() => go("edit")} variant="soft" icon={<MessageSquareText className="h-5 w-5" aria-hidden />}>
              Edit with words
            </Button>
          )}
          {scene.detections.length === 0 && !scene.privateMoment && (
            <div className="flex flex-col items-center gap-2 py-2 text-center">
              <Brownie pose="thumbsup" size={90} />
              <p className="text-[15px] text-[#4A4852]">Good to go. Enjoy sharing it.</p>
            </div>
          )}
          <Button onClick={() => setSheet(true)} variant="ghost" icon={<Users className="h-5 w-5" aria-hidden />}>
            Share privately instead
          </Button>
        </div>
      </ScreenBody>

      {/* share privately sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              className="absolute inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Share privately"
              className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-[#F6F2EA] px-4 pb-[40px] pt-3"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            >
              <div className="mx-auto mb-4 h-[5px] w-[36px] rounded-full bg-[#D6D1C9]" />
              <p className="text-[20px] font-bold">Share privately</p>
              <p className="mt-1 text-[14px] text-[#6B6B73]">Send it to the people who love her, without posting it.</p>
              <div className="mt-4 overflow-hidden rounded-[14px] bg-white">
                {["Family album", "Grandma & Grandpa", "Close friends"].map((n, i) => (
                  <button key={n} type="button" onClick={() => setSheet(false)} className={`flex w-full items-center justify-between px-4 py-[14px] text-left text-[16px] ${i < 2 ? "border-b border-[#ECE7DE]" : ""}`}>
                    {n}
                    <span className="text-[13px] font-semibold" style={{ color: APP.coral }}>Send</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
