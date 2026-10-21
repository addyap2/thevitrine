# The Vitrine

A shop window for the websites and apps Antony and Julien build with AI. Every
project stays in its own GitHub account and Vercel project. This site only
collects and links to them.

Built with [Astro](https://astro.build). The site has no runtime JavaScript
except the small filter script.

## Add a project

1. On GitHub, open the repo and click the gear icon next to **About**.
2. Put the live URL in **Website**, and add the topic **`thevitrine`**. You can
   add more topics as tags (for example `learning` or `restaurant`).
3. That's it. The daily sync picks it up, takes a screenshot and redeploys.
   To skip the wait, run **Actions → Sync projects → Run workflow**.

The account must be listed in [`vitrine.config.json`](vitrine.config.json),
together with the name to show as its maker.

## Polish a project

[`src/data/overrides.json`](src/data/overrides.json) has three parts:

- **`categories`**: the page's sections, in the order they appear. Each one has
  an `id` and a `label`.
- **`projects`**: settings for a repo, keyed by its name. Give each one a
  `category` (one of the ids above) and an `order` within that section. A
  tagged repo without a category shows under "More" until it gets one. Any of
  these fields replaces what GitHub says: `title`, `description`, `url`,
  `tags`, `maker`. The others are `featured: true` to pin it first in its
  section, `inProgress: true` to show a badge, and `hidden: true` to leave it out.
- **`extra`**: projects that aren't on GitHub. Each one needs `slug`, `title`,
  `url` and `maker`. Once a repo with the same name as an extra's `slug` gets the
  topic, the repo version replaces the extra.

To use your own screenshot, put a 16:10 image at `public/shots/<repo-name>.jpg`.

## Run it locally

```bash
npm install
npx playwright install chromium   # once, for screenshots
npm run sync                      # fetch tagged repos → src/data/projects.json
npm run dev
```

`GITHUB_TOKEN` is optional. It raises the rate limit and includes private repos
the token can read. For private repos, the card shows no "Code" link.
`npm run sync -- --all` previews every repo with a website link, whether or not
it has the topic. Don't commit that output.

## How it fits together

- `scripts/sync.mjs` searches GitHub for the topic across the configured
  accounts, applies the overrides, screenshots new sites and writes
  `src/data/projects.json`.
- `.github/workflows/sync.yml` runs that sync every day. If anything changed,
  it commits to `main`, and Vercel redeploys on that push.
- The Astro build reads only the committed JSON, so deploys never depend on the
  GitHub API.

To include private repos from another account, add a `VITRINE_TOKEN` secret.
It must be a fine-grained token that can read those repos.
