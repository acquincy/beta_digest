import fs from "fs";

const text = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/steps/483/output.txt", "utf8");
const data = JSON.parse(text);
const wf = data.workflow || data;

console.log("Workflow ID:", wf.id);
console.log("Workflow Name:", wf.name);
console.log("Total Nodes:", wf.nodes.length);

const supabaseNodes = wf.nodes.filter(n => n.type && n.type.toLowerCase().includes("supabase"));
console.log("\nSupabase Nodes Count:", supabaseNodes.length);

for (const n of supabaseNodes) {
  console.log("------------------------------------------");
  console.log(`Node Name: "${n.name}", Type: "${n.type}", ID: "${n.id}"`);
  console.log("Parameters:", JSON.stringify(n.parameters, null, 2));
  if (n.onError) console.log("onError:", n.onError);
  if (n.credentials) console.log("credentials:", JSON.stringify(n.credentials));
}

console.log("\n--- TRIGGERS / ENTRY POINTS ---");
const triggers = wf.nodes.filter(n => n.type && (n.type.includes("webhook") || n.type.includes("Webhook") || n.type.includes("schedule") || n.type.includes("Schedule")));
for (const t of triggers) {
  console.log(`Trigger: "${t.name}" (${t.type}), path: ${t.parameters?.path}, httpMethod: ${t.parameters?.httpMethod}`);
}
