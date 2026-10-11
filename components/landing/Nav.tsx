//created by kinjal
"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#demo", label: "Demo" },
  { href: "/share", label: "Share flow" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/#team", label: "Team" },
];

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Nav() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("safepost-theme");
      if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
    } catch {}
    setTheme(currentTheme());
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("safepost-theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line/70 bg-paper/[0.97] shadow-[0_1px_8px_rgb(30_36_64/0.06)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="/#top" className="rounded-lg" aria-label="SafePost home">
          <Logo />
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[15px] font-medium text-ink/80 transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-10 w-10 place-items-center rounded-full text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <a
            href="/check"
            className="hidden rounded-full bg-compassion px-5 py-2.5 text-sm font-semibold text-[#1E2440] shadow-soft transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            Check a photo
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-line/70 px-4 pb-4 pt-2 md:hidden">
          {[...LINKS, { href: "/check", label: "Check a photo" }].map((l, i) => (
            <li key={l.label + i}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3 text-base font-medium text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
