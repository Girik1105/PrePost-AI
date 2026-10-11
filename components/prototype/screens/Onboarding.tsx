//created by kinjal
"use client";

import { motion } from "framer-motion";
import { Check, Images, Lock, Plus, X } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { useProto } from "../PrototypeController";
import { APP, AppIcon, Brownie, Button } from "../ui/kit";

function StepPill({ n }: { n: number }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-3">
      <span className="rounded-full bg-white px-3 py-[5px] text-[12px] font-semibold text-[#5C4C9C] shadow-sm">Step {n} of 3</span>
    </div>
  );
}

export function Welcome() {
  const { go, driven } = useProto();
  return (
    <div className="absolute inset-0 flex flex-col px-6 pb-[48px] pt-[70px]" style={{ background: "linear-gradient(180deg,#FBEDE4 0%,#F6F2EA 60%)" }}>
      <StepPill n={1} />
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative">
          <AppIcon size={92} className="drop-shadow-md" />
          <motion.div className="absolute -bottom-12 -right-20" initial={{ rotate: -8, y: 10, opacity: 0 }} animate={{ rotate: 0, y: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}>
            <Brownie pose="wave" size={84} className="animate-bob" />
          </motion.div>
        </div>
        <h3 className="mt-12 text-[30px] font-bold leading-tight tracking-tight">{BRAND.name}</h3>
        <p className="mt-3 text-[20px] font-medium leading-snug text-[#2B3A67]">Everything posted online is ink.</p>
        <p className="mt-1 text-[17px] leading-snug text-[#6B6B73]">Let&apos;s check it first.</p>
      </div>
      <Button onClick={() => go("access")} hint={!driven}>
        Get started
      </Button>
      <p className="mt-3 text-center text-[13px] text-[#8A8790]">No account needed for a basic scan.</p>
    </div>
  );
}

export function Access() {
  const { go, patch, state, driven } = useProto();
  const [choice, setChoice] = useState<"selected" | "all" | null>(state.access);
  const pick = (c: "selected" | "all") => {
    setChoice(c);
    patch({ access: c });
  };
  return (
    <div className="absolute inset-0 flex flex-col px-5 pb-[48px] pt-[70px]">
      <StepPill n={2} />
      <div className="mt-6 flex justify-center">
        <span className="flex h-[64px] w-[64px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#F3B7A6] to-[#E8846B] text-white shadow">
          <Images className="h-8 w-8" aria-hidden />
        </span>
      </div>
      <h3 className="mt-5 text-center text-[26px] font-bold leading-tight tracking-tight">Let PrePost look at new photos</h3>
      <p className="mt-2 text-center text-[15px] leading-snug text-[#6B6B73]">You choose once. You can change it anytime in Settings.</p>

      <div className="mt-6 overflow-hidden rounded-[16px] bg-white" role="radiogroup" aria-label="Photo access">
        {(
          [
            { id: "selected", title: "Selected Photos", sub: "Only the photos you pick" },
            { id: "all", title: "All Photos", sub: "New photos are checked as you take them" },
          ] as const
        ).map((o, i) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={choice === o.id}
            onClick={() => pick(o.id)}
            className={`flex w-full items-center gap-3 px-4 py-[14px] text-left ${i === 0 ? "border-b border-[#ECE7DE]" : ""} ${!choice && !driven && o.id === "all" ? "tap-hint" : ""}`}
          >
            <span className="flex-1">
              <span className="block text-[17px] font-medium">{o.title}</span>
              <span className="block text-[13px] text-[#7A7781]">{o.sub}</span>
            </span>
            <span
              className="flex h-[24px] w-[24px] items-center justify-center rounded-full border-2"
              style={{ borderColor: choice === o.id ? APP.coral : "#D6D1C9", background: choice === o.id ? APP.coral : "transparent" }}
            >
              {choice === o.id && <Check className="h-[14px] w-[14px] text-white" weight="bold" aria-hidden />}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3 rounded-[16px] p-4" style={{ background: APP.sageSoft }}>
        <Lock className="mt-[2px] h-5 w-5 shrink-0" style={{ color: APP.sageDeep }} aria-hidden />
        <p className="text-[14px] leading-snug" style={{ color: "#2F5A3D" }}>
          <span className="font-semibold">Scanning happens on your phone.</span> Photos never leave unless you ask.
        </p>
      </div>

      <div className="flex-1" />
      <Button onClick={() => go("kids")} hint={!!choice && !driven} variant={choice ? "primary" : "soft"}>
        Continue
      </Button>
      <button type="button" onClick={() => go("kids")} className="mt-3 text-center text-[15px] font-medium text-[#2B3A67]">
        Not now
      </button>
    </div>
  );
}

export function Kids() {
  const { patch, state, driven } = useProto();
  const [names, setNames] = useState<string[]>(state.kids);
  const [draft, setDraft] = useState("");
  const add = () => {
    const n = draft.trim();
    if (!n || names.includes(n)) return;
    setNames([...names, n]);
    setDraft("");
  };
  const finish = () => patch({ kids: names, screen: "lock", dir: 0, stack: [], notif: false, cue: { name: "notify", key: Date.now() } });
  return (
    <div className="absolute inset-0 flex flex-col px-5 pb-[48px] pt-[70px]">
      <StepPill n={3} />
      <h3 className="mt-7 text-[26px] font-bold leading-tight tracking-tight">Who&apos;s in your photos?</h3>
      <p className="mt-2 text-[15px] leading-snug text-[#6B6B73]">
        Optional. Add your kids&apos; names so PrePost can catch them on signs, cakes, and captions. Names stay on your phone.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {names.map((n) => (
          <span key={n} className="flex items-center gap-1 rounded-full py-[7px] pl-3 pr-2 text-[15px] font-medium" style={{ background: APP.lavSoft, color: "#3B2F6B" }}>
            {n}
            <button type="button" aria-label={`Remove ${n}`} onClick={() => setNames(names.filter((x) => x !== n))} className="rounded-full p-[2px]">
              <X className="h-4 w-4" aria-hidden />
            </button>
          </span>
        ))}
      </div>
      <form
        className="mt-4 flex items-center gap-2 rounded-[14px] bg-white px-3"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a name"
          aria-label="Child's name"
          className="h-[48px] flex-1 bg-transparent text-[17px] outline-none placeholder:text-[#A9A5AE]"
        />
        <button type="submit" aria-label="Add name" className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-white" style={{ background: APP.navy }}>
          <Plus className="h-5 w-5" aria-hidden />
        </button>
      </form>
      <div className="flex flex-1 items-end justify-center pb-4">
        <Brownie pose="thinking" size={130} />
      </div>
      <Button onClick={finish} hint={!driven}>
        All set
      </Button>
      <button type="button" onClick={finish} className="mt-3 text-center text-[15px] font-medium text-[#2B3A67]">
        Skip
      </button>
    </div>
  );
}
