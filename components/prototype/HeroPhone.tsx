//created by kinjal
"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import PhoneFrame from "./PhoneFrame";
import { ProtoProvider, useProto } from "./PrototypeController";
import LockScreen from "./screens/LockScreen";

// Drops the notification in, holds it, clears it, repeats.
function Loop() {
  const { patch } = useProto();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      patch({ notif: true });
      return;
    }
    let on = false;
    const tick = () => {
      on = !on;
      patch({ notif: on });
    };
    const first = window.setTimeout(tick, 900);
    const id = window.setInterval(tick, 4200);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [patch, reduce]);
  return null;
}

export default function HeroPhone({ className = "" }: { className?: string }) {
  const toDemo = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "/share";
  };
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/assets/brownie-peek.webp"
        alt="The SafePost brownie peeking over the phone"
        width={200}
        height={198}
        priority
        className="absolute -top-[54px] right-[3%] z-10 w-[92px] sm:w-[104px]"
      />
      <ProtoProvider initial={{ screen: "lock", notif: false }}>
        <Loop />
        <div onClickCapture={toDemo}>
          <PhoneFrame statusTone="light" label="SafePost notification on a lock screen. Click to see the share flow.">
            <LockScreen />
          </PhoneFrame>
        </div>
      </ProtoProvider>
    </div>
  );
}
