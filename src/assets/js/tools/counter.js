/* Character counter and hashtag checker */
(function () {
  const CT = window.CT;
  const titleEl = document.getElementById('titleText');
  if (!titleEl) return;

  const captionEl = document.getElementById('captionText');
  const meterGrid = document.getElementById('meterGrid');
  const tagCount = document.getElementById('tagCount');
  const tagCloud = document.getElementById('tagCloud');
  const tagEmpty = document.getElementById('tagEmpty');
  const copyTags = document.getElementById('copyTags');
  const clearBtn = document.getElementById('clearBtn');

  const PLATFORMS = [
    { name: 'YouTube title', limit: 100, field: 'title' },
    { name: 'YouTube description', limit: 5000, field: 'caption' },
    { name: 'TikTok caption', limit: 2200, field: 'caption' },
    { name: 'Instagram caption', limit: 2200, field: 'caption' },
    { name: 'X (Twitter) post', limit: 280, field: 'caption' }
  ];

  const segmenter = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

  function graphemes(str) {
    if (!str) return 0;
    if (!segmenter) return Array.from(str).length;
    let n = 0;
    for (const _ of segmenter.segment(str)) n++; // eslint-disable-line no-unused-vars
    return n;
  }

  const meters = [];

  function buildMeters() {
    PLATFORMS.forEach(function (p) {
      const card = document.createElement('div');
      card.className = 'counter-card';

      const head = document.createElement('div');
      head.className = 'counter-head';
      const name = document.createElement('b');
      name.textContent = p.name;
      const num = document.createElement('span');
      num.className = 'counter-num';
      head.appendChild(name);
      head.appendChild(num);

      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('i');
      bar.appendChild(fill);

      const countRow = document.createElement('div');
      countRow.className = 'meter-count';
      const used = document.createElement('span');
      const left = document.createElement('span');
      countRow.appendChild(used);
      countRow.appendChild(left);

      card.appendChild(head);
      card.appendChild(bar);
      card.appendChild(countRow);
      meterGrid.appendChild(card);

      meters.push({ limit: p.limit, field: p.field, bar: bar, fill: fill, num: num, used: used, left: left });
    });
  }

  function currentTags(text) {
    const matches = text.match(/#[\p{L}\p{N}_]+/gu) || [];
    const seen = new Set();
    const unique = [];
    matches.forEach(function (tag) {
      const key = tag.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(tag);
      }
    });
    return { total: matches.length, unique: unique };
  }

  let lastTagText = '';

  function update() {
    const counts = {
      title: graphemes(titleEl.value),
      caption: graphemes(captionEl.value)
    };

    meters.forEach(function (m) {
      const count = counts[m.field];
      const ratio = count / m.limit;
      const over = count > m.limit;
      const warn = !over && ratio >= 0.9;
      m.fill.style.width = Math.min(100, Math.round(ratio * 100)) + '%';
      m.bar.className = 'bar' + (over ? ' rose' : (warn ? ' amber' : ''));
      m.num.className = 'counter-num' + (over ? ' over' : (warn ? ' warn' : ''));
      m.num.textContent = count + ' / ' + m.limit;
      m.used.textContent = count + ' used';
      m.left.textContent = over ? (count - m.limit) + ' over' : (m.limit - count) + ' left';
      m.left.className = over ? 'over' : (warn ? 'warn' : '');
    });

    const tags = currentTags(titleEl.value + '\n' + captionEl.value);
    tagCount.textContent = tags.total + ' hashtag' + (tags.total === 1 ? '' : 's') + ' · ' + tags.unique.length + ' unique';
    tagEmpty.hidden = tags.unique.length > 0;
    copyTags.disabled = tags.unique.length === 0;
    lastTagText = tags.unique.join(' ');

    tagCloud.innerHTML = '';
    tags.unique.forEach(function (tag) {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = tag;
      tagCloud.appendChild(chip);
    });
  }

  const scheduleUpdate = CT.debounce(update, 60);
  titleEl.addEventListener('input', scheduleUpdate);
  captionEl.addEventListener('input', scheduleUpdate);

  copyTags.addEventListener('click', function () {
    if (!lastTagText) return;
    CT.copy(lastTagText).then(function (ok) {
      CT.toast(ok ? 'Hashtags copied' : 'Could not copy', ok ? '' : 'err');
    });
  });

  clearBtn.addEventListener('click', function () {
    titleEl.value = '';
    captionEl.value = '';
    update();
    titleEl.focus();
  });

  buildMeters();
  update();
})();
