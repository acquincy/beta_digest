"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { CanvasA } from "@/components/CanvasA";
import { Header } from "@/components/Header";
import { IconTile } from "@/components/primitives/IconTile";
import { UnderlineInput } from "@/components/primitives/UnderlineInput";
import { DarkButton } from "@/components/primitives/Button";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentMagicLink, setSentMagicLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter the email address linked to your BetaDigest subscription.");
      return;
    }
    setError("");
    setSentMagicLink(true);
  };

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col justify-between overflow-x-hidden">
      <CanvasA />
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-[540px] bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-[var(--shadow-float)] step-enter">
          {sentMagicLink ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "var(--lime)" }}
              >
                <Check className="w-6 h-6 text-black stroke-[3]" aria-hidden="true" />
              </div>
              <h1 className="font-display font-[700] text-[32px] leading-tight text-black">
                Check your inbox.
              </h1>
              <p className="font-sans font-[400] text-[16px] text-[var(--text)] leading-relaxed mt-3">
                We sent a one-click reader key to{" "}
                <strong className="text-black font-semibold">
                  {email.trim()}
                </strong>
                . Use it to manage your topics, delivery window, and digest settings.
              </p>
              <div className="pt-6 mt-6 border-t border-[var(--line)] w-full">
                <Link
                  href="/"
                  className="font-sans font-[600] text-[15px] underline text-black hover:opacity-80"
                >
                  Return to front page →
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <IconTile icon={Mail} size={48} radius={14} iconSize={26} />
                <span className="font-sans font-[600] text-[13px] tracking-wider text-[var(--text-muted-sm)] uppercase">
                  SUBSCRIBER PORTAL
                </span>
              </div>

              <h1 className="font-display font-[700] text-[32px] md:text-[36px] leading-tight text-black">
                Welcome back.
              </h1>
              <p className="font-sans font-[400] text-[16px] text-[var(--text)] leading-relaxed mt-2">
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

                <DarkButton type="submit" className="w-full h-[56px] mt-2">
                  Send sign-in link
                </DarkButton>
              </form>

              <div className="mt-6 pt-6 border-t border-[var(--line)] flex items-center justify-between text-[14px]">
                <Link
                  href="/"
                  className="font-sans text-[var(--text-muted-sm)] hover:text-black"
                >
                  ← Back to home
                </Link>
                <Link
                  href="/signup"
                  className="font-sans font-semibold text-black underline"
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
