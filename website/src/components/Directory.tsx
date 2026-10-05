import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  BookmarkIcon, CheckIcon, Facts, SearchEnd, Ico, LiveLine, SearchIcon, Status, TIER_LABEL, TierBadge,
  factsFor, langColor, readSaved, starsLabel, toolHref, writeSaved,
  type Category, type Tool,
} from './ui';

type Props = {
  tools: Tool[];
  categories: Category[];
  initialCat: string;
  stats: { tools: number; categories: number; oss: number; self: number };
  fetchedLabel: string;
};
type Tier = 'all' | Tool['tier'];
type Sort = 'stars' | 'active' | 'name' | 'category';
type View = 'rows' | 'grid';

const SORTS: Sort[] = ['stars', 'active', 'name', 'category'];
const SORT_OPTIONS: { id: Sort; label: string; hint: string }[] = [
  { id: 'stars', label: 'Most stars', hint: 'Most popular on GitHub first' },
  { id: 'active', label: 'Recently active', hint: 'Latest commits first' },
  { id: 'name', label: 'Name A–Z', hint: 'Alphabetical' },
  { id: 'category', label: 'Category', hint: 'Grouped under headings' },
];

// Sort dropdown styled like the other toolbar controls (a native <select> opens an
// OS-styled list). Keyboard: arrows move, Enter or Space picks, Escape closes.
function SortMenu({ value, onChange }: { value: Sort; onChange: (s: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const current = SORT_OPTIONS.find((o) => o.id === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, SORT_OPTIONS.findIndex((o) => o.id === value)));
    list.current?.focus();
    const away = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);

  const pick = (s: Sort) => { onChange(s); setOpen(false); button.current?.focus(); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % SORT_OPTIONS.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(SORT_OPTIONS.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(SORT_OPTIONS[active].id); }
    else if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); if (e.key === 'Escape') button.current?.focus(); }
  };

  return (
    <div class="sort" ref={root}>
      <button
        ref={button} type="button" class="sort-btn" aria-haspopup="listbox" aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); } }}
      >
        <span class="sort-label">Sort</span>
        <span class="sort-value">{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
      </button>
      {open && <div class="sort-backdrop" onClick={() => setOpen(false)} />}
      {open && (
        <ul
          ref={list} class="sort-menu" role="listbox" tabIndex={-1} aria-label="Sort tools"
          aria-activedescendant={`sort-opt-${SORT_OPTIONS[active].id}`} onKeyDown={onKey}
        >
          {SORT_OPTIONS.map((o, i) => (
            <li
              id={`sort-opt-${o.id}`} role="option" aria-selected={o.id === value}
              class={i === active ? 'active' : undefined}
              onMouseEnter={() => setActive(i)} onClick={() => pick(o.id)}
            >
              <span class="txt"><b>{o.label}</b><span>{o.hint}</span></span>
              {o.id === value && <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8.5l3 3 7-7" /></svg>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
const TIERS: [Tier, string][] = [['all', 'All'], ['oss', 'Open source'], ['freemium', 'Freemium'], ['paid', 'Paid']];
const ALL_SUB = 'Every platform and tool from the awesome-devops README. Books, roadmaps and conferences live in Learn.';

const byName = (a: Tool, b: Tool) => a.name.localeCompare(b.name);
const st = (t: Tool) => t.stars ?? -1;
const ag = (t: Tool) => t.age ?? 999;
function sortList(list: Tool[], sort: Sort) {
  const s = [...list];
  if (sort === 'name') s.sort(byName);
  else if (sort === 'active') s.sort((a, b) => ag(a) - ag(b) || st(b) - st(a) || byName(a, b));
  else s.sort((a, b) => st(b) - st(a) || byName(a, b));
  return s;
}

const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export default function Directory({ tools, categories, initialCat, stats, fetchedLabel }: Props) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(initialCat);
  const [tier, setTier] = useState<Tier>('all');
  const [self, setSelf] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [sort, setSort] = useState<Sort>('stars');
  const [view, setView] = useState<View>('rows');
  const [item, setItem] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const itemRef = useRef<string | null>(null);
  itemRef.current = item;

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const byId = useMemo(() => Object.fromEntries(tools.map((t) => [t.id, t])), [tools]);

  // Read filters from the URL: /category/{id}/?q=&tier=&self=1&active=1&sort=&view=&tool=
  const readUrl = () => {
    const p = new URLSearchParams(location.search);
    const m = location.pathname.match(/^\/category\/([^/]+)\/?$/);
    setCat(m && catMap[m[1]] ? m[1] : p.get('cat') === 'saved' ? 'saved' : 'all');
    setQ(p.get('q') || '');
    const t = p.get('tier') as Tier;
    setTier(TIERS.some(([id]) => id === t) ? t : 'all');
    setSelf(p.get('self') === '1');
    setInactive(p.get('active') === '1');
    const s = p.get('sort') as Sort;
    setSort(SORTS.includes(s) ? s : 'stars');
    setView(p.get('view') === 'grid' ? 'grid' : 'rows');
    const tool = p.get('tool');
    setItem(tool && byId[tool] ? tool : null);
  };

  useEffect(() => {
    readUrl();
    setSaved(readSaved());
    setReady(true);
    const onPop = () => readUrl();
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); focusSearch(); }
      else if (e.key === '/' && !typing) { e.preventDefault(); focusSearch(); }
      else if (e.key === 'Escape') {
        if (itemRef.current) setItem(null);
        else if (document.activeElement === searchRef.current) { setQ(''); searchRef.current!.blur(); }
      }
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('popstate', onPop); window.removeEventListener('keydown', onKey); };
  }, []);

  // Write state back to the URL so every view is shareable.
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (cat === 'saved') p.set('cat', 'saved');
    if (q) p.set('q', q);
    if (tier !== 'all') p.set('tier', tier);
    if (self) p.set('self', '1');
    if (inactive) p.set('active', '1');
    if (sort !== 'stars') p.set('sort', sort);
    if (view !== 'rows') p.set('view', view);
    if (item) p.set('tool', item);
    const path = catMap[cat] ? `/category/${cat}/` : '/';
    const qs = p.toString();
    const url = path + (qs ? '?' + qs : '');
    if (url !== location.pathname + location.search) {
      if (path !== location.pathname) history.pushState(null, '', url);
      else history.replaceState(null, '', url);
    }
    document.title = catMap[cat] ? `${catMap[cat].name} · Awesome DevOps` : cat === 'saved' ? 'Saved · Awesome DevOps' : 'Awesome DevOps';
  }, [ready, cat, q, tier, self, inactive, sort, view, item]);

  useEffect(() => { if (item) { setCopied(false); drawerRef.current?.focus(); } }, [item]);

  function focusSearch() { const el = searchRef.current; if (el) { el.focus(); el.select(); } }
  function toggleSave(id: string) {
    setSaved((cur) => { const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]; writeSaved(next); return next; });
  }
  function resetFilters() { setQ(''); setCat('all'); setTier('all'); setSelf(false); setInactive(false); }
  function selectCat(id: string) { setCat(cat === id && id !== 'all' ? 'all' : id); }

  const savedSet = new Set(saved);
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const match = (t: Tool, skip?: 'cat' | 'tier') => {
    if (terms.length && !terms.every((w) => t.search.includes(w))) return false;
    if (skip !== 'cat') {
      if (cat === 'saved') { if (!savedSet.has(t.id)) return false; }
      else if (cat !== 'all' && t.cat !== cat) return false;
    }
    if (skip !== 'tier' && tier !== 'all' && t.tier !== tier) return false;
    if (self && !t.selfHost) return false;
    if (inactive && t.status) return false;
    return true;
  };

  const results = sortList(tools.filter((t) => match(t)), sort);
  const catBase = tools.filter((t) => match(t, 'cat'));
  const tierBase = tools.filter((t) => match(t, 'tier'));
  const catCount = (id: string) => catBase.filter((t) => t.cat === id).length;
  const savedCount = catBase.filter((t) => savedSet.has(t.id)).length;

  const groups = sort === 'category'
    ? categories.map((c) => ({ title: c.name, items: sortList(results.filter((t) => t.cat === c.id), 'stars') })).filter((g) => g.items.length)
    : [{ title: '', items: results }];

  let heading = 'All tools', sub = ALL_SUB;
  if (cat === 'saved') { heading = 'Saved'; sub = 'Tools you saved on this device.'; }
  else if (catMap[cat]) { heading = catMap[cat].name; sub = catMap[cat].desc; }
  const emptySaved = cat === 'saved' && saved.length === 0;

  const openItem = (id: string) => (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a') && !isPlainClick(e)) return;
    e.preventDefault();
    setItem(id);
  };
  const saveBtn = (t: Tool) => {
    const on = savedSet.has(t.id);
    return (
      <button type="button" class="save-btn" aria-pressed={on} title={on ? 'Remove from saved' : 'Save'} aria-label={`${on ? 'Remove' : 'Save'} ${t.name}`}
        onClick={(e) => { e.stopPropagation(); toggleSave(t.id); }}>
        <BookmarkIcon filled={on} />
      </button>
    );
  };

  const row = (t: Tool) => (
    <div class={item === t.id ? 'row sel' : 'row'} onClick={openItem(t.id)} key={t.id}>
      <div class="row-main">
        <Ico t={t} />
        <div class="row-text">
          <div class="row-title">
            <a class="name" href={toolHref(t)} onClick={openItem(t.id)}>{t.name}</a>
            <Status t={t} />
            <span class="host">{t.host}</span>
          </div>
          <div class="row-desc">{t.desc}</div>
          <div class="row-mobile"><TierBadge tier={t.tier} /><span class="stars">{starsLabel(t)}</span>{saveBtn(t)}</div>
        </div>
      </div>
      <div class="cols">
        <span class="col-cat">{t.catName}</span>
        <span class="col-price"><TierBadge tier={t.tier} /></span>
        <span class="col-lang"><span class="lang-dot" style={{ background: langColor(t.lang) }} />{t.lang || '—'}</span>
        <span class="col-stars">{starsLabel(t)}</span>
        {saveBtn(t)}
      </div>
    </div>
  );

  const card = (t: Tool) => (
    <div class="card" onClick={openItem(t.id)} key={t.id}>
      <div class="card-top">
        <Ico t={t} />
        <div class="row-text">
          <a class="name" href={toolHref(t)} onClick={openItem(t.id)}>{t.name}</a>
          <div class="host">{t.host}</div>
        </div>
        {saveBtn(t)}
      </div>
      <div class="card-desc">{t.desc}</div>
      <div class="card-foot">
        <TierBadge tier={t.tier} />
        {t.lang && <span class="lang"><span class="lang-dot" style={{ background: langColor(t.lang) }} />{t.lang}</span>}
        <Status t={t} />
        <span class="spacer" />
        <span class="stars">{starsLabel(t)}</span>
      </div>
    </div>
  );

  const navBtn = (id: string, label: string, count: number, top = false) => (
    <button type="button" class={`nav-item${top ? ' top' : ''}${!top && count === 0 && cat !== id ? ' dim' : ''}`} aria-current={cat === id}
      onClick={() => selectCat(id)}>
      <span>{label}</span><span class="n">{count}</span>
    </button>
  );

  const sel = item ? byId[item] : null;
  const related = sel ? sortList(tools.filter((t) => t.cat === sel.cat && t.id !== sel.id), 'stars').slice(0, 5) : [];

  return (
    <>
      <section class="hero wrap">
        <h1>Awesome DevOps</h1>
        <p class="lede">A curated list of awesome DevOps platforms, tools, practices and resources.</p>
        <div class="stats">
          <span><b>{stats.tools}</b> tools</span>
          <span><b>{stats.categories}</b> categories</span>
          <span><b>{stats.oss}</b> open source</span>
          <span><b>{stats.self}</b> self-hostable</span>
        </div>
        <div class="search">
          <SearchIcon />
          <label class="sr-only" for="tool-search">Search tools</label>
          <input id="tool-search" ref={searchRef} type="search" value={q} onInput={(e) => setQ(e.currentTarget.value)}
            placeholder="Search tools, categories, languages, licenses…" spellcheck={false} autocomplete="off" />
          <SearchEnd q={q} onClear={() => { setQ(''); focusSearch(); }} />
        </div>
      </section>

      <main class="directory">
        <aside class="sidebar" aria-label="Categories">
          <div class="nav-list">
            {navBtn('all', 'All tools', catBase.length, true)}
            {navBtn('saved', 'Saved', savedCount, true)}
          </div>
          <div class="nav-label">Categories</div>
          <div class="nav-list">
            {categories.map((c) => navBtn(c.id, c.name, catCount(c.id)))}
          </div>
        </aside>

        <div class="content">
          <label class="cat-select">
            <span>Category</span>
            <select value={cat} onChange={(e) => setCat(e.currentTarget.value)}>
              <option value="all">All tools ({catBase.length})</option>
              <option value="saved">Saved ({savedCount})</option>
              {categories.map((c) => <option value={c.id}>{c.name} ({catCount(c.id)})</option>)}
            </select>
          </label>

          <div class="list-head">
            <h2>{heading}</h2>
          </div>
          <p class="list-sub">{sub}</p>

          <div class="filters">
            <div class="chips" role="group" aria-label="Filter tools">
              {TIERS.filter(([id]) => id !== 'all').map(([id, label]) => (
                <button
                  type="button" class={`chip tier-${id}`} aria-pressed={tier === id}
                  title={tier === id ? `Show all pricing` : `Only ${label.toLowerCase()} tools`}
                  onClick={() => setTier(tier === id ? 'all' : id)}
                >
                  <span class="dot" aria-hidden="true" />
                  <span>{label}</span>
                  <span class="n">{tierBase.filter((t) => t.tier === id).length}</span>
                </button>
              ))}
              <span class="chip-sep" aria-hidden="true" />
              <button type="button" class="chip check" aria-pressed={self} onClick={() => setSelf(!self)}>
                <CheckIcon on={self} /><span>Self-hostable</span>
              </button>
              <button type="button" class="chip check" aria-pressed={inactive} onClick={() => setInactive(!inactive)}>
                <CheckIcon on={inactive} /><span>Active only</span>
              </button>
              {(tier !== 'all' || self || inactive) && (
                <button type="button" class="chip clear" onClick={() => { setTier('all'); setSelf(false); setInactive(false); }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div class="results-bar">
            <span class="count" aria-live="polite">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
            <div class="toolbar-end">
              <SortMenu value={sort} onChange={setSort} />
              <div class="view-toggle" role="group" aria-label="Layout">
                <button type="button" title="List view" aria-label="List view" aria-pressed={view === 'rows'} onClick={() => setView('rows')}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" /></svg>
                </button>
                <button type="button" title="Grid view" aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="results">
            {results.length === 0 ? (
              <div class="empty">
                <div class="t">{emptySaved ? 'Nothing saved yet' : 'No tools match these filters'}</div>
                <div class="b">{emptySaved ? 'Use the bookmark icon on any tool to keep it here.' : 'Try a different search term or clear a filter.'}</div>
                <button type="button" class="btn-outline" onClick={resetFilters}>Reset filters</button>
              </div>
            ) : view === 'rows' ? (
              <div class="rows">
                <div class="rows-head">
                  <span class="tool-col">Tool</span>
                  <div class="cols">
                    <span class="col-cat">Category</span>
                    <span class="col-price">Pricing</span>
                    <span class="col-lang">Language</span>
                    <span class="col-stars">Stars</span>
                    <span class="col-save" />
                  </div>
                </div>
                {groups.map((g) => (
                  <>
                    {g.title && <div class="group-title"><b>{g.title}</b><span>{g.items.length}</span></div>}
                    {g.items.map(row)}
                  </>
                ))}
              </div>
            ) : (
              groups.map((g) => (
                <>
                  {g.title && <div class="grid-title"><b>{g.title}</b><span>{g.items.length}</span></div>}
                  <div class="grid">{g.items.map(card)}</div>
                </>
              ))
            )}
          </div>
        </div>
      </main>

      {sel && (
        <>
          <div class="backdrop" onClick={() => setItem(null)} />
          <aside class="drawer" ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={sel.name}>
            <div class="drawer-bar">
              <span class="crumb">{sel.catName} / <span>{sel.name}</span></span>
              <a class="btn-ink-sm" href={toolHref(sel)}>Full page →</a>
              <button type="button" class="btn-ghost-sm" onClick={() => {
                navigator.clipboard?.writeText(location.origin + toolHref(sel)).catch(() => {});
                setCopied(true);
              }}>{copied ? 'Copied' : 'Copy link'}</button>
              <button type="button" class="close-btn" title="Close (Esc)" aria-label="Close" onClick={() => setItem(null)}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
            </div>
            <div class="drawer-body">
              <div class="drawer-id">
                <Ico t={sel} size={52} />
                <div style={{ minWidth: 0 }}>
                  <h3>{sel.name}</h3>
                  <a href={sel.url} target="_blank" rel="noopener">{sel.host} ↗</a>
                </div>
              </div>
              <div class="badges">
                <TierBadge tier={sel.tier} size="lg" />
                {sel.selfHost && <span class="badge plain lg">Self-hostable</span>}
                <Status t={sel} size="lg" />
              </div>
              <p class="drawer-desc">{sel.desc}</p>
              <div class="actions">
                <a class="btn-ink" href={sel.url} target="_blank" rel="noopener">Visit website ↗</a>
                {sel.repo && <a class="btn-line" href={`https://github.com/${sel.repo}`} target="_blank" rel="noopener">View on GitHub</a>}
                <button type="button" class="btn-line" onClick={() => toggleSave(sel.id)}>
                  <BookmarkIcon filled={savedSet.has(sel.id)} size={14} /><span>{savedSet.has(sel.id) ? 'Saved' : 'Save'}</span>
                </button>
              </div>
              {sel.repo && <LiveLine t={sel} fetchedLabel={fetchedLabel} />}
              <div class="facts"><Facts facts={factsFor(sel, true)} /></div>
              {related.length > 0 && (
                <div>
                  <div class="mini-label">More in {sel.catName}</div>
                  <div class="related">
                    {related.map((r) => (
                      <a href={toolHref(r)} onClick={openItem(r.id)}>
                        <Ico t={r} size={26} />
                        <span class="nm">{r.name}</span>
                        <span class="tl">{TIER_LABEL[r.tier]}</span>
                        <span class="st">{starsLabel(r)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
