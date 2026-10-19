const fs = require('fs');
const path = require('path');
const { getSharedEmailTemplatesJs } = require('./workflow_email_templates.js');

const sharedTemplatesJs = getSharedEmailTemplatesJs();

// Let's create the updated workflow code
let originalCode = fs.readFileSync('scripts/v2_workflow.js', 'utf8');

// 1. Add SHARED_EMAIL_TEMPLATES_JS right before code_validate_signup
const sharedCodeDeclaration = `
// -------------------------------------------------------------
// SHARED EMAIL TEMPLATES GENERATOR (DARK THEME & SAFE LINKS)
// -------------------------------------------------------------
const SHARED_EMAIL_TEMPLATES_JS = \`${sharedTemplatesJs.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
`;

// Let's check where code_validate_signup is
if (!originalCode.includes('SHARED_EMAIL_TEMPLATES_JS')) {
  originalCode = originalCode.replace('const code_validate_signup = node({', sharedCodeDeclaration + '\nconst code_validate_signup = node({');
}

// 2. Update code_validate_signup jsCode
// Replace the return statement in code_validate_signup
const oldSignupReturn = `const appBaseUrl = $('Config: Signup Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const verificationUrl = appBaseUrl + '/verify?token=' + rawToken;

return [{
  json: {
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

const newSignupReturn = `const appBaseUrl = $('Config: Signup Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const verificationUrl = appBaseUrl + '/verify?token=' + rawToken;

const renderedVerification = renderVerificationEmail({ verificationUrl });
const renderedSignIn = renderSignInEmail({ signInUrl: verificationUrl });

return [{
  json: {
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

// Make sure code_validate_signup includes SHARED_EMAIL_TEMPLATES_JS in its jsCode
const signupJsCodeStart = `    parameters: {
      jsCode: \``;
const newSignupJsCodeStart = `    parameters: {
      jsCode: \`
\${SHARED_EMAIL_TEMPLATES_JS}
`;

console.log('Replacing in code_validate_signup...');
// We will build a clean replace script
fs.writeFileSync('scripts/v2_workflow_updated.js', originalCode, 'utf8');
console.log('Saved preliminary file.');
