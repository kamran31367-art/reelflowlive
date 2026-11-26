/* YouTube Thumbnail Downloader */
(function () {
  const CT = window.CT;
  const form = document.getElementById('thumbForm');
  if (!form) return;

  const input = document.getElementById('videoUrl');
  const hint = document.getElementById('thumbHint');
  const img = document.getElementById('thumbImg');
  const placeholder = document.getElementById('thumbPlaceholder');
  const fileNameEl = document.getElementById('thumbFileName');
  const idEl = document.getElementById('thumbId');
  const dimsEl = document.getElementById('thumbDims');
  const statusEl = document.getElementById('thumbStatus');
  const downloadBtn = document.getElementById('downloadThumb');
  const copyBtn = document.getElementById('copyThumbUrl');
  const openLink = document.getElementById('openThumb');
  const sizeButtons = CT.$$('.size-btn');

  const SIZES = [
    { key: 'maxresdefault', label: 'Max', w: 1280, h: 720 },
    { key: 'sddefault', label: 'HD', w: 640, h: 480 },
    { key: 'hqdefault', label: 'HQ', w: 480, h: 360 },
    { key: 'mqdefault', label: 'MQ', w: 320, h: 180 }
  ];
  const byKey = {};
  SIZES.forEach(function (s) { byKey[s.key] = s; });

  let videoId = null;
  let selected = null;
  let available = {};
  let loadToken = 0;

  function urlFor(id, size) {
    return 'https://i.ytimg.com/vi/' + id + '/' + size.key + '.jpg';
  }

  function extractId(raw) {
    const text = String(raw || '').trim();
    if (!text) return null;
    if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;

    try {
      const url = new URL(/^https?:\/\//i.test(text) ? text : 'https://' + text);
      const v = url.searchParams.get('v');
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      if (url.hostname === 'youtu.be' || url.hostname.endsWith('.youtu.be')) {
        const id = url.pathname.split('/').filter(Boolean)[0];
        if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
      }
      const m = url.pathname.match(/\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[1];
    } catch (e) { /* fall through to regex */ }

    const m = text.match(/(?:v=|\/)([A-Za-z0-9_-]{11})(?:[&?/]|$)/);
    return m ? m[1] : null;
  }

  function setStatus(text, cls) {
    statusEl.textContent = text;
    statusEl.className = cls || '';
  }

  function setHint(msg) {
    hint.textContent = msg;
    hint.hidden = false;
    hint.className = 'field-hint err';
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearHint() {
    hint.hidden = true;
    hint.className = 'field-hint';
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
  }

  function markButtons() {
    sizeButtons.forEach(function (btn) {
      const key = btn.getAttribute('data-size');
      const ok = !!available[key];
      btn.classList.toggle('off', !ok && !!videoId);
      btn.classList.toggle('on', key === selected);
      btn.setAttribute('aria-pressed', key === selected ? 'true' : 'false');
    });
  }

  function resetPreview(message) {
    img.hidden = true;
    img.removeAttribute('src');
    placeholder.hidden = false;
    placeholder.textContent = message;
    downloadBtn.disabled = true;
    copyBtn.disabled = true;
  }

  function checkAvailability(id) {
    available = {};
    return Promise.all(SIZES.map(function (size) {
      return new Promise(function (resolve) {
        const probe = new Image();
        let done = false;
        function finish(ok) {
          if (done) return;
          done = true;
          available[size.key] = ok;
          resolve();
        }
        probe.onload = function () { finish(probe.naturalWidth > 120); };
        probe.onerror = function () { finish(false); };
        probe.src = urlFor(id, size);
        setTimeout(function () { finish(false); }, 8000);
      });
    }));
  }

  function selectSize(key, token) {
    if (!videoId || !byKey[key]) return;
    const size = byKey[key];
    selected = key;
    markButtons();
    fileNameEl.textContent = size.key + '.jpg';
    dimsEl.textContent = '—';
    openLink.hidden = true;
    downloadBtn.disabled = true;
    copyBtn.disabled = true;

    if (!available[key]) {
      resetPreview('This size is not available for this video.');
      setStatus('Not available at ' + size.w + '×' + size.h + '. Pick another size.', 'size-bad');
      return;
    }

    if (token !== loadToken) return;
    placeholder.hidden = false;
    placeholder.textContent = 'Loading thumbnail…';
    img.hidden = true;
    setStatus('Loading…', '');

    const url = urlFor(videoId, size);
    img.onload = function () {
      if (token !== loadToken) return;
      if (img.naturalWidth <= 120) {
        available[key] = false;
        markButtons();
        resetPreview('This size is not available for this video.');
        setStatus('Not available at ' + size.w + '×' + size.h + '.', 'size-bad');
        return;
      }
      placeholder.hidden = true;
      img.hidden = false;
      dimsEl.textContent = img.naturalWidth + '×' + img.naturalHeight;
      setStatus('Ready - right-click or use Download.', 'size-ok');
      downloadBtn.disabled = false;
      copyBtn.disabled = false;
      openLink.href = url;
      openLink.hidden = false;
    };
    img.onerror = function () {
      if (token !== loadToken) return;
      available[key] = false;
      markButtons();
      resetPreview('This size is not available for this video.');
      setStatus('Could not load this size.', 'size-bad');
    };
    img.alt = 'YouTube thumbnail at ' + size.w + ' by ' + size.h;
    img.referrerPolicy = 'no-referrer';
    img.src = url;
  }

  async function run(raw) {
    const id = extractId(raw);
    if (!id) {
      setHint('That does not look like a YouTube link. Paste a full video URL or an 11-character video ID.');
      return;
    }
    clearHint();
    const token = ++loadToken;
    videoId = id;
    selected = null;
    idEl.textContent = id;
    fileNameEl.textContent = '—';
    resetPreview('Checking available sizes…');
    setStatus('Checking available sizes…', '');
    markButtons();

    await checkAvailability(id);
    if (token !== loadToken) return;

    const best = SIZES.filter(function (s) { return available[s.key]; })[0];
    if (!best) {
      resetPreview('No public thumbnail was found for this video.');
      setStatus('No thumbnail found for this video.', 'size-bad');
      return;
    }
    selectSize(best.key, token);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run(input.value);
  });

  input.addEventListener('input', clearHint);

  sizeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!videoId) return;
      selectSize(btn.getAttribute('data-size'), loadToken);
    });
  });

  downloadBtn.addEventListener('click', async function () {
    if (!videoId || !selected || !available[selected]) return;
    const size = byKey[selected];
    const url = urlFor(videoId, size);
    const filename = 'youtube-' + videoId + '-' + size.key + '.jpg';
    downloadBtn.disabled = true;
    try {
      const res = await fetch(url, { mode: 'cors', cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      if (!blob.size || blob.type.indexOf('image') === -1) throw new Error('Not an image');
      CT.downloadBlob(blob, filename);
      CT.toast('Saved ' + filename);
    } catch (e) {
      window.open(url, '_blank', 'noopener');
      CT.toast('Opened the image in a new tab - right-click and save it.', 'err');
    } finally {
      downloadBtn.disabled = false;
    }
  });

  copyBtn.addEventListener('click', function () {
    if (!videoId || !selected || !available[selected]) return;
    CT.copy(urlFor(videoId, byKey[selected])).then(function (ok) {
      CT.toast(ok ? 'Image URL copied' : 'Could not copy', ok ? '' : 'err');
    });
  });

  const preset = new URLSearchParams(location.search).get('v');
  if (preset) {
    const id = extractId(preset);
    if (id) {
      input.value = 'https://www.youtube.com/watch?v=' + id;
      run(input.value);
    }
  }
})();
