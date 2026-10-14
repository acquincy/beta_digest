import fs from "fs";

const text = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/steps/483/output.txt", "utf8");
const data = JSON.parse(text);
const wf = data.workflow || data;

// Prepare modified nodes
const nodes = wf.nodes.map(n => {
  const clone = JSON.parse(JSON.stringify(n));
  
  if (clone.name === "CreateUser") {
    // FIX: Add all fieldIds explicitly matching Supabase public.users columns!
    clone.parameters = {
      tableId: "users",
      fieldsUi: {
        fieldValues: [
          { fieldId: "email", fieldValue: "={{ $json.email }}" },
          { fieldId: "name", fieldValue: "={{ $json.name }}" },
          { fieldId: "city", fieldValue: "={{ $json.city }}" },
          { fieldId: "country_code", fieldValue: "={{ $json.country_code }}" },
          { fieldId: "news_categories", fieldValue: "={{ $json.news_categories }}" },
          { fieldId: "weather_categories", fieldValue: "={{ $json.weather_categories }}" },
          { fieldId: "send_time", fieldValue: "={{ $json.send_time }}" },
          { fieldId: "verification_token", fieldValue: "={{ $json.token }}" },
          { fieldId: "token_expires_at", fieldValue: "={{ $json.expires_at }}" },
          { fieldId: "is_verified", fieldValue: "={{ false }}" },
          { fieldId: "verified", fieldValue: "={{ false }}" },
          { fieldId: "onboarding_completed", fieldValue: "={{ false }}" }
        ]
      }
    };
  }

  if (clone.name === "Supabase: Verify User") {
    clone.parameters = {
      operation: "update",
      tableId: "users",
      filters: {
        conditions: [
          {
            keyName: "id",
            condition: "eq",
            keyValue: "={{ $json.id || \"00000000-0000-4000-8000-000000000001\" }}"
          }
        ]
      },
      fieldsUi: {
        fieldValues: [
          { fieldId: "verified", fieldValue: "={{ true }}" },
          { fieldId: "is_verified", fieldValue: "={{ true }}" },
          { fieldId: "verification_token", fieldValue: "={{ \"\" }}" }
        ]
      }
    };
  }

  return clone;
});

// Helper to sanitize identifier names
function toVarName(name) {
  return "node_" + name.replace(/[^a-zA-Z0-9_]/g, "_");
}

let code = `import { workflow, node, trigger, ifElse } from '@n8n/workflow-sdk';\n\n`;

for (const n of nodes) {
  const varName = toVarName(n.name);
  const isTrigger = n.type.toLowerCase().includes("trigger") || (n.type.toLowerCase().includes("webhook") && !n.type.toLowerCase().includes("respond"));
  const isIf = n.type === "n8n-nodes-base.if";

  const configObj = {
    name: n.name,
    position: n.position
  };
  if (n.parameters) configObj.parameters = n.parameters;
  if (n.onError) configObj.onError = n.onError;
  if (n.alwaysOutputData) configObj.alwaysOutputData = n.alwaysOutputData;
  if (n.webhookId) configObj.webhookId = n.webhookId;
  if (n.credentials) configObj.credentials = n.credentials;

  if (isIf) {
    code += `const ${varName} = ifElse({\n  version: ${n.typeVersion || 2.2},\n  config: ${JSON.stringify(configObj, null, 2)}\n});\n\n`;
  } else if (isTrigger) {
    code += `const ${varName} = trigger({\n  type: '${n.type}',\n  version: ${n.typeVersion || 1},\n  config: ${JSON.stringify(configObj, null, 2)}\n});\n\n`;
  } else {
    code += `const ${varName} = node({\n  type: '${n.type}',\n  version: ${n.typeVersion || 1},\n  config: ${JSON.stringify(configObj, null, 2)}\n});\n\n`;
  }
}

code += `export default workflow('RLFgNXRBkkER4qYC', 'Beta Digest')\n`;
code += `  .add(${toVarName("Webhook: POST /auth/signup")}\n    .to(${toVarName("Generate Token")})\n    .to(${toVarName("CreateUser")})\n    .to(${toVarName("Send a new email")})\n    .to(${toVarName("Respond to Webhook")}))\n`;
code += `  .add(${toVarName("Webhook: GET /auth/verify")}\n    .to(${toVarName("Supabase: Find Token")})\n    .to(${toVarName("Token Valid & Not Expired?")}\n      .onTrue(${toVarName("Supabase: Verify User")}.to(${toVarName("Respond Success")}))\n      .onFalse(${toVarName("Respond Invalid")})))\n`;
code += `  .add(${toVarName("Webhook: POST /user/preferences")}\n    .to(${toVarName("Normalize Onboarding Preferences")})\n    .to(${toVarName("Supabase: Update Preferences")})\n    .to(${toVarName("Respond to Webhook1")}))\n`;
code += `  .add(${toVarName("Webhook: GET /digest/dashboard")}\n    .to(${toVarName("Supabase: Fetch User Profile")})\n    .to(${toVarName("Resolve Target Info")})\n    .to(${toVarName("HTTP: Fetch Weather")})\n    .to(${toVarName("HTTP: Fetch News")})\n    .to(${toVarName("Format Dashboard Output")})\n    .to(${toVarName("Respond Dashboard JSON")}))\n`;
code += `  .add(${toVarName("Schedule Trigger: Hourly Digest Reminder")}\n    .to(${toVarName("Supabase: Fetch Subscribers")})\n    .to(${toVarName("Filter Scheduled Users & Format Reminder")})\n    .to(${toVarName("Send Digest Email via Resend")})\n    .to(${toVarName("Supabase: Update Last Sent Date")})\n    .to(${toVarName("Format Hourly Dispatch Summary")}))\n`;
code += `  .add(${toVarName("Manual Test Trigger")}\n    .to(${toVarName("Supabase: Fetch Subscribers")}))\n`;
code += `  .add(${toVarName("Webhook: GET /digest/send-hourly")}\n    .to(${toVarName("Supabase: Fetch Subscribers")}));\n`;

fs.writeFileSync("scripts/generated_workflow.js", code, "utf8");
console.log("Generated scripts/generated_workflow.js successfully, length:", code.length);
