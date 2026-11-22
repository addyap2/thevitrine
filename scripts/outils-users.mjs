// Sets the passwords for the private tools (/outils/).
// Asks for each person's password without showing it (typing or pasting both
// work), hashes it with scrypt, and by default saves the result straight to
// Vercel as OUTILS_USERS for Production, so nothing has to be copied by hand.
// Passwords are never printed or stored, only salted hashes.
//
//   npm run outils:users                 → antony and julien, saved to Vercel
//   npm run outils:users -- --print      → print the value instead of saving it
//   npm run outils:users -- antony       → only some names (replaces the whole list)
//
// After saving, production needs a redeploy to pick it up (the script says how).
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { hashPassword } from "../api/outils-login.js";

const args = process.argv.slice(2);
const printOnly = args.includes("--print");
const names = args.filter(a => !a.startsWith("--"));
if (!names.length) names.push("antony", "julien");

/** Reads a line without echoing it. Strips the invisible codes terminals add around pasted text. */
export function cleanInput(raw) {
  return raw
    .replace(/\x1b\[20[01]~/g, "")          // bracketed-paste markers
    .replace(/\x1b\[[0-9;?]*[A-Za-z~]/g, "") // any other escape sequence (arrow keys…)
    .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, ""); // remaining control characters
}

function askHidden(question) {
  return new Promise(resolve => {
    const { stdin, stdout } = process;
    stdout.write(question);
    stdin.setRawMode(true); stdin.resume(); stdin.setEncoding("utf8");
    let raw = "";
    const finish = () => {
      stdin.setRawMode(false); stdin.pause(); stdin.off("data", onData); stdout.write("\n");
      resolve(cleanInput(raw).normalize("NFC"));
    };
    const onData = chunk => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n" || ch === "\u0004") return finish();
        if (ch === "\u0003") { stdout.write("\n"); process.exit(1); }
        if (ch === "\u007f" || ch === "\b") { raw = [...cleanInput(raw)].slice(0, -1).join(""); continue; }
        raw += ch;
      }
    };
    stdin.on("data", onData);
  });
}

const entries = [];
for (const name of names) {
  if (!/^[a-z0-9-]{1,32}$/.test(name)) { console.error(`Invalid name: ${name}`); process.exit(1); }
  let password;
  for (;;) {
    password = await askHidden(`Password for ${name} (12+ characters): `);
    if (password.length < 12) { console.log(`  Too short (${password.length} characters), try again.`); continue; }
    if ((await askHidden("  Again: ")) !== password) { console.log("  They don't match, try again."); continue; }
    console.log(`  OK (${password.length} characters).`);
    break;
  }
  const salt = crypto.randomBytes(16).toString("base64url");
  entries.push(`${name}:${salt}:${await hashPassword(password, salt)}`);
}
const value = entries.join(";");

if (printOnly) {
  console.log("\nOUTILS_USERS value:\n\n" + value);
  process.exit(0);
}

console.log("\nSaving OUTILS_USERS to Vercel (Production)…");
const add = spawnSync("vercel", ["env", "add", "OUTILS_USERS", "production", "--sensitive", "--force", "--yes"], { input: value, encoding: "utf8" });
if (add.status !== 0) {
  console.error("Vercel didn't accept it:\n" + (add.stderr || add.stdout));
  console.error("\nRun again with --print and add the value by hand.");
  process.exit(1);
}
console.log(`Saved for: ${names.join(", ")}.`);
console.log("Production picks it up on the next deploy. Ask Claude to redeploy, or run: vercel redeploy thevitrine.fr");
