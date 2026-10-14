import fs from "fs";
const lines = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/logs/transcript.jsonl", "utf8").split("\n");
console.log(lines[393].slice(0, 1000));
console.log(lines[394].slice(0, 1000));
console.log(lines[396].slice(0, 1000));
