// Formatting helpers shared by the build and the browser (no Node imports).
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const TIER_LABEL = { oss: 'Open source', freemium: 'Freemium', paid: 'Paid' };
export const LANG_COLOR = { Go: '#00add8', Python: '#3572a5', Ruby: '#cc342d', Java: '#b07219', JavaScript: '#d9bb1d', TypeScript: '#3178c6', Rust: '#dea584', C: '#555555', 'C++': '#f34b7d', Shell: '#89e051', Erlang: '#b83998', Elixir: '#6e4a7e', PHP: '#4f5d95', Nix: '#7e7eff', OCaml: '#ef7a08', Lua: '#000080', Groovy: '#4298b8', Jinja: '#a52a22', Markdown: '#083fa1', 'C#': '#178600', Kotlin: '#a97bff', Scala: '#c22d40', Clojure: '#db5855', Haskell: '#5e5086', Perl: '#0298c3', HCL: '#844fba', Smarty: '#f0c040', Dockerfile: '#384d54', HTML: '#e34c26', CSS: '#563d7c', Vue: '#41b883', Starlark: '#76d275', Zig: '#ec915c', Dart: '#00b4ab' };

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const fmtStars = (n) => n == null ? null : n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 10000 ? Math.round(n / 1000) + 'k' : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
export const fmtN = (n) => n == null ? '—' : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);

export function activity(t) {
  if (t.age == null) return null;
  if (t.archived) return { dot: '#c2410c', note: 'Archived' };
  if (t.age <= 3) return { dot: '#2f9e5b', note: 'Active' };
  if (t.age <= 12) return { dot: '#d49a1f', note: 'Slowing' };
  return { dot: '#a3a3a0', note: 'Inactive' };
}

export const sortByStars = (list) => [...list].sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1) || a.name.localeCompare(b.name));
