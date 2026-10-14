import fs from "fs";

const text = fs.readFileSync("C:/Users/emeka/.gemini/antigravity/brain/5b548f89-378f-4b47-bb96-7b4535652b70/.system_generated/steps/483/output.txt", "utf8");
const data = JSON.parse(text);
const wf = data.workflow || data;

const cu = wf.nodes.find(n => n.name === "CreateUser");
console.log("CreateUser node:", JSON.stringify(cu, null, 2));

const resend = wf.nodes.find(n => n.name === "Send a new email");
console.log("Send a new email node:", JSON.stringify(resend, null, 2));
