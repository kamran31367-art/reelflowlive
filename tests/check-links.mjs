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
  ...(toolsData.tools || []).map((tool) => ({ file: tool.url.replace(/^\//, '') + 'index.html', url: tool.url })),
  { file: 'blog/index.html', url: '/blog/' },
  { file: 'blog/youtube-thumbnail-size/index.html', url: '/blog/youtube-thumbnail-size/' },
  { file: 'blog/download-youtube-thumbnail/index.html', url: '/blog/download-youtube-thumbnail/' },
  { file: 'blog/resize-images-without-blur/index.html', url: '/blog/resize-images-without-blur/' },
  { file: 'blog/compress-images-before-upload/index.html', url: '/blog/compress-images-before-upload/' },
  { file: 'blog/srt-to-vtt-conversion/index.html', url: '/blog/srt-to-vtt-conversion/' },
  { file: 'blog/youtube-chapters-rules/index.html', url: '/blog/youtube-chapters-rules/' },
  { file: 'blog/platform-character-limits/index.html', url: '/blog/platform-character-limits/' },
  { file: 'blog/favicon-sizes-guide/index.html', url: '/blog/favicon-sizes-guide/' },
  { file: 'blog/jpg-png-webp-conversion/index.html', url: '/blog/jpg-png-webp-conversion/' },
  { file: 'blog/base64-data-uri-images/index.html', url: '/blog/base64-data-uri-images/' },
  { file: 'blog/thumbnail-safe-zone-guide/index.html', url: '/blog/thumbnail-safe-zone-guide/' },
  { file: 'blog/meme-text-readable/index.html', url: '/blog/meme-text-readable/' },
  { file: 'blog/clean-text-in-one-pass/index.html', url: '/blog/clean-text-in-one-pass/' },
  { file: 'blog/title-preview-before-publish/index.html', url: '/blog/title-preview-before-publish/' },
  { file: 'blog/utm-links-that-stay-readable/index.html', url: '/blog/utm-links-that-stay-readable/' },
  { file: 'blog/share-youtube-at-second/index.html', url: '/blog/share-youtube-at-second/' },
  { file: 'blog/qr-codes-print-and-screen/index.html', url: '/blog/qr-codes-print-and-screen/' },
  { file: 'blog/json-base64-sha256-quick-fixes/index.html', url: '/blog/json-base64-sha256-quick-fixes/' },
  { file: 'blog/contrast-ratio-captions/index.html', url: '/blog/contrast-ratio-captions/' },
  { file: 'blog/trim-video-without-upload/index.html', url: '/blog/trim-video-without-upload/' },
  { file: 'blog/video-to-gif-size-guide/index.html', url: '/blog/video-to-gif-size-guide/' },
  { file: 'blog/grab-sharp-frame/index.html', url: '/blog/grab-sharp-frame/' },
  { file: 'blog/extract-audio-from-video/index.html', url: '/blog/extract-audio-from-video/' },
  { file: 'blog/speed-audio-tape-effect/index.html', url: '/blog/speed-audio-tape-effect/' },
  { file: 'blog/merge-split-rotate-pdfs-locally/index.html', url: '/blog/merge-split-rotate-pdfs-locally/' },
  { file: 'blog/pdf-pages-to-png/index.html', url: '/blog/pdf-pages-to-png/' },
  { file: 'blog/background-removal-portraits/index.html', url: '/blog/background-removal-portraits/' },
  { file: 'blog/srt-subtitle-timing/index.html', url: '/blog/srt-subtitle-timing/' },
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
check('sitemap lists the subtitle timing post', sitemap.includes('/blog/srt-subtitle-timing/'));
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
check('feed lists the subtitle timing post', feed.includes(site.url + '/blog/srt-subtitle-timing/'));
const blogHtml = read('blog/index.html');
check('blog index links the published post', blogHtml.includes('href="/blog/youtube-thumbnail-size/"'));
check('blog index links the subtitle timing post', blogHtml.includes('href="/blog/srt-subtitle-timing/"'));
check('blog index links the RSS feed', blogHtml.includes('href="/blog/feed.xml"'));
const postHtml = read('blog/youtube-thumbnail-size/index.html');
check('post has BlogPosting data', /"@type":\s*"BlogPosting"/.test(postHtml) && postHtml.includes('"datePublished": "' + postDate + '"'));
check('post links back to the blog', postHtml.includes('href="/blog/"'));
check('subtitle timing post is built', fs.existsSync(path.join(out, 'blog/srt-subtitle-timing/index.html')));

/* Tool guides */
const guides = [
  { post: 'blog/download-youtube-thumbnail/index.html', tool: '/youtube-thumbnail-downloader/' },
  { post: 'blog/resize-images-without-blur/index.html', tool: '/image-resizer/' },
  { post: 'blog/compress-images-before-upload/index.html', tool: '/image-compressor/' },
  { post: 'blog/srt-to-vtt-conversion/index.html', tool: '/srt-editor/' },
  { post: 'blog/youtube-chapters-rules/index.html', tool: '/youtube-chapters/' },
  { post: 'blog/platform-character-limits/index.html', tool: '/character-counter/' },
  { post: 'blog/favicon-sizes-guide/index.html', tool: '/favicon-generator/' },
  { post: 'blog/jpg-png-webp-conversion/index.html', tool: '/image-converter/' },
  { post: 'blog/base64-data-uri-images/index.html', tool: '/image-to-base64/' },
  { post: 'blog/thumbnail-safe-zone-guide/index.html', tool: '/thumbnail-safe-zone/' },
  { post: 'blog/meme-text-readable/index.html', tool: '/meme-generator/' },
  { post: 'blog/clean-text-in-one-pass/index.html', tool: '/text-tools/' },
  { post: 'blog/title-preview-before-publish/index.html', tool: '/title-preview/' },
  { post: 'blog/utm-links-that-stay-readable/index.html', tool: '/utm-link-builder/' },
  { post: 'blog/share-youtube-at-second/index.html', tool: '/youtube-timestamp-link/' },
  { post: 'blog/qr-codes-print-and-screen/index.html', tool: '/qr-code-generator/' },
  { post: 'blog/json-base64-sha256-quick-fixes/index.html', tool: '/developer-tools/' },
  { post: 'blog/contrast-ratio-captions/index.html', tool: '/color-contrast-checker/' },
  { post: 'blog/trim-video-without-upload/index.html', tool: '/video-trimmer/' },
  { post: 'blog/video-to-gif-size-guide/index.html', tool: '/video-to-gif/' },
  { post: 'blog/grab-sharp-frame/index.html', tool: '/video-frame-grabber/' },
  { post: 'blog/extract-audio-from-video/index.html', tool: '/audio-extractor/' },
  { post: 'blog/speed-audio-tape-effect/index.html', tool: '/audio-speed-pitch/' },
  { post: 'blog/merge-split-rotate-pdfs-locally/index.html', tool: '/pdf-tools/' },
  { post: 'blog/pdf-pages-to-png/index.html', tool: '/pdf-to-images/' },
  { post: 'blog/background-removal-portraits/index.html', tool: '/background-remover/' },
  { post: 'blog/srt-subtitle-timing/index.html', tool: '/srt-editor/' }
];
for (const guide of guides) {
  const html = read(guide.post);
  check(guide.post + ': links its tool', html.includes('href="' + guide.tool + '"'));
  check(guide.post + ': listed on the blog index', blogHtml.includes('href="/' + guide.post.replace(/index\.html$/, '') + '"'));
  check(guide.post + ': listed in the feed', feed.includes(site.url + '/' + guide.post.replace(/index\.html$/, '')));
}

/* Tools data */
const tools = toolsData.tools || [];
const cms = fs.readFileSync(path.join(root, '.pages.yml'), 'utf8');
check('tools.json lists tools', tools.length >= 6, String(tools.length));
const toolSlugs = tools.map((tool) => tool.slug);
check('tool slugs are unique', new Set(toolSlugs).size === toolSlugs.length);
for (const tool of tools) {
  check('tool "' + tool.slug + '": page + content + footer label',
    !!tool.url && !!tool.footerName && fs.existsSync(path.join(out, tool.url, 'index.html')) &&
    fs.existsSync(path.join(root, 'src/_data/toolpages', tool.slug + '.json')));
  const pageData = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/toolpages', tool.slug + '.json'), 'utf8'));
  const unknown = (pageData.related || []).map((rel) => rel.slug).filter((slug) => !toolSlugs.includes(slug));
  check('tool "' + tool.slug + '": related tools exist', unknown.length === 0, unknown.join(', '));
  check('tool "' + tool.slug + '": editable in Pages CMS with its icon',
    cms.includes('path: src/_data/toolpages/' + tool.slug + '.json') &&
    cms.includes('                - name: ' + tool.icon + '\n'));
  const pageSrc = fs.readFileSync(path.join(root, 'src', tool.slug + '.njk'), 'utf8');
  const scriptMatch = pageSrc.match(/pageScript:\s*(\S+)/);
  const scriptTags = scriptMatch
    ? read(tool.url.replace(/^\//, '') + 'index.html').split('assets/js/' + scriptMatch[1]).length - 1
    : 0;
  check('tool "' + tool.slug + '": tool script included exactly once', scriptTags === 1, String(scriptTags));
}

/* Ads defaults */
const ads = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/ads.json'), 'utf8'));
check('ads config is complete when enabled', !ads.enabled || (!!ads.scriptSrc && !!ads.attrs.zone));
const adHost = ads.scriptSrc ? new URL(ads.scriptSrc).hostname : null;
const adTag = adHost ? new RegExp('<script[^>]+src="https:\\/\\/' + adHost.replace(/\./g, '\\.') + '\\/') : null;
check('ad tag never appears as static markup', !adTag || pages.every((p) => !adTag.test(read(p.file))));
check('ads file has loader script', fs.existsSync(path.join(out, 'assets/js/ads.js')));
check('ads loader is on every page', pages.every((p) => read(p.file).includes('/assets/js/ads.js')));
check('ads excluded from privacy and 404', ads.excludePages.includes('/privacy/') && ads.excludePages.includes('/404.html'));

/* Monetag service worker */
const sw = read('sw.js');
check('sw.js is served from the site root', /self\.options\s*=\s*\{/.test(sw) && sw.includes('"zoneId": 12360551'));
check('sw.js imports the Monetag worker', sw.includes("importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')"));
check('sw.js is not web-page markup', !/<html|<!doctype|layout/i.test(sw));
check('sw.js stays out of the sitemap', !sitemap.includes('/sw.js'));
check('privacy page discloses push notifications', read('privacy/index.html').includes('Push notifications'));
const privacyHtml = read('privacy/index.html');
check('privacy page offers a cookie opt-out', privacyHtml.includes('data-consent-reset') && privacyHtml.includes('Your choices and opt-out'));
check('privacy page lists a contact address', /href="mailto:[^"]+@[^"]+"/.test(privacyHtml));
check('consent reset is wired in app.js', read('assets/js/app.js').includes('[data-consent-reset]'));
check('footer links the privacy page', pages.every((p) => /<div class="footer-links">[\s\S]*?href="\/privacy\/"/.test(read(p.file))));

/* Stale homepage rendering */
check('homepage has server-rendered cards', (read('index.html').match(/class="tool-card"/g) || []).length === tools.length, String(tools.length));
check('no leftover client card renderer', !read('assets/js/app.js').includes('toolGrid'));

console.log('\n' + (failures.length ? failures.length + ' FAILED of ' + checks : 'ALL ' + checks + ' CHECKS PASSED'));
process.exit(failures.length ? 1 : 0);
