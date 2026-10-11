//created by kinjal
import type { Metadata } from "next";
import { Grand_Hotel } from "next/font/google";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import ShareFlow from "@/components/share/ShareFlow";
import { BRAND } from "@/lib/brand";
import "@/components/landing/landing.css";

// Script face for the Instagram-style wordmark inside the phone.
const igFont = Grand_Hotel({ weight: "400", subsets: ["latin"], variable: "--font-ig", display: "swap" });

export const metadata: Metadata = {
  title: `Share flow · ${BRAND.name}`,
  description: `Tap Share on any photo, pick ${BRAND.name}, and post a clean copy to Instagram.`,
};

export default function SharePage() {
  return (
    <div className={igFont.variable}>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-compassion px-4 py-2 font-semibold text-[#1E2440] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <ShareFlow />
      </main>
      <Footer />
    </div>
  );
}
