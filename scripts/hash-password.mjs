import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const username = process.argv[2] || 'bayna';
const password = process.argv[3];

if (!password) {
  console.log('usage: node scripts/hash-password.mjs [username] "your-password"');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = createHash('sha256').update(`${salt}:${username}:${password}`).digest('hex');

const file = path.join(import.meta.dirname, '..', 'src', 'dashboard', 'secret.js');
const module =
  `export const AUTH = {\n` +
  `  username: '${username}',\n` +
  `  salt: '${salt}',\n` +
  `  hash: '${hash}',\n` +
  `};\n`;

fs.writeFileSync(file, module);
console.log('wrote', file);
console.log('username :', username);
console.log('salt     :', salt);
console.log('hash     :', hash);