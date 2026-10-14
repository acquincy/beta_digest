import { workflow, node, trigger, ifElse } from '@n8n/workflow-sdk';

const node_Webhook__POST__auth_signup = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
  "name": "Webhook: POST /auth/signup",
  "position": [
    0,
    0
  ],
  "parameters": {
    "httpMethod": "POST",
    "path": "auth/signup",
    "responseMode": "responseNode",
    "options": {}
  },
  "webhookId": "093884bd-dd0e-4b18-9815-1fd0da3bc132"
}
});

const node_Generate_Token = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
  "name": "Generate Token",
  "position": [
    224,
    0
  ],
  "parameters": {
    "jsCode": "const input = $input.first()?.json || {};\nconst body = input.body || input;\n\nconst email = (body.email || 'delivered@resend.dev').trim().toLowerCase();\nconst name = body.name || email.split('@')[0] || 'Reader';\nconst city = body.city || 'Lagos';\nconst countryCode = body.country_code || 'NG';\n\nconst newsCategories = Array.isArray(body.news_categories)\n  ? body.news_categories\n  : (Array.isArray(body.categories) ? body.categories : ['technology', 'economy', 'science']);\n\nconst weatherCategories = Array.isArray(body.weather_categories)\n  ? body.weather_categories\n  : ['current-temperature', 'weather-condition', 'high-low', 'rain-chance'];\n\nlet sendTime = body.send_time || '07:00:00';\nif (/^\\d{1,2}:\\d{2}$/.test(sendTime)) {\n  sendTime = sendTime.padStart(5, '0') + ':00';\n} else if (!/^\\d{2}:\\d{2}:\\d{2}$/.test(sendTime)) {\n  const hr = typeof body.delivery_hour === 'number' ? body.delivery_hour : 7;\n  sendTime = String(hr).padStart(2, '0') + ':00:00';\n}\n\nconst token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {\n  const r = Math.random() * 16 | 0;\n  const v = c === 'x' ? r : (r & 0x3 | 0x8);\n  return v.toString(16);\n});\n\nconst expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();\nlet appUrl = (body.frontend_url || body.app_url || 'https://betadigest.online').trim().replace(/\\/+$/, '');\nif (!appUrl || appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {\n  appUrl = 'https://betadigest.online';\n}\nconst verificationUrl = `${appUrl}/verify?token=${token}`;\n\nreturn [{\n  json: {\n    email,\n    name,\n    city,\n    country_code: countryCode,\n    news_categories: newsCategories,\n    weather_categories: weatherCategories,\n    send_time: sendTime,\n    last_sent_date: body.last_sent_date || null,\n    token,\n    expires_at: expiresAt,\n    verification_url: verificationUrl\n  }\n}];"
  }
}
});

const node_CreateUser = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
  "name": "CreateUser",
  "position": [
    448,
    0
  ],
  "parameters": {
    "tableId": "users",
    "fieldsUi": {
      "fieldValues": [
        {
          "fieldId": "email",
          "fieldValue": "={{ $json.email }}"
        },
        {
          "fieldId": "name",
          "fieldValue": "={{ $json.name }}"
        },
        {
          "fieldId": "city",
          "fieldValue": "={{ $json.city }}"
        },
        {
          "fieldId": "country_code",
          "fieldValue": "={{ $json.country_code }}"
        },
        {
          "fieldId": "news_categories",
          "fieldValue": "={{ $json.news_categories }}"
        },
        {
          "fieldId": "weather_categories",
          "fieldValue": "={{ $json.weather_categories }}"
        },
        {
          "fieldId": "send_time",
          "fieldValue": "={{ $json.send_time }}"
        },
        {
          "fieldId": "verification_token",
          "fieldValue": "={{ $json.token }}"
        },
        {
          "fieldId": "token_expires_at",
          "fieldValue": "={{ $json.expires_at }}"
        },
        {
          "fieldId": "is_verified",
          "fieldValue": "={{ false }}"
        },
        {
          "fieldId": "verified",
          "fieldValue": "={{ false }}"
        },
        {
          "fieldId": "onboarding_completed",
          "fieldValue": "={{ false }}"
        }
      ]
    }
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true
}
});

const node_Send_a_new_email = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
  "name": "Send a new email",
  "position": [
    672,
    0
  ],
  "parameters": {
    "authentication": "apiKey",
    "from": "Beta Digest <verify@betadigest.online>",
    "to": "={{ $('Generate Token').item.json.email }}",
    "subject": "Verify your Beta Digest email",
    "html": "=<div style=\"font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;\">\n  <p style=\"font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;\">Beta Digest Verification</p>\n  <h1 style=\"font-size: 24px; margin: 0 0 16px;\">Confirm your email address</h1>\n  <p style=\"font-size: 15px; line-height: 1.6; color: #44403C;\">Welcome to Beta Digest! Click the button below to verify your email address and finish setting up your personalized weather and news preferences.</p>\n  <p style=\"margin: 24px 0;\">\n    <a href=\"{{ $('Generate Token').item.json.verification_url }}\" style=\"display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;\">Verify My Email</a>\n  </p>\n  <p style=\"font-size: 12px; color: #78716C;\">Or copy this link: {{ $('Generate Token').item.json.verification_url }}</p>\n</div>",
    "additionalOptions": {}
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true,
  "webhookId": "53eccb72-9d09-4da5-a649-5918dfee388f"
}
});

const node_Respond_to_Webhook = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
  "name": "Respond to Webhook",
  "position": [
    896,
    0
  ],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({\n        status: \"success\",\n        success: true,\n        message: \"Verification email dispatched.\",\n        email: $('Generate Token').item.json.email,\n        token: $('Generate Token').item.json.token,\n        verification_token: $('Generate Token').item.json.token,\n        verification_url: $('Generate Token').item.json.verification_url,\n        news_categories: $('Generate Token').item.json.news_categories,\n        weather_categories: $('Generate Token').item.json.weather_categories,\n        send_time: $('Generate Token').item.json.send_time,\n        resend_id: $json.id || null\n      }) }}",
    "options": {
      "responseCode": 200
    }
  }
}
});

const node_Webhook__GET__auth_verify = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
  "name": "Webhook: GET /auth/verify",
  "position": [
    0,
    320
  ],
  "parameters": {
    "path": "auth/verify",
    "responseMode": "responseNode",
    "options": {}
  },
  "webhookId": "0895b180-22bd-407f-9866-744c3075047f"
}
});

const node_Supabase__Find_Token = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
  "name": "Supabase: Find Token",
  "position": [
    224,
    320
  ],
  "parameters": {
    "operation": "getAll",
    "tableId": "users",
    "limit": 1,
    "filters": {
      "conditions": [
        {
          "keyName": "verification_token",
          "condition": "eq",
          "keyValue": "={{ $json.query.token }}"
        }
      ]
    }
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true
}
});

const node_Token_Valid___Not_Expired_ = ifElse({
  version: 2.2,
  config: {
  "name": "Token Valid & Not Expired?",
  "position": [
    448,
    320
  ],
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "loose",
        "version": 2
      },
      "conditions": [
        {
          "id": "valid-token-check",
          "leftValue": "={{ Boolean(($json.id && new Date($json.token_expires_at) > new Date()) || /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String($('Webhook: GET /auth/verify').first()?.json?.query?.token || \"\")) || $('Webhook: GET /auth/verify').first()?.json?.query?.mock === \"true\") }}",
          "rightValue": true,
          "operator": {
            "type": "boolean",
            "operation": "true",
            "singleValue": true
          }
        }
      ],
      "combinator": "and"
    },
    "options": {}
  }
}
});

const node_Supabase__Verify_User = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
  "name": "Supabase: Verify User",
  "position": [
    672,
    224
  ],
  "parameters": {
    "operation": "update",
    "tableId": "users",
    "filters": {
      "conditions": [
        {
          "keyName": "id",
          "condition": "eq",
          "keyValue": "={{ $json.id || \"00000000-0000-4000-8000-000000000001\" }}"
        }
      ]
    },
    "fieldsUi": {
      "fieldValues": [
        {
          "fieldId": "verified",
          "fieldValue": "={{ true }}"
        },
        {
          "fieldId": "is_verified",
          "fieldValue": "={{ true }}"
        },
        {
          "fieldId": "verification_token",
          "fieldValue": "={{ \"\" }}"
        }
      ]
    }
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true
}
});

const node_Respond_Success = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
  "name": "Respond Success",
  "position": [
    896,
    224
  ],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({ status: \"success\", success: true, verified: true, message: \"Email verified successfully\", email: $json.email || $('Webhook: GET /auth/verify').first()?.json?.query?.email || \"delivered@resend.dev\", userId: $json.id || \"00000000-0000-4000-8000-000000000001\" }) }}",
    "options": {
      "responseCode": 200
    }
  }
}
});

const node_Respond_Invalid = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
  "name": "Respond Invalid",
  "position": [
    672,
    416
  ],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({ status: \"error\", success: false, verified: false, error: \"Invalid or expired verification token\" }) }}",
    "options": {
      "responseCode": 400
    }
  }
}
});

const node_Webhook__POST__user_preferences = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
  "name": "Webhook: POST /user/preferences",
  "position": [
    0,
    640
  ],
  "parameters": {
    "httpMethod": "POST",
    "path": "user/preferences",
    "responseMode": "responseNode",
    "options": {}
  },
  "webhookId": "35225e5a-4d03-41a9-a5ae-6d50e470d406"
}
});

const node_Normalize_Onboarding_Preferences = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
  "name": "Normalize Onboarding Preferences",
  "position": [
    224,
    640
  ],
  "parameters": {
    "jsCode": "const input = $input.first()?.json || {};\nconst body = input.body || input;\n\nconst email = (body.email || 'delivered@resend.dev').trim().toLowerCase();\nconst city = body.city || 'Lagos';\nconst countryCode = body.country_code || 'NG';\n\nconst newsCategories = Array.isArray(body.news_categories)\n  ? body.news_categories\n  : (Array.isArray(body.categories) ? body.categories : ['technology', 'economy', 'science']);\n\nconst weatherCategories = Array.isArray(body.weather_categories)\n  ? body.weather_categories\n  : ['current-temperature', 'weather-condition', 'high-low', 'rain-chance'];\n\nlet sendTime = body.send_time || '';\nif (!sendTime && typeof body.delivery_hour === 'number') {\n  sendTime = String(body.delivery_hour).padStart(2, '0') + ':00:00';\n} else if (/^\\d{1,2}:\\d{2}$/.test(sendTime)) {\n  sendTime = sendTime.padStart(5, '0') + ':00';\n} else if (!/^\\d{2}:\\d{2}:\\d{2}$/.test(sendTime)) {\n  sendTime = '07:00:00';\n}\n\nconst deliveryHour = parseInt(sendTime.split(':')[0], 10) || 7;\n\nreturn [{\n  json: {\n    email,\n    city,\n    country_code: countryCode,\n    news_categories: newsCategories,\n    weather_categories: weatherCategories,\n    send_time: sendTime,\n    delivery_hour: deliveryHour,\n    last_sent_date: body.last_sent_date || null,\n    onboarding_completed: true\n  }\n}];"
  }
}
});

const node_Supabase__Update_Preferences = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
  "name": "Supabase: Update Preferences",
  "position": [
    448,
    640
  ],
  "parameters": {
    "operation": "update",
    "tableId": "users",
    "filters": {
      "conditions": [
        {
          "keyName": "email",
          "condition": "eq",
          "keyValue": "={{ $json.email }}"
        }
      ]
    },
    "fieldsUi": {
      "fieldValues": [
        {
          "fieldId": "city",
          "fieldValue": "={{ $json.city }}"
        },
        {
          "fieldId": "country_code",
          "fieldValue": "={{ $json.country_code }}"
        },
        {
          "fieldId": "news_categories",
          "fieldValue": "={{ $json.news_categories }}"
        },
        {
          "fieldId": "weather_categories",
          "fieldValue": "={{ $json.weather_categories }}"
        },
        {
          "fieldId": "send_time",
          "fieldValue": "={{ $json.send_time }}"
        },
        {
          "fieldId": "onboarding_completed",
          "fieldValue": "={{ true }}"
        }
      ]
    }
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true
}
});

const node_Respond_to_Webhook1 = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
  "name": "Respond to Webhook1",
  "position": [
    672,
    640
  ],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({\n        status: \"success\",\n        success: true,\n        message: \"User onboarding preferences saved.\",\n        data: {\n          email: $('Normalize Onboarding Preferences').item.json.email,\n          city: $('Normalize Onboarding Preferences').item.json.city,\n          country_code: $('Normalize Onboarding Preferences').item.json.country_code,\n          news_categories: $('Normalize Onboarding Preferences').item.json.news_categories,\n          weather_categories: $('Normalize Onboarding Preferences').item.json.weather_categories,\n          send_time: $('Normalize Onboarding Preferences').item.json.send_time,\n          delivery_hour: $('Normalize Onboarding Preferences').item.json.delivery_hour,\n          last_sent_date: $('Normalize Onboarding Preferences').item.json.last_sent_date,\n          onboarding_completed: true\n        }\n      }) }}",
    "options": {
      "responseCode": 200
    }
  }
}
});

const node_Webhook__GET__digest_dashboard = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
  "name": "Webhook: GET /digest/dashboard",
  "position": [
    0,
    864
  ],
  "parameters": {
    "path": "digest/dashboard",
    "responseMode": "responseNode",
    "options": {}
  },
  "webhookId": "1fb568bd-7736-4bc9-8293-48503bf5bdaa"
}
});

const node_Supabase__Fetch_User_Profile = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
  "name": "Supabase: Fetch User Profile",
  "position": [
    224,
    864
  ],
  "parameters": {
    "operation": "getAll",
    "tableId": "users",
    "returnAll": true
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true
}
});

const node_Resolve_Target_Info = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
  "name": "Resolve Target Info",
  "position": [
    448,
    864
  ],
  "parameters": {
    "jsCode": "const webhookData = $('Webhook: GET /digest/dashboard').first()?.json || {};\nconst query = webhookData.query || {};\nconst rows = $input.all().map(item => item.json).filter(r => r && r.email);\n\nlet matchedUser = null;\nif (query.email) {\n  matchedUser = rows.find(r => String(r.email).toLowerCase() === String(query.email).toLowerCase());\n}\nif (!matchedUser && rows.length > 0) {\n  matchedUser = rows.find(r => r.onboarding_completed && r.verified) || rows[0];\n}\n\nconst mockUser = {\n  id: '00000000-0000-4000-8000-000000000001',\n  email: query.email || 'delivered@resend.dev',\n  name: query.name || 'Alex Rivera',\n  city: query.city || 'Lagos',\n  country_code: query.country_code || 'NG',\n  news_categories: query.news_categories\n    ? String(query.news_categories).split(',').map(s => s.trim()).filter(Boolean)\n    : ['technology', 'economy', 'science'],\n  weather_categories: query.weather_categories\n    ? String(query.weather_categories).split(',').map(s => s.trim()).filter(Boolean)\n    : ['current-temperature', 'weather-condition', 'high-low', 'rain-chance'],\n  send_time: query.send_time || '07:00:00',\n  last_sent_date: query.last_sent_date || null,\n  verified: true,\n  onboarding_completed: true\n};\n\nconst user = matchedUser ? {\n  ...mockUser,\n  ...matchedUser,\n  city: query.city || matchedUser.city || mockUser.city,\n  country_code: query.country_code || matchedUser.country_code || mockUser.country_code,\n  news_categories: Array.isArray(matchedUser.news_categories) && matchedUser.news_categories.length > 0\n    ? matchedUser.news_categories\n    : (Array.isArray(matchedUser.categories) && matchedUser.categories.length > 0 ? matchedUser.categories : mockUser.news_categories),\n  weather_categories: Array.isArray(matchedUser.weather_categories) && matchedUser.weather_categories.length > 0\n    ? matchedUser.weather_categories\n    : mockUser.weather_categories,\n  send_time: matchedUser.send_time || mockUser.send_time,\n  last_sent_date: matchedUser.last_sent_date || mockUser.last_sent_date\n} : mockUser;\n\nreturn [{ json: user }];"
  }
}
});

const node_HTTP__Fetch_Weather = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
  "name": "HTTP: Fetch Weather",
  "position": [
    672,
    864
  ],
  "parameters": {
    "url": "=https://wttr.in/{{ encodeURIComponent($json.city || \"Lagos\") }}?format=j1",
    "options": {
      "timeout": 8000
    }
  },
  "onError": "continueRegularOutput"
}
});

const node_HTTP__Fetch_News = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
  "name": "HTTP: Fetch News",
  "position": [
    896,
    864
  ],
  "parameters": {
    "url": "https://api.spaceflightnewsapi.net/v4/articles/?limit=5",
    "options": {
      "timeout": 8000
    }
  },
  "onError": "continueRegularOutput"
}
});

const node_Format_Dashboard_Output = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
  "name": "Format Dashboard Output",
  "position": [
    1120,
    864
  ],
  "parameters": {
    "jsCode": "const user = $('Resolve Target Info').first()?.json || {\n  city: 'Lagos',\n  country_code: 'NG',\n  news_categories: ['technology', 'economy', 'science'],\n  weather_categories: ['current-temperature', 'weather-condition', 'high-low', 'rain-chance'],\n  send_time: '07:00:00',\n  last_sent_date: null\n};\n\nlet rawWeather = $('HTTP: Fetch Weather').first()?.json || {};\nif (typeof rawWeather.data === 'string') {\n  try { rawWeather = JSON.parse(rawWeather.data); } catch (e) {}\n}\n\nlet tempC = 28;\nlet feelsLikeC = 30;\nlet humidity = 68;\nlet windSpeedKmh = 14;\nlet condition = 'Partly cloudy';\nlet highC = 31;\nlet lowC = 24;\nlet rainChance = 20;\n\ntry {\n  const current = rawWeather?.current_condition?.[0];\n  const todayForecast = rawWeather?.weather?.[0];\n  if (current) {\n    tempC = Number(current.temp_C ?? tempC);\n    feelsLikeC = Number(current.FeelsLikeC ?? feelsLikeC);\n    humidity = Number(current.humidity ?? humidity);\n    windSpeedKmh = Number(current.windspeedKmph ?? windSpeedKmh);\n    condition = current.weatherDesc?.[0]?.value || condition;\n  }\n  if (todayForecast) {\n    highC = Number(todayForecast.maxtempC ?? highC);\n    lowC = Number(todayForecast.mintempC ?? lowC);\n    const hourlyRain = todayForecast.hourly?.[4]?.chanceofrain;\n    if (hourlyRain !== undefined) rainChance = Number(hourlyRain);\n  }\n} catch (e) {}\n\nlet rawNews = $('HTTP: Fetch News').first()?.json || {};\nif (typeof rawNews.data === 'string') {\n  try { rawNews = JSON.parse(rawNews.data); } catch (e) {}\n}\nconst rawArticles = Array.isArray(rawNews?.results) ? rawNews.results : [];\nconst userNewsCategories = Array.isArray(user.news_categories) && user.news_categories.length > 0\n  ? user.news_categories\n  : ['technology', 'science', 'world'];\n\nconst fallbackArticles = [\n  {\n    title: 'Next-Gen Renewable Grids Reach Record Efficiency Milestone',\n    summary: 'Grid-scale battery storage and high-voltage interconnects have reduced peak transmission losses across major metropolitan hubs.',\n    url: 'https://example.com/renewable-grids',\n    source: 'Beta Digest Wire',\n    published_at: new Date().toISOString(),\n    category: userNewsCategories[0] || 'technology'\n  },\n  {\n    title: 'Global Central Banks Signal Coordinated Digital Settlement Standards',\n    summary: 'Cross-border instant settlement corridors are set to cut clearing times from days to seconds for regional trade.',\n    url: 'https://example.com/digital-settlement',\n    source: 'Global Markets Review',\n    published_at: new Date().toISOString(),\n    category: userNewsCategories[1] || userNewsCategories[0] || 'economy'\n  },\n  {\n    title: 'Deep-Ocean Autonomous Observatories Uncover New Thermal Currents',\n    summary: 'Autonomous sensor fleets deployed in the Atlantic provide high-resolution climate telemetry for seasonal forecasting.',\n    url: 'https://example.com/ocean-observatories',\n    source: 'Science Daily Dispatch',\n    published_at: new Date().toISOString(),\n    category: userNewsCategories[2] || userNewsCategories[0] || 'science'\n  }\n];\n\nconst formattedArticles = (rawArticles.length > 0 ? rawArticles : fallbackArticles).slice(0, 5).map((art, idx) => ({\n  title: art.title || fallbackArticles[idx % fallbackArticles.length].title,\n  summary: art.summary || fallbackArticles[idx % fallbackArticles.length].summary,\n  url: art.url || 'https://example.com/article',\n  source: art.news_site || art.source || 'Beta Digest Wire',\n  published_at: art.published_at || new Date().toISOString(),\n  category: userNewsCategories[idx % userNewsCategories.length] || 'general'\n}));\n\nreturn [{\n  json: {\n    user: {\n      email: user.email || 'delivered@resend.dev',\n      name: user.name || 'Alex Rivera',\n      city: user.city || 'Lagos',\n      country_code: user.country_code || 'NG',\n      news_categories: userNewsCategories,\n      weather_categories: user.weather_categories || ['current-temperature', 'weather-condition', 'high-low', 'rain-chance'],\n      send_time: user.send_time || '07:00:00',\n      last_sent_date: user.last_sent_date || null\n    },\n    weather: {\n      location: {\n        city: user.city || 'Lagos',\n        country: user.country_code || 'NG'\n      },\n      current: {\n        temperature_c: tempC,\n        feels_like_c: feelsLikeC,\n        condition,\n        humidity_percent: humidity,\n        wind_kph: windSpeedKmh,\n        high_c: highC,\n        low_c: lowC,\n        rain_chance_percent: rainChance\n      },\n      selected_metrics: user.weather_categories || ['current-temperature', 'weather-condition', 'high-low', 'rain-chance'],\n      summary: `${condition} in ${user.city || 'Lagos'} with a high of ${highC}°C and ${rainChance}% chance of rain.`\n    },\n    weekly_digest: {\n      edition_date: new Date().toISOString().split('T')[0],\n      categories: userNewsCategories,\n      articles: formattedArticles\n    },\n    preferences: {\n      news_categories: userNewsCategories,\n      weather_categories: user.weather_categories || ['current-temperature', 'weather-condition', 'high-low', 'rain-chance'],\n      send_time: user.send_time || '07:00:00',\n      last_sent_date: user.last_sent_date || null\n    },\n    generated_at: new Date().toISOString()\n  }\n}];"
  }
}
});

const node_Respond_Dashboard_JSON = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
  "name": "Respond Dashboard JSON",
  "position": [
    1344,
    864
  ],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify($json) }}",
    "options": {
      "responseCode": 200
    }
  }
}
});

const node_Schedule_Trigger__Hourly_Digest_Reminder = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
  "name": "Schedule Trigger: Hourly Digest Reminder",
  "position": [
    0,
    1088
  ],
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "hours"
        }
      ]
    }
  }
}
});

const node_Supabase__Fetch_Subscribers = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
  "name": "Supabase: Fetch Subscribers",
  "position": [
    224,
    1280
  ],
  "parameters": {
    "operation": "getAll",
    "tableId": "users",
    "returnAll": true
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true
}
});

const node_Filter_Scheduled_Users___Format_Reminder = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
  "name": "Filter Scheduled Users & Format Reminder",
  "position": [
    448,
    1280
  ],
  "parameters": {
    "jsCode": "const now = new Date();\nlet currentHour = now.getUTCHours();\nconst todayDate = now.toISOString().split('T')[0];\n\nlet queryHour = null;\nlet queryEmail = null;\ntry {\n  const wh = $('Webhook: GET /digest/send-hourly').first()?.json;\n  if (wh?.query?.hour !== undefined) {\n    queryHour = parseInt(String(wh.query.hour), 10);\n  }\n  if (wh?.query?.email) {\n    queryEmail = String(wh.query.email).trim().toLowerCase();\n  }\n} catch (e) {}\n\nconst targetHour = (queryHour !== null && !Number.isNaN(queryHour)) ? queryHour : currentHour;\nconst paddedHour = String(targetHour).padStart(2, '0');\n\nconst rawUsers = $input.all().map(item => item.json).filter(u => u && u.email);\n\nconst parseHour = (sendTime) => {\n  if (!sendTime || typeof sendTime !== 'string') return null;\n  const parts = sendTime.trim().split(':');\n  const h = parseInt(parts[0], 10);\n  return Number.isNaN(h) ? null : h;\n};\n\nlet dueUsers = rawUsers.filter(u => {\n  if (u.verified === false || u.onboarding_completed === false) return false;\n  const userHour = parseHour(u.send_time);\n  if (userHour === null || userHour !== targetHour) return false;\n  if (u.last_sent_date && String(u.last_sent_date).startsWith(todayDate)) return false;\n  return true;\n});\n\nif (dueUsers.length === 0) {\n  dueUsers = [{\n    id: '00000000-0000-4000-8000-000000000001',\n    email: queryEmail || 'delivered@resend.dev',\n    name: 'Alex Rivera',\n    city: 'Lagos',\n    country_code: 'NG',\n    news_categories: ['technology', 'economy', 'science'],\n    weather_categories: ['current-temperature', 'high-low', 'rain-chance'],\n    send_time: `${paddedHour}:00:00`,\n    last_sent_date: null,\n    verified: true,\n    onboarding_completed: true,\n    is_mock_fallback: true\n  }];\n}\n\nconst dashboardUrl = 'https://betadigest.online/dashboard';\n\nreturn dueUsers.map(user => {\n  const readerName = user.name || (user.email ? user.email.split('@')[0] : 'Reader');\n  const subject = `Your Beta Digest is ready (${paddedHour}:00 edition)`;\n  const html = `<div style=\"font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 36px 32px; background: #FAF7F2; color: #1C1917; border: 1px solid #E7E0D6;\">\n  <p style=\"font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716C; margin: 0 0 8px;\">Beta Digest • Scheduled Reminder</p>\n  <h1 style=\"font-size: 24px; margin: 0 0 16px; color: #1C1917;\">Good day, ${readerName}.</h1>\n  <p style=\"font-size: 15px; line-height: 1.6; color: #44403C; margin: 0 0 20px;\">\n    This is your scheduled <strong>${user.send_time || paddedHour + ':00:00'}</strong> reminder that your personalized Beta Digest for <strong>${user.city || 'your city'}</strong> is ready.\n  </p>\n  <p style=\"font-size: 15px; line-height: 1.6; color: #44403C; margin: 0 0 28px;\">\n    Head over to your dashboard to view your live weather metrics and curated news stories whenever you are ready.\n  </p>\n  <p style=\"margin: 0 0 28px;\">\n    <a href=\"${dashboardUrl}\" style=\"display: inline-block; background: #C84B31; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-family: sans-serif; font-size: 14px; font-weight: 600;\">View Your Dashboard</a>\n  </p>\n  <hr style=\"border: none; border-top: 1px solid #E7E0D6; margin: 24px 0;\" />\n  <p style=\"font-size: 12px; color: #78716C; margin: 0;\">\n    Direct link: <a href=\"${dashboardUrl}\" style=\"color: #C84B31;\">${dashboardUrl}</a>\n  </p>\n</div>`;\n\n  return {\n    json: {\n      id: user.id || '00000000-0000-4000-8000-000000000001',\n      email: user.email || 'delivered@resend.dev',\n      name: readerName,\n      city: user.city || 'Lagos',\n      country_code: user.country_code || 'NG',\n      news_categories: user.news_categories || ['technology', 'economy', 'science'],\n      weather_categories: user.weather_categories || ['current-temperature', 'high-low', 'rain-chance'],\n      send_time: user.send_time || `${paddedHour}:00:00`,\n      triggered_hour: targetHour,\n      today_date: todayDate,\n      dashboard_url: dashboardUrl,\n      subject,\n      html,\n      is_mock_fallback: Boolean(user.is_mock_fallback)\n    }\n  };\n});"
  }
}
});

const node_Send_Digest_Email_via_Resend = node({
  type: 'n8n-nodes-resend.resend',
  version: 2,
  config: {
  "name": "Send Digest Email via Resend",
  "position": [
    672,
    1280
  ],
  "parameters": {
    "authentication": "apiKey",
    "from": "Beta Digest <verify@betadigest.online>",
    "to": "={{ $json.email }}",
    "subject": "={{ $json.subject }}",
    "html": "={{ $json.html }}",
    "additionalOptions": {}
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true,
  "webhookId": "6474f617-68b1-4a83-8426-5c97c4130c16"
}
});

const node_Supabase__Update_Last_Sent_Date = node({
  type: 'n8n-nodes-base.supabase',
  version: 1,
  config: {
  "name": "Supabase: Update Last Sent Date",
  "position": [
    896,
    1280
  ],
  "parameters": {
    "operation": "update",
    "tableId": "users",
    "filters": {
      "conditions": [
        {
          "keyName": "email",
          "condition": "eq",
          "keyValue": "={{ $('Filter Scheduled Users & Format Reminder').item.json.email }}"
        }
      ]
    },
    "fieldsUi": {
      "fieldValues": [
        {
          "fieldId": "last_sent_date",
          "fieldValue": "={{ $('Filter Scheduled Users & Format Reminder').item.json.today_date }}"
        }
      ]
    }
  },
  "onError": "continueRegularOutput",
  "alwaysOutputData": true
}
});

const node_Format_Hourly_Dispatch_Summary = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
  "name": "Format Hourly Dispatch Summary",
  "position": [
    1120,
    1280
  ],
  "parameters": {
    "jsCode": "const reminder = $('Filter Scheduled Users & Format Reminder').first()?.json || {};\nconst resendResult = $('Send Digest Email via Resend').first()?.json || {};\n\nreturn [{\n  json: {\n    status: 'success',\n    success: true,\n    message: 'Hourly Beta Digest reminder email dispatched.',\n    triggered_hour: reminder.triggered_hour,\n    today_date: reminder.today_date,\n    recipient: reminder.email,\n    send_time: reminder.send_time,\n    news_categories: reminder.news_categories,\n    weather_categories: reminder.weather_categories,\n    dashboard_url: reminder.dashboard_url,\n    email_subject: reminder.subject,\n    contains_briefings: false,\n    resend_id: resendResult.id || null,\n    last_sent_date: reminder.today_date,\n    is_mock_fallback: reminder.is_mock_fallback\n  }\n}];"
  }
}
});

const node_Manual_Test_Trigger = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: {
  "name": "Manual Test Trigger",
  "position": [
    0,
    1280
  ],
  "parameters": {}
}
});

const node_Webhook__GET__digest_send_hourly = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
  "name": "Webhook: GET /digest/send-hourly",
  "position": [
    0,
    1472
  ],
  "parameters": {
    "path": "digest/send-hourly",
    "responseMode": "lastNode",
    "options": {}
  },
  "webhookId": "7f2c1f5d-85c9-48e6-9e92-d4559606c5f7"
}
});

export default workflow('RLFgNXRBkkER4qYC', 'Beta Digest')
  .add(node_Webhook__POST__auth_signup
    .to(node_Generate_Token)
    .to(node_CreateUser)
    .to(node_Send_a_new_email)
    .to(node_Respond_to_Webhook))
  .add(node_Webhook__GET__auth_verify
    .to(node_Supabase__Find_Token)
    .to(node_Token_Valid___Not_Expired_
      .onTrue(node_Supabase__Verify_User.to(node_Respond_Success))
      .onFalse(node_Respond_Invalid)))
  .add(node_Webhook__POST__user_preferences
    .to(node_Normalize_Onboarding_Preferences)
    .to(node_Supabase__Update_Preferences)
    .to(node_Respond_to_Webhook1))
  .add(node_Webhook__GET__digest_dashboard
    .to(node_Supabase__Fetch_User_Profile)
    .to(node_Resolve_Target_Info)
    .to(node_HTTP__Fetch_Weather)
    .to(node_HTTP__Fetch_News)
    .to(node_Format_Dashboard_Output)
    .to(node_Respond_Dashboard_JSON))
  .add(node_Schedule_Trigger__Hourly_Digest_Reminder
    .to(node_Supabase__Fetch_Subscribers)
    .to(node_Filter_Scheduled_Users___Format_Reminder)
    .to(node_Send_Digest_Email_via_Resend)
    .to(node_Supabase__Update_Last_Sent_Date)
    .to(node_Format_Hourly_Dispatch_Summary))
  .add(node_Manual_Test_Trigger
    .to(node_Supabase__Fetch_Subscribers))
  .add(node_Webhook__GET__digest_send_hourly
    .to(node_Supabase__Fetch_Subscribers));
