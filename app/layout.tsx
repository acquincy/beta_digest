import type { Metadata } from "next";
import { Red_Hat_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-red-hat-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BetaDigest — The day, in five minutes.",
  description:
    "A daily news and weather digest delivered each morning. Curated top stories, hyperlocal weather, and commute conditions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${redHatDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--canvas)] text-[var(--text)] selection:bg-[var(--lime)] selection:text-black">
        {/* Hidden SVG defining linearGradient for icons */}
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5A3D8" />
              <stop offset="100%" stopColor="#E2DB7C" />
            </linearGradient>
          </defs>
        </svg>
        {children}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

