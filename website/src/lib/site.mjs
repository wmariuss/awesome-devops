// Builds the site's data model from README.md + GitHub metadata + small enrichment files.
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseReadme, resolveRepo, ROOT_DIR, WEBSITE_DIR } from './readme.mjs';
import { MONTHS, TIER_LABEL, slug } from './format.mjs';

export * from './format.mjs';

const DATA = path.join(WEBSITE_DIR, 'src/data');
const PUBLIC = path.join(WEBSITE_DIR, 'public');
const readJson = (f, fallback) => { try { return JSON.parse(readFileSync(path.join(DATA, f), 'utf8')); } catch { return fallback; } };

const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

// The site model is built once and reused for every page. The cache is keyed on the
// modification times of its source files, so the dev server picks up README.md
// changes (for example after a git pull) instead of serving the old data.
const SOURCES = [
  path.join(ROOT_DIR, 'README.md'),
  ...['repos.json', 'repos-auto.json', 'learn-topics.json', 'github.json'].map((f) => path.join(DATA, f)),
];
const stamp = () => SOURCES.map((f) => { try { return statSync(f).mtimeMs; } catch { return 0; } }).join(':');

let cache;
let cacheStamp;
export function getSite() {
  const now = stamp();
  if (cache && cacheStamp === now) return cache;
  cacheStamp = now;
  const { categories, tools: rawTools, learn: rawLearn, errors } = parseReadme();
  if (errors.length) throw new Error('README.md problems:\n' + errors.join('\n'));

  const repoOverrides = readJson('repos.json', {});
  const repoAuto = readJson('repos-auto.json', {});
  const learnTopics = readJson('learn-topics.json', {});
  const gh = readJson('github.json', { repos: {} });
  const ghRepos = Object.fromEntries(Object.entries(gh.repos || {}).map(([k, v]) => [k.toLowerCase(), v]));
  const fetchedAt = gh.fetchedAt ? new Date(gh.fetchedAt) : new Date();
  const nowM = fetchedAt.getUTCFullYear() * 12 + fetchedAt.getUTCMonth();
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const seen = {};
  const tools = rawTools.map((t) => {
    let id = slug(t.name);
    if (seen[id]) id += '-' + t.catId;
    seen[id] = 1;
    const oss = t.tags.includes('oss');
    const free = t.tags.includes('free');
    const paid = t.tags.includes('paid');
    const tier = oss ? 'oss' : free ? 'freemium' : 'paid';
    const repo = resolveRepo(t.url, repoOverrides, repoAuto);
    const g = repo ? ghRepos[repo.toLowerCase()] : null;
    let host = '';
    try { host = new URL(t.url).hostname.replace(/^www\./, ''); } catch {}
    let age = null, activeLabel = null;
    if (g?.pushed) {
      const d = new Date(g.pushed);
      age = nowM - (d.getUTCFullYear() * 12 + d.getUTCMonth());
      activeLabel = MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
    }
    const archived = !!g?.archived;
    const status = archived ? 'Archived' : age != null && age > 24 ? 'Unmaintained' : null;
    const cat = catMap[t.catId];
    const icon = existsSync(path.join(PUBLIC, 'icons', host + '.png')) ? `/icons/${host}.png` : null;
    const desc = cap(t.desc);
    return {
      id, name: t.name, url: t.url, desc, cat: t.catId, catName: cat.name, group: t.group, line: t.line,
      tier, paidPlan: paid, freePlan: free || oss, selfHost: oss || t.tags.includes('self-hosted'),
      repo: repo || null, stars: g?.stars ?? null, forks: g?.forks ?? null, issues: g?.issues ?? null,
      license: g?.license && g.license !== 'NOASSERTION' && g.license !== 'Other' ? g.license : null,
      lang: g?.lang || null, age, activeLabel, archived, status, hasGh: !!g,
      host, letter: t.name[0].toUpperCase(), icon,
      search: [t.name, desc, cat.name, repo, g?.lang, g?.license, host, TIER_LABEL[tier]].filter(Boolean).join(' ').toLowerCase(),
    };
  });

  const learn = rawLearn.map((l) => ({ ...l, desc: cap(l.desc), topics: learnTopics[l.url] || [] }));

  const self = ghRepos['wmariuss/awesome-devops'];
  cache = {
    categories, tools, learn, fetchedAt: fetchedAt.toISOString(),
    fetchedLabel: MONTHS[fetchedAt.getUTCMonth()] + ' ' + fetchedAt.getUTCDate(),
    repoStars: self?.stars ?? null,
    stats: {
      tools: tools.length,
      categories: categories.length,
      oss: tools.filter((t) => t.tier === 'oss').length,
      self: tools.filter((t) => t.selfHost).length,
    },
  };
  return cache;
}

