import { sha256Hex } from '../lib/sha256';

export async function sha256(text) {
  if (crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return sha256Hex(text);
}

export function makeSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashAdminPassword(username, password, salt) {
  return sha256(`${salt}:${username.trim().toLowerCase()}:${password}`);
}

export const safeEq = (a, b) =>
  a.length === b.length &&
  [...a].reduce((acc, c, i) => acc | (c.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;
