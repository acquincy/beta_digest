"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentMagicLink, setSentMagicLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter the email address linked to your BetaDigest subscription.");
      document.getElementById("login-email")?.focus();
      return;
    }
    setError("");
    setSentMagicLink(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between px-5 sm:px-8 py-10">
      <header className="mx-auto w-full max-w-[1280px] flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back to BetaDigest</span>
        </Link>

        <Link
          href="/signup"
          className="text-xs font-medium underline underline-offset-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          New reader? Subscribe free →
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[520px] my-12">
        <div className="bento-panel p-7 sm:p-11">
          {sentMagicLink ? (
            <div role="status" aria-live="polite" className="space-y-5">
              <div
                className="inline-flex size-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--purple)", color: "var(--cream)" }}
              >
                <Check className="size-5" aria-hidden="true" />
              </div>
              <p className="editorial-label text-[var(--text-secondary)]">
                SIGN-IN DISPATCH SENT
              </p>
              <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em]">
                Check your inbox.
              </h1>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                We sent a one-click reader key to{" "}
                <strong className="text-[var(--text-primary)] font-medium">
                  {email.trim()}
                </strong>
                . Use it to manage your cities, topics, and delivery window.
              </p>
              <div className="pt-4 border-t border-[var(--border-wireframe)]">
                <Link
                  href="/"
                  className="text-xs font-medium underline underline-offset-4 text-[var(--text-primary)]"
                >
                  Return to front page →
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="editorial-label text-[var(--text-secondary)] mb-3">
                READER ACCESS · SUBSCRIBER PORTAL
              </p>
              <h1 className="text-3xl sm:text-5xl font-medium tracking-[-0.035em] leading-[1.02]">
                Welcome back.
              </h1>
              <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
                Enter your subscriber email to receive an instant sign-in link
                and manage your morning edition settings.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="login-email"
                    className="editorial-label text-[var(--text-primary)] block mb-2"
                  >
                    SUBSCRIBER EMAIL
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? "login-email-error" : undefined}
                    className="w-full rounded-[12px] border border-[var(--border-wireframe)] bg-[var(--bg-page)] px-4 py-3.5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  />
                  {error && (
                    <p
                      id="login-email-error"
                      role="alert"
                      className="mt-2 text-xs font-medium text-[#5722CB]"
                    >
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary-purple w-full inline-flex items-center justify-center gap-2 rounded-full py-4 px-6 text-base cursor-pointer"
                >
                  <span>Send sign-in link</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-[1280px] text-center text-xs text-[var(--text-secondary)]">
        BetaDigest Subscriber Services · Edition #1,408
      </footer>
    </div>
  );
}
