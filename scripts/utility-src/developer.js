import {
  operations, $, $$, clamp, randomInt, pick, escapeHtml, shuffle, hexToRgb, rgbToHex,
  rgbToHsl, rgbToOklch, parseColor, formatColor, textResult, htmlResult, canvasResult,
  blobResult, readText, canvasBlob
} from './core.js';

const vendor = () => window.CT_VENDOR || {};

operations['timestamp-converter'] = (v) => {
  const raw = String(v.value || '').trim();
  if (!raw) throw new Error('Enter a timestamp or date.');
  let date;
  if (v.mode === 'seconds' || v.mode === 'milliseconds' || v.mode === 'auto' && /^\d{10,13}$/.test(raw)) {
    const number = Number(raw);
    date = new Date(v.mode === 'milliseconds' || raw.length >= 13 ? number : number * 1000);
  } else {
    date = new Date(raw);
  }
  if (Number.isNaN(date.getTime())) throw new Error('That timestamp or date is not valid.');
  const text = [
    `Local: ${date.toLocaleString()}`,
    `ISO 8601: ${date.toISOString()}`,
    `UTC: ${date.toUTCString()}`,
    `Unix seconds: ${Math.floor(date.getTime() / 1000)}`,
    `Unix milliseconds: ${date.getTime()}`,
    `Relative: ${relativeTime(date)}`
  ].join('\n');
  return textResult(text);
};

function relativeTime(date) {
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const units = [[31536000000, 'year'], [2592000000, 'month'], [86400000, 'day'], [3600000, 'hour'], [60000, 'minute']];
  for (const [ms, name] of units) if (abs >= ms) { const value = Math.round(abs / ms); return diff > 0 ? `in ${value} ${name}${value === 1 ? '' : 's'}` : `${value} ${name}${value === 1 ? '' : 's'} ago`; }
  return diff > 0 ? 'in a few seconds' : 'a few seconds ago';
}

operations['sql-formatter'] = (v) => {
  if (!v.sql.trim()) throw new Error('Paste a SQL query first.');
  const formatted = vendor().sqlFormat ? vendor().sqlFormat(v.sql, { language: v.dialect, tabWidth: 2, keywordCase: 'upper' }) : v.sql;
  return textResult(formatted, { status: 'Formatted' });
};

operations['yaml-json-converter'] = (v) => {
  if (!v.input.trim()) throw new Error('Paste YAML or JSON first.');
  const yaml = vendor().yaml;
  if (!yaml) throw new Error('The YAML engine is unavailable.');
  if (v.mode === 'yaml-to-json') return textResult(JSON.stringify(yaml.load(v.input, { schema: yaml.JSON_SCHEMA }), null, 2));
  const value = JSON.parse(v.input);
  return textResult(yaml.dump(value, { noRefs: true, lineWidth: 100 }));
};

operations['diff-compare'] = (v) => {
  const a = v.original.replace(/\r/g, '').split('\n');
  const b = v.changed.replace(/\r/g, '').split('\n');
  if (a.length * b.length > 250000) throw new Error('The text is too large for a line-by-line comparison.');
  const dp = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0, j = 0, added = 0, removed = 0;
  const lines = [];
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { lines.push('  ' + a[i]); i++; j++; }
    else if (j < b.length && (i >= a.length || dp[i][j + 1] >= dp[i + 1][j])) { lines.push('+ ' + b[j]); added++; j++; }
    else { lines.push('- ' + a[i]); removed++; i++; }
  }
  return textResult(`+${added} added  -${removed} removed\n\n` + lines.join('\n'));
};

function xmlEscape(value, attribute = false) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, attribute ? '&quot;' : '"');
}

function formatXml(xml, minify) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('The XML is not valid.');
  const serialize = (node, depth) => {
    const pad = minify ? '' : '  '.repeat(depth);
    if (node.nodeType === Node.TEXT_NODE) return minify ? xmlEscape(node.textContent) : pad + xmlEscape(node.textContent.trim());
    if (node.nodeType === Node.CDATA_SECTION_NODE) return `${pad}<![CDATA[${node.textContent}]]>`;
    if (node.nodeType === Node.COMMENT_NODE) return `${pad}<!--${node.textContent}-->`;
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const attrs = Array.from(node.attributes).map((a) => ` ${a.name}="${xmlEscape(a.value, true)}"`).join('');
    const children = Array.from(node.childNodes).filter((child) => !(child.nodeType === Node.TEXT_NODE && !child.textContent.trim()));
    if (!children.length) return `${pad}<${node.tagName}${attrs} />`;
    const inlineChildren = () => children.map((child) => serialize(child, 0)).join('');
    if (children.every((child) => child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE)) {
      return `${pad}<${node.tagName}${attrs}>${inlineChildren()}</${node.tagName}>`;
    }
    if (minify || children.some((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
      return `${pad}<${node.tagName}${attrs}>${inlineChildren()}</${node.tagName}>`;
    }
    return `${pad}<${node.tagName}${attrs}>\n${children.map((child) => serialize(child, depth + 1)).join('\n')}\n${pad}</${node.tagName}>`;
  };
  return serialize(doc.documentElement, 0);
}

operations['xml-beautifier'] = (v) => {
  if (!v.xml.trim()) throw new Error('Paste XML first.');
  return textResult(formatXml(v.xml, v.mode === 'minify'));
};

operations['keyboard-shortcut-image'] = async (v) => {
  const aliases = v.platform === 'mac'
    ? { ctrl: '⌘', cmd: '⌘', command: '⌘', alt: '⌥', option: '⌥', shift: '⇧', win: '⌘' }
    : { cmd: 'Ctrl', command: 'Ctrl', option: 'Alt', win: 'Win' };
  const keys = v.keys.split(/\s*\+\s*/).filter(Boolean).map((key) => aliases[key.toLowerCase()] || key);
  const width = Math.max(720, keys.length * 150 + 80);
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = 300;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = v.theme === 'dark' ? '#0b1220' : '#f8fafc'; ctx.fillRect(0, 0, width, heightSafe(canvas));
  const gap = 14, keyWidth = Math.min(150, (width - 80 - gap * (keys.length - 1)) / keys.length);
  let x = (width - (keys.length * keyWidth + gap * (keys.length - 1))) / 2;
  for (const key of keys) {
    ctx.fillStyle = v.theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.strokeStyle = v.theme === 'dark' ? '#475569' : '#cbd5e1'; ctx.lineWidth = 2;
    roundRect(ctx, x, 110, keyWidth, 82, 12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = v.theme === 'dark' ? '#f8fafc' : '#0f172a';
    ctx.font = '700 23px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(key.length > 8 ? key.slice(0, 7) + '…' : key, x + keyWidth / 2, 152);
    x += keyWidth + gap;
  }
  return canvasResult(canvas, { status: 'Image ready' });
};

function heightSafe(canvas) { return canvas.height; }
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

operations['url-encoder-decoder'] = (v) => {
  if (!v.value) throw new Error('Enter some text first.');
  return textResult(v.mode === 'encode' ? encodeURIComponent(v.value) : decodeURIComponent(v.value));
};

operations['prompt-to-url'] = (v) => {
  if (!v.prompt.trim()) throw new Error('Write a prompt first.');
  const bases = {
    chatgpt: 'https://chatgpt.com/?q=',
    claude: 'https://claude.ai/new?q=',
    perplexity: 'https://www.perplexity.ai/search?q=',
    gemini: 'https://gemini.google.com/app?q='
  };
  return textResult(bases[v.service] + encodeURIComponent(v.prompt));
};

operations['svg-blob-generator'] = (v) => {
  const points = [];
  const count = v.points;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const radius = 0.34 + Math.random() * (v.randomness / 100);
    points.push([50 + Math.cos(angle) * radius * 100, 50 + Math.sin(angle) * radius * 100]);
  }
  const path = smoothPath(points);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${v.width}" height="${v.height}" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><path d="${path}" fill="${v.gradient ? 'url(#g)' : '#6366f1'}"/></svg>`;
  const html = `<div class="utility-list"><div class="utility-preview">${svg.replace('<svg ', '<svg style="max-width:360px;width:100%;height:auto" ')}</div><pre class="utility-code">${escapeHtml(svg)}</pre></div>`;
  return { html, copyText: svg, blob: new Blob([svg], { type: 'image/svg+xml' }), filename: 'blob.svg' };
};

function smoothPath(points) {
  const n = points.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[n - 1], points[0]);
  let d = `M ${start[0]} ${start[1]}`;
  for (let i = 0; i < n; i++) {
    const current = points[i], next = points[(i + 1) % n];
    const end = mid(current, next);
    d += ` Q ${current[0]} ${current[1]} ${end[0]} ${end[1]}`;
  }
  return d + ' Z';
}

operations['json-csv-converter'] = (v) => {
  if (!v.input.trim()) throw new Error('Paste JSON or CSV first.');
  if (v.mode === 'json-to-csv') {
    const data = JSON.parse(v.input);
    if (!Array.isArray(data) || !data.length) throw new Error('JSON must be a non-empty array of objects.');
    const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));
    const quote = (value) => {
      const s = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
      return /[",\r\n]/.test(s) || s.includes(v.delimiter) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    return textResult([headers.map(quote).join(v.delimiter), ...data.map((row) => headers.map((h) => quote(row[h])).join(v.delimiter))].join('\n'));
  }
  const rows = parseCsv(v.input, v.delimiter);
  if (rows.length < 2) throw new Error('CSV needs a header row and at least one data row.');
  const headers = rows[0];
  const data = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, i) => [header, row[i] ?? ''])));
  return textResult(JSON.stringify(data, null, 2));
};

function parseCsv(input, delimiter) {
  const rows = []; let row = [], value = '', quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { value += '"'; i++; }
      else if (char === '"') quoted = false;
      else value += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) { row.push(value); value = ''; }
    else if (char === '\n') { row.push(value); rows.push(row); row = []; value = ''; }
    else if (char !== '\r') value += char;
  }
  row.push(value); rows.push(row);
  return rows.filter((r) => r.some((cell) => cell !== ''));
}

operations['css-minifier'] = (v) => {
  if (!v.css.trim()) throw new Error('Paste CSS first.');
  const output = v.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
  return textResult(output, { status: 'Minified' });
};

operations['keycode-info'] = (v) => {
  const parts = String(v.key || '').split('+').map((part) => part.trim()).filter(Boolean);
  const key = parts.pop() || '';
  if (!key) throw new Error('Press a key or enter a key name.');
  const modifierAliases = { ctrl: 'Ctrl', control: 'Ctrl', shift: 'Shift', alt: 'Alt', option: 'Alt', meta: 'Meta', cmd: 'Meta', command: 'Meta' };
  const modifiers = parts.map((part) => modifierAliases[part.toLowerCase()] || part);
  const aliases = { ' ': 'Space', spacebar: 'Space', control: 'Control', esc: 'Escape', return: 'Enter', arrowup: 'ArrowUp', arrowdown: 'ArrowDown', arrowleft: 'ArrowLeft', arrowright: 'ArrowRight' };
  const normalized = aliases[key.toLowerCase()] || key.length === 1 ? (aliases[key.toLowerCase()] || key) : key;
  const keyCodes = { Enter: 13, Escape: 27, Space: 32, Tab: 9, Backspace: 8, Delete: 46, ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39, Shift: 16, Control: 17, Alt: 18, Meta: 91 };
  const codes = { Enter: 'Enter', Escape: 'Escape', Space: 'Space', Tab: 'Tab', Backspace: 'Backspace', Delete: 'Delete', ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', Shift: 'ShiftLeft', Control: 'ControlLeft', Alt: 'AltLeft', Meta: 'MetaLeft' };
  const keyCode = keyCodes[normalized] || (normalized.length === 1 ? normalized.toUpperCase().charCodeAt(0) : 0);
  const code = codes[normalized] || (normalized.length === 1 ? 'Key' + normalized.toUpperCase() : 'Unknown');
  const shifted = modifiers.some((modifier) => modifier.toLowerCase() === 'shift');
  const displayKey = normalized.length === 1 && shifted ? normalized.toUpperCase() : normalized;
  return textResult(`key: ${JSON.stringify(displayKey)}\nmodifiers: ${modifiers.length ? modifiers.join(', ') : 'none'}\ncode: ${code}\nkeyCode (legacy): ${keyCode || 'not available'}\nwhich (legacy): ${keyCode || 'not available'}\nlength: ${normalized.length}`);
};

function parseOklch(value) {
  const match = String(value || '').trim().match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)(?:deg)?\s*\)$/i);
  if (!match) return null;
  let lightness = Number(match[1]);
  let chroma = Number(match[3]);
  const hue = Number(match[5]);
  if (match[2]) lightness /= 100;
  if (match[4]) chroma /= 100;
  const radians = hue * Math.PI / 180;
  const a = chroma * Math.cos(radians), b = chroma * Math.sin(radians);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  const channel = (v) => Math.round(clamp(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055), 0, 255));
  return { r: channel(linear[0]), g: channel(linear[1]), b: channel(linear[2]) };
}

operations['oklch-color-converter'] = (v) => {
  const rgb = parseOklch(v.color) || parseColor(v.color);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b), oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const lines = [
    `HEX: ${hex}`,
    `RGB: rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`,
    `HSL: hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
    `OKLCH: oklch(${(oklch.l * 100).toFixed(2)}% ${oklch.c.toFixed(4)} ${oklch.h.toFixed(2)})`
  ];
  const html = `<div class="utility-list"><div class="utility-swatch" style="background:${hex}"></div><pre class="utility-code">${escapeHtml(lines.join('\n'))}</pre></div>`;
  const selected = v.format === 'all' ? lines.join('\n') : lines.find((line) => line.startsWith(v.format.toUpperCase() + ':')) || lines.join('\n');
  return { html, text: selected, copyText: lines.join('\n') };
};

operations['cron-explainer'] = (v) => {
  const expression = v.expression.trim();
  if (!expression) throw new Error('Enter a cron expression.');
  const parts = expression.split(/\s+/);
  if (parts.length !== 5) throw new Error('Use five cron fields: minute hour day month weekday.');
  const explanation = explainCron(parts);
  const Parser = vendor().CronExpressionParser;
  if (!Parser) throw new Error('The cron engine is unavailable.');
  const interval = Parser.parse(expression, { currentDate: new Date() });
  const next = Array.from({ length: v.runs }, () => interval.next().toISOString()).join('\n');
  return textResult(`${explanation}\n\nNext ${v.runs} run${v.runs === 1 ? '' : 's'} (UTC):\n${next}`);
};

function explainCron(parts) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const units = ['minute', 'hour', 'day of the month', 'month', 'day of the week'];
  const every = ['every minute', 'every hour', 'every day of the month', 'every month', 'every day of the week'];
  const describe = (part, index) => {
    if (part === '*') return every[index];
    if (part.includes(',')) return part.split(',').map((item) => describe(item, index)).join(', ');
    const stepMatch = part.match(/^(.+)\/(\d+)$/);
    const step = stepMatch ? Number(stepMatch[2]) : 1;
    const base = stepMatch ? stepMatch[1] : part;
    const stepText = step > 1 ? `every ${step} ${units[index]}s` : '';
    if (base === '*') return stepText || every[index];
    if (base.includes('-')) {
      const [start, end] = base.split('-').map(Number);
      if (index === 4 && Number.isInteger(start) && Number.isInteger(end)) return `${weekdays[start] || start} through ${weekdays[end] || end}${stepText ? `, ${stepText}` : ''}`;
      return `${start} through ${end}${stepText ? `, ${stepText}` : ''}`;
    }
    const number = Number(base);
    if (index === 3 && months[number - 1]) return `in ${months[number - 1]}${stepText ? `, ${stepText}` : ''}`;
    if (index === 4 && weekdays[number]) return `on ${weekdays[number]}${stepText ? `, ${stepText}` : ''}`;
    return `at ${base} ${units[index]}${step > 1 ? ` (${stepText})` : ''}`;
  };
  return parts.map((part, index) => `${['Minute', 'Hour', 'Day of month', 'Month', 'Day of week'][index]}: ${describe(part, index)}`).join('; ');
}

operations['html-to-jsx'] = (v) => {
  if (!v.html.trim()) throw new Error('Paste HTML first.');
  let output = v.html
    .replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')
    .replace(/\sclass=/g, ' className=')
    .replace(/\sfor=/g, ' htmlFor=')
    .replace(/\stabindex=/g, ' tabIndex=')
    .replace(/\sonclick="([^"]*)"/g, ' onClick={() => {$1}}')
    .replace(/\sonchange="([^"]*)"/g, ' onChange={() => {$1}}')
    .replace(/\sreadonly/g, ' readOnly')
    .replace(/\sstyle="([^"]*)"/g, (_, style) => ' style={{ ' + style.split(';').filter(Boolean).map((decl) => {
      const colon = decl.indexOf(':');
      const property = decl.slice(0, colon).trim();
      const value = decl.slice(colon + 1).trim();
      const jsProperty = property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const unitless = ['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order', 'zoom'];
      return `${jsProperty}: ${unitless.includes(jsProperty) && /^-?[\d.]+$/.test(value) ? value : JSON.stringify(value)}`;
    }).join(', ') + ' } }')
    .replace(/<([a-z][a-z0-9]*)([^>]*?)\s*\/>/g, '<$1$2 />');
  return textResult(output, { status: 'Converted' });
};

operations['css-unit-converter'] = (v) => {
  const units = { px: 1, rem: 16, em: 16, pt: 96 / 72, pc: 16, cm: 96 / 2.54, mm: 96 / 25.4, in: 96 };
  if (!units[v.from] || !units[v.to]) throw new Error('Choose valid units.');
  const px = v.value * units[v.from] * (v.from === 'rem' || v.from === 'em' ? v.rootSize / 16 : 1);
  const result = px / units[v.to] / (v.to === 'rem' || v.to === 'em' ? v.rootSize / 16 : 1);
  return textResult(`${Number(result.toFixed(6))}${v.to}`, { status: 'Converted' });
};

operations['token-generator'] = async (v) => {
  const tokens = [];
  for (let i = 0; i < v.count; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(v.bytes));
    if (v.format === 'hex') tokens.push(Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(''));
    else {
      let binary = ''; bytes.forEach((b) => binary += String.fromCharCode(b));
      const encoded = btoa(binary);
      tokens.push(v.format === 'base64url' ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '') : encoded);
    }
  }
  return textResult(tokens.join('\n'));
};

const toBase64 = (bytes) => { let binary = ''; bytes.forEach((b) => binary += String.fromCharCode(b)); return btoa(binary); };
const fromBase64 = (value) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

operations['encrypt-decrypt'] = async (v) => {
  if (!v.password) throw new Error('Enter a password.');
  if (!v.text.trim()) throw new Error('Enter text to process.');
  const encoder = new TextEncoder(), decoder = new TextDecoder();
  if (v.mode === 'encrypt') {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(v.password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(v.text));
    return textResult(['v1', toBase64(salt), toBase64(iv), toBase64(new Uint8Array(cipher))].join('.'));
  }
  const [version, salt64, iv64, data64] = v.text.trim().split('.');
  if (version !== 'v1' || !salt64 || !iv64 || !data64) throw new Error('This encrypted value is not valid.');
  const salt = fromBase64(salt64), iv = fromBase64(iv64), data = fromBase64(data64);
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(v.password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return textResult(decoder.decode(plain));
};

operations['phone-parser'] = (v) => {
  if (!v.phone.trim()) throw new Error('Enter a phone number.');
  const parse = vendor().parsePhoneNumberFromString;
  if (!parse) throw new Error('The phone parser is unavailable.');
  const phone = parse(v.phone, v.country);
  if (!phone) throw new Error('This phone number is not valid.');
  return textResult([
    `International: ${phone.formatInternational()}`,
    `National: ${phone.formatNational()}`,
    `E.164: ${phone.number}`,
    `Country: ${phone.country || v.country || 'unknown'}`,
    `Type: ${phone.getType() || 'unknown'}`
  ].join('\n'));
};

operations['mac-address-generator'] = (v) => {
  const output = [];
  for (let i = 0; i < v.count; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    bytes[0] = (bytes[0] | 2) & 0xfe;
    let address = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
    if (v.case === 'upper') address = address.map((part) => part.toUpperCase());
    output.push(address.join(v.separator));
  }
  return textResult(output.join('\n'));
};
