//created by kinjal
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Play, UploadSimple as Upload } from "@phosphor-icons/react/dist/ssr";
import HeroPhone from "@/components/prototype/HeroPhone";
import InkUnderline from "./InkUnderline";

// One drifting layer. depth scales both the scroll and the mouse movement.
function Layer({
  depth,
  scroll,
  mx,
  my,
  className,
  children,
}: {
  depth: number;
  scroll: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  className: string;
  children: React.ReactNode;
}) {
  const sy = useTransform(scroll, [0, 1], [0, -160 * depth]);
  const px = useTransform(mx, (v) => v * 22 * depth);
  const py = useTransform(my, (v) => v * 14 * depth);
  const y = useTransform([sy, py], ([a, b]: number[]) => a + b);
  return (
    <motion.div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ x: px, y }}>
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 40, damping: 18 });
  const my = useSpring(rawY, { stiffness: 40, damping: 18 });
  const still = useMotionValue(0);
  const scroll = reduce ? still : scrollYProgress;

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-6 pt-28 lg:min-h-[100svh] lg:pb-48 lg:pt-32"
    >
      {/* Sky */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/assets/hero-sky.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
        {/* Paper wash so the headline stays readable. Darker in dark mode. */}
        <div className="hero-dim absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper/90 via-paper/55 to-paper/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
      </div>

      {/* Drifting clouds and brownies */}
      <div className="absolute inset-0 -z-10">
        <Layer depth={0.5} scroll={scroll} mx={mx} my={my} className="-left-24 top-24 w-[220px] opacity-70 sm:-left-16 sm:w-[340px] sm:opacity-90">
          <Image src="/assets/cloud-a.webp" alt="" width={800} height={516} className="h-auto w-full" />
        </Layer>
        <Layer depth={1.2} scroll={scroll} mx={mx} my={my} className="right-[-60px] top-[46%] hidden w-[420px] opacity-95 lg:block">
          <Image src="/assets/cloud-b.webp" alt="" width={966} height={254} className="h-auto w-full" />
        </Layer>
        <Layer depth={0.7} scroll={scroll} mx={mx} my={my} className="bottom-[70px] right-[1%] hidden w-[190px] xl:block">
          <div className="relative">
            <Image src="/assets/cloud-a.webp" alt="" width={800} height={516} className="h-auto w-full" />
            <div className="absolute -top-[52%] left-[30%] w-[38%] animate-bob [animation-delay:-1.5s]">
              <Image src="/assets/brownie-camera.webp" alt="" width={640} height={865} className="h-auto w-full" />
            </div>
          </div>
        </Layer>
        <Layer depth={1.5} scroll={scroll} mx={mx} my={my} className="right-[8%] top-24 hidden w-[90px] xl:block">
          <Image src="/assets/sparkles.webp" alt="" width={481} height={546} className="h-auto w-full opacity-80" />
        </Layer>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative">
          {/* Ink drop accent, kept clear of the headline */}
          <motion.div
            aria-hidden
            className="mb-3 w-9 opacity-80 sm:w-11 xl:absolute xl:-left-24 xl:top-0 xl:mb-0 xl:w-16"
            initial={reduce ? false : { y: -40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 0.8, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
          >
            <Image src="/assets/ink-drop.webp" alt="" width={374} height={624} className="h-auto w-full" />
          </motion.div>
          <h1
            id="hero-title"
            className="text-balance font-display text-[2.55rem] font-medium leading-[1.02] tracking-tight text-ink [text-shadow:0_1px_18px_rgb(var(--paper)/0.9)] sm:text-6xl lg:text-7xl"
          >
            Everything posted online is <InkUnderline>ink.</InkUnderline>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink/80 sm:text-xl">
            SafePost checks your photos before you share them. It finds what they give away, blurs it, and tells you
            why.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="/check"
              className="inline-flex items-center gap-2 rounded-full bg-compassion px-6 py-3.5 text-base font-semibold text-[#1E2440] shadow-lift transition-transform hover:-translate-y-0.5"
            >
              <Upload size={18} aria-hidden />
              Check a photo
            </a>
            <a
              href="/share"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card/80 px-6 py-3.5 text-base font-semibold text-ink backdrop-blur transition-colors hover:bg-card"
            >
              <Play size={18} weight="fill" aria-hidden />
              See it in action
            </a>
          </div>
        </div>

        <div className="relative mx-auto pt-10">
          <HeroPhone className="w-[250px] sm:w-[290px]" />
        </div>
      </div>

      {/* Pencil sketches of everyday people taking photos */}
      <div className="pointer-events-none relative -z-10 mt-10 flex justify-center px-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:justify-start lg:px-0 lg:pl-[max(2rem,calc((100vw-72rem)/2))]">
        <Image
          src="/assets/hero-people.webp"
          alt="Pencil sketches of a parent photographing a child on a slide, a woman taking a selfie, a teen with a phone and grandparents at a birthday"
          width={1019}
          height={393}
          className="hero-people h-auto w-[620px] max-w-[110%] opacity-90 lg:w-[600px]"
        />
      </div>
    </section>
  );
}
