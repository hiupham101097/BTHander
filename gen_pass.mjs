import { webcrypto as crypto } from 'node:crypto';
const encoder = new TextEncoder();
const hex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
const randomHex = (length = 32) => hex(crypto.getRandomValues(new Uint8Array(length)));

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return hex(bits);
}

async function run() {
    const salt = randomHex(16);
    const hash = await passwordHash("123@123NaN", salt);
    console.log(`UPDATE accounts SET password_hash='${hash}', password_salt='${salt}' WHERE email='admin@gmail.com';`);
}
run();
