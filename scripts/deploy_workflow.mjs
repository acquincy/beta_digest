import fs from "fs";

const token = process.env.N8N_MCP_TOKEN || "";

async function callMcp(toolName, args) {
  const body = {
    jsonrpc: "2.0",
    id: Date.now(),
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

  const rawText = await res.text();
  const match = rawText.match(/data:\s*(\{.*\})/);
  let data = null;
  if (match) {
    try {
      data = JSON.parse(match[1]);
    } catch (e) {}
  } else {
    try {
      data = JSON.parse(rawText);
    } catch (e) {}
  }
  return data;
}

async function run() {
  const code = fs.readFileSync("scripts/generated_workflow.js", "utf8");

  console.log("1. Validating workflow...");
  const val = await callMcp("validate_workflow", { code });
  console.log("Validation result:", JSON.stringify(val.result || val));

  console.log("2. Updating workflow RLFgNXRBkkER4qYC...");
  const updateRes = await callMcp("update_workflow", {
    workflowId: "RLFgNXRBkkER4qYC",
    code,
    name: "Beta Digest",
    description: "Beta Digest workflows: signup, verify, onboarding preferences (news_categories, weather_categories, send_time), dashboard digest, and hourly reminder email."
  });
  console.log("Update result:", JSON.stringify(updateRes.result || updateRes));

  console.log("3. Fetching updated workflow details...");
  const details = await callMcp("get_workflow_details", { workflowId: "RLFgNXRBkkER4qYC" });
  let wfData = null;
  if (details.result?.content?.[0]?.text) {
    wfData = JSON.parse(details.result.content[0].text);
  }
  const cu = wfData?.nodes?.find(n => n.name === "CreateUser");
  console.log("Updated CreateUser parameters:", JSON.stringify(cu?.parameters, null, 2));

  console.log("4. Publishing workflow...");
  const pubRes = await callMcp("publish_workflow", { workflowId: "RLFgNXRBkkER4qYC" });
  console.log("Publish result:", JSON.stringify(pubRes.result || pubRes));
}

run().catch(console.error);
