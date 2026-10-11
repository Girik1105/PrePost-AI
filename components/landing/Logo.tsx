//created by kinjal
import Image from "next/image";
import { BRAND } from "@/lib/brand";

// Shield + ink drop mark (used in the footer).
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M16 2.5 L27 6.5 V15 C27 22 22.2 27.4 16 29.5 C9.8 27.4 5 22 5 15 V6.5 Z"
        fill="rgb(var(--respect))"
      />
      <path
        d="M16 9 C16 9 11.5 14.4 11.5 17.6 a4.5 4.5 0 0 0 9 0 C20.5 14.4 16 9 16 9 Z"
        fill="rgb(var(--compassion))"
      />
      <circle cx="14.4" cy="17.4" r="1.1" fill="#fff" opacity="0.7" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2">
      <Image sizes="28px"
        src="/assets/brownie-wave.webp"
        alt=""
        width={32}
        height={37}
        className="h-8 w-auto origin-bottom transition-transform hover:rotate-[-8deg] motion-reduce:transition-none"
        priority
      />
      <span className="font-display text-xl font-semibold tracking-tight text-ink">{BRAND.name}</span>
    </span>
  );
}
