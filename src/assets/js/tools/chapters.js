/* YouTube Chapters generator */
(function () {
  const CT = window.CT;
  const rowsEl = document.getElementById('chapterRows');
  if (!rowsEl) return;

  const addRowBtn = document.getElementById('addRow');
  const sortBtn = document.getElementById('sortBtn');
  const durationInput = document.getElementById('duration');
  const checkList = document.getElementById('checkList');
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  function makeRow(time, title) {
    const row = document.createElement('div');
    row.className = 'chapter-row';

    const timeInput = document.createElement('input');
    timeInput.className = 'input';
    timeInput.type = 'text';
    timeInput.inputMode = 'numeric';
    timeInput.placeholder = '0:00';
    timeInput.value = time || '';
    timeInput.setAttribute('aria-label', 'Chapter start time');
    timeInput.autocomplete = 'off';
    timeInput.spellcheck = false;

    const titleInput = document.createElement('input');
    titleInput.className = 'input';
    titleInput.type = 'text';
    titleInput.placeholder = 'Chapter title';
    titleInput.value = title || '';
    titleInput.setAttribute('aria-label', 'Chapter title');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'icon-btn';
    removeBtn.setAttribute('aria-label', 'Remove chapter');
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', function () {
      row.remove();
      if (!rowsEl.children.length) addRow('0:00', '');
      update();
    });

    timeInput.addEventListener('input', update);
    titleInput.addEventListener('input', update);
    timeInput.addEventListener('blur', function () {
      const sec = CT.parseClock(timeInput.value);
      if (sec != null) timeInput.value = CT.formatClock(sec);
    });
    titleInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addRowBtn.click();
      }
    });

    row.appendChild(timeInput);
    row.appendChild(titleInput);
    row.appendChild(removeBtn);
    rowsEl.appendChild(row);
    return row;
  }

  function addRow(time, title) {
    const rows = Array.prototype.slice.call(rowsEl.children);
    let t = time;
    if (t == null) {
      let last = null;
      rows.forEach(function (r) {
        const sec = CT.parseClock(r.querySelector('input').value);
        if (sec != null) last = sec;
      });
      t = last == null ? '0:00' : CT.formatClock(last + 30);
    }
    const row = makeRow(t, title || '');
    update();
    row.querySelector('input').focus();
  }

  function collect() {
    return Array.prototype.slice.call(rowsEl.children).map(function (row) {
      const inputs = row.querySelectorAll('input');
      const raw = inputs[0].value.trim();
      const sec = raw ? CT.parseClock(raw) : null;
      return {
        row: row,
        timeInput: inputs[0],
        title: inputs[1].value.trim(),
        raw: raw,
        sec: sec,
        invalid: !!raw && sec == null
      };
    });
  }

  function setCheck(text, ok) {
    const li = document.createElement('li');
    const ic = document.createElement('span');
    ic.className = 'icon ' + (ok ? 'ok' : 'bad');
    ic.textContent = ok ? '✓' : '✕';
    ic.setAttribute('aria-hidden', 'true');
    li.appendChild(ic);
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);
    checkList.appendChild(li);
  }

  function update() {
    const rows = collect();
    rows.forEach(function (r) {
      r.timeInput.classList.toggle('invalid', r.invalid);
    });

    const valid = rows.filter(function (r) { return r.sec != null; });
    const lines = valid.map(function (r) {
      const label = r.title || '(untitled chapter)';
      return CT.formatClock(r.sec) + ' ' + label;
    });
    output.value = lines.join('\n');
    copyBtn.disabled = valid.length === 0;
    downloadBtn.disabled = valid.length === 0;

    const durationSec = CT.parseClock(durationInput.value);

    checkList.innerHTML = '';
    setCheck('At least 3 chapters (' + valid.length + ' so far)', valid.length >= 3);
    setCheck('First chapter starts at 0:00', valid.length > 0 && valid[0].sec === 0);

    let ordered = true;
    let spaced = true;
    for (let i = 1; i < valid.length; i++) {
      const diff = valid[i].sec - valid[i - 1].sec;
      if (diff <= 0) ordered = false;
      if (diff < 10) spaced = false;
    }
    setCheck('Timestamps are in ascending order', ordered);
    setCheck('Every chapter is at least 10 seconds apart', spaced);

    const missingTitles = valid.filter(function (r) { return !r.title; }).length;
    setCheck('Every chapter has a title', valid.length > 0 && missingTitles === 0);

    if (rows.some(function (r) { return r.invalid; })) {
      setCheck('Fix the highlighted time fields', false);
    }

    if (durationSec != null && durationSec > 0) {
      const last = valid.length ? valid[valid.length - 1] : null;
      const inside = valid.every(function (r) { return r.sec < durationSec; });
      const tailOk = last ? durationSec - last.sec >= 10 : true;
      setCheck('All chapters are inside the video length', inside);
      setCheck('The last chapter runs at least 10 seconds', tailOk);
    }
  }

  sortBtn.addEventListener('click', function () {
    const rows = Array.prototype.slice.call(rowsEl.children);
    const data = rows.map(function (row) {
      const inputs = row.querySelectorAll('input');
      return { time: inputs[0].value, title: inputs[1].value, sec: CT.parseClock(inputs[0].value) };
    });
    data.sort(function (a, b) {
      if (a.sec == null && b.sec == null) return 0;
      if (a.sec == null) return 1;
      if (b.sec == null) return -1;
      return a.sec - b.sec;
    });
    rowsEl.innerHTML = '';
    data.forEach(function (d) { makeRow(d.time, d.title); });
    update();
  });

  addRowBtn.addEventListener('click', function () { addRow(); });
  durationInput.addEventListener('input', update);

  copyBtn.addEventListener('click', function () {
    if (!output.value) return;
    CT.copy(output.value).then(function (ok) {
      CT.toast(ok ? 'Chapters copied - paste them into your description' : 'Could not copy', ok ? '' : 'err');
    });
  });

  downloadBtn.addEventListener('click', function () {
    if (!output.value) return;
    CT.downloadBlob(new Blob([output.value + '\n'], { type: 'text/plain;charset=utf-8' }), 'youtube-chapters.txt');
    CT.toast('Downloaded youtube-chapters.txt');
  });

  function reset() {
    rowsEl.innerHTML = '';
    durationInput.value = '';
    makeRow('0:00', '');
    makeRow('', '');
    makeRow('', '');
    update();
  }
  resetBtn.addEventListener('click', reset);

  reset();
})();
