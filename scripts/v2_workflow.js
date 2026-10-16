import { workflow, node, trigger, ifElse, newCredential } from '@n8n/workflow-sdk';

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
    appBaseUrl
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
      subject: 'Verify your Beta Digest email',
      html: '=<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest Verification</p><h1 style="font-size: 24px; margin: 0 0 16px;">Confirm your email address</h1><p style="font-size: 15px; line-height: 1.6; color: #44403C;">Welcome to Beta Digest! Click the button below to verify your email address and finish setting up your personalized weather and news preferences.</p><p style="margin: 24px 0;"><a href="{{ $(\'Validate & Prepare Signup\').first()?.json?.verificationUrl }}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">Verify My Email</a></p><p style="font-size: 12px; color: #78716C;">Or copy this link: {{ $(\'Validate & Prepare Signup\').first()?.json?.verificationUrl }}</p></div>',
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
      subject: 'Sign in to Beta Digest',
      html: '=<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest Sign-In</p><h1 style="font-size: 24px; margin: 0 0 16px;">Sign in on this device</h1><p style="font-size: 15px; line-height: 1.6; color: #44403C;">Click the button below to securely sign in to your Beta Digest account. This single-use link expires in 15 minutes.</p><p style="margin: 24px 0;"><a href="{{ $(\'Validate & Prepare Signup\').first()?.json?.verificationUrl }}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">Sign In to Beta Digest</a></p><p style="font-size: 12px; color: #78716C;">Or copy this link: {{ $(\'Validate & Prepare Signup\').first()?.json?.verificationUrl }}</p></div>',
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

let city = String(body.city || '').trim();
if (!city || city.length < 2 || city.length > 60) city = 'Seattle';

let countryCode = String(body.country_code || '').trim().toUpperCase();
if (!/^[A-Z]{2}$/.test(countryCode)) countryCode = 'US';

let news = Array.isArray(body.news_categories) ? body.news_categories : [];
news = news.filter(c => typeof c === 'string').slice(0, 5);

let weather = Array.isArray(body.weather_categories) ? body.weather_categories : [];
weather = weather.filter(c => typeof c === 'string').slice(0, 3);

let sendTime = String(body.send_time || '').trim();
if (/^\\d{1,2}:\\d{2}$/.test(sendTime)) {
  sendTime = sendTime.padStart(5, '0') + ':00';
} else if (!/^\\d{2}:\\d{2}:\\d{2}$/.test(sendTime)) {
  sendTime = '07:00:00';
}

return [{
  json: {
    sessionHash,
    city,
    country_code: countryCode,
    news_categories: news,
    weather_categories: weather,
    send_time: sendTime
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
          { keyName: 'id', condition: 'eq', keyValue: '={{ $json.user_id }}' }
        ]
      },
      dataToSend: 'defineBelow',
      fieldsUi: {
        fieldValues: [
          { fieldId: 'city', fieldValue: '={{ $("Sanitize Preferences Input").first()?.json?.city }}' },
          { fieldId: 'country_code', fieldValue: '={{ $("Sanitize Preferences Input").first()?.json?.country_code }}' },
          { fieldId: 'news_categories', fieldValue: '={{ $("Sanitize Preferences Input").first()?.json?.news_categories }}' },
          { fieldId: 'weather_categories', fieldValue: '={{ $("Sanitize Preferences Input").first()?.json?.weather_categories }}' },
          { fieldId: 'send_time', fieldValue: '={{ $("Sanitize Preferences Input").first()?.json?.send_time }}' },
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
      responseBody: '={{ JSON.stringify({ status: "success", success: true, message: "User onboarding preferences saved." }) }}',
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
    summary: 'Grid-scale battery storage and high-voltage interconnects have reduced peak transmission losses across major metropolitan hubs.',
    url: 'https://example.com/renewable-grids',
    source: 'Beta Digest Wire',
    published_at: new Date().toISOString(),
    category: userNewsCategories[0] || 'technology'
  },
  {
    title: 'Global Central Banks Signal Coordinated Digital Settlement Standards',
    summary: 'Cross-border instant settlement corridors are set to cut clearing times from days to seconds for regional trade.',
    url: 'https://example.com/digital-settlement',
    source: 'Global Markets Review',
    published_at: new Date().toISOString(),
    category: userNewsCategories[1] || userNewsCategories[0] || 'economy'
  },
  {
    title: 'Deep-Ocean Autonomous Observatories Uncover New Thermal Currents',
    summary: 'Autonomous sensor fleets deployed in the Atlantic provide high-resolution climate telemetry for seasonal forecasting.',
    url: 'https://example.com/ocean-observatories',
    source: 'Science Daily Dispatch',
    published_at: new Date().toISOString(),
    category: userNewsCategories[2] || userNewsCategories[0] || 'science'
  }
];

const formattedArticles = (rawArticles.length > 0 ? rawArticles : fallbackArticles).slice(0, 5).map((art, idx) => ({
  title: art.title || fallbackArticles[idx % fallbackArticles.length].title,
  summary: art.summary || fallbackArticles[idx % fallbackArticles.length].summary,
  url: art.url || 'https://example.com/article',
  source: art.news_site || art.source || 'Beta Digest Wire',
  published_at: art.published_at || new Date().toISOString(),
  category: userNewsCategories[idx % userNewsCategories.length] || 'general'
}));

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
      subject: 'Your Beta Digest Sign-In Link',
      html: '=<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest Access</p><h1 style="font-size: 24px; margin: 0 0 16px;">Sign in to your account</h1><p style="font-size: 15px; line-height: 1.6; color: #44403C;">Click the link below to access your Beta Digest dashboard.</p><p style="margin: 24px 0;"><a href="{{ $(\'Determine Send-Link Dispatch\').first()?.json?.verificationUrl }}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">Sign In Now</a></p><p style="font-size: 12px; color: #78716C;">Or copy this link: {{ $(\'Determine Send-Link Dispatch\').first()?.json?.verificationUrl }}</p></div>',
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

return dueUsers.map(user => {
  const readerName = user.name || (user.email ? user.email.split('@')[0] : 'Reader');
  const subject = \`Your Beta Digest is ready (${paddedHour}:00 edition)\`;
  const html = \`<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 36px 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;">
  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;">Beta Digest • Scheduled Reminder</p>
  <h1 style="font-size: 24px; margin: 0 0 16px; color: #1C1917;">Good day, ${readerName}.</h1>
  <p style="font-size: 15px; line-height: 1.6; color: #44403C; margin: 0 0 20px;">
    This is your scheduled <strong>${user.send_time || paddedHour + ':00:00'}</strong> reminder that your personalized Beta Digest for <strong>${user.city || 'your city'}</strong> is ready.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #44403C; margin: 0 0 28px;">
    Head over to your dashboard to view your live weather metrics and curated news stories whenever you are ready.
  </p>
  <p style="margin: 0 0 28px;">
    <a href="${dashboardUrl}" style="display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;">View Your Dashboard</a>
  </p>
  <hr style="border: none; border-top: 1px solid #E7E0D6; margin: 24px 0;" />
  <p style="font-size: 12px; color: #78716C; margin: 0;">
    Direct link: <a href="${dashboardUrl}" style="color: #C84B31;">${dashboardUrl}</a>
  </p>
</div>\`;

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
      send_time: user.send_time || \`${paddedHour}:00:00\`,
      triggered_hour: targetHour,
      today_date: todayDate,
      dashboard_url: dashboardUrl,
      subject,
      html
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
      .onTrue(supa_update_user_prefs.to(respond_prefs_success))))

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
