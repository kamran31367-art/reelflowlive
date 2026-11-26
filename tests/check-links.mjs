import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '_site');
let checks = 0;
const failures = [];

function check(name, ok, detail = '') {
  checks++;
  if (ok) {
    console.log('PASS  ' + name);
  } else {
    failures.push(name + (detail ? ' [' + detail + ']' : ''));
    console.log('FAIL  ' + name + (detail ? '  [' + detail + ']' : ''));
  }
}

if (!fs.existsSync(out)) {
  console.error('_site is missing. Run "npm run build" first.');
  process.exit(2);
}

const read = (rel) => fs.readFileSync(path.join(out, rel), 'utf8');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/site.json'), 'utf8'));
const toolsData = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/tools.json'), 'utf8'));

const pages = [
  { file: 'index.html', url: '/' },
  { file: 'youtube-thumbnail-downloader/index.html', url: '/youtube-thumbnail-downloader/' },
  { file: 'image-resizer/index.html', url: '/image-resizer/' },
  { file: 'image-compressor/index.html', url: '/image-compressor/' },
  { file: 'srt-editor/index.html', url: '/srt-editor/' },
  { file: 'youtube-chapters/index.html', url: '/youtube-chapters/' },
  { file: 'character-counter/index.html', url: '/character-counter/' },
  { file: 'blog/index.html', url: '/blog/' },
  { file: 'blog/youtube-thumbnail-size/index.html', url: '/blog/youtube-thumbnail-size/' },
  { file: 'privacy/index.html', url: '/privacy/', noindex: true },
  { file: '404.html', url: '/404.html', noindex: true }
];

function resolvePath(link) {
  let target = link.split('#')[0].split('?')[0];
  if (!target || target.startsWith('http') || target.startsWith('mailto:')) return null;
  if (!target.startsWith('/')) return null;
  if (target.endsWith('/')) target += 'index.html';
  if (target === '') target = '/index.html';
  return path.join(out, target.replace(/^\//, ''));
}

function collectRefs(html) {
  const refs = [];
  const attrRe = /(?:href|src)="([^"]+)"/g;
  let match;
  while ((match = attrRe.exec(html))) refs.push(match[1]);
  return refs;
}

const titles = new Set();

for (const page of pages) {
  const filePath = path.join(out, page.file);
  if (!fs.existsSync(filePath)) {
    check(page.file + ' exists', false);
    continue;
  }
  const html = read(page.file);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  check(page.file + ': title', title.length > 10, title);
  titles.add(title);

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  check(page.file + ': exactly one h1', h1Count === 1, String(h1Count));

  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  check(page.file + ': meta description', description.length > 40, String(description.length));

  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  if (page.noindex) {
    check(page.file + ': noindex, no canonical', /<meta name="robots" content="noindex">/.test(html) && !canonical);
  } else {
    check(page.file + ': canonical', canonical === site.url + page.url, canonical);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    let parsed = null;
    try {
      parsed = ld ? JSON.parse(ld[1]) : null;
    } catch (err) {
      parsed = null;
    }
    check(page.file + ': JSON-LD parses', !!parsed && Array.isArray(parsed['@graph']) && parsed['@graph'].length >= 2);
  }

  check(page.file + ': consent banner', /id="consent"/.test(html) && /data-version="\d+"/.test(html) && /id="consentAccept"/.test(html) && /id="consentDecline"/.test(html));
  const adsRaw = (html.match(/window\.CT_ADS = (\{[\s\S]*?\});<\/script>/) || [])[1];
  check(page.file + ': ad config present', !!adsRaw && /"enabled":/.test(adsRaw));

  let broken = [];
  for (const ref of collectRefs(html)) {
    if (ref.startsWith('data:') || ref.startsWith('mailto:')) continue;
    if (ref.startsWith('#')) continue;
    const target = resolvePath(ref);
    if (target && !fs.existsSync(target)) broken.push(ref);
  }
  check(page.file + ': internal links resolve', broken.length === 0, broken.slice(0, 4).join(', '));
}

check('page titles are unique', titles.size === pages.length, titles.size + ' of ' + pages.length);
check('OG cover image exists', fs.existsSync(path.join(out, 'assets/img/og-cover.png')) &&
  read('index.html').includes('property="og:image" content="' + site.ogImage + '"'));

/* Sitemap */
const sitemap = read('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = pages.filter((page) => !page.noindex).map((page) => site.url + page.url);
check('sitemap has ' + indexable.length + ' URLs', locs.length === indexable.length, String(locs.length));
check('sitemap starts with homepage', locs[0] === site.url + '/', locs[0]);
check('sitemap excludes privacy and 404', !locs.some((u) => /privacy|404/.test(u)));
check('sitemap lists every indexable page', indexable.every((url) => locs.includes(url)), indexable.filter((url) => !locs.includes(url)).join(', '));
check('sitemap excludes drafts', !sitemap.includes('/blog/srt-subtitle-timing/'));
const postSource = fs.readFileSync(path.join(root, 'src/blog/posts/youtube-thumbnail-size.md'), 'utf8');
const postDate = (postSource.match(/^date:\s*(\S+)/m) || [])[1] || '';
const postBlock = sitemap.split('<url>').find((block) => block.includes('/blog/youtube-thumbnail-size/'));
check('sitemap uses the post publish date', !!postBlock && postBlock.includes('<lastmod>' + postDate + '</lastmod>'), postDate);
check('sitemap lastmod uses site data', sitemap.includes('<lastmod>' + site.lastUpdated + '</lastmod>'));
let sitemapMissing = [];
for (const loc of locs) {
  const rel = loc.replace(site.url, '').replace(/^\//, '') || 'index.html';
  const target = path.join(out, rel.endsWith('/') || rel === '' ? rel + 'index.html' : rel);
  if (!fs.existsSync(target)) sitemapMissing.push(loc);
}
check('sitemap URLs resolve', sitemapMissing.length === 0, sitemapMissing.join(', '));

/* Robots */
check('robots.txt links the sitemap', /Sitemap: https:\/\/reelflow\.live\/sitemap\.xml/.test(read('robots.txt')));

/* Blog */
const feed = read('blog/feed.xml');
check('blog feed is valid RSS', /^<\?xml/.test(feed.trim()) && /<rss version="2.0"/.test(feed) && /<\/rss>\s*$/.test(feed.trim()));
check('feed lists the published post', feed.includes(site.url + '/blog/youtube-thumbnail-size/') && /<pubDate>[^<]+<\/pubDate>/.test(feed));
check('feed excludes drafts', !feed.includes('srt-subtitle-timing'));
const blogHtml = read('blog/index.html');
check('blog index links the published post', blogHtml.includes('href="/blog/youtube-thumbnail-size/"'));
check('blog index hides drafts', !blogHtml.includes('srt-subtitle-timing'));
check('blog index links the RSS feed', blogHtml.includes('href="/blog/feed.xml"'));
const postHtml = read('blog/youtube-thumbnail-size/index.html');
check('post has BlogPosting data', /"@type":\s*"BlogPosting"/.test(postHtml) && postHtml.includes('"datePublished": "' + postDate + '"'));
check('post links back to the blog', postHtml.includes('href="/blog/"'));
check('draft post is not built', !fs.existsSync(path.join(out, 'blog/srt-subtitle-timing/index.html')));

/* Tools data */
const tools = toolsData.tools || [];
check('tools.json has 6 tools', tools.length === 6, String(tools.length));
for (const tool of tools) {
  check('tool "' + tool.slug + '": page + content + footer label',
    !!tool.url && !!tool.footerName && fs.existsSync(path.join(out, tool.url, 'index.html')) &&
    fs.existsSync(path.join(root, 'src/_data/toolpages', tool.slug + '.json')));
}

/* Ads defaults */
const ads = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/ads.json'), 'utf8'));
check('ads disabled by default', ads.enabled === false);
check('ads file has loader script', fs.existsSync(path.join(out, 'assets/js/ads.js')));
check('ads loader is on every page', pages.every((p) => read(p.file).includes('/assets/js/ads.js')));
check('ads excluded from privacy and 404', ads.excludePages.includes('/privacy/') && ads.excludePages.includes('/404.html'));

/* Monetag service worker */
const sw = read('sw.js');
check('sw.js is served from the site root', /self\.options\s*=\s*\{/.test(sw) && sw.includes('"zoneId": 12360454'));
check('sw.js imports the Monetag worker', sw.includes("importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')"));
check('sw.js is not web-page markup', !/<html|<!doctype|layout/i.test(sw));
check('sw.js stays out of the sitemap', !sitemap.includes('/sw.js'));

/* Stale homepage rendering */
check('homepage has server-rendered cards', (read('index.html').match(/class="tool-card"/g) || []).length === 6);
check('no leftover client card renderer', !read('assets/js/app.js').includes('toolGrid'));

console.log('\n' + (failures.length ? failures.length + ' FAILED of ' + checks : 'ALL ' + checks + ' CHECKS PASSED'));
process.exit(failures.length ? 1 : 0);
