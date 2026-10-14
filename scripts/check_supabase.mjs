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
  const constraints = await query(`
    SELECT conname, contype, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE conrelid = 'public.users'::regclass;
  `);
  console.log("CONSTRAINTS:", JSON.stringify(constraints, null, 2));

  const indexes = await query(`
    SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users';
  `);
  console.log("INDEXES:", JSON.stringify(indexes, null, 2));
}

run().catch(console.error);
