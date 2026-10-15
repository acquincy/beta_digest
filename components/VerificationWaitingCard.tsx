"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, RotateCw, X, AlertCircle } from "lucide-react";
import { IconTile } from "./primitives/IconTile";
import { OutlineButton } from "./primitives/Button";
import { signupViaN8n } from "@/lib/n8n";

export interface VerificationWaitingCardProps {
  email: string;
  token?: string;
  name?: string;
  city?: string;
  countryCode?: string;
  onChangeEmail?: () => void;
  onVerified?: () => void;
  onClose?: () => void;
}

export const VerificationWaitingCard: React.FC<VerificationWaitingCardProps> = ({
  email,
  token,
  name,
  city,
  countryCode,
  onChangeEmail,
  onVerified,
  onClose,
}) => {
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for verification status every 2.5 seconds
  useEffect(() => {
    if (isVerified) return;

    let mounted = true;

    const checkStatus = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (token) queryParams.set("token", token);
        if (email) queryParams.set("email", email);

        const res = await fetch(`/api/auth/status?${queryParams.toString()}`);
        if (!res.ok) return;
        const data = await res.json();

        if (mounted && data.verified) {
          handleVerified();
        }
      } catch (err) {
        console.warn("Status check poll error:", err);
      }
    };

    const handleVerified = () => {
      setIsVerified(true);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      // Allow the user to see the success state before refreshing/advancing
      setTimeout(() => {
        if (onVerified) {
          onVerified();
        } else if (typeof window !== "undefined") {
          // Refresh page or route to onboarding step
          window.location.href = "/set-up-reports?step=1";
        }
      }, 1200);
    };

    // Immediate check
    checkStatus();

    // Set up polling
    pollIntervalRef.current = setInterval(checkStatus, 2500);

    // Cross-tab broadcast channel listener
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("betadigest_auth");
      bc.onmessage = (event) => {
        if (event.data?.verified) {
          handleVerified();
        }
      };
    } catch {}

    return () => {
      mounted = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (bc) {
        bc.close();
      }
    };
  }, [token, email, isVerified, onVerified]);

  // Handle Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (resending || cooldown > 0 || !email) return;
    setResending(true);
    setResendStatus(null);
    try {
      await signupViaN8n({
        email: email.trim(),
        name: name || "",
        city: city || "",
        country_code: countryCode || "",
      });
      setResendStatus("A fresh verification email has been dispatched! Please check your inbox.");
      setCooldown(30);
    } catch {
      setResendStatus("Email re-dispatched. Please check your inbox and spam folder.");
      setCooldown(30);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative w-full max-w-[666px] bg-white rounded-[32px] md:rounded-[40px] px-8 py-8 md:px-12 md:py-10 shadow-[var(--shadow-float)] step-enter flex flex-col items-center text-center">
      {/* Close button */}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-[22px] h-[22px] text-[#7A7A7A]" aria-hidden="true" />
        </button>
      ) : (
        <Link
          href="/"
          aria-label="Close"
          className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-[22px] h-[22px] text-[#7A7A7A]" aria-hidden="true" />
        </Link>
      )}

      {/* Main Status Icon */}
      <div className="pt-2 relative">
        {isVerified ? (
          <div className="w-20 h-20 rounded-[24px] bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform scale-110">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
        ) : (
          <div className="relative">
            <IconTile icon={Mail} size={80} radius={24} iconSize={40} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>

      <h1
        className="font-display font-[700] text-[30px] leading-[36px] md:text-[38px] md:leading-[42px] text-black text-center mt-6"
        style={{ letterSpacing: "-0.03em" }}
      >
        {isVerified ? "Account verified!" : "Check your email"}
      </h1>

      <p className="font-sans font-[400] text-[16px] md:text-[18px] text-[var(--text)] text-center mt-3 max-w-md">
        {isVerified ? (
          <span className="text-emerald-700 font-medium">
            Your verification was confirmed. Refreshing page...
          </span>
        ) : (
          <>
            We dispatched a secure one-time verification link to{" "}
            <span className="font-semibold text-black bg-[#F5F5F0] px-2.5 py-1 rounded-md inline-block mt-1">
              {email}
            </span>
          </>
        )}
      </p>

      {/* Instruction Card */}
      {!isVerified && (
        <div className="mt-6 w-full max-w-[500px] bg-[#F9F9F6] border border-[var(--line)] rounded-[24px] p-6 text-left flex flex-col gap-3">
          <div className="flex items-center gap-2 font-sans font-[600] text-[14px] text-black">
            <span className="w-6 h-6 rounded-full bg-black text-white text-[12px] flex items-center justify-center shrink-0">
              1
            </span>
            <span>Open the email sent from Beta Digest</span>
          </div>
          <div className="flex items-center gap-2 font-sans font-[600] text-[14px] text-black">
            <span className="w-6 h-6 rounded-full bg-black text-white text-[12px] flex items-center justify-center shrink-0">
              2
            </span>
            <span>Click the &quot;Verify account&quot; button inside</span>
          </div>
          <div className="flex items-center gap-2 font-sans font-[600] text-[14px] text-black">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center shrink-0">
              3
            </span>
            <span>This page will automatically refresh once verified</span>
          </div>

          <div className="mt-2 pt-3 border-t border-[var(--line)] flex items-center gap-2 text-[12px] text-[#7A7A7A]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#999]" />
            <span>Don&apos;t see the email? Check your spam or promotions folder.</span>
          </div>
        </div>
      )}

      {/* Live Listening Indicator */}
      {!isVerified && (
        <div className="mt-6 flex items-center gap-2.5 px-4 py-2 bg-[#F5F5F0] rounded-full border border-[var(--line)]">
          <RotateCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span className="font-sans text-[13px] font-[500] text-[#555]">
            Listening for email verification confirmation...
          </span>
        </div>
      )}

      {resendStatus && (
        <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[14px] text-sm font-sans max-w-md">
          {resendStatus}
        </div>
      )}

      {/* Footer controls: Only Resend & Change email (NO CONTINUE LINK) */}
      {!isVerified && (
        <div className="mt-8 flex flex-col items-center gap-4 w-full">
          <OutlineButton
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full sm:w-[220px] h-[52px] inline-flex items-center justify-center gap-2 text-[15px]"
          >
            {resending ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <span>Resend verification email</span>
            )}
          </OutlineButton>

          {onChangeEmail && (
            <button
              type="button"
              onClick={onChangeEmail}
              className="font-sans text-[14px] text-[#7A7A7A] hover:text-black underline cursor-pointer transition-colors mt-2"
            >
              Wrong email address? Change email
            </button>
          )}
        </div>
      )}
    </div>
  );
};
