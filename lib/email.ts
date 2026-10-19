/**
 * Resend Email Dispatch Helper for Beta Digest
 * Uses shared dark-theme email templates from @/lib/email-templates
 */

import {
  renderVerificationEmail,
  renderSignInEmail,
  renderWelcomeEmail,
  renderDailyDigestEmail,
  DailyDigestEmailOptions,
} from "./email-templates";

export interface SendVerificationEmailOptions {
  to: string;
  name?: string;
  verificationUrl: string;
}

export interface SendSignInEmailOptions {
  to: string;
  name?: string;
  signInUrl: string;
}

export interface SendWelcomeEmailOptions {
  to: string;
  name?: string;
  city?: string;
  sendTime?: string;
}

export interface SendDigestEmailOptions extends DailyDigestEmailOptions {
  to: string;
}

export interface EmailDispatchResult {
  success: boolean;
  id?: string;
  error?: string;
}

async function dispatchViaResend(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<EmailDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured.");
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Beta Digest <verify@betadigest.online>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
        text,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.id) {
      return { success: true, id: data.id };
    }

    return {
      success: false,
      error: data?.message || `Resend failed with status ${res.status}`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function sendVerificationEmail({
  to,
  name = "there",
  verificationUrl,
}: SendVerificationEmailOptions): Promise<EmailDispatchResult> {
  const { subject, html, text } = renderVerificationEmail({
    verificationUrl,
    name,
  });
  return dispatchViaResend(to, subject, html, text);
}

export async function sendSignInEmail({
  to,
  name = "there",
  signInUrl,
}: SendSignInEmailOptions): Promise<EmailDispatchResult> {
  const { subject, html, text } = renderSignInEmail({
    signInUrl,
    name,
  });
  return dispatchViaResend(to, subject, html, text);
}

export async function sendWelcomeEmail({
  to,
  name = "there",
  city = "your city",
  sendTime = "07:00",
}: SendWelcomeEmailOptions): Promise<EmailDispatchResult> {
  const { subject, html, text } = renderWelcomeEmail({
    name,
    city,
    sendTime,
  });
  return dispatchViaResend(to, subject, html, text);
}

export async function sendDigestEmail({
  to,
  ...digestOpts
}: SendDigestEmailOptions): Promise<EmailDispatchResult> {
  const { subject, html, text } = renderDailyDigestEmail(digestOpts);
  return dispatchViaResend(to, subject, html, text);
}
