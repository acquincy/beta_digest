const fs = require('fs');
const { getSharedEmailTemplatesJs } = require('./workflow_email_templates.js');

const sharedTemplatesJs = getSharedEmailTemplatesJs();

let code = fs.readFileSync('scripts/v2_workflow.js', 'utf8');

// 1. Injects SHARED_EMAIL_TEMPLATES_JS
const sharedConstant = `// -------------------------------------------------------------
// SHARED EMAIL TEMPLATES GENERATOR (DARK THEME & SAFE LINKS)
// -------------------------------------------------------------
const SHARED_EMAIL_TEMPLATES_JS = \`${sharedTemplatesJs.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
`;

code = code.replace(
  "import { workflow, node, trigger, ifElse, newCredential } from '@n8n/workflow-sdk';",
  "import { workflow, node, trigger, ifElse, newCredential } from '@n8n/workflow-sdk';\n\n" + sharedConstant
);

// 2. Update code_validate_signup
const oldSignupJsCodeStart = `const code_validate_signup = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Validate & Prepare Signup',
    parameters: {
      jsCode: \``;

const newSignupJsCodeStart = `const code_validate_signup = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Validate & Prepare Signup',
    parameters: {
      jsCode: \`
\${SHARED_EMAIL_TEMPLATES_JS}
`;

code = code.replace(oldSignupJsCodeStart, newSignupJsCodeStart);

const oldSignupReturnBlock = `const appBaseUrl = $('Config: Signup Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const verificationUrl = appBaseUrl + '/verify?token=' + rawToken;

return [{\\n  json: {
    error: null,
    email: rawEmail,
    name: body.name || rawEmail.split('@')[0] || 'Reader',
    city: body.city || null,
    country_code: body.country_code || null,
    news_categories: Array.isArray(body.news_categories) ? body.news_categories : [],
    weather_categories: Array.isArray(body.weather_categories) ? body.weather_categories : [],
    send_time: body.send_time || '07:00:00',
    rawToken,
    tokenHash,
    expiresAt24h,
    expiresAt15m,
    verificationUrl,
    appBaseUrl
  }
}];`;

const newSignupReturnBlock = `const appBaseUrl = $('Config: Signup Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const verificationUrl = appBaseUrl + '/verify?token=' + rawToken;

const renderedVerification = renderVerificationEmail({ verificationUrl });
const renderedSignIn = renderSignInEmail({ signInUrl: verificationUrl });

return [{\\n  json: {
    error: null,
    email: rawEmail,
    name: body.name || rawEmail.split('@')[0] || 'Reader',
    city: body.city || null,
    country_code: body.country_code || null,
    news_categories: Array.isArray(body.news_categories) ? body.news_categories : [],
    weather_categories: Array.isArray(body.weather_categories) ? body.weather_categories : [],
    send_time: body.send_time || '07:00:00',
    rawToken,
    tokenHash,
    expiresAt24h,
    expiresAt15m,
    verificationUrl,
    appBaseUrl,
    verificationSubject: renderedVerification.subject,
    verificationHtml: renderedVerification.html,
    verificationText: renderedVerification.text,
    loginSubject: renderedSignIn.subject,
    loginHtml: renderedSignIn.html,
    loginText: renderedSignIn.text
  }
}];`;

code = code.replace(oldSignupReturnBlock, newSignupReturnBlock);

// 3. Update resend_send_verification and resend_send_login_link
const oldResendSendVerification = `const resend_send_verification = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Verification Email',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $("Validate & Prepare Signup").first()?.json?.email }}',
      subject: 'Verify your Beta Digest email',
      html: '=<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest Verification</p><h1 style="font-size: 24px; margin: 0 0 16px;">Confirm your email address</h1><p style="font-size: 15px; line-height: 1.6; color: #44403C;">Welcome to Beta Digest! Click the button below to verify your email address and finish setting up your personalized weather and news preferences.</p><p style="margin: 24px 0;"><a href="{{ $(\\'Validate & Prepare Signup\\').first()?.json?.verificationUrl }}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">Verify My Email</a></p><p style="font-size: 12px; color: #78716C;">Or copy this link: {{ $(\\'Validate & Prepare Signup\\').first()?.json?.verificationUrl }}</p></div>',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});`;

const newResendSendVerification = `const resend_send_verification = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Verification Email',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $("Validate & Prepare Signup").first()?.json?.email }}',
      subject: 'Confirm your email',
      html: '={{ $("Validate & Prepare Signup").first()?.json?.verificationHtml }}',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});`;

const oldResendSendLoginLink = `const resend_send_login_link = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Login Link Email',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $("Validate & Prepare Signup").first()?.json?.email }}',
      subject: 'Sign in to Beta Digest',
      html: '=<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest Sign-In</p><h1 style="font-size: 24px; margin: 0 0 16px;">Sign in on this device</h1><p style="font-size: 15px; line-height: 1.6; color: #44403C;">Click the button below to securely sign in to your Beta Digest account. This single-use link expires in 15 minutes.</p><p style="margin: 24px 0;"><a href="{{ $(\\'Validate & Prepare Signup\\').first()?.json?.verificationUrl }}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">Sign In to Beta Digest</a></p><p style="font-size: 12px; color: #78716C;">Or copy this link: {{ $(\\'Validate & Prepare Signup\\').first()?.json?.verificationUrl }}</p></div>',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});`;

const newResendSendLoginLink = `const resend_send_login_link = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Login Link Email',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $("Validate & Prepare Signup").first()?.json?.email }}',
      subject: 'Sign in to BetaDigest',
      html: '={{ $("Validate & Prepare Signup").first()?.json?.loginHtml }}',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});`;

code = code.replace(oldResendSendVerification, newResendSendVerification);
code = code.replace(oldResendSendLoginLink, newResendSendLoginLink);

// 4. Update Determine Send-Link Dispatch & Send Sign-In Link Email
const oldDetermineSendLinkJs = `const code_determine_send_link_action = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Determine Send-Link Dispatch',
    parameters: {
      jsCode: \`
const prep = $('Prepare Send-Link').first()?.json || {};
const user = $input.first()?.json?.id ? $input.first().json : null;

let shouldSend = false;
let isLogin = false;
let expiresAt = prep.expiresAt15m;

if (user && prep.shouldProcess) {
  const lastSent = user.last_link_sent_at ? new Date(user.last_link_sent_at).getTime() : 0;
  if (Date.now() - lastSent >= 60 * 1000) {
    shouldSend = true;
    if (user.verified === true || user.is_verified === true) {
      isLogin = true;
      expiresAt = prep.expiresAt15m;
    } else {
      isLogin = false;
      expiresAt = prep.expiresAt24h;
    }
  }
}

return [{
  json: {
    ...prep,
    userId: user?.id || null,
    shouldSend,
    isLogin,
    expiresAt
  }
}];
\`
    }
  }
});`;

const newDetermineSendLinkJs = `const code_determine_send_link_action = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Determine Send-Link Dispatch',
    parameters: {
      jsCode: \`
\${SHARED_EMAIL_TEMPLATES_JS}

const prep = $('Prepare Send-Link').first()?.json || {};
const user = $input.first()?.json?.id ? $input.first().json : null;

let shouldSend = false;
let isLogin = false;
let expiresAt = prep.expiresAt15m;

if (user && prep.shouldProcess) {
  const lastSent = user.last_link_sent_at ? new Date(user.last_link_sent_at).getTime() : 0;
  if (Date.now() - lastSent >= 60 * 1000) {
    shouldSend = true;
    if (user.verified === true || user.is_verified === true) {
      isLogin = true;
      expiresAt = prep.expiresAt15m;
    } else {
      isLogin = false;
      expiresAt = prep.expiresAt24h;
    }
  }
}

let emailSubject = 'Sign in to BetaDigest';
let emailHtml = '';
let emailText = '';

if (prep.verificationUrl) {
  if (isLogin) {
    const rendered = renderSignInEmail({ signInUrl: prep.verificationUrl });
    emailSubject = rendered.subject;
    emailHtml = rendered.html;
    emailText = rendered.text;
  } else {
    const rendered = renderVerificationEmail({ verificationUrl: prep.verificationUrl });
    emailSubject = rendered.subject;
    emailHtml = rendered.html;
    emailText = rendered.text;
  }
}

return [{
  json: {
    ...prep,
    userId: user?.id || null,
    shouldSend,
    isLogin,
    expiresAt,
    emailSubject,
    emailHtml,
    emailText
  }
}];
\`
    }
  }
});`;

const oldResendDispatchSendLink = `const resend_dispatch_send_link = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Sign-In Link Email',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $("Determine Send-Link Dispatch").first()?.json?.email }}',
      subject: 'Your Beta Digest Sign-In Link',
      html: '=<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest Access</p><h1 style="font-size: 24px; margin: 0 0 16px;">Sign in to your account</h1><p style="font-size: 15px; line-height: 1.6; color: #44403C;">Click the link below to access your Beta Digest dashboard.</p><p style="margin: 24px 0;"><a href="{{ $(\\'Determine Send-Link Dispatch\\').first()?.json?.verificationUrl }}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">Sign In Now</a></p><p style="font-size: 12px; color: #78716C;">Or copy this link: {{ $(\\'Determine Send-Link Dispatch\\').first()?.json?.verificationUrl }}</p></div>',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});`;

const newResendDispatchSendLink = `const resend_dispatch_send_link = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Sign-In Link Email',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $("Determine Send-Link Dispatch").first()?.json?.email }}',
      subject: '={{ $("Determine Send-Link Dispatch").first()?.json?.emailSubject }}',
      html: '={{ $("Determine Send-Link Dispatch").first()?.json?.emailHtml }}',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});`;

code = code.replace(oldDetermineSendLinkJs, newDetermineSendLinkJs);
code = code.replace(oldResendDispatchSendLink, newResendDispatchSendLink);

// 5. Add Welcome Email nodes (code_prepare_welcome, resend_send_welcome)
const welcomeNodesDefinition = `
const code_prepare_welcome = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Welcome Email',
    parameters: {
      jsCode: \`
\${SHARED_EMAIL_TEMPLATES_JS}

const user = $('Supabase: Find Verification Token').first()?.json || {};
const name = user.name || (user.email ? user.email.split('@')[0] : 'there');
const city = user.city || 'your city';
const sendTime = (user.send_time || '07:00:00').slice(0, 5);

const rendered = renderWelcomeEmail({ name, city, sendTime });

return [{
  json: {
    email: user.email,
    welcomeSubject: rendered.subject,
    welcomeHtml: rendered.html,
    welcomeText: rendered.text
  }
}];
\`
    }
  }
});

const resend_send_welcome = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Welcome Email',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $("Supabase: Find Verification Token").first()?.json?.email }}',
      subject: '={{ $json.welcomeSubject }}',
      html: '={{ $json.welcomeHtml }}',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});
`;

code = code.replace(
  'const respond_verify_success = node({',
  welcomeNodesDefinition + '\nconst respond_verify_success = node({'
);

// Update connection in verify flow:
code = code.replace(
  'supa_mark_user_verified\n            .to(supa_insert_verified_session)\n            .to(respond_verify_success))))))',
  'supa_mark_user_verified\n            .to(supa_insert_verified_session)\n            .to(code_prepare_welcome)\n            .to(resend_send_welcome)\n            .to(respond_verify_success))))))'
);

// 6. Update code_filter_due_users (Daily Digest)
const oldFilterDueUsersJs = `const code_filter_due_users = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Filter Scheduled Users & Format Reminder',
    parameters: {
      jsCode: \`
const now = new Date();
let currentHour = now.getUTCHours();
const todayDate = now.toISOString().split('T')[0];

let queryHour = null;
let queryEmail = null;
try {
  const wh = $('Webhook: GET /v2/digest/send-hourly').first()?.json;
  if (wh?.query?.hour !== undefined) {
    queryHour = parseInt(String(wh.query.hour), 10);
  }
  if (wh?.query?.email) {
    queryEmail = String(wh.query.email).trim().toLowerCase();
  }
} catch (e) {}

const targetHour = (queryHour !== null && !Number.isNaN(queryHour)) ? queryHour : currentHour;
const paddedHour = String(targetHour).padStart(2, '0');

const rawUsers = $input.all().map(item => item.json).filter(u => u && u.email);

const parseHour = (sendTime) => {
  if (!sendTime || typeof sendTime !== 'string') return null;
  const parts = sendTime.trim().split(':');
  const h = parseInt(parts[0], 10);
  return Number.isNaN(h) ? null : h;
};

let dueUsers = rawUsers.filter(u => {
  if (u.verified !== true || u.is_verified !== true) return false;
  if (u.onboarding_completed !== true) return false;
  const userHour = parseHour(u.send_time);
  if (userHour === null || userHour !== targetHour) return false;
  if (u.last_sent_date && String(u.last_sent_date).startsWith(todayDate)) return false;
  if (queryEmail && String(u.email).toLowerCase() !== queryEmail) return false;
  return true;
});

if (dueUsers.length === 0) {
  return [{
    json: {
      hasDueUsers: false,
      count: 0
    }
  }];
}

const appBaseUrl = $('Config: Digest Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const dashboardUrl = appBaseUrl.replace(/\\/+$/, '') + '/dashboard';

return dueUsers.map(user => {
  const readerName = user.name || (user.email ? user.email.split('@')[0] : 'Reader');
  const subject = \\\`Your Beta Digest is ready (\${paddedHour}:00 edition)\\\`;
  const html = \\\`<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 36px 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;">
  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest • Scheduled Reminder</p>
  <h1 style="font-size: 24px; margin: 0 0 16px; color: #1C1917;">Good day, \${readerName}.</h1>
  <p style="font-size: 15px; line-height: 1.6; color: #44403C; margin: 0 0 20px;">
    This is your scheduled <strong>\${user.send_time || paddedHour + ':00:00'}</strong> reminder that your personalized Beta Digest for <strong>\${user.city || 'your city'}</strong> is ready.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #44403C; margin: 0 0 28px;">
    Head over to your dashboard to view your live weather metrics and curated news stories whenever you are ready.
  </p>
  <p style="margin: 0 0 28px;">
    <a href="\${dashboardUrl}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">View Your Dashboard</a>
  </p>
  <hr style="border: none; border-top: 1px solid #E7E0D6; margin: 24px 0;" />
  <p style="font-size: 12px; color: #78716C; margin: 0;">
    Direct link: <a href="\${dashboardUrl}" style="color: #C84B31;">\${dashboardUrl}</a>
  </p>
</div>\\\`;

  return {
    json: {
      hasDueUsers: true,
      count: dueUsers.length,
      id: user.id,
      email: user.email,
      name: readerName,
      city: user.city || '',
      country_code: user.country_code || '',
      news_categories: user.news_categories || [],
      weather_categories: user.weather_categories || [],
      send_time: user.send_time || \\\`\${paddedHour}:00:00\\\`,
      triggered_hour: targetHour,
      today_date: todayDate,
      dashboard_url: dashboardUrl,
      subject,
      html
    }
  };
});
\`
    }
  }
});`;

const newFilterDueUsersJs = `const code_filter_due_users = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Filter Scheduled Users & Format Reminder',
    parameters: {
      jsCode: \`
\${SHARED_EMAIL_TEMPLATES_JS}

const now = new Date();
let currentHour = now.getUTCHours();
const todayDate = now.toISOString().split('T')[0];

let queryHour = null;
let queryEmail = null;
try {
  const wh = $('Webhook: GET /v2/digest/send-hourly').first()?.json;
  if (wh?.query?.hour !== undefined) {
    queryHour = parseInt(String(wh.query.hour), 10);
  }
  if (wh?.query?.email) {
    queryEmail = String(wh.query.email).trim().toLowerCase();
  }
} catch (e) {}

const targetHour = (queryHour !== null && !Number.isNaN(queryHour)) ? queryHour : currentHour;
const paddedHour = String(targetHour).padStart(2, '0');

const rawUsers = $input.all().map(item => item.json).filter(u => u && u.email);

const parseHour = (sendTime) => {
  if (!sendTime || typeof sendTime !== 'string') return null;
  const parts = sendTime.trim().split(':');
  const h = parseInt(parts[0], 10);
  return Number.isNaN(h) ? null : h;
};

let dueUsers = rawUsers.filter(u => {
  if (u.verified !== true || u.is_verified !== true) return false;
  if (u.onboarding_completed !== true) return false;
  const userHour = parseHour(u.send_time);
  if (userHour === null || userHour !== targetHour) return false;
  if (u.last_sent_date && String(u.last_sent_date).startsWith(todayDate)) return false;
  if (queryEmail && String(u.email).toLowerCase() !== queryEmail) return false;
  return true;
});

if (dueUsers.length === 0) {
  return [{
    json: {
      hasDueUsers: false,
      count: 0
    }
  }];
}

const appBaseUrl = $('Config: Digest Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const dashboardUrl = appBaseUrl.replace(/\\/+$/, '') + '/dashboard';
const preferencesUrl = appBaseUrl.replace(/\\/+$/, '') + '/preferences';

const metricDefs = {
  'current-temperature': { label: 'Current Temp', value: '21°C' },
  'rain-chance': { label: 'Rain Chance', value: '10%' },
  'uv-index': { label: 'UV Index', value: '3 (Moderate)' },
  'humidity': { label: 'Humidity', value: '62%' },
  'wind': { label: 'Wind Speed', value: '14 km/h' },
  'air-quality': { label: 'Air Quality', value: 'Good (AQI 28)' },
  'pressure': { label: 'Pressure', value: '1016 hPa' },
  'cloud-cover': { label: 'Cloud Cover', value: '35%' },
  'sunrise-sunset': { label: 'Sunrise / Sunset', value: '06:45 / 19:30' }
};

const categoryArticles = {
  technology: {
    category: 'technology',
    topicLabel: 'Technology',
    title: 'Next-Generation AI Systems Expand Real-Time Context Windows',
    summary: 'Breakthrough architectures allow machine learning pipelines to process rich multi-modal context with lower latency and improved precision.',
    source: 'Tech Horizon',
    url: dashboardUrl
  },
  economy: {
    category: 'economy',
    topicLabel: 'Economy',
    title: 'Global Markets Stabilize as Inflation Indicators Cool',
    summary: 'Key economic benchmarks show steadying consumer price indices and resilient labor market conditions across major regions.',
    source: 'Market Monitor',
    url: dashboardUrl
  },
  science: {
    category: 'science',
    topicLabel: 'Science',
    title: 'Deep-Space Survey Telescope Identifies Promising Exoplanet Candidates',
    summary: 'Astrophysicists report atmosphere signatures consistent with water vapor on rocky worlds orbiting stable star systems.',
    source: 'Cosmos Review',
    url: dashboardUrl
  },
  general: {
    category: 'general',
    topicLabel: 'World News',
    title: 'Global Infrastructure Summit Concludes with Clean Energy Pledges',
    summary: 'Delegates from 40 nations sign multilateral agreements investing in grid modernization and resilient distribution networks.',
    source: 'Beta Digest Wire',
    url: dashboardUrl
  },
  business: {
    category: 'business',
    topicLabel: 'Business',
    title: 'Cross-Border Venture Funding Rebounds Strongly in Tech & Logistics',
    summary: 'Early-stage tech ventures secure new commitments as enterprise automation demand accelerates throughout the quarter.',
    source: 'Financial Briefing',
    url: dashboardUrl
  },
  entertainment: {
    category: 'entertainment',
    topicLabel: 'Culture',
    title: 'Independent Cinema Dominates International Film Festivals',
    summary: 'Emerging directors capture top honors with innovative narrative formats and grounded storytelling.',
    source: 'Culture Wire',
    url: dashboardUrl
  },
  health: {
    category: 'health',
    topicLabel: 'Health & Wellness',
    title: 'New Clinical Guidelines Emphasize Preventive Circadian Health',
    summary: 'Sleep architecture researchers highlight morning sunlight exposure and consistent meal schedules as primary vitality markers.',
    source: 'Wellness Science',
    url: dashboardUrl
  },
  sports: {
    category: 'sports',
    topicLabel: 'Sports',
    title: 'Championship Races Tighten Across Domestic and International Leagues',
    summary: 'Key contenders secure decisive weekend victories as title chases enter critical season stages.',
    source: 'Sports Desk',
    url: dashboardUrl
  }
};

return dueUsers.map(user => {
  const readerName = user.name || (user.email ? user.email.split('@')[0] : 'Reader');
  const userCity = user.city || 'your city';
  
  const userWeatherTopics = Array.isArray(user.weather_categories) && user.weather_categories.length > 0
    ? user.weather_categories
    : ['current-temperature', 'rain-chance', 'uv-index'];

  const selectedWeatherMetrics = userWeatherTopics.slice(0, 4).map(topic => {
    return metricDefs[topic] || { label: topic.replace(/-/g, ' ').toUpperCase(), value: 'Optimal' };
  });

  const userNewsTopics = Array.isArray(user.news_categories) && user.news_categories.length > 0
    ? user.news_categories
    : ['technology', 'economy', 'science'];

  const articles = userNewsTopics.map(topic => {
    return categoryArticles[topic] || {
      category: topic,
      topicLabel: topic.replace(/-/g, ' ').toUpperCase(),
      title: 'Key Industry Updates in ' + topic.charAt(0).toUpperCase() + topic.slice(1),
      summary: 'Comprehensive analysis of trending developments and emerging patterns in ' + topic + '.',
      source: 'Beta Digest Wire',
      url: dashboardUrl
    };
  });

  const rendered = renderDailyDigestEmail({
    firstName: readerName,
    city: userCity,
    countryCode: user.country_code || '',
    condition: 'Partly Cloudy',
    temp: 21,
    tempUnit: '°C',
    high: 24,
    low: 16,
    selectedWeatherMetrics,
    articles,
    dashboardUrl,
    preferencesUrl
  });

  return {
    json: {
      hasDueUsers: true,
      count: dueUsers.length,
      id: user.id,
      email: user.email,
      name: readerName,
      city: userCity,
      country_code: user.country_code || '',
      news_categories: user.news_categories || [],
      weather_categories: user.weather_categories || [],
      send_time: user.send_time || \\\`\${paddedHour}:00:00\\\`,
      triggered_hour: targetHour,
      today_date: todayDate,
      dashboard_url: dashboardUrl,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text
    }
  };
});
\`
    }
  }
});`;

code = code.replace(oldFilterDueUsersJs, newFilterDueUsersJs);

// Write to scripts/v2_workflow.js
fs.writeFileSync('scripts/v2_workflow.js', code, 'utf8');
console.log('Successfully applied dark templates to scripts/v2_workflow.js');
