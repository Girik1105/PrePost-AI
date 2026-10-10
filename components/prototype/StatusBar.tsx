//created by kinjal
export default function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const c = tone === "light" ? "#FFFFFF" : "#1C1C1E";
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[54px] items-center justify-between px-[34px] pt-[6px] font-ios" aria-hidden>
      <span className="text-[17px] font-semibold tracking-tight" style={{ color: c }}>
        9:41
      </span>
      <span className="flex items-center gap-[6px]">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c}>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
          <path d="M1.5 4.2a9.5 9.5 0 0 1 13 0" />
          <path d="M4 7a6 6 0 0 1 8 0" />
          <circle cx="8" cy="10" r="1.2" fill={c} stroke="none" />
        </svg>
        {/* battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} opacity="0.4" />
          <rect x="2" y="2" width="18" height="9" rx="2" fill={c} />
          <path d="M25 4.5v4a2 2 0 0 0 0-4z" fill={c} opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}
