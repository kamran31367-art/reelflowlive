/* UTM link builder: merges utm_* tags into a destination URL */
(function () {
  const CT = window.CT;
  const destEl = document.getElementById('destUrl');
  if (!destEl || !CT) return;

  const fields = [
    { key: 'utm_source', el: document.getElementById('utmSource'), label: 'Source' },
    { key: 'utm_medium', el: document.getElementById('utmMedium'), label: 'Medium' },
    { key: 'utm_campaign', el: document.getElementById('utmCampaign'), label: 'Campaign' },
    { key: 'utm_term', el: document.getElementById('utmTerm'), label: 'Term' },
    { key: 'utm_content', el: document.getElementById('utmContent'), label: 'Content' }
  ].filter(function (f) { return f.el; });

  const finalUrl = document.getElementById('finalUrl');
  const tagRows = document.getElementById('tagRows');
  const tagCount = document.getElementById('tagCount');
  const caseBadge = document.getElementById('caseBadge');
  const copyBtn = document.getElementById('copyBtn');
  const openLink = document.getElementById('openLink');
  const clearBtn = document.getElementById('clearBtn');
  const formError = document.getElementById('formError');
  const destHint = document.getElementById('destHint');

  let lastUrl = '';

  function normaliseDest(raw) {
    let value = String(raw || '').trim();
    if (!value) return '';
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return value;
    if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^[a-z]:[\\/]/i.test(value)) return value;
    return 'https://' + value;
  }

  function isParseable(url) {
    try {
      const u = new URL(url);
      return !!u.hostname && (u.protocol === 'http:' || u.protocol === 'https:');
    } catch (e) {
      return false;
    }
  }

  function setBadge(kind, text) {
    if (!caseBadge) return;
    caseBadge.className = 'badge' + (kind ? ' ' + kind : '');
    caseBadge.textContent = text;
  }

  function setError(msg) {
    if (!formError) return;
    formError.textContent = msg || '';
    formError.hidden = !msg;
  }

  function valuesOf() {
    const out = {};
    fields.forEach(function (f) { out[f.key] = f.el.value.trim(); });
    return out;
  }

  function build() {
    const dest = normaliseDest(destEl.value);
    const values = valuesOf();
    const supplied = fields.filter(function (f) { return values[f.key]; });

    if (!dest) {
      setError('');
      if (destHint) destHint.className = 'field-hint';
      destEl.classList.remove('invalid');
      return { url: '', tags: [], dest: '', supplied: supplied };
    }

    if (!isParseable(dest)) {
      setError('That does not look like a valid URL. Check the address and try again.');
      destEl.classList.add('invalid');
      return { url: '', tags: [], dest: '', supplied: supplied, invalid: true };
    }

    setError('');
    destEl.classList.remove('invalid');

    let url;
    try {
      url = new URL(dest);
    } catch (e) {
      setError('That does not look like a valid URL. Check the address and try again.');
      destEl.classList.add('invalid');
      return { url: '', tags: [], dest: '', supplied: supplied, invalid: true };
    }

    const tags = [];
    supplied.forEach(function (f) {
      const value = values[f.key];
      url.searchParams.set(f.key, value);
      tags.push({ key: f.key, value: value });
    });

    return { url: url.toString(), tags: tags, dest: dest, supplied: supplied };
  }

  function renderRows(tags) {
    if (!tagRows) return;
    tagRows.textContent = '';
    if (!tags.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 2;
      td.style.textAlign = 'left';
      td.className = 'mono';
      td.textContent = 'No tags yet';
      tr.appendChild(td);
      tagRows.appendChild(tr);
    } else {
      tags.forEach(function (tag) {
        const tr = document.createElement('tr');
        const k = document.createElement('td');
        k.textContent = tag.key;
        const v = document.createElement('td');
        v.textContent = tag.value;
        tr.appendChild(k);
        tr.appendChild(v);
        tagRows.appendChild(tr);
      });
    }
    if (tagCount) tagCount.textContent = tags.length + ' of 5';
  }

  function update() {
    const result = build();
    const values = valuesOf();
    const destRaw = destEl.value.trim();

    let url = result.url;

    /* badge priority: invalid URL, missing URL, nothing to tag, messy tags, clean tags */
    if (result.invalid) {
      setBadge('bad', 'Invalid URL');
    } else if (!destRaw) {
      setBadge('', 'Waiting for a URL');
    } else if (!result.supplied.length) {
      setBadge('', 'Add a source or medium');
    } else {
      const messy = result.supplied.filter(function (f) {
        const value = values[f.key];
        return /[A-Z]/.test(value) || /\s/.test(value);
      });
      if (messy.length) {
        setBadge('warn', 'Uppercase or spaces in ' + messy.map(function (f) { return f.key.replace('utm_', ''); }).join(', '));
      } else {
        setBadge('ok', 'Tags look clean');
      }
    }

    lastUrl = url;
    if (finalUrl) finalUrl.value = url;
    renderRows(result.tags);

    const usable = !!url;
    if (copyBtn) copyBtn.disabled = !usable;
    if (openLink) openLink.disabled = !usable;
  }

  const schedule = CT.debounce(update, 80);
  destEl.addEventListener('input', schedule);
  fields.forEach(function (f) { f.el.addEventListener('input', schedule); });

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (!lastUrl) return;
      CT.copy(lastUrl).then(function (ok) {
        CT.toast(ok ? 'Tagged link copied' : 'Could not copy', ok ? '' : 'err');
      }, function () {
        CT.toast('Could not copy', 'err');
      });
    });
  }

  if (openLink) {
    openLink.addEventListener('click', function () {
      if (!lastUrl) return;
      window.open(lastUrl, '_blank', 'noopener');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      destEl.value = '';
      fields.forEach(function (f) { f.el.value = ''; });
      update();
      destEl.focus();
    });
  }

  update();
})();
