"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import { CanvasA } from "@/components/CanvasA";
import { TopLeftLogo } from "@/components/TopLeftLogo";
import { IconTile } from "@/components/primitives/IconTile";
import { UnderlineInput } from "@/components/primitives/UnderlineInput";
import { PrimaryButton } from "@/components/primitives/Button";
import { Footer } from "@/components/Footer";
import { sendSignInLinkViaApi } from "@/lib/n8n";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentMagicLink, setSentMagicLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter the email address linked to your BetaDigest subscription.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendSignInLinkViaApi(trimmed);
      setSentMagicLink(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send sign-in link. Please verify your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col justify-between overflow-x-hidden">
      <CanvasA />
      <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
        <TopLeftLogo />
      </header>

      <main className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-[540px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl step-enter">
          {sentMagicLink ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-white shadow-sm"
              >
                <Check className="w-6 h-6 text-black stroke-[3]" aria-hidden="true" />
              </div>
              <h1 className="font-display font-[600] text-[32px] leading-tight text-white">
                Check your inbox.
              </h1>
              <p className="font-sans font-[400] text-[16px] text-white/75 leading-relaxed mt-3">
                We sent a one-click reader key to{" "}
                <strong className="text-white font-semibold">
                  {email.trim()}
                </strong>
                . Use it to manage your topics, delivery window, and digest settings.
              </p>
              <div className="pt-6 mt-6 border-t border-white/10 w-full">
                <Link
                  href="/"
                  className="font-sans font-[500] text-[15px] underline text-white hover:opacity-80 inline-flex items-center"
                >
                  <span>Return to front page</span>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-[14px] bg-[#181d30] flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                  <Image
                    src="/logo-mark.png"
                    alt="BetaDigest Logo"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] object-contain"
                  />
                </div>
                <span className="font-sans font-[600] text-[12px] tracking-widest text-white/70 uppercase">
                  SUBSCRIBER PORTAL
                </span>
              </div>

              <h1 className="font-display font-[600] text-[32px] md:text-[36px] leading-tight text-white">
                Welcome back.
              </h1>
              <p className="font-sans font-[400] text-[16px] text-white/75 leading-relaxed mt-2">
                Enter your subscriber email to receive an instant sign-in link
                and manage your daily digest preferences.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-6">
                <UnderlineInput
                  label="Subscriber email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  error={error}
                  required
                />

                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  className="w-full h-[54px] mt-2 flex items-center justify-center gap-2 font-medium"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{loading ? "Sending link..." : "Send sign-in link"}</span>
                </PrimaryButton>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-[14px]">
                <Link
                  href="/"
                  className="font-sans text-white/70 hover:text-white inline-flex items-center transition-colors"
                >
                  <span>Back to home</span>
                </Link>
                <Link
                  href="/signup"
                  className="font-sans font-medium text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
                >
                  New subscriber? Join free
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer className="py-12" />
    </div>
  );
}
