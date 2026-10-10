//created by kinjal
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Images, BarChart3, Settings, ShieldCheck } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useProto, type ScreenId } from "../PrototypeController";

// In-app palette. The phone always renders in its own light iOS look.
export const APP = {
  bg: "#F6F2EA",
  card: "#FFFFFF",
  navy: "#2B3A67",
  coral: "#E8846B",
  coralSoft: "#FBE4DC",
  lav: "#8F80C2",
  lavDeep: "#5C4C9C",
  lavSoft: "#EEEAF8",
  sage: "#6F9E7D",
  sageDeep: "#3E6C4C",
  sageSoft: "#E3EFE6",
  amber: "#D99A2B",
  amberDeep: "#8A5A06",
  amberSoft: "#FBEFD8",
  brick: "#B5543F",
  brickSoft: "#F6E1DB",
  text: "#1C1C1E",
  sub: "#6B6B73",
  sep: "#E7E1D7",
};

/** Scrollable screen body that sits under the status bar. */
export function ScreenBody({
  children,
  className = "",
  tabbar = false,
  scrollRef,
}: {
  children: ReactNode;
  className?: string;
  tabbar?: boolean;
  scrollRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <>
      <div
        ref={scrollRef}
        className={`no-scrollbar absolute inset-0 overflow-y-auto overscroll-contain pt-[54px] ${tabbar ? "pb-[96px]" : "pb-[40px]"} ${className}`}
      >
        {children}
      </div>
      {/* frosted strip behind the status bar so content never collides with it */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[54px] bg-[#F6F2EA]/85 backdrop-blur-xl" aria-hidden />
    </>
  );
}

export function LargeTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between px-5 pb-3 pt-2">
      <div>
        {sub && <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8A8790]">{sub}</p>}
        <h3 className="text-[34px] font-bold leading-tight tracking-tight">{title}</h3>
      </div>
      {right}
    </div>
  );
}

export function NavBar({
  title,
  backLabel = "Back",
  onBack,
  right,
  tone = "dark",
}: {
  title?: string;
  backLabel?: string;
  onBack?: () => void;
  right?: ReactNode;
  tone?: "dark" | "light";
}) {
  const { back } = useProto();
  const color = tone === "light" ? "#FFFFFF" : APP.navy;
  return (
    <div
      className="sticky top-[54px] z-20 flex h-[44px] items-center justify-between px-2 backdrop-blur-xl"
      style={{ background: tone === "light" ? "transparent" : "rgba(246,242,234,0.85)" }}
    >
      <button
        type="button"
        onClick={onBack ?? back}
        className="flex items-center rounded-lg px-1 py-1 text-[17px]"
        style={{ color }}
      >
        <ChevronLeft className="h-[26px] w-[26px]" strokeWidth={2.4} aria-hidden />
        {backLabel}
      </button>
      {title && (
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold" style={{ color: tone === "light" ? "#fff" : APP.text }}>
          {title}
        </span>
      )}
      <div className="flex items-center gap-1 pr-2">{right}</div>
    </div>
  );
}

const TABS: { id: ScreenId; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Today", Icon: Home },
  { id: "scan", label: "Scan", Icon: Images },
  { id: "album", label: "Safe to Share", Icon: ShieldCheck },
  { id: "insights", label: "Insights", Icon: BarChart3 },
  { id: "settings", label: "Settings", Icon: Settings },
];

export function TabBar({ hint }: { hint?: ScreenId }) {
  const { state, go, driven } = useProto();
  return (
    <nav
      aria-label="App tabs"
      className="absolute inset-x-0 bottom-0 z-30 flex h-[88px] items-start justify-around border-t border-black/5 bg-[#FBF9F5]/90 px-2 pt-[8px] backdrop-blur-xl"
    >
      {TABS.map(({ id, label, Icon }) => {
        const on = state.screen === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => go(id, { mode: "tab" })}
            aria-current={on ? "page" : undefined}
            className={`flex w-[72px] flex-col items-center gap-[3px] rounded-xl py-1 ${hint === id && !driven ? "tap-hint" : ""}`}
            style={{ color: on ? APP.coral : "#9A97A0" }}
          >
            <Icon className="h-[25px] w-[25px]" strokeWidth={on ? 2.4 : 2} aria-hidden />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-[18px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_18px_-8px_rgba(43,58,103,0.18)] ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SectionHeader({ children }: { children: ReactNode }) {
  return <p className="px-5 pb-[6px] pt-5 text-[13px] font-medium uppercase tracking-wide text-[#8A8790]">{children}</p>;
}

export function ListGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-4 overflow-hidden rounded-[14px] bg-white ${className}`}>{children}</div>;
}

export function ListRow({
  icon,
  iconBg = APP.navy,
  title,
  sub,
  right,
  onClick,
  chevron = false,
  last = false,
}: {
  icon?: ReactNode;
  iconBg?: string;
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  chevron?: boolean;
  last?: boolean;
}) {
  const inner = (
    <>
      {icon && (
        <span className="mt-[1px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: iconBg }}>
          {icon}
        </span>
      )}
      <span className={`flex min-w-0 flex-1 items-center gap-3 py-[11px] pr-4 ${last ? "" : "border-b border-[#ECE7DE]"}`}>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[16px] leading-snug">{title}</span>
          {sub && <span className="mt-[2px] block text-[13px] leading-snug text-[#7A7781]">{sub}</span>}
        </span>
        {right}
        {chevron && <ChevronRight className="h-5 w-5 shrink-0 text-[#C4C0C8]" aria-hidden />}
      </span>
    </>
  );
  const cls = "flex w-full items-start gap-3 pl-4 text-left";
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} active:bg-black/5`}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function Toggle({
  on,
  onChange,
  label,
  color = APP.sage,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200"
      style={{ background: on ? color : "#E3DFD8" }}
    >
      <motion.span
        className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
        initial={false}
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
      />
    </button>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  hint = false,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "navy" | "ghost" | "soft";
  className?: string;
  hint?: boolean;
  icon?: ReactNode;
}) {
  const styles: Record<string, string> = {
    primary: "bg-[#E8846B] text-[#1E2440]",
    navy: "bg-[#2B3A67] text-white",
    ghost: "bg-transparent text-[#2B3A67]",
    soft: "bg-[#EEEAF8] text-[#3B2F6B]",
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] text-[17px] font-semibold ${styles[variant]} ${hint ? "tap-hint" : ""} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export function Brownie({ pose, size = 80, className = "", alt = "" }: { pose: string; size?: number; className?: string; alt?: string }) {
  return (
    <Image
      src={`/assets/brownie-${pose}.webp`}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function AppIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/assets/app-icon.webp"
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/** iOS-style notification banner. */
export function NotificationBanner({
  title,
  body,
  time = "now",
  onClick,
  hint = false,
  appIcon,
}: {
  title: string;
  body: string;
  time?: string;
  onClick?: () => void;
  hint?: boolean;
  appIcon?: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ y: -120, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -120, opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`flex w-full items-start gap-3 rounded-[22px] bg-white/75 p-[12px] text-left shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] backdrop-blur-2xl ${hint ? "tap-hint" : ""}`}
    >
      <span className="shrink-0">{appIcon ?? <AppIcon size={38} />}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between">
          <span className="text-[15px] font-semibold">{title}</span>
          <span className="text-[13px] text-[#6B6B73]">{time}</span>
        </span>
        <span className="mt-[1px] block text-[15px] leading-snug text-[#1C1C1E]">{body}</span>
      </span>
    </motion.button>
  );
}
