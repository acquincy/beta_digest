import fs from "fs";

const text = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/steps/483/output.txt", "utf8");
const data = JSON.parse(text);
const wf = data.workflow || data;

console.log("Total nodes:", wf.nodes.length);
console.log("Nodes list:");
for (const n of wf.nodes) {
  console.log(`- "${n.name}" (${n.type} v${n.typeVersion})`);
}

console.log("\nConnections:");
console.log(JSON.stringify(wf.connections, null, 2));
