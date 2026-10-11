//created by kinjal
import { GraduationCap as School, House, Car, SealCheck as BadgeCheck, CreditCard, QrCode, Devices as MonitorSmartphone, MapPin, User as UserRound, ShieldSlash as ShieldOff } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const ITEMS = [
  { icon: School, label: "School names and uniforms", note: "Signs, crests, logos on a backpack." },
  { icon: House, label: "House numbers and addresses", note: "Porch numbers, mailboxes, street signs." },
  { icon: Car, label: "License plates", note: "On the car in the driveway or the street." },
  { icon: BadgeCheck, label: "Name tags and full names", note: "Backpack tags, cakes, banners, jerseys." },
  { icon: CreditCard, label: "Cards and IDs", note: "Bank cards, driver's licenses, badges." },
  { icon: QrCode, label: "Boarding passes and QR codes", note: "Booking codes and scannable tickets." },
  { icon: MonitorSmartphone, label: "Screens with emails or phone numbers", note: "Open laptops and phones in the shot." },
  { icon: MapPin, label: "Location data hidden in the photo", note: "GPS tags your camera adds on its own." },
  { icon: UserRound, label: "Bystander faces", note: "Optional. Blur people who didn't ask to be in it." },
  { icon: ShieldOff, label: "Private moments", note: "Flagged on your phone. Never uploaded.", special: true },
];

export default function Detects() {
  return (
    <section id="catches" aria-labelledby="catches-title" className="px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="What it catches"
        title={<span id="catches-title">The little things you&apos;d never notice.</span>}
        intro="SafePost looks for the details strangers look for. Here's what it checks in every photo."
        mascot="brownie-magnify"
        mascotAlt="Brownie mascot looking through a magnifying glass"
      />
      <ul className="mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ITEMS.map((it, i) => (
          <Reveal key={it.label} delay={(i % 5) * 0.05}>
            <li
              className={`flex h-full flex-col rounded-3xl border p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1 ${
                it.special ? "border-integrity/40 bg-integrity/10" : "border-line bg-card"
              }`}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-2xl ${
                  it.special ? "bg-integrity text-paper" : "bg-respect/10 text-respect"
                }`}
              >
                <it.icon size={21} aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold leading-snug text-ink">{it.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{it.note}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
