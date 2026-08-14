// ============================================================
// BAYNA | بينّا — seed the bundled content into Supabase
//
// One-time, LOCAL script. Uses the SERVICE role key (bypasses
// RLS) so it works even before `supabase/init.sql` is run.
// NEVER commit the service role key and never ship it to the
// browser — this script is the only legit place for it.
//
//   SERVICE_ROLE_KEY=... node scripts/seed-db.mjs
//   SERVICE_ROLE_KEY=... node scripts/seed-db.mjs --wipe   (delete all rows in the 5 tables first)
//
// The key can also live in a local, git-ignored `.env.seed` file.
// ============================================================

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { memories } from '../src/data/memories.js';
import { songs } from '../src/data/songs.js';
import { letters } from '../src/data/letters.js';
import { chapters } from '../src/data/chapters.js';
import { START_DATE, NAMES, STORY_COUNT } from '../src/data/siteConfig.js';
import {
  memoryToRow,
  songToRow,
  letterToRow,
  chapterToRow,
} from '../src/lib/adapters.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

function env() {
  const entries = {}; // key -> value
  for (const p of [join(root, '.env.seed'), join(root, '.env')]) {
    try {
      const txt = readFileSync(p, 'utf8');
      for (const line of txt.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (m && !m[2].startsWith('#')) entries[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    } catch {
      /* file may not exist */
    }
  }
  return entries;
}

const e = env();
const url = process.env.SUPABASE_URL || e.VITE_SUPABASE_URL;
const roleKey = process.env.SERVICE_ROLE_KEY || e.SERVICE_ROLE_KEY;

if (!url || !roleKey) {
  console.error('Missing credentials. Set SERVICE_ROLE_KEY and SUPABASE_URL');
  console.error('(env vars, or a local git-ignored .env.seed like VITE_SUPABASE_URL=... / SERVICE_ROLE_KEY=...).');
  process.exit(1);
}

const headers = {
  apikey: roleKey,
  Authorization: `Bearer ${roleKey}`,
  'Content-Type': 'application/json',
};

async function count(table) {
  const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, { headers });
  if (!res.ok) throw new Error(`GET ${table}: ${res.status} ${await res.text()}`);
  return (await res.json()).length;
}

async function insertAll(table, rows) {
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`POST ${table}: ${res.status} ${await res.text()}`);
}

async function deleteAll(table) {
  const res = await fetch(`${url}/rest/v1/${table}?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error(`DELETE ${table}: ${res.status} ${await res.text()}`);
}

async function upsertConfig() {
  const res = await fetch(`${url}/rest/v1/site_config?on_conflict=id`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify([
      {
        id: 1,
        start_date: START_DATE,
        names_ar: NAMES.ar,
        names_en: NAMES.en,
        story_count: STORY_COUNT,
      },
    ]),
  });
  if (!res.ok) throw new Error(`POST site_config: ${res.status} ${await res.text()}`);
}

const wipe = process.argv.includes('--wipe');

const tables = [
  { table: 'memories', seed: memories, toRow: (m, i) => ({ sort: i, ...memoryToRow(m) }) },
  { table: 'songs', seed: songs, toRow: (s, i) => ({ sort: i, ...songToRow(s) }) },
  { table: 'letters', seed: letters, toRow: (l, i) => ({ sort: i, ...letterToRow(l) }) },
  { table: 'chapters', seed: chapters, toRow: (c, i) => ({ sort: i, ...chapterToRow(c) }) },
];

console.log(`BAYNA seed → ${url}`);
for (const { table, seed, toRow } of tables) {
  const had = await count(table);
  if (wipe && had) {
    await deleteAll(table);
    console.log(`${table}: wiped ${had} old rows`);
  } else if (had) {
    console.log(`${table}: skipped (already has ${had} row(s)) — use --wipe to replace`);
    continue;
  }
  await insertAll(table, seed.map(toRow));
  console.log(`${table}: inserted ${seed.length} rows`);
}

await upsertConfig();
console.log('site_config: synced (start_date, names, story_count)');

console.log('\nDone. Next steps:');
console.log('  1. Run supabase/init.sql in the SQL editor so the dashboard can write (public policies).');
console.log('  2. Refresh the site/dashboard — real DB rows will now be used instead of the bundled fallback.');