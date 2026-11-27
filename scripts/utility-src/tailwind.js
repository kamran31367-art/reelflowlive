import {
  operations, $, $$, clamp, escapeHtml, hexToRgb, rgbToHsl, hslToRgb, rgbToHex,
  textResult, htmlResult, blobResult
} from './core.js';

const codeBlock = (label, code) => `<div class="utility-list"><div class="utility-item"><b>${escapeHtml(label)}</b><button class="btn btn-ghost utility-copy-inline" type="button" data-copy="${escapeHtml(code)}">Copy</button></div><pre class="utility-code">${escapeHtml(code)}</pre></div>`;
const wireCopy = (preview) => {
  preview?.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', () => window.CT.copy(button.dataset.copy)));
};

operations['tailwind-gradient-generator'] = (v) => {
  const colours = [v.from, v.via, v.to].filter(Boolean);
  const list = v.useVia && v.via ? `${v.from}, ${v.via}, ${v.to}` : `${v.from}, ${v.to}`;
  const angle = Number.parseFloat(v.direction) * Math.PI / 180;
  const radialPosition = `circle at ${(50 + Math.sin(angle) * 45).toFixed(1)}% ${(50 - Math.cos(angle) * 45).toFixed(1)}%`;
  const css = v.type === 'radial'
    ? `background: radial-gradient(${radialPosition}, ${list});`
    : v.type === 'conic'
      ? `background: conic-gradient(from ${v.direction}, ${list});`
      : `background: linear-gradient(${v.direction}, ${list});`;
  const tw = `bg-[${v.type === 'linear' ? `linear-gradient(${v.direction},${list.replace(/\s+/g, '_')})` : v.type === 'radial' ? `radial-gradient(${radialPosition.replace(/\s+/g, '_')},${list.replace(/\s+/g, '_')})` : `conic-gradient(from_${v.direction},${list.replace(/\s+/g, '_')})`}]`;
  const html = `<div class="utility-list"><div class="utility-swatch" style="background:${css.replace('background:', '')}"></div>${codeBlock('Tailwind', tw)}${codeBlock('CSS', css)}</div>`;
  return { html, copyText: tw + '\n' + css, blob: new Blob([css + '\n'], { type: 'text/css' }), filename: 'gradient.css', onMount: wireCopy };
};

operations['tailwind-shadow-generator'] = (v) => {
  const rgba = hexToRgb(v.shadowColor);
  const primary = `${v.inset ? 'inset ' : ''}${v.x}px ${v.y}px ${v.blur}px ${v.spread}px rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${(v.opacity / 100).toFixed(2)})`;
  const ambient = `${v.inset ? 'inset ' : ''}${Math.round(v.x / 2)}px ${Math.round(v.y / 2)}px ${Math.max(0, Math.round(v.blur / 2))}px ${Math.round(v.spread / 2)}px rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${(v.opacity / 200).toFixed(2)})`;
  const shadow = `${primary}, ${ambient}`;
  const tw = `shadow-[${shadow.replace(/\s+/g, '_')}]`;
  const html = `<div class="utility-list"><div class="utility-card-preview" style="background:#fff;box-shadow:${shadow}"><b>Shadow preview</b><p>Adjust the controls to shape the glow.</p></div>${codeBlock('Tailwind', tw)}${codeBlock('CSS', `box-shadow: ${shadow};`)}</div>`;
  return { html, copyText: tw + '\nbox-shadow: ' + shadow + ';', blob: new Blob([`box-shadow: ${shadow};\n`], { type: 'text/css' }), filename: 'shadow.css', onMount: wireCopy };
};

operations['tailwind-grid-generator'] = (v) => {
  const colGap = v.columnGap === '' || v.columnGap == null ? v.gap : v.columnGap;
  const rowGap = v.rowGap === '' || v.rowGap == null ? v.gap : v.rowGap;
  const prefix = v.responsive === 'none' ? '' : v.responsive + ':';
  const tw = `grid ${prefix}grid-cols-${v.columns} ${prefix}grid-rows-${v.rows} gap-x-[${colGap}px] gap-y-[${rowGap}px]`;
  const css = `display: grid;\ngrid-template-columns: repeat(${v.columns}, minmax(0, 1fr));\ngrid-template-rows: repeat(${v.rows}, minmax(0, 1fr));\ncolumn-gap: ${colGap}px;\nrow-gap: ${rowGap}px;`;
  const cells = Array.from({ length: v.columns * v.rows }, (_, i) => `<div class="utility-item" style="display:grid;place-items:center;min-height:58px;background:#eff6ff">${i + 1}</div>`).join('');
  const html = `<div class="utility-list"><div style="display:grid;grid-template-columns:repeat(${v.columns},1fr);grid-template-rows:repeat(${v.rows},58px);column-gap:${colGap}px;row-gap:${rowGap}px">${cells}</div>${codeBlock('Tailwind', tw)}${codeBlock('CSS', css)}</div>`;
  return { html, copyText: tw + '\n' + css, blob: new Blob([css], { type: 'text/css' }), filename: 'grid.css', onMount: wireCopy };
};

operations['tailwind-button-generator'] = (v) => {
  const tw = `px-[${v.paddingX}px] py-[${v.paddingY}px] rounded-[${v.radius}px] bg-[${v.background}] text-[${v.foreground}] font-${v.weight}${v.shadow ? ' shadow-lg' : ''}`;
  const css = `display: inline-flex;\nalign-items: center;\njustify-content: center;\npadding: ${v.paddingY}px ${v.paddingX}px;\nborder-radius: ${v.radius}px;\nbackground: ${v.background};\ncolor: ${v.foreground};\nfont-weight: ${v.weight};${v.shadow ? '\nbox-shadow: 0 10px 15px -3px rgba(15,23,42,.18);' : ''}`;
  const html = `<div class="utility-list" style="place-items:center;padding:28px;background:#f8fafc;border-radius:12px"><button class="utility-button-preview" style="padding:${v.paddingY}px ${v.paddingX}px;border-radius:${v.radius}px;background:${v.background};color:${v.foreground};font-weight:${v.weight};${v.shadow ? 'box-shadow:0 10px 15px -3px rgba(15,23,42,.18)' : ''}">${escapeHtml(v.label)}</button></div>${codeBlock('Tailwind', tw)}${codeBlock('CSS', css)}`;
  return { html, copyText: tw + '\n' + css, blob: new Blob([css], { type: 'text/css' }), filename: 'button.css', onMount: wireCopy };
};

const cssToTw = (css) => {
  const classes = [];
  const rules = [...css.matchAll(/([a-z-]+)\s*:\s*([^;}{]+)\s*;?/gi)].map((m) => [m[1].toLowerCase(), m[2].trim()]);
  for (const [property, value] of rules) {
    if (property === 'display') classes.push({ flex: 'flex', grid: 'grid', block: 'block', 'inline-block': 'inline-block', none: 'hidden' }[value] || `[display:${value}]`);
    else if (property === 'align-items') classes.push({ center: 'items-center', 'flex-start': 'items-start', 'flex-end': 'items-end', stretch: 'items-stretch' }[value] || `[align-items:${value}]`);
    else if (property === 'justify-content') classes.push({ center: 'justify-center', 'space-between': 'justify-between', 'flex-start': 'justify-start', 'flex-end': 'justify-end' }[value] || `[justify-content:${value}]`);
    else if (property === 'gap') classes.push(`gap-[${value}]`);
    else if (property === 'padding') classes.push(`p-[${value}]`);
    else if (property === 'margin') classes.push(`m-[${value}]`);
    else if (property === 'border-radius') classes.push(`rounded-[${value}]`);
    else if (property === 'background' || property === 'background-color') classes.push(`bg-[${value}]`);
    else if (property === 'color') classes.push(`text-[${value}]`);
    else if (property === 'font-size') classes.push(`text-[${value}]`);
    else if (property === 'font-weight') classes.push(`font-[${value}]`);
    else if (property === 'width') classes.push(`w-[${value}]`);
    else if (property === 'height') classes.push(`h-[${value}]`);
    else if (property === 'box-shadow') classes.push(`shadow-[${value.replace(/\s+/g, '_')}]`);
    else classes.push(`[${property}:${value.replace(/\s+/g, '_')}]`);
  }
  return classes.join(' ');
};

operations['css-to-tailwind'] = (v) => {
  if (!v.css.trim()) throw new Error('Paste some CSS first.');
  const converted = cssToTw(v.css);
  return textResult(converted, { status: 'Converted' });
};

const twToCss = (input) => {
  const declarations = [];
  const spacing = { 0: '0px', px: '1px', 0.5: '.125rem', 1: '.25rem', 1.5: '.375rem', 2: '.5rem', 2.5: '.625rem', 3: '.75rem', 3.5: '.875rem', 4: '1rem', 5: '1.25rem', 6: '1.5rem', 7: '1.75rem', 8: '2rem', 9: '2.25rem', 10: '2.5rem', 12: '3rem', 16: '4rem', 20: '5rem', 24: '6rem' };
  const colours = { white: '#ffffff', black: '#000000', transparent: 'transparent', 'slate-900': '#0f172a', 'blue-600': '#2563eb', 'red-500': '#ef4444', 'green-500': '#22c55e', 'gray-500': '#6b7280' };
  const justify = { start: 'flex-start', end: 'flex-end', between: 'space-between', around: 'space-around', evenly: 'space-evenly', center: 'center' };
  const alignItems = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' };
  const radius = { none: '0', sm: '.125rem', DEFAULT: '.25rem', md: '.375rem', lg: '.5rem', xl: '.75rem', '2xl': '1rem', '3xl': '1.5rem', full: '9999px' };
  const fontSize = { xs: '.75rem', sm: '.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' };
  const shadows = { sm: '0 1px 2px rgba(15,23,42,.08)', DEFAULT: '0 1px 3px rgba(15,23,42,.12)', md: '0 4px 6px -1px rgba(15,23,42,.12)', lg: '0 10px 15px -3px rgba(15,23,42,.18)', xl: '0 20px 25px -5px rgba(15,23,42,.18)', '2xl': '0 25px 50px -12px rgba(15,23,42,.25)', none: 'none' };
  const space = (value) => spacing[value] || (/^-?[\d.]+$/.test(value) ? value + 'px' : value);
  for (const token of input.replace(/className=["']|["']/g, '').split(/\s+/).filter(Boolean)) {
    let match;
    if (token === 'flex') declarations.push('display: flex;');
    else if (token === 'inline-flex') declarations.push('display: inline-flex;');
    else if (token === 'grid') declarations.push('display: grid;');
    else if (token === 'block') declarations.push('display: block;');
    else if (token === 'inline-block') declarations.push('display: inline-block;');
    else if (token === 'hidden') declarations.push('display: none;');
    else if (/^flex-(row|col)(-reverse)?$/.test(token)) declarations.push(`flex-direction: ${token === 'flex-row' ? 'row' : token === 'flex-col' ? 'column' : token};`);
    else if (/^flex-(wrap|nowrap|wrap-reverse)$/.test(token)) declarations.push(`flex-wrap: ${token.slice(5)};`);
    else if (token.startsWith('items-')) declarations.push(`align-items: ${alignItems[token.slice(6)] || token.slice(6)};`);
    else if (token.startsWith('justify-')) declarations.push(`justify-content: ${justify[token.slice(8)] || token.slice(8)};`);
    else if ((match = token.match(/^gap-([\w.[\]]+)$/))) declarations.push(`gap: ${match[1].startsWith('[') ? match[1].slice(1, -1) : space(match[1])};`);
    else if ((match = token.match(/^p-([\w.[\]]+)$/))) declarations.push(`padding: ${match[1].startsWith('[') ? match[1].slice(1, -1) : space(match[1])};`);
    else if ((match = token.match(/^px-([\w.[\]]+)$/))) { const value = match[1].startsWith('[') ? match[1].slice(1, -1) : space(match[1]); declarations.push(`padding-left: ${value}; padding-right: ${value};`); }
    else if ((match = token.match(/^py-([\w.[\]]+)$/))) { const value = match[1].startsWith('[') ? match[1].slice(1, -1) : space(match[1]); declarations.push(`padding-top: ${value}; padding-bottom: ${value};`); }
    else if ((match = token.match(/^m-([\w.[\]]+)$/))) declarations.push(`margin: ${match[1].startsWith('[') ? match[1].slice(1, -1) : space(match[1])};`);
    else if ((match = token.match(/^rounded(?:-(.+))?$/))) { const key = match[1] || 'DEFAULT'; declarations.push(`border-radius: ${radius[key] || (key.startsWith('[') ? key.slice(1, -1) : key)};`); }
    else if ((match = token.match(/^bg-(.+)$/))) {
      const value = match[1];
      declarations.push(`background-color: ${value.startsWith('[') ? value.slice(1, -1) : colours[value] || value};`);
    } else if ((match = token.match(/^text-(.+)$/))) {
      const value = match[1];
      if (fontSize[value]) declarations.push(`font-size: ${fontSize[value]};`);
      else declarations.push(`color: ${value.startsWith('[') ? value.slice(1, -1) : colours[value] || value};`);
    } else if ((match = token.match(/^font-(normal|medium|semibold|bold|extrabold|black)$/))) declarations.push(`font-weight: ${ { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 }[match[1]] };`);
    else if ((match = token.match(/^shadow(?:-(.+))?$/))) declarations.push(`box-shadow: ${shadows[match[1] || 'DEFAULT']};`);
    else if ((match = token.match(/^\[([^:]+):(.+)\]$/))) declarations.push(`${match[1]}: ${match[2].replace(/_/g, ' ')};`);
  }
  return declarations.join('\n');
};

operations['tailwind-to-css'] = (v) => {
  if (!v.classes.trim()) throw new Error('Paste some Tailwind classes first.');
  return textResult(twToCss(v.classes), { status: 'Converted' });
};

operations['tailwind-flexbox-generator'] = (v) => {
  const direction = v.direction === 'col' ? 'column' : v.direction === 'row-reverse' ? 'row-reverse' : v.direction === 'col-reverse' ? 'column-reverse' : 'row';
  const justify = { start: 'flex-start', end: 'flex-end', between: 'space-between', around: 'space-around', evenly: 'space-evenly', center: 'center' }[v.justify] || v.justify;
  const align = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' }[v.align] || v.align;
  const tw = `flex flex-${v.direction} justify-${v.justify} items-${v.align} flex-${v.wrap === 'nowrap' ? 'nowrap' : v.wrap} gap-[${v.gap}px]`;
  const css = `display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${v.wrap};\ngap: ${v.gap}px;`;
  const items = Array.from({ length: v.items }, (_, i) => `<div class="utility-chip" style="background:#dbeafe">Item ${i + 1}</div>`).join('');
  const html = `<div class="utility-list"><div style="min-height:160px;padding:16px;border:1px solid #dbe3ef;border-radius:12px;display:flex;flex-direction:${direction};justify-content:${justify};align-items:${align};flex-wrap:${v.wrap};gap:${v.gap}px">${items}</div>${codeBlock('Tailwind', tw)}${codeBlock('CSS', css)}</div>`;
  return { html, copyText: tw + '\n' + css, blob: new Blob([css], { type: 'text/css' }), filename: 'flex.css', onMount: wireCopy };
};

operations['tailwind-card-generator'] = (v) => {
  const shadows = { none: 'none', sm: '0 1px 2px rgba(15,23,42,.08)', md: '0 4px 6px -1px rgba(15,23,42,.12)', lg: '0 10px 15px -3px rgba(15,23,42,.16)', xl: '0 20px 25px -5px rgba(15,23,42,.18)' };
  const tw = `rounded-[${v.radius}px] bg-[${v.background}] text-[${v.foreground}] p-[${v.padding}px] shadow-${v.shadow}`;
  const css = `border-radius: ${v.radius}px;\nbackground: ${v.background};\ncolor: ${v.foreground};\npadding: ${v.padding}px;\nbox-shadow: ${shadows[v.shadow]};`;
  const style = `border-radius:${v.radius}px;background:${v.background};color:${v.foreground};padding:${v.padding}px;box-shadow:${shadows[v.shadow]}`;
  const markup = `<article class="card" style="${style}"><h2>${escapeHtml(v.title)}</h2><p>${escapeHtml(v.body)}</p></article>`;
  const documentHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(v.title)}</title><style>body{font:16px/1.6 system-ui;margin:40px auto;padding:0 20px;max-width:720px}.card h2{margin-top:0}</style></head><body>${markup}</body></html>`;
  const html = `<div class="utility-list"><div class="utility-card-preview" style="${style}"><h3>${escapeHtml(v.title)}</h3><p>${escapeHtml(v.body)}</p></div>${codeBlock('Tailwind', tw)}${codeBlock('HTML', markup)}${codeBlock('CSS', css)}</div>`;
  return { html, copyText: tw + '\n' + markup + '\n' + css, blob: new Blob([documentHtml], { type: 'text/html' }), filename: 'card.html', onMount: wireCopy };
};

operations['tailwind-colors'] = (v) => {
  const base = hexToRgb(v.base);
  const hsl = rgbToHsl(base.r, base.g, base.b);
  const shades = Array.from({ length: v.count }, (_, i) => {
    const level = 95 - (i * 90 / Math.max(1, v.count - 1));
    const rgb = hslToRgb(hsl.h, clamp(hsl.s + (i < v.count / 2 ? 8 : -8), 0, 100), level);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const standard = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const label = v.count === standard.length ? String(standard[i]) : String(Math.round(50 + i * 900 / Math.max(1, v.count - 1)));
    return { label, hex, rgb, value: formatLocal(rgb, v.format) };
  });
  const lines = shades.map((s) => `${s.label}: ${s.value}`).join('\n');
  const html = `<div class="utility-list">${shades.map((s) => `<div class="utility-item"><span class="utility-chip"><i style="background:${s.hex}"></i>${s.label} · ${s.value}</span><button class="btn btn-ghost" type="button" data-copy="${escapeHtml(s.value)}">Copy</button></div>`).join('')}</div>`;
  return { html, copyText: lines, blob: new Blob([lines], { type: 'text/plain' }), filename: 'tailwind-colors.txt', onMount: wireCopy };
};

function formatLocal(rgb, format) {
  if (format === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  if (format === 'hsl') { const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b); return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`; }
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
