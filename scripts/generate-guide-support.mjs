import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const tools = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/tools.json'), 'utf8')).tools;
const utilities = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/utilityTools.json'), 'utf8'));
const relatedPath = path.join(root, 'src/_data/relatedTools.json');
const related = JSON.parse(fs.readFileSync(relatedPath, 'utf8'));
const existingPrimary = new Set(Object.values(related).map((items) => items[0]?.href).filter(Boolean));
const missing = tools.filter((tool) => !existingPrimary.has(tool.url));
const forceAssets = process.argv.includes('--force-assets');
const assetTools = forceAssets ? tools.filter((tool) => Array.isArray(related[tool.slug])) : missing;

const palettes = {
  Tailwind: ['#0f172a', '#155e75', '#22d3ee', '#a78bfa'],
  Developer: ['#0f172a', '#1e3a8a', '#60a5fa', '#34d399'],
  Image: ['#111827', '#4c1d95', '#c084fc', '#fb7185'],
  Mail: ['#0f172a', '#164e63', '#22d3ee', '#fbbf24'],
  Text: ['#111827', '#3730a3', '#818cf8', '#f0abfc'],
  'Video & Audio': ['#0f172a', '#7f1d1d', '#fb7185', '#f59e0b'],
  Converters: ['#111827', '#065f46', '#34d399', '#fbbf24'],
  Misc: ['#0f172a', '#92400e', '#fbbf24', '#fb7185']
};

const externals = {
  Tailwind: [
    { name: 'Tailwind CSS gradient documentation', href: 'https://tailwindcss.com/docs/gradient-color', note: 'Official gradient utilities and syntax reference.' },
    { name: 'Tailwind CSS box shadow documentation', href: 'https://tailwindcss.com/docs/box-shadow', note: 'Official shadow utility reference.' },
    { name: 'Tailwind CSS grid documentation', href: 'https://tailwindcss.com/docs/grid-template-columns', note: 'Official grid template reference.' }
  ],
  Developer: [
    { name: 'MDN Web JavaScript reference', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', note: 'Browser APIs and JavaScript language reference.' },
    { name: 'JSON Schema specification', href: 'https://json-schema.org/', note: 'Formal schema vocabulary and validation guidance.' },
    { name: 'RFC 3339 date and time standard', href: 'https://www.rfc-editor.org/rfc/rfc3339', note: 'Canonical internet date and time format.' }
  ],
  Image: [
    { name: 'MDN Canvas API reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API', note: 'Browser image drawing and pixel-processing reference.' },
    { name: 'W3C PNG specification', href: 'https://www.w3.org/TR/png-3/', note: 'Formal PNG format specification.' },
    { name: 'Google WebP documentation', href: 'https://developers.google.com/speed/webp', note: 'WebP format and browser support guidance.' }
  ],
  Mail: [
    { name: 'RFC 5322 message format', href: 'https://www.rfc-editor.org/rfc/rfc5322', note: 'Formal email message syntax reference.' },
    { name: 'MDN mailto URL reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/mailto', note: 'Browser mailto URL behavior and parameters.' },
    { name: 'MDN FileReader API reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/FileReader', note: 'Local file-reading API used by browser tools.' }
  ],
  Text: [
    { name: 'MDN Encoding API reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API', note: 'UTF-8 and text encoding reference.' },
    { name: 'Unicode standard', href: 'https://www.unicode.org/standard/standard.html', note: 'Character encoding and Unicode reference.' },
    { name: 'Markdown Guide', href: 'https://www.markdownguide.org/', note: 'Markdown syntax and formatting reference.' }
  ],
  'Video & Audio': [
    { name: 'MDN MediaRecorder API reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder', note: 'Browser media recording reference.' },
    { name: 'MDN Web Audio API reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API', note: 'Browser audio processing reference.' },
    { name: 'W3C Media Source Extensions', href: 'https://www.w3.org/TR/media-source/', note: 'Media playback and streaming reference.' }
  ],
  Converters: [
    { name: 'PDF reference architecture', href: 'https://www.adobe.com/devnet/acrobat/pdfs/pdf_reference_archives/PDFReference.pdf', note: 'Formal PDF format reference.' },
    { name: 'MDN FileReader API reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/FileReader', note: 'Local browser file-reading reference.' },
    { name: 'RFC 4180 CSV format', href: 'https://www.rfc-editor.org/rfc/rfc4180', note: 'Common CSV interchange format reference.' }
  ],
  Misc: [
    { name: 'RFC 5545 calendar format', href: 'https://www.rfc-editor.org/rfc/rfc5545', note: 'iCalendar data format reference.' },
    { name: 'MDN localStorage reference', href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage', note: 'Browser local-storage behavior reference.' },
    { name: 'WAI-ARIA Authoring Practices', href: 'https://www.w3.org/WAI/ARIA/apg/', note: 'Accessible interaction-pattern guidance.' }
  ]
};

const escapeXml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const wrap = (value, maxChars, maxLines = 3) => {
  const words = String(value ?? '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (!line) line = word;
    else if ((line + ' ' + word).length <= maxChars) line += ' ' + word;
    else {
      lines.push(line);
      line = word;
    }
    if (lines.length === maxLines - 1 && line.length > maxChars) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  const consumed = lines.join(' ').length;
  if (consumed < words.join(' ').length && lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:]?$/, '') + '…';
  return lines;
};

const textLines = (value, x, y, maxChars, maxLines, size, fill, anchor = 'start') => wrap(value, maxChars, maxLines)
  .map((line, index) => `<text x="${x}" y="${y + index * (size + 10)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${escapeXml(line)}</text>`)
  .join('');

const coverSvg = (tool, category) => {
  const [dark, mid, bright, accent] = palettes[category] || palettes.Misc;
  const titleSize = tool.name.length > 34 ? 54 : tool.name.length > 24 ? 64 : 74;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(tool.name)} guide</title>
  <desc id="desc">ReelFlow Toolkit guide cover for ${escapeXml(tool.name)}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${bright}"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".8"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#bg)"/>
  <circle cx="1040" cy="120" r="250" fill="url(#glow)"/>
  <circle cx="160" cy="590" r="230" fill="url(#glow)" opacity=".55"/>
  <path d="M850 80 L1120 350 L850 620 L580 350 Z" fill="none" stroke="#ffffff" stroke-opacity=".14" stroke-width="2"/>
  <path d="M920 80 L1120 280 L920 480 L720 280 Z" fill="#ffffff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".18" stroke-width="2"/>
  <rect x="72" y="64" width="250" height="46" rx="23" fill="#ffffff" fill-opacity=".12" stroke="#ffffff" stroke-opacity=".2"/>
  <text x="197" y="94" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#ffffff" letter-spacing="2">${escapeXml(category.toUpperCase())}</text>
  ${textLines(tool.name, 72, 250, 30, 3, titleSize, '#ffffff')}
  <text x="76" y="520" font-family="Arial, sans-serif" font-size="25" fill="#ffffff" fill-opacity=".78">A practical ReelFlow Toolkit guide</text>
  <text x="76" y="560" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" fill-opacity=".58">Browser workflow · examples · limits · checklist</text>
</svg>`;
};

const workflowSvg = (tool, config, category) => {
  const [dark, mid, bright, accent] = palettes[category] || palettes.Misc;
  const input = config?.inputTitle || 'Your input';
  const output = config?.outputTitle || 'Your result';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(tool.name)} workflow</title>
  <desc id="desc">Input, browser processing and output workflow for ${escapeXml(tool.name)}.</desc>
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/></linearGradient></defs>
  <rect width="1200" height="675" rx="32" fill="url(#bg)"/>
  <text x="70" y="82" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="${bright}" letter-spacing="2">WORKFLOW</text>
  ${textLines(tool.name, 70, 145, 46, 2, 48, '#ffffff')}
  <g font-family="Arial, sans-serif">
    <rect x="70" y="270" width="300" height="190" rx="24" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".18"/>
    <rect x="450" y="270" width="300" height="190" rx="24" fill="${bright}" fill-opacity=".16" stroke="${bright}" stroke-opacity=".7"/>
    <rect x="830" y="270" width="300" height="190" rx="24" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".18"/>
    <text x="105" y="315" font-size="18" font-weight="700" fill="${accent}">01 · INPUT</text>
    ${textLines(input, 105, 365, 18, 3, 28, '#ffffff')}
    <text x="485" y="315" font-size="18" font-weight="700" fill="${accent}">02 · PROCESS</text>
    ${textLines('Local browser processing', 485, 365, 18, 3, 28, '#ffffff')}
    <text x="865" y="315" font-size="18" font-weight="700" fill="${accent}">03 · OUTPUT</text>
    ${textLines(output, 865, 365, 18, 3, 28, '#ffffff')}
    <path d="M382 365 H438 M420 347 L438 365 L420 383" fill="none" stroke="${bright}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M762 365 H818 M800 347 L818 365 L800 383" fill="none" stroke="${bright}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${textLines((config?.actionLabel || 'Run the tool') + ' · review the result · copy or download when available', 70, 570, 90, 2, 20, '#ffffff').replaceAll('fill="#ffffff"', 'fill="#ffffff" fill-opacity=".68"')}
</svg>`;
};

const exampleSvg = (tool, config, category) => {
  const [dark, mid, bright, accent] = palettes[category] || palettes.Misc;
  const fields = (config?.fields || []).slice(0, 4);
  const chips = fields.map((field, index) => {
    const value = field.value === '' || field.value === undefined ? field.label : field.value;
    const fullLabel = `${field.label}: ${String(value)}`;
    const label = fullLabel.length > 46 ? fullLabel.slice(0, 43).trimEnd() + '…' : fullLabel;
    const x = 70 + (index % 2) * 540;
    const y = 300 + Math.floor(index / 2) * 92;
    return `<g><rect x="${x}" y="${y}" width="500" height="70" rx="18" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".16"/><text x="${x + 22}" y="${y + 43}" font-family="Arial, sans-serif" font-size="21" fill="#ffffff">${escapeXml(label)}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(tool.name)} worked example</title>
  <desc id="desc">Example settings and expected result for ${escapeXml(tool.name)}.</desc>
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/></linearGradient></defs>
  <rect width="1200" height="675" rx="32" fill="url(#bg)"/>
  <text x="70" y="82" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="${bright}" letter-spacing="2">WORKED EXAMPLE</text>
  ${textLines(tool.name, 70, 145, 46, 2, 48, '#ffffff')}
  ${textLines(tool.desc, 70, 235, 82, 2, 24, '#ffffff', 'start').replaceAll('fill="#ffffff"', 'fill="#ffffff" fill-opacity=".72"')}
  ${chips}
  <rect x="70" y="520" width="1060" height="92" rx="22" fill="${bright}" fill-opacity=".14" stroke="${bright}" stroke-opacity=".5"/>
  <text x="96" y="558" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="${accent}">EXPECTED RESULT</text>
  ${textLines(config?.outputTitle || 'Review the generated result', 96, 590, 70, 1, 24, '#ffffff')}
</svg>`;
};

const chooseRelated = (tool, index) => {
  const category = tool.category || 'Misc';
  const same = tools.filter((item) => item.slug !== tool.slug && item.category === category);
  const others = tools.filter((item) => item.slug !== tool.slug && item.category !== category);
  const rotated = [...same.slice(index % Math.max(same.length, 1)), ...same.slice(0, index % Math.max(same.length, 1))];
  const otherRotated = [...others.slice(index % Math.max(others.length, 1)), ...others.slice(0, index % Math.max(others.length, 1))];
  const picks = [];
  for (const item of [...rotated, ...otherRotated]) {
    if (picks.length === 6) break;
    if (!picks.some((pick) => pick.url === item.url)) picks.push(item);
  }
  return [
    { name: tool.name, href: tool.url, note: 'Start here for this guide.' },
    ...picks.map((item) => ({ name: item.name, href: item.url, note: item.desc.length > 105 ? item.desc.slice(0, 102).trimEnd() + '…' : item.desc })),
    ...(externals[category] || externals.Misc).map((item) => ({ ...item, external: true }))
  ];
};

for (const [index, tool] of assetTools.entries()) {
  const slug = tool.slug;
  const category = tool.category || 'Misc';
  const config = utilities[slug];
  const dir = path.join(root, 'src/assets/img/blog', slug);
  fs.mkdirSync(dir, { recursive: true });
  const cleanSvg = (svg) => svg.replace(/[ \t]+$/gm, '');
  fs.writeFileSync(path.join(dir, 'hero.svg'), cleanSvg(coverSvg(tool, category)));
  fs.writeFileSync(path.join(dir, 'workflow.svg'), cleanSvg(workflowSvg(tool, config, category)));
  fs.writeFileSync(path.join(dir, 'example.svg'), cleanSvg(exampleSvg(tool, config, category)));
  if (!related[slug]) related[slug] = chooseRelated(tool, index);
}

fs.writeFileSync(relatedPath, JSON.stringify(related, null, 2) + '\n');
console.log(`${forceAssets ? 'Refreshed' : 'Prepared'} ${assetTools.length} guide asset sets and related-tool lists.`);
console.log(`Related post keys: ${Object.keys(related).length}.`);
