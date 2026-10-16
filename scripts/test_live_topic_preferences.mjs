import crypto from "crypto";

const supabaseToken = "sbp_oauth_32c7c9804edf01a39cdec62f869924dab3ba27d6";
const projectRef = "uekaerhvlgooeikycnly";
const n8nBase = "https://n8n.srv1650803.hstgr.cloud";

async function querySupabase(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  return res.json();
}

async function test() {
  const testEmail = `pref.test.${Date.now()}@betadigest.com`;
  const sessionToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(sessionToken).digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  console.log("1. Creating test user & active session in Supabase...");
  const userRes = await querySupabase(`
    INSERT INTO public.users (email, name, city, country_code, send_time, news_categories, weather_categories, verified, is_verified, onboarding_completed)
    VALUES ('${testEmail}', 'Topic Tester', 'Paris', 'FR', '08:30:00', '["technology"]'::jsonb, '["current-temperature"]'::jsonb, true, true, true)
    RETURNING id;
  `);
  const userId = userRes[0]?.id;
  console.log("Created user ID:", userId);

  await querySupabase(`
    INSERT INTO public.user_sessions (user_id, token_hash, expires_at)
    VALUES ('${userId}', '${tokenHash}', '${expiresAt}');
  `);
  console.log("Session inserted with hash:", tokenHash.slice(0, 16) + "...");

  console.log("\n2. Calling live n8n webhook /webhook/v2/user/preferences to update topic preferences...");
  const updatePayload = {
    session_token_hash: tokenHash,
    news_categories: ["economy", "health", "science"],
    weather_categories: ["high-low", "rain-chance"],
  };

  const prefRes = await fetch(`${n8nBase}/webhook/v2/user/preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload),
  });

  const prefData = await prefRes.json();
  console.log("n8n Response status:", prefRes.status);
  console.log("n8n Response body:", JSON.stringify(prefData, null, 2));

  console.log("\n3. Verifying updated data in Supabase users table...");
  const verifyRes = await querySupabase(`
    SELECT id, email, city, country_code, send_time, news_categories, weather_categories
    FROM public.users WHERE id = '${userId}';
  `);
  const updatedUser = verifyRes[0];
  console.log("Updated user in DB:", JSON.stringify(updatedUser, null, 2));

  // Assertions
  if (updatedUser.city !== "Paris") throw new Error("City was altered! Expected Paris, got: " + updatedUser.city);
  if (updatedUser.send_time !== "08:30:00") throw new Error("Send time was altered! Expected 08:30:00, got: " + updatedUser.send_time);
  if (JSON.stringify(updatedUser.news_categories) !== JSON.stringify(["economy", "health", "science"])) {
    throw new Error("News categories mismatch! Got: " + JSON.stringify(updatedUser.news_categories));
  }
  if (JSON.stringify(updatedUser.weather_categories) !== JSON.stringify(["high-low", "rain-chance"])) {
    throw new Error("Weather categories mismatch! Got: " + JSON.stringify(updatedUser.weather_categories));
  }

  console.log("\nSUCCESS: All live DB assertions passed!");
  console.log("- Topic preferences updated in users table successfully");
  console.log("- City ('Paris') and Send Time ('08:30:00') were preserved perfectly");

  console.log("\n4. Cleaning up test user...");
  await querySupabase(`DELETE FROM public.users WHERE id = '${userId}';`);
  console.log("Cleanup complete.");
}

test().catch(console.error);
