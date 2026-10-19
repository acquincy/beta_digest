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
    const dataLines = text.split('\n').filter(l => l.startsWith('data: '));
    if (dataLines.length > 0) {
      const jsonStr = dataLines[0].slice(6);
      return JSON.parse(jsonStr);
    }
    return JSON.parse(text);
  }

  const workflowId = 'MIu6TbUDD8zKMicJ';
  console.log('1. Validating workflow...');
  const valResult = await callMcpTool('validate_workflow', { code });
  console.log('Validation:', valResult?.result?.content?.[0]?.text);

  console.log('2. Updating workflow ' + workflowId + '...');
  const updateResult = await callMcpTool('update_workflow', {
    workflowId,
    name: 'Beta Digest v2',
    description: 'Beta Digest v2: Redesigned dark-theme emails, link safety, session verification, secure preferences and dashboard endpoints.',
    code
  });
  console.log('Update Result:', JSON.stringify(updateResult?.result?.content?.[0]?.text || updateResult, null, 2));

  console.log('3. Fetching workflow details to verify connections...');
  const details = await callMcpTool('get_workflow_details', { workflowId });
  const rawDetails = details?.result?.content?.[0]?.text;
  let parsedDetails = null;
  try {
    parsedDetails = JSON.parse(rawDetails);
  } catch (e) {
    parsedDetails = rawDetails;
  }
  
  if (parsedDetails && (parsedDetails.connections || parsedDetails.workflow?.connections)) {
    const conns = parsedDetails.connections || parsedDetails.workflow?.connections;
    console.log('Connections verified! Total connection keys:', Object.keys(conns).length);
    console.log('Dashboard flow connections:');
    console.log('HTTP: Fetch Live News ->', JSON.stringify(conns['HTTP: Fetch Live News']));
    console.log('Format Dashboard JSON ->', JSON.stringify(conns['Format Dashboard JSON']));
  }

  console.log('4. Publishing workflow...');
  const pubResult = await callMcpTool('publish_workflow', { workflowId });
  console.log('Publish result:', JSON.stringify(pubResult?.result?.content?.[0]?.text || pubResult, null, 2));

  console.log('Finished successfully!');
}

main().catch(err => {
  console.error('Error deploying:', err);
  process.exit(1);
});
