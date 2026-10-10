//created by kinjal
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { LogoMark } from "./Logo";

export default function Footer() {
  return (
    <footer className="footer-bg relative overflow-hidden px-4 pb-12 pt-20 text-[#FBF6EE] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <Image
          src="/assets/brownie-cloud.webp"
          alt="Brownie mascot sitting on a cloud"
          width={180}
          height={204}
          className="h-40 w-auto animate-bob"
        />
        <p className="mt-6 max-w-2xl text-balance font-display text-3xl font-medium leading-tight sm:text-4xl">
          {BRAND.closer}
        </p>
        <p className="mt-6 text-[#FBF6EE]/80">Made with love by Team {BRAND.team}</p>
        <div className="mt-12 flex w-full flex-col items-center justify-between gap-4 border-t border-[#FBF6EE]/15 pt-8 text-sm text-[#FBF6EE]/70 sm:flex-row">
          <span className="flex items-center gap-2">
            <LogoMark className="h-6 w-6" />
            {BRAND.name} · {BRAND.event}
          </span>
          <span>{BRAND.name} is a hackathon prototype.</span>
        </div>
      </div>
    </footer>
  );
}
