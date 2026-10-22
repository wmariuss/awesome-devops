---
applyTo: "README.md"
---

# Reviewing README.md entries

README.md is the awesome-devops list and the single source of the website. Review every added or changed entry line against these rules. Rules marked **must** block the merge; rules marked **should** are suggestions.

## Entry format

Every entry is exactly one line:

```markdown
- [Name](https://url) - What the tool does, in one sentence. `tag` `tag`
```

- The line **must** start with `- [`, then the name in brackets, the link in parentheses, ` - `, the description, then one or more tags in backticks.
- Entries inside a group (for example "On-premises" under Continuous Integration & Delivery) are indented by two spaces.
- The name **should** use the project's own spelling: `Kubernetes`, `GitLab`, `etcd`.

## Link

- The link **must** be the project's official website, or its GitHub repository if it has no website.
- The link **must not** contain tracking parameters: `utm_*`, `ref=`, `source=`, `campaign=`, `fbclid`, `gclid`.
- The link **should** use `https://`.
- The link **must not** already appear elsewhere in README.md. The same tool may be listed in two sections only when it clearly serves both (for example an API gateway that is also a service mesh).

## Description

- The description **must** say what the tool does, in one sentence, ending with a period.
- It **must** be neutral. Reject marketing language: "best", "blazing fast", "revolutionary", "world-class", "ultimate", "#1", "leading", "next-gen", "game-changing".
- It **should** start with a capital letter and stay under 200 characters.
- It **must** match what the project's own website or repository says the tool does.

## Pricing tags

Tags go at the end of the line, each in backticks, from this set only:

| Tag | Use it when |
| --- | --- |
| `oss` | The source code is public under an OSI-approved open source license. |
| `free` | A free plan or free usage exists, but the tool is not open source. |
| `paid` | Paid plans, an enterprise edition or paid support exist. |
| `self-hosted` | It can be installed on your own servers without being open source. |

- Every tool entry **must** have at least one tag.
- `oss` **must not** be used for source-available licenses (BSL, SSPL, Elastic License, FSL, Commons Clause). Use `free` and, where it applies, `paid` and `self-hosted`.
- Do not combine `oss` and `free`: `oss` already means free to use.
- Learn resources under "## Resources" (books, conferences, blogs, roadmaps, online platforms) use only `free` or `paid`.

## Section

- The entry **must** be in the section whose description fits what the tool does. Each section starts with an italic one-line description.
- A pull request **must not** add, remove or rename a `## ` section without a linked issue that agreed on it.

## Acceptance

- The tool **must** help teams build, ship, run or secure software.
- It **must** be a real, maintained project: not archived, with activity in the last two years, not a personal experiment, thin wrapper, tutorial repository or affiliate page.
- One tool per pull request is preferred. More than five new entries in one pull request needs a maintainer.
- Removing an entry is fine when the project is archived, dead or moved; the pull request description should say why.

## Maturity and authenticity

The automated review measures these from the GitHub API, RDAP and the website, and blocks the merge when a new tool fails them. Reviewers apply them from what the pull request shows.

- An `oss` tool **must** have a public repository with an open source license, at least 100 stars and at least 6 months of history.
- The repository **must not** be a fork, archived, or without commits for 24 months.
- The account or organization that owns the repository **must** be at least 6 months old.
- A tool without a repository **must** have a website on a domain registered at least 6 months ago, with real content: not parked, for sale or a placeholder.
- Treat these as signs of a fake or promotional project and ask for a maintainer: many stars with almost no forks, watchers or issues; thousands of stars in the first months with one or two contributors; a pull request from a brand-new account; a link that redirects to a different site; a description copied from marketing copy rather than describing the tool.
- Entries already on the list are not removed or blocked by these rules when someone edits them.

## How to comment

- For each problem, quote the line and give the corrected line as a suggestion the contributor can apply.
- Do not comment on entries the pull request did not touch.
- Do not ask for alphabetical order; the list is not sorted.
