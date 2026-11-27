import fs from 'node:fs';
import path from 'node:path';
import { JSON_SCHEMA, load as loadYaml } from 'js-yaml';

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
const tools = toolsData.tools || [];

const postDir = path.join(root, 'src/blog/posts');
const postFiles = fs.readdirSync(postDir).filter((file) => /\.(md|liquid)$/.test(file)).sort();
const publishedPosts = [];

for (const file of postFiles) {
  const source = fs.readFileSync(path.join(postDir, file), 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  check(file + ': frontmatter is present', !!match);
  if (!match) continue;

  let data;
  try {
    data = loadYaml(match[1], { schema: JSON_SCHEMA }) || {};
  } catch (err) {
    check(file + ': frontmatter parses', false, err.message);
    continue;
  }

  const slug = file.replace(/\.(md|liquid)$/, '');
  const url = typeof data.permalink === 'string' && data.permalink
    ? data.permalink
    : '/blog/' + slug + '/';
  const post = {
    file,
    slug,
    url,
    source,
    data,
    date: (source.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m) || [])[1] || '',
    output: url.replace(/^\//, '') + (url.endsWith('/') ? 'index.html' : '')
  };
  if (data.draft !== true && data.permalink !== false) publishedPosts.push(post);
}

const publishedBySlug = new Map(publishedPosts.map((post) => [post.slug, post]));
const pages = [
  { file: 'index.html', url: '/' },
  ...[
    'tailwind-tools',
    'developer-tools-hub',
    'image-tools',
    'mail-tools',
    'text-tools-hub',
    'video-audio-tools',
    'converter-tools',
    'misc-tools'
  ].map((slug) => ({ file: slug + '/index.html', url: '/' + slug + '/' })),
  ...tools.map((tool) => ({ file: tool.url.replace(/^\//, '') + 'index.html', url: tool.url })),
  { file: 'blog/index.html', url: '/blog/' },
  ...publishedPosts.map((post) => ({
    file: post.output,
    url: post.url,
    sitemap: post.data.sitemap !== false
  })),
  { file: 'privacy/index.html', url: '/privacy/', noindex: true },
  { file: '404.html', url: '/404.html', noindex: true }
];

const publishedPostUrls = publishedPosts.map((post) => post.url);
check('published guide URLs are unique', new Set(publishedPostUrls).size === publishedPostUrls.length);
check('published guides use the blog permalink scheme', publishedPosts.every((post) => post.url.startsWith('/blog/') && post.url.endsWith('/')));
const builtPostFiles = fs.existsSync(path.join(out, 'blog'))
  ? fs.readdirSync(path.join(out, 'blog'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(out, 'blog', entry.name, 'index.html')))
    .map((entry) => 'blog/' + entry.name + '/index.html')
    .sort()
  : [];
const expectedPostFiles = publishedPosts.map((post) => post.output).sort();
check('built blog contains exactly the published guides',
  builtPostFiles.length === expectedPostFiles.length && builtPostFiles.every((file, index) => file === expectedPostFiles[index]),
  builtPostFiles.length + ' built, ' + expectedPostFiles.length + ' expected');

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

const builtPages = pages.filter((page) => fs.existsSync(path.join(out, page.file)));
check('page titles are unique', titles.size === pages.length, titles.size + ' of ' + pages.length);
check('OG cover image exists', fs.existsSync(path.join(out, 'assets/img/og-cover.png')) &&
  read('index.html').includes('property="og:image" content="' + site.ogImage + '"'));

/* Sitemap */
const sitemap = read('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = pages.filter((page) => !page.noindex && page.sitemap !== false).map((page) => site.url + page.url);
check('sitemap has ' + indexable.length + ' URLs', locs.length === indexable.length, String(locs.length));
check('sitemap starts with homepage', locs[0] === site.url + '/', locs[0]);
check('sitemap excludes privacy and 404', !locs.includes(site.url + '/privacy/') && !locs.includes(site.url + '/404.html'));
check('sitemap lists every indexable page', indexable.every((url) => locs.includes(url)), indexable.filter((url) => !locs.includes(url)).join(', '));
const sitemapBlocks = sitemap.split('<url>').slice(1);
const wrongPostDates = publishedPosts.filter((post) => {
  const block = sitemapBlocks.find((entry) => entry.includes('<loc>' + site.url + post.url + '</loc>'));
  return !post.date || !block || !block.includes('<lastmod>' + post.date + '</lastmod>');
});
check('sitemap uses every post publish date', wrongPostDates.length === 0, wrongPostDates.map((post) => post.slug).join(', '));
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
const feedItems = feed.split('<item>').slice(1);
check('blog feed is valid RSS', /^<\?xml/.test(feed.trim()) && /<rss version="2.0"/.test(feed) && /<\/rss>\s*$/.test(feed.trim()));
check('feed lists every published guide', publishedPosts.every((post) => feed.includes(site.url + post.url)));
check('feed has one item per published guide', feedItems.length === publishedPosts.length, feedItems.length + ' of ' + publishedPosts.length);
const missingFeedDates = publishedPosts.filter((post) => {
  const item = feedItems.find((entry) => entry.includes('<link>' + site.url + post.url + '</link>'));
  return !item || !/<pubDate>[^<]+<\/pubDate>/.test(item);
});
check('feed has a publish date for every guide', missingFeedDates.length === 0, missingFeedDates.map((post) => post.slug).join(', '));
const blogHtml = read('blog/index.html');
check('blog index links every published guide', publishedPosts.every((post) => blogHtml.includes('href="' + post.url + '"')));
check('blog index links the RSS feed', blogHtml.includes('href="/blog/feed.xml"'));
const thumbnailPost = publishedBySlug.get('download-youtube-thumbnail');
check('thumbnail guide is published', !!thumbnailPost);
const postHtml = thumbnailPost && fs.existsSync(path.join(out, thumbnailPost.output)) ? read(thumbnailPost.output) : '';
check('post has BlogPosting data', /"@type":\s*"BlogPosting"/.test(postHtml) && postHtml.includes('"datePublished": "' + thumbnailPost?.date + '"'));
check('post links back to the blog', postHtml.includes('href="/blog/"'));
const thumbnailHtml = read('youtube-thumbnail-downloader/index.html');
check('thumbnail page discloses permission and affiliation limits', thumbnailHtml.includes('Use only for videos you own or have permission to download.') && thumbnailHtml.includes('not affiliated with YouTube or Google') && !thumbnailHtml.includes('Download any YouTube thumbnail'));
check('thumbnail size labels are accurate', thumbnailHtml.includes('>SD<small>640×480</small>') && !thumbnailHtml.includes('>HD<small>640×480</small>'));
check('thumbnail guide discloses affiliation limits', postHtml.includes('ReelFlow is not affiliated with YouTube or Google.'));

/* Tool guides */
const relatedData = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/relatedTools.json'), 'utf8'));
const toolUrls = new Set(tools.map((tool) => tool.url));
const unpublishedRelatedGuides = Object.keys(relatedData).filter((slug) => !publishedBySlug.has(slug));
check('every related-tool list belongs to a published guide', unpublishedRelatedGuides.length === 0, unpublishedRelatedGuides.join(', '));

for (const tool of tools) {
  const primaryGuides = Object.entries(relatedData)
    .filter(([, items]) => Array.isArray(items) && items[0] && items[0].href === tool.url)
    .map(([slug]) => slug);
  check('tool "' + tool.slug + '": exactly one dedicated guide', primaryGuides.length === 1, primaryGuides.join(', '));
  check('tool "' + tool.slug + '": dedicated guide is published', primaryGuides.length === 1 && publishedBySlug.has(primaryGuides[0]), primaryGuides.join(', '));
}

const guides = publishedPosts.map((post) => ({
  ...post,
  post: post.output,
  tool: (relatedData[post.slug] || [])[0]?.href || ''
}));

for (const guide of guides) {
  if (!fs.existsSync(path.join(out, guide.post))) {
    check(guide.slug + ': built guide exists', false, guide.post);
    continue;
  }
  const html = read(guide.post);
  const src = guide.source;
  const related = Array.isArray(relatedData[guide.slug]) ? relatedData[guide.slug] : [];
  const primaryTool = tools.find((tool) => tool.url === guide.tool);
  check(guide.slug + ': primary tool exists', toolUrls.has(guide.tool), guide.tool);
  check(guide.slug + ': source links its tool', !!guide.tool && src.includes('](' + guide.tool + ')'));
  check(guide.slug + ': links its tool', !!guide.tool && html.includes('href="' + guide.tool + '"'));
  check(guide.slug + ': listed on the blog index', blogHtml.includes('href="' + guide.url + '"'));
  check(guide.slug + ': listed in the feed', feed.includes(site.url + guide.url));
  check(guide.slug + ': has BlogPosting data', /"@type":\s*"BlogPosting"/.test(html) && html.includes('"datePublished": "' + guide.date + '"'));
  check(guide.slug + ': links back to the blog', html.includes('href="/blog/"'));
  check(guide.slug + ': 10 related tools', related.length === 10, String(related.length));
  check(guide.slug + ': related destinations are unique', new Set(related.map((item) => item.href)).size === related.length);
  check(guide.slug + ': related #1 is internal', !!related[0] && !related[0].external);
  const external = related.filter((item) => item.external).length;
  check(guide.slug + ': related list has three external picks', external === 3, String(external));
  const invalidInternal = related.filter((item) => !item.external && !toolUrls.has(item.href));
  check(guide.slug + ': internal related tools exist', invalidInternal.length === 0, invalidInternal.map((item) => item.href).join(', '));
  const relItems = (html.match(/class="rel-item(?: rel-top)?"/g) || []).length;
  check(guide.slug + ': related list rendered', relItems === 10, String(relItems));
  const relatedHtml = (html.match(/<section class="rel-tools"[\s\S]*?<\/section>/) || [''])[0];
  check(guide.slug + ': external links are nofollow', (relatedHtml.match(/rel="nofollow noopener" target="_blank"/g) || []).length === external);
  check(guide.slug + ': takeaways box present', /class="takeaways"/.test(html) && html.includes('Key takeaways'));
  const takeawayBox = (html.match(/class="takeaways"[\s\S]*?<\/section>/) || [''])[0];
  const takeawayItems = (takeawayBox.match(/<li>/g) || []).length;
  const takeawayData = Array.isArray(guide.data.takeaways) ? guide.data.takeaways : [];
  check(guide.slug + ': takeaways are plain text', takeawayItems >= 3 && takeawayItems === takeawayData.length && takeawayData.every((item) => typeof item === 'string') && !html.includes('[object Object]'), String(takeawayItems));
  const faqData = Array.isArray(guide.data.faq) ? guide.data.faq : [];
  check(guide.slug + ': FAQ has four or more questions', faqData.length >= 4, String(faqData.length));
  check(guide.slug + ': FAQ present and in JSON-LD', /class="post-faq"/.test(html) && /"@type": "FAQPage"/.test(html));
  const cover = typeof guide.data.cover === 'string' ? guide.data.cover : '';
  check(guide.slug + ': hero image built', !!cover && fs.existsSync(path.join(out, cover.replace(/^\//, ''))));
  const coverAlt = typeof guide.data.coverAlt === 'string' ? guide.data.coverAlt : '';
  const coverCaption = typeof guide.data.coverCaption === 'string' ? guide.data.coverCaption : '';
  check(guide.slug + ': hero has useful alt text and caption', coverAlt.trim().length > 15 && coverCaption.trim().length > 20, coverAlt.length + '/' + coverCaption.length);
  const imgs = [...src.replace(/```[\s\S]*?```/g, ' ').matchAll(/<img src="([^"]+)" alt="([^"]*)"/g)];
  check(guide.slug + ': two inline images with alt text', imgs.length === 2 && imgs.every((m) => m[2].trim().length > 15), String(imgs.length));
  check(guide.slug + ': inline images exist', imgs.every((m) => fs.existsSync(path.join(out, m[1].replace(/^\//, '')))));
  const anchors = [...html.matchAll(/<li><a href="#([^"]+)">/g)].map((m) => m[1]);
  check(guide.slug + ': TOC anchors resolve', anchors.length >= 4 && anchors.every((id) => html.includes('id="' + id + '"')), String(anchors.length));

  if (primaryTool?.slug === guide.slug) {
    const inheritedFields = ['layout', 'tags', 'author', 'sitemap', 'permalink'].filter((field) => field in guide.data);
    check(guide.slug + ': new guide is published and keeps inherited defaults', inheritedFields.length === 0 && guide.data.draft !== true, inheritedFields.join(', '));
    check(guide.slug + ': new guide has five takeaways', takeawayData.length === 5, String(takeawayData.length));
    check(guide.slug + ': new guide has four FAQs', faqData.length === 4, String(faqData.length));
    const description = typeof guide.data.description === 'string' ? guide.data.description : '';
    check(guide.slug + ': new guide description fits the CMS', description.length > 40 && description.length <= 200, String(description.length));
    const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
    const wordCount = (body.replace(/<[^>]+>/g, ' ').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
    check(guide.slug + ': new guide has 1000-1300 words', wordCount >= 1000 && wordCount <= 1300, String(wordCount));
    const h2Count = (body.replace(/```[\s\S]*?```/g, ' ').match(/^##\s+/gm) || []).length;
    check(guide.slug + ': new guide has 8-10 sections', h2Count >= 8 && h2Count <= 10, String(h2Count));
    check(guide.slug + ': new guide leaves the H1 to the layout', !/^#\s+/m.test(body.replace(/```[\s\S]*?```/g, ' ')));
    const imageSources = imgs.map((match) => match[1]);
    check(guide.slug + ': new guide uses its generated artwork',
      cover === 'assets/img/blog/' + guide.slug + '/hero.svg' &&
      imageSources.length === 2 &&
      imageSources.includes('/assets/img/blog/' + guide.slug + '/workflow.svg') &&
      imageSources.includes('/assets/img/blog/' + guide.slug + '/example.svg'));
  }
}

/* Tools data */
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
check('ad tag never appears as static markup', !adTag || builtPages.every((p) => !adTag.test(read(p.file))));
check('ads file has loader script', fs.existsSync(path.join(out, 'assets/js/ads.js')));
check('ads loader is on every page', builtPages.every((p) => read(p.file).includes('/assets/js/ads.js')));
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
check('privacy page discloses Adsterra with its policy link', privacyHtml.includes('Adsterra') && privacyHtml.includes('https://adsterra.com/privacy-policy-managed/'));
check('consent reset is wired in app.js', read('assets/js/app.js').includes('[data-consent-reset]'));
check('footer links the privacy page', builtPages.every((p) => /<div class="footer-links">[\s\S]*?href="\/privacy\/"/.test(read(p.file))));
check('footer labels the Adsterra smart link as an ad partner', builtPages.every((p) => read(p.file).includes('Visit our ad partner (ad)') && read(p.file).includes('asiafilm.org/4/') && /rel="sponsored noopener noreferrer"/.test(read(p.file))));
const toolPageFiles = (toolsData.tools || []).map((tool) => tool.url.replace(/^\//, '') + 'index.html');
check('tool pages disclose third-party advertising in the support note', toolPageFiles.every((f) => read(f).includes('id="supportNote"') && read(f).includes('third-party advertising') && read(f).includes('asiafilm.org/4/')));
const postPageFiles = builtPages.filter((p) => p.file.startsWith('blog/') && p.file !== 'blog/index.html');
check('blog posts disclose third-party advertising in the support line', postPageFiles.every((p) => read(p.file).includes('class="post-support"') && read(p.file).includes('third-party advertising') && read(p.file).includes('asiafilm.org/4/')));
check('support note waits for a download or copy result', read('assets/js/utils.js').includes("CustomEvent('ct:result')") && read('assets/js/app.js').includes("'ct:result'"));

/* Stale homepage rendering */
check('homepage has server-rendered cards', (read('index.html').match(/class="tool-card/g) || []).length === tools.length, String(tools.length));
const homeHtml = read('index.html');
check('home cards carry their tone class', (toolsData.tools || []).every((t) => (t.tone ? homeHtml.includes('tool-card tone-' + t.tone + '"') : homeHtml.includes('class="tool-card" href="' + t.url + '"'))));
check('no leftover client card renderer', !read('assets/js/app.js').includes('toolGrid'));

console.log('\n' + (failures.length ? failures.length + ' FAILED of ' + checks : 'ALL ' + checks + ' CHECKS PASSED'));
process.exit(failures.length ? 1 : 0);
