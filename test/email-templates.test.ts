import { describe, it } from "node:test";
import assert from "node:assert";
import {
  renderVerificationEmail,
  renderSignInEmail,
  renderWelcomeEmail,
  renderDailyDigestEmail,
  LOGO_URL,
} from "../lib/email-templates";

describe("Beta Digest Email Templates Redesign", () => {
  const dummyVerificationUrl = "https://betadigest.online/verify?token=abc123def456";
  const dummySignInUrl = "https://betadigest.online/verify?token=login789xyz";

  describe("1. Verification Email", () => {
    const { subject, html, text } = renderVerificationEmail({
      verificationUrl: dummyVerificationUrl,
    });

    it("has expected subject and consistent sender name semantics", () => {
      assert.strictEqual(subject, "Confirm your email");
    });

    it("uses dark background #0f0f12 and card #141418 with #26262f border", () => {
      assert.ok(html.includes('bgcolor="#0f0f12"'));
      assert.ok(html.includes("background-color: #0f0f12"));
      assert.ok(html.includes('bgcolor="#141418"'));
      assert.ok(html.includes("background-color: #141418"));
      assert.ok(html.includes("border: 1px solid #26262f"));
    });

    it("includes hosted PNG logo (2x) and alt text", () => {
      assert.ok(html.includes(LOGO_URL));
      assert.ok(html.includes('alt="BetaDigest Logo"'));
      assert.ok(!html.includes("<svg"));
    });

    it("uses sans-serif system typography and removes Georgia serif and monospace", () => {
      assert.ok(html.includes("-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"));
      assert.ok(!html.includes("Georgia"));
      assert.ok(!/\bserif\b/i.test(html.replace(/sans-serif/gi, "")));
      assert.ok(!html.includes("font-family: monospace"));
    });

    it("contains bulletproof button with VML fallback for Outlook", () => {
      assert.ok(html.includes("<v:roundrect"));
      assert.ok(html.includes('arcsize="50%"'));
      assert.ok(html.includes("Verify email"));
    });

    it("removes exposed raw links and includes clean text fallback", () => {
      assert.ok(!html.includes("Or copy this link"));
      assert.ok(!html.includes("Or copy and paste this verification link"));
      assert.ok(html.includes("Having trouble? <a href="));
      assert.ok(html.includes("Open the link in your browser"));
    });

    it("includes required email content: heading, sentence, ignore note", () => {
      assert.ok(html.includes("Confirm your email"));
      assert.ok(html.includes("Please confirm your email address to complete your registration"));
      assert.ok(html.includes("If you didn't create a Beta Digest account, you can safely ignore this email."));
    });

    it("has hidden preheader text and plain text alternative", () => {
      assert.ok(html.includes("Confirm your email address to activate your Beta Digest account."));
      assert.ok(text.includes("Confirm your email"));
      assert.ok(text.includes(dummyVerificationUrl));
    });
  });

  describe("2. Sign-in Link Email", () => {
    const { subject, html, text } = renderSignInEmail({
      signInUrl: dummySignInUrl,
    });

    it("has expected subject and heading", () => {
      assert.strictEqual(subject, "Sign in to BetaDigest");
      assert.ok(html.includes("Sign in to BetaDigest"));
    });

    it("includes bulletproof Sign in button", () => {
      assert.ok(html.includes("Sign in"));
      assert.ok(html.includes("<v:roundrect"));
      assert.ok(html.includes('arcsize="50%"'));
    });

    it("contains expiry note (15 minutes) and ignore line", () => {
      assert.ok(html.includes("This single-use link expires in 15 minutes."));
      assert.ok(html.includes("If this wasn't you, you can safely ignore this email."));
    });

    it("removes exposed raw URL and provides text fallback", () => {
      assert.ok(!html.includes("Or copy this link"));
      assert.ok(html.includes("Having trouble? <a href="));
      assert.ok(html.includes("Open the link in your browser"));
    });

    it("provides plain text alternative", () => {
      assert.ok(text.includes("Sign in to BetaDigest"));
      assert.ok(text.includes(dummySignInUrl));
      assert.ok(text.includes("15 minutes"));
    });
  });

  describe("3. Welcome / Confirmation Email", () => {
    const { subject, html, text } = renderWelcomeEmail({
      name: "Alex",
      city: "Lagos",
      sendTime: "07:00",
    });

    it("has expected subject and heading", () => {
      assert.strictEqual(subject, "Welcome to Beta Digest");
      assert.ok(html.includes("Welcome to Beta Digest"));
      assert.ok(html.includes("Alex"));
      assert.ok(html.includes("Lagos"));
      assert.ok(html.includes("07:00"));
    });

    it("contains 'Open your dashboard' button and preferences note", () => {
      assert.ok(html.includes("Open your dashboard"));
      assert.ok(html.includes("preferences"));
    });

    it("provides plain text alternative", () => {
      assert.ok(text.includes("Welcome to Beta Digest"));
      assert.ok(text.includes("Alex"));
      assert.ok(text.includes("https://betadigest.online/dashboard"));
    });
  });

  describe("4. Daily Digest Email", () => {
    const { subject, html, text } = renderDailyDigestEmail({
      firstName: "Alex",
      city: "Seattle",
      countryCode: "US",
      condition: "Partly cloudy",
      temp: 22,
      tempUnit: "°C",
      high: 25,
      low: 15,
      selectedWeatherMetrics: [
        { id: "rain-chance", label: "Rain chance", value: "10%" },
        { id: "uv-index", label: "UV index", value: "5 (Moderate)" },
        { id: "wind", label: "Wind", value: "12 km/h" },
      ],
      articles: [
        {
          category: "technology",
          topicLabel: "Technology",
          title: "Next-Gen Clean Power Grid Unveiled",
          summary: "Autonomous telemetry shows peak efficiency across regional energy corridors.",
          source: "Beta Digest Wire",
          url: "https://example.com/clean-power",
        },
        {
          category: "economy",
          topicLabel: "Economy",
          title: "Central Banks Finalize Instant Settlement Protocols",
          summary: "Real-time cross-border settlements reduce payment latency.",
          source: "Markets Review",
          url: "https://example.com/central-banks",
        },
      ],
    });

    it("greets user by first name", () => {
      assert.ok(html.includes("Good day, Alex."));
      assert.ok(text.includes("Good day, Alex."));
    });

    it("renders weather section in dashboard card and pill style", () => {
      assert.ok(html.includes("Seattle, US"));
      assert.ok(html.includes("Partly cloudy"));
      assert.ok(html.includes("22°C"));
      assert.ok(html.includes("H: <strong style=\"color: #ededed;\">25°</strong>"));
      assert.ok(html.includes("Rain chance"));
      assert.ok(html.includes("10%"));
      assert.ok(html.includes("UV index"));
      assert.ok(html.includes("5 (Moderate)"));
      assert.ok(html.includes("text-transform: uppercase"));
    });

    it("renders news section matching saved categories with pills and headlines", () => {
      assert.ok(html.includes("Technology"));
      assert.ok(html.includes("Next-Gen Clean Power Grid Unveiled"));
      assert.ok(html.includes("Economy"));
      assert.ok(html.includes("Central Banks Finalize Instant Settlement Protocols"));
      assert.ok(html.includes("Read full story"));
    });

    it("includes Open your dashboard button and unsubscribe link", () => {
      assert.ok(html.includes("Open your dashboard"));
      assert.ok(html.includes("Manage preferences or unsubscribe"));
      assert.ok(text.includes("Manage preferences or unsubscribe"));
    });
  });
});
