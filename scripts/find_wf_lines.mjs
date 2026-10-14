import fs from "fs";

const lines = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/logs/transcript.jsonl", "utf8").split("\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("RLFgNXRBkkER4qYC")) {
    console.log(`Line ${i}`);
  }
}
