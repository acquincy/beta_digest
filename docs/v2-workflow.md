# Beta Digest v2 Workflow Architecture

**Workflow Name:** Beta Digest v2  
**Workflow ID:** `MIu6TbUDD8zKMicJ`  
**Status:** Inactive (all schedule triggers disabled)

This is the canonical and only workflow powering Beta Digest.

---

## 1. Webhook Endpoints

All webhook endpoints are scoped under `/v2/` and require **Header Auth** (`Authorization` or `X-N8N-Shared-Secret`).

| Endpoint | HTTP Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/v2/auth/signup` | `POST` | Header Auth | Validates email, creates or refreshes verification token, sends verification / sign-in email |
| `/v2/auth/verify` | `POST` | Header Auth | Validates single-use token hash, marks user verified, creates persistent session |
| `/v2/session/resolve` | `POST` | Header Auth | Resolves session token hash against `user_sessions`, updates `last_seen_at` and returns status |
| `/v2/user/preferences` | `POST` | Header Auth | Updates user delivery and topic preferences (`news_categories`, `weather_categories`, `send_time`) |
| `/v2/digest/dashboard` | `POST` | Header Auth | Authenticates session and aggregates live weather and news briefings for reader dashboard |
| `/v2/auth/send-link` | `POST` | Header Auth | Dispatches passwordless magic sign-in link with 15-minute token expiry |
| `/v2/auth/logout` | `POST` | Header Auth | Revokes active session in `user_sessions` by setting `revoked_at` |
| `/v2/digest/send-hourly` | `GET` | Header Auth | On-demand trigger for hourly digest dispatch chain (optional query overrides: `hour`, `email`) |

---

## 2. Background Schedules

| Trigger | Interval | State | Description |
| :--- | :--- | :--- | :--- |
| `Schedule Trigger: Hourly Digest` | 1 Hour | Disabled | Scheduled hourly trigger feeding the digest dispatch chain |
| `Schedule Trigger: Daily Cleanup` | 1 Day | Disabled | Cleans up expired sessions (>30 days) and unverified users (>7 days) |

---

## 3. Hourly Digest Sender Chain

Both `Schedule Trigger: Hourly Digest` and `Webhook: GET /v2/digest/send-hourly` feed a single pipeline:

```
[Schedule Trigger (hourly)] ─┐
                             ├─► [Config: Digest Base URL] ─► [Supabase: Fetch Subscribers] ─► [Filter Due Users] ─► [Send via Resend] ─► [Supabase: Update Last Sent Date]
[Webhook: GET /send-hourly] ─┘
```

### Due Subscriber Criteria
A user is classified as due if and only if all of the following conditions are met:
1. `verified === true` AND `is_verified === true`
2. `onboarding_completed === true`
3. `send_time` hour equals the current dispatch hour (UTC or query override `hour`)
4. `last_sent_date` is not today (`YYYY-MM-DD`)

### Empty Result & Strict Isolation
- If no subscribers are due, the filter returns an empty array `[]` and downstream Resend dispatch does not run.
- All mock fallbacks (`delivered@resend.dev`, Alex Rivera mock user) are removed.
- Dashboard URL is resolved from `Config: Digest Base URL` (`https://betadigest.online/dashboard`) with no tokens attached.

---

## 4. Credential Binding

| Service | Credential Name | Scope |
| :--- | :--- | :--- |
| Supabase | `SLVH Supabase account` | All Supabase query and mutation nodes |
| Resend | `SLVH Resend account` | All email dispatch nodes |
| Webhooks | `Header Auth` | All 8 webhook triggers |

> **Note:** The deprecated `MCK Supabase account` belongs to a separate project and must never be referenced or executed.
