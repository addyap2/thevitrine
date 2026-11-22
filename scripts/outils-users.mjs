// Builds the OUTILS_USERS value for the private tools (/outils/).
// Asks for each person's password without showing it, and prints only the
// salted scrypt hashes, never the passwords.
//
//   node scripts/outils-users.mjs            → antony and julien
//   node scripts/outils-users.mjs antony     → just one person
//
// Then store the printed value in Vercel (Production and Preview):
//   vercel env add OUTILS_USERS production
import crypto from "node:crypto";
import { hashPassword } from "../api/outils-login.js";

const names = process.argv.slice(2).length ? process.argv.slice(2) : ["antony", "julien"];

function askHidden(question) {
  return new Promise(resolve => {
    const { stdin, stdout } = process;
    stdout.write(question);
    stdin.setRawMode(true); stdin.resume(); stdin.setEncoding("utf8");
    let value = "";
    const onData = ch => {
      if (ch === "\r" || ch === "\n" || ch === "\u0004") {
        stdin.setRawMode(false); stdin.pause(); stdin.off("data", onData); stdout.write("\n"); resolve(value);
      } else if (ch === "\u0003") { process.exit(1); }
      else if (ch === "\u007f") { value = value.slice(0, -1); }
      else { value += ch; }
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
    if (password.length < 12) { console.log("  Too short, try again."); continue; }
    if ((await askHidden("  Again: ")) !== password) { console.log("  They don't match, try again."); continue; }
    break;
  }
  const salt = crypto.randomBytes(16).toString("base64url");
  entries.push(`${name}:${salt}:${await hashPassword(password, salt)}`);
}
console.log("\nOUTILS_USERS value:\n");
console.log(entries.join(";"));
