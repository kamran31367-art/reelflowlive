import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const f = (id, label, type = 'text', extra = {}) => ({ id, label, type, ...extra });
const text = (id, label, value = '', extra = {}) => f(id, label, 'text', { value, ...extra });
const area = (id, label, value = '', extra = {}) => f(id, label, 'textarea', { value, rows: 6, ...extra });
const num = (id, label, value, min, max, step = 1, extra = {}) => f(id, label, 'number', { value, min, max, step, ...extra });
const range = (id, label, value, min, max, step = 1, extra = {}) => f(id, label, 'range', { value, min, max, step, ...extra });
const select = (id, label, value, options, extra = {}) => f(id, label, 'select', {
  value,
  options: options.map(([v, l]) => ({ value: v, label: l || v })),
  ...extra
});
const check = (id, label, value = false, extra = {}) => f(id, label, 'checkbox', { value, ...extra });
const color = (id, label, value, extra = {}) => f(id, label, 'color', { value, ...extra });
const file = (id, label, accept, multiple = false, extra = {}) => f(id, label, 'file', { accept, multiple, ...extra });
const tool = (slug, name, desc, fields = [], extra = {}) => ({ slug, name, desc, fields, ...extra });

const categories = [
  {
    name: 'Tailwind',
    icon: 'code',
    related: ['developer-tools', 'color-contrast-checker', 'image-converter'],
    tools: [
      tool('tailwind-gradient-generator', 'Tailwind and CSS Gradient Generator', 'Build linear, radial and conic gradients with ready-to-copy Tailwind classes and CSS.', [
        color('from', 'From colour', '#6366f1'), color('via', 'Via colour', '#a855f7'), color('to', 'To colour', '#ec4899'),
        select('type', 'Gradient type', 'linear', [['linear', 'Linear'], ['radial', 'Radial'], ['conic', 'Conic']]),
        select('direction', 'Direction', '135deg', [['0deg', 'To top'], ['45deg', 'To top right'], ['90deg', 'To right'], ['135deg', 'To bottom right'], ['180deg', 'To bottom'], ['225deg', 'To bottom left'], ['270deg', 'To left'], ['315deg', 'To top left']]),
        check('useVia', 'Include middle colour', true)
      ], { inputTitle: 'Gradient colours', outputTitle: 'Gradient code', actionLabel: 'Generate gradient', autoRun: true, downloadExt: 'css' }),
      tool('tailwind-shadow-generator', 'Tailwind CSS Shadow Generator', 'Create layered CSS shadows and copy the matching Tailwind arbitrary-value classes.', [
        color('shadowColor', 'Shadow colour', '#0f172a'), range('opacity', 'Opacity', 25, 0, 100),
        range('blur', 'Blur', 24, 0, 100), range('x', 'Horizontal offset', 0, -50, 50), range('y', 'Vertical offset', 16, -50, 50),
        range('spread', 'Spread', -8, -50, 50), check('inset', 'Inset shadow')
      ], { inputTitle: 'Shadow settings', outputTitle: 'Shadow code', actionLabel: 'Generate shadow', autoRun: true, downloadExt: 'css' }),
      tool('tailwind-grid-generator', 'Tailwind CSS Grid Generator', 'Design a responsive CSS grid and export Tailwind grid utilities with exact columns, rows and gaps.', [
        num('columns', 'Columns', 3, 1, 12), num('rows', 'Rows', 2, 1, 12), num('gap', 'Gap (px)', 16, 0, 100),
        num('columnGap', 'Column gap override (px)', 0, 0, 100), num('rowGap', 'Row gap override (px)', 0, 0, 100),
        select('responsive', 'Responsive columns', 'none', [['none', 'Fixed'], ['sm', 'sm and up'], ['md', 'md and up'], ['lg', 'lg and up']])
      ], { inputTitle: 'Grid layout', outputTitle: 'Grid code', actionLabel: 'Generate grid', autoRun: true, downloadExt: 'css' }),
      tool('tailwind-button-generator', 'Tailwind CSS Button Generator', 'Style a production-ready button with live preview and copyable Tailwind or CSS.', [
        text('label', 'Button text', 'Get started'), color('background', 'Background', '#2563eb'), color('foreground', 'Text colour', '#ffffff'),
        num('paddingX', 'Horizontal padding', 20, 0, 64), num('paddingY', 'Vertical padding', 12, 0, 40), num('radius', 'Corner radius', 12, 0, 40),
        select('weight', 'Font weight', '600', [['400', 'Normal'], ['500', 'Medium'], ['600', 'Semibold'], ['700', 'Bold']]), check('shadow', 'Add shadow', true)
      ], { inputTitle: 'Button style', outputTitle: 'Button preview and code', actionLabel: 'Generate button', autoRun: true, downloadExt: 'css' }),
      tool('css-to-tailwind', 'CSS to Tailwind Converter', 'Convert common CSS declarations into practical Tailwind utility classes.', [
        area('css', 'CSS input', '.card {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n  border-radius: 12px;\n  background-color: #2563eb;\n  color: #ffffff;\n}', { spellcheck: false })
      ], { inputTitle: 'CSS', outputTitle: 'Tailwind classes', actionLabel: 'Convert to Tailwind', downloadExt: 'txt' }),
      tool('tailwind-to-css', 'Tailwind to CSS Converter', 'Turn a list of Tailwind utility classes into readable CSS declarations.', [
        area('classes', 'Tailwind classes', 'flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg', { spellcheck: false })
      ], { inputTitle: 'Tailwind classes', outputTitle: 'CSS', actionLabel: 'Convert to CSS', downloadExt: 'css' }),
      tool('tailwind-flexbox-generator', 'Tailwind Flexbox Generator', 'Build flex layouts visually and copy exact Tailwind classes for direction, alignment and wrapping.', [
        select('direction', 'Direction', 'row', [['row', 'Row'], ['row-reverse', 'Row reverse'], ['col', 'Column'], ['col-reverse', 'Column reverse']]),
        select('justify', 'Justify content', 'start', [['start', 'Start'], ['center', 'Center'], ['end', 'End'], ['between', 'Space between'], ['around', 'Space around'], ['evenly', 'Space evenly']]),
        select('align', 'Align items', 'center', [['start', 'Start'], ['center', 'Center'], ['end', 'End'], ['stretch', 'Stretch'], ['baseline', 'Baseline']]),
        select('wrap', 'Wrap', 'wrap', [['nowrap', 'No wrap'], ['wrap', 'Wrap'], ['wrap-reverse', 'Wrap reverse']]), num('gap', 'Gap (px)', 12, 0, 64),
        num('items', 'Preview items', 3, 2, 6)
      ], { inputTitle: 'Flex layout', outputTitle: 'Flex preview and code', actionLabel: 'Generate flex layout', autoRun: true, downloadExt: 'css' }),
      tool('tailwind-card-generator', 'Tailwind Card Generator', 'Create a polished card with a live preview and exportable Tailwind markup and CSS.', [
        text('title', 'Card title', 'Build something great'), area('body', 'Card text', 'A clean card component with flexible spacing, colour and shadow controls.', { rows: 3 }),
        color('background', 'Background', '#ffffff'), color('foreground', 'Text colour', '#0f172a'), num('padding', 'Padding', 24, 0, 64), num('radius', 'Radius', 20, 0, 48),
        select('shadow', 'Shadow', 'lg', [['none', 'None'], ['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large'], ['xl', 'Extra large']])
      ], { inputTitle: 'Card content and style', outputTitle: 'Card preview and code', actionLabel: 'Generate card', autoRun: true, downloadExt: 'html' }),
      tool('tailwind-colors', 'Tailwind Colors', 'Generate harmonious colour shades from one base colour and copy any shade as HEX, RGB or HSL.', [
        color('base', 'Base colour', '#2563eb'), range('count', 'Number of shades', 9, 3, 15, 1), select('format', 'Output format', 'hex', [['hex', 'HEX'], ['rgb', 'RGB'], ['hsl', 'HSL']])
      ], { inputTitle: 'Base colour', outputTitle: 'Colour shades', actionLabel: 'Generate palette', autoRun: true, downloadExt: 'txt' })
    ]
  },
  {
    name: 'Developer',
    icon: 'code',
    related: ['developer-tools', 'text-tools', 'utm-link-builder'],
    tools: [
      tool('timestamp-converter', 'Timestamp Converter', 'Convert Unix timestamps to readable dates and dates back to Unix seconds or milliseconds.', [
        text('value', 'Timestamp or date', '', { placeholder: '1764288000 or 2026-11-27T12:00:00Z' }),
        select('mode', 'Input mode', 'auto', [['auto', 'Auto detect'], ['seconds', 'Unix seconds'], ['milliseconds', 'Unix milliseconds'], ['date', 'Date and time']])
      ], { inputTitle: 'Timestamp', outputTitle: 'Converted dates', actionLabel: 'Convert timestamp', downloadExt: 'txt' }),
      tool('sql-formatter', 'SQL Online Formatter', 'Format SQL queries with consistent indentation and several database dialects.', [
        area('sql', 'SQL query', 'select id,name,email from users where active=1 order by name;', { rows: 9, spellcheck: false }),
        select('dialect', 'Dialect', 'sql', [['sql', 'Standard SQL'], ['mysql', 'MySQL'], ['postgresql', 'PostgreSQL'], ['sqlite', 'SQLite'], ['tsql', 'SQL Server']])
      ], { inputTitle: 'SQL query', outputTitle: 'Formatted SQL', actionLabel: 'Format SQL', downloadExt: 'sql' }),
      tool('yaml-json-converter', 'YAML/JSON Converter', 'Convert YAML to JSON or JSON to YAML locally, with clear validation errors.', [
        select('mode', 'Conversion', 'yaml-to-json', [['yaml-to-json', 'YAML to JSON'], ['json-to-yaml', 'JSON to YAML']]),
        area('input', 'Input', 'name: ReelFlow\ntools: 141\nlocal: true', { spellcheck: false })
      ], { inputTitle: 'YAML or JSON', outputTitle: 'Converted data', actionLabel: 'Convert', downloadExt: 'txt' }),
      tool('diff-compare', 'Diff Compare Tool', 'Compare two blocks of text with line-by-line additions, removals and unchanged lines.', [
        area('original', 'Original text', 'ReelFlow Toolkit\n26 free tools\nRuns in your browser', { rows: 7 }),
        area('changed', 'Changed text', 'ReelFlow Toolkit\n141 free tools\nRuns in your browser\nNo signup', { rows: 7 })
      ], { inputTitle: 'Two versions', outputTitle: 'Differences', actionLabel: 'Compare text', downloadExt: 'txt' }),
      tool('xml-beautifier', 'XML Beautifier and Minifier', 'Pretty-print XML for reading or minify it for transport without losing content.', [
        select('mode', 'Mode', 'beautify', [['beautify', 'Beautify'], ['minify', 'Minify']]),
        area('xml', 'XML input', '<root><item id="1">Hello</item><item id="2">World</item></root>', { spellcheck: false })
      ], { inputTitle: 'XML', outputTitle: 'Formatted XML', actionLabel: 'Format XML', downloadExt: 'xml' }),
      tool('keyboard-shortcut-image', 'Keyboard Shortcut Image Generator', 'Turn a keyboard shortcut into a clean, shareable image for tutorials and documentation.', [
        text('keys', 'Keys', 'Ctrl + Shift + K'), select('theme', 'Theme', 'light', [['light', 'Light'], ['dark', 'Dark']]), select('platform', 'Key style', 'windows', [['windows', 'Windows / Linux'], ['mac', 'macOS']])
      ], { inputTitle: 'Shortcut', outputTitle: 'Shortcut image', actionLabel: 'Generate image', downloadExt: 'png' }),
      tool('url-encoder-decoder', 'URL Encoder and Decoder', 'Encode text for URLs or decode percent-encoded URL components safely.', [
        text('value', 'Text or URL component', 'ReelFlow free tools & more'), select('mode', 'Mode', 'encode', [['encode', 'Encode'], ['decode', 'Decode']])
      ], { inputTitle: 'URL text', outputTitle: 'Encoded or decoded text', actionLabel: 'Convert URL', downloadExt: 'txt' }),
      tool('prompt-to-url', 'Prompt to URL Generator', 'Package a reusable prompt into a shareable URL for popular AI assistants.', [
        area('prompt', 'Prompt', 'Explain this topic in simple steps: {{topic}}', { rows: 5 }), select('service', 'Service', 'chatgpt', [['chatgpt', 'ChatGPT'], ['claude', 'Claude'], ['perplexity', 'Perplexity'], ['gemini', 'Gemini']])
      ], { inputTitle: 'Prompt', outputTitle: 'Shareable prompt URL', actionLabel: 'Generate URL', downloadExt: 'txt' }),
      tool('svg-blob-generator', 'SVG Blob Generator', 'Generate unique organic SVG blob shapes with adjustable complexity and contrast.', [
        num('width', 'Width', 600, 100, 2000), num('height', 'Height', 600, 100, 2000), range('points', 'Points', 7, 3, 16), range('randomness', 'Randomness', 24, 0, 60), check('gradient', 'Use gradient fill', true)
      ], { inputTitle: 'Blob settings', outputTitle: 'SVG blob', actionLabel: 'Generate blob', downloadExt: 'svg' }),
      tool('json-csv-converter', 'JSON/CSV Converter', 'Convert JSON arrays to CSV and CSV back to JSON with delimiter control.', [
        select('mode', 'Conversion', 'json-to-csv', [['json-to-csv', 'JSON to CSV'], ['csv-to-json', 'CSV to JSON']]), select('delimiter', 'CSV delimiter', ',', [[',', 'Comma'], [';', 'Semicolon'], ['\t', 'Tab']]),
        area('input', 'Input', '[{"name":"Ayesha","score":92},{"name":"Bilal","score":87}]', { spellcheck: false })
      ], { inputTitle: 'JSON or CSV', outputTitle: 'Converted data', actionLabel: 'Convert', downloadExt: 'txt' }),
      tool('css-minifier', 'CSS Minifier', 'Remove comments and unnecessary whitespace from CSS while preserving values.', [
        area('css', 'CSS input', '.card {\n  display: flex;\n  gap: 16px;\n  color: #0f172a;\n}', { rows: 9, spellcheck: false })
      ], { inputTitle: 'CSS', outputTitle: 'Minified CSS', actionLabel: 'Minify CSS', downloadExt: 'css' }),
      tool('keycode-info', 'Keycode JavaScript Info', 'Inspect key, code, keyCode and modifier details for any keyboard key.', [
        text('key', 'Key name', 'Enter', { placeholder: 'Type a key name or press a key on this page' })
      ], { inputTitle: 'Keyboard key', outputTitle: 'JavaScript key details', actionLabel: 'Inspect key', autoRun: true, downloadExt: 'txt' }),
      tool('oklch-color-converter', 'OKLCH Color Picker and Converter', 'Convert HEX, RGB, HSL and OKLCH colours with a live swatch and copyable values.', [
        color('color', 'Colour', '#2563eb'), select('format', 'Preferred output', 'all', [['all', 'All formats'], ['oklch', 'OKLCH'], ['hex', 'HEX'], ['rgb', 'RGB'], ['hsl', 'HSL']])
      ], { inputTitle: 'Colour', outputTitle: 'Colour conversions', actionLabel: 'Convert colour', autoRun: true, downloadExt: 'txt' }),
      tool('cron-explainer', 'Cron Expression Explainer', 'Explain cron expressions in plain English and show the next scheduled run times.', [
        text('expression', 'Cron expression', '*/15 * * * *'), num('runs', 'Next runs to show', 5, 1, 20)
      ], { inputTitle: 'Cron expression', outputTitle: 'Explanation and next runs', actionLabel: 'Explain cron', downloadExt: 'txt' }),
      tool('html-to-jsx', 'HTML to JSX Converter', 'Convert common HTML attributes and inline styles into valid JSX.', [
        area('html', 'HTML input', '<div class="card" style="color: red; font-size: 16px;">\n  <img src="photo.png" alt="Preview" />\n  <button onclick="save()">Save</button>\n</div>', { rows: 9, spellcheck: false })
      ], { inputTitle: 'HTML', outputTitle: 'JSX', actionLabel: 'Convert to JSX', downloadExt: 'jsx' }),
      tool('css-unit-converter', 'CSS Unit Converter', 'Convert between px, rem, em, pt, pc, cm, mm and inches with a configurable root size.', [
        num('value', 'Value', 16, -10000, 10000, 0.01), select('from', 'From unit', 'px', [['px', 'px'], ['rem', 'rem'], ['em', 'em'], ['pt', 'pt'], ['pc', 'pc'], ['cm', 'cm'], ['mm', 'mm'], ['in', 'in']]),
        select('to', 'To unit', 'rem', [['px', 'px'], ['rem', 'rem'], ['em', 'em'], ['pt', 'pt'], ['pc', 'pc'], ['cm', 'cm'], ['mm', 'mm'], ['in', 'in']]), num('rootSize', 'Root font size (px)', 16, 1, 100, 0.1)
      ], { inputTitle: 'Value and units', outputTitle: 'Converted value', actionLabel: 'Convert unit', autoRun: true, downloadExt: 'txt' }),
      tool('token-generator', 'Token Generator', 'Generate cryptographically secure random tokens with Web Crypto.', [
        num('bytes', 'Random bytes', 32, 1, 256), select('format', 'Format', 'hex', [['hex', 'Hexadecimal'], ['base64', 'Base64'], ['base64url', 'Base64 URL-safe']]), num('count', 'Number of tokens', 1, 1, 50)
      ], { inputTitle: 'Token settings', outputTitle: 'Secure tokens', actionLabel: 'Generate tokens', downloadExt: 'txt' }),
      tool('encrypt-decrypt', 'Encrypt and Decrypt Text', 'Encrypt text with a password using AES-GCM and PBKDF2, entirely in your browser.', [
        area('text', 'Text', 'Private note', { rows: 5 }), text('password', 'Password', '', { type: 'password' }), select('mode', 'Mode', 'encrypt', [['encrypt', 'Encrypt'], ['decrypt', 'Decrypt']])
      ], { inputTitle: 'Text and password', outputTitle: 'Encrypted or decrypted text', actionLabel: 'Run encryption', downloadExt: 'txt', note: 'Use a strong password. There is no password recovery.' }),
      tool('phone-parser', 'Phone Parser and Formatter', 'Parse international phone numbers and format them in E.164, national and international styles.', [
        text('phone', 'Phone number', '+44 7700 900123'), select('country', 'Default country', 'US', [['US', 'United States'], ['GB', 'United Kingdom'], ['PK', 'Pakistan'], ['IN', 'India'], ['AE', 'United Arab Emirates'], ['AU', 'Australia'], ['DE', 'Germany'], ['FR', 'France']])
      ], { inputTitle: 'Phone number', outputTitle: 'Parsed phone details', actionLabel: 'Parse number', downloadExt: 'txt' }),
      tool('mac-address-generator', 'MAC Address Generator', 'Generate valid locally administered MAC addresses for labs and testing.', [
        num('count', 'How many', 5, 1, 100), select('case', 'Letter case', 'upper', [['upper', 'Uppercase'], ['lower', 'Lowercase']]), select('separator', 'Separator', ':', [[':', 'Colon'], ['-', 'Hyphen'], ['', 'None']])
      ], { inputTitle: 'MAC settings', outputTitle: 'Generated addresses', actionLabel: 'Generate MAC addresses', downloadExt: 'txt' })
    ]
  },
  {
    name: 'Image',
    icon: 'crop',
    related: ['image-resizer', 'image-compressor', 'image-converter'],
    tools: [
      tool('image-watermark', 'Image Watermark', 'Add a text watermark to an image with position, opacity and size controls.', [
        file('image', 'Image', 'image/*'), text('watermark', 'Watermark text', '© ReelFlow'), select('position', 'Position', 'bottom-right', [['bottom-right', 'Bottom right'], ['bottom-left', 'Bottom left'], ['top-right', 'Top right'], ['top-left', 'Top left'], ['center', 'Center']]),
        range('size', 'Text size', 36, 8, 160), range('opacity', 'Opacity', 75, 5, 100), color('color', 'Text colour', '#ffffff')
      ], { inputTitle: 'Image and watermark', outputTitle: 'Watermarked image', actionLabel: 'Add watermark', downloadExt: 'png' }),
      tool('laser-eyes-meme', 'Laser Eyes Meme Generator', 'Add adjustable glowing laser eyes to a photo and download the meme.', [
        file('image', 'Photo', 'image/*'), range('leftX', 'Left eye X', 40, 0, 100), range('leftY', 'Left eye Y', 42, 0, 100), range('rightX', 'Right eye X', 60, 0, 100), range('rightY', 'Right eye Y', 42, 0, 100),
        color('laserColor', 'Laser colour', '#ff0033'), range('intensity', 'Glow', 70, 0, 100)
      ], { inputTitle: 'Photo and eye positions', outputTitle: 'Laser eyes meme', actionLabel: 'Generate meme', downloadExt: 'png' }),
      tool('invert-image', 'Invert Image Colors', 'Invert every colour channel in an image and download the result as PNG.', [file('image', 'Image', 'image/*')], { inputTitle: 'Image', outputTitle: 'Inverted image', actionLabel: 'Invert image', downloadExt: 'png' }),
      tool('image-pixelator', 'Image Pixelator', 'Pixelate an image with a controllable block size and download the result.', [file('image', 'Image', 'image/*'), range('blockSize', 'Pixel block size', 16, 2, 100)], { inputTitle: 'Image and pixel size', outputTitle: 'Pixelated image', actionLabel: 'Pixelate image', autoRun: true, downloadExt: 'png' }),
      tool('image-blur-pixelate', 'Image Blur and Pixelate', 'Apply a soft blur or pixelation effect to an image with adjustable strength.', [file('image', 'Image', 'image/*'), select('mode', 'Effect', 'blur', [['blur', 'Blur'], ['pixelate', 'Pixelate']]), range('amount', 'Strength', 12, 1, 60)], { inputTitle: 'Image and effect', outputTitle: 'Processed image', actionLabel: 'Apply effect', autoRun: true, downloadExt: 'png' }),
      tool('image-color-picker', 'Image Color Picker', 'Pick an exact colour from any point in an image and copy HEX, RGB and HSL values.', [file('image', 'Image', 'image/*'), range('x', 'Pick X', 50, 0, 100), range('y', 'Pick Y', 50, 0, 100)], { inputTitle: 'Image and pick position', outputTitle: 'Picked colour', actionLabel: 'Pick colour', autoRun: true, downloadExt: 'txt' }),
      tool('random-color-generator', 'Random Color Generator', 'Generate random colours and copy them as HEX, RGB or HSL.', [num('count', 'How many colours', 8, 1, 100), select('format', 'Format', 'hex', [['hex', 'HEX'], ['rgb', 'RGB'], ['hsl', 'HSL']])], { inputTitle: 'Palette settings', outputTitle: 'Random colours', actionLabel: 'Generate colours', downloadExt: 'txt' }),
      tool('resize-gif', 'Resize GIF', 'Resize an animated GIF while preserving its animation and transparency.', [file('gif', 'GIF image', 'image/gif'), num('width', 'New width', 480, 16, 2000), range('fps', 'Frames per second', 12, 1, 30)], { inputTitle: 'GIF and size', outputTitle: 'Resized GIF', actionLabel: 'Resize GIF', needsGif: true, downloadExt: 'gif' }),
      tool('compress-gif', 'Compress GIF', 'Reduce GIF file size by scaling frames, lowering frame rate and optimising the palette.', [file('gif', 'GIF image', 'image/gif'), range('scale', 'Scale', 70, 10, 100), num('colors', 'Colour count', 128, 2, 256), range('fps', 'Frames per second', 10, 1, 30)], { inputTitle: 'GIF and compression', outputTitle: 'Compressed GIF', actionLabel: 'Compress GIF', needsGif: true, downloadExt: 'gif' }),
      tool('trim-transparent-pixels', 'Trim Transparent Pixels', 'Crop empty transparent edges from a PNG or WebP image.', [file('image', 'Transparent image', 'image/png,image/webp'), num('padding', 'Keep padding (px)', 0, 0, 100)], { inputTitle: 'Transparent image', outputTitle: 'Trimmed image', actionLabel: 'Trim image', downloadExt: 'png' }),
      tool('image-border', 'Add Borders to Image', 'Frame an image with a solid, rounded or dashed border.', [file('image', 'Image', 'image/*'), num('size', 'Border size', 24, 1, 200), color('borderColor', 'Border colour', '#ffffff'), select('style', 'Border style', 'solid', [['solid', 'Solid'], ['rounded', 'Rounded'], ['double', 'Double']])], { inputTitle: 'Image and border', outputTitle: 'Framed image', actionLabel: 'Add border', autoRun: true, downloadExt: 'png' }),
      tool('image-splitter', 'Image Splitter', 'Split an image into a grid of tiles and download every tile in one ZIP.', [file('image', 'Image', 'image/*'), num('columns', 'Columns', 2, 1, 10), num('rows', 'Rows', 2, 1, 10)], { inputTitle: 'Image and grid', outputTitle: 'Image tiles', actionLabel: 'Split image', downloadExt: 'zip' }),
      tool('merge-images', 'Merge Images Online', 'Combine multiple images horizontally, vertically or in a grid.', [file('images', 'Images', 'image/*', true), select('layout', 'Layout', 'horizontal', [['horizontal', 'Horizontal'], ['vertical', 'Vertical'], ['grid', 'Grid']]), num('columns', 'Grid columns', 2, 1, 6), num('gap', 'Gap (px)', 0, 0, 100), color('background', 'Background', '#ffffff')], { inputTitle: 'Images and layout', outputTitle: 'Merged image', actionLabel: 'Merge images', downloadExt: 'png' }),
      tool('pixel-art-converter', 'Pixel Art Converter', 'Convert a photo into pixel art with palette reduction and optional dithering.', [file('image', 'Photo', 'image/*'), range('pixelSize', 'Pixel size', 10, 2, 50), range('colors', 'Palette colours', 16, 2, 64), check('dither', 'Use dithering', true)], { inputTitle: 'Photo and pixel settings', outputTitle: 'Pixel art', actionLabel: 'Create pixel art', autoRun: true, downloadExt: 'png' }),
      tool('paste-image-download', 'Paste Image to Download', 'Paste an image from your clipboard or choose a file, then download it as PNG.', [file('image', 'Image', 'image/*')], { inputTitle: 'Paste or choose an image', outputTitle: 'Image preview', actionLabel: 'Prepare download', downloadExt: 'png', note: 'You can also press Ctrl+V or Cmd+V anywhere on this page.' }),
      tool('image-to-ascii', 'Image to ASCII Converter', 'Convert an image into text art using adjustable width and character sets.', [file('image', 'Image', 'image/*'), num('width', 'Output width', 80, 20, 200), select('charset', 'Character set', 'standard', [['standard', 'Standard'], ['detailed', 'Detailed'], ['blocks', 'Blocks'], ['binary', 'Binary']])], { inputTitle: 'Image and ASCII settings', outputTitle: 'ASCII art', actionLabel: 'Convert to ASCII', downloadExt: 'txt' }),
      tool('image-exif-tool', 'Image EXIF Viewer and Metadata Remover', 'Read EXIF metadata or remove it by re-encoding an image locally.', [file('image', 'Image', 'image/*'), select('mode', 'Mode', 'view', [['view', 'View metadata'], ['remove', 'Remove metadata']])], { inputTitle: 'Image and mode', outputTitle: 'Metadata or cleaned image', actionLabel: 'Process image', downloadExt: 'txt' }),
      tool('flip-image', 'Flip Image Online', 'Flip an image horizontally or vertically and download the result.', [file('image', 'Image', 'image/*'), select('axis', 'Flip direction', 'horizontal', [['horizontal', 'Horizontal'], ['vertical', 'Vertical'], ['both', 'Both']])], { inputTitle: 'Image and direction', outputTitle: 'Flipped image', actionLabel: 'Flip image', autoRun: true, downloadExt: 'png' }),
      tool('collage-maker', 'Online Collage Maker', 'Arrange multiple photos into a clean grid collage with spacing and background controls.', [file('images', 'Photos', 'image/*', true), num('columns', 'Columns', 2, 1, 6), num('gap', 'Gap (px)', 12, 0, 100), color('background', 'Background', '#ffffff'), check('rounded', 'Rounded photo corners', true)], { inputTitle: 'Photos and layout', outputTitle: 'Collage', actionLabel: 'Create collage', downloadExt: 'png' })
    ]
  },
  {
    name: 'Mail',
    icon: 'link',
    related: ['text-tools', 'developer-tools', 'calendar-link-generator'],
    tools: [
      tool('eml-viewer', 'EML File Viewer', 'Open .eml email files locally and inspect headers, text, HTML and attachment names.', [file('eml', 'Email file', '.eml,message/rfc822')], { inputTitle: 'Email file', outputTitle: 'Email preview', actionLabel: 'Open email', downloadExt: 'txt' }),
      tool('mailto-link-generator', 'Mailto Link Generator', 'Build a mailto link with recipients, subject and a pre-filled message.', [text('to', 'To', ''), text('cc', 'CC', ''), text('bcc', 'BCC', ''), text('subject', 'Subject', ''), area('body', 'Message', '', { rows: 5 })], { inputTitle: 'Email details', outputTitle: 'Mailto link', actionLabel: 'Generate mailto link', downloadExt: 'txt' })
    ]
  },
  {
    name: 'Text',
    icon: 'text',
    related: ['text-tools', 'character-counter', 'title-preview'],
    tools: [
      tool('utf8-encoder-decoder', 'UTF-8 Encoder and Decoder', 'Convert text to UTF-8 bytes or decode UTF-8 byte values back to text.', [select('mode', 'Mode', 'encode', [['encode', 'Text to UTF-8 bytes'], ['decode', 'UTF-8 bytes to text']]), area('input', 'Input', 'Hello, world! 🌍', { rows: 5 })], { inputTitle: 'Text or bytes', outputTitle: 'UTF-8 result', actionLabel: 'Convert UTF-8', downloadExt: 'txt' }),
      tool('utf8-byte-counter', 'UTF-8 Byte Counter', 'Count Unicode characters, code points and exact UTF-8 byte length.', [area('text', 'Text', 'Hello, world! 🌍', { rows: 6 })], { inputTitle: 'Text', outputTitle: 'Byte counts', actionLabel: 'Count bytes', autoRun: true, downloadExt: 'txt' }),
      tool('add-text-to-lines', 'Add Text to Each Line', 'Add a prefix, suffix or line number to every line in a block of text.', [area('text', 'Lines', 'First line\nSecond line\nThird line', { rows: 6 }), text('prefix', 'Prefix', ''), text('suffix', 'Suffix', ''), check('numberLines', 'Add line numbers')], { inputTitle: 'Text lines', outputTitle: 'Updated lines', actionLabel: 'Update lines', downloadExt: 'txt' }),
      tool('filter-lines', 'Filter Lines Online', 'Keep or remove lines using contains, starts-with, ends-with or regular-expression rules.', [area('text', 'Lines', 'apple\nbanana\napricot\ncherry', { rows: 7 }), select('mode', 'Match', 'contains', [['contains', 'Contains'], ['starts', 'Starts with'], ['ends', 'Ends with'], ['regex', 'Regular expression'], ['unique', 'Unique lines only']]), text('query', 'Match text or regex', 'ap'), check('invert', 'Invert match')], { inputTitle: 'Lines and filter', outputTitle: 'Filtered lines', actionLabel: 'Filter lines', downloadExt: 'txt' }),
      tool('repeat-text', 'Repeat Text Online', 'Repeat a word, sentence or paragraph a set number of times with a custom separator.', [area('text', 'Text', 'ReelFlow', { rows: 3 }), num('count', 'Repeat count', 5, 1, 10000), text('separator', 'Separator', ' ')], { inputTitle: 'Text and count', outputTitle: 'Repeated text', actionLabel: 'Repeat text', downloadExt: 'txt' }),
      tool('simple-text-editor', 'Simple Online Text Editor', 'Write and clean text with live word, character, sentence and reading-time statistics.', [area('text', 'Your text', 'Start writing here...', { rows: 12 })], { inputTitle: 'Editor', outputTitle: 'Live text statistics', actionLabel: 'Update statistics', autoRun: true, downloadExt: 'txt' }),
      tool('number-to-words', 'Number to Words Converter', 'Convert whole numbers into English words, including large values and optional currency.', [text('number', 'Number', '1234567'), select('style', 'Style', 'international', [['international', 'International'], ['currency', 'Currency (USD)']])], { inputTitle: 'Number', outputTitle: 'Number in words', actionLabel: 'Convert number', downloadExt: 'txt' }),
      tool('markdown-editor', 'Markdown Editor', 'Write Markdown with a live, sanitised HTML preview and export the rendered HTML.', [area('markdown', 'Markdown', '# Hello ReelFlow\n\nWrite **Markdown** with a live preview.\n\n- Fast\n- Private\n- Free', { rows: 12, spellcheck: false }), select('view', 'Output', 'preview', [['preview', 'HTML preview'], ['html', 'HTML source'], ['markdown', 'Markdown source']])], { inputTitle: 'Markdown', outputTitle: 'Rendered preview', actionLabel: 'Render Markdown', autoRun: true, downloadExt: 'html' }),
      tool('random-letter-generator', 'Random Letter Generator', 'Generate random letters with optional vowels and uppercase styling.', [num('count', 'How many', 10, 1, 500), select('case', 'Letter case', 'upper', [['upper', 'Uppercase'], ['lower', 'Lowercase'], ['mixed', 'Mixed']]), check('vowelsOnly', 'Vowels only')], { inputTitle: 'Letter settings', outputTitle: 'Random letters', actionLabel: 'Generate letters', downloadExt: 'txt' }),
      tool('random-emoji-generator', 'Random Emoji Generator', 'Pick random emoji from faces, animals, food, nature, objects and symbols.', [num('count', 'How many', 12, 1, 200), select('category', 'Category', 'all', [['all', 'All'], ['faces', 'Faces'], ['animals', 'Animals'], ['food', 'Food'], ['nature', 'Nature'], ['objects', 'Objects'], ['symbols', 'Symbols']])], { inputTitle: 'Emoji settings', outputTitle: 'Random emoji', actionLabel: 'Generate emoji', downloadExt: 'txt' }),
      tool('list-randomizer', 'List Randomizer', 'Shuffle a list or pick random items with optional duplicate prevention.', [area('items', 'List items', 'Apple\nBanana\nCherry\nDate\nElderberry', { rows: 7 }), num('count', 'Items to pick', 3, 1, 1000), check('unique', 'No duplicates', true), select('mode', 'Mode', 'pick', [['pick', 'Pick items'], ['shuffle', 'Shuffle all']])], { inputTitle: 'List and options', outputTitle: 'Randomised list', actionLabel: 'Randomize list', downloadExt: 'txt' }),
      tool('random-group-generator', 'Random Group Generator', 'Split a list of names into balanced random groups instantly.', [area('items', 'Names', 'Ayesha\nBilal\nChen\nDaniyal\nEmma\nFarah\nGeorge\nHina', { rows: 8 }), num('groups', 'Number of groups', 3, 1, 50)], { inputTitle: 'Names and groups', outputTitle: 'Random groups', actionLabel: 'Create groups', downloadExt: 'txt' }),
      tool('random-word-generator', 'Random Word Generator', 'Generate random English words for writing prompts, games and brainstorming.', [num('count', 'How many', 10, 1, 200), num('minLength', 'Minimum length', 3, 1, 12), num('maxLength', 'Maximum length', 9, 2, 20)], { inputTitle: 'Word settings', outputTitle: 'Random words', actionLabel: 'Generate words', needsWords: true, downloadExt: 'txt' }),
      tool('zalgo-text-generator', 'Zalgo Text Generator', 'Add chaotic combining marks to text with adjustable intensity.', [area('text', 'Text', 'ReelFlow', { rows: 4 }), range('intensity', 'Intensity', 50, 0, 100), check('up', 'Marks above', true), check('down', 'Marks below', true), check('middle', 'Marks through middle', true)], { inputTitle: 'Text and intensity', outputTitle: 'Zalgo text', actionLabel: 'Generate Zalgo text', autoRun: true, downloadExt: 'txt' }),
      tool('cursed-text-generator', 'Cursed Text Generator', 'Create unsettling cursed text with dense combining characters.', [area('text', 'Text', 'Do not look behind you', { rows: 4 }), range('intensity', 'Intensity', 65, 0, 100)], { inputTitle: 'Text and intensity', outputTitle: 'Cursed text', actionLabel: 'Generate cursed text', autoRun: true, downloadExt: 'txt' }),
      tool('glitch-text-generator', 'Glitch Text Generator', 'Create glitch-style Unicode text by mixing look-alike characters.', [area('text', 'Text', 'SYSTEM ONLINE', { rows: 4 }), range('intensity', 'Glitch amount', 35, 0, 100)], { inputTitle: 'Text and glitch amount', outputTitle: 'Glitch text', actionLabel: 'Generate glitch text', autoRun: true, downloadExt: 'txt' }),
      tool('duplicate-word-finder', 'Duplicate Word Finder', 'Find repeated words in text, with counts and case-sensitive matching.', [area('text', 'Text', 'This is is a test test of duplicate words.', { rows: 7 }), check('caseSensitive', 'Case sensitive')], { inputTitle: 'Text', outputTitle: 'Duplicate words', actionLabel: 'Find duplicates', downloadExt: 'txt' }),
      tool('morse-code-translator', 'Morse Code Translator', 'Translate text to Morse code or Morse code back to text.', [select('mode', 'Mode', 'encode', [['encode', 'Text to Morse'], ['decode', 'Morse to text']]), area('input', 'Input', 'SOS HELP', { rows: 5 })], { inputTitle: 'Text or Morse', outputTitle: 'Morse translation', actionLabel: 'Translate Morse', downloadExt: 'txt' }),
      tool('morse-code-practice', 'Morse Code Practice', 'Practise Morse code with random words, sound playback and a reveal button.', [select('level', 'Level', 'easy', [['easy', 'Easy letters'], ['medium', 'Letters and numbers'], ['hard', 'Mixed characters']])], { inputTitle: 'Practice level', outputTitle: 'Morse practice', actionLabel: 'Start practice', autoRun: true, interactive: 'morse-practice', downloadExt: 'txt' }),
      tool('acronym-generator', 'Acronym Generator and Expander', 'Create an acronym from a phrase or brainstorm expansions for an acronym.', [select('mode', 'Mode', 'generate', [['generate', 'Phrase to acronym'], ['expand', 'Acronym to phrase ideas']]), text('input', 'Phrase or acronym', 'ReelFlow Toolkit')], { inputTitle: 'Phrase or acronym', outputTitle: 'Acronym ideas', actionLabel: 'Generate acronyms', downloadExt: 'txt' }),
      tool('spelling-bee-solver', 'Spelling Bee Solver', 'Find valid words from seven letters and an optional required centre letter.', [text('letters', 'Seven letters', 'reflown'), text('required', 'Required centre letter', 'f', { maxlength: 1 })], { inputTitle: 'Puzzle letters', outputTitle: 'Valid words', actionLabel: 'Solve puzzle', needsWords: true, downloadExt: 'txt' }),
      tool('wingdings-translator', 'Wingdings Translator', 'Convert text to Wingdings symbols or map Wingdings symbols back to letters.', [select('mode', 'Mode', 'encode', [['encode', 'Text to Wingdings'], ['decode', 'Wingdings to text']]), area('input', 'Input', 'HELLO', { rows: 5 })], { inputTitle: 'Text or symbols', outputTitle: 'Wingdings translation', actionLabel: 'Translate Wingdings', downloadExt: 'txt' }),
      tool('invisible-character-generator', 'Invisible Character Generator', 'Add zero-width or invisible Unicode characters to text for usernames and formatting.', [area('text', 'Visible text', 'ReelFlow', { rows: 4 }), select('type', 'Invisible character', 'zero-width', [['zero-width', 'Zero-width space'], ['zero-width-nonjoiner', 'Zero-width non-joiner'], ['word-joiner', 'Word joiner'], ['hair-space', 'Hair space'], ['thin-space', 'Thin space']]), select('position', 'Position', 'between', [['between', 'Between characters'], ['start', 'At start'], ['end', 'At end'], ['both', 'At both ends']])], { inputTitle: 'Text and character', outputTitle: 'Text with invisible characters', actionLabel: 'Generate invisible text', autoRun: true, downloadExt: 'txt' }),
      tool('small-text-generator', 'Small Text Generator', 'Convert normal text into small superscript, subscript or full-width Unicode.', [area('text', 'Text', 'Small but powerful', { rows: 4 }), select('style', 'Style', 'superscript', [['superscript', 'Superscript small'], ['subscript', 'Subscript small'], ['fullwidth', 'Full-width small']])], { inputTitle: 'Text and style', outputTitle: 'Small text', actionLabel: 'Generate small text', autoRun: true, downloadExt: 'txt' }),
      tool('cursive-text-generator', 'Cursive Text Generator', 'Transform text into Unicode mathematical script for stylish captions and bios.', [area('text', 'Text', 'ReelFlow looks beautiful', { rows: 4 }), select('style', 'Script style', 'script', [['script', 'Script'], ['bold-script', 'Bold script'], ['italic', 'Italic']])], { inputTitle: 'Text and style', outputTitle: 'Cursive text', actionLabel: 'Generate cursive text', autoRun: true, downloadExt: 'txt' }),
      tool('upside-down-text', 'Upside Down Text Generator', 'Flip and rotate text into upside-down Unicode.', [area('text', 'Text', 'ReelFlow', { rows: 4 })], { inputTitle: 'Text', outputTitle: 'Upside-down text', actionLabel: 'Flip text', autoRun: true, downloadExt: 'txt' }),
      tool('strikethrough-text', 'Strikethrough Text Generator', 'Add Unicode strikethrough styling to text for social posts and messages.', [area('text', 'Text', 'Old price: $99', { rows: 4 }), select('style', 'Style', 'single', [['single', 'Single line'], ['double', 'Double line']])], { inputTitle: 'Text and style', outputTitle: 'Strikethrough text', actionLabel: 'Generate strikethrough', autoRun: true, downloadExt: 'txt' })
    ]
  },
  {
    name: 'Video & Audio',
    icon: 'film',
    related: ['video-trimmer', 'video-to-gif', 'audio-extractor'],
    tools: [
      tool('video-to-step-guide', 'Video to Step-by-Step Guide', 'Extract frames at fixed intervals and build an editable step-by-step guide from a video.', [file('video', 'Video', 'video/*'), num('interval', 'Seconds between steps', 10, 1, 300), area('notes', 'Step notes (one per line)', '', { rows: 5, placeholder: 'Optional notes, one for each step' })], { inputTitle: 'Video and guide settings', outputTitle: 'Step-by-step guide', actionLabel: 'Build guide', downloadExt: 'html' }),
      tool('webcam-mirror', 'Webcam Mirror Online', 'Mirror your webcam in the browser, flip the view and save a snapshot.', [], { inputTitle: 'Webcam controls', outputTitle: 'Mirrored camera', actionLabel: 'Start camera', interactive: 'webcam', disableDownload: true, disableCopy: true, note: 'Camera access stays in this tab and is never uploaded.' }),
      tool('online-audio-recorder', 'Online Audio Recorder', 'Record microphone audio, replay it and download the recording.', [], { inputTitle: 'Recorder controls', outputTitle: 'Recording', actionLabel: 'Start recording', interactive: 'recorder', downloadExt: 'webm', note: 'Microphone access stays in this tab and is never uploaded.' })
    ]
  },
  {
    name: 'Converters',
    icon: 'swap',
    related: ['pdf-tools', 'image-converter', 'text-tools'],
    tools: [
      tool('roman-numeral-date', 'Roman Numeral Date Converter', 'Convert a calendar date to Roman numerals or a Roman date back to calendar form.', [f('date', 'Date', 'date', { value: '2026-11-27' }), select('mode', 'Mode', 'to-roman', [['to-roman', 'Date to Roman numerals'], ['from-roman', 'Roman numerals to date']]), text('roman', 'Roman date (DD / MM / YYYY)', 'XXVII / XI / MMXXVI')], { inputTitle: 'Date', outputTitle: 'Roman date', actionLabel: 'Convert date', downloadExt: 'txt' }),
      tool('document-to-markdown', 'Document to Markdown Converter', 'Convert DOCX, HTML or plain text documents into clean Markdown.', [file('document', 'Document', '.docx,.html,.htm,.txt,.md')], { inputTitle: 'Document', outputTitle: 'Markdown', actionLabel: 'Convert document', downloadExt: 'md' }),
      tool('pdf-to-markdown', 'PDF to Markdown Converter', 'Extract text from a PDF and structure it into Markdown headings and paragraphs.', [file('pdf', 'PDF file', '.pdf,application/pdf')], { inputTitle: 'PDF file', outputTitle: 'Markdown text', actionLabel: 'Extract Markdown', needsPdf: true, downloadExt: 'md' }),
      tool('word-to-markdown', 'Word to Markdown Converter', 'Convert Word DOCX files to Markdown while preserving headings, lists, links and tables.', [file('document', 'Word document', '.docx')], { inputTitle: 'Word document', outputTitle: 'Markdown', actionLabel: 'Convert Word file', downloadExt: 'md' }),
      tool('excel-to-markdown', 'Excel to Markdown Table Converter', 'Convert the first sheet of an XLSX workbook into a Markdown table.', [file('workbook', 'Excel workbook', '.xlsx')], { inputTitle: 'Excel workbook', outputTitle: 'Markdown table', actionLabel: 'Convert workbook', downloadExt: 'md' }),
      tool('scanned-pdf', 'Make PDF Look Scanned Online', 'Render PDF pages into image-only PDF pages with optional grayscale, rotation and noise.', [file('pdf', 'PDF file', '.pdf,application/pdf'), select('pages', 'Pages', 'all', [['all', 'All pages'], ['first', 'First page'], ['first5', 'First five pages']]), check('grayscale', 'Grayscale', true), range('rotation', 'Rotation', 0, -15, 15), range('noise', 'Paper noise', 4, 0, 20)], { inputTitle: 'PDF and scan settings', outputTitle: 'Scanned-style PDF', actionLabel: 'Create scanned PDF', needsPdf: true, needsPdfLib: true, downloadExt: 'pdf' }),
      tool('number-to-roman', 'Number to Roman Numerals', 'Convert whole numbers from 1 to 3,999,999 into Roman numerals.', [text('number', 'Number', '2026')], { inputTitle: 'Number', outputTitle: 'Roman numeral', actionLabel: 'Convert number', autoRun: true, downloadExt: 'txt' }),
      tool('binary-translator', 'Binary Translator', 'Translate text to binary or binary back to text using UTF-8.', [select('mode', 'Mode', 'encode', [['encode', 'Text to binary'], ['decode', 'Binary to text']]), area('input', 'Input', 'Hello ReelFlow', { rows: 5 })], { inputTitle: 'Text or binary', outputTitle: 'Binary translation', actionLabel: 'Translate binary', downloadExt: 'txt' }),
      tool('avif-to-png', 'AVIF to PNG Converter', 'Decode AVIF images in your browser and download a lossless PNG.', [file('image', 'AVIF image', 'image/avif,.avif')], { inputTitle: 'AVIF image', outputTitle: 'PNG image', actionLabel: 'Convert to PNG', downloadExt: 'png' })
    ]
  },
  {
    name: 'Misc',
    icon: 'clock',
    related: ['character-counter', 'title-preview', 'qr-code-generator'],
    tools: [
      tool('calendar-link-generator', 'Add to Calendar Link Generator', 'Create Google Calendar, Outlook and Yahoo links plus a downloadable ICS file.', [text('title', 'Event title', 'Team meeting'), f('start', 'Starts', 'datetime-local'), f('end', 'Ends', 'datetime-local'), text('location', 'Location', ''), area('description', 'Description', '', { rows: 3 })], { inputTitle: 'Event details', outputTitle: 'Calendar links', actionLabel: 'Generate calendar links', downloadExt: 'ics' }),
      tool('spin-the-wheel', 'Spin the Wheel', 'Add choices to a colourful wheel and spin for a random result.', [area('items', 'Wheel choices', 'Option A\nOption B\nOption C\nOption D\nOption E\nOption F', { rows: 7 })], { inputTitle: 'Wheel choices', outputTitle: 'Wheel', actionLabel: 'Spin the wheel', autoRun: true, interactive: 'wheel', disableCopy: true, downloadExt: 'txt' }),
      tool('name-wheel', 'Name Wheel', 'Pick a random name from a list with an interactive spinning wheel.', [area('items', 'Names', 'Ayesha\nBilal\nChen\nDaniyal\nEmma\nFarah', { rows: 7 })], { inputTitle: 'Names', outputTitle: 'Name wheel', actionLabel: 'Spin names', autoRun: true, interactive: 'wheel', disableCopy: true, downloadExt: 'txt' }),
      tool('yes-no-wheel', 'Yes or No Wheel', 'Let a simple yes/no wheel make a decision.', [], { inputTitle: 'Decision wheel', outputTitle: 'Yes or no wheel', actionLabel: 'Spin the wheel', autoRun: true, interactive: 'wheel', disableCopy: true, downloadExt: 'txt', wheelItems: ['Yes', 'No'] }),
      tool('random-number-wheel', 'Random Number Wheel', 'Spin a wheel to pick a random number inside your chosen range.', [num('min', 'Minimum', 1, -1000000, 1000000), num('max', 'Maximum', 100, -1000000, 1000000)], { inputTitle: 'Number range', outputTitle: 'Number wheel', actionLabel: 'Spin numbers', autoRun: true, interactive: 'number-wheel', disableCopy: true, downloadExt: 'txt' }),
      tool('cross-sum-calculator', 'Cross Sum Calculator', 'Calculate the digit sum and digital root of any whole number.', [text('number', 'Number', '987654')], { inputTitle: 'Number', outputTitle: 'Cross sum', actionLabel: 'Calculate cross sum', autoRun: true, downloadExt: 'txt' }),
      tool('vanity-number-calculator', 'Vanity Number Calculator', 'Find memorable phone words from a number using the standard keypad mapping.', [text('number', 'Phone number', '800FLOWERS'), num('results', 'Maximum results', 20, 1, 100)], { inputTitle: 'Number or phone word', outputTitle: 'Vanity number ideas', actionLabel: 'Find vanity words', downloadExt: 'txt' }),
      tool('date-countdown', 'Date Countdown Calculator', 'Count down to an important date with a live days, hours, minutes and seconds display.', [f('target', 'Target date and time', 'datetime-local')], { inputTitle: 'Target date', outputTitle: 'Live countdown', actionLabel: 'Start countdown', autoRun: true, interactive: 'countdown', disableCopy: true, downloadExt: 'txt' }),
      tool('date-range-calculator', 'Date Range Calculator', 'Calculate the number of days, weeks and weekends between two dates.', [f('start', 'Start date', 'date'), f('end', 'End date', 'date')], { inputTitle: 'Date range', outputTitle: 'Range summary', actionLabel: 'Calculate range', autoRun: true, downloadExt: 'txt' }),
      tool('work-hours-calculator', 'Work Hours Calculator', 'Calculate paid work hours after breaks and show the total in decimal hours.', [f('start', 'Start time', 'time', { value: '09:00' }), f('end', 'End time', 'time', { value: '17:30' }), num('breakMinutes', 'Unpaid break (minutes)', 30, 0, 720), num('rate', 'Hourly rate (optional)', 0, 0, 10000, 0.01)], { inputTitle: 'Work schedule', outputTitle: 'Work hours', actionLabel: 'Calculate hours', autoRun: true, downloadExt: 'txt' }),
      tool('click-counter', 'Click Counter', 'Count clicks with a large button, keyboard support and local saving.', [], { inputTitle: 'Click counter', outputTitle: 'Counter', actionLabel: 'Open counter', autoRun: true, interactive: 'click-counter', disableCopy: true, downloadExt: 'txt' }),
      tool('analog-clock', 'Interactive Analog Clock', 'A clean live analog clock with local time and a digital readout.', [], { inputTitle: 'Clock', outputTitle: 'Live clock', actionLabel: 'Open clock', autoRun: true, interactive: 'clock', disableCopy: true, disableDownload: true }),
      tool('habit-tracker', 'Habit Tracker and Streak Counter', 'Track daily habits for the week and keep streaks saved in your browser.', [area('habits', 'Habits (one per line)', 'Read 20 minutes\nExercise\nDrink water', { rows: 4 })], { inputTitle: 'Your habits', outputTitle: 'Weekly habit tracker', actionLabel: 'Save and track', autoRun: true, interactive: 'habits', disableCopy: true, downloadExt: 'txt' }),
      tool('checklist-manager', 'Checklist Creator and Manager', 'Create, complete and organise a checklist that saves automatically in your browser.', [area('items', 'Checklist items (one per line)', 'Plan the week\nBuy groceries\nFinish project', { rows: 6 })], { inputTitle: 'Checklist items', outputTitle: 'Saved checklist', actionLabel: 'Save checklist', autoRun: true, interactive: 'checklist', disableCopy: true, downloadExt: 'txt' }),
      tool('white-screen', 'White Screen', 'Open a full-screen white display for testing, lighting or presentations.', [], { inputTitle: 'White screen', outputTitle: 'Display test', actionLabel: 'Open white screen', interactive: 'screen', disableCopy: true, disableDownload: true, screenColor: '#ffffff' }),
      tool('black-screen', 'Black Screen', 'Open a full-screen black display for testing, lighting or presentations.', [], { inputTitle: 'Black screen', outputTitle: 'Display test', actionLabel: 'Open black screen', interactive: 'screen', disableCopy: true, disableDownload: true, screenColor: '#000000' }),
      tool('dead-pixel-test', 'Dead Pixel Test', 'Cycle through solid colours to find stuck or dead pixels on your display.', [], { inputTitle: 'Display test', outputTitle: 'Colour cycle', actionLabel: 'Start pixel test', interactive: 'screen', disableCopy: true, disableDownload: true, screenColor: '#ff0000' }),
      tool('flip-a-coin', 'Flip a Coin', 'Flip a virtual coin for a quick heads-or-tails decision.', [], { inputTitle: 'Coin', outputTitle: 'Coin flip', actionLabel: 'Flip coin', interactive: 'coin', disableCopy: true, downloadExt: 'txt' }),
      tool('secret-santa', 'Secret Santa Generator', 'Create random Secret Santa assignments while avoiding excluded pairs.', [area('names', 'Participants (one per line)', 'Ayesha\nBilal\nChen\nDaniyal\nEmma\nFarah', { rows: 7 }), area('exclusions', 'Excluded pairs (one per line)', 'Ayesha, Bilal\nChen, Daniyal', { rows: 3 })], { inputTitle: 'Participants and exclusions', outputTitle: 'Secret Santa assignments', actionLabel: 'Generate assignments', downloadExt: 'txt' }),
      tool('minecraft-circle-generator', 'Minecraft Circle Generator', 'Generate a pixel-perfect Minecraft circle template with block coordinates.', [num('diameter', 'Diameter', 21, 3, 201), check('filled', 'Filled circle', true), select('plane', 'Plane', 'flat', [['flat', 'Flat ground'], ['vertical', 'Vertical wall']])], { inputTitle: 'Circle settings', outputTitle: 'Circle template', actionLabel: 'Generate circle', autoRun: true, downloadExt: 'png' }),
      tool('pictionary-words', 'Pictionary Word Generator', 'Generate drawing prompts by category and difficulty.', [select('category', 'Category', 'all', [['all', 'All'], ['animals', 'Animals'], ['objects', 'Objects'], ['food', 'Food'], ['places', 'Places'], ['actions', 'Actions']]), select('difficulty', 'Difficulty', 'easy', [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']]), num('count', 'How many', 12, 1, 100)], { inputTitle: 'Prompt settings', outputTitle: 'Pictionary words', actionLabel: 'Generate words', downloadExt: 'txt' }),
      tool('charades-generator', 'Charades Generator', 'Get random charades prompts for parties, classrooms and team games.', [select('category', 'Category', 'all', [['all', 'All'], ['movies', 'Movies'], ['animals', 'Animals'], ['actions', 'Actions'], ['objects', 'Objects'], ['food', 'Food']]), num('count', 'How many', 12, 1, 100)], { inputTitle: 'Charades settings', outputTitle: 'Charades prompts', actionLabel: 'Generate prompts', downloadExt: 'txt' }),
      tool('random-animal', 'Random Animal Generator', 'Discover random animals with a short fact about each one.', [num('count', 'How many', 8, 1, 100)], { inputTitle: 'Animal settings', outputTitle: 'Random animals', actionLabel: 'Generate animals', downloadExt: 'txt' }),
      tool('random-country', 'Random Country Generator', 'Pick random countries with their capital, region and official language.', [num('count', 'How many', 8, 1, 100), check('unique', 'No duplicates', true)], { inputTitle: 'Country settings', outputTitle: 'Random countries', actionLabel: 'Generate countries', downloadExt: 'txt' }),
      tool('random-object', 'Random Object Generator', 'Generate random everyday objects for drawing, games and creative prompts.', [num('count', 'How many', 12, 1, 100)], { inputTitle: 'Object settings', outputTitle: 'Random objects', actionLabel: 'Generate objects', downloadExt: 'txt' }),
      tool('random-team-generator', 'Random Team Generator', 'Split a list of players into balanced teams with optional team names.', [area('players', 'Players (one per line)', 'Ayesha\nBilal\nChen\nDaniyal\nEmma\nFarah\nGeorge\nHina', { rows: 8 }), num('teams', 'Number of teams', 2, 2, 20), check('teamNames', 'Add team names', true)], { inputTitle: 'Players and teams', outputTitle: 'Random teams', actionLabel: 'Create teams', downloadExt: 'txt' })
    ]
  }
];

const categoryIcons = {
  Tailwind: 'code', Developer: 'code', Image: 'crop', Mail: 'link', Text: 'text',
  'Video & Audio': 'film', Converters: 'swap', Misc: 'clock'
};
const tones = ['', 'mint', 'amber', 'rose'];
const readJson = (rel, fallback) => {
  const p = path.join(root, rel);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback;
};
const writeJson = (rel, data) => fs.writeFileSync(path.join(root, rel), JSON.stringify(data, null, 2) + '\n');
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const numberWords = (n) => {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const below1000 = (v) => {
    let out = '';
    if (v >= 100) { out += ones[Math.floor(v / 100)] + ' hundred'; v %= 100; if (v) out += ' '; }
    if (v >= 20) { out += tens[Math.floor(v / 10)]; if (v % 10) out += '-' + ones[v % 10]; }
    else if (v > 0) out += ones[v];
    return out;
  };
  if (n < 1000) return below1000(n);
  if (n < 1000000) return below1000(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + below1000(n % 1000) : '');
  return below1000(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + numberWords(n % 1000000) : '');
};
const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

const all = categories.flatMap((category) => category.tools.map((definition, index) => ({
  ...definition,
  category: category.name,
  icon: definition.icon || category.icon,
  tone: definition.tone || tones[index % tones.length],
  related: definition.related || category.related
})));
const bySlug = new Map(all.map((definition) => [definition.slug, definition]));
const args = process.argv.slice(2);
const requested = args.includes('--all') ? all.map((d) => d.slug) : args.filter((a) => !a.startsWith('--'));
if (!requested.length) {
  console.error('Usage: node scripts/generate-utility-tools.mjs <slug> [slug...] | --all');
  process.exit(1);
}
const unknown = requested.filter((slug) => !bySlug.has(slug));
if (unknown.length) {
  console.error('Unknown tool slug(s): ' + unknown.join(', '));
  process.exit(1);
}

const toolsData = readJson('src/_data/tools.json', { tools: [] });
const utilityPath = 'src/_data/utilityTools.json';
const utilities = readJson(utilityPath, {});
const cmsPath = path.join(root, '.pages.yml');
let cms = fs.readFileSync(cmsPath, 'utf8');
const generated = [];

for (const slug of requested) {
  const d = bySlug.get(slug);
  const utility = {
    engine: 'utility',
    operation: d.operation || slug,
    autoRun: !!d.autoRun,
    fields: d.fields,
    actionLabel: d.actionLabel || 'Generate',
    inputTitle: d.inputTitle || 'Options',
    inputHint: d.inputHint || 'Runs in your browser',
    outputTitle: d.outputTitle || 'Result',
    placeholder: d.placeholder || 'Your result will appear here.',
    emptyText: d.emptyText || 'Add your input to see the result.',
    note: d.note || '',
    outputNote: d.outputNote || '',
    downloadExt: d.downloadExt || 'txt',
    disableDownload: !!d.disableDownload,
    disableCopy: !!d.disableCopy,
    interactive: d.interactive || '',
    wheelItems: d.wheelItems || [],
    screenColor: d.screenColor || '',
    needsGif: !!d.needsGif,
    needsPdf: !!d.needsPdf,
    needsPdfLib: !!d.needsPdfLib,
    needsWords: !!d.needsWords
  };
  utilities[slug] = utility;

  const pageSrc = `---\nlayout: layouts/base.njk\ncontentKey: ${slug}\nldType: tool\ncontentType: tool\npermalink: /${slug}/\nsitemap: true\nmainClass: wrap\npageScript: tools/utility.js\n---\n{% include "partials/utility-tool.njk" %}\n`;
  fs.writeFileSync(path.join(root, 'src', slug + '.njk'), pageSrc);

  const contentPath = path.join(root, 'src/_data/toolpages', slug + '.json');
  if (!fs.existsSync(contentPath)) {
    const availableRelated = d.related.filter((rel) => rel !== slug && (requested.includes(rel) || fs.existsSync(path.join(root, 'src', rel + '.njk'))));
    const relatedSlugs = [...new Set([...availableRelated, ...toolsData.tools.map((entry) => entry.slug)])].filter((rel) => rel !== slug).slice(0, 3);
    const related = relatedSlugs.map((rel, i) => ({
      slug: rel,
      letter: (bySlug.get(rel)?.name || rel).charAt(0).toUpperCase(),
      tone: tones[i % tones.length],
      note: bySlug.has(rel) ? bySlug.get(rel).category + ' tool' : 'Related browser tool'
    }));
    writeJson('src/_data/toolpages/' + slug + '.json', {
      metaTitle: d.name + ' - ReelFlow Toolkit',
      description: d.desc,
      ogTitle: d.name,
      ogDescription: d.desc,
      ldDescription: d.desc,
      breadcrumb: d.name,
      kicker: d.category + ' tool',
      h1: d.name,
      lede: d.desc,
      faq: [
        { q: 'Is ' + d.name + ' free?', a: 'Yes. It runs entirely in your browser with no account, upload or usage limit.' },
        { q: 'Are my files or text uploaded?', a: 'No. Processing happens locally on your device using browser APIs.' }
      ],
      related
    });
  }

  if (!toolsData.tools.some((entry) => entry.slug === slug)) {
    toolsData.tools.push({
      slug,
      url: '/' + slug + '/',
      name: d.name,
      footerName: d.name,
      desc: d.desc,
      tags: [d.category, 'No upload', 'Browser-based'],
      icon: d.icon,
      tone: d.tone
    });
  }

  if (!cms.includes('path: src/_data/toolpages/' + slug + '.json')) {
    cms += `\n  - name: page-${slug}\n    label: "Tool page: ${d.name.replace(/"/g, '\\"')}"\n    type: file\n    path: src/_data/toolpages/${slug}.json\n    fields:\n      - name: metaTitle\n        label: Browser title\n        type: string\n      - name: description\n        label: Meta description\n        type: text\n      - name: ogTitle\n        label: Social share title\n        type: string\n      - name: ogDescription\n        label: Social share description\n        type: text\n      - name: ldDescription\n        label: Structured data description\n        type: text\n      - name: breadcrumb\n        label: Breadcrumb label\n        type: string\n      - name: kicker\n        label: Kicker\n        type: string\n      - name: h1\n        label: Page heading\n        type: string\n      - name: lede\n        label: Intro paragraph\n        type: text\n      - name: faq\n        label: FAQ items\n        type: object\n        list: true\n        fields:\n          - name: q\n            label: Question\n            type: string\n          - name: a\n            label: Answer\n            type: text\n      - name: related\n        label: Next tools\n        type: object\n        list: true\n        fields:\n          - name: slug\n            label: Tool slug\n            type: string\n          - name: letter\n            label: Letter tile\n            type: string\n          - name: tone\n            label: Tile colour\n            type: select\n            options:\n              values:\n                - name: ""\n                  label: Blue (default)\n                - name: mint\n                  label: Mint\n                - name: amber\n                  label: Amber\n                - name: rose\n                  label: Rose\n          - name: note\n            label: Note\n            type: string\n`;
  }
  generated.push(slug);
}

writeJson('src/_data/tools.json', toolsData);
writeJson(utilityPath, utilities);
fs.writeFileSync(cmsPath, cms);
const count = toolsData.tools.length;
const site = readJson('src/_data/site.json', {});
site.badges = site.badges || {};
site.badges.tools = count + ' free tools';
writeJson('src/_data/site.json', site);
const home = readJson('src/_data/home.json', {});
home.ogDescription = home.ogDescription.replace(/(?:twenty-six|\d+) free tools/i, count + ' free tools');
home.toolsTitle = titleCase(numberWords(count)) + ' tools to start';
writeJson('src/_data/home.json', home);

console.log('Generated ' + generated.length + ' tool(s): ' + generated.join(', '));
console.log('Toolkit total: ' + count);
