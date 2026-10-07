# Contribute

Contributions are always welcome. The whole list lives in one file, [README.md](https://github.com/wmariuss/awesome-devops/blob/main/README.md). The website at [awesome-devops.xyz](https://awesome-devops.xyz) is built from it, so a change to the README is all you need: you never edit the website.

## Before you add a tool

Check that the tool:

- helps teams build, ship, run or secure software, and fits one of the existing sections;
- is not already on the list (search [awesome-devops.xyz](https://awesome-devops.xyz) first);
- is maintained: its repository is not archived and has had activity in the last two years;
- is established: an open source tool needs a public repository with an open source license, at least 100 stars and 6 months of history; a tool without a repository needs a website on a domain at least 6 months old;
- has an official link, without tracking parameters such as `utm_source`.

New projects are welcome once they meet these numbers. They keep out abandoned experiments, and projects with bought stars or a site set up only to be listed.

To suggest a new section, [open an issue](https://github.com/wmariuss/awesome-devops/issues/new) first so it can be discussed.

## Add a tool

1. Open [README.md on GitHub](https://github.com/wmariuss/awesome-devops/edit/main/README.md) and select the pencil icon to edit it. GitHub forks the repository for you.
2. Add one line to the right section, in this format:

   ```markdown
   - [Name](https://example.com/) - What the tool does, in one sentence. `oss`
   ```

3. Select **Commit changes**, then **Create pull request**. Add one tool per pull request.

Within a few minutes an automated review comments on your pull request. It checks the entry format and tags, that the link works and has no tracking parameters, that the tool is not already listed, and how mature the project is (repository age, stars, forks, contributors, last activity, domain age, signs of inflated stars), and an AI reviewer checks that the description, section and tags match the project. The comment lists anything to fix, often with a corrected line you can copy, and updates every time you push.

## Writing the entry

- **Name**: the project's own spelling, for example `Kubernetes`, `GitLab`, `etcd`.
- **Link**: the project's website, or its GitHub repository if it has no website.
- **Description**: one sentence that says what the tool does, ending with a period. Leave out marketing words like "best", "blazing fast" or "revolutionary".

## Pricing tags

End every entry with one or more tags:

| Tag | Use it when |
| --- | --- |
| `oss` | The source code is public under an open source license. |
| `free` | There is a free plan or free usage, but the tool is not open source. |
| `paid` | There are paid plans, an enterprise edition or paid support. |
| `self-hosted` | You can run it on your own servers, but it is not open source. |

Combine them when more than one applies:

| Tool | Tags |
| --- | --- |
| Open source, nothing to buy | `oss` |
| Open source with a hosted or enterprise offering | `oss` `paid` |
| SaaS with a free tier | `free` `paid` |
| Commercial product you can install yourself | `paid` `self-hosted` |
| Paid only | `paid` |

The website shows these as **Open source**, **Freemium** (has a free plan) or **Paid**.

## GitHub stars and activity

The website shows stars, license, language and last activity from GitHub, refreshed every day. You don't need to do anything for this:

- if the link is a GitHub repository, that repository is used;
- if the link is a website, the build searches GitHub for a repository with the same name whose homepage is that website.

If the site shows the wrong repository or none at all, add the correct one to [`website/src/data/repos.json`](https://github.com/wmariuss/awesome-devops/blob/main/website/src/data/repos.json), keyed by the entry's link:

```json
{
  "https://www.example.com/": "example-org/example"
}
```

## Preview the website locally

```sh
cd website
npm install
npm run dev
```

Then open the address it prints. See [website/README.md](https://github.com/wmariuss/awesome-devops/blob/main/website/README.md) for details.
