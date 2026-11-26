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

## Advertising (Monetag)

Ads are off by default and no third-party script loads. To turn them on:

1. In Pages CMS open **Advertising (Monetag)**.
2. Set **Script URL** to the tag URL from the Monetag dashboard
   (usually `https://libtl.com/sdk.js`).
3. Fill **Zone ID** and **SDK ID** from the Monetag snippet.
4. Switch **Load ads on the site** on and save.

The loader waits for the visitor to accept the cookie notice when
**Wait for cookie consent** is on (recommended). If you change the cookie notice text,
increase its **Version** in Site settings so visitors are asked again.

## Cookie notice

The banner and its text live in Site settings. The choice is stored in the browser
(`ct.consent`) with the notice version. Accepting triggers the ad loader; declining
keeps all ad scripts unloaded.

## Privacy page

The privacy page text is in `src/privacy.njk` (it is `noindex` until you finalise it).
Replace the contact paragraph with your real contact details before submitting the
site to ad networks.

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
  _data/
    site.json                brand, links, consent text
    home.json                homepage content
    tools.json               tool cards + footer names
    toolpages/*.json         per-page SEO copy, FAQ, next tools
    ads.json                 advertising settings (disabled)
    system.json              404 + privacy page meta
  _includes/
    layouts/base.njk         head, header, footer, consent, scripts
    partials/*.njk
  assets/                    CSS, JS, images (copied as-is)
archive/landing-legacy.html  previous one-page site, not published
```

## Tests

- `npm run check` - built HTML: titles, canonical, JSON-LD, internal links,
  sitemap, robots, consent banner, ad config.
- Browser suites live outside this repository (`ct-shots`) and run against a local
  server of `_site`.
