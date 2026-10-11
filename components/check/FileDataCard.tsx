"use client";

import { useState } from "react";
import { ArrowUpRight, Camera, CheckCircle as CheckCircle2, CaretDown as ChevronDown, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { formatCoords, mapUrl, type FileData } from "@/lib/fileData";

const TAKEN = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
const NOUN: Record<string, string> = { Location: "location", Taken: "time taken", Camera: "camera" };

function MapLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="See this spot on a map"
      className="inline-flex max-w-full items-center gap-1 rounded underline decoration-respect/40 underline-offset-2 hover:decoration-respect focus-visible:outline focus-visible:outline-2 focus-visible:outline-respect"
    >
      <span className="truncate">{children}</span>
      <ArrowUpRight size={13} className="shrink-0 text-respect" aria-hidden />
    </a>
  );
}

/**
 * What the original file was carrying (location, time, camera), shown before it is dropped from the safe copy.
 * `compact` folds it to a two-line strip so the list of findings keeps its room once results are in.
 */
export default function FileDataCard({ data, compact = false }: { data: FileData | null; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const hasLocation = data?.lat !== undefined && data?.lon !== undefined;
  const rows = data
    ? [
        hasLocation && {
          Icon: MapPin,
          label: "Location",
          value: formatCoords(data.lat!, data.lon!),
          link: mapUrl(data.lat!, data.lon!),
        },
        data.taken && { Icon: Clock, label: "Taken", value: TAKEN.format(data.taken) },
        data.camera && { Icon: Camera, label: "Camera", value: data.camera },
      ].filter((r): r is { Icon: typeof MapPin; label: string; value: string; link?: string } => Boolean(r))
    : [];

  if (!rows.length) {
    return (
      <section aria-label="Hidden file data" className="flex shrink-0 items-center gap-2.5 rounded-[1.5rem] border border-line bg-card px-5 py-3 text-sm text-muted shadow-soft">
        <CheckCircle2 size={18} className="ink-safe shrink-0" aria-hidden />
        {data === null ? "Your safe copy carries no location, time or camera data." : "No location or camera data in this file. Your safe copy is clean too."}
      </section>
    );
  }

  if (compact && !open) {
    const nouns = rows.map((r) => NOUN[r.label]);
    const list = nouns.length > 1 ? `${nouns.slice(0, -1).join(", ")} and ${nouns.at(-1)}` : nouns[0];
    const loc = rows.find((r) => r.link);
    return (
      <section aria-label="Hidden file data" className="flex shrink-0 items-center gap-3 rounded-[1.5rem] border border-line bg-card px-4 py-3 shadow-soft">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-respect/10 text-respect">
          {loc ? <MapPin size={17} aria-hidden /> : <CheckCircle2 size={17} aria-hidden />}
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate font-semibold text-ink">{loc ? "Location removed from the file" : "Removed from the file"}</p>
          <p className="flex min-w-0 text-muted">
            {loc ? <MapLink href={loc.link!}>{loc.value}</MapLink> : <span className="truncate">{list.charAt(0).toUpperCase() + list.slice(1)}</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-ink hover:bg-paper2"
        >
          Details
          <ChevronDown size={13} aria-hidden />
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Hidden file data" className="shrink-0 rounded-[1.5rem] border border-line bg-card px-5 py-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">Hidden in the file</p>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-safe/30 bg-safe/15 px-2.5 py-0.5 text-xs font-semibold ink-safe">
          <CheckCircle2 size={13} aria-hidden />
          Removed
        </span>
        {compact && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-expanded
            aria-label="Hide details"
            className="grid h-7 w-7 place-items-center rounded-full border border-line text-ink hover:bg-paper2"
          >
            <ChevronDown size={14} className="rotate-180" aria-hidden />
          </button>
        )}
      </div>
      {hasLocation && (
        <p className="mt-1.5 text-pretty font-display text-lg font-medium leading-snug text-ink">
          This photo knew where you were.
        </p>
      )}
      <dl className="mt-2.5 space-y-1.5">
        {rows.map(({ Icon, label, value, link }) => (
          <div key={label} className="flex min-w-0 items-center gap-2.5 text-sm">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-respect/10 text-respect">
              <Icon size={15} aria-hidden />
            </span>
            <dt className="w-[4.25rem] shrink-0 text-muted">{label}</dt>
            <dd className="min-w-0 truncate font-medium text-ink">
              {link ? (
                <MapLink href={link}>{value}</MapLink>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2.5 border-t border-line pt-2.5 text-pretty text-xs leading-relaxed text-muted">
        {hasLocation
          ? "Anyone you send the original to can read this. Your safe copy has none of it."
          : "Your safe copy has none of this."}
      </p>
    </section>
  );
}
