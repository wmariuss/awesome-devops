// Refreshes GitHub data for every entry in README.md, in two steps:
//
// 1. Find repositories. Entries that link to github.com use that repo. Entries that
//    link to a project website are looked up with GitHub search: a repo matches when
//    its homepage is on the same domain as the website and its name is the tool's
//    name. Only open source entries are looked up, and archived repos never match. Results (including "no repo found") are saved in src/data/repos-auto.json
//    and re-checked after 30 days.
//    src/data/repos.json holds manual corrections and always wins.
// 2. Fetch stars, forks, issues, license, language, last push and archived status
//    into src/data/github.json.
//
// Usage: GITHUB_TOKEN=... node scripts/fetch-github.mjs
// Without a token GitHub allows 10 searches and 60 API calls per hour, so most
// entries keep their previous values. Failed lookups always keep previous values.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseReadme, repoFromUrl, resolveRepo, WEBSITE_DIR } from '../src/lib/readme.mjs';

const DATA = path.join(WEBSITE_DIR, 'src/data');
const readJson = (f, fallback) => { try { return JSON.parse(readFileSync(path.join(DATA, f), 'utf8')); } catch { return fallback; } };
const writeJson = (f, data) => writeFileSync(path.join(DATA, f), JSON.stringify(data, null, 1) + '\n');
const sortKeys = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));

const SELF_REPO = 'wmariuss/awesome-devops';
const RECHECK_DAYS = 30;
const token = process.env.GITHUB_TOKEN;
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'awesome-devops-site' };
if (token) headers.Authorization = `Bearer ${token}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const manual = readJson('repos.json', {});
const auto = readJson('repos-auto.json', {});
const previous = readJson('github.json', { repos: {} });
const { tools, learn } = parseReadme();
const entries = [...tools, ...learn.map((l) => ({ ...l, name: l.title }))];

// Step 1: find repositories for website links.
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
const baseDomain = (h) => h.split('.').slice(-2).join('.');
const sameSite = (a, b) => !!a && !!b && (a === b || baseDomain(a) === baseDomain(b));
// The repo name must be the tool name, or one of its words: "Apache Mesos" -> mesos.
// This rejects docs, SDK and sample repos that also list the company website.
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const nameMatches = (tool, repo) => {
  const r = norm(repo);
  return r === norm(tool) || tool.split(/[\s/()]+/).map(norm).filter((w) => w.length > 1).includes(r);
};

async function search(name, host) {
  const q = encodeURIComponent(`${name.replace(/[^\w .-]/g, ' ').trim()} in:name`);
  const res = await fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&per_page=10`, { headers });
  if (res.status === 403 || res.status === 429) return { limited: true };
  if (!res.ok) return { error: res.status };
  const { items = [] } = await res.json();
  const hit = items.find((r) => !r.fork && !r.archived && sameSite(hostOf(r.homepage || ''), host) && nameMatches(name, r.name));
  return { repo: hit ? hit.full_name : null };
}

const now = Date.now();
const toResolve = entries.filter((e) => {
  if (manual[e.url] !== undefined || repoFromUrl(e.url)) return false;
  // Only open source entries: a SaaS product's public repo is usually a CLI or an
  // issue tracker, and its stars would misrepresent the product.
  if (!e.tags?.includes('oss')) return false;
  const a = auto[e.url];
  return !a || now - Date.parse(a.checked) > RECHECK_DAYS * 864e5;
});
let found = 0, none = 0;
for (const e of toResolve) {
  const host = hostOf(e.url);
  if (!host || host === 'github.com') continue;
  let r;
  try { r = await search(e.name, host); } catch (err) { r = { error: err.message }; }
  if (r.limited) { console.warn('GitHub search rate limit reached; remaining lookups wait for the next run.'); break; }
  if (r.error) { console.warn(`${e.name}: search failed (${r.error})`); continue; }
  auto[e.url] = { repo: r.repo, checked: new Date().toISOString().slice(0, 10) };
  writeJson('repos-auto.json', sortKeys(auto)); // save progress as we go
  r.repo ? found++ : none++;
  if (r.repo) console.log(`  ${e.name} -> ${r.repo}`);
  await sleep(token ? 2100 : 6500); // search API: 30/min with a token, 10/min without
}
// Drop entries that are no longer in the README.
const urls = new Set(entries.map((e) => e.url));
for (const u of Object.keys(auto)) if (!urls.has(u)) delete auto[u];
writeJson('repos-auto.json', sortKeys(auto));
console.log(`Repo lookup: ${found} found, ${none} without a repo, ${toResolve.length - found - none} pending.`);

// Step 2: fetch repository data.
const repos = [...new Set(entries.map((e) => resolveRepo(e.url, manual, auto)).filter(Boolean).concat(SELF_REPO))];
let rateLimited = false;
async function fetchRepo(repo) {
  if (rateLimited) return null;
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (res.status === 403 || res.status === 429) {
    rateLimited = true;
    console.warn(`GitHub rate limit reached at ${repo}; keeping cached values for the rest.`);
    return null;
  }
  if (!res.ok) { console.warn(`${repo}: HTTP ${res.status}`); return null; }
  const j = await res.json();
  const license = j.license?.spdx_id;
  return {
    stars: j.stargazers_count,
    forks: j.forks_count,
    issues: j.open_issues_count,
    license: license && license !== 'NOASSERTION' ? license : null,
    lang: j.language || null,
    pushed: j.pushed_at,
    archived: !!j.archived,
  };
}

const result = {};
let updated = 0;
const queue = [...repos];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const repo = queue.shift();
    let data = null;
    try { data = await fetchRepo(repo); } catch (e) { console.warn(`${repo}: ${e.message}`); }
    if (data) { result[repo] = data; updated++; }
    else if (previous.repos?.[repo]) result[repo] = previous.repos[repo];
  }
}));

writeJson('github.json', {
  fetchedAt: updated ? new Date().toISOString().replace(/\.\d+Z$/, 'Z') : previous.fetchedAt,
  repos: sortKeys(result),
});
console.log(`GitHub data: ${updated} refreshed, ${Object.keys(result).length - updated} cached, ${repos.length - Object.keys(result).length} missing.`);
