//created by kinjal
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: `${BRAND.name} · ${BRAND.tagline}`,
  description: `${BRAND.name} checks your photos before you share them. It finds what they give away, blurs it, and tells you why.`,
  icons: { icon: "/assets/app-icon.webp" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF6EE" },
    { media: "(prefers-color-scheme: dark)", color: "#151829" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
