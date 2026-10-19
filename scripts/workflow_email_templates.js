const fs = require('fs');

// We test the shared email templates generator
function getSharedEmailTemplatesJs() {
  return `
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
}

module.exports = { getSharedEmailTemplatesJs };
