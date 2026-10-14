const projectRef = "uekaerhvlgooeikycnly";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVla2Flcmh2bGdvb2Vpa3ljbmx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTMwMDI2MiwiZXhwIjoyMTA2ODc2MjYyfQ.JSqotaGCvJ5PSwpf2FGIjHbLnL8jXAKLMpgEXDaOVoE";

async function testInsert() {
  const payload = {
    email: "test_postgrest_insert@example.com",
    name: "Test User",
    city: "Lagos",
    country_code: "NG",
    news_categories: ["technology", "economy", "science"],
    weather_categories: ["current-temperature", "rain-chance"],
    send_time: "07:00:00",
    verification_token: "test-token-123",
    token_expires_at: new Date(Date.now() + 86400000).toISOString(),
    is_verified: false,
    verified: false,
    onboarding_completed: false
  };

  const res = await fetch(`https://${projectRef}.supabase.co/rest/v1/users`, {
    method: "POST",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(payload)
  });

  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}

testInsert().catch(console.error);
