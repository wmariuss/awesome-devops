// Downloads a 64px favicon for every tool host into public/icons/{host}.png so the
// site serves its own copies. Hosts without a favicon fall back to a letter tile.
// Existing files are kept; pass --force to download them again.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseReadme, WEBSITE_DIR } from '../src/lib/readme.mjs';

const DIR = path.join(WEBSITE_DIR, 'public/icons');
const force = process.argv.includes('--force');
mkdirSync(DIR, { recursive: true });

const hosts = [...new Set(parseReadme().tools.map((t) => {
  try { return new URL(t.url).hostname.replace(/^www\./, ''); } catch { return null; }
}).filter(Boolean))];

let saved = 0, missing = 0, kept = 0;
const queue = hosts.filter((h) => {
  if (!force && existsSync(path.join(DIR, h + '.png'))) { kept++; return false; }
  return true;
});
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const host = queue.shift();
    try {
      const res = await fetch(`https://www.google.com/s2/favicons?domain=${host}&sz=64`);
      if (!res.ok) { missing++; continue; }
      writeFileSync(path.join(DIR, host + '.png'), Buffer.from(await res.arrayBuffer()));
      saved++;
    } catch { missing++; }
  }
}));
console.log(`Icons: ${saved} downloaded, ${kept} cached, ${missing} without a favicon.`);
