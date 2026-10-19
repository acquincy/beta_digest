import { workflow, node, trigger, ifElse, newCredential } from '@n8n/workflow-sdk';

// -------------------------------------------------------------
// SHARED EMAIL TEMPLATES GENERATOR (DARK THEME & SAFE LINKS)
// -------------------------------------------------------------
const SHARED_EMAIL_TEMPLATES_JS = `
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const APP_BASE_URL = 'https://betadigest.online';
const LOGO_URL = 'https://betadigest.online/logo-transparent.png';

function renderBulletproofButton(buttonText, buttonUrl, width) {
  const w = width || 220;
  const safeUrl = escapeHtml(buttonUrl);
  const safeText = escapeHtml(buttonText);
  return '<!--[if mso]>' +
    '<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="' + safeUrl + '" style="height:48px;v-text-anchor:middle;width:' + w + 'px;" arcsize="50%" stroke="f" fillcolor="#ffffff">' +
    '<w:anchorlock/>' +
    '<center style="color:#0a0a0a;font-family:-apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:600;">' +
    safeText +
    '</center>' +
    '</v:roundrect>' +
    '<![endif]-->' +
    '<!--[if !mso]><!-- -->' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">' +
    '  <tr>' +
    '    <td align="center" bgcolor="#ffffff" style="border-radius: 9999px; background-color: #ffffff; padding: 0;">' +
    '      <a href="' + safeUrl + '" target="_blank" style="display: inline-block; padding: 13px 32px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #0a0a0a !important; text-decoration: none; border-radius: 9999px; line-height: 1.2; text-align: center; border: 1px solid #ffffff;">' +
    safeText +
    '      </a>' +
    '    </td>' +
    '  </tr>' +
    '</table>' +
    '<!--<![endif]-->';
}

function renderBaseLayout(opts) {
  const title = opts.title || 'Beta Digest';
  const preheader = opts.preheader || '';
  const contentHtml = opts.contentHtml || '';
  const showUnsubscribe = Boolean(opts.showUnsubscribe);
  const dashboardUrl = APP_BASE_URL + '/dashboard';
  const preferencesUrl = APP_BASE_URL + '/preferences';

  return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\\n' +
'<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\\n' +
'<head>\\n' +
'  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\\n' +
'  <meta name="color-scheme" content="dark light" />\\n' +
'  <meta name="supported-color-schemes" content="dark light" />\\n' +
'  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />\\n' +
'  <meta name="x-apple-disable-message-reformatting" />\\n' +
'  <title>' + escapeHtml(title) + '</title>\\n' +
'  <!--[if mso]>\\n' +
'  <noscript>\\n' +
'    <xml>\\n' +
'      <o:OfficeDocumentSettings>\\n' +
'        <o:PixelsPerInch>96</o:PixelsPerInch>\\n' +
'      </o:OfficeDocumentSettings>\\n' +
'    </xml>\\n' +
'  </noscript>\\n' +
'  <![endif]-->\\n' +
'  <style type="text/css">\\n' +
'    :root { color-scheme: dark light; supported-color-schemes: dark light; }\\n' +
'    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }\\n' +
'    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }\\n' +
'    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }\\n' +
'    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #0f0f12 !important; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\\n' +
'    @media only screen and (max-width: 600px) {\\n' +
'      .email-container { width: 100% !important; max-width: 100% !important; }\\n' +
'      .email-card-cell { padding: 30px 20px !important; }\\n' +
'      .mobile-column-stack { display: block !important; width: 100% !important; box-sizing: border-box !important; }\\n' +
'      .mobile-metric-half { display: block !important; width: 100% !important; padding-right: 0 !important; padding-left: 0 !important; padding-bottom: 8px !important; }\\n' +
'      .mobile-text-center { text-align: center !important; }\\n' +
'    }\\n' +
'    @media (prefers-color-scheme: dark) {\\n' +
'      body, .email-bg { background-color: #0f0f12 !important; }\\n' +
'      .email-card { background-color: #141418 !important; border-color: #26262f !important; }\\n' +
'    }\\n' +
'  </style>\\n' +
'</head>\\n' +
'<body bgcolor="#0f0f12" class="email-bg" style="margin: 0; padding: 0; background-color: #0f0f12; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">\\n' +
'  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; color: #0f0f12;">\\n' +
'    ' + escapeHtml(preheader) + '\\n' +
'    &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;\\n' +
'  </div>\\n' +
'  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0f0f12" class="email-bg" style="background-color: #0f0f12; table-layout: fixed;">\\n' +
'    <tr>\\n' +
'      <td align="center" style="padding: 40px 16px 48px;">\\n' +
'        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%;">\\n' +
'          <tr>\\n' +
'            <td align="left">\\n' +
'              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#141418" class="email-card" style="background-color: #141418; border: 1px solid #26262f; border-radius: 20px; box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.5);">\\n' +
'                <tr>\\n' +
'                  <td class="email-card-cell" style="padding: 40px 36px;">\\n' +
'                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">\\n' +
'                      <tr>\\n' +
'                        <td valign="middle" style="vertical-align: middle;">\\n' +
'                          <a href="' + dashboardUrl + '" target="_blank" style="text-decoration: none;">\\n' +
'                            <img src="' + LOGO_URL + '" width="32" height="32" alt="BetaDigest Logo" style="display: block; width: 32px; height: 32px; border: 0;" />\\n' +
'                          </a>\\n' +
'                        </td>\\n' +
'                        <td valign="middle" style="vertical-align: middle; padding-left: 10px;">\\n' +
'                          <a href="' + dashboardUrl + '" target="_blank" style="text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; color: #ededed; line-height: 1;">\\n' +
'                            BetaDigest\\n' +
'                          </a>\\n' +
'                        </td>\\n' +
'                      </tr>\\n' +
'                    </table>\\n' +
'                    ' + contentHtml + '\\n' +
'                  </td>\\n' +
'                </tr>\\n' +
'              </table>\\n' +
'              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 28px;">\\n' +
'                <tr>\\n' +
'                  <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #787885; text-align: center;">\\n' +
'                    <span style="color: #9292a0; font-weight: 500;">Beta Digest</span> &bull; \\n' +
'                    <a href="' + dashboardUrl + '" target="_blank" style="color: #9292a0; text-decoration: underline;">Dashboard</a>\\n' +
                    (showUnsubscribe
                      ? '<br /><a href="' + preferencesUrl + '" target="_blank" style="color: #787885; text-decoration: underline; font-size: 11px;">Manage preferences or unsubscribe</a>'
                      : '') +
'                  </td>\\n' +
'                </tr>\\n' +
'              </table>\\n' +
'            </td>\\n' +
'          </tr>\\n' +
'        </table>\\n' +
'      </td>\\n' +
'    </tr>\\n' +
'  </table>\\n' +
'</body>\\n' +
'</html>';
}

function renderVerificationEmail(opts) {
  const verificationUrl = opts.verificationUrl;
  const subject = 'Confirm your email';
  const preheader = 'Confirm your email address to activate your Beta Digest account.';
  const safeUrl = escapeHtml(verificationUrl);

  const contentHtml = '<h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">Confirm your email</h1>' +
    '<p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">Please confirm your email address to complete your registration and activate your personal morning briefing.</p>' +
    '<div style="margin: 32px 0 28px; text-align: center;">' +
    renderBulletproofButton('Verify email', verificationUrl, 200) +
    '</div>' +
    '<p style="margin: 0 0 28px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #787885; text-align: center;">' +
    'Having trouble? <a href="' + safeUrl + '" target="_blank" style="color: #8a7cfb; text-decoration: underline;">Open the link in your browser</a>' +
    '</p>' +
    '<div style="border-top: 1px solid #26262f; padding-top: 20px; margin-top: 28px;">' +
    '<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">If you didn\\'t create a Beta Digest account, you can safely ignore this email.</p>' +
    '</div>';

  const html = renderBaseLayout({ title: subject, preheader, contentHtml, showUnsubscribe: false });
  const text = 'Confirm your email\\n\\nPlease confirm your email address to complete your registration and activate your personal morning briefing.\\n\\nVerify your email by clicking the link below:\\n' + verificationUrl + '\\n\\nIf you didn\\'t create a Beta Digest account, you can safely ignore this email.\\n\\nBeta Digest - https://betadigest.online/dashboard';

  return { subject, html, text };
}

function renderSignInEmail(opts) {
  const signInUrl = opts.signInUrl;
  const subject = 'Sign in to BetaDigest';
  const preheader = 'Click the button inside to securely sign in to BetaDigest.';
  const safeUrl = escapeHtml(signInUrl);

  const contentHtml = '<h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">Sign in to BetaDigest</h1>' +
    '<p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">Click the button below to sign in to your Beta Digest account on this device.</p>' +
    '<div style="margin: 32px 0 28px; text-align: center;">' +
    renderBulletproofButton('Sign in', signInUrl, 180) +
    '</div>' +
    '<p style="margin: 0 0 28px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #787885; text-align: center;">' +
    'Having trouble? <a href="' + safeUrl + '" target="_blank" style="color: #8a7cfb; text-decoration: underline;">Open the link in your browser</a>' +
    '</p>' +
    '<div style="border-top: 1px solid #26262f; padding-top: 20px; margin-top: 28px;">' +
    '<p style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">This single-use link expires in 15 minutes.</p>' +
    '<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">If this wasn\\'t you, you can safely ignore this email.</p>' +
    '</div>';

  const html = renderBaseLayout({ title: subject, preheader, contentHtml, showUnsubscribe: false });
  const text = 'Sign in to BetaDigest\\n\\nClick the link below to sign in to your Beta Digest account on this device:\\n' + signInUrl + '\\n\\nThis single-use link expires in 15 minutes.\\nIf this wasn\\'t you, you can safely ignore this email.\\n\\nBeta Digest - https://betadigest.online/dashboard';

  return { subject, html, text };
}

function renderWelcomeEmail(opts) {
  const name = opts.name || 'there';
  const city = opts.city || 'your city';
  const sendTime = opts.sendTime || '07:00';
  const subject = 'Welcome to Beta Digest';
  const preheader = 'Your account is active. Your daily briefing is scheduled.';
  const dashboardUrl = APP_BASE_URL + '/dashboard';

  const contentHtml = '<h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">Welcome to Beta Digest</h1>' +
    '<p style="margin: 0 0 18px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">Hi ' + escapeHtml(name) + ', your email has been confirmed and your account is now fully set up.</p>' +
    '<p style="margin: 0 0 32px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">We will deliver your personalized forecast for <strong style="color: #ededed;">' + escapeHtml(city) + '</strong> and curated stories every morning at <strong style="color: #ededed;">' + escapeHtml(sendTime) + '</strong>.</p>' +
    '<div style="margin: 32px 0 28px; text-align: center;">' +
    renderBulletproofButton('Open your dashboard', dashboardUrl, 220) +
    '</div>' +
    '<div style="border-top: 1px solid #26262f; padding-top: 20px; margin-top: 28px;">' +
    '<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #787885;">You can adjust your selected news topics, weather details, or delivery time at any moment in your preferences.</p>' +
    '</div>';

  const html = renderBaseLayout({ title: subject, preheader, contentHtml, showUnsubscribe: true });
  const text = 'Welcome to Beta Digest\\n\\nHi ' + name + ', your email has been confirmed and your account is now fully set up.\\n\\nWe will deliver your personalized forecast for ' + city + ' and curated stories every morning at ' + sendTime + '.\\n\\nOpen your dashboard:\\n' + dashboardUrl + '\\n\\nYou can adjust your selected news topics, weather details, or delivery time at any moment in your preferences.\\n\\nBeta Digest - https://betadigest.online/dashboard';

  return { subject, html, text };
}

function renderDailyDigestEmail(opts) {
  const firstName = opts.firstName || 'Reader';
  const city = opts.city || 'your city';
  const countryCode = opts.countryCode || '';
  const condition = opts.condition || 'Partly Cloudy';
  const temp = (opts.temp !== undefined && opts.temp !== null) ? opts.temp : 21;
  const tempUnit = opts.tempUnit || '°C';
  const high = (opts.high !== undefined && opts.high !== null) ? opts.high : 24;
  const low = (opts.low !== undefined && opts.low !== null) ? opts.low : 16;
  const metrics = opts.selectedWeatherMetrics || [];
  const articles = opts.articles || [];

  const locationLabel = countryCode ? (city + ', ' + countryCode) : city;
  const subject = 'Your Beta Digest for ' + city;
  const preheader = 'Good day, ' + firstName + '. Today in ' + city + ': ' + condition + ', ' + temp + tempUnit + '. Top stories inside.';
  const dashboardUrl = APP_BASE_URL + '/dashboard';
  const preferencesUrl = APP_BASE_URL + '/preferences';

  let weatherMetricsHtml = '';
  if (metrics.length > 0) {
    let rows = '';
    for (let i = 0; i < metrics.length; i += 2) {
      const m1 = metrics[i];
      const m2 = metrics[i + 1];
      const col1 = '<td width="' + (m2 ? '50%' : '100%') + '" valign="top" class="mobile-metric-half" style="padding: 4px;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1f202b" style="background-color: #1f202b; border: 1px solid #2f3040; border-radius: 12px; padding: 10px 14px;">' +
        '<tr><td style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8a7cfb;">' + escapeHtml(m1.label) + '</td></tr>' +
        '<tr><td style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; font-weight: 600; color: #ffffff; padding-top: 3px;">' + escapeHtml(m1.value) + '</td></tr>' +
        '</table></td>';
      const col2 = m2 ? ('<td width="50%" valign="top" class="mobile-metric-half" style="padding: 4px;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1f202b" style="background-color: #1f202b; border: 1px solid #2f3040; border-radius: 12px; padding: 10px 14px;">' +
        '<tr><td style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8a7cfb;">' + escapeHtml(m2.label) + '</td></tr>' +
        '<tr><td style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; font-weight: 600; color: #ffffff; padding-top: 3px;">' + escapeHtml(m2.value) + '</td></tr>' +
        '</table></td>') : '';
      rows += '<tr>' + col1 + col2 + '</tr>';
    }
    weatherMetricsHtml = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 14px;">' + rows + '</table>';
  }

  let articlesHtml = '';
  for (let idx = 0; idx < articles.length; idx++) {
    const art = articles[idx];
    const numStr = String(idx + 1).padStart(2, '0');
    const topicLabel = art.topicLabel || String(art.category || 'General').toUpperCase();
    articlesHtml += '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1a1a22" style="background-color: #1a1a22; border: 1px solid #282834; border-radius: 16px; margin-bottom: 12px;">' +
      '<tr><td style="padding: 18px 20px;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">' +
      '<tr>' +
      '<td valign="middle" style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; color: #787885; padding-right: 8px;">' + numStr + '</td>' +
      '<td valign="middle"><span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; background-color: #242533; border: 1px solid #36384a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; line-height: 1;">' + escapeHtml(topicLabel) + '</span></td>' +
      '<td valign="middle" style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #787885; padding-left: 8px;">&bull; ' + escapeHtml(art.source || 'Beta Digest Wire') + '</td>' +
      '</tr></table>' +
      '<h3 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; line-height: 1.4; color: #ffffff;">' + escapeHtml(art.title) + '</h3>' +
      '<p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; line-height: 1.55; color: #b4b4bb;">' + escapeHtml(art.summary) + '</p>' +
      '<div><a href="' + escapeHtml(art.url || dashboardUrl) + '" target="_blank" style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 500; color: #ffffff; text-decoration: none;">Read full story <span style="color: #8a7cfb; font-size: 14px;">&rarr;</span></a></div>' +
      '</td></tr></table>';
  }

  const contentHtml = '<h1 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #ffffff; letter-spacing: -0.025em;">Good day, ' + escapeHtml(firstName) + '.</h1>' +
    '<p style="margin: 0 0 24px; font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #b4b4bb;">Here is your curated briefing for today in <strong style="color: #ededed;">' + escapeHtml(locationLabel) + '</strong>.</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1a1a22" style="background-color: #1a1a22; border: 1px solid #282834; border-radius: 16px; margin-bottom: 28px;">' +
    '<tr><td style="padding: 20px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">' +
    '<tr>' +
    '<td valign="top" align="left">' +
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #8a7cfb; margin-bottom: 4px;">' + escapeHtml(locationLabel) + '</div>' +
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 600; color: #ffffff; text-transform: capitalize; margin-bottom: 4px;">' + escapeHtml(condition) + '</div>' +
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 12.5px; color: #a1a1aa;">H: <strong style="color: #ededed;">' + high + '°</strong> &bull; L: <strong style="color: #ededed;">' + low + '°</strong></div>' +
    '</td>' +
    '<td valign="top" align="right" style="text-align: right;">' +
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 38px; font-weight: 700; color: #ffffff; line-height: 1; letter-spacing: -0.03em;">' + temp + tempUnit + '</div>' +
    '</td>' +
    '</tr></table>' +
    weatherMetricsHtml +
    '</td></tr></table>' +
    '<div style="margin-bottom: 12px;">' +
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \\'Segoe UI\\', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8a7cfb; margin-bottom: 12px;">Curated Stories (' + articles.length + ')</div>' +
    articlesHtml +
    '</div>' +
    '<div style="margin: 32px 0 16px; text-align: center;">' +
    renderBulletproofButton('Open your dashboard', dashboardUrl, 220) +
    '</div>';

  const html = renderBaseLayout({ title: subject, preheader, contentHtml, showUnsubscribe: true });

  const textArticles = articles.map((a, i) => '[' + String(i + 1).padStart(2, '0') + '] ' + a.title + '\\n(' + (a.source || 'Beta Digest Wire') + ')\\n' + a.summary + '\\n' + a.url + '\\n').join('\\n');
  const textMetrics = metrics.map(m => '  - ' + m.label + ': ' + m.value).join('\\n');
  const text = 'Good day, ' + firstName + '.\\n\\nBeta Digest for ' + locationLabel + '\\nCurrent: ' + temp + tempUnit + ', ' + condition + ' (High: ' + high + '° / Low: ' + low + '°)\\n' + (textMetrics ? '\\nSelected details:\\n' + textMetrics + '\\n' : '') + '\\nCurated stories:\\n' + textArticles + '\\n\\nOpen your dashboard:\\n' + dashboardUrl + '\\n\\nManage preferences or unsubscribe:\\n' + preferencesUrl + '\\n\\nBeta Digest - https://betadigest.online/dashboard';

  return { subject, html, text };
}
`;


// -------------------------------------------------------------
// 1. CONFIG & SIGNUP
// -------------------------------------------------------------
const wh_signup = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: POST /v2/auth/signup',
    parameters: {
      httpMethod: 'POST',
      path: 'v2/auth/signup',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const config_signup = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Config: Signup Base URL',
    parameters: {
      mode: 'manual',
      fields: {
        values: [
          {
            name: 'APP_BASE_URL',
            stringValue: 'https://betadigest.online'
          }
        ]
      },
      includeOtherFields: true
    }
  }
});

const code_validate_signup = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Validate & Prepare Signup',
    parameters: {
      jsCode: `
${SHARED_EMAIL_TEMPLATES_JS}

function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  let k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength) | 0;
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

function generateHexToken(len) {
  let res = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < (len || 64); i++) {
    res += chars[Math.floor(Math.random() * 16)];
  }
  return res;
}

const input = $input.first()?.json || {};
const body = input.body || input;

const rawEmail = (body.email || '').trim().toLowerCase();
if (!rawEmail || !rawEmail.includes('@') || rawEmail.length < 5) {
  return [{ json: { error: 'invalid_email', email: '' } }];
}

const rawToken = generateHexToken(64);
const tokenHash = sha256(rawToken);
const now = new Date();
const expiresAt24h = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const expiresAt15m = new Date(now.getTime() + 15 * 60 * 1000).toISOString();

const appBaseUrl = $('Config: Signup Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const verificationUrl = appBaseUrl + '/verify?token=' + rawToken;

const renderedVerification = renderVerificationEmail({ verificationUrl });
const renderedSignIn = renderSignInEmail({ signInUrl: verificationUrl });

return [{\n  json: {
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
}];
`
    }
  }
});

const if_valid_signup_email = ifElse({
  version: 2.2,
  config: {
    name: 'Valid Email Provided?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c1',
            leftValue: '={{ Boolean($json.email && !$json.error) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const respond_signup_invalid = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Signup Invalid',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "error", success: false, message: "Valid email is required" }) }}',
      options: { responseCode: 400 }
    }
  }
});

const supa_lookup_signup_user = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Lookup Signup Email',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'users',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          {
            keyName: 'email',
            condition: 'eq',
            keyValue: '={{ $json.email }}'
          }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const code_determine_signup_action = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Determine Signup Action',
    parameters: {
      jsCode: `
const prep = $('Validate & Prepare Signup').first()?.json || {};
const existingUser = $input.first()?.json?.id ? $input.first().json : null;

let action = 'new_user';
const now = Date.now();

if (existingUser) {
  const lastSent = existingUser.last_link_sent_at ? new Date(existingUser.last_link_sent_at).getTime() : 0;
  if (now - lastSent < 60 * 1000) {
    action = 'cooldown';
  } else if (existingUser.verified === true || existingUser.is_verified === true) {
    action = 'verified_login';
  } else {
    action = 'unverified_refresh';
  }
}

return [{
  json: {
    ...prep,
    existingUserId: existingUser?.id || null,
    action,
    effectiveExpiresAt: action === 'verified_login' ? prep.expiresAt15m : prep.expiresAt24h
  }
}];
`
    }
  }
});

const if_signup_action_new = ifElse({
  version: 2.2,
  config: {
    name: 'Signup: Is New User?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c2',
            leftValue: '={{ Boolean($json.action === "new_user") }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const supa_create_user = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Create New User',
    parameters: {
      resource: 'row',
      operation: 'create',
      tableId: 'users',
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'email', fieldValue: '={{ $json.email }}' },
          { fieldId: 'name', fieldValue: '={{ $json.name }}' },
          { fieldId: 'city', fieldValue: '={{ $json.city }}' },
          { fieldId: 'country_code', fieldValue: '={{ $json.country_code }}' },
          { fieldId: 'news_categories', fieldValue: '={{ $json.news_categories }}' },
          { fieldId: 'weather_categories', fieldValue: '={{ $json.weather_categories }}' },
          { fieldId: 'send_time', fieldValue: '={{ $json.send_time }}' },
          { fieldId: 'verification_token', fieldValue: '={{ $json.tokenHash }}' },
          { fieldId: 'token_expires_at', fieldValue: '={{ $json.expiresAt24h }}' },
          { fieldId: 'last_link_sent_at', fieldValue: '={{ new Date().toISOString() }}' },
          { fieldId: 'is_verified', fieldValue: '={{ false }}' },
          { fieldId: 'verified', fieldValue: '={{ false }}' },
          { fieldId: 'onboarding_completed', fieldValue: '={{ false }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const if_signup_action_verified = ifElse({
  version: 2.2,
  config: {
    name: 'Signup: Is Verified Login?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c3',
            leftValue: '={{ Boolean($json.action === "verified_login") }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const supa_update_login_token = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Set Login Token',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'users',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'email', condition: 'eq', keyValue: '={{ $json.email }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'verification_token', fieldValue: '={{ $json.tokenHash }}' },
          { fieldId: 'token_expires_at', fieldValue: '={{ $json.expiresAt15m }}' },
          { fieldId: 'last_link_sent_at', fieldValue: '={{ new Date().toISOString() }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const supa_update_refresh_token = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Refresh Verification Token',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'users',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'email', condition: 'eq', keyValue: '={{ $json.email }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'verification_token', fieldValue: '={{ $json.tokenHash }}' },
          { fieldId: 'token_expires_at', fieldValue: '={{ $json.expiresAt24h }}' },
          { fieldId: 'last_link_sent_at', fieldValue: '={{ new Date().toISOString() }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const resend_send_verification = node({
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
});

const resend_send_login_link = node({
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
});

const respond_signup_generic_success = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Signup Generic Success',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "success", success: true, message: "If valid, a link has been dispatched." }) }}',
      options: { responseCode: 200 }
    }
  }
});

// -------------------------------------------------------------
// 2. POST /v2/auth/verify
// -------------------------------------------------------------
const wh_verify = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: POST /v2/auth/verify',
    parameters: {
      httpMethod: 'POST',
      path: 'v2/auth/verify',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const code_hash_verify_token = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Hash Verify Input Token',
    parameters: {
      jsCode: `
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  let k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength) | 0;
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

function generateHexToken(len) {
  let res = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < (len || 64); i++) {
    res += chars[Math.floor(Math.random() * 16)];
  }
  return res;
}

const input = $input.first()?.json || {};
const body = input.body || input;

const rawToken = String(body.token || '').trim();
const sessionHash = String(body.session_token_hash || '').trim();
const userAgent = String(body.user_agent || '').slice(0, 500);

if (!rawToken || !sessionHash) {
  return [{ json: { error: 'missing_params', tokenHash: '', sessionHash: '' } }];
}

const tokenHash = sha256(rawToken);
return [{
  json: {
    error: null,
    rawToken,
    tokenHash,
    sessionHash,
    userAgent
  }
}];
`
    }
  }
});

const if_verify_params_valid = ifElse({
  version: 2.2,
  config: {
    name: 'Verify: Params Present?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c4',
            leftValue: '={{ Boolean($json.tokenHash && $json.sessionHash) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const respond_verify_bad_params = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Verify Bad Params',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "error", success: false, error: "Invalid parameters" }) }}',
      options: { responseCode: 400 }
    }
  }
});

const supa_find_verify_token = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Find Verification Token',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'users',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'verification_token', condition: 'eq', keyValue: '={{ $json.tokenHash }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const if_verify_token_valid = ifElse({
  version: 2.2,
  config: {
    name: 'Verify: Token Valid & Not Expired?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c5',
            leftValue: '={{ Boolean($json.id && new Date($json.token_expires_at).getTime() > Date.now()) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const respond_verify_failure = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Verify Failure',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "error", success: false, error: "Invalid or expired verification token" }) }}',
      options: { responseCode: 400 }
    }
  }
});

const supa_mark_user_verified = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Mark User Verified',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'users',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'id', condition: 'eq', keyValue: '={{ $json.id }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'verified', fieldValue: '={{ true }}' },
          { fieldId: 'is_verified', fieldValue: '={{ true }}' },
          { fieldId: 'verification_token', fieldValue: '={{ null }}' },
          { fieldId: 'token_expires_at', fieldValue: '={{ null }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const supa_insert_verified_session = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Insert Verified Session',
    parameters: {
      resource: 'row',
      operation: 'create',
      tableId: 'user_sessions',
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'user_id', fieldValue: '={{ $("Supabase: Find Verification Token").first()?.json?.id }}' },
          { fieldId: 'token_hash', fieldValue: '={{ $("Hash Verify Input Token").first()?.json?.sessionHash }}' },
          { fieldId: 'expires_at', fieldValue: '={{ new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() }}' },
          { fieldId: 'user_agent', fieldValue: '={{ $("Hash Verify Input Token").first()?.json?.userAgent }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});


const code_prepare_welcome = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Welcome Email',
    parameters: {
      jsCode: `
${SHARED_EMAIL_TEMPLATES_JS}

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
`
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

const respond_verify_success = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Verify Success',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "success", success: true, onboarding_completed: Boolean($("Supabase: Find Verification Token").first()?.json?.onboarding_completed) }) }}',
      options: { responseCode: 200 }
    }
  }
});

// -------------------------------------------------------------
// 3. POST /v2/session/resolve
// -------------------------------------------------------------
const wh_session_resolve = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: POST /v2/session/resolve',
    parameters: {
      httpMethod: 'POST',
      path: 'v2/session/resolve',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const supa_lookup_session = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Lookup Session',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'user_sessions',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'token_hash', condition: 'eq', keyValue: '={{ ($json.body?.session_token_hash || $json.session_token_hash) }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const if_session_record_active = ifElse({
  version: 2.2,
  config: {
    name: 'Session: Active & Not Expired?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c6',
            leftValue: '={{ Boolean($json.id && !$json.revoked_at && new Date($json.expires_at).getTime() > Date.now()) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const supa_fetch_user_for_session = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Fetch Session User',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'users',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'id', condition: 'eq', keyValue: '={{ $json.user_id }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const code_check_user_verified_and_touch = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check User Verified & Touch Session',
    parameters: {
      jsCode: `
const user = $input.first()?.json || {};
const session = $('Supabase: Lookup Session').first()?.json || {};

const isUserVerified = Boolean(user.verified || user.is_verified);
if (!user.id || !isUserVerified) {
  return [{ json: { valid: false } }];
}

// Touch session last_seen_at if older than 1 hour
const now = Date.now();
const lastSeen = session.last_seen_at ? new Date(session.last_seen_at).getTime() : 0;
const needsTouch = (now - lastSeen) >= 60 * 60 * 1000;

return [{
  json: {
    valid: true,
    sessionId: session.id,
    needsTouch,
    onboarding_completed: Boolean(user.onboarding_completed)
  }
}];
`
    }
  }
});

const if_session_user_verified = ifElse({
  version: 2.2,
  config: {
    name: 'Session: User Verified?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c7',
            leftValue: '={{ Boolean($json.valid) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const if_session_needs_touch = ifElse({
  version: 2.2,
  config: {
    name: 'Session: Needs Touch?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c7_touch',
            leftValue: '={{ Boolean($json.needsTouch) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const supa_touch_session = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Touch Session Expiry',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'user_sessions',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'id', condition: 'eq', keyValue: '={{ $json.sessionId }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'last_seen_at', fieldValue: '={{ new Date().toISOString() }}' },
          { fieldId: 'expires_at', fieldValue: '={{ new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const respond_session_valid = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Session Valid',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ valid: true, onboarding_completed: Boolean($("Check User Verified & Touch Session").first()?.json?.onboarding_completed) }) }}',
      options: { responseCode: 200 }
    }
  }
});

const respond_session_401 = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Session 401',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ valid: false }) }}',
      options: { responseCode: 401 }
    }
  }
});

// -------------------------------------------------------------
// 4. POST /v2/user/preferences
// -------------------------------------------------------------
const wh_preferences = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: POST /v2/user/preferences',
    parameters: {
      httpMethod: 'POST',
      path: 'v2/user/preferences',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const code_sanitize_preferences = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Sanitize Preferences Input',
    parameters: {
      jsCode: `
const input = $input.first()?.json || {};
const body = input.body || input;

const sessionHash = String(body.session_token_hash || '').trim();

return [{
  json: {
    sessionHash
  }
}];
`
    }
  }
});

const supa_lookup_session_for_prefs = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Lookup Session for Prefs',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'user_sessions',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'token_hash', condition: 'eq', keyValue: '={{ $json.sessionHash }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const if_prefs_session_active = ifElse({
  version: 2.2,
  config: {
    name: 'Prefs: Session Active?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c8',
            leftValue: '={{ Boolean($json.id && !$json.revoked_at && new Date($json.expires_at).getTime() > Date.now()) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const supa_fetch_user_for_prefs = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Fetch User For Prefs',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'users',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'id', condition: 'eq', keyValue: '={{ $("Supabase: Lookup Session for Prefs").first()?.json?.user_id }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const code_merge_preferences = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Merge Preferences Input',
    parameters: {
      jsCode: `
const rawWh = $('Webhook: POST /v2/user/preferences').first()?.json || {};
const body = rawWh.body || rawWh;
const fetchedUser = $('Supabase: Fetch User For Prefs').first()?.json;
const sessionRow = $('Supabase: Lookup Session for Prefs').first()?.json || {};
const existingUser = (fetchedUser && fetchedUser.id) ? fetchedUser : ($input.first()?.json || {});

const userId = existingUser.id || sessionRow.user_id;

// Merge news categories: if provided in request, use & limit to 5; otherwise preserve existing
let news = Array.isArray(body.news_categories)
  ? body.news_categories.filter(c => typeof c === 'string').slice(0, 5)
  : Array.isArray(body.categories)
  ? body.categories.filter(c => typeof c === 'string').slice(0, 5)
  : (Array.isArray(existingUser.news_categories) && existingUser.news_categories.length > 0
      ? existingUser.news_categories
      : ['technology', 'economy', 'science']);

// Merge weather categories: if provided in request, use & limit to 3; otherwise preserve existing
let weather = Array.isArray(body.weather_categories)
  ? body.weather_categories.filter(c => typeof c === 'string').slice(0, 3)
  : (Array.isArray(existingUser.weather_categories) && existingUser.weather_categories.length > 0
      ? existingUser.weather_categories
      : ['current-temperature', 'rain-chance', 'uv-index']);

// Ensure at least 1 total topic selected
if (news.length === 0 && weather.length === 0) {
  news = ['technology', 'economy', 'science'];
  weather = ['current-temperature', 'rain-chance', 'uv-index'];
}

// Preserve existing city: strictly preserve existingUser.city; never overwrite with Seattle fallback
let city = existingUser.city || null;
if (typeof body.city === 'string' && body.city.trim().length >= 2 && body.city.trim().length <= 60 && body.city.trim() !== 'Seattle') {
  city = body.city.trim();
} else if (typeof body.city === 'string' && body.city.trim().length >= 2 && body.city.trim().length <= 60 && !existingUser.city) {
  city = body.city.trim();
}

// Preserve existing country_code: strictly preserve existingUser.country_code; never overwrite with US fallback
let countryCode = existingUser.country_code || null;
if (typeof body.country_code === 'string' && /^[A-Z]{2}$/i.test(body.country_code.trim()) && body.country_code.trim().toUpperCase() !== 'US') {
  countryCode = body.country_code.trim().toUpperCase();
} else if (typeof body.country_code === 'string' && /^[A-Z]{2}$/i.test(body.country_code.trim()) && !existingUser.country_code) {
  countryCode = body.country_code.trim().toUpperCase();
}

// Preserve existing send_time
let sendTime = existingUser.send_time || '07:00:00';
if (typeof body.send_time === 'string' && body.send_time.trim()) {
  const st = body.send_time.trim();
  if (/^\\d{1,2}:\\d{2}$/.test(st)) {
    sendTime = st.padStart(5, '0') + ':00';
  } else if (/^\\d{2}:\\d{2}:\\d{2}$/.test(st)) {
    sendTime = st;
  }
}

const resolvedCity = city || existingUser.city || $('Supabase: Fetch User For Prefs').first()?.json?.city || null;
const resolvedCountry = countryCode || existingUser.country_code || $('Supabase: Fetch User For Prefs').first()?.json?.country_code || null;

return [{
  json: {
    userId,
    city: resolvedCity,
    country_code: resolvedCountry,
    news_categories: news,
    weather_categories: weather,
    send_time: sendTime
  }
}];
`
    }
  }
});

const supa_update_user_prefs = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Update Preferences',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'users',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'id', condition: 'eq', keyValue: '={{ $json.userId }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'city', fieldValue: '={{ $json.city || $("Supabase: Fetch User For Prefs").first()?.json?.city }}' },
          { fieldId: 'country_code', fieldValue: '={{ $json.country_code || $("Supabase: Fetch User For Prefs").first()?.json?.country_code }}' },
          { fieldId: 'news_categories', fieldValue: '={{ $json.news_categories }}' },
          { fieldId: 'weather_categories', fieldValue: '={{ $json.weather_categories }}' },
          { fieldId: 'send_time', fieldValue: '={{ $json.send_time }}' },
          { fieldId: 'onboarding_completed', fieldValue: '={{ true }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const respond_prefs_success = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Prefs Success',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "success", success: true, message: "User preferences updated.", preferences: { city: $("Merge Preferences Input").first()?.json?.city, country_code: $("Merge Preferences Input").first()?.json?.country_code, news_categories: $("Merge Preferences Input").first()?.json?.news_categories, weather_categories: $("Merge Preferences Input").first()?.json?.weather_categories, send_time: $("Merge Preferences Input").first()?.json?.send_time } }) }}',
      options: { responseCode: 200 }
    }
  }
});

const respond_prefs_401 = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Prefs 401',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "error", message: "Unauthorized" }) }}',
      options: { responseCode: 401 }
    }
  }
});

// -------------------------------------------------------------
// 5. POST /v2/digest/dashboard
// -------------------------------------------------------------
const wh_dashboard = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: POST /v2/digest/dashboard',
    parameters: {
      httpMethod: 'POST',
      path: 'v2/digest/dashboard',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const supa_lookup_session_for_dash = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Lookup Session for Dashboard',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'user_sessions',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'token_hash', condition: 'eq', keyValue: '={{ ($json.body?.session_token_hash || $json.session_token_hash) }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const if_dash_session_active = ifElse({
  version: 2.2,
  config: {
    name: 'Dashboard: Session Active?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c9',
            leftValue: '={{ Boolean($json.id && !$json.revoked_at && new Date($json.expires_at).getTime() > Date.now()) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const supa_fetch_single_user = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Fetch Single User',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'users',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'id', condition: 'eq', keyValue: '={{ $json.user_id }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const http_fetch_weather = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: 'HTTP: Fetch Live Weather',
    parameters: {
      url: '={{ "https://wttr.in/" + encodeURIComponent($json.city || "Seattle") + "?format=j1" }}',
      options: { timeout: 8000 }
    },
    onError: 'continueRegularOutput'
  }
});

const http_fetch_news = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: 'HTTP: Fetch Live News',
    parameters: {
      url: 'https://api.spaceflightnewsapi.net/v4/articles/?limit=5',
      options: { timeout: 8000 }
    },
    onError: 'continueRegularOutput'
  }
});

const code_format_dashboard = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Format Dashboard JSON',
    parameters: {
      jsCode: `
const user = $('Supabase: Fetch Single User').first()?.json || {};

let rawWeather = $('HTTP: Fetch Live Weather').first()?.json || {};
if (typeof rawWeather.data === 'string') {
  try { rawWeather = JSON.parse(rawWeather.data); } catch (e) {}
}

let tempC = 22;
let feelsLikeC = 22;
let humidity = 60;
let windSpeedKmh = 12;
let condition = 'Partly cloudy';
let highC = 24;
let lowC = 16;
let rainChance = 10;

try {
  const current = rawWeather?.current_condition?.[0];
  const todayForecast = rawWeather?.weather?.[0];
  if (current) {
    tempC = Number(current.temp_C ?? tempC);
    feelsLikeC = Number(current.FeelsLikeC ?? feelsLikeC);
    humidity = Number(current.humidity ?? humidity);
    windSpeedKmh = Number(current.windspeedKmph ?? windSpeedKmh);
    condition = current.weatherDesc?.[0]?.value || condition;
  }
  if (todayForecast) {
    highC = Number(todayForecast.maxtempC ?? highC);
    lowC = Number(todayForecast.mintempC ?? lowC);
    const hourlyRain = todayForecast.hourly?.[4]?.chanceofrain;
    if (hourlyRain !== undefined) rainChance = Number(hourlyRain);
  }
} catch (e) {}

let rawNews = $('HTTP: Fetch Live News').first()?.json || {};
if (typeof rawNews.data === 'string') {
  try { rawNews = JSON.parse(rawNews.data); } catch (e) {}
}
const rawArticles = Array.isArray(rawNews?.results) ? rawNews.results : [];
const userNewsCategories = Array.isArray(user.news_categories) && user.news_categories.length > 0
  ? user.news_categories
  : ['technology', 'science', 'economy'];

const fallbackArticles = [
  {
    title: 'Next-Gen Renewable Grids Reach Record Efficiency Milestone',
    summary: 'Grid-scale battery storage and ultra-conductive interconnects have reduced peak transmission losses across major metropolitan regions.\\n\\nCivil engineering audits across five regional energy cooperatives recorded a 42% reduction in curtailment waste during high-demand summer periods. Municipal utility boards announced phased expansion schedules to integrate an additional 1,200 megawatts of distributed clean capacity into suburban substations by year end.',
    url: 'https://example.com/renewable-grids',
    source: 'Beta Digest Wire',
    published_at: new Date().toISOString(),
    category: userNewsCategories[0] || 'technology'
  },
  {
    title: 'Global Central Banks Signal Coordinated Digital Settlement Standards',
    summary: 'Cross-border instant settlement corridors are set to cut clearance turnaround from business days to sub-second finality for international commercial exchange.\\n\\nMonetary task forces from twelve central banks finalized shared ISO-compliant messaging standards designed to bypass costly intermediary routing. Institutional pilot transfers verified seamless liquidity balancing while eliminating foreign exchange settlement risk across cross-border wholesale corridors.',
    url: 'https://example.com/digital-settlement',
    source: 'Global Markets Review',
    published_at: new Date().toISOString(),
    category: userNewsCategories[1] || userNewsCategories[0] || 'economy'
  },
  {
    title: 'Deep-Ocean Autonomous Observatories Uncover New Thermal Currents',
    summary: 'Autonomous sensor fleets deployed across Atlantic abyssal trenches have detected stable, previously unmapped sub-surface thermal currents.\\n\\nOceanographic researchers utilizing deep-sea gliders recorded sub-surface convective plumes that directly influence continental seasonal weather patterns. The newly calibrated sensor arrays will transmit continuous salinity and temperature telemetry into global climate circulation models.',
    url: 'https://example.com/ocean-observatories',
    source: 'Science Daily Dispatch',
    published_at: new Date().toISOString(),
    category: userNewsCategories[2] || userNewsCategories[0] || 'science'
  },
  {
    title: 'Clinical Oncology Network Reports Sustained Targeted Therapy Success',
    summary: 'Multi-center clinical trials evaluating targeted molecular therapies demonstrated durable disease stabilization and favorable tolerability profiles across diverse cohorts.\\n\\nPrincipal investigators highlighted marked biomarker clearance within the initial eight weeks of intervention without requiring high-dose systemic immunosuppression. Health regulatory authorities are currently reviewing priority designation requests to accelerate clinical availability across regional cancer centers.',
    url: 'https://example.com/clinical-therapies',
    source: 'Health Research Review',
    published_at: new Date().toISOString(),
    category: userNewsCategories[3] || userNewsCategories[0] || 'health'
  },
  {
    title: 'Coastal Wetland Restoration Initiative Exceeds Resilience Targets',
    summary: 'Collaborative watershed restoration programs completed seventy kilometers of living shorelines designed to dampen storm surge energy and regenerate native biodiversity.\\n\\nEnvironmental monitoring teams documented rapid colonization by juvenile marine species alongside measurable water quality improvements across estuarine basins. Local coastal management commissions noted that natural mangrove and salt marsh buffers reduce seasonal flood mitigation expenses by nearly thirty percent.',
    url: 'https://example.com/coastal-restoration',
    source: 'Earth & Climate Dispatch',
    published_at: new Date().toISOString(),
    category: userNewsCategories[4] || userNewsCategories[0] || 'environment'
  }
];

const formattedArticles = (rawArticles.length >= 5 ? rawArticles : fallbackArticles).slice(0, 5).map((art, idx) => {
  const fallback = fallbackArticles[idx % fallbackArticles.length];
  const title = art.title || fallback.title;
  let summary = art.summary || fallback.summary;
  if (!summary || summary.length < 80) {
    summary = fallback.summary;
  }
  return {
    title,
    summary,
    url: art.url || fallback.url,
    source: art.news_site || art.source || fallback.source,
    published_at: art.published_at || new Date().toISOString(),
    category: userNewsCategories[idx % userNewsCategories.length] || 'general'
  };
});

return [{
  json: {
    user: {
      name: user.name || 'Reader',
      city: user.city || 'Seattle',
      country_code: user.country_code || 'US',
      news_categories: userNewsCategories,
      weather_categories: user.weather_categories || ['current-temperature', 'weather-condition', 'high-low'],
      send_time: user.send_time || '07:00:00',
      last_sent_date: user.last_sent_date || null
    },
    weather: {
      location: {
        city: user.city || 'Seattle',
        country: user.country_code || 'US'
      },
      current: {
        temperature_c: tempC,
        feels_like_c: feelsLikeC,
        condition,
        humidity_percent: humidity,
        wind_kph: windSpeedKmh,
        high_c: highC,
        low_c: lowC,
        rain_chance_percent: rainChance
      },
      selected_metrics: user.weather_categories || ['current-temperature', 'weather-condition', 'high-low'],
      summary: condition + ' in ' + (user.city || 'Seattle') + ' with a high of ' + highC + 'C and ' + rainChance + '% chance of rain.'
    },
    weekly_digest: {
      edition_date: new Date().toISOString().split('T')[0],
      categories: userNewsCategories,
      articles: formattedArticles
    },
    preferences: {
      news_categories: userNewsCategories,
      weather_categories: user.weather_categories || ['current-temperature', 'weather-condition', 'high-low'],
      send_time: user.send_time || '07:00:00',
      last_sent_date: user.last_sent_date || null
    },
    generated_at: new Date().toISOString()
  }
}];
`
    }
  }
});

const respond_dashboard_json = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Dashboard JSON',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify($json) }}',
      options: { responseCode: 200 }
    }
  }
});

const respond_dash_401 = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Dashboard 401',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "error", message: "Unauthorized" }) }}',
      options: { responseCode: 401 }
    }
  }
});

// -------------------------------------------------------------
// 6. POST /v2/auth/send-link
// -------------------------------------------------------------
const wh_send_link = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: POST /v2/auth/send-link',
    parameters: {
      httpMethod: 'POST',
      path: 'v2/auth/send-link',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const config_send_link = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Config: Send-Link Base URL',
    parameters: {
      mode: 'manual',
      fields: {
        values: [
          {
            name: 'APP_BASE_URL',
            stringValue: 'https://betadigest.online'
          }
        ]
      },
      includeOtherFields: true
    }
  }
});

const code_prepare_send_link = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Send-Link',
    parameters: {
      jsCode: `
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  let k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength) | 0;
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

function generateHexToken(len) {
  let res = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < (len || 64); i++) {
    res += chars[Math.floor(Math.random() * 16)];
  }
  return res;
}

const input = $input.first()?.json || {};
const body = input.body || input;

const rawEmail = (body.email || '').trim().toLowerCase();
if (!rawEmail || !rawEmail.includes('@') || rawEmail.length < 5) {
  return [{ json: { shouldProcess: false, email: '' } }];
}

const rawToken = generateHexToken(64);
const tokenHash = sha256(rawToken);
const now = new Date();
const expiresAt15m = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
const expiresAt24h = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

const appBaseUrl = $('Config: Send-Link Base URL').first()?.json?.APP_BASE_URL || 'https://betadigest.online';
const verificationUrl = appBaseUrl + '/verify?token=' + rawToken;

return [{\n  json: {
    shouldProcess: true,
    email: rawEmail,
    rawToken,
    tokenHash,
    expiresAt15m,
    expiresAt24h,
    verificationUrl
  }
}];
`
    }
  }
});

const supa_lookup_send_link_user = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Lookup User for Send-Link',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'users',
      returnAll: false,
      limit: 1,
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'email', condition: 'eq', keyValue: '={{ $json.email }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const code_determine_send_link_action = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Determine Send-Link Dispatch',
    parameters: {
      jsCode: `
${SHARED_EMAIL_TEMPLATES_JS}

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
`
    }
  }
});

const if_should_send_link = ifElse({
  version: 2.2,
  config: {
    name: 'Send-Link: Should Dispatch?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
        conditions: [
          {
            id: 'c10',
            leftValue: '={{ Boolean($json.shouldSend) }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true', singleValue: true }
          }
        ],
        combinator: 'and'
      }
    }
  }
});

const supa_update_send_link_token = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Update Token for Send-Link',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'users',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'id', condition: 'eq', keyValue: '={{ $json.userId }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'verification_token', fieldValue: '={{ $json.tokenHash }}' },
          { fieldId: 'token_expires_at', fieldValue: '={{ $json.expiresAt }}' },
          { fieldId: 'last_link_sent_at', fieldValue: '={{ new Date().toISOString() }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const resend_dispatch_send_link = node({
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
});

const respond_send_link_generic = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Send-Link Generic',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "success", success: true, message: "If that email is registered, a sign-in link has been sent." }) }}',
      options: { responseCode: 200 }
    }
  }
});

// -------------------------------------------------------------
// 7. POST /v2/auth/logout
// -------------------------------------------------------------
const wh_logout = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: POST /v2/auth/logout',
    parameters: {
      httpMethod: 'POST',
      path: 'v2/auth/logout',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const supa_revoke_session = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Revoke Session',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'user_sessions',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'token_hash', condition: 'eq', keyValue: '={{ ($json.body?.session_token_hash || $json.session_token_hash) }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'revoked_at', fieldValue: '={{ new Date().toISOString() }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const respond_logout_success = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Logout Success',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "success", success: true }) }}',
      options: { responseCode: 200 }
    }
  }
});

// -------------------------------------------------------------
// 8. HOURLY DIGEST SENDER
// -------------------------------------------------------------
const sched_hourly_digest = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  disabled: true,
  config: {
    name: 'Schedule Trigger: Hourly Digest',
    parameters: {
      rule: {
        interval: [{ field: 'hours' }]
      }
    }
  }
});

const wh_send_hourly = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webhook: GET /v2/digest/send-hourly',
    parameters: {
      httpMethod: 'GET',
      path: 'v2/digest/send-hourly',
      responseMode: 'responseNode',
      options: {}
    }
  }
});

const config_digest = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Config: Digest Base URL',
    parameters: {
      mode: 'manual',
      fields: {
        values: [
          {
            name: 'APP_BASE_URL',
            stringValue: 'https://betadigest.online'
          }
        ]
      },
      includeOtherFields: true
    }
  }
});

const supa_fetch_subscribers = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Fetch Subscribers',
    parameters: {
      resource: 'row',
      operation: 'getAll',
      tableId: 'users',
      returnAll: true
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const code_filter_due_users = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Filter Scheduled Users & Format Reminder',
    parameters: {
      jsCode: `
${SHARED_EMAIL_TEMPLATES_JS}

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
const dashboardUrl = appBaseUrl.replace(/\/+$/, '') + '/dashboard';
const preferencesUrl = appBaseUrl.replace(/\/+$/, '') + '/preferences';

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
      send_time: user.send_time || \`${paddedHour}:00:00\`,
      triggered_hour: targetHour,
      today_date: todayDate,
      dashboard_url: dashboardUrl,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text
    }
  };
});
`
    }
  }
});

const resend_send_digest = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
    name: 'Send Digest Email via Resend',
    parameters: {
      authentication: 'apiKey',
      from: 'Beta Digest <verify@betadigest.online>',
      to: '={{ $json.email }}',
      subject: '={{ $json.subject }}',
      html: '={{ $json.html }}',
      additionalOptions: {}
    },
    credentials: {
      resendApi: newCredential('SLVH Resend account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const supa_update_last_sent_date = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Update Last Sent Date',
    parameters: {
      resource: 'row',
      operation: 'update',
      tableId: 'users',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          {
            keyName: 'email',
            condition: 'eq',
            keyValue: "={{ $('Filter Scheduled Users & Format Reminder').item.json.email }}"
          }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          {
            fieldId: 'last_sent_date',
            fieldValue: "={{ $('Filter Scheduled Users & Format Reminder').item.json.today_date }}"
          }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const if_hourly_has_due_users = ifElse({
  name: 'Hourly: Anyone Due?',
  conditions: [
    {
      leftValue: '={{ Boolean($json.hasDueUsers) }}',
      operator: 'true',
      rightValue: true
    }
  ]
});

const respond_hourly_empty = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Hourly Empty',
    parameters: {
      respondWith: 'json',
      responseBody: '[]',
      options: {
        responseCode: 200
      }
    }
  }
});

const respond_hourly_sent = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Hourly Sent',
    parameters: {
      respondWith: 'json',
      responseBody: '={{ JSON.stringify({ status: "success", success: true, count: $input.all().length }) }}',
      options: {
        responseCode: 200
      }
    }
  }
});

// -------------------------------------------------------------
// 9. DAILY CLEANUP SCHEDULE (Inactive during testing)
// -------------------------------------------------------------
const sched_daily_cleanup = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  disabled: true,
  config: {
    name: 'Schedule Trigger: Daily Cleanup',
    parameters: {
      rule: {
        interval: [{ field: 'days' }]
      }
    }
  }
});

const code_cleanup_prep = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Prepare Cleanup Cutoffs',
    parameters: {
      jsCode: `
const now = Date.now();
const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

return [{
  json: {
    thirtyDaysAgo,
    sevenDaysAgo
  }
}];
`
    }
  }
});

const supa_cleanup_expired_sessions = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Delete Expired Sessions',
    parameters: {
      resource: 'row',
      operation: 'delete',
      tableId: 'user_sessions',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'expires_at', condition: 'lt', keyValue: '={{ $json.thirtyDaysAgo }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

const supa_cleanup_unverified_users = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
    name: 'Supabase: Delete Old Unverified Users',
    parameters: {
      resource: 'row',
      operation: 'delete',
      tableId: 'users',
      filterType: 'manual',
      matchType: 'allFilters',
      filters: {
        conditions: [
          { keyName: 'is_verified', condition: 'is', keyValue: 'false' },
          { keyName: 'created_at', condition: 'lt', keyValue: '={{ $("Prepare Cleanup Cutoffs").first()?.json?.sevenDaysAgo }}' }
        ]
      }
    },
    credentials: {
      supabaseApi: newCredential('SLVH Supabase account')
    },
    alwaysOutputData: true,
    onError: 'continueRegularOutput'
  }
});

// -------------------------------------------------------------
// WORKFLOW COMPOSITION
// -------------------------------------------------------------
export default workflow('beta-digest-v2', 'Beta Digest v2: Auth and Dashboard')
  // 1. Signup
  .add(wh_signup
    .to(config_signup)
    .to(code_validate_signup)
    .to(if_valid_signup_email
      .onFalse(respond_signup_invalid)
      .onTrue(supa_lookup_signup_user
        .to(code_determine_signup_action)
        .to(if_signup_action_new
          .onTrue(supa_create_user
            .to(resend_send_verification)
            .to(respond_signup_generic_success))
          .onFalse(if_signup_action_verified
            .onTrue(supa_update_login_token
              .to(resend_send_login_link)
              .to(respond_signup_generic_success))
            .onFalse(supa_update_refresh_token
              .to(resend_send_verification)
              .to(respond_signup_generic_success)))))))

  // 2. Verify
  .add(wh_verify
    .to(code_hash_verify_token)
    .to(if_verify_params_valid
      .onFalse(respond_verify_bad_params)
      .onTrue(supa_find_verify_token
        .to(if_verify_token_valid
          .onFalse(respond_verify_failure)
          .onTrue(supa_mark_user_verified
            .to(supa_insert_verified_session)
            .to(code_prepare_welcome)
            .to(resend_send_welcome)
            .to(respond_verify_success))))))

  // 3. Session resolve
  .add(wh_session_resolve
    .to(supa_lookup_session)
    .to(if_session_record_active
      .onFalse(respond_session_401)
      .onTrue(supa_fetch_user_for_session
        .to(code_check_user_verified_and_touch)
        .to(if_session_user_verified
          .onFalse(respond_session_401)
          .onTrue(if_session_needs_touch
            .onTrue(supa_touch_session.to(respond_session_valid))
            .onFalse(respond_session_valid))))))

  // 4. Preferences
  .add(wh_preferences
    .to(code_sanitize_preferences)
    .to(supa_lookup_session_for_prefs)
    .to(if_prefs_session_active
      .onFalse(respond_prefs_401)
      .onTrue(supa_fetch_user_for_prefs
        .to(code_merge_preferences)
        .to(supa_update_user_prefs)
        .to(respond_prefs_success))))

  // 5. Dashboard
  .add(wh_dashboard
    .to(supa_lookup_session_for_dash)
    .to(if_dash_session_active
      .onFalse(respond_dash_401)
      .onTrue(supa_fetch_single_user
        .to(http_fetch_weather)
        .to(http_fetch_news)
        .to(code_format_dashboard)
        .to(respond_dashboard_json))))

  // 6. Send Link
  .add(wh_send_link
    .to(config_send_link)
    .to(code_prepare_send_link)
    .to(supa_lookup_send_link_user)
    .to(code_determine_send_link_action)
    .to(if_should_send_link
      .onTrue(supa_update_send_link_token
        .to(resend_dispatch_send_link)
        .to(respond_send_link_generic))
      .onFalse(respond_send_link_generic)))

  // 7. Logout
  .add(wh_logout
    .to(supa_revoke_session)
    .to(respond_logout_success))

  // 8. Digest sender
  .add(sched_hourly_digest.to(config_digest))
  .add(wh_send_hourly.to(config_digest))
  .add(config_digest
    .to(supa_fetch_subscribers)
    .to(code_filter_due_users)
    .to(if_hourly_has_due_users
      .onFalse(respond_hourly_empty)
      .onTrue(resend_send_digest
        .to(supa_update_last_sent_date)
        .to(respond_hourly_sent))))


  // 9. Daily cleanup
  .add(sched_daily_cleanup
    .to(code_cleanup_prep)
    .to(supa_cleanup_expired_sessions)
    .to(supa_cleanup_unverified_users));
