/* SRT / VTT editor and converter */
(function () {
  const CT = window.CT;
  const inputText = document.getElementById('inputText');
  if (!inputText) return;

  const subFile = document.getElementById('subFile');
  const detected = document.getElementById('detected');
  const formatSeg = document.getElementById('formatSeg');
  const outFormat = document.getElementById('outFormat');
  const offsetInput = document.getElementById('offset');
  const offsetUnit = document.getElementById('offsetUnit');
  const stats = document.getElementById('stats');
  const statCues = document.getElementById('statCues');
  const statDuration = document.getElementById('statDuration');
  const statIssues = document.getElementById('statIssues');
  const issuesEl = document.getElementById('issues');
  const outputText = document.getElementById('outputText');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyBtn = document.getElementById('copyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const cueBody = document.getElementById('cueBody');
  const cueEmpty = document.getElementById('cueEmpty');
  const cueHint = document.getElementById('cueHint');

  const EXT = { srt: 'srt', vtt: 'vtt', txt: 'txt' };
  let baseName = 'subtitles';

  function pad(n, len) {
    return String(n).padStart(len, '0');
  }

  function toMs(digits) {
    return parseInt((String(digits) + '000').slice(0, 3), 10);
  }

  function parseSubTime(str) {
    const s = String(str).trim();
    let m = s.match(/^(\d+):(\d{1,2}):(\d{1,2})[.,](\d{1,3})$/);
    if (m) return (+m[1]) * 3600000 + (+m[2]) * 60000 + (+m[3]) * 1000 + toMs(m[4]);
    m = s.match(/^(\d{1,2}):(\d{1,2})[.,](\d{1,3})$/);
    if (m) return (+m[1]) * 60000 + (+m[2]) * 1000 + toMs(m[3]);
    m = s.match(/^(\d{1,2}):(\d{1,2})$/);
    if (m) return (+m[1]) * 60000 + (+m[2]) * 1000;
    return null;
  }

  function parseSubs(raw) {
    const text = String(raw).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    const issues = [];
    const lines = text.split('\n');

    let i = 0;
    while (i < lines.length && !lines[i].trim()) i++;
    let isVtt = false;
    if (i < lines.length && /^WEBVTT/.test(lines[i])) {
      isVtt = true;
      i++;
      /* Header metadata ends at a blank line, but some files omit it and
         start the first cue immediately - stop at a timing line too. */
      while (i < lines.length) {
        if (!lines[i].trim()) { i++; break; }
        if (lines[i].indexOf('-->') !== -1) break;
        i++;
      }
    }

    const blocks = [];
    let cur = [];
    for (; i < lines.length; i++) {
      if (!lines[i].trim()) {
        if (cur.length) { blocks.push(cur); cur = []; }
      } else {
        cur.push(lines[i]);
      }
    }
    if (cur.length) blocks.push(cur);

    const cues = [];
    blocks.forEach(function (block, bi) {
      if (/^(NOTE|STYLE|REGION)\b/i.test(block[0])) return;
      let idx = 0;
      if (/^\d+$/.test(block[0].trim())) idx = 1;
      const timingLine = block[idx] || '';
      const m = timingLine.match(/^(\S+)\s*-->\s*(\S+)/);
      if (!m) {
        issues.push('Block ' + (bi + 1) + ': no valid timing line found.');
        return;
      }
      const start = parseSubTime(m[1]);
      const end = parseSubTime(m[2]);
      if (start == null || end == null) {
        issues.push('Block ' + (bi + 1) + ': invalid timestamp "' + timingLine.slice(0, 40) + '".');
        return;
      }
      if (end < start) {
        issues.push('Block ' + (bi + 1) + ': end time is before start time.');
      }
      cues.push({ start: start, end: end, text: block.slice(idx + 1).join('\n').trim() });
    });

    let format = 'none';
    if (cues.length) format = isVtt ? 'WebVTT' : 'SRT';
    return { cues: cues, issues: issues, format: format };
  }

  function fmtTime(ms, sep) {
    ms = Math.max(0, Math.round(ms));
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const f = ms % 1000;
    return pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + sep + pad(f, 3);
  }

  function fmtShort(ms) {
    ms = Math.max(0, Math.round(ms));
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const f = ms % 1000;
    return (h ? h + ':' + pad(m, 2) : m) + ':' + pad(s, 2) + '.' + pad(f, 3);
  }

  function shiftCues(cues, offsetMs) {
    let clamped = 0;
    const shifted = cues.map(function (cue) {
      let start = cue.start + offsetMs;
      let end = cue.end + offsetMs;
      if (start < 0 || end < 0) {
        clamped++;
        start = Math.max(0, start);
        end = Math.max(0, end);
      }
      return { start: start, end: end, text: cue.text };
    });
    return { shifted: shifted, clamped: clamped };
  }

  function buildOutput(shifted, format) {
    if (format === 'srt') {
      return shifted.map(function (cue, i) {
        return (i + 1) + '\n' + fmtTime(cue.start, ',') + ' --> ' + fmtTime(cue.end, ',') + '\n' + cue.text;
      }).join('\n\n') + (shifted.length ? '\n' : '');
    }
    if (format === 'vtt') {
      return 'WEBVTT\n\n' + shifted.map(function (cue) {
        return fmtTime(cue.start, '.') + ' --> ' + fmtTime(cue.end, '.') + '\n' + cue.text;
      }).join('\n\n') + (shifted.length ? '\n' : '');
    }
    return shifted.map(function (cue) { return cue.text; }).join('\n\n') + (shifted.length ? '\n' : '');
  }

  function renderCues(shifted, total) {
    cueBody.innerHTML = '';
    const shown = shifted.slice(0, 100);
    shown.forEach(function (cue, i) {
      const tr = document.createElement('tr');
      const num = document.createElement('td');
      num.className = 'time';
      num.textContent = String(i + 1);
      const start = document.createElement('td');
      start.className = 'time';
      start.textContent = fmtShort(cue.start);
      const end = document.createElement('td');
      end.className = 'time';
      end.textContent = fmtShort(cue.end);
      const txt = document.createElement('td');
      txt.className = 'txt';
      const flat = cue.text.replace(/\s*\n\s*/g, ' ');
      txt.textContent = flat.length > 140 ? flat.slice(0, 140) + '…' : flat;
      tr.appendChild(num);
      tr.appendChild(start);
      tr.appendChild(end);
      tr.appendChild(txt);
      cueBody.appendChild(tr);
    });
    cueEmpty.hidden = total > 0;
    cueHint.textContent = total > 100 ? 'Showing first 100 of ' + total + ' cues' : (total ? total + ' cue' + (total > 1 ? 's' : '') : 'No cues yet');
  }

  function setEmptyState() {
    outputText.value = '';
    stats.hidden = true;
    issuesEl.hidden = true;
    detected.hidden = true;
    downloadBtn.disabled = true;
    copyBtn.disabled = true;
    renderCues([], 0);
  }

  const scheduleRender = CT.debounce(render, 180);

  function render() {
    const raw = inputText.value;

    if (!raw.trim()) {
      setEmptyState();
      return;
    }

    const parsed = parseSubs(raw);
    const issues = parsed.issues.slice();
    const offsetValue = parseFloat(offsetInput.value);
    const offsetMs = isFinite(offsetValue) ? Math.round(offsetValue * Number(offsetUnit.value)) : 0;
    const format = outFormat.value;

    detected.hidden = false;
    detected.textContent = parsed.format !== 'none' ? 'Detected: ' + parsed.format : 'No timed cues found';

    let out = '';
    let shifted = [];
    if (parsed.cues.length) {
      const result = shiftCues(parsed.cues, offsetMs);
      shifted = result.shifted;
      if (result.clamped) {
        issues.push(result.clamped + ' cue(s) would start before 0:00 and were clamped.');
      }
      out = buildOutput(shifted, format);
    } else if (format === 'txt') {
      out = raw.trim() + '\n';
    } else {
      issues.push('No timed cues found - plain text cannot be converted to ' + format.toUpperCase() + '. Use the TXT output.');
    }

    outputText.value = out;

    const lastEnd = shifted.reduce(function (max, c) { return Math.max(max, c.end); }, 0);
    statCues.textContent = String(parsed.cues.length);
    statDuration.textContent = parsed.cues.length ? CT.formatClock(lastEnd / 1000) : '0:00';
    statIssues.textContent = String(issues.length);
    stats.hidden = false;

    issuesEl.innerHTML = '';
    issues.forEach(function (msg) {
      const li = document.createElement('li');
      li.textContent = msg;
      issuesEl.appendChild(li);
    });
    issuesEl.hidden = issues.length === 0;

    renderCues(shifted, parsed.cues.length);

    downloadBtn.disabled = !out;
    copyBtn.disabled = !out;
    downloadBtn.dataset.ext = EXT[format] || 'srt';
  }

  subFile.addEventListener('change', function () {
    const file = subFile.files && subFile.files[0];
    if (!file) return;
    baseName = CT.baseName(file.name || 'subtitles');
    const reader = new FileReader();
    reader.onload = function () {
      inputText.value = String(reader.result || '');
      render();
    };
    reader.onerror = function () {
      CT.toast('Could not read the file.', 'err');
    };
    reader.readAsText(file);
    subFile.value = '';
  });

  inputText.addEventListener('input', scheduleRender);
  offsetInput.addEventListener('input', scheduleRender);
  offsetInput.addEventListener('change', render);
  offsetUnit.addEventListener('change', render);

  CT.$$('button', formatSeg).forEach(function (btn) {
    btn.addEventListener('click', function () {
      CT.$$('button', formatSeg).forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      outFormat.value = btn.getAttribute('data-format');
      render();
    });
  });

  downloadBtn.addEventListener('click', function () {
    if (!outputText.value) return;
    const ext = downloadBtn.dataset.ext || 'srt';
    const type = ext === 'vtt' ? 'text/vtt' : 'text/plain';
    CT.downloadBlob(new Blob([outputText.value], { type: type + ';charset=utf-8' }), baseName + '.' + ext);
    CT.toast('Downloaded ' + baseName + '.' + ext);
  });

  copyBtn.addEventListener('click', function () {
    if (!outputText.value) return;
    CT.copy(outputText.value).then(function (ok) {
      CT.toast(ok ? 'Output copied' : 'Could not copy', ok ? '' : 'err');
    });
  });

  clearBtn.addEventListener('click', function () {
    inputText.value = '';
    subFile.value = '';
    offsetInput.value = '0';
    offsetUnit.value = '1000';
    baseName = 'subtitles';
    render();
    inputText.focus();
  });

  render();
})();
