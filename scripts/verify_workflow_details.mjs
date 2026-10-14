import fs from "fs";

const text = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/steps/785/output.txt", "utf8");
const data = JSON.parse(text);
const wf = data.workflow || data;

const cu = wf.nodes.find(n => n.name === "CreateUser");
console.log("CreateUser Node in updated workflow:");
console.log(JSON.stringify(cu, null, 2));

const vu = wf.nodes.find(n => n.name === "Supabase: Verify User");
console.log("\nSupabase: Verify User Node in updated workflow:");
console.log(JSON.stringify(vu, null, 2));

console.log("\nActive status:", wf.active);
