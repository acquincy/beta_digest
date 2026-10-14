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
  const cols = await query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users'
    ORDER BY ordinal_position;
  `);
  console.log("COLUMNS:", JSON.stringify(cols, null, 2));

  const sample = await query(`
    SELECT * FROM public.users LIMIT 5;
  `);
  console.log("SAMPLE ROWS:", JSON.stringify(sample, null, 2));
}

run().catch(console.error);
