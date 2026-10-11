//created by kinjal
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { BRAND } from "@/lib/brand";

// TODO(team): replace the placeholder names, roles and initials below with the real team.
const MEMBERS = [
  { name: "Team member 1", role: "Frontend and design", line: "CS @ ASU", initials: "T1", tint: "bg-compassion/30" },
  { name: "Team member 2", role: "Prototype and AI", line: "CS @ ASU", initials: "T2", tint: "bg-reflection/30" },
  { name: "Team member 3", role: "Child safety research", line: "Medical student", initials: "T3", tint: "bg-integrity/30" },
  { name: "Team member 4", role: "Story and pitch", line: "Medical student", initials: "T4", tint: "bg-respect/20" },
];

export default function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="bg-paper2/70 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow={BRAND.event}
        title={<span id="team-title">Team {BRAND.team}</span>}
        intro="CS students and medical students who wanted one more careful moment before a photo goes out."
        mascot="brownie-wave"
        mascotAlt="Brownie mascot waving"
      />
      <ul className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MEMBERS.map((m, i) => (
          <Reveal key={m.initials} delay={i * 0.06}>
            <li className="flex h-full flex-col items-center rounded-[28px] border border-line bg-card p-7 text-center shadow-soft lift">
              <span
                className={`grid h-20 w-20 place-items-center rounded-full font-display text-2xl font-semibold text-ink ${m.tint}`}
                aria-hidden
              >
                {m.initials}
              </span>
              <h3 className="mt-5 font-semibold text-ink">{m.name}</h3>
              <p className="mt-1 text-sm text-ink/80">{m.role}</p>
              <p className="mt-1 text-sm text-muted">{m.line}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
