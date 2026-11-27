const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const wheelColors = ['#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#84cc16', '#8b5cf6', '#f97316'];

function drawWheel(canvas, items, rotation) {
  if (!canvas) return;
  const size = 360;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const radius = size / 2;
  ctx.clearRect(0, 0, size, size);
  if (!items.length) return;
  const arc = Math.PI * 2 / items.length;
  items.forEach((item, index) => {
    const start = rotation + index * arc;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 3, start, start + arc);
    ctx.closePath();
    ctx.fillStyle = wheelColors[index % wheelColors.length];
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = '600 14px system-ui, sans-serif';
    const label = String(item).length > 18 ? String(item).slice(0, 17) + '…' : String(item);
    ctx.fillText(label, radius - 18, 0);
    ctx.restore();
  });
  ctx.beginPath(); ctx.arc(radius, radius, 20, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.beginPath(); ctx.arc(radius, radius, 12, 0, Math.PI * 2); ctx.fillStyle = '#0f172a'; ctx.fill();
}

function wheelHandler(preview, result, context) {
  const canvas = preview.querySelector('canvas');
  const button = preview.querySelector('[data-wheel-spin]');
  const output = preview.querySelector('[data-wheel-result]');
  const items = (result.wheelItems || []).map(String).filter(Boolean);
  let rotation = -Math.PI / 2;
  let frame = 0;
  drawWheel(canvas, items, rotation);
  const spin = () => {
    if (!items.length || frame) return;
    button.disabled = true;
    const targetIndex = randomInt(0, items.length - 1);
    const arc = Math.PI * 2 / items.length;
    const start = rotation;
    const target = start + Math.PI * 2 * 6 + (targetIndex * arc);
    const began = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - began) / 3200);
      const eased = 1 - Math.pow(1 - progress, 4);
      rotation = start + (target - start) * eased;
      drawWheel(canvas, items, rotation);
      if (progress < 1) frame = setTimeout(tick, 16);
      else {
        frame = 0; button.disabled = false;
        const winner = items[targetIndex];
        if (output) output.textContent = 'Winner: ' + winner;
        context.setCurrent({ text: 'Winner: ' + winner, copyText: winner, status: 'Winner: ' + winner });
        window.CT.toast(winner);
      }
    };
    frame = setTimeout(tick, 16);
  };
  button?.addEventListener('click', spin);
  context.onCleanup(() => { if (frame) clearTimeout(frame); });
}

const morseMap = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'
};
const morseReverse = Object.fromEntries(Object.entries(morseMap).map(([key, value]) => [value, key]));
const practicePools = {
  easy: ['SOS', 'HELLO', 'WATER', 'LIGHT', 'WORLD', 'BRAVE', 'SMILE', 'DREAM'],
  medium: ['REELFLOW', 'TOOLKIT', 'CREATE', 'BROWSER', 'CAMERA', 'PUZZLE42'],
  hard: ['QWERTY', 'JINXED', 'VORTEX', 'ZEPHYR', 'QUIZ99', 'MYSTIC7']
};

function morseHandler(preview, result, context) {
  const wordNode = preview.querySelector('[data-morse-word]');
  const codeNode = preview.querySelector('[data-morse-code]');
  const reveal = preview.querySelector('[data-morse-reveal]');
  const play = preview.querySelector('[data-morse-play]');
  const next = preview.querySelector('[data-morse-next]');
  let word = result.word;
  let revealed = false;
  const render = () => {
    if (wordNode) wordNode.textContent = word;
    if (codeNode) codeNode.textContent = revealed ? result.morseFor(word) : '••• •••• ••••';
    if (reveal) reveal.textContent = revealed ? 'Hide Morse' : 'Reveal Morse';
    context.setCurrent({ text: revealed ? `${word}\n${result.morseFor(word)}` : word, copyText: word });
  };
  reveal?.addEventListener('click', () => { revealed = !revealed; render(); });
  next?.addEventListener('click', () => {
    word = pick(result.pool); revealed = false; render();
    const button = preview.querySelector('[data-morse-word]');
    button?.animate([{ transform: 'scale(.92)', opacity: .5 }, { transform: 'scale(1)', opacity: 1 }], { duration: 260 });
  });
  play?.addEventListener('click', async () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audio = new AudioCtx();
    const code = result.morseFor(word);
    let time = audio.currentTime + .05;
    for (const symbol of code) {
      if (symbol === ' ') { time += .18; continue; }
      const duration = symbol === '.' ? .1 : .3;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = 620;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.18, time + .01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      oscillator.connect(gain); gain.connect(audio.destination);
      oscillator.start(time); oscillator.stop(time + duration + .02);
      time += duration + .08;
    }
    await audio.close();
  });
  render();
  context.onCleanup(() => {});
}

function webcamHandler(preview, result, context) {
  const video = preview.querySelector('video');
  const start = preview.querySelector('[data-camera-start]');
  const stop = preview.querySelector('[data-camera-stop]');
  const snapshot = preview.querySelector('[data-camera-snapshot]');
  const flip = preview.querySelector('[data-camera-flip]');
  let stream = null;
  let mirrored = true;
  const applyFlip = () => { if (video) video.style.transform = mirrored ? 'scaleX(-1)' : 'none'; };
  applyFlip();
  start?.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      video.srcObject = stream; await video.play();
      start.hidden = true; stop.hidden = false; snapshot.hidden = false;
    } catch (error) { window.CT.toast(error.message || 'Camera access was denied.', 'error'); }
  });
  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    stream = null; if (video) video.srcObject = null;
    if (start) start.hidden = false; if (stop) stop.hidden = true; if (snapshot) snapshot.hidden = true;
  };
  stop?.addEventListener('click', stopCamera);
  flip?.addEventListener('click', () => { mirrored = !mirrored; applyFlip(); });
  snapshot?.addEventListener('click', async () => {
    if (!video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (mirrored) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (blob) window.CT.downloadBlob(blob, 'webcam-snapshot.png');
  });
  context.onCleanup(stopCamera);
}

function recorderHandler(preview, result, context) {
  const start = preview.querySelector('[data-record-start]');
  const stop = preview.querySelector('[data-record-stop]');
  const timer = preview.querySelector('[data-record-timer]');
  const audio = preview.querySelector('audio');
  const download = preview.querySelector('[data-record-download]');
  let recorder = null, chunks = [], started = 0, interval = 0, blobUrl = '';
  const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  start?.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunks = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        blobUrl = URL.createObjectURL(blob);
        audio.src = blobUrl; download.href = blobUrl; download.hidden = false;
        context.setCurrent({ blob, filename: 'recording.webm', text: 'Recording ready.', status: 'Recording ready' });
      };
      recorder.start();
      started = Date.now(); start.hidden = true; stop.hidden = false;
      interval = setInterval(() => { timer.textContent = formatTime(Math.floor((Date.now() - started) / 1000)); }, 250);
    } catch (error) { window.CT.toast(error.message || 'Microphone access was denied.', 'error'); }
  });
  stop?.addEventListener('click', () => {
    if (recorder?.state === 'recording') recorder.stop();
    clearInterval(interval); start.hidden = false; stop.hidden = true;
  });
  context.onCleanup(() => {
    clearInterval(interval);
    if (recorder?.state === 'recording') recorder.stop();
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  });
}

function countdownHandler(preview, result, context) {
  const node = preview.querySelector('[data-countdown]');
  const target = new Date(result.target).getTime();
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff % 86400000 / 3600000);
    const minutes = Math.floor(diff % 3600000 / 60000);
    const seconds = Math.floor(diff % 60000 / 1000);
    if (node) node.innerHTML = `<div class="stat-big">${days}</div><div class="mini">days</div><div class="utility-chip">${hours}h ${minutes}m ${seconds}s</div>`;
  };
  tick(); const interval = setInterval(tick, 1000);
  context.onCleanup(() => clearInterval(interval));
}

function clickCounterHandler(preview, result, context) {
  const node = preview.querySelector('[data-click-count]');
  let count = 0;
  try { count = Number(localStorage.getItem('reelflow.click-counter.v1') || 0); } catch (error) { count = 0; }
  const render = () => { if (node) node.textContent = count; context.setCurrent({ text: String(count), copyText: String(count), status: String(count) + ' clicks' }); };
  preview.querySelector('[data-click-add]')?.addEventListener('click', () => { count++; try { localStorage.setItem('reelflow.click-counter.v1', String(count)); } catch (error) {} render(); });
  preview.querySelector('[data-click-reset]')?.addEventListener('click', () => { count = 0; try { localStorage.setItem('reelflow.click-counter.v1', '0'); } catch (error) {} render(); });
  render();
}

function drawClock(canvas) {
  const size = 340; canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const now = new Date();
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath(); ctx.arc(size / 2, size / 2, 154, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#dbe3ef'; ctx.lineWidth = 8; ctx.stroke();
  for (let i = 0; i < 60; i++) {
    const angle = i * Math.PI / 30;
    const inner = i % 5 === 0 ? 126 : 138;
    ctx.beginPath();
    ctx.moveTo(size / 2 + Math.sin(angle) * inner, size / 2 - Math.cos(angle) * inner);
    ctx.lineTo(size / 2 + Math.sin(angle) * 146, size / 2 - Math.cos(angle) * 146);
    ctx.strokeStyle = i % 5 === 0 ? '#0f172a' : '#cbd5e1'; ctx.lineWidth = i % 5 === 0 ? 4 : 2; ctx.stroke();
  }
  const hand = (angle, length, width, colour) => {
    ctx.beginPath(); ctx.moveTo(size / 2, size / 2); ctx.lineTo(size / 2 + Math.sin(angle) * length, size / 2 - Math.cos(angle) * length); ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.stroke();
  };
  hand((now.getHours() % 12 + now.getMinutes() / 60) * Math.PI / 6, 78, 9, '#0f172a');
  hand((now.getMinutes() + now.getSeconds() / 60) * Math.PI / 30, 112, 6, '#2563eb');
  hand(now.getSeconds() * Math.PI / 30, 128, 3, '#ef4444');
  ctx.beginPath(); ctx.arc(size / 2, size / 2, 8, 0, Math.PI * 2); ctx.fillStyle = '#0f172a'; ctx.fill();
}

function clockHandler(preview, result, context) {
  const canvas = preview.querySelector('canvas');
  const digital = preview.querySelector('[data-clock-digital]');
  const tick = () => { drawClock(canvas); if (digital) digital.textContent = new Date().toLocaleTimeString(); };
  tick(); const interval = setInterval(tick, 1000);
  context.onCleanup(() => clearInterval(interval));
}

function habitsHandler(preview, result, context) {
  const key = 'reelflow.habits.v1';
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(key) || 'null'); } catch (error) { saved = null; }
  const habits = saved?.habits || result.habits;
  const checks = saved?.checks || {};
  const today = new Date();
  const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  const dateKey = (date) => date.toISOString().slice(0, 10);
  const render = () => {
    let streak = 0;
    const rows = habits.map((habit, index) => {
      let count = 0;
      const cells = days.map((day) => {
        const k = dateKey(day); const checked = !!checks[index + ':' + k];
        if (checked) count++;
        return `<button class="habit-check ${checked ? 'on' : ''}" data-habit="${index}" data-day="${k}" aria-label="${escapeHtml(habit)} ${k}">${checked ? '✓' : ''}</button>`;
      }).join('');
      if (count === 7) streak++;
      return `<div>${escapeHtml(habit)}<br><small>${count}/7 this week</small></div>${cells}`;
    }).join('');
    preview.innerHTML = `<div class="habit-grid"><div></div>${days.map((d) => `<div class="habit-day">${d.toLocaleDateString(undefined, { weekday: 'short' })}</div>`).join('')}${rows}</div><p class="mini">Perfect weeks: ${streak}. Saved automatically in this browser.</p>`;
    preview.querySelectorAll('[data-habit]').forEach((button) => button.addEventListener('click', () => {
      const k = button.dataset.habit + ':' + button.dataset.day;
      checks[k] = !checks[k];
      try { localStorage.setItem(key, JSON.stringify({ habits, checks })); } catch (error) {}
      render();
    }));
  };
  render();
  context.onCleanup(() => {});
}

function checklistHandler(preview, result, context) {
  const key = 'reelflow.checklist.v1';
  let items = result.items.map((text) => ({ text, done: false }));
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (Array.isArray(saved) && saved.length) items = saved;
  } catch (error) {}
  const save = () => { try { localStorage.setItem(key, JSON.stringify(items)); } catch (error) {} };
  const render = () => {
    preview.innerHTML = `<div>${items.map((item, index) => `<div class="checklist-row"><input type="checkbox" data-check="${index}" ${item.done ? 'checked' : ''}><input class="input" type="text" data-edit="${index}" value="${escapeHtml(item.text)}"><button class="btn btn-ghost" data-delete="${index}" type="button">Delete</button></div>`).join('')}</div><div class="split-actions"><input class="input" id="newChecklistItem" placeholder="Add an item"><button class="btn btn-primary" id="addChecklistItem" type="button">Add</button></div>`;
    preview.querySelectorAll('[data-check]').forEach((input) => input.addEventListener('change', () => { items[+input.dataset.check].done = input.checked; save(); }));
    preview.querySelectorAll('[data-edit]').forEach((input) => input.addEventListener('input', () => { items[+input.dataset.edit].text = input.value; save(); }));
    preview.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => { items.splice(+button.dataset.delete, 1); save(); render(); }));
    const add = () => { const input = preview.querySelector('#newChecklistItem'); if (!input.value.trim()) return; items.push({ text: input.value.trim(), done: false }); save(); render(); };
    preview.querySelector('#addChecklistItem')?.addEventListener('click', add);
    preview.querySelector('#newChecklistItem')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') add(); });
    context.setCurrent({ text: items.map((item) => `${item.done ? '[x]' : '[ ]'} ${item.text}`).join('\n'), copyText: items.map((item) => item.text).join('\n') });
  };
  render();
}

function screenHandler(preview, result, context) {
  const colors = result.screenColor === '#ff0000' ? ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'] : [result.screenColor || '#000000'];
  let index = 0, interval = 0;
  const overlay = document.createElement('div');
  overlay.className = 'screen-stage ' + (colors[0] === '#ffffff' ? 'full-white' : colors[0] === '#000000' ? 'full-black' : '');
  overlay.style.background = colors[0];
  overlay.innerHTML = '<button class="btn btn-primary" type="button">Next colour / close</button>';
  document.body.appendChild(overlay);
  const close = () => { clearInterval(interval); overlay.remove(); };
  overlay.querySelector('button').addEventListener('click', () => {
    index++;
    if (index >= colors.length) { close(); return; }
    overlay.style.background = colors[index];
  });
  if (colors.length > 1) interval = setInterval(() => { index = (index + 1) % colors.length; overlay.style.background = colors[index]; }, 1400);
  document.addEventListener('keydown', close, { once: true });
  context.onCleanup(() => { close(); document.removeEventListener('keydown', close); });
}

function coinHandler(preview, result, context) {
  const output = preview.querySelector('[data-coin-result]');
  const button = preview.querySelector('[data-coin-flip]');
  let spinning = false;
  button?.addEventListener('click', () => {
    if (spinning) return;
    spinning = true; button.disabled = true;
    let ticks = 0;
    const interval = setInterval(() => {
      output.textContent = pick(['Heads', 'Tails']);
      if (++ticks > 12) {
        clearInterval(interval);
        const winner = pick(['Heads', 'Tails']);
        output.textContent = winner;
        context.setCurrent({ text: winner, copyText: winner, status: winner });
        button.disabled = false; spinning = false;
      }
    }, 70);
    context.onCleanup(() => clearInterval(interval));
  });
}

export const interactiveHandlers = {
  wheel: wheelHandler,
  'morse-practice': morseHandler,
  webcam: webcamHandler,
  recorder: recorderHandler,
  countdown: countdownHandler,
  'click-counter': clickCounterHandler,
  clock: clockHandler,
  habits: habitsHandler,
  checklist: checklistHandler,
  screen: screenHandler,
  coin: coinHandler
};
