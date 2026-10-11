//created by kinjal
import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { BRAND } from "@/lib/brand";

const MEMBERS = [
  { name: "Begoyim Abdurazakova", role: "Medical student and researcher", img: "member-begoyim" },
  { name: "Girik Manchanda", role: "Full stack developer and AI prototype", img: "member-girik" },
  { name: "Iffath Fatima", role: "Pitch and story", img: "member-iffath" },
  { name: "Kinjal Chatterjee", role: "Frontend and design", img: "member-kinjal" },
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
          <Reveal key={m.name} delay={i * 0.06} as="li" className="group flex h-full flex-col items-center rounded-[28px] border border-line bg-card p-7 text-center shadow-soft lift">
              {/* The drawings sit in a torn watercolor circle; a round crop keeps just the portrait. */}
              <span className="block h-32 w-32 overflow-hidden rounded-full bg-[#1E2440] ring-4 ring-paper2">
                <Image sizes="160px"
                  src={`/assets/${m.img}.webp`}
                  alt={`Illustrated portrait of ${m.name}`}
                  width={360}
                  height={380}
                  className="h-full w-full scale-[1.24] object-cover transition-transform duration-500 group-hover:scale-[1.3] motion-reduce:transition-none"
                />
              </span>
              <h3 className="mt-5 font-semibold text-ink">{m.name}</h3>
              <p className="mt-1 text-sm text-muted">{m.role}</p>

          </Reveal>
        ))}
      </ul>
    </section>
  );
}
