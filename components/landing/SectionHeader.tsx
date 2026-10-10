//created by kinjal
import Image from "next/image";
import Reveal from "./Reveal";

// Shared section heading: small eyebrow, editorial title, a brownie pose that fits the section.
export default function SectionHeader({
  eyebrow,
  title,
  intro,
  mascot,
  mascotAlt,
  eyebrowClass = "text-compassion-deep",
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  mascot?: string;
  mascotAlt?: string;
  eyebrowClass?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} max-w-2xl`}>
      {mascot && (
        <Image
          src={`/assets/${mascot}.webp`}
          alt={mascotAlt ?? ""}
          width={88}
          height={110}
          className={`${centered ? "mx-auto" : ""} mb-3 h-[84px] w-auto drop-shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-4deg] motion-reduce:transition-none motion-reduce:hover:transform-none`}
        />
      )}
      <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${eyebrowClass}`}>{eyebrow}</p>
      <h2 className="mt-3 text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{intro}</p>}
    </Reveal>
  );
}
