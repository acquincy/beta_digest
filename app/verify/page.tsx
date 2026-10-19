"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { CanvasA } from "@/components/CanvasA";
import { TopLeftLogo } from "@/components/TopLeftLogo";
import { Footer } from "@/components/Footer";
import { PrimaryButton, OutlineButton } from "@/components/primitives/Button";
import { ThemedInput } from "@/components/primitives/ThemedInput";
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

          // Notify any waiting tabs (e.g. signup flow) that verification succeeded
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            try {
              const channel = new BroadcastChannel("betadigest_auth");
              channel.postMessage({
                verified: true,
                onboarding_completed: Boolean(result.onboarding_completed),
                destination: target,
              });
              channel.close();
            } catch (e) {
              // Ignore BroadcastChannel errors in sandboxed iframes/browsers
            }
          }
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

  // Handle redirect on success
  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      router.push(destination);
    }, 2000);

    return () => {
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
    <div className="w-full max-w-[560px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl step-enter flex flex-col items-center text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center py-6">
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 bg-white/[0.08] border border-white/10">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="font-display font-[600] text-[28px] md:text-[34px] leading-tight text-white tracking-tight">
            Verifying your account...
          </h1>
          <p className="font-sans font-[400] text-[16px] text-white/75 mt-3 max-w-sm">
            Please wait a moment while we validate your verification link.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center py-4">
          <div className="mb-6">
            <IconTile icon={Check} size={80} radius={24} iconSize={40} />
          </div>

          <h1 className="font-display font-[600] text-[32px] md:text-[38px] leading-tight text-white tracking-tight">
            Account verified!
          </h1>

          <p className="font-sans font-[400] text-[16px] md:text-[18px] text-white/75 leading-relaxed mt-3 max-w-md">
            Redirecting you to Beta Digest
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center py-4 w-full">
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="font-display font-[600] text-[28px] md:text-[32px] leading-tight text-white tracking-tight">
            Link expired or invalid
          </h1>

          <p className="font-sans font-[400] text-[15px] md:text-[16px] text-white/75 leading-relaxed mt-3 max-w-md">
            {errorMessage || "The link you followed has already been used or has expired."}
          </p>

          {resendSent ? (
            <div className="mt-6 p-4 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 rounded-2xl text-sm max-w-md">
              A fresh sign-in link has been sent to your email. Please check your inbox.
            </div>
          ) : (
            <form onSubmit={handleRequestNewLink} className="mt-6 w-full max-w-md flex flex-col gap-3">
              <p className="text-sm text-white/70 text-left">
                Enter your email address to receive a fresh sign-in link:
              </p>
              <div className="flex gap-2">
                <ThemedInput
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  containerClassName="flex-1"
                />
                <PrimaryButton
                  type="submit"
                  disabled={resendSending}
                  className="px-5 h-[46px] text-sm font-semibold"
                >
                  {resendSending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  <span>Send link</span>
                </PrimaryButton>
              </div>
              {resendError && <p className="text-xs text-[var(--error)] text-left">{resendError}</p>}
            </form>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <PrimaryButton className="w-full sm:w-[200px] h-[52px]">
                Create new account
              </PrimaryButton>
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
      <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-start z-20">
        <TopLeftLogo />
      </header>

      <main className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
        <Suspense
          fallback={
            <div className="w-full max-w-[560px] h-[340px] bg-[#141418]/85 border border-white/15 rounded-[32px] md:rounded-[40px] animate-pulse" />
          }
        >
          <VerifyContent />
        </Suspense>
      </main>

      <Footer className="py-12" />
    </div>
  );
}
