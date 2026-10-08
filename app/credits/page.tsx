import React from "react";
import Link from "next/link";
import { ALL_IMAGE_CREDITS } from "@/lib/image-data";
import { ArrowLeft } from "lucide-react";
import { CanvasA } from "@/components/CanvasA";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Licensing & Credits — BetaDigest",
  description: "Licensing and attribution information for BetaDigest.",
};

export default function CreditsPage() {
  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col justify-between overflow-x-hidden">
      <CanvasA />
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl bg-white border border-[var(--line)] rounded-[32px] md:rounded-[40px] p-6 sm:p-10 shadow-[var(--shadow-float)] flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to BetaDigest
            </Link>
          </div>

          <div className="border-b border-[var(--line)] pb-4">
            <span className="font-sans text-[12px] font-bold text-[var(--text-muted-sm)] uppercase tracking-wider">
              LICENSING &amp; ATTRIBUTION
            </span>
            <h1 className="font-display font-[700] text-2xl sm:text-3xl text-black mt-1">
              Terms, Privacy &amp; Credits
            </h1>
            <p className="font-sans text-sm mt-2 text-[var(--text-muted-sm)]">
              BetaDigest provides daily weather and news summaries. All photographic assets referenced in public previews are licensed under the Unsplash License:
            </p>
          </div>

          <ul className="divide-y divide-[var(--line)] text-sm">
            {ALL_IMAGE_CREDITS.map((item, idx) => (
              <li
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div>
                  <span className="font-semibold text-black">{item.photographer}</span>
                  <span className="text-xs text-[var(--text-muted-sm)] block sm:inline sm:ml-2">
                    ({item.role})
                  </span>
                </div>
                <a
                  href={`https://unsplash.com/photos/${item.unsplashId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-black font-medium hover:underline self-start sm:self-auto tabular-nums"
                >
                  View on Unsplash ↗
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-[var(--line)] text-xs text-[var(--text-muted-sm)] flex justify-between items-center">
            <span>BetaDigest Editorial Engine</span>
            <Link href="/" className="hover:text-black font-medium">
              BetaDigest Home
            </Link>
          </div>
        </div>
      </main>

      <Footer className="py-12" />
    </div>
  );
}
