import {
  operations, $, $$, clamp, randomInt, pick, escapeHtml, shuffle, textResult, htmlResult
} from './core.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

operations['utf8-encoder-decoder'] = (v) => {
  if (!v.input) throw new Error('Enter some text first.');
  if (v.mode === 'encode') return textResult(Array.from(encoder.encode(v.input)).join(' '));
  const bytes = v.input.trim().split(/[\s,]+/).filter(Boolean).map(Number);
  if (!bytes.length || bytes.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) throw new Error('Enter UTF-8 byte values between 0 and 255.');
  return textResult(decoder.decode(new Uint8Array(bytes)));
};

operations['utf8-byte-counter'] = (v) => {
  const bytes = encoder.encode(v.text).length;
  const chars = Array.from(v.text).length;
  const words = v.text.trim() ? v.text.trim().split(/\s+/).length : 0;
  return textResult(`UTF-8 bytes: ${bytes}\nUnicode characters: ${chars}\nJavaScript UTF-16 units: ${v.text.length}\nWords: ${words}`);
};

operations['add-text-to-lines'] = (v) => {
  const lines = v.text.replace(/\r/g, '').split('\n');
  return textResult(lines.map((line, index) => `${v.numberLines ? `${index + 1}. ` : ''}${v.prefix}${line}${v.suffix}`).join('\n'));
};

operations['filter-lines'] = (v) => {
  const lines = v.text.replace(/\r/g, '').split('\n');
  let regex = null;
  if (v.mode === 'regex') { try { regex = new RegExp(v.query, 'i'); } catch (error) { throw new Error('The regular expression is not valid.'); } }
  const seen = new Set();
  const output = lines.filter((line) => {
    let match = true;
    if (v.mode === 'contains') match = line.toLowerCase().includes(v.query.toLowerCase());
    else if (v.mode === 'starts') match = line.toLowerCase().startsWith(v.query.toLowerCase());
    else if (v.mode === 'ends') match = line.toLowerCase().endsWith(v.query.toLowerCase());
    else if (v.mode === 'regex') match = regex.test(line);
    else if (v.mode === 'unique') { const key = line.toLowerCase(); if (seen.has(key)) match = false; else seen.add(key); }
    return v.invert ? !match : match;
  });
  return textResult(output.join('\n'));
};

operations['repeat-text'] = (v) => textResult(Array.from({ length: v.count }, () => v.text).join(v.separator));

operations['simple-text-editor'] = (v) => {
  const text = v.text;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).length : 0;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
  const reading = Math.max(1, Math.ceil(words / 200));
  return textResult(`Words: ${words}\nCharacters: ${text.length}\nCharacters without spaces: ${text.replace(/\s/g, '').length}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nReading time: ${reading} min\nUTF-8 bytes: ${encoder.encode(text).length}`);
};

const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

function underThousand(number) {
  const parts = [];
  if (number >= 100) { parts.push(ones[Math.floor(number / 100)] + ' hundred'); number %= 100; }
  if (number >= 20) { parts.push(tens[Math.floor(number / 10)] + (number % 10 ? '-' + ones[number % 10] : '')); }
  else if (number > 0) parts.push(ones[number]);
  return parts.join(' ');
}

function integerWords(number) {
  if (number === 0) return 'zero';
  const groups = [];
  let n = number;
  while (n > 0) { groups.push(n % 1000); n = Math.floor(n / 1000); }
  return groups.map((group, index) => group ? underThousand(group) + (scales[index] ? ' ' + scales[index] : '') : '').filter(Boolean).reverse().join(' ');
}

operations['number-to-words'] = (v) => {
  const cleaned = String(v.number).replace(/,/g, '').trim();
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) throw new Error('Enter a valid number with up to two decimal places.');
  const negative = cleaned.startsWith('-');
  const [whole, fraction] = cleaned.replace('-', '').split('.');
  const number = Number(whole);
  if (number > 999999999999999) throw new Error('That number is too large.');
  let output = (negative ? 'negative ' : '') + integerWords(number);
  if (fraction) output += ' point ' + fraction.split('').map((digit) => ones[+digit]).join(' ');
  if (v.style === 'currency') output = integerWords(number) + ' dollars' + (fraction ? ' and ' + integerWords(Number(fraction).toString().padStart(2, '0')) + ' cents' : '');
  return textResult(output);
};

operations['markdown-editor'] = (v) => {
  if (!v.markdown.trim()) return htmlResult('<p class="mini">Start writing Markdown to see a preview.</p>', { copyText: '' });
  const html = window.CT_VENDOR.marked.parse(v.markdown, { breaks: true, gfm: true });
  const clean = window.CT_VENDOR.DOMPurify.sanitize(html);
  if (v.view === 'html') return textResult(clean);
  if (v.view === 'markdown') return textResult(v.markdown);
  return { html: `<div class="preview-frame post-content">${clean}</div>`, copyText: clean, blob: new Blob([`<!doctype html><meta charset="utf-8"><title>Markdown export</title>${clean}`], { type: 'text/html' }), filename: 'markdown-export.html' };
};

operations['random-letter-generator'] = (v) => {
  const vowels = 'aeiou', consonants = 'bcdfghjklmnpqrstvwxyz';
  const pool = v.vowelsOnly ? vowels : vowels + consonants;
  const output = Array.from({ length: v.count }, () => {
    const letter = pool[randomInt(0, pool.length - 1)];
    return v.case === 'upper' ? letter.toUpperCase() : v.case === 'mixed' && Math.random() > .5 ? letter.toUpperCase() : letter;
  }).join('');
  return textResult(output);
};

const emojiSets = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😎', '🤩', '🥳'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐝', '🦋', '🐢', '🐬'],
  food: ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥭', '🍉', '🍕', '🍔', '🍟', '🌮', '🍣', '🍩', '🍪', '🎂', '🍫', '🍿', '🥑'],
  nature: ['🌵', '🌲', '🌳', '🌴', '🌱', '🌿', '🍀', '🍁', '🌷', '🌹', '🌻', '🌈', '☀️', '🌙', '⭐', '🔥', '❄️', '🌊', '🌍', '🌌'],
  objects: ['📱', '💻', '⌚', '📷', '🎧', '🎮', '🚗', '✈️', '🚀', '🏠', '🔑', '💡', '📚', '✏️', '🎨', '🎸', '⚽', '🏀', '🎯', '🎁'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '✨', '⚡', '♻️', '✅', '❌', '⚠️', '💯', '🔥', '🎉', '🎊', '💫', '🌟']
};
const allEmoji = Object.values(emojiSets).flat();

operations['random-emoji-generator'] = (v) => {
  const pool = v.category === 'all' ? allEmoji : emojiSets[v.category] || allEmoji;
  return textResult(Array.from({ length: v.count }, () => pick(pool)).join(' '));
};

operations['list-randomizer'] = (v) => {
  const items = v.items.replace(/\r/g, '').split('\n').map((s) => s.trim()).filter(Boolean);
  if (!items.length) throw new Error('Add some list items first.');
  if (v.mode === 'shuffle') return textResult(shuffle(items).join('\n'));
  if (v.unique) return textResult(shuffle(items).slice(0, Math.min(v.count, items.length)).join('\n'));
  return textResult(Array.from({ length: v.count }, () => pick(items)).join('\n'));
};

operations['random-group-generator'] = (v) => {
  const items = shuffle(v.items.replace(/\r/g, '').split('\n').map((s) => s.trim()).filter(Boolean));
  if (!items.length) throw new Error('Add some names first.');
  const groups = Array.from({ length: Math.min(v.groups, items.length) }, (_, i) => ({ name: `Group ${i + 1}`, items: [] }));
  items.forEach((item, index) => groups[index % groups.length].items.push(item));
  return textResult(groups.map((group) => `${group.name}:\n${group.items.map((item) => '  ' + item).join('\n')}`).join('\n\n'));
};

operations['random-word-generator'] = (v) => {
  const words = window.CT_WORDS || [];
  const pool = words.filter((word) => word.length >= v.minLength && word.length <= v.maxLength);
  if (!pool.length) throw new Error('No words match that length range.');
  return textResult(Array.from({ length: v.count }, () => pick(pool)).join(' '));
};

function combining(intensity, sets) {
  const count = Math.max(0, Math.round(intensity / 100 * sets.reduce((sum, set) => sum + set.length, 0)));
  let output = '';
  for (let i = 0; i < count; i++) output += pick(pick(sets));
  return output;
}

operations['zalgo-text-generator'] = (v) => {
  const up = Array.from('̀́̂̃̄̅̿͂͛͑ͣͬͭͧͨͩͪͫͬͭͮͯ̚͢');
  const middle = Array.from('͒͑͂͗́̕̚͘');
  const down = Array.from('̖̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎͏͇͈͉͍͎ͅ͏');
  const output = Array.from(v.text).map((char) => char + (v.up ? combining(v.intensity, [up]) : '') + (v.middle ? combining(Math.round(v.intensity * .45), [middle]) : '') + (v.down ? combining(v.intensity, [down]) : '')).join('');
  return textResult(output);
};

operations['cursed-text-generator'] = (v) => {
  const marks = Array.from('̸̷̶̵̴̳̲̱̰̹̺̻̼͇͈͉͍͎͏҈');
  const output = Array.from(v.text).map((char) => char + combining(v.intensity, [marks])).join('');
  return textResult(output);
};

const glitchMap = { A: 'ĄΔДλ', B: 'ßβƁ', C: 'ÇĆ¢', D: 'ĐĎ', E: 'Ę€É', F: 'Ƒ', G: 'ĞǤ', H: 'Ħ', I: 'ÌÍĮ', J: 'Ĵ', K: 'Ķ', L: 'Ł', M: 'Ϻ', N: 'Ň', O: 'ØŌ', P: 'ρ', Q: 'Q', R: 'Ř', S: '$§', T: 'Ŧ', U: 'Ŭ', V: 'V', W: 'Ŵ', X: 'X', Y: 'Ŷ', Z: 'Ż' };
operations['glitch-text-generator'] = (v) => {
  const output = Array.from(v.text).map((char) => {
    const options = glitchMap[char.toUpperCase()];
    return options && Math.random() < v.intensity / 100 ? pick(Array.from(options)) : char;
  }).join('');
  return textResult(output);
};

operations['duplicate-word-finder'] = (v) => {
  const words = v.text.match(/[\p{L}\p{N}]+/gu) || [];
  const counts = new Map();
  for (const word of words) {
    const key = v.caseSensitive ? word : word.toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const duplicates = Array.from(counts.entries()).filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
  if (!duplicates.length) return textResult('No duplicate words found.');
  return textResult(duplicates.map(([word, count]) => `${word}: ${count}`).join('\n'));
};

const morse = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.' };
const reverseMorse = Object.fromEntries(Object.entries(morse).map(([key, value]) => [value, key]));
operations['morse-code-translator'] = (v) => {
  if (!v.input.trim()) throw new Error('Enter some text or Morse code first.');
  if (v.mode === 'encode') {
    return textResult(v.input.toUpperCase().split('').map((char) => char === ' ' ? '/' : morse[char] || '').filter(Boolean).join(' '));
  }
  return textResult(v.input.trim().split(/\s*\/\s*|\s{3,}/).map((word) => word.trim().split(/\s+/).map((code) => reverseMorse[code] || '?').join('')).join(' '));
};

operations['morse-code-practice'] = (v) => {
  const pools = { easy: ['SOS', 'HELLO', 'WATER', 'LIGHT', 'WORLD', 'BRAVE', 'SMILE', 'DREAM'], medium: ['REELFLOW', 'TOOLKIT', 'CREATE', 'BROWSER', 'CAMERA', 'PUZZLE42'], hard: ['QWERTY', 'JINXED', 'VORTEX', 'ZEPHYR', 'QUIZ99', 'MYSTIC7'] };
  const pool = pools[v.level];
  const word = pick(pool);
  const html = `<div class="utility-list" style="place-items:center;text-align:center"><div class="stat-big" data-morse-word>${word}</div><div class="utility-code" data-morse-code>••• •••• ••••</div><div class="split-actions"><button class="btn btn-ghost" data-morse-reveal type="button">Reveal Morse</button><button class="btn btn-ghost" data-morse-play type="button">Play sound</button><button class="btn btn-primary" data-morse-next type="button">Next word</button></div></div>`;
  return { html, interactive: 'morse-practice', word, pool, morseFor: (value) => value.split('').map((char) => morse[char] || '').join(' '), copyText: word };
};

operations['acronym-generator'] = (v) => {
  const input = v.input.trim();
  if (!input) throw new Error('Enter a phrase or acronym.');
  if (v.mode === 'generate') {
    const words = input.split(/\s+/).filter(Boolean);
    const acronym = words.map((word) => word.replace(/[^a-z0-9]/gi, '').charAt(0)).join('').toUpperCase();
    const readable = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    return textResult(`${acronym}\n\n${readable}\n\n${acronym.split('').join(' · ')}`);
  }
  const letters = input.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const banks = {
    A: ['Amazing', 'Awesome', 'Artistic'], B: ['Bright', 'Brave', 'Balanced'], C: ['Creative', 'Clever', 'Curious'], D: ['Dynamic', 'Dream', 'Digital'], E: ['Excellent', 'Energetic', 'Easy'], F: ['Fantastic', 'Friendly', 'Free'], G: ['Great', 'Genius', 'Global'], H: ['Happy', 'Helpful', 'Heroic'], I: ['Innovative', 'Inspired', 'Incredible'], J: ['Joyful', 'Just', 'Jump'], K: ['Kind', 'Keen', 'Knowledge'], L: ['Lively', 'Lucky', 'Legendary'], M: ['Mighty', 'Mindful', 'Magic'], N: ['New', 'Noble', 'Natural'], O: ['Optimistic', 'Open', 'Original'], P: ['Powerful', 'Positive', 'Perfect'], Q: ['Quick', 'Quality', 'Quest'], R: ['Remarkable', 'Radiant', 'Ready'], S: ['Smart', 'Strong', 'Simple'], T: ['Talented', 'Trusted', 'Thriving'], U: ['Unique', 'United', 'Useful'], V: ['Vibrant', 'Valiant', 'Vivid'], W: ['Wise', 'Wonderful', 'Wild'], X: ['Xtra', 'Xenial'], Y: ['Young', 'Yes', 'Yield'], Z: ['Zesty', 'Zealous', 'Zen']
  };
  const ideas = Array.from({ length: 12 }, () => letters.map((letter) => pick(banks[letter] || [letter])).join(' '));
  return textResult(Array.from(new Set(ideas)).join('\n'));
};

operations['spelling-bee-solver'] = (v) => {
  const letters = v.letters.toLowerCase().replace(/[^a-z]/g, '').split('');
  const required = v.required.toLowerCase().replace(/[^a-z]/g, '').charAt(0);
  if (letters.length < 4 || new Set(letters).size < 4) throw new Error('Enter at least four different letters.');
  if (required && !letters.includes(required)) throw new Error('The required letter must be one of the puzzle letters.');
  const allowed = new Set(letters);
  const words = (window.CT_WORDS || []).filter((word) => word.length >= 4 && (!required || word.includes(required)) && Array.from(word).every((letter) => allowed.has(letter))).sort((a, b) => a.length - b.length || a.localeCompare(b));
  if (!words.length) return textResult('No words found in the built-in dictionary.');
  return textResult(`${words.length} words found\n\n${words.join('\n')}`);
};

const wingdings = '✁✂✃✄☎✆✇✈✉☛☞✌✍✎✏✐✑✒✓✔✕✖✗✘✙✚✛✜✝✞✟✠✡✢✣✤✥✦✧★✩✪✫✬✭✮✯✰✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋●❍■❏❐❑❒▲▼◆❖◗❘❙❚❛❜❝❞';
operations['wingdings-translator'] = (v) => {
  const symbols = Array.from(wingdings);
  if (v.mode === 'encode') return textResult(Array.from(v.input.toUpperCase()).map((char) => {
    const code = char.charCodeAt(0);
    return code >= 33 && code <= 126 ? symbols[code - 33] || char : char;
  }).join(''));
  return textResult(Array.from(v.input).map((char) => {
    const index = symbols.indexOf(char);
    return index >= 0 ? String.fromCharCode(index + 33) : char;
  }).join(''));
};

operations['invisible-character-generator'] = (v) => {
  const chars = { 'zero-width': '\u200B', 'zero-width-nonjoiner': '\u200C', 'word-joiner': '\u2060', 'hair-space': '\u200A', 'thin-space': '\u2009' };
  const mark = chars[v.type];
  const text = v.position === 'between' ? Array.from(v.text).join(mark) : v.position === 'start' ? mark + v.text : v.position === 'end' ? v.text + mark : mark + v.text + mark;
  return textResult(text);
};

const superscript = { a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'ᑫ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ' };
const subscript = { a: 'ₐ', b: 'b', c: 'c', d: 'd', e: 'ₑ', f: 'f', g: 'g', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', q: 'q', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', w: 'w', x: 'ₓ', y: 'y', z: 'z' };
const fullwidth = (char) => char.charCodeAt(0) >= 33 && char.charCodeAt(0) <= 126 ? String.fromCharCode(char.charCodeAt(0) + 0xFEE0) : char;
operations['small-text-generator'] = (v) => {
  const map = v.style === 'subscript' ? subscript : superscript;
  const output = Array.from(v.style === 'fullwidth' ? v.text : v.text.toLowerCase()).map((char) => v.style === 'fullwidth' ? fullwidth(char) : map[char] || char).join('');
  return textResult(output);
};

const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const mapLetters = (letters, chars) => Object.fromEntries(Array.from(letters).map((letter, index) => [letter, Array.from(chars)[index]]));
const rangeMap = (letters, start) => Object.fromEntries(Array.from(letters).map((letter, index) => [letter, String.fromCodePoint(start + index)]));
const scriptUpper = mapLetters(uppercaseLetters, '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵');
const scriptLower = mapLetters(lowercaseLetters, '𝒶𝒷𝒸𝒹ℯ𝒻ℊℏ𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏');
const boldUpper = rangeMap(uppercaseLetters, 0x1D4D0);
const boldLower = rangeMap(lowercaseLetters, 0x1D4EA);
const italicUpper = rangeMap(uppercaseLetters, 0x1D434);
const italicLower = mapLetters(lowercaseLetters, '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧');
operations['cursive-text-generator'] = (v) => {
  const upper = v.style === 'italic' ? italicUpper : v.style === 'bold-script' ? boldUpper : scriptUpper;
  const lower = v.style === 'italic' ? italicLower : v.style === 'bold-script' ? boldLower : scriptLower;
  return textResult(Array.from(v.text).map((char) => upper[char] || lower[char.toLowerCase()] || char).join(''));
};

const upsideMap = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', '.': '˙', '?': '¿', '!': '¡', "'": ',', '"': '„', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾' };
operations['upside-down-text'] = (v) => textResult(Array.from(v.text).reverse().map((char) => upsideMap[char.toLowerCase()] || char).join(''));

operations['strikethrough-text'] = (v) => textResult(Array.from(v.text).map((char) => char + (v.style === 'double' ? '\u0336\u0335' : '\u0336')).join(''));
