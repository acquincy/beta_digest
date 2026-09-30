import type { Metadata } from "next";
import { Hanken_Grotesk, Inter_Tight } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BetaDigest — The day, in five minutes.",
  description:
    "A daily news and weather digest delivered each morning at 06:00. Curated top stories, hyperlocal hourly forecast, and commute alerts in five minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${interTight.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col selection:bg-[#5722CB] selection:text-[#f3f2ee]">
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
