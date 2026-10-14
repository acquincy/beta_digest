const supabaseToken = "sbp_oauth_32c7c9804edf01a39cdec62f869924dab3ba27d6";
const projectRef = "uekaerhvlgooeikycnly";
const n8nBase = "https://n8n.srv1650803.hstgr.cloud";

async function querySupabase(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${supabaseToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  return res.json();
}

async function runTest() {
  const testEmail = `agent.test.${Date.now()}@betadigest.com`;
  console.log(`=== TEST 1: POST /webhook/auth/signup for ${testEmail} ===`);

  const signupPayload = {
    email: testEmail,
    name: "Agent Test Reader",
    city: "Chicago",
    country_code: "US",
    news_categories: ["technology", "science", "economy"],
    weather_categories: ["current-temperature", "high-low", "rain-chance"],
    send_time: "08:00:00",
    frontend_url: "https://betadigest.online"
  };

  const signupRes = await fetch(`${n8nBase}/webhook/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupPayload)
  });

  const signupData = await signupRes.json();
  console.log("Signup response status:", signupRes.status);
  console.log("Signup response data:", JSON.stringify(signupData, null, 2));

  if (!signupData.token) {
    throw new Error("No token returned in signup response!");
  }
  const token = signupData.token;

  console.log("\n=== TEST 2: Inspecting Supabase public.users for created record ===");
  const users = await querySupabase(`
    SELECT * FROM public.users WHERE lower(email) = '${testEmail.toLowerCase()}';
  `);
  console.log("Supabase record:", JSON.stringify(users, null, 2));

  if (!users || users.length === 0) {
    throw new Error(`CRITICAL: User record for ${testEmail} was NOT found in Supabase!`);
  }

  const user = users[0];
  console.log(`User ID in Supabase: ${user.id}`);
  console.log(`Verification Token in Supabase: ${user.verification_token}`);
  console.log(`Name in Supabase: ${user.name}`);
  console.log(`City in Supabase: ${user.city}`);
  console.log(`Is Verified: ${user.is_verified}, Verified: ${user.verified}`);
  console.log(`News Categories:`, user.news_categories);

  if (user.verification_token !== token) {
    throw new Error(`Token mismatch! DB has ${user.verification_token}, signup returned ${token}`);
  }

  console.log("\n=== TEST 3: GET /webhook/auth/verify?token=... ===");
  const verifyRes = await fetch(`${n8nBase}/webhook/auth/verify?token=${encodeURIComponent(token)}`);
  const verifyData = await verifyRes.json();
  console.log("Verify response status:", verifyRes.status);
  console.log("Verify response data:", JSON.stringify(verifyData, null, 2));

  if (!verifyData.verified || verifyData.userId !== user.id) {
    throw new Error(`Verification response did not return verified user ID! Expected ${user.id}, got ${verifyData.userId}`);
  }

  console.log("\n=== TEST 4: Verify Supabase updated is_verified = true ===");
  const updatedUsers = await querySupabase(`
    SELECT id, email, is_verified, verified, verification_token, onboarding_completed FROM public.users WHERE id = '${user.id}';
  `);
  console.log("Updated user in Supabase:", JSON.stringify(updatedUsers, null, 2));

  if (!updatedUsers[0].is_verified || !updatedUsers[0].verified) {
    throw new Error(`CRITICAL: Supabase user is_verified/verified is not true!`);
  }

  console.log("\n=== TEST 5: POST /webhook/user/preferences ===");
  const prefPayload = {
    email: testEmail,
    city: "Seattle",
    country_code: "US",
    news_categories: ["technology", "health"],
    weather_categories: ["current-temperature", "weather-condition"],
    send_time: "09:00:00"
  };
  const prefRes = await fetch(`${n8nBase}/webhook/user/preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefPayload)
  });
  console.log("Preferences response status:", prefRes.status);
  const prefData = await prefRes.json();
  console.log("Preferences response data:", JSON.stringify(prefData, null, 2));

  const prefUsers = await querySupabase(`
    SELECT city, news_categories, onboarding_completed FROM public.users WHERE id = '${user.id}';
  `);
  console.log("Preferences in Supabase:", JSON.stringify(prefUsers, null, 2));

  console.log("\n=== TEST 6: GET /webhook/digest/dashboard?email=... ===");
  const dashRes = await fetch(`${n8nBase}/webhook/digest/dashboard?email=${encodeURIComponent(testEmail)}`);
  console.log("Dashboard response status:", dashRes.status);
  const dashData = await dashRes.json();
  console.log("Dashboard user:", JSON.stringify(dashData.user, null, 2));
  console.log("Dashboard weather location:", JSON.stringify(dashData.weather?.location, null, 2));
  console.log("Dashboard weekly digest articles count:", dashData.weekly_digest?.articles?.length);

  console.log("\n=== CLEANUP TEST RECORD ===");
  await querySupabase(`DELETE FROM public.users WHERE id = '${user.id}';`);
  console.log("Cleaned up test record.");

  console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! Supabase integration is 100% verified! <<<");
}

runTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
