import fs from "fs";

const lines = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/logs/transcript_full.jsonl", "utf8").split("\n");
console.log("378:", lines[378].slice(0, 300));
console.log("379:", lines[379].slice(0, 300));
console.log("381:", lines[381].slice(0, 300));
console.log("384:", lines[384].slice(0, 300));
