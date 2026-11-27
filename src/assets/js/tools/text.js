/* Text tools: case, line breaks, duplicate lines, slug and lorem ipsum */
(function () {
  const CT = window.CT;
  const seg = document.getElementById('toolSeg');
  if (!seg || !CT) return;

  const out = document.getElementById('output');
  const outHint = document.getElementById('outHint');
  const outError = document.getElementById('outError');
  const outputCopy = document.getElementById('outputCopy');
  const outputClear = document.getElementById('outputClear');
  const panels = CT.$$('.panel', document.querySelector('.workspace'));

  let activePanel = 'case';

  /* ---------- tabs ---------- */

  function showPanel(name) {
    activePanel = name;
    CT.$$('button', seg).forEach(function (btn) {
      const on = btn.getAttribute('data-panel') === name;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.hidden = p.id !== 'panel-' + name;
    });
  }

  CT.$$('button', seg).forEach(function (btn) {
    btn.addEventListener('click', function () {
      showPanel(btn.getAttribute('data-panel'));
    });
  });

  /* ---------- output helpers ---------- */

  function setError(msg) {
    if (!outError) return;
    outError.textContent = msg || '';
    outError.hidden = !msg;
  }

  function setOutput(text, hint) {
    out.value = text || '';
    outputCopy.disabled = !out.value;
    if (outHint) outHint.textContent = hint || (out.value ? 'Result ready' : 'Result appears here');
  }

  function copyText(text, label) {
    if (!text) {
      CT.toast('Nothing to copy yet', 'err');
      return;
    }
    CT.copy(text).then(function (ok) {
      CT.toast(ok ? (label || 'Copied') : 'Could not copy', ok ? '' : 'err');
    }, function () {
      CT.toast('Could not copy', 'err');
    });
  }

  outputCopy.addEventListener('click', function () { copyText(out.value, 'Output copied'); });

  outputClear.addEventListener('click', function () {
    setOutput('', 'Result appears here');
    setError('');
  });

  /* ---------- case ---------- */

  const caseInput = document.getElementById('caseInput');
  const caseCount = document.getElementById('caseCount');
  const caseCopy = document.getElementById('caseCopy');

  const graphemeCounter = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

  function countChars(str) {
    if (!str) return 0;
    if (!graphemeCounter) return Array.from(str).length;
    let n = 0;
    for (const _ of graphemeCounter.segment(str)) n++; // eslint-disable-line no-unused-vars
    return n;
  }

  const words = function (str) { return str ? str.trim().split(/\s+/).filter(Boolean) : []; };

  const CASE_FNS = {
    upper: function (s) { return s.toUpperCase(); },
    lower: function (s) { return s.toLowerCase(); },
    title: function (s) {
      return s.replace(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu, function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      });
    },
    sentence: function (s) {
      return s.toLowerCase().replace(/(^|[.!?]\s+)([\p{L}])/gu, function (m, pre, ch) {
        return pre + ch.toUpperCase();
      });
    }
  };

  function updateCaseCount() {
    if (!caseCount || !caseInput) return;
    const chars = countChars(caseInput.value);
    const w = words(caseInput.value).length;
    caseCount.textContent = chars + (chars === 1 ? ' character' : ' characters') + ' · ' + w + (w === 1 ? ' word' : ' words');
    const hint = document.getElementById('inputHint');
    if (hint) hint.textContent = chars ? chars + ' characters waiting' : 'Nothing entered yet';
  }

  if (caseInput) {
    caseInput.addEventListener('input', updateCaseCount);
    updateCaseCount();
  }

  CT.$$('[data-case]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const mode = btn.getAttribute('data-case');
      if (!caseInput || !CASE_FNS[mode]) return;
      const result = CASE_FNS[mode](caseInput.value);
      if (!caseInput.value) {
        setError('Type or paste some text first.');
        setOutput('', 'Result appears here');
        return;
      }
      setError('');
      setOutput(result, 'Converted to ' + btn.textContent.trim());
      if (caseCopy) caseCopy.disabled = !result;
    });
  });

  if (caseCopy) {
    caseCopy.addEventListener('click', function () { copyText(out.value, 'Converted text copied'); });
  }

  /* ---------- lines ---------- */

  const linesInput = document.getElementById('linesInput');
  const linesTrim = document.getElementById('linesTrim');
  const linesRun = document.getElementById('linesRun');
  const linesCopy = document.getElementById('linesCopy');
  const linesHint = document.getElementById('linesHint');

  function joinLines() {
    if (!linesInput) return '';
    const parts = linesInput.value.split(/\r\n|\r|\n/);
    const cleaned = linesTrim && linesTrim.checked
      ? parts.map(function (l) { return l.trim(); })
      : parts;
    return cleaned.join(' ').replace(/ {2,}/g, ' ').trim();
  }

  if (linesRun) {
    linesRun.addEventListener('click', function () {
      const result = joinLines();
      setError(linesInput && linesInput.value.trim() ? '' : 'Paste some text with line breaks first.');
      setOutput(result, result ? 'Line breaks replaced with spaces' : 'Result appears here');
      if (linesHint) linesHint.textContent = result
        ? result.split(/\s+/).length + ' words on one line'
        : 'Line breaks become single spaces.';
    });
  }
  if (linesCopy) {
    linesCopy.addEventListener('click', function () { copyText(out.value, 'Joined text copied'); });
  }
  if (linesInput) {
    linesInput.addEventListener('input', function () {
      if (linesCopy) linesCopy.disabled = true;
    });
  }

  /* ---------- duplicates ---------- */

  const dupesInput = document.getElementById('dupesInput');
  const dupesCase = document.getElementById('dupesCase');
  const dupesRun = document.getElementById('dupesRun');
  const dupesCopy = document.getElementById('dupesCopy');
  const dupesHint = document.getElementById('dupesHint');

  function dedupe() {
    const lines = dupesInput.value.split(/\r\n|\r|\n/);
    const seen = new Set();
    const kept = [];
    let removed = 0;
    lines.forEach(function (line) {
      const key = dupesCase && dupesCase.checked ? line : line.toLowerCase();
      if (seen.has(key)) {
        removed++;
        return;
      }
      seen.add(key);
      kept.push(line);
    });
    return { text: kept.join('\n'), removed: removed };
  }

  if (dupesRun) {
    dupesRun.addEventListener('click', function () {
      if (!dupesInput || !dupesInput.value.trim()) {
        setError('Add at least one line first.');
        setOutput('', 'Result appears here');
        return;
      }
      setError('');
      const res = dedupe();
      setOutput(res.text, res.removed + (res.removed === 1 ? ' duplicate removed' : ' duplicates removed'));
      if (dupesHint) {
        dupesHint.textContent = res.removed
          ? res.removed + (res.removed === 1 ? ' duplicate line removed.' : ' duplicate lines removed.')
          : 'No duplicate lines found.';
      }
    });
  }
  if (dupesCopy) {
    dupesCopy.addEventListener('click', function () { copyText(out.value, 'Unique lines copied'); });
  }
  if (dupesInput) {
    dupesInput.addEventListener('input', function () { if (dupesCopy) dupesCopy.disabled = true; });
  }

  /* ---------- slug ---------- */

  const slugInput = document.getElementById('slugInput');
  const slugOutput = document.getElementById('slugOutput');
  const slugCopy = document.getElementById('slugCopy');

  function slugify(text) {
    return String(text || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ß]/g, 'ss')
      .replace(/[æ]/gi, 'ae')
      .replace(/[œ]/gi, 'oe')
      .replace(/[ø]/gi, 'o')
      .replace(/[đ]/gi, 'd')
      .replace(/[ł]/gi, 'l')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function updateSlug() {
    if (!slugInput || !slugOutput) return;
    const value = slugify(slugInput.value);
    slugOutput.value = value;
    if (slugCopy) slugCopy.disabled = !value;
  }

  if (slugInput) {
    slugInput.addEventListener('input', updateSlug);
    updateSlug();
  }
  if (slugCopy) {
    slugCopy.addEventListener('click', function () {
      if (!slugOutput || !slugOutput.value) return;
      if (out) out.value = slugOutput.value;
      copyText(slugOutput.value, 'Slug copied');
    });
  }

  /* ---------- lorem ---------- */

  const LOREM = (
    'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore ' +
    'et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut ' +
    'aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse ' +
    'cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in ' +
    'culpa qui officia deserunt mollit anim id est laborum'
  ).split(' ');

  function pick(arr) {
    if (window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      return arr[buf[0] % arr.length];
    }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function loremSentence() {
    const len = 8 + Math.floor(Math.random() * 12);
    const parts = [];
    for (let i = 0; i < len; i++) parts.push(pick(LOREM));
    const s = parts.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }

  function loremParagraph() {
    const n = 3 + Math.floor(Math.random() * 4);
    const sentences = [];
    for (let i = 0; i < n; i++) sentences.push(loremSentence());
    return sentences.join(' ');
  }

  const loremCount = document.getElementById('loremCount');
  const loremRun = document.getElementById('loremRun');
  const loremCopy = document.getElementById('loremCopy');

  function generateLorem() {
    const n = Math.max(1, Math.min(5, parseInt(loremCount ? loremCount.value : '3', 10) || 1));
    const paras = [];
    for (let i = 0; i < n; i++) paras.push(loremParagraph());
    return paras.join('\n\n');
  }

  if (loremRun) {
    loremRun.addEventListener('click', function () {
      const text = generateLorem();
      setError('');
      setOutput(text, (loremCount ? loremCount.value : '3') + ' paragraphs');
      if (out && out.value) out.scrollTop = 0;
    });
  }
  if (loremCopy) {
    loremCopy.addEventListener('click', function () { copyText(out.value, 'Lorem ipsum copied'); });
  }

  showPanel(activePanel);
})();
