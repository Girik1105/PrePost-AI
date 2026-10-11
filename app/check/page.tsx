//created by kinjal
import type { Metadata } from "next";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import PhotoChecker from "@/components/check/PhotoChecker";
import { BRAND } from "@/lib/brand";
import "@/components/landing/landing.css";

export const metadata: Metadata = {
  title: `Check a photo · ${BRAND.name}`,
  description: `Upload a photo. ${BRAND.name} finds what it gives away, hides it, and gives you a clean copy to post.`,
};

export default function CheckPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-compassion px-4 py-2 font-semibold text-[#1E2440] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <PhotoChecker />
      </main>
      <Footer />
    </>
  );
}
