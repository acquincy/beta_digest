const token = "sbp_oauth_32c7c9804edf01a39cdec62f869924dab3ba27d6";
const projectRef = "uekaerhvlgooeikycnly";

async function query(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  return res.json();
}

async function run() {
  // Check PostgREST response via Supabase public REST API
  // First, find the project's anon key and URL
  const keys = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
    headers: { "Authorization": `Bearer ${token}` }
  }).then(r => r.json());
  console.log("Keys:", keys);
}

run().catch(console.error);
