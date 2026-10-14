const n8nBase = "https://n8n.srv1650803.hstgr.cloud";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzFlNWVkYS1jNzVmLTQ2MmUtOWM3OS1iMmQxN2ZmMmQ4YmMiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjA1NjNlMDg2LTJjNzQtNDY5Yy1hZjJjLWNmNThmNmQ2NTU5ZSIsImlhdCI6MTc5MTQ3MzA4MX0.P0F7olkn6hqACVWo_46GCiBkUYZjpm3F2IBASO6KRkY";

async function testApi() {
  const res = await fetch(`${n8nBase}/api/v1/workflows/RLFgNXRBkkER4qYC`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-N8N-API-KEY": token
    }
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text.slice(0, 300));
}

testApi().catch(console.error);
