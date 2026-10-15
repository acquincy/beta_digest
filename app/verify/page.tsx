"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { CanvasA } from "@/components/CanvasA";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DarkButton, OutlineButton } from "@/components/primitives/Button";
import { IconTile } from "@/components/primitives/IconTile";
import { verifyViaApi, sendSignInLinkViaApi } from "@/lib/n8n";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No verification token provided."
  );
  const [destination, setDestination] = useState<string>("/onboarding");
  const [countdown, setCountdown] = useState(3);

  // Recovery form state
  const [resendEmail, setResendEmail] = useState("");
  const [resendSending, setResendSending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState("");

  // Guard against React Strict Mode calling verify twice and burning the single-use token
  const hasCalledVerify = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided in the link.");
      return;
    }

    if (hasCalledVerify.current) return;
    hasCalledVerify.current = true;

    async function executeVerification() {
      try {
        const result = await verifyViaApi(token as string);
        if (result.success) {
          setStatus("success");
          const target = result.destination || (result.onboarding_completed ? "/dashboard" : "/onboarding");
          setDestination(target);
        } else {
          setStatus("error");
          setErrorMessage(result.error || "The verification link is invalid or has expired.");
        }
      } catch (err: unknown) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "The verification link is invalid or has expired."
        );
      }
    }

    executeVerification();
  }, [token]);

  // Handle countdown and redirect on success
  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const timer = setTimeout(() => {
      router.push(destination);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [status, destination, router]);

  const handleRequestNewLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || !resendEmail.includes("@")) {
      setResendError("Please enter a valid email address.");
      return;
    }

    setResendSending(true);
    setResendError("");
    try {
      await sendSignInLinkViaApi(resendEmail);
      setResendSent(true);
    } catch (err: unknown) {
      setResendError(err instanceof Error ? err.message : "Failed to send link. Please try again.");
    } finally {
      setResendSending(false);
    }
  };

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
            Please wait a moment while we validate your one-time verification link and establish your persistent session.
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
            Your device is now securely remembered. Redirecting you to Beta Digest.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2.5 text-[15px] font-[500] text-[var(--muted-text)]">
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Continuing in {countdown} second{countdown === 1 ? "" : "s"}...</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center py-4 w-full">
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 bg-red-50 text-red-600">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="font-display font-[700] text-[28px] md:text-[32px] leading-tight text-black">
            Link expired or invalid
          </h1>

          <p className="font-sans font-[400] text-[15px] md:text-[16px] text-[var(--text)] leading-relaxed mt-3 max-w-md">
            {errorMessage || "The link you followed has already been used or has expired."}
          </p>

          {resendSent ? (
            <div className="mt-6 p-4 bg-[var(--lime-tint)] rounded-2xl text-black text-sm max-w-md">
              A fresh sign-in link has been sent to your email. Please check your inbox.
            </div>
          ) : (
            <form onSubmit={handleRequestNewLink} className="mt-6 w-full max-w-md flex flex-col gap-3">
              <p className="text-sm text-[var(--muted-text)] text-left">
                Enter your email address to receive a fresh sign-in link:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={resendSending}
                  className="px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {resendSending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send link</span>
                </button>
              </div>
              {resendError && <p className="text-xs text-red-600 text-left">{resendError}</p>}
            </form>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <DarkButton className="w-full sm:w-[200px] h-[52px]">
                Create new account
              </DarkButton>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <OutlineButton className="w-full sm:w-[160px] h-[52px]">
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
