require('dotenv').config();

const {
  renderVerificationEmail,
  renderSignInEmail,
  renderWelcomeEmail,
  renderDailyDigestEmail
} = require('./workflow_email_templates.js').getSharedEmailTemplatesJs();

// Let's create an evaluation context
const { getSharedEmailTemplatesJs } = require('./workflow_email_templates.js');
const fn = new Function(getSharedEmailTemplatesJs() + ';\nreturn { renderVerificationEmail, renderSignInEmail, renderWelcomeEmail, renderDailyDigestEmail };');
const templates = fn();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'Beta Digest <verify@betadigest.online>';
const RECIPIENTS = ['emekaa373@gmail.com', 'delivered@resend.dev'];

async function sendEmail({ to, subject, html, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM,
      to,
      subject,
      html,
      text
    })
  });

  const data = await res.json();
  return { status: res.status, data };
}

async function run() {
  console.log('Sending test emails for all 4 templates...');

  // 1. Verification Email
  const verification = templates.renderVerificationEmail({
    verificationUrl: 'https://betadigest.online/verify?token=test_verification_token_12345'
  });

  // 2. Sign-In Link Email
  const signIn = templates.renderSignInEmail({
    signInUrl: 'https://betadigest.online/verify?token=test_signin_token_67890'
  });

  // 3. Welcome / Confirmation Email
  const welcome = templates.renderWelcomeEmail({
    name: 'Emeka',
    city: 'London',
    sendTime: '07:30'
  });

  // 4. Daily Digest Email
  const digest = templates.renderDailyDigestEmail({
    firstName: 'Emeka',
    city: 'London',
    countryCode: 'UK',
    condition: 'Partly Cloudy',
    temp: 19,
    tempUnit: '°C',
    high: 22,
    low: 15,
    selectedWeatherMetrics: [
      { label: 'Rain Chance', value: '15%' },
      { label: 'UV Index', value: '4 (Moderate)' },
      { label: 'Wind Speed', value: '12 km/h' },
      { label: 'Air Quality', value: 'Good (AQI 24)' }
    ],
    articles: [
      {
        category: 'technology',
        topicLabel: 'Technology',
        title: 'Next-Generation AI Architectures Expand Real-Time Context Windows',
        summary: 'Breakthrough model pipelines process complex multi-turn logic with low latency, accelerating automated development cycles.',
        source: 'Tech Horizon',
        url: 'https://betadigest.online/dashboard'
      },
      {
        category: 'economy',
        topicLabel: 'Economy',
        title: 'Global Inflation Indices Steady as Supply Chains Stabilize',
        summary: 'Key monetary reports indicate cooling price pressures across major logistics corridors and retail staples.',
        source: 'Market Monitor',
        url: 'https://betadigest.online/dashboard'
      },
      {
        category: 'science',
        topicLabel: 'Science',
        title: 'Deep-Space Survey Identifies New Exoplanetary Atmosphere Profiles',
        summary: 'Astronomers record promising spectroscopic signals indicating water vapor in temperate planetary zones.',
        source: 'Cosmos Review',
        url: 'https://betadigest.online/dashboard'
      }
    ]
  });

  const emailBatches = [
    { name: '1. Email Verification', email: verification },
    { name: '2. Sign-In Link', email: signIn },
    { name: '3. Welcome / Confirmation', email: welcome },
    { name: '4. Daily Digest', email: digest }
  ];

  for (const batch of emailBatches) {
    for (const recipient of RECIPIENTS) {
      console.log(`Sending "${batch.name}" to ${recipient}...`);
      const result = await sendEmail({
        to: recipient,
        subject: `[Test] ${batch.email.subject}`,
        html: batch.email.html,
        text: batch.email.text
      });
      console.log(`Result (${recipient}):`, result);
      // Small pause to prevent rate limit
      await new Promise(r => setTimeout(r, 600));
    }
  }

  console.log('All test emails successfully dispatched!');
}

run().catch(err => {
  console.error('Error sending test emails:', err);
  process.exit(1);
});
