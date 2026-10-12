// Automated pull request review: repository checks + AI review -> one verdict.
//
// Usage (CI): node scripts/review/index.mjs --base-readme base.md --head-readme head.md \
//   --files files.txt --diff pr.diff
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, PR_TITLE, PR_BODY, PR_AUTHOR, PR_SHA,
//      ANTHROPIC_API_KEY (optional; without it the review asks for a human).
// Add --dry-run to print the comment instead of posting it, --offline to skip network checks.
//
// Verdicts: ready-to-merge (approve and merge), needs-changes (contributor must fix),
// needs-human-review (the maintainer should look). Exits 1 when a check blocks the merge.
import { readFileSync, appendFileSync } from 'node:fs';
import path from 'node:path';
import { runChecks } from './checks.mjs';
import { aiReview, MODEL } from './ai.mjs';
import { WEBSITE_DIR } from '../../src/lib/readme.mjs';
import { fmtStars } from '../../src/lib/format.mjs';

const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const flag = (name) => args.includes(name);
const env = process.env;
const MARKER = '<!-- awesome-devops-review -->';
const LABELS = {
  'ready-to-merge': { color: '2f9e5b', description: 'Automated review passed; ready for maintainer approval' },
  'needs-changes': { color: 'c2410c', description: 'Automated review found something the contributor must fix' },
  'needs-human-review': { color: 'd49a1f', description: 'Automated review needs a maintainer to decide' },
};

const read = (p) => readFileSync(p, 'utf8');
const readJson = (f) => { try { return JSON.parse(read(path.join(WEBSITE_DIR, 'src/data', f))); } catch { return {}; } };

const pr = {
  number: env.PR_NUMBER, title: env.PR_TITLE || '', body: env.PR_BODY || '',
  author: env.PR_AUTHOR || 'unknown', sha: (env.PR_SHA || '').slice(0, 7),
};
const files = read(arg('--files')).split('\n').map((f) => f.trim()).filter(Boolean);
const diff = arg('--diff') ? read(arg('--diff')) : '';

const checks = await runChecks({
  baseReadme: read(arg('--base-readme')),
  headReadme: read(arg('--head-readme')),
  files,
  repoMaps: { manual: readJson('repos.json'), auto: readJson('repos-auto.json') },
  token: env.GITHUB_TOKEN,
  author: pr.author,
  network: !flag('--offline'),
});
const ai = await aiReview({ pr, checks, diff });

// Decision
const review = ai.status === 'ok' ? ai.review : null;
const humanReasons = [...checks.human];
if (ai.status !== 'ok') humanReasons.push(`AI review did not run: ${ai.reason}`);
if (review?.verdict === 'needs_human') humanReasons.push('The AI reviewer could not decide from the evidence.');
if (review?.concerns.length) humanReasons.push(...review.concerns.map((c) => `AI concern: ${c}`));

let decision;
if (checks.blocking.length || review?.verdict === 'request_changes') decision = 'needs-changes';
else if (humanReasons.length) decision = 'needs-human-review';
else decision = 'ready-to-merge';

// Report
const HEAD = {
  'ready-to-merge': ['✅ Ready to merge', 'All checks passed and the AI review approves. Approve and merge when you are ready.'],
  'needs-changes': ['❌ Changes needed', 'The contributor needs to fix the items below. This comment updates on every push.'],
  'needs-human-review': ['👀 Needs your review', 'The checks found nothing blocking, but something here needs a maintainer to decide. See why below.'],
};
const byCheck = (name) => checks.entries.flatMap((e) => e.issues.filter((i) => i.check === name));
const row = (label, name) => {
  const issues = byCheck(name);
  const blocking = issues.filter((i) => i.level === 'blocking').length;
  const human = issues.filter((i) => i.level === 'human').length;
  const result = !issues.length ? '✅ Passed' : blocking ? `❌ ${blocking} blocking` : human ? `👀 ${human} to check` : `⚠️ ${issues.length} warning${issues.length > 1 ? 's' : ''}`;
  return `| ${label} | ${result} |`;
};
const aiResult = review
  ? { approve: '✅ Approves', request_changes: '❌ Requests changes', needs_human: '👀 Needs a human' }[review.verdict]
  : `⏭️ Skipped (${ai.reason})`;

const lines = [MARKER, `## ${HEAD[decision][0]}`, '', HEAD[decision][1], ''];
lines.push('| Check | Result |', '| --- | --- |');
lines.push(`| README format and pricing tags | ${checks.parseErrors.length ? `❌ ${checks.parseErrors.length} problem${checks.parseErrors.length > 1 ? 's' : ''}` : '✅ Passed'} |`);
lines.push(row('Description', 'description'), row('Link', 'link'), row('Duplicates', 'duplicate'), row('Repository', 'repository'), row('Maturity and authenticity', 'maturity'), row('Tags vs. license', 'tags'));
lines.push(`| Scope | ${checks.human.length ? '👀 ' + checks.human.length + ' item' + (checks.human.length > 1 ? 's' : '') + ' to look at' : '✅ README.md only'} |`);
lines.push(`| AI review | ${aiResult} |`, '');

if (checks.blocking.length) lines.push('### Must fix', ...checks.blocking.map((b) => `- ${b}`), '');
if (decision === 'needs-human-review' && humanReasons.length) lines.push('### Why a human is needed', ...humanReasons.map((r) => `- ${r}`), '');
if (review) lines.push('### AI review', review.summary, '');

if (checks.entries.length) {
  lines.push(`### Entries (${checks.entries.length})`, '');
  for (const e of checks.entries) {
    const r = review?.entries.find((x) => x.name.toLowerCase() === e.name.toLowerCase());
    const icon = e.issues.some((i) => i.level === 'blocking') || r?.verdict === 'request_changes' ? '❌' : e.issues.length || r?.verdict === 'needs_human' ? '⚠️' : '✅';
    lines.push(`<details${icon === '✅' ? '' : ' open'}><summary>${icon} <b>${e.change === 'added' ? 'Added' : 'Changed'}: ${e.name}</b> · ${e.section}${e.group ? ' / ' + e.group : ''}</summary>`, '');
    const facts = [`Tags: ${e.tags.map((t) => '`' + t + '`').join(' ') || 'none'}`];
    if (e.link) facts.push(`Link: ${e.link.status ? 'HTTP ' + e.link.status : e.link.error}`);
    if (e.domain?.registered) facts.push(`Domain ${e.domain.domain}: registered ${e.domain.registered.slice(0, 10)}`);
    lines.push(facts.join(' · '), '');
    if (e.repo?.found) {
      const r = e.repo;
      lines.push('| Repository | Stars | Forks | Contributors | Created | Last push | License |', '| --- | --- | --- | --- | --- | --- | --- |',
        `| [${r.repo}](https://github.com/${r.repo})${r.archived ? ' (archived)' : ''}${r.fork ? ' (fork)' : ''} | ${fmtStars(r.stars)} | ${fmtStars(r.forks)} | ${r.contributors ?? '?'} | ${r.created?.slice(0, 10)} | ${r.pushed?.slice(0, 10)} | ${r.license || 'none'} |`, '');
    }
    for (const i of e.issues) lines.push(`- ${{ blocking: '❌', human: '👀' }[i.level] || '⚠️'} ${i.message}`);
    if (r) {
      lines.push(`- 🤖 ${r.notes}`);
      if (!r.tags_ok) lines.push(`- 🤖 Suggested tags: ${r.suggested_tags.map((t) => '`' + t + '`').join(' ')}`);
      if (r.suggested_line && r.suggested_line.trim() !== e.raw.trim()) lines.push('', 'Suggested line:', '', '```markdown', r.suggested_line, '```');
    }
    lines.push('', '</details>', '');
  }
}
if (checks.removed.length) lines.push(`### Removed (${checks.removed.length})`, ...checks.removed.map((r) => `- ${r.name} (${r.url})`), '');
if (checks.warnings.length && !checks.entries.length) lines.push('### Warnings', ...checks.warnings.map((w) => `- ${w}`), '');

lines.push('---', `<sub>Automated review by repository checks${review ? ` and ${MODEL}` : ''}${pr.sha ? ` for ${pr.sha}` : ''}. The maintainer approves and merges.</sub>`);
const report = lines.join('\n');

// Output
if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, report.replace(MARKER, '') + '\n');
if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `decision=${decision}\n`);

if (flag('--dry-run') || !env.GITHUB_TOKEN || !pr.number) {
  console.log(report);
  console.log(`\nDecision: ${decision}`);
} else {
  await publish(report, decision);
  console.log(`Decision: ${decision}`);
}
if (checks.blocking.length) process.exitCode = 1;

async function gh(method, url, body) {
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}${url}`, {
    method,
    headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'awesome-devops-review', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && res.status !== 404 && res.status !== 422) throw new Error(`${method} ${url}: HTTP ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json().catch(() => null);
}

async function publish(body, decision) {
  // One comment per pull request, updated on every run.
  let existing = null;
  for (let page = 1; page <= 10 && !existing; page++) {
    const comments = await gh('GET', `/issues/${pr.number}/comments?per_page=100&page=${page}`);
    if (!comments?.length) break;
    existing = comments.find((c) => c.body?.startsWith(MARKER) && c.user?.type === 'Bot');
  }
  if (existing) await gh('PATCH', `/issues/comments/${existing.id}`, { body });
  else await gh('POST', `/issues/${pr.number}/comments`, { body });

  for (const [name, meta] of Object.entries(LABELS)) {
    await gh('POST', '/labels', { name, ...meta }); // 422 when it already exists
    if (name !== decision) await gh('DELETE', `/issues/${pr.number}/labels/${encodeURIComponent(name)}`);
  }
  await gh('POST', `/issues/${pr.number}/labels`, { labels: [decision] });
}
