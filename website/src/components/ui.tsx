import { LANG_COLOR, TIER_LABEL, activity, fmtN, fmtStars } from '../lib/format.mjs';

export type Tool = {
  id: string; name: string; url: string; desc: string; cat: string; catName: string;
  tier: 'oss' | 'freemium' | 'paid'; paidPlan: boolean; freePlan: boolean; selfHost: boolean;
  repo: string | null; stars: number | null; forks: number | null; issues: number | null;
  license: string | null; lang: string | null; age: number | null; activeLabel: string | null;
  archived: boolean; status: string | null; hasGh: boolean; host: string; letter: string;
  icon: string | null; search: string;
};
export type Category = { id: string; name: string; desc: string };

export const starsLabel = (t: Tool) => t.stars != null ? '★ ' + fmtStars(t.stars) : '—';
export const langColor = (lang: string | null) => lang ? (LANG_COLOR as Record<string, string>)[lang] || '#9a9a95' : 'transparent';
export const toolHref = (t: Tool) => `/tools/${t.id}/`;
export { TIER_LABEL };

export function Ico({ t, size = 32 }: { t: Pick<Tool, 'letter' | 'icon'>; size?: 26 | 28 | 32 | 52 | 68 }) {
  return (
    <div class={size === 32 ? 'ico' : `ico s${size}`} aria-hidden="true">
      <span>{t.letter}</span>
      {t.icon && <img src={t.icon} alt="" loading="lazy" width={18} height={18} onError={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')} />}
    </div>
  );
}

export function TierBadge({ tier, size }: { tier: Tool['tier']; size?: 'lg' | 'xl' }) {
  return <span class={`badge ${tier}${size ? ' ' + size : ''}`}>{TIER_LABEL[tier]}</span>;
}

export function Status({ t, size }: { t: Tool; size?: 'lg' | 'xl' }) {
  if (!t.status) return null;
  return <span class={`status${size ? ' ' + size : ''}`}>{t.status}</span>;
}

export function BookmarkIcon({ filled, size = 15 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 3h12v18l-6-4.5L6 21z" />
    </svg>
  );
}

export type Fact = { k: string; v: string; note?: string; dot?: string | null };

export function factsFor(t: Tool, withRepoStats: boolean): Fact[] {
  const act = activity(t);
  const pricing = t.tier === 'oss' ? 'Free, open source' : t.tier === 'freemium' ? 'Free tier available' : 'Paid only';
  const note = t.tier === 'oss' && t.paidPlan ? '+ paid cloud / support' : t.tier === 'freemium' && t.paidPlan ? '+ paid plans' : '';
  const facts: Fact[] = [
    { k: 'Category', v: t.catName },
    { k: 'Pricing', v: pricing, note },
    { k: 'Self-hostable', v: t.selfHost ? 'Yes' : 'No' },
  ];
  if (t.repo) {
    facts.push({ k: 'Repository', v: t.repo });
    if (withRepoStats) {
      facts.push({ k: 'GitHub stars', v: fmtStars(t.stars) || '—' });
      if (t.forks != null) facts.push({ k: 'Forks', v: fmtN(t.forks) });
      if (t.issues != null) facts.push({ k: 'Open issues', v: fmtN(t.issues) });
    }
  }
  if (t.license) facts.push({ k: 'License', v: t.license });
  if (t.lang) facts.push({ k: 'Language', v: t.lang, dot: langColor(t.lang) });
  if (act) facts.push({ k: 'Last activity', v: t.activeLabel!, note: act.note, dot: act.dot });
  return facts;
}

export function Facts({ facts }: { facts: Fact[] }) {
  return (
    <>
      {facts.map((f) => (
        <div class="fact">
          <span class="k">{f.k}</span>
          <span class="v">
            {f.dot && <span class="dot" style={{ background: f.dot }} />}
            <span>{f.v}</span>
            {f.note && <span class="note">{f.note}</span>}
          </span>
        </div>
      ))}
    </>
  );
}

export function LiveLine({ t, fetchedLabel }: { t: Tool; fetchedLabel: string }) {
  const ok = t.hasGh;
  return (
    <div class="live">
      <i style={{ background: ok ? '#2f9e5b' : '#d49a1f' }} />
      {ok ? `From GitHub · updated ${fetchedLabel}` : 'GitHub data unavailable'}
    </div>
  );
}

export const GitHubMark = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
);

export const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6d72" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);

// Saved tools live in this browser only.
const SAVED_KEY = 'ad-saved';
export function readSaved(): string[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch { return []; }
}
export function writeSaved(ids: string[]) {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(ids)); } catch {}
}

// Check mark for filter chips that switch on and off.
export function CheckIcon({ on }: { on: boolean }) {
  return (
    <span class="check-box" aria-hidden="true">
      {on && <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M3 8.5l3 3 7-7" /></svg>}
    </span>
  );
}
