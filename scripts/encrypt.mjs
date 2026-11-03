// Encrypts the personal dashboard data so it can live on a public GitHub Pages site.
// Usage: DASH_PASS="your passphrase" node scripts/encrypt.mjs data.plain.json data.json
// The page decrypts it in the browser with the same passphrase (AES-GCM, PBKDF2 200k).
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const [, , inPath = "data.plain.json", outPath = "data.json"] = process.argv;
const pass = process.env.DASH_PASS;
if (!pass) { console.error("Set DASH_PASS first."); process.exit(1); }

const plain = readFileSync(inPath, "utf8");
JSON.parse(plain); // fail early on bad JSON

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 200000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plain)));

const b64 = (u) => Buffer.from(u).toString("base64");
writeFileSync(outPath, JSON.stringify({ v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct) }) + "\n");
console.log("Wrote " + outPath);
