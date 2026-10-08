import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function getAllSourceFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git" && file !== "test") {
        getAllSourceFiles(fullPath, fileList);
      }
    } else if (/\.(tsx?|jsx?|css)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

test("source code sweep: no forbidden terms in app, components, lib", () => {
  const rootDirs = [
    path.join(process.cwd(), "app"),
    path.join(process.cwd(), "components"),
    path.join(process.cwd(), "lib"),
  ];

  const sourceFiles = rootDirs.flatMap((d) => getAllSourceFiles(d));
  assert.ok(sourceFiles.length > 0, "Source files must exist to verify");

  const forbiddenWordsRegex = /\b(sms|text message|texting|phone|mobile number|rcs|dial code|data rates)\b/i;

  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, "utf-8");

    // Check for forbidden terms
    const wordMatch = content.match(forbiddenWordsRegex);
    if (wordMatch) {
      assert.fail(`Forbidden term "${wordMatch[0]}" found in file: ${filePath}`);
    }

    // Check for --sms-green CSS variable token
    if (content.includes("--sms-green")) {
      assert.fail(`Forbidden token "--sms-green" found in file: ${filePath}`);
    }

    // Check for literal arrow in JSX strings (excluding comments)
    // We check for "→" character
    if (content.includes("→")) {
      assert.fail(`Literal arrow character "→" found in file: ${filePath}`);
    }
  }
});
