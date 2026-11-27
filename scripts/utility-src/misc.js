import {
  operations, $, $$, clamp, randomInt, pick, escapeHtml, shuffle, canvasResult,
  textResult, htmlResult, blobResult
} from './core.js';

const lines = (value) => String(value || '').replace(/\r/g, '').split('\n').map((s) => s.trim()).filter(Boolean);
const drawFromPool = (pool, count, unique = false) => {
  if (!pool.length) throw new Error('No prompts match those filters.');
  if (unique) return shuffle(pool).slice(0, Math.min(count, pool.length));
  const output = [];
  while (output.length < count) output.push(...shuffle(pool));
  return output.slice(0, count);
};
const pad = (n) => String(n).padStart(2, '0');
const icsEscape = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

operations['calendar-link-generator'] = (v) => {
  if (!v.title.trim()) throw new Error('Enter an event title.');
  if (!v.start) throw new Error('Choose a start date and time.');
  const start = new Date(v.start);
  let end = v.end ? new Date(v.end) : new Date(start.getTime() + 3600000);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error('Choose valid event dates.');
  if (end <= start) end = new Date(start.getTime() + 3600000);
  const utc = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dates = `${utc(start)}/${utc(end)}`;
  const query = new URLSearchParams({ action: 'TEMPLATE', text: v.title, dates, details: v.description, location: v.location });
  const google = 'https://calendar.google.com/calendar/render?' + query.toString();
  const outlook = 'https://outlook.live.com/calendar/0/deeplink/compose?' + new URLSearchParams({ path: '/calendar/action/compose', rru: 'addevent', subject: v.title, startdt: start.toISOString(), enddt: end.toISOString(), body: v.description, location: v.location }).toString();
  const yahoo = 'https://calendar.yahoo.com/?' + new URLSearchParams({ v: '60', title: v.title, st: start.toISOString(), et: end.toISOString(), desc: v.description, in_loc: v.location }).toString();
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ReelFlow//Calendar//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@reelflow.live`, `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(start)}`, `DTEND:${utc(end)}`, `SUMMARY:${icsEscape(v.title)}`, `DESCRIPTION:${icsEscape(v.description)}`, `LOCATION:${icsEscape(v.location)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const html = `<div class="utility-list"><a class="btn btn-primary" href="${escapeHtml(google)}" target="_blank" rel="noopener">Add to Google Calendar</a><a class="btn btn-ghost" href="${escapeHtml(outlook)}" target="_blank" rel="noopener">Add to Outlook</a><a class="btn btn-ghost" href="${escapeHtml(yahoo)}" target="_blank" rel="noopener">Add to Yahoo Calendar</a><pre class="utility-code">${escapeHtml(google)}</pre></div>`;
  return { html, blob: new Blob([ics], { type: 'text/calendar' }), filename: 'event.ics', copyText: [google, outlook, yahoo].join('\n') };
};

function wheelOperation(v, files, overrideItems) {
  const items = overrideItems || lines(v.items);
  if (!items.length) throw new Error('Add at least one wheel choice.');
  const html = `<div class="wheel-wrap"><canvas width="360" height="360" aria-label="Random choice wheel"></canvas><button class="btn btn-primary" data-wheel-spin type="button">Spin</button><div class="stat-big" data-wheel-result>Ready</div></div>`;
  return { html, interactive: 'wheel', wheelItems: items, copyText: items.join('\n'), blob: new Blob([items.join('\n')], { type: 'text/plain' }), filename: 'wheel-choices.txt', status: 'Wheel ready' };
}

operations['spin-the-wheel'] = (v) => wheelOperation(v);
operations['name-wheel'] = (v) => wheelOperation(v);
operations['yes-no-wheel'] = () => wheelOperation({}, null, ['Yes', 'No']);
operations['random-number-wheel'] = (v) => {
  let min = Number(v.min), max = Number(v.max);
  if (min > max) [min, max] = [max, min];
  const count = Math.min(12, max - min + 1);
  const items = Array.from({ length: count }, (_, i) => String(Math.round(min + (max - min) * i / Math.max(1, count - 1))));
  return wheelOperation({}, null, items);
};

operations['cross-sum-calculator'] = (v) => {
  const raw = String(v.number).replace(/[^0-9]/g, '');
  if (!raw) throw new Error('Enter a whole number.');
  const digits = Array.from(raw, Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  let digitalRoot = sum;
  while (digitalRoot > 9) digitalRoot = Array.from(String(digitalRoot), Number).reduce((a, b) => a + b, 0);
  return textResult(`Digits: ${digits.join(' + ')}\nCross sum: ${sum}\nDigital root: ${digitalRoot}`);
};

const keypad = { 2: 'ABC', 3: 'DEF', 4: 'GHI', 5: 'JKL', 6: 'MNO', 7: 'PQRS', 8: 'TUV', 9: 'WXYZ', 0: '0', 1: '1' };
const letterToDigit = Object.fromEntries(Object.entries(keypad).flatMap(([digit, letters]) => Array.from(letters).map((letter) => [letter, digit])));
operations['vanity-number-calculator'] = (v) => {
  const raw = v.number.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!raw) throw new Error('Enter a phone number.');
  if (/[A-Z]/.test(raw)) {
    const numeric = Array.from(raw).map((char) => letterToDigit[char] || char).join('');
    return textResult(`Phone word: ${raw}\nNumeric: ${numeric}`);
  }
  const results = [];
  const walk = (index, current) => {
    if (results.length >= v.results) return;
    if (index === raw.length) { results.push(current); return; }
    for (const letter of keypad[raw[index]] || raw[index]) walk(index + 1, current + letter);
  };
  walk(0, '');
  return textResult(results.join('\n'));
};

operations['date-countdown'] = (v) => {
  if (!v.target) throw new Error('Choose a target date and time.');
  const target = new Date(v.target);
  if (Number.isNaN(target.getTime())) throw new Error('Choose a valid target date.');
  const html = `<div class="utility-list" style="place-items:center;text-align:center" data-countdown></div>`;
  return { html, interactive: 'countdown', target: target.toISOString(), status: 'Countdown running' };
};

operations['date-range-calculator'] = (v) => {
  const start = new Date(v.start + 'T00:00:00'), end = new Date(v.end + 'T00:00:00');
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error('Choose both dates.');
  if (end < start) throw new Error('The end date must be after the start date.');
  const days = Math.round((end - start) / 86400000) + 1;
  let weekends = 0;
  for (let i = 0; i < days; i++) { const day = new Date(start); day.setDate(start.getDate() + i); if (day.getDay() === 0 || day.getDay() === 6) weekends++; }
  return textResult(`Inclusive days: ${days}\nFull weeks: ${Math.floor(days / 7)}\nExtra days: ${days % 7}\nWeekend days: ${weekends}\nWeekdays: ${days - weekends}`);
};

operations['work-hours-calculator'] = (v) => {
  if (!/^\d{2}:\d{2}$/.test(v.start) || !/^\d{2}:\d{2}$/.test(v.end)) throw new Error('Choose both a start time and an end time.');
  const [sh, sm] = v.start.split(':').map(Number), [eh, em] = v.end.split(':').map(Number);
  if (sh > 23 || sm > 59 || eh > 23 || em > 59) throw new Error('Choose valid start and end times.');
  let minutes = (eh * 60 + em) - (sh * 60 + sm);
  if (minutes < 0) minutes += 1440;
  if (v.breakMinutes > minutes) throw new Error('The unpaid break cannot be longer than the shift.');
  minutes = Math.max(0, minutes - v.breakMinutes);
  const hours = minutes / 60;
  const pay = hours * v.rate;
  return textResult(`Paid time: ${Math.floor(minutes / 60)}h ${minutes % 60}m\nDecimal hours: ${hours.toFixed(2)}${v.rate ? `\nEstimated pay: ${v.rate.toFixed(2)} × ${hours.toFixed(2)} = ${pay.toFixed(2)}` : ''}`);
};

operations['click-counter'] = () => ({
  html: `<div class="utility-list" style="place-items:center;text-align:center"><div class="stat-big" data-click-count>0</div><div class="split-actions"><button class="btn btn-primary" data-click-add type="button">+1 Click</button><button class="btn btn-ghost" data-click-reset type="button">Reset</button></div><p class="mini">Saved automatically in this browser.</p></div>`,
  interactive: 'click-counter', status: 'Counter ready'
});

operations['analog-clock'] = () => ({
  html: `<div class="clock-wrap"><canvas width="340" height="340"></canvas><div class="stat-big" data-clock-digital></div></div>`,
  interactive: 'clock', disableDownload: true, status: 'Live clock'
});

operations['habit-tracker'] = (v) => {
  const habits = lines(v.habits);
  if (!habits.length) throw new Error('Add at least one habit.');
  return { html: '<div class="utility-list"></div>', interactive: 'habits', habits, status: 'Habit tracker ready' };
};

operations['checklist-manager'] = (v) => {
  const items = lines(v.items);
  if (!items.length) throw new Error('Add at least one checklist item.');
  return { html: '<div class="utility-list"></div>', interactive: 'checklist', items, status: 'Checklist ready' };
};

operations['white-screen'] = () => ({ html: '<p>White screen opened. Press Escape or click the button to close.</p>', interactive: 'screen', screenColor: '#ffffff', status: 'Display test' });
operations['black-screen'] = () => ({ html: '<p>Black screen opened. Press Escape or click the button to close.</p>', interactive: 'screen', screenColor: '#000000', status: 'Display test' });
operations['dead-pixel-test'] = () => ({ html: '<p>Colour test started. Colours change automatically; click to advance or close.</p>', interactive: 'screen', screenColor: '#ff0000', status: 'Pixel test' });

operations['flip-a-coin'] = () => ({
  html: `<div class="utility-list" style="place-items:center;text-align:center"><div class="stat-big" data-coin-result>Ready</div><button class="btn btn-primary" data-coin-flip type="button">Flip coin</button></div>`,
  interactive: 'coin', status: 'Ready'
});

operations['secret-santa'] = (v) => {
  const names = Array.from(new Set(lines(v.names)));
  if (names.length < 2) throw new Error('Add at least two participants.');
  const excluded = new Set();
  for (const line of lines(v.exclusions)) {
    const pair = line.split(',').map((name) => name.trim()).filter(Boolean);
    if (pair.length === 2) { excluded.add(pair.join('|')); excluded.add(pair.slice().reverse().join('|')); }
  }
  let assignments = null;
  for (let attempt = 0; attempt < 2000; attempt++) {
    const shuffled = shuffle(names);
    const candidate = new Map(names.map((name, index) => [name, shuffled[(index + 1) % shuffled.length]]));
    if (names.every((name) => candidate.get(name) !== name && !excluded.has(name + '|' + candidate.get(name)))) { assignments = candidate; break; }
  }
  if (!assignments) throw new Error('No valid Secret Santa assignment satisfies all exclusions.');
  return textResult(Array.from(assignments, ([name, recipient]) => `${name} → ${recipient}`).join('\n'));
};

operations['minecraft-circle-generator'] = (v) => {
  const diameter = Math.round(v.diameter);
  const radius = (diameter - 1) / 2;
  const cell = diameter > 80 ? 6 : 12;
  const canvas = document.createElement('canvas'); canvas.width = diameter * cell + 40; canvas.height = diameter * cell + 40;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const blocks = [];
  const vertical = v.plane === 'vertical';
  for (let y = 0; y < diameter; y++) for (let x = 0; x < diameter; x++) {
    const distance = Math.hypot(x - radius, y - radius);
    if (distance <= radius + .25 && (v.filled || distance >= radius - 1.25)) {
      ctx.fillStyle = '#65a30d'; ctx.fillRect(20 + x * cell, 20 + y * cell, cell - 1, cell - 1);
      ctx.strokeStyle = '#4d7c0f'; ctx.strokeRect(20 + x * cell, 20 + y * cell, cell - 1, cell - 1);
      blocks.push(`${x},${vertical ? 'z' : 'y'}`);
    }
  }
  return { canvas, text: `${blocks.length} blocks (${vertical ? 'vertical wall' : 'flat ground'})\n${blocks.join(' ')}`, copyText: blocks.join(' '), status: `${blocks.length} blocks` };
};

const pictionary = {
  animals: ['cat', 'dog', 'elephant', 'giraffe', 'penguin', 'dolphin', 'butterfly', 'rabbit', 'turtle', 'lion', 'monkey', 'octopus', 'kangaroo', 'peacock', 'hedgehog'],
  objects: ['umbrella', 'guitar', 'clock', 'camera', 'balloon', 'key', 'book', 'bicycle', 'telephone', 'toothbrush', 'lighthouse', 'telescope', 'backpack', 'scissors', 'mirror'],
  food: ['pizza', 'banana', 'cupcake', 'sandwich', 'carrot', 'popcorn', 'ice cream', 'spaghetti', 'watermelon', 'donut', 'broccoli', 'hamburger', 'pineapple', 'pretzel', 'avocado'],
  places: ['beach', 'castle', 'airport', 'library', 'hospital', 'museum', 'farm', 'volcano', 'bridge', 'campsite', 'school', 'park', 'island', 'desert', 'city'],
  actions: ['swimming', 'dancing', 'sleeping', 'running', 'cooking', 'reading', 'singing', 'climbing', 'painting', 'fishing', 'jumping', 'driving', 'skating', 'typing', 'yawning']
};
const pictionaryAll = Object.values(pictionary).flat();
operations['pictionary-words'] = (v) => {
  let pool = v.category === 'all' ? pictionaryAll : pictionary[v.category];
  pool = pool.filter((word) => v.difficulty === 'easy' ? word.length <= 7 : v.difficulty === 'medium' ? word.length <= 10 : true);
  return textResult(drawFromPool(pool, v.count).join('\n'));
};

const charades = {
  movies: ['Titanic', 'The Lion King', 'Harry Potter', 'Star Wars', 'Frozen', 'The Matrix', 'Jurassic Park', 'Spider-Man', 'Toy Story', 'The Godfather', 'Finding Nemo', 'The Avengers'],
  animals: ['elephant', 'penguin', 'giraffe', 'dolphin', 'butterfly', 'kangaroo', 'octopus', 'flamingo', 'hedgehog', 'crocodile', 'squirrel', 'peacock'],
  actions: ['brushing teeth', 'typing on a laptop', 'riding a bicycle', ' cooking dinner', 'playing guitar', 'swimming', 'taking a selfie', 'walking a dog', 'opening a present', 'doing push-ups', 'watering plants', 'dancing'],
  objects: ['umbrella', 'toothbrush', 'traffic cone', 'computer mouse', 'spatula', 'flashlight', 'vacuum cleaner', 'paintbrush', 'doorbell', 'sunglasses', 'backpack', 'alarm clock'],
  food: ['eating spaghetti', 'peeling a banana', 'making a sandwich', 'blowing out candles', 'popping popcorn', 'drinking through a straw', 'cutting a watermelon', 'eating a spicy pepper', 'making pizza', 'peeling an orange', 'stirring soup', 'eating an ice cream']
};
const charadesAll = Object.values(charades).flat().map((item) => item.trim());
operations['charades-generator'] = (v) => {
  const pool = v.category === 'all' ? charadesAll : charades[v.category];
  return textResult(drawFromPool(pool, v.count).join('\n'));
};

const animals = [
  ['Red fox', 'A red fox can hear a mouse moving under snow.'], ['Emperor penguin', 'Emperor penguins huddle together to survive Antarctic winters.'], ['Blue whale', 'The blue whale is the largest animal known to have lived.'], ['Koala', 'Koalas sleep for up to 20 hours a day.'], ['Sea otter', 'Sea otters use rocks as tools to open shellfish.'], ['Snow leopard', 'Snow leopards use their long tails for balance on rocky cliffs.'], ['Axolotl', 'Axolotls can regenerate parts of their limbs.'], ['Cheetah', 'A cheetah can accelerate from 0 to 60 mph in about three seconds.'], ['Honey badger', 'Honey badgers have incredibly thick, loose skin.'], ['Flying fox', 'Flying foxes are fruit bats and important pollinators.'], ['Narwhal', 'A narwhal’s tusk is actually an elongated tooth.'], ['Pangolin', 'Pangolins are covered in protective keratin scales.']
];
operations['random-animal'] = (v) => textResult(Array.from({ length: v.count }, () => { const [name, fact] = pick(animals); return `${name} — ${fact}`; }).join('\n'));

const countries = [
  ['Japan', 'Tokyo', 'Asia', 'Japanese'], ['Canada', 'Ottawa', 'North America', 'English, French'], ['Brazil', 'Brasília', 'South America', 'Portuguese'], ['Kenya', 'Nairobi', 'Africa', 'Swahili, English'], ['Norway', 'Oslo', 'Europe', 'Norwegian'], ['New Zealand', 'Wellington', 'Oceania', 'English, Māori'], ['Morocco', 'Rabat', 'Africa', 'Arabic, Amazigh'], ['South Korea', 'Seoul', 'Asia', 'Korean'], ['Chile', 'Santiago', 'South America', 'Spanish'], ['Finland', 'Helsinki', 'Europe', 'Finnish, Swedish'], ['Vietnam', 'Hanoi', 'Asia', 'Vietnamese'], ['Peru', 'Lima', 'South America', 'Spanish, Quechua']
];
operations['random-country'] = (v) => {
  const pool = drawFromPool(countries, v.count, v.unique);
  const status = v.unique && v.count > countries.length ? `${countries.length} unique countries available` : '';
  return textResult(pool.map(([name, capital, region, language]) => `${name} — Capital: ${capital}; Region: ${region}; Language: ${language}`).join('\n'), { status });
};

const objects = ['alarm clock', 'backpack', 'balloon', 'basket', 'bicycle', 'binoculars', 'book', 'bottle', 'bowl', 'camera', 'candle', 'chair', 'clock', 'comb', 'computer mouse', 'cup', 'desk lamp', 'door key', 'envelope', 'flashlight', 'fork', 'glasses', 'guitar', 'hammer', 'headphones', 'helmet', 'keyboard', 'ladder', 'lighthouse', 'magnet', 'microphone', 'mirror', 'notebook', 'paintbrush', 'pencil', 'phone', 'pillow', 'scissors', 'shovel', 'soap', 'spoon', 'stapler', 'sunglasses', 'teapot', 'telephone', 'toothbrush', 'towel', 'umbrella', 'watch', 'water bottle', 'wheel'];
operations['random-object'] = (v) => textResult(drawFromPool(objects, v.count).join('\n'));

const teamNames = ['Blue Comets', 'Red Rockets', 'Golden Lions', 'Silver Sharks', 'Green Giants', 'Purple Panthers', 'Orange Tigers', 'Black Hawks', 'White Wolves', 'Crimson Dragons'];
operations['random-team-generator'] = (v) => {
  const players = shuffle(lines(v.players));
  if (players.length < v.teams) throw new Error('Add at least one player per team.');
  const teams = Array.from({ length: v.teams }, (_, i) => ({ name: v.teamNames ? (teamNames[i] || `Team ${i + 1}`) : `Team ${i + 1}`, players: [] }));
  players.forEach((player, index) => teams[index % teams.length].players.push(player));
  return textResult(teams.map((team) => `${team.name}:\n${team.players.map((player) => '  ' + player).join('\n')}`).join('\n\n'));
};
