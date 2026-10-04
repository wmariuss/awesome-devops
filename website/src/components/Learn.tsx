import { useEffect, useRef, useState } from 'preact/hooks';
import { SearchIcon } from './ui';

export type LearnItem = { title: string; url: string; type: string; desc: string; meta: string; free: boolean; topics: string[] };

const ORDER = ['book', 'roadmap', 'playground', 'conference', 'blog'];
const PLURAL: Record<string, string> = { book: 'Books', roadmap: 'Roadmaps', playground: 'Playgrounds', conference: 'Conferences', blog: 'Blogs' };
const SINGULAR: Record<string, string> = { book: 'Book', roadmap: 'Roadmap', playground: 'Playground', conference: 'Conference', blog: 'Blog' };

export default function Learn({ items }: { items: LearnItem[] }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [free, setFree] = useState(false);
  const [ready, setReady] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setQ(p.get('q') || '');
    const t = p.get('type') || 'all';
    setType(t === 'all' || ORDER.includes(t) ? t : 'all');
    setFree(p.get('free') === '1');
    setReady(true);
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
      const focus = () => { e.preventDefault(); searchRef.current?.focus(); searchRef.current?.select(); };
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') focus();
      else if (e.key === '/' && !typing) focus();
      else if (e.key === 'Escape' && document.activeElement === searchRef.current) { setQ(''); searchRef.current!.blur(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (type !== 'all') p.set('type', type);
    if (free) p.set('free', '1');
    const url = location.pathname + (p.toString() ? '?' + p : '');
    if (url !== location.pathname + location.search) history.replaceState(null, '', url);
  }, [ready, q, type, free]);

  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const hay = (l: LearnItem) => [l.title, l.desc, l.meta, SINGULAR[l.type]].join(' ').toLowerCase();
  const base = items.filter((l) => terms.every((w) => hay(l).includes(w)) && (!free || l.free));
  const res = base.filter((l) => type === 'all' || l.type === type);
  const groups = ORDER.map((t) => ({ t, items: res.filter((l) => l.type === t) })).filter((g) => g.items.length);

  return (
    <>
      <section class="hero learn-hero wrap">
        <h1>Learn DevOps</h1>
        <p class="lede">Books, roadmaps, conferences and other resources from the awesome-devops list.</p>
        <div class="search">
          <SearchIcon />
          <label class="sr-only" for="learn-search">Search resources</label>
          <input id="learn-search" ref={searchRef} type="search" value={q} onInput={(e) => setQ(e.currentTarget.value)}
            placeholder="Search books, authors, topics…" spellcheck={false} autocomplete="off" style={{ paddingRight: '20px' }} />
        </div>
      </section>
      <main class="learn-body">
        <div class="toolbar" style={{ margin: 0 }}>
          <div class="seg" role="group" aria-label="Type">
            {[['all', 'All'], ...ORDER.map((t) => [t, PLURAL[t]])].map(([id, label]) => (
              <button type="button" aria-pressed={type === id} onClick={() => setType(id)}>
                <span>{label}</span><span class="n">{id === 'all' ? base.length : base.filter((l) => l.type === id).length}</span>
              </button>
            ))}
          </div>
          <button type="button" class="toggle" aria-pressed={free} onClick={() => setFree(!free)}>
            <span class="box">{free ? '✓' : ''}</span><span>Free only</span>
          </button>
        </div>
        {groups.map((g) => (
          <section class="learn-group">
            <div class="learn-group-head"><h2>{PLURAL[g.t]}</h2><span>{g.items.length}</span></div>
            <div class="learn-list">
              {g.items.map((l) => (
                <a class="learn-row" href={l.url} target="_blank" rel="noopener">
                  <div class="txt">
                    <span class="title">{l.title} <span class="arrow">↗</span></span>
                    {l.meta && <span class="meta">{l.meta}</span>}
                    {l.desc && <span class="desc">{l.desc}</span>}
                  </div>
                  {l.free ? <span class="badge oss">Free</span> : <span class="badge paid">Paid</span>}
                </a>
              ))}
            </div>
          </section>
        ))}
        {groups.length === 0 && (
          <div class="empty">
            <div class="t">Nothing matches these filters</div>
            <button type="button" class="btn-outline" style={{ marginTop: '16px' }} onClick={() => { setQ(''); setType('all'); setFree(false); }}>Reset filters</button>
          </div>
        )}
      </main>
    </>
  );
}
