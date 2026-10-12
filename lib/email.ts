/**
 * Resend Email Dispatch Helper for Beta Digest
 */

export interface SendVerificationEmailOptions {
  to: string;
  name?: string;
  verificationUrl: string;
}

export interface EmailDispatchResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendVerificationEmail({
  to,
  name = "there",
  verificationUrl,
}: SendVerificationEmailOptions): Promise<EmailDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured.");
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  // To prevent deliverability issues or spam classification, use configured verified domain:
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Beta Digest <onboarding@resend.dev>";

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Beta Digest Account</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA; margin: 0; padding: 40px 16px; color: #111111;">
  <div style="max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 28px; padding: 40px; border: 1px solid #EBEBEB; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <div style="display: inline-block; padding: 6px 14px; background: #F0F4E8; color: #365314; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 24px;">
      Beta Digest Verification
    </div>
    <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 16px 0; color: #000000; letter-spacing: -0.02em;">
      Verify your email address
    </h1>
    <p style="font-size: 16px; line-height: 1.6; color: #4B5563; margin: 0 0 24px 0;">
      Hi ${name},<br><br>
      Thank you for subscribing to <strong>Beta Digest</strong>. To activate your 5-minute morning briefing and hyperlocal weather forecast, please confirm your email address below.
    </p>
    <div style="text-align: center; margin: 36px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background-color: #000000; color: #FFFFFF !important; text-decoration: none; padding: 15px 36px; border-radius: 16px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);" target="_blank">
        Verify account
      </a>
    </div>
    <p style="font-size: 13px; line-height: 1.5; color: #6B7280; margin: 24px 0 0 0; word-break: break-all;">
      Or copy and paste this verification link into your browser:<br>
      <a href="${verificationUrl}" style="color: #2563EB; text-decoration: underline;">${verificationUrl}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 32px 0 20px 0;">
    <p style="font-size: 12px; color: #9CA3AF; margin: 0; text-align: center;">
      This link will expire in 24 hours. If you did not create a Beta Digest account, you can safely ignore this email.
    </p>
  </div>
</body>
</html>`;

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
        subject: "Verify your Beta Digest Account",
        html: emailHtml,
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
