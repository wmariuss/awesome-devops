---
applyTo: ".github/workflows/**"
---

# Reviewing GitHub Actions workflows

- Workflows triggered by `pull_request_target` run with secrets. They **must not** check out, install or run code from the pull request head. Reading files from the pull request with `git show` or the API as data is fine.
- Never interpolate untrusted input (`github.event.pull_request.title`, `.body`, branch names, issue text) directly into `run:` scripts. Pass it through `env:` and quote it.
- Set the smallest `permissions:` each workflow needs.
- Pin third-party actions to a major version at least; prefer actions from GitHub or verified publishers.
- Secrets must only be passed to the steps that need them.
