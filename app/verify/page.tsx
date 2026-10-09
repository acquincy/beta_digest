"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { CanvasA } from "@/components/CanvasA";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DarkButton, OutlineButton } from "@/components/primitives/Button";
import { IconTile } from "@/components/primitives/IconTile";
import { verifyViaN8n } from "@/lib/n8n";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No verification token provided."
  );
  const [verifiedEmail, setVerifiedEmail] = useState("");

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    async function checkToken() {
      try {
        const result = await verifyViaN8n(token as string);
        if (mounted) {
          if (result.status === "success" || result.verified) {
            setStatus("success");
            if (typeof window !== "undefined") {
              localStorage.setItem("betadigest_verified", "true");
              if (result.userId) {
                localStorage.setItem("betadigest_user_id", result.userId);
              }
            }
          } else {
            setStatus("error");
            setErrorMessage(result.message || "Invalid or expired verification token.");
          }
        }
      } catch (err: unknown) {
        if (mounted) {
          setStatus("error");
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Unable to reach verification service. Please try again."
          );
        }
      }
    }

    checkToken();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="w-full max-w-[560px] bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-[var(--shadow-float)] step-enter flex flex-col items-center text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center py-6">
          <div
            className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 animate-spin"
            style={{ backgroundColor: "var(--lime-tint)" }}
          >
            <Loader2 className="w-8 h-8 text-black" />
          </div>
          <h1 className="font-display font-[700] text-[28px] md:text-[34px] leading-tight text-black">
            Verifying your account...
          </h1>
          <p className="font-sans font-[400] text-[16px] text-[var(--text)] mt-3 max-w-sm">
            Please wait a moment while we validate your one-time verification link with the Beta Digest service.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center py-4">
          <div className="mb-6">
            <IconTile icon={Check} size={80} radius={24} iconSize={40} />
          </div>

          <h1 className="font-display font-[700] text-[32px] md:text-[38px] leading-tight text-black">
            Account verified!
          </h1>

          <p className="font-sans font-[400] text-[16px] md:text-[18px] text-[var(--text)] leading-relaxed mt-3 max-w-md">
            Your Beta Digest account is confirmed and ready. Let&apos;s finalize your daily delivery schedule and topics.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/set-up-reports?step=1" className="w-full sm:w-auto">
              <DarkButton className="w-full sm:w-[220px] h-[56px] inline-flex items-center justify-center gap-2">
                <span>Continue setup</span>
                <ArrowRight className="w-4 h-4" />
              </DarkButton>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <OutlineButton className="w-full sm:w-[160px] h-[56px]">
                View dashboard
              </OutlineButton>
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center py-4">
          <div
            className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 bg-red-50 text-red-600"
          >
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="font-display font-[700] text-[30px] md:text-[34px] leading-tight text-black">
            Verification link issue
          </h1>

          <p className="font-sans font-[400] text-[15px] md:text-[16px] text-[var(--text)] leading-relaxed mt-3 max-w-md">
            {errorMessage || "The link you followed has expired or is invalid."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <DarkButton className="w-full sm:w-[200px] h-[56px]">
                Create new account
              </DarkButton>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <OutlineButton className="w-full sm:w-[160px] h-[56px]">
                Return home
              </OutlineButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="relative min-h-screen text-[var(--text)] flex flex-col justify-between overflow-x-hidden">
      <CanvasA />
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-[560px] h-[340px] bg-white rounded-[32px] md:rounded-[40px] animate-pulse" />
          }
        >
          <VerifyContent />
        </Suspense>
      </main>

      <Footer className="py-12" />
    </div>
  );
}
