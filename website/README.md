# awesome-devops.xyz

The website for [Awesome DevOps](../README.md), built with [Astro](https://astro.build) and a few [Preact](https://preactjs.com) islands.

The repository `README.md` is the source of truth. The build parses it, so adding or editing a tool there is all that is needed. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the entry format and pricing tags.

The two guide pages are Markdown too:

- **What is DevOps?** is [src/content/what-is-devops.mdx](src/content/what-is-devops.mdx): Markdown plus a few components for the visual blocks (cards, phases, metrics), listed at the top of the file. Each `## ` heading becomes an entry in the page menu.
- **Contribute** is the repository's [CONTRIBUTING.md](../CONTRIBUTING.md), split into menu sections at each `## ` heading. Only the quick reference card at the top lives in [src/pages/contribution.astro](src/pages/contribution.astro).

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
```

## Data

| File | What it holds |
|---|---|
| `../README.md` | Tools, categories, descriptions, pricing tags, Learn resources |
| `src/data/repos-auto.json` | GitHub repositories found automatically for entries that link to a website (generated) |
| `src/data/repos.json` | Manual corrections when auto-detection picks the wrong repository or none (`null` means no repository) |
| `src/data/learn-topics.json` | Categories each Learn resource relates to ("Related reading" on tool pages) |
| `src/data/github.json` | Stars, forks, issues, license, language, last push, archived. Refreshed by the deploy |

`npm run fetch:github` finds repositories for new website links (GitHub search, matching the repo homepage to the website's domain) and refreshes `github.json`. Set `GITHUB_TOKEN` to avoid the unauthenticated limits of 10 searches and 60 API calls per hour. `npm run fetch:icons` downloads favicons into `public/icons/` (not committed).

The build fails if a README entry has no pricing tag or a section is not listed in `CATEGORY_IDS` in `src/lib/readme.mjs`.

## Pull request review

`.github/workflows/pr-review.yml` reviews every pull request and posts one comment with a verdict label:

| Label | Meaning |
| --- | --- |
| `ready-to-merge` | Checks passed and the AI review approves. Approve and merge. |
| `needs-changes` | Something must be fixed (the check fails). The comment says what. |
| `needs-human-review` | Nothing is blocking, but a maintainer should decide: files other than README.md changed, many entries added, the AI could not decide or raised a concern. |

Repository checks (`scripts/review/checks.mjs`) block on: a missing pricing tag or unknown section, a missing description, a link that returns 404/410 or does not resolve, tracking parameters in the link, a link already on the list, and an archived repository. They warn on marketing language, long descriptions, `http://` links, repositories inactive for 24 months, and `oss` without a detected license.

The AI review (`scripts/review/ai.mjs`, Claude `claude-opus-5`) reads the diff, the project's website and repository, and judges relevance, section, description and tags. It is advisory: it cannot merge, and repository checks alone decide whether the check fails.

Setup: add an `ANTHROPIC_API_KEY` repository secret (Settings → Secrets and variables → Actions). Without it, every pull request gets `needs-human-review`. To require the review before merging, add the **PR review / review** and **Website check / build** checks to a branch protection rule for `main`.

### GitHub Copilot code review

Copilot reviews every pull request with the same rules, as inline comments with suggested fixes the contributor can apply in one click:

- `.github/copilot-instructions.md`: what this repository is and what to flag in any pull request.
- `.github/instructions/readme.instructions.md`: the rules for README entries. **This file is the single rulebook**: the Claude review reads it too, so both reviewers apply exactly the same rules. Edit the rules here only.
- `.github/instructions/website.instructions.md` and `workflows.instructions.md`: rules for website code and CI changes.

Copilot reads these files from the pull request's own branch, so a pull request could change them to steer Copilot. The Claude review reads the rulebook from `main` instead, and any pull request that touches the review rules gets `needs-human-review`.

To turn on automatic Copilot reviews: Settings → Rules → Rulesets → New branch ruleset, target the default branch, enable **Automatically request Copilot code review** and **Review new pushes**.

Run it locally against two README versions:

```sh
node scripts/review/index.mjs --base-readme base.md --head-readme head.md --files files.txt --dry-run
```

## Deploy

`.github/workflows/deploy.yml` runs on every push to `main` and daily at 06:00 UTC: it fetches GitHub data and favicons, builds, and publishes `dist/` to the `gh-pages` branch for awesome-devops.xyz.
