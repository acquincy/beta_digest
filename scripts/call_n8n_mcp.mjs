import fs from "fs";

const mcpUrl = "https://n8n.srv1650803.hstgr.cloud/mcp-server/http";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzFlNWVkYS1jNzVmLTQ2MmUtOWM3OS1iMmQxN2ZmMmQ4YmMiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjA1NjNlMDg2LTJjNzQtNDY5Yy1hZjJjLWNmNThmNmQ2NTU5ZSIsImlhdCI6MTc5MTQ3MzA4MX0.P0F7olkn6hqACVWo_46GCiBkUYZjpm3F2IBASO6KRkY";

async function callMcp(toolName, args) {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args
    }
  };

  const res = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream"
    },
    body: JSON.stringify(body)
  });

  console.log("Status:", res.status);
  const rawText = await res.text();
  console.log("Raw Response (first 1000 chars):", rawText.slice(0, 1000));

  let data = null;
  const match = rawText.match(/data:\s*(\{.*\})/);
  if (match) {
    try {
      data = JSON.parse(match[1]);
    } catch (e) {
      console.warn("Could not parse data line:", e);
    }
  } else {
    try {
      data = JSON.parse(rawText);
    } catch (e) {}
  }
  return data;
}

async function run() {
  const code = fs.readFileSync("scripts/generated_workflow.js", "utf8");
  console.log("Validating generated workflow...");
  const val = await callMcp("validate_workflow", { code });
  if (val.result?.content?.[0]?.text) {
    console.log("Text content:", val.result.content[0].text);
  }
}

run().catch(console.error);
