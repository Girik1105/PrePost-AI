//created by kinjal
"use client";

import { useEffect, useRef, useState } from "react";
import StatusBar from "./StatusBar";

export const SCREEN_W = 390;
export const SCREEN_H = 844;
const BEZEL = 12;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;

/**
 * A generic modern phone drawn in CSS. The screen is laid out at 390 x 844 and
 * scaled to whatever width the parent gives it, so text stays crisp.
 */
export default function PhoneFrame({
  children,
  statusTone = "dark",
  className = "",
  label = "Interactive phone prototype",
  homeTone,
}: {
  children: React.ReactNode;
  statusTone?: "dark" | "light";
  className?: string;
  label?: string;
  homeTone?: "dark" | "light";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / FRAME_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const home = (homeTone ?? statusTone) === "light" ? "bg-white/90" : "bg-black/80";

  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ height: FRAME_H * scale }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
      >
        {/* side buttons */}
        <span className="absolute -left-[3px] top-[160px] h-[34px] w-[4px] rounded-l bg-[#2a2c38]" />
        <span className="absolute -left-[3px] top-[220px] h-[62px] w-[4px] rounded-l bg-[#2a2c38]" />
        <span className="absolute -left-[3px] top-[296px] h-[62px] w-[4px] rounded-l bg-[#2a2c38]" />
        <span className="absolute -right-[3px] top-[240px] h-[96px] w-[4px] rounded-r bg-[#2a2c38]" />
        {/* body */}
        <div
          className="absolute inset-0 rounded-[64px] bg-[#1b1d27] p-[12px]"
          style={{
            boxShadow:
              "0 0 0 1.5px #3a3d4c inset, 0 2px 2px rgba(20,24,43,0.08), 0 30px 60px -20px rgba(20,24,43,0.45), 0 60px 120px -40px rgba(20,24,43,0.35)",
          }}
        >
          <div
            role="region"
            aria-label={label}
            className="relative h-full w-full overflow-hidden rounded-[52px] bg-[#F6F2EA] font-ios text-[#1C1C1E] antialiased"
            style={{ width: SCREEN_W, height: SCREEN_H }}
          >
            {children}
            <StatusBar tone={statusTone} />
            {/* dynamic island */}
            <div className="pointer-events-none absolute left-1/2 top-[11px] z-50 h-[37px] w-[124px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
            {/* home indicator */}
            <div className={`pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[136px] -translate-x-1/2 rounded-full ${home}`} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
