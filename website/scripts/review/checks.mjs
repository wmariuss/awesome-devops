// Deterministic checks for a pull request against README.md.
// Compares the base README with the pull request's README, finds added, changed and
// removed entries, and checks each new or changed entry. Only reads data: it never
// runs code from the pull request.
import { parseReadme, resolveRepo, repoFromUrl } from '../../src/lib/readme.mjs';

const MARKETING = /\b(best|blazing|revolutionary|world[- ]class|ultimate|amazing|awesome|game[- ]chang|cutting[- ]edge|next[- ]gen|#1|leading)\b/i;
const TRACKING = /[?&](utm_[a-z]+|ref|referrer|source|campaign|fbclid|gclid)=/i;
const MAX_DESC = 200;
const STALE_MONTHS = 24;
const MAX_NEW_ENTRIES = 5;
// Maturity: a tool must have a track record before it is listed. Changing these
// numbers? Update the "Maturity" rules in .github/instructions/readme.instructions.md
// and CONTRIBUTING.md too.
export const MATURITY = {
  minStars: 100,        // open source repositories
  minRepoMonths: 6,     // repository age
  minDomainMonths: 6,   // website domain age, when there is no repository
  minOwnerMonths: 6,    // age of the GitHub account or organization that owns the repo
  newAuthorDays: 30,    // pull request authors younger than this get a human review
};
const SENSITIVE_PATHS = /^(\.github\/|AGENTS\.md$|website\/scripts\/|website\/package(-lock)?\.json$|website\/astro\.config)/;
const REVIEW_RULES = /^(\.github\/copilot-instructions\.md|\.github\/instructions\/|AGENTS\.md|website\/scripts\/review\/|\.github\/workflows\/pr-review\.yml)/;
const UA = 'Mozilla/5.0 (compatible; awesome-devops-review/1.0; +https://awesome-devops.xyz)';

const PARKED = /\b(this domain (is|may be) for sale|buy this domain|domain is parked|parked free|parkingcrew|sedoparking|hugedomains|dan\.com|afternic)\b/i;
const monthsSince = (d) => (d ? Math.floor((Date.now() - new Date(d)) / (30.44 * 864e5)) : null);
const daysSince = (d) => (d ? Math.floor((Date.now() - new Date(d)) / 864e5) : null);
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
// Registrable domain (example.com, example.co.uk); good enough for RDAP lookups.
const registrable = (h) => {
  const p = h.split('.');
  const n = p.length > 2 && /^(co|com|net|org|ac|gov|edu)$/.test(p[p.length - 2]) && p[p.length - 1].length === 2 ? 3 : 2;
  return p.slice(-n).join('.');
};

const urlKey = (e) => e.url.replace(/\/+$/, '').toLowerCase();
// An entry's identity: the same tool can be listed in two sections (e.g. Kong).
const entryKey = (e) => `${urlKey(e)}|${(e.name || e.title).toLowerCase()}|${e.section}`;
const nameKey = (e) => (e.name || e.title).trim().toLowerCase();

function allEntries(parsed) {
  return [
    ...parsed.tools.map((t) => ({ ...t, kind: 'tool', section: t.catId })),
    ...parsed.learn.map((l) => ({ ...l, name: l.title, kind: 'learn', section: l.type, tags: l.free ? ['free'] : ['paid'] })),
  ];
}

async function fetchWithTimeout(url, opts = {}, ms = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ctrl.signal, redirect: 'follow' }); }
  finally { clearTimeout(timer); }
}

// Fetch the page, and keep a short text snapshot for the AI reviewer.
async function checkLink(url) {
  try {
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': UA, Accept: 'text/html,*/*' } });
    let snapshot = null;
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
      const html = (await res.text()).slice(0, 400_000);
      const pick = (re) => (html.match(re)?.[1] || '').replace(/\s+/g, ' ').trim();
      const text = html
        .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const repos = [...new Set([...html.matchAll(/https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+)/g)]
        .map((m) => repoFromUrl(m[0]))
        .filter(Boolean)
        .map((r) => r.replace(/\.git$/, '')))];
      snapshot = {
        title: pick(/<title[^>]*>([^<]*)<\/title>/i).slice(0, 200),
        description: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i).slice(0, 400),
        text: text.slice(0, 2500),
        textLength: text.length,
        parked: PARKED.test(text.slice(0, 20000)) || PARKED.test(html.slice(0, 20000)),
        repos: repos.slice(0, 20),
      };
    }
    return { status: res.status, finalUrl: res.url, snapshot };
  } catch (e) {
    return { status: 0, error: e.name === 'AbortError' ? 'timeout' : (e.cause?.code || e.message) };
  }
}

function ghHeaders(token) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'awesome-devops-review' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Number of items in a paginated list, read from the Link header of a per_page=1 request.
async function ghCount(url, token) {
  try {
    const res = await fetchWithTimeout(`${url}${url.includes('?') ? '&' : '?'}per_page=1`, { headers: ghHeaders(token) });
    if (!res.ok) return null;
    const last = (res.headers.get('link') || '').match(/[?&]page=(\d+)>; rel="last"/);
    if (last) return Number(last[1]);
    return (await res.json()).length;
  } catch { return null; }
}

export async function checkAccount(login, token) {
  try {
    const res = await fetchWithTimeout(`https://api.github.com/users/${login}`, { headers: ghHeaders(token) });
    if (!res.ok) return null;
    const j = await res.json();
    return { login: j.login, type: j.type, created: j.created_at, months: monthsSince(j.created_at), days: daysSince(j.created_at), publicRepos: j.public_repos, followers: j.followers };
  } catch { return null; }
}

async function checkRepo(repo, token) {
  try {
    const res = await fetchWithTimeout(`https://api.github.com/repos/${repo}`, { headers: ghHeaders(token) });
    if (res.status === 404) return { repo, found: false };
    if (!res.ok) return { repo, error: `HTTP ${res.status}` };
    const j = await res.json();
    const api = `https://api.github.com/repos/${j.full_name}`;
    const [contributors, releases, commits, owner] = await Promise.all([
      ghCount(`${api}/contributors?anon=1`, token),
      ghCount(`${api}/releases`, token),
      ghCount(`${api}/commits`, token),
      checkAccount(j.owner.login, token),
    ]);
    return {
      repo: j.full_name, found: true, archived: !!j.archived, fork: !!j.fork, private: !!j.private,
      stars: j.stargazers_count, forks: j.forks_count, watchers: j.subscribers_count, openIssues: j.open_issues_count,
      license: j.license?.spdx_id && j.license.spdx_id !== 'NOASSERTION' ? j.license.spdx_id : null,
      description: j.description || '', homepage: j.homepage || '', topics: j.topics || [],
      created: j.created_at, ageMonths: monthsSince(j.created_at),
      pushed: j.pushed_at, monthsSincePush: monthsSince(j.pushed_at),
      contributors, releases, commits, owner,
    };
  } catch (e) {
    return { repo, error: e.message };
  }
}

// Domain registration date from RDAP (free, no key). Not every TLD supports it.
async function checkDomain(url) {
  const domain = registrable(host(url));
  if (!domain || domain === 'github.com') return null;
  try {
    const res = await fetchWithTimeout(`https://rdap.org/domain/${domain}`, { headers: { Accept: 'application/rdap+json', 'User-Agent': 'awesome-devops-review' } }, 10000);
    if (!res.ok) return { domain, error: `HTTP ${res.status}` };
    const j = await res.json();
    const reg = (j.events || []).find((ev) => ev.eventAction === 'registration')?.eventDate;
    return { domain, registered: reg || null, ageMonths: monthsSince(reg) };
  } catch (e) {
    return { domain, error: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

// Pick the project's repository from the GitHub links on its website: the one whose
// name matches the entry name, or the only one.
function repoFromSite(name, repos = []) {
  const norm = (x) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n = norm(name);
  const own = repos.filter((r) => !/^(github|actions|features|orgs)\//i.test(r));
  return own.find((r) => { const [o, p] = r.split('/').map(norm); return p === n || (o === n && p.includes(n)); }) || null;
}

/**
 * Maturity and authenticity of one entry. Every finding is { level, message }.
 * Blocking findings mean the tool is not ready for the list yet.
 */
function maturity(e, { link, repo, domain }) {
  const out = [];
  const add = (level, message) => out.push({ level, check: 'maturity', message });
  const M = MATURITY;
  const oss = e.tags.includes('oss');

  if (link?.snapshot?.parked) add('blocking', 'The website looks like a parked or for-sale domain.');
  else if (link?.snapshot && link.snapshot.textLength < 150) add('warning', 'The website has almost no text; it may be a placeholder or a JavaScript-only page.');
  if (link?.finalUrl && host(link.finalUrl) && registrable(host(link.finalUrl)) !== registrable(host(e.url)) && !/github\.com$/.test(host(link.finalUrl))) {
    add('warning', `The link redirects to a different site: ${host(link.finalUrl)}.`);
  }

  if (e.kind === 'tool' && oss && !repo) add('human', 'Tagged `oss`, but no source repository was found on the website. Check the code is public, or add it to website/src/data/repos.json.');

  if (repo?.found) {
    const r = repo;
    if (r.fork) add('blocking', `${r.repo} is a fork. List the original project.`);
    if (r.ageMonths != null && r.ageMonths < M.minRepoMonths) add('blocking', `${r.repo} was created ${r.ageMonths === 0 ? 'this month' : `${r.ageMonths} month${r.ageMonths > 1 ? 's' : ''} ago`}; the list needs at least ${M.minRepoMonths} months of history.`);
    if (oss && r.stars < M.minStars) add('blocking', `${r.repo} has ${r.stars} stars; open source tools need at least ${M.minStars}.`);
    if (r.monthsSincePush != null && r.monthsSincePush > STALE_MONTHS) add('blocking', `${r.repo} has had no activity for ${r.monthsSincePush} months.`);
    if (r.owner && r.owner.months != null && r.owner.months < M.minOwnerMonths) add('blocking', `The GitHub ${r.owner.type === 'Organization' ? 'organization' : 'account'} ${r.owner.login} that owns the repository is ${r.owner.months} months old.`);
    if (r.contributors === 1) add('warning', `${r.repo} has a single contributor.`);
    if (r.commits != null && r.commits < 50) add('warning', `${r.repo} has only ${r.commits} commits.`);

    // Signs of bought or inflated stars: many stars, almost nobody forking, watching
    // or filing issues, or a very young repository with a lot of stars.
    if (r.stars >= 500 && r.forks / r.stars < 0.01 && (r.watchers ?? 0) < 5) add('human', `${r.repo} has ${r.stars} stars but only ${r.forks} forks and ${r.watchers ?? 0} watchers; the stars may be inflated.`);
    if (r.ageMonths != null && r.ageMonths < 12 && r.stars / Math.max(r.ageMonths, 1) > 2000 && (r.contributors ?? 0) < 5) add('human', `${r.repo} gained ${r.stars} stars in ${r.ageMonths || 'under one'} month${r.ageMonths === 1 ? '' : 's'} with ${r.contributors ?? '?'} contributors; check the stars are genuine.`);
  }

  if (domain?.ageMonths != null && domain.ageMonths < M.minDomainMonths) {
    // A young domain for an old, popular repository is a rebrand, not a red flag.
    const established = repo?.found && repo.ageMonths >= M.minRepoMonths && repo.stars >= M.minStars;
    add(established ? 'warning' : 'blocking', `The domain ${domain.domain} was registered ${domain.ageMonths} month${domain.ageMonths === 1 ? '' : 's'} ago.`);
  }
  return out;
}

/**
 * @param {object} input
 * @param {string} input.baseReadme  README.md on the base branch
 * @param {string} input.headReadme  README.md in the pull request
 * @param {string[]} input.files     paths changed by the pull request
 * @param {object} [input.repoMaps]  { manual, auto } repo mappings from the base branch
 * @param {string} [input.token]     GitHub token for API calls
 * @param {string} [input.author]   pull request author's GitHub login
 * @param {boolean} [input.network]  set false to skip link and repo checks
 */
export async function runChecks({ baseReadme, headReadme, files, repoMaps = {}, token, author, network = true }) {
  const blocking = [];
  const warnings = [];
  const human = [];

  // Brand-new accounts are how most spam and fake-project pull requests arrive.
  const authorAccount = network && author && author !== 'unknown' ? await checkAccount(author, token) : null;
  if (authorAccount?.days != null && authorAccount.days < MATURITY.newAuthorDays) {
    human.push(`The pull request author @${authorAccount.login} created their GitHub account ${authorAccount.days} day${authorAccount.days === 1 ? '' : 's'} ago.`);
  }

  const readmeChanged = files.includes('README.md');
  const otherFiles = files.filter((f) => f !== 'README.md');
  const rules = files.filter((f) => REVIEW_RULES.test(f));
  if (rules.length) human.push(`Changes the automated review rules: ${rules.map((f) => `\`${f}\``).join(', ')}. Copilot reads its instructions from this pull request's branch, so its review of this pull request cannot be trusted.`);
  const rest = otherFiles.filter((f) => !REVIEW_RULES.test(f));
  if (rest.length) {
    const sensitive = rest.filter((f) => SENSITIVE_PATHS.test(f));
    human.push(sensitive.length
      ? `Changes build, workflow or dependency files: ${sensitive.map((f) => `\`${f}\``).join(', ')}.`
      : `Changes files other than README.md: ${rest.slice(0, 8).map((f) => `\`${f}\``).join(', ')}${rest.length > 8 ? '…' : ''}.`);
  }

  const base = parseReadme(baseReadme);
  const head = parseReadme(headReadme);
  const headLines = headReadme.split('\n');
  for (const err of head.errors) blocking.push(err);

  const baseCats = base.categories.map((c) => c.id).join(',');
  const headCats = head.categories.map((c) => c.id).join(',');
  if (baseCats !== headCats) human.push('Adds, removes or reorders README sections.');

  const baseEntries = allEntries(base);
  const headEntries = allEntries(head);
  const baseByKey = new Map(baseEntries.map((e) => [entryKey(e), e]));
  const headByKey = new Map(headEntries.map((e) => [entryKey(e), e]));
  const baseLine = (e) => baseReadme.split('\n')[e.line - 1];

  const added = headEntries.filter((e) => !baseByKey.has(entryKey(e)));
  const changed = headEntries.filter((e) => {
    const b = baseByKey.get(entryKey(e));
    return b && baseLine(b).trim() !== headLines[e.line - 1].trim();
  });
  const removed = baseEntries.filter((e) => !headByKey.has(entryKey(e)));

  if (added.length > MAX_NEW_ENTRIES) human.push(`Adds ${added.length} entries; more than ${MAX_NEW_ENTRIES} in one pull request needs a closer look.`);
  if (removed.length > 3) human.push(`Removes ${removed.length} entries.`);

  const catName = Object.fromEntries(head.categories.map((c) => [c.id, c.name]));
  const catDesc = Object.fromEntries(head.categories.map((c) => [c.id, c.desc]));

  const review = [...added.map((e) => ({ e, change: 'added' })), ...changed.map((e) => ({ e, change: 'changed' }))];
  const entries = await Promise.all(review.map(async ({ e, change }) => {
    const issues = []; // { level: 'blocking' | 'warning', check, message }
    const add = (level, check, message) => issues.push({ level, check, message });
    const line = headLines[e.line - 1];
    const label = `README.md:${e.line} ${e.name}`;

    // Description
    const desc = e.kind === 'learn' ? (e.desc || e.meta || '') : e.desc;
    if (e.kind === 'tool' && !desc) add('blocking', 'description', 'The entry has no description.');
    if (desc && !/[.!?]$/.test(desc)) add('warning', 'description', 'The description should end with a period.');
    if (desc && desc.length > MAX_DESC) add('warning', 'description', `The description is ${desc.length} characters; keep it under ${MAX_DESC}.`);
    if (desc && MARKETING.test(desc)) add('warning', 'description', `The description uses marketing language ("${desc.match(MARKETING)[0]}").`);
    if (desc && /^[a-z]/.test(desc)) add('warning', 'description', 'The description should start with a capital letter.');

    // Link
    if (!/^https?:\/\//.test(e.url)) add('blocking', 'link', 'The link is not an http(s) URL.');
    else if (e.url.startsWith('http://')) add('warning', 'link', 'Use an https:// link.');
    if (TRACKING.test(e.url)) add('blocking', 'link', 'Remove tracking parameters (utm_*, ref, …) from the link.');

    // Duplicates
    const sameUrl = headEntries.filter((o) => o !== e && urlKey(o) === urlKey(e));
    if (sameUrl.length) add(change === 'added' ? 'blocking' : 'warning', 'duplicate', `The same link is already listed: ${sameUrl.map((o) => `${o.name} (README.md:${o.line})`).join(', ')}.`);
    const sameName = headEntries.filter((o) => o !== e && nameKey(o) === nameKey(e) && urlKey(o) !== urlKey(e));
    if (sameName.length) add('warning', 'duplicate', `An entry with the same name exists: README.md:${sameName.map((o) => o.line).join(', ')}.`);

    // Network checks
    let link = null, repo = null, domain = null;
    if (network) {
      link = await checkLink(e.url);
      if (link.status === 0) {
        if (link.error === 'timeout') add('warning', 'link', 'The link timed out.');
        else add('blocking', 'link', `The link does not resolve (${link.error}).`);
      } else if (link.status === 404 || link.status === 410) add('blocking', 'link', `The link returns HTTP ${link.status}.`);
      else if (link.status >= 400) add('warning', 'link', `The link returns HTTP ${link.status} (may block automated requests).`);

      // The repository: from the maps or the link itself, else from GitHub links on the website.
      const mapped = e.url in (repoMaps.manual || {}) || !!resolveRepo(e.url, repoMaps.manual, repoMaps.auto);
      const repoName = mapped ? resolveRepo(e.url, repoMaps.manual, repoMaps.auto) : e.kind === 'tool' ? repoFromSite(e.name, link.snapshot?.repos) : null;
      if (repoName) {
        repo = await checkRepo(repoName, token);
        if (repo.found === false) add(e.tags.includes('oss') ? 'blocking' : 'warning', 'repository', `GitHub repository ${repoName} was not found.`);
        else if (repo.archived) add('blocking', 'repository', `GitHub repository ${repo.repo} is archived.`);
        if (repo.found && e.tags.includes('oss') && !repo.license) add('blocking', 'tags', `Tagged \`oss\`, but ${repo.repo} has no open source license.`);
      }
      if (e.kind === 'tool' && !repoFromUrl(e.url)) domain = await checkDomain(e.url);
      // Maturity gates new tools. For entries already on the list, it only informs.
      if (e.kind === 'tool') {
        for (const i of maturity(e, { link, repo: repo?.found === false ? null : repo, domain })) {
          issues.push(change === 'added' || i.level !== 'blocking' ? i : { ...i, level: 'warning' });
        }
      }
    }

    for (const i of issues) ({ blocking, warning: warnings, human }[i.level]).push(`${label}: ${i.message}`);
    return {
      change, kind: e.kind, name: e.name, url: e.url, line: e.line, raw: line,
      section: e.kind === 'tool' ? catName[e.section] : e.section, sectionDesc: e.kind === 'tool' ? catDesc[e.section] : '',
      group: e.group || null, tags: e.tags, desc, issues, link, repo, domain,
      before: change === 'changed' ? baseLine(baseByKey.get(entryKey(e))) : null,
    };
  }));

  return {
    readmeChanged, files, entries, parseErrors: head.errors, author: authorAccount,
    removed: removed.map((e) => ({ name: e.name, url: e.url, line: e.line })),
    blocking, warnings, human,
  };
}
