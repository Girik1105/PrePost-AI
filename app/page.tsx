//created by kinjal
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Detects from "@/components/landing/Detects";
import ChildAdvisor from "@/components/landing/ChildAdvisor";
import Privacy from "@/components/landing/Privacy";
import ForEveryone from "@/components/landing/ForEveryone";
import Principles from "@/components/landing/Principles";
import Roadmap from "@/components/landing/Roadmap";
import Team from "@/components/landing/Team";
import Footer from "@/components/landing/Footer";
import "@/components/landing/landing.css";

export default function Home() {
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
        <Hero />
        <Problem />
        <HowItWorks />
        <Detects />
        <ChildAdvisor />
        <Privacy />
        <ForEveryone />
        <Principles />
        <Roadmap />
        <Team />
      </main>
      <Footer />
    </>
  );
}
