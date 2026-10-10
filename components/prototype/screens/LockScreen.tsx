//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Camera, Flashlight } from "lucide-react";
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { useProto } from "../PrototypeController";
import { NotificationBanner } from "../ui/kit";

export default function LockScreen() {
  const { state, patch, go, driven } = useProto();

  // After onboarding, the first notification drops in a moment later.
  useEffect(() => {
    if (state.cue?.name !== "notify") return;
    const t = window.setTimeout(() => patch({ notif: true }), 1400);
    return () => window.clearTimeout(t);
  }, [state.cue, patch]);

  const open = () => patch({ screen: "detail", scene: "school", dir: 0, stack: ["home"], cue: null });

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(170deg,#B9B0DE 0%,#E9C2C6 48%,#F6D9B8 100%)" }}>
      <Image src="/assets/cloud-a.webp" alt="" width={320} height={206} className="absolute -left-16 top-[300px] w-[300px] opacity-80" />
      <Image src="/assets/cloud-b.webp" alt="" width={420} height={110} className="absolute -right-24 top-[520px] w-[380px] opacity-70" />
      <Image src="/assets/brownie-cloud.webp" alt="" width={120} height={120} className="absolute bottom-[150px] right-[36px] w-[96px] opacity-90" />

      <div className="relative pt-[78px] text-center text-white">
        <p className="text-[19px] font-semibold opacity-90">Saturday, October 10</p>
        <p className="text-[96px] font-semibold leading-[1] tracking-tight" style={{ textShadow: "0 2px 20px rgba(60,40,90,0.15)" }}>
          9:41
        </p>
      </div>

      <div className="relative mt-[36px] space-y-2 px-[12px]">
        <AnimatePresence>
          {state.notif && (
            <NotificationBanner
              key="sp"
              title={BRAND.name}
              body={`1 of 3 new photos shows ${BRAND.kid}'s school. A safe version is ready.`}
              onClick={open}
              hint={!driven}
            />
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: state.notif ? 0.85 : 0 }}
          transition={{ delay: 0.4 }}
          className="mx-[10px] rounded-[18px] bg-white/40 px-3 py-2 text-left text-[13px] text-[#3B3550] backdrop-blur-xl"
          aria-hidden={!state.notif}
        >
          <span className="font-semibold">Photos</span> · 3 new photos from today
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-[44px] flex items-center justify-between px-[46px]">
        <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/20 text-white backdrop-blur" aria-hidden>
          <Flashlight className="h-5 w-5" />
        </span>
        <button type="button" onClick={() => go("home", { mode: "tab" })} className="rounded-full px-3 py-1 text-[13px] font-medium text-white/90">
          Swipe up to open
        </button>
        <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/20 text-white backdrop-blur" aria-hidden>
          <Camera className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
