//created by kinjal
import { Bank as Landmark, Sparkle as Sparkles, ShieldCheck, Handshake as HeartHandshake } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const PRINCIPLES = [
  {
    name: "Respect",
    icon: Landmark,
    body: "We protect a child's privacy before they're old enough to protect it themselves.",
    card: "bg-respect text-paper",
    chip: "bg-paper/15",
  },
  {
    name: "Self-reflection",
    icon: Sparkles,
    body: "One question before you post: would they be okay with this at 16?",
    card: "bg-reflection/20 text-ink ring-1 ring-reflection/40",
    chip: "bg-reflection text-paper",
  },
  {
    name: "Integrity",
    icon: ShieldCheck,
    body: "Privacy-first by design. Your photos stay yours.",
    card: "bg-integrity/20 text-ink ring-1 ring-integrity/40",
    chip: "bg-integrity text-paper",
  },
  {
    name: "Compassion",
    icon: HeartHandshake,
    body: "We help, we never shame. Sharing your kids is love. We just make it safer.",
    card: "bg-compassion/25 text-ink ring-1 ring-compassion/40",
    chip: "bg-compassion text-[#1E2440]",
  },
];

export default function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="bg-paper2/70 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="Humanity 101"
        title={<span id="principles-title">The principles behind it.</span>}
        intro="Each principle has its own color, and you'll find it across the whole product."
        mascot="brownie-thumbsup"
        mascotAlt="Brownie mascot giving a thumbs up"
      />
      <div className="mx-auto mt-16 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <article className={`flex h-full flex-col rounded-[28px] p-7 shadow-soft ${p.card}`}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${p.chip}`}>
                <p.icon size={22} aria-hidden />
              </span>
              <h3 className="mt-8 font-display text-2xl font-medium">{p.name}</h3>
              <p className="mt-3 leading-relaxed opacity-90">{p.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
