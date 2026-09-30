"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const CITIES = ["Lagos", "Port Harcourt", "Abuja", "London", "New York", "Nairobi"];
const EDITIONS = [
  { id: "morning", label: "Morning Dispatch", time: "06:00 AM" },
  { id: "midday", label: "Midday Pulse", time: "12:30 PM" },
  { id: "evening", label: "Evening Ledger", time: "07:00 PM" },
];

export function SignupForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [city, setCity] = useState("Lagos");
  const [selectedEditions, setSelectedEditions] = useState<string[]>(["morning"]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleEdition = (id: string) => {
    setSelectedEditions((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter a valid email address (for example, name@company.com).");
      document.getElementById("signup-email")?.focus();
      return;
    }
    setError("");
    setSubmitted(true);
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
          href="/login"
          className="text-xs font-medium underline underline-offset-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Already reading? Log in →
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[620px] my-12">
        <div className="bento-panel p-7 sm:p-11">
          {submitted ? (
            <div role="status" aria-live="polite" className="space-y-6">
              <div
                className="inline-flex size-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--purple)", color: "var(--cream)" }}
              >
                <Check className="size-6" aria-hidden="true" />
              </div>

              <div>
                <p className="editorial-label text-[var(--text-secondary)] mb-2">
                  SUBSCRIPTION CONFIRMED · FIRST DISPATCH AT 06:00
                </p>
                <h1 className="text-3xl sm:text-5xl font-medium tracking-[-0.035em] leading-[1.02]">
                  You’re on the morning list.
                </h1>
                <p className="editorial-body mt-4 text-base sm:text-lg">
                  Your first five-minute briefing and{" "}
                  <strong className="text-[var(--text-primary)] font-medium">
                    {city}
                  </strong>{" "}
                  hourly weather strip will arrive at{" "}
                  <strong className="text-[var(--text-primary)] font-medium">
                    {email.trim()}
                  </strong>{" "}
                  at <span className="tabular-nums font-medium">06:00 AM</span>.
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-wireframe)] flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/#sample-digest"
                  className="btn-primary-purple inline-flex items-center gap-2 rounded-full ps-6 pe-5 py-3 text-sm"
                >
                  <span>Read today’s sample</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs underline underline-offset-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Adjust delivery preferences
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="editorial-label text-[var(--text-secondary)] mb-3">
                MORNING SUBSCRIPTION · FREE FOREVER
              </p>
              <h1 className="text-3xl sm:text-5xl font-medium tracking-[-0.035em] leading-[1.02]">
                Start tomorrow informed.
              </h1>
              <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
                Configure your local barometer city and edition rhythm. Takes
                fifteen seconds.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="signup-email"
                    className="editorial-label text-[var(--text-primary)] block mb-2"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="signup-email"
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
                    aria-describedby={error ? "signup-email-error" : undefined}
                    className="w-full rounded-[12px] border border-[var(--border-wireframe)] bg-[var(--bg-page)] px-4 py-3.5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  />
                  {error && (
                    <p
                      id="signup-email-error"
                      role="alert"
                      className="mt-2 text-xs font-medium text-[#5722CB]"
                    >
                      {error}
                    </p>
                  )}
                </div>

                <div>
                  <span className="editorial-label text-[var(--text-primary)] block mb-2">
                    YOUR WEATHER &amp; COMMUTE CITY
                  </span>
                  <div
                    role="group"
                    aria-label="Select your city"
                    className="flex flex-wrap gap-2"
                  >
                    {CITIES.map((c) => {
                      const active = city === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCity(c)}
                          aria-pressed={active}
                          className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
                            active
                              ? "bg-[#5722CB] text-[#f3f2ee]"
                              : "border border-[var(--border-wireframe)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <fieldset>
                  <legend className="editorial-label text-[var(--text-primary)] block mb-2">
                    DISPATCH SCHEDULE
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {EDITIONS.map((ed) => {
                      const checked = selectedEditions.includes(ed.id);
                      return (
                        <button
                          key={ed.id}
                          type="button"
                          onClick={() => toggleEdition(ed.id)}
                          aria-pressed={checked}
                          className={`rounded-[12px] border p-3.5 text-left transition-colors ${
                            checked
                              ? "border-[#5722CB] bg-[var(--bg-page)]"
                              : "border-[var(--border-wireframe)] opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="tabular-nums text-xs font-semibold"
                              style={{ color: "var(--purple)" }}
                            >
                              {ed.time}
                            </span>
                            {checked && (
                              <Check
                                className="size-3.5"
                                style={{ color: "var(--purple)" }}
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1.5">{ed.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="btn-primary-purple w-full inline-flex items-center justify-center gap-2 rounded-full py-4 px-6 text-base cursor-pointer"
                >
                  <span>Subscribe — it’s free</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-[1280px] text-center text-xs text-[var(--text-secondary)] tabular-nums">
        BetaDigest Morning Press · Zero spam · Unsubscribe in one click
      </footer>
    </div>
  );
}
