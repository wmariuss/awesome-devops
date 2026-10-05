---
applyTo: "website/**"
---

# Reviewing the website

The website is an Astro static site built from README.md. See website/README.md.

- README.md stays the source of truth. Flag code that hardcodes tools, categories or descriptions that belong in README.md.
- Data the browser needs is passed as props from `src/lib/site.mjs`. Code in `src/components/*.tsx` runs in the browser: it must not import `node:` modules or `src/lib/site.mjs` (use `src/lib/format.mjs`).
- Colours, type and spacing come from the tokens at the top of `src/styles/global.css`. Flag new hard-coded colours or fonts outside the tokens.
- Every page must work at 390px wide: no horizontal page scroll, controls reachable, text not clipped.
- Interactive elements must be real links or buttons, keyboard-reachable, with visible focus. Links that open a new tab use `rel="noopener"`.
- Never read secrets or call paid APIs from site code. The only scripts that call external APIs are in `website/scripts/` and run in CI.
- Changes to `website/scripts/review/` change how pull requests are reviewed: check that pull request content is still only read as data and never executed.
