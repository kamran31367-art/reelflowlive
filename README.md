# ReelFlow Toolkit - reelflow.live

Static creator-tools site for https://reelflow.live, built with Eleventy 3 and
deployed to GitHub Pages by GitHub Actions. All tools run in the browser.

## Edit the site without code (Pages CMS)

1. Open https://app.pagescms.org and sign in with GitHub.
2. Choose the repository `kamran31367-art/reelflowlive` and the `main` branch.
3. Pick a section in the sidebar:
   - **Site settings** - brand name, header/footer links, social links, cookie notice.
   - **Homepage** - hero text, buttons, trust points, tools section, features, FAQ.
   - **Tool page: ...** - browser title, meta description, kicker, heading, intro, FAQ, next tools.
   - **Tools list** - home cards, footer tool links and the sitemap order.
   - **Blog posts** - write, edit and publish articles (`draft` keeps a post off the site).
   - **Advertising (Monetag)** - ad script settings (disabled until you fill them in).
   - **System page text** - 404 and privacy page titles.
4. Click **Save**. Pages CMS commits to `main`; GitHub Actions rebuilds and deploys
   in about a minute.

Text is plain English. Headings and FAQ answers accept normal punctuation; do not paste
HTML into these fields.

## Local development

```bash
npm install
npm run serve     # http://localhost:8080, rebuilds on change
npm run build     # writes _site/
npm run check     # link + SEO checks against _site (run after build)
```

## Blog

The blog lives on the same site and hosting, so it adds no cost:

- List page: `https://reelflow.live/blog/`
- Article URL: `https://reelflow.live/blog/<file-name>/`
- RSS feed: `https://reelflow.live/blog/feed.xml`

To publish an article, open **Blog posts** in Pages CMS and create a post:

1. Fill **Title**, **Short description** and **Publish date**.
2. Write the **Article body** in Markdown. Use `##` for section headings.
3. Optionally upload a **Cover image** (1200x630). Uploads go to
   `src/assets/img/blog/`.
4. Switch **Draft** off and save. GitHub Actions rebuilds the site in about a minute.

New posts start with **Draft** on, so saving work in progress does not publish it.
Drafts are left out of the blog list, the RSS feed and the sitemap.

Keep the file name short and stable: it becomes the URL. Changing it after Google has
indexed the post creates a new URL and loses the old one.

After publishing a post, open Google Search Console > URL Inspection, paste the new
article URL and choose **Request indexing**. The sitemap updates automatically, so a
resubmission is not needed.

The posts are in `src/blog/posts/`: one guide per tool (thumbnail download, resizing,
compression, subtitle conversion, chapters, character limits) plus the thumbnail size
guide, all published. `srt-subtitle-timing.md` is a draft you can edit and publish
later.

## Advertising (Monetag)

The site runs Monetag's classic In-Page Push zone `12360845`. Current settings in
`src/_data/ads.json`: `enabled: true`, `scriptSrc: https://nap5k.com/tag.min.js`,
`attrs.zone: 12360845`, `attrs.cfasync: false`. The loader injects
`<script src=... data-zone=... data-cfasync="false" async>` and nothing else.

The earlier Multitag install (`316349`, `quge5.com`) was paused because its OnClick
popunder cannot be switched off on its own and opened on every click.

To change or pause ads:

1. In Pages CMS open **Advertising (Monetag)**.
2. Paste the zone's **Script URL** and **Zone ID** from the Monetag dashboard
   (single-format zone → Get tag).
3. Switch **Load ads on the site** off to pause without deleting the IDs.

The loader waits for the visitor to accept the cookie notice when
**Wait for cookie consent** is on (recommended). If you change the cookie notice text,
increase its **Version** in Site settings so visitors are asked again.

### Push notifications (`/sw.js`)

Monetag's service worker is built from `src/sw.njk` and served at
`https://reelflow.live/sw.js` (site root, scope `/`). Keep that path; the dashboard
verifies it there. The file only imports Monetag's remote worker — nothing runs until
the Monetag tag script is loaded and a visitor allows browser notifications, so cookie
consent does not gate it and the privacy page discloses it. If Monetag issues a new
`zoneId`, update it in `src/sw.njk` only.

## Cookie notice

The banner and its text live in Site settings. The choice is stored in the browser
(`ct.consent`) with the notice version. Accepting triggers the ad loader; declining
keeps all ad scripts unloaded.

## Privacy page

The privacy page text is in `src/privacy.njk` (it is `noindex`). It links from the footer
and the cookie notice, and its **Change cookie choice** button clears `ct.consent` and
reloads so the banner asks again (the ad script cannot be unloaded mid-page). Replace the
contact paragraph with your real contact details before submitting the site to ad networks.

## Deploy setup (one time)

In GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
The custom domain stays `reelflow.live` (the `CNAME` file is copied into the build).
DNS keeps pointing at GitHub Pages.

## Project layout

```
src/
  index.njk                  homepage template
  <tool-slug>.njk            6 tool pages (tool UI markup)
  privacy.njk, 404.njk
  sitemap.njk
  blog/
    index.njk                blog list (/blog/)
    feed.njk                 RSS feed (/blog/feed.xml)
    posts/*.md               one Markdown file per article (CMS writes here)
    posts/posts.11tydata.js  post defaults, draft handling, article URLs
  _data/
    site.json                brand, links, consent text
    home.json                homepage content
    tools.json               tool cards + footer names
    toolpages/*.json         per-page SEO copy, FAQ, next tools
    ads.json                 advertising settings (disabled)
    system.json              404 + privacy page meta
  _includes/
    layouts/base.njk         head, header, footer, consent, scripts
    layouts/post.njk         article page layout
    partials/*.njk
  assets/                    CSS, JS, images (copied as-is)
    img/blog/                blog cover and body images (Pages CMS uploads)
archive/landing-legacy.html  previous one-page site, not published
```

## Tests

- `npm run check` - built HTML: titles, canonical, JSON-LD, internal links,
  sitemap, RSS feed, drafts, robots, consent banner, ad config.
- Browser suites live outside this repository (`ct-shots`) and run against a local
  server of `_site`.
