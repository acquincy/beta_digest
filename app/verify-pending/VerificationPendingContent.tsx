"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { CanvasA } from "@/components/CanvasA";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VerificationWaitingCard } from "@/components/VerificationWaitingCard";

export function VerificationPendingContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email address";
  const token = searchParams.get("token") || undefined;

  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col justify-between overflow-x-hidden">
      <CanvasA />
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
        <VerificationWaitingCard
          email={email}
          token={token}
          onVerified={() => {
            window.location.href = "/set-up-reports?step=1";
          }}
        />
      </main>

      <Footer className="py-12" />
    </div>
  );
}
