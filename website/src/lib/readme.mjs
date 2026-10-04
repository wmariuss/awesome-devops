// Parses the repository README.md, the single source of truth for the list.
//
// Entry format:
//   - [Name](https://url) - Description. `oss` `paid`
// Tags: `oss` open source, `free` free plan, `paid` paid offering,
// `self-hosted` runs on your own infrastructure without being open source.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Repository root: the nearest directory above the working directory holding README.md.
function findRoot(dir = process.cwd()) {
  if (existsSync(path.join(dir, 'README.md')) && existsSync(path.join(dir, 'website'))) return dir;
  const up = path.dirname(dir);
  if (up === dir) throw new Error('Could not find the repository root (README.md next to website/).');
  return findRoot(up);
}
const ROOT = findRoot();
export const WEBSITE_DIR = path.join(ROOT, 'website');
export const README_PATH = path.join(ROOT, 'README.md');
export const ROOT_DIR = ROOT;

// Stable short ids for category URLs (/category/{id}/). Keyed by README heading.
export const CATEGORY_IDS = {
  'Cloud Platforms': 'cloud',
  'Open Source Cloud Platforms': 'osscloud',
  'Operating Systems': 'os',
  'Package Management & System Configuration': 'pkg',
  'Distributed Filesystems': 'fs',
  'Applications Platforms': 'apps',
  'Internal Developer Platforms': 'idp',
  'Container Image Registry': 'registry',
  'Automation & Orchestration': 'automation',
  'Productivity Tools': 'productivity',
  'Continuous Integration & Delivery': 'cicd',
  'Source Code Management': 'scm',
  'Web Servers': 'web',
  'SSL': 'ssl',
  'Databases': 'db',
  'Observability & Monitoring': 'obs',
  'Service Discovery & Service Mesh': 'mesh',
  'Chaos Engineering': 'chaos',
  'API Gateway': 'gateway',
  'Code review': 'review',
  'Distributed Messaging': 'msg',
  'Programming Languages': 'lang',
  'Chat and ChatOps': 'chat',
  'Secret Management': 'secrets',
  'Security': 'security',
  'Sharing': 'sharing',
  'VPN': 'vpn',
};

// Display names where the README heading differs from the title-cased name.
const CATEGORY_NAMES = { 'Code review': 'Code Review' };

// "### Sub-heading" under "## Resources" -> Learn type.
export const LEARN_TYPES = {
  'Books': 'book',
  'Conferences': 'conference',
  'Blogs': 'blog',
  'DevOps Roadmap': 'roadmap',
  'Online Platforms': 'playground',
};

const TAGS = new Set(['oss', 'free', 'paid', 'self-hosted']);
const ENTRY = /^(\s*)- \[([^\]]+)\]\(([^)\s]+)\)\s*(?:[-:]\s*)?(.*)$/;

const stripMd = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/`([^`]+)`/g, '$1').trim();

function splitTags(rest) {
  const tags = [];
  let text = rest.trim();
  for (;;) {
    const m = text.match(/\s*`([a-z-]+)`\s*$/);
    if (!m || !TAGS.has(m[1])) break;
    tags.unshift(m[1]);
    text = text.slice(0, m.index).trim();
  }
  return { tags, text: stripMd(text) };
}

export function parseReadme(source = readFileSync(README_PATH, 'utf8')) {
  const categories = [];
  const tools = [];
  const learn = [];
  const errors = [];

  let section = null; // current "## " heading
  let sub = null; // "### " heading, or a "- Group" list label
  let pendingDesc = false;

  source.split('\n').forEach((raw, i) => {
    const line = i + 1;
    if (raw.startsWith('## ')) {
      section = raw.slice(3).trim();
      sub = null;
      pendingDesc = !!CATEGORY_IDS[section];
      if (pendingDesc) {
        categories.push({ id: CATEGORY_IDS[section], name: CATEGORY_NAMES[section] || section, desc: '' });
      } else if (!['Contents', 'Resources', 'Contributing'].includes(section)) {
        errors.push(`README.md:${line} unknown category "${section}" (add it to CATEGORY_IDS)`);
      }
      return;
    }
    if (raw.startsWith('### ')) { sub = raw.slice(4).trim(); return; }

    const blurb = raw.trim().match(/^\*([^*].*)\*$/);
    if (blurb && pendingDesc) { categories[categories.length - 1].desc = blurb[1]; pendingDesc = false; return; }

    const group = raw.match(/^- ([^[].*?):?\s*$/);
    if (group && CATEGORY_IDS[section]) { sub = group[1]; return; }

    const m = raw.match(ENTRY);
    if (!m || !section || section === 'Contents') return;
    const [, indent, name, url, rest] = m;
    const { tags, text } = splitTags(rest);

    if (section === 'Resources') {
      const type = LEARN_TYPES[sub];
      if (!type) { errors.push(`README.md:${line} unknown Resources group "${sub}"`); return; }
      let title = name, desc = text, meta = '';
      if (type === 'book' || type === 'conference') { meta = text.replace(/\.$/, ''); desc = ''; }
      if (type === 'book' && name.includes(': ')) {
        const at = name.indexOf(': ');
        title = name.slice(0, at);
        desc = name.slice(at + 2).replace(/\.?$/, '.');
      }
      learn.push({ title, url, type, desc, meta, free: tags.includes('free') || tags.includes('oss'), line });
      return;
    }

    const catId = CATEGORY_IDS[section];
    if (!catId) return;
    if (!tags.length) errors.push(`README.md:${line} "${name}" has no pricing tag (oss, free or paid)`);
    tools.push({ name, url, desc: text, catId, group: indent ? sub : null, tags, line });
  });

  return { categories, tools, learn, errors };
}

// GitHub's own pages that look like owner/repo paths.
const NOT_OWNERS = new Set(['features', 'about', 'pricing', 'marketplace', 'topics', 'orgs', 'sponsors', 'collections', 'enterprise', 'solutions']);

// owner/repo for github.com URLs, otherwise null.
export function repoFromUrl(url) {
  const m = url.match(/^https?:\/\/github\.com\/([^/#?]+)\/([^/#?]+)/);
  if (!m || NOT_OWNERS.has(m[1])) return null;
  return `${m[1]}/${m[2].replace(/\.git$/, '')}`;
}

// Repository for an entry: manual correction (repos.json), then the github.com link
// itself, then the auto-detected repo (repos-auto.json). A manual value of null
// means "this entry has no repository".
export function resolveRepo(url, manual = {}, auto = {}) {
  if (url in manual) return manual[url];
  return repoFromUrl(url) ?? auto[url]?.repo ?? null;
}
