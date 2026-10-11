//created by kinjal
import Image from "next/image";
import { DeviceMobile as Smartphone, Lock, UserMinus as UserX, HandCoins, MagicWand as Wand2 } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./Reveal";

const POINTS = [
  { icon: Smartphone, text: "Most scanning happens on your phone." },
  { icon: Lock, text: "Private moments never leave your device." },
  { icon: UserX, text: "No account needed for a basic scan." },
  { icon: HandCoins, text: "We never sell or share your photos or data." },
  { icon: Wand2, text: "PrePost edits objects and text only, never faces or bodies." },
];

export default function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-integrity/15 px-6 py-16 ring-1 ring-integrity/30 sm:px-12 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr]">
          <Reveal className="mx-auto">
            <Image
              src="/assets/brownie-shield.webp"
              alt="Brownie mascot holding a green shield"
              width={220}
              height={294}
              className="h-56 w-auto animate-bob sm:h-64"
            />
          </Reveal>
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-integrity-deep">Privacy first</p>
              <h2 id="privacy-title" className="mt-3 text-balance font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
                Your photos stay yours.
              </h2>
            </Reveal>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {POINTS.map((p, i) => (
                <Reveal key={p.text} delay={i * 0.06}>
                  <li className="flex h-full items-start gap-3 rounded-2xl bg-card/80 p-4 shadow-soft lift">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-integrity text-paper">
                      <p.icon size={19} aria-hidden />
                    </span>
                    <span className="pt-1.5 font-medium leading-snug text-ink">{p.text}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
