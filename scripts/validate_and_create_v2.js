const fs = require('fs');

async function main() {
  const mcpConfig = JSON.parse(fs.readFileSync('C:\\Users\\emeka\\.gemini\\antigravity\\mcp_config.json', 'utf8'));
  const n8nConfig = mcpConfig.mcpServers['n8n-mcp'];
  const code = fs.readFileSync('scripts/v2_workflow.js', 'utf8');

  async function callMcpTool(name, args) {
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    };

    const res = await fetch(n8nConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        ...n8nConfig.headers
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    // Parse SSE lines or standard JSON
    const dataLines = text.split('\n').filter(l => l.startsWith('data: '));
    if (dataLines.length > 0) {
      const jsonStr = dataLines[0].slice(6);
      return JSON.parse(jsonStr);
    }
    return JSON.parse(text);
  }

  console.log('1. Validating workflow code...');
  const valResult = await callMcpTool('validate_workflow', { code });
  console.log('Validation Response:', JSON.stringify(valResult, null, 2));

  const contentText = valResult?.result?.content?.[0]?.text;
  let parsedValidation = null;
  try {
    parsedValidation = JSON.parse(contentText);
  } catch (e) {
    parsedValidation = contentText;
  }

  if (valResult?.result?.isError || (parsedValidation && parsedValidation.valid === false)) {
    console.error('Validation failed!', parsedValidation);
    process.exit(1);
  }

  console.log('2. Workflow is VALID! Creating workflow in n8n...');
  const createResult = await callMcpTool('create_workflow_from_code', {
    name: 'Beta Digest v2: Auth and Dashboard',
    description: 'Beta Digest v2: Loginless auth, session verification, secure preferences and dashboard endpoints with Header Auth.',
    code
  });

  console.log('Create Response:', JSON.stringify(createResult, null, 2));
}

main().catch(console.error);
