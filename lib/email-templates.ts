/**
 * Beta Digest Email Templates
 * 
 * Shared email-safe dark-theme templates matching the Beta Digest website:
 * - Centered 600px container with #0f0f12 void background
 * - Rounded 20px card in #141418 with 1px solid #26262f low-contrast border
 * - Hosted 2x PNG logo on betadigest.online (no SVG/inline fonts)
 * - Clean system sans-serif typography (no Georgia serif, no monospace)
 * - Solid white pill bulletproof button with dark text & Outlook VML fallback
 * - Sparingly used blue-to-purple solid accent (#8a7cfb)
 * - Hidden preheader and plain-text alternatives
 * - No raw exposed URLs (button is primary CTA, short descriptive text link fallback)
 * - Footer with dashboard and preferences/unsubscribe links
 */

import { WeatherTopicId, NewsTopicId, WEATHER_TOPIC_LABELS, NEWS_TOPIC_LABELS } from "./types";

export const APP_BASE_URL = "https://betadigest.online";
export const LOGO_URL = `${APP_BASE_URL}/logo-transparent.png`;

export interface BaseLayoutOptions {
  title: string;
  preheader: string;
  contentHtml: string;
  showUnsubscribe?: boolean;
}

/**
 * Shared Base HTML Layout for all Beta Digest emails.
 */
export function renderBaseLayout({
  title,
  preheader,
  contentHtml,
  showUnsubscribe = false,
}: BaseLayoutOptions): string {
  const dashboardUrl = `${APP_BASE_URL}/dashboard`;
  const preferencesUrl = `${APP_BASE_URL}/preferences`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
  <meta name="supported-color-schemes" content="dark light" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    :root {
      color-scheme: dark light;
      supported-color-schemes: dark light;
    }
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #0f0f12 !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-card-cell {
        padding: 30px 20px !important;
      }
      .mobile-column-stack {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .mobile-metric-half {
        display: block !important;
        width: 100% !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
        padding-bottom: 8px !important;
      }
      .mobile-text-center {
        text-align: center !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      body, .email-bg {
        background-color: #0f0f12 !important;
      }
      .email-card {
        background-color: #141418 !important;
        border-color: #26262f !important;
      }
    }
  </style>
</head>
<body bgcolor="#0f0f12" class="email-bg" style="margin: 0; padding: 0; background-color: #0f0f12; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <!-- Hidden Preheader with spacer padding to prevent inbox preview leaks -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; color: #0f0f12;">
    ${escapeHtml(preheader)}
    &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
    &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0f0f12" class="email-bg" style="background-color: #0f0f12; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px 48px;">
        <!-- Centered 600px Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%;">
          <tr>
            <td align="left">
              
              <!-- Rounded Obsidian Glass-Style Card -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#141418" class="email-card" style="background-color: #141418; border: 1px solid #26262f; border-radius: 20px; box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.5);">
                <tr>
                  <td class="email-card-cell" style="padding: 40px 36px;">
                    
                    <!-- Header with Hosted 2x Logo -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                      <tr>
                        <td valign="middle" style="vertical-align: middle;">
                          <a href="${dashboardUrl}" target="_blank" style="text-decoration: none;">
                            <img src="${LOGO_URL}" width="32" height="32" alt="BetaDigest Logo" style="display: block; width: 32px; height: 32px; border: 0;" />
                          </a>
                        </td>
                        <td valign="middle" style="vertical-align: middle; padding-left: 10px;">
                          <a href="${dashboardUrl}" target="_blank" style="text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; color: #ededed; line-height: 1;">
                            BetaDigest
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Main Dynamic Content -->
                    ${contentHtml}

                  </td>
                </tr>
              </table>
              <!-- End Card -->

              <!-- Footer -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 28px;">
                <tr>
                  <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #787885; text-align: center;">
                    <span style="color: #9292a0; font-weight: 500;">Beta Digest</span> &bull; 
                    <a href="${dashboardUrl}" target="_blank" style="color: #9292a0; text-decoration: underline;">Dashboard</a>
                    ${
                      showUnsubscribe
                        ? `<br /><a href="${preferencesUrl}" target="_blank" style="color: #787885; text-decoration: underline; font-size: 11px;">Manage preferences or unsubscribe</a>`
                        : ""
                    }
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Bulletproof Button (Pill shape, solid white, dark text, with Outlook VML fallback)
 */
export function renderBulletproofButton(buttonText: string, buttonUrl: string, width = 220): string {
  return `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(buttonUrl)}" style="height:48px;v-text-anchor:middle;width:${width}px;" arcsize="50%" stroke="f" fillcolor="#ffffff">
  <w:anchorlock/>
  <center style="color:#0a0a0a;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:600;">
    ${escapeHtml(buttonText)}
  </center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-- -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
  <tr>
    <td align="center" bgcolor="#ffffff" style="border-radius: 9999px; background-color: #ffffff; padding: 0;">
      <a href="${escapeHtml(buttonUrl)}" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #0a0a0a !important; text-decoration: none; border-radius: 9999px; line-height: 1.2; text-align: center; border: 1px solid #ffffff;">
        ${escapeHtml(buttonText)}
      </a>
    </td>
  </tr>
</table>
<!--<![endif]-->`;
}

// -----------------------------------------------------------------------------
// 1. EMAIL VERIFICATION TEMPLATE
// -----------------------------------------------------------------------------

export interface VerificationEmailOptions {
  verificationUrl: string;
  name?: string;
}

export function renderVerificationEmail({ verificationUrl }: VerificationEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Confirm your email";
  const preheader = "Confirm your email address to activate your Beta Digest account.";

  const contentHtml = `
    <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">
      Confirm your email
    </h1>
    <p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">
      Please confirm your email address to complete your registration and activate your personal morning briefing.
    </p>

    <!-- Call to action button -->
    <div style="margin: 32px 0 28px; text-align: center;">
      ${renderBulletproofButton("Verify email", verificationUrl, 200)}
    </div>

    <!-- Fallback link (no exposed raw URL) -->
    <p style="margin: 0 0 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #787885; text-align: center;">
      Having trouble? <a href="${escapeHtml(verificationUrl)}" target="_blank" style="color: #8a7cfb; text-decoration: underline;">Open the link in your browser</a>
    </p>

    <div style="border-top: 1px solid #26262f; padding-top: 20px; margin-top: 28px;">
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">
        If you didn't create a Beta Digest account, you can safely ignore this email.
      </p>
    </div>
  `;

  const html = renderBaseLayout({
    title: subject,
    preheader,
    contentHtml,
    showUnsubscribe: false,
  });

  const text = `Confirm your email

Please confirm your email address to complete your registration and activate your personal morning briefing.

Verify your email by clicking the link below:
${verificationUrl}

If you didn't create a Beta Digest account, you can safely ignore this email.

Beta Digest - https://betadigest.online/dashboard`;

  return { subject, html, text };
}

// -----------------------------------------------------------------------------
// 2. SIGN-IN LINK TEMPLATE
// -----------------------------------------------------------------------------

export interface SignInEmailOptions {
  signInUrl: string;
  name?: string;
}

export function renderSignInEmail({ signInUrl }: SignInEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Sign in to BetaDigest";
  const preheader = "Click the button inside to securely sign in to BetaDigest.";

  const contentHtml = `
    <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">
      Sign in to BetaDigest
    </h1>
    <p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">
      Click the button below to sign in to your Beta Digest account on this device.
    </p>

    <!-- Call to action button -->
    <div style="margin: 32px 0 28px; text-align: center;">
      ${renderBulletproofButton("Sign in", signInUrl, 180)}
    </div>

    <!-- Fallback link (no exposed raw URL) -->
    <p style="margin: 0 0 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #787885; text-align: center;">
      Having trouble? <a href="${escapeHtml(signInUrl)}" target="_blank" style="color: #8a7cfb; text-decoration: underline;">Open the link in your browser</a>
    </p>

    <div style="border-top: 1px solid #26262f; padding-top: 20px; margin-top: 28px;">
      <p style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">
        This single-use link expires in 15 minutes.
      </p>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">
        If this wasn't you, you can safely ignore this email.
      </p>
    </div>
  `;

  const html = renderBaseLayout({
    title: subject,
    preheader,
    contentHtml,
    showUnsubscribe: false,
  });

  const text = `Sign in to BetaDigest

Click the link below to sign in to your Beta Digest account on this device:
${signInUrl}

This single-use link expires in 15 minutes.
If this wasn't you, you can safely ignore this email.

Beta Digest - https://betadigest.online/dashboard`;

  return { subject, html, text };
}

// -----------------------------------------------------------------------------
// 3. WELCOME / CONFIRMATION TEMPLATE
// -----------------------------------------------------------------------------

export interface WelcomeEmailOptions {
  name?: string;
  city?: string;
  sendTime?: string;
}

export function renderWelcomeEmail({
  name = "there",
  city = "your city",
  sendTime = "07:00",
}: WelcomeEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Welcome to Beta Digest";
  const preheader = "Your account is active. Your daily briefing is scheduled.";
  const dashboardUrl = `${APP_BASE_URL}/dashboard`;

  const contentHtml = `
    <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">
      Welcome to Beta Digest
    </h1>
    <p style="margin: 0 0 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">
      Hi ${escapeHtml(name)}, your email has been confirmed and your account is now fully set up.
    </p>
    <p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">
      We will deliver your personalized forecast for <strong style="color: #ededed;">${escapeHtml(city)}</strong> and curated stories every morning at <strong style="color: #ededed;">${escapeHtml(sendTime)}</strong>.
    </p>

    <!-- Call to action button -->
    <div style="margin: 32px 0 28px; text-align: center;">
      ${renderBulletproofButton("Open your dashboard", dashboardUrl, 220)}
    </div>

    <div style="border-top: 1px solid #26262f; padding-top: 20px; margin-top: 28px;">
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">
        You can adjust your selected news topics, weather details, or delivery time at any moment in your preferences.
      </p>
    </div>
  `;

  const html = renderBaseLayout({
    title: subject,
    preheader,
    contentHtml,
    showUnsubscribe: true,
  });

  const text = `Welcome to Beta Digest

Hi ${name}, your email has been confirmed and your account is now fully set up.

We will deliver your personalized forecast for ${city} and curated stories every morning at ${sendTime}.

Open your dashboard:
${dashboardUrl}

You can adjust your selected news topics, weather details, or delivery time at any moment in your preferences.

Beta Digest - https://betadigest.online/dashboard`;

  return { subject, html, text };
}

// -----------------------------------------------------------------------------
// 4. DAILY DIGEST TEMPLATE
// -----------------------------------------------------------------------------

export interface DigestWeatherMetric {
  id: WeatherTopicId;
  label: string;
  value: string;
}

export interface DigestArticle {
  category: NewsTopicId | string;
  topicLabel?: string;
  title: string;
  summary: string;
  source: string;
  url: string;
}

export interface DailyDigestEmailOptions {
  firstName: string;
  city: string;
  countryCode?: string;
  condition: string;
  temp: number;
  tempUnit?: "°C" | "°F";
  high: number;
  low: number;
  selectedWeatherMetrics?: DigestWeatherMetric[];
  articles: DigestArticle[];
}

export function renderDailyDigestEmail({
  firstName,
  city,
  countryCode = "",
  condition,
  temp,
  tempUnit = "°C",
  high,
  low,
  selectedWeatherMetrics = [],
  articles = [],
}: DailyDigestEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const locationLabel = countryCode ? `${city}, ${countryCode}` : city;
  const subject = `Your Beta Digest for ${city}`;
  const preheader = `Good day, ${firstName}. Today in ${city}: ${condition}, ${temp}${tempUnit}. Top stories inside.`;
  const dashboardUrl = `${APP_BASE_URL}/dashboard`;

  // Format compact weather metrics grid (up to 3 metrics from saved preferences)
  let weatherMetricsHtml = "";
  if (selectedWeatherMetrics.length > 0) {
    const rows: string[] = [];
    for (let i = 0; i < selectedWeatherMetrics.length; i += 2) {
      const m1 = selectedWeatherMetrics[i];
      const m2 = selectedWeatherMetrics[i + 1];

      const col1 = `
        <td width="${m2 ? "50%" : "100%"}" valign="top" class="mobile-metric-half" style="padding: 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1f202b" style="background-color: #1f202b; border: 1px solid #2f3040; border-radius: 12px; padding: 10px 14px;">
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8a7cfb;">
                ${escapeHtml(m1.label)}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; font-weight: 600; color: #ffffff; padding-top: 3px;">
                ${escapeHtml(m1.value)}
              </td>
            </tr>
          </table>
        </td>
      `;

      const col2 = m2
        ? `
        <td width="50%" valign="top" class="mobile-metric-half" style="padding: 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1f202b" style="background-color: #1f202b; border: 1px solid #2f3040; border-radius: 12px; padding: 10px 14px;">
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8a7cfb;">
                ${escapeHtml(m2.label)}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; font-weight: 600; color: #ffffff; padding-top: 3px;">
                ${escapeHtml(m2.value)}
              </td>
            </tr>
          </table>
        </td>
      `
        : "";

      rows.push(`<tr>${col1}${col2}</tr>`);
    }

    weatherMetricsHtml = `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 14px;">
        ${rows.join("")}
      </table>
    `;
  }

  // Format articles
  const articlesHtml = articles
    .map((art, idx) => {
      const topicLabel =
        art.topicLabel ||
        (NEWS_TOPIC_LABELS[art.category as NewsTopicId] ?? String(art.category).toUpperCase());
      const numStr = String(idx + 1).padStart(2, "0");

      return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1a1a22" style="background-color: #1a1a22; border: 1px solid #282834; border-radius: 16px; margin-bottom: 12px;">
        <tr>
          <td style="padding: 18px 20px;">
            <!-- Meta row -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
              <tr>
                <td valign="middle" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; color: #787885; padding-right: 8px;">
                  ${numStr}
                </td>
                <td valign="middle">
                  <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; background-color: #242533; border: 1px solid #36384a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; line-height: 1;">
                    ${escapeHtml(topicLabel)}
                  </span>
                </td>
                <td valign="middle" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #787885; padding-left: 8px;">
                  &bull; ${escapeHtml(art.source || "Beta Digest Wire")}
                </td>
              </tr>
            </table>

            <!-- Headline -->
            <h3 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; line-height: 1.4; color: #ffffff;">
              ${escapeHtml(art.title)}
            </h3>

            <!-- Summary -->
            <p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; line-height: 1.55; color: #b4b4bb;">
              ${escapeHtml(art.summary)}
            </p>

            <!-- Read full story action -->
            <div>
              <a href="${escapeHtml(art.url || dashboardUrl)}" target="_blank" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 500; color: #ffffff; text-decoration: none;">
                Read full story <span style="color: #8a7cfb; font-size: 14px;">&rarr;</span>
              </a>
            </div>
          </td>
        </tr>
      </table>
    `;
    })
    .join("");

  const contentHtml = `
    <!-- Greeting -->
    <h1 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">
      Good day, ${escapeHtml(firstName)}.
    </h1>
    <p style="margin: 0 0 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">
      Here is your curated briefing for today in <strong style="color: #ededed;">${escapeHtml(locationLabel)}</strong>.
    </p>

    <!-- Weather Section -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1a1a22" style="background-color: #1a1a22; border: 1px solid #282834; border-radius: 16px; margin-bottom: 28px;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td valign="top" align="left">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #8a7cfb; margin-bottom: 4px;">
                  ${escapeHtml(locationLabel)}
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 600; color: #ffffff; text-transform: capitalize; margin-bottom: 4px;">
                  ${escapeHtml(condition)}
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12.5px; color: #a1a1aa;">
                  H: <strong style="color: #ededed;">${high}°</strong> &bull; L: <strong style="color: #ededed;">${low}°</strong>
                </div>
              </td>
              <td valign="top" align="right" style="text-align: right;">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 38px; font-weight: 700; color: #ffffff; line-height: 1; letter-spacing: -0.03em;">
                  ${temp}${tempUnit}
                </div>
              </td>
            </tr>
          </table>

          <!-- Selected Metrics from User Preferences Only -->
          ${weatherMetricsHtml}
        </td>
      </tr>
    </table>

    <!-- Curated News Section -->
    <div style="margin-bottom: 12px;">
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7cfb; margin-bottom: 12px;">
        Curated Stories (${articles.length})
      </div>
      ${articlesHtml}
    </div>

    <!-- Bottom Dashboard Action Button -->
    <div style="margin: 32px 0 16px; text-align: center;">
      ${renderBulletproofButton("Open your dashboard", dashboardUrl, 220)}
    </div>
  `;

  const html = renderBaseLayout({
    title: subject,
    preheader,
    contentHtml,
    showUnsubscribe: true,
  });

  const textArticles = articles
    .map(
      (a, i) =>
        `[${String(i + 1).padStart(2, "0")}] ${a.title}\n(${a.source})\n${a.summary}\n${a.url}\n`
    )
    .join("\n");

  const textMetrics = selectedWeatherMetrics
    .map((m) => `  - ${m.label}: ${m.value}`)
    .join("\n");

  const text = `Good day, ${firstName}.

Beta Digest for ${locationLabel}
Current: ${temp}${tempUnit}, ${condition} (High: ${high}° / Low: ${low}°)
${textMetrics ? `\nSelected details:\n${textMetrics}\n` : ""}
Curated stories:
${textArticles}

Open your dashboard:
${dashboardUrl}

Manage preferences or unsubscribe:
${APP_BASE_URL}/preferences

Beta Digest - https://betadigest.online/dashboard`;

  return { subject, html, text };
}

// -----------------------------------------------------------------------------
// Helper: HTML Escaping
// -----------------------------------------------------------------------------

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
