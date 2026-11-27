/* YouTube Timestamp Link */
(function () {
  const CT = window.CT;
  const videoInput = document.getElementById('videoInput');
  if (!videoInput || !CT) return;

  const timeInput = document.getElementById('timeInput');
  const videoHint = document.getElementById('videoHint');
  const timeHint = document.getElementById('timeHint');
  const resultHint = document.getElementById('resultHint');
  const outId = document.getElementById('outId');
  const outSeconds = document.getElementById('outSeconds');
  const outClock = document.getElementById('outClock');
  const outShort = document.getElementById('outShort');
  const outWatch = document.getElementById('outWatch');
  const outEmbed = document.getElementById('outEmbed');
  const outComment = document.getElementById('outComment');
  const copyShort = document.getElementById('copyShort');
  const copyWatch = document.getElementById('copyWatch');
  const copyEmbed = document.getElementById('copyEmbed');
  const copyComment = document.getElementById('copyComment');
  const copyCommentLink = document.getElementById('copyCommentLink');
  const resetBtn = document.getElementById('resetBtn');

  const ID_RE = /^[A-Za-z0-9_-]{11}$/;
  const DEFAULT_VIDEO_HINT = 'Watch, youtu.be, Shorts, Live and embed links all work, or paste the 11-character ID.';
  const DEFAULT_TIME_HINT = 'Use seconds (102), m:ss (1:42) or h:mm:ss (1:02:03).';

  /* Returns { id, url } where url is a cleaned watch URL base or null. */
  function parseVideo(raw) {
    const text = String(raw || '').trim();
    if (!text) return { id: null, url: null, empty: true };
    if (ID_RE.test(text)) return { id: text, url: null, empty: false };

    if (!/^https?:\/\//i.test(text) && /^(?:www\.|m\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be)\//i.test(text)) {
      return parseVideo('https://' + text);
    }
    if (!/^https?:\/\//i.test(text)) return { id: null, url: null, empty: false };

    let url;
    try {
      url = new URL(text);
    } catch (e) {
      return { id: null, url: null, empty: false };
    }

    const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
    let id = null;

    if (host === 'youtu.be') {
      const first = url.pathname.split('/').filter(Boolean)[0];
      if (first && ID_RE.test(first)) id = first;
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'music.youtube.com') {
      const v = url.searchParams.get('v');
      if (v && ID_RE.test(v)) {
        id = v;
      } else {
        const m = url.pathname.match(/^\/(?:shorts|live|embed|v)\/([A-Za-z0-9_-]{11})(?:\/|$)/);
        if (m) id = m[1];
      }
    }

    if (!id) return { id: null, url: null, empty: false };

    /* Keep the rest of the query (playlist, feature, share tag) but drop time keys. */
    const params = new URLSearchParams();
    url.searchParams.forEach(function (value, key) {
      const lower = key.toLowerCase();
      if (lower === 't' || lower === 'start' || lower === 'time_continue' || lower === 'v') return;
      params.append(key, value);
    });
    const extra = params.toString();
    const base = 'https://www.youtube.com/watch?v=' + id + (extra ? '&' + extra : '');
    return { id: id, url: base, empty: false };
  }

  function setHint(el, message, bad, defaultText) {
    const text = bad ? message : defaultText;
    el.textContent = text;
    el.className = bad ? 'field-hint err' : 'field-hint';
    const input = el === videoHint ? videoInput : timeInput;
    if (bad) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
    }
  }

  function clearOutputs() {
    outId.textContent = '—';
    outSeconds.textContent = '—';
    outClock.textContent = '—';
    [outShort, outWatch, outEmbed, outComment].forEach(function (el) {
      el.value = '';
      el.placeholder = 'Waiting for input';
    });
    [copyShort, copyWatch, copyEmbed, copyComment, copyCommentLink].forEach(function (btn) {
      btn.disabled = true;
    });
    resultHint.textContent = 'Waiting for input';
  }

  function update() {
    const video = parseVideo(videoInput.value);
    const timeRaw = timeInput.value.trim();

    clearOutputs();
    setHint(videoHint, 'That link does not contain a YouTube video ID. Paste a full video URL or the 11-character ID.', !video.empty && !video.id, DEFAULT_VIDEO_HINT);

    let secs = null;
    if (timeRaw) {
      secs = CT.parseClock(timeRaw);
      const bad = secs == null;
      setHint(timeHint, 'That time cannot be read. Use seconds, m:ss or h:mm:ss.', bad, DEFAULT_TIME_HINT);
      if (bad) secs = null;
    } else {
      setHint(timeHint, '', false, DEFAULT_TIME_HINT);
    }

    if (video.empty && !timeRaw) return;
    if (!video.id || secs == null) {
      resultHint.textContent = !video.id ? 'Needs a valid video link' : 'Needs a valid time';
      return;
    }

    secs = Math.floor(secs);
    const id = video.id;
    const watchBase = video.url || ('https://www.youtube.com/watch?v=' + id);
    const clock = CT.formatClock(secs);

    outId.textContent = id;
    outSeconds.textContent = String(secs) + ' s';
    outClock.textContent = clock;

    outShort.value = 'https://youtu.be/' + id + '?t=' + secs;
    outWatch.value = watchBase + '&t=' + secs;
    outEmbed.value = 'https://www.youtube.com/embed/' + id + '?start=' + secs;
    outComment.value = clock;

    [outShort, outWatch, outEmbed, outComment].forEach(function (el) {
      el.placeholder = '';
    });
    [copyShort, copyWatch, copyEmbed, copyComment, copyCommentLink].forEach(function (btn) {
      btn.disabled = false;
    });
    resultHint.textContent = 'Ready — opens at ' + clock;
  }

  const scheduleUpdate = CT.debounce(update, 120);

  videoInput.addEventListener('input', scheduleUpdate);
  timeInput.addEventListener('input', scheduleUpdate);

  function wireCopy(btn, getText, label) {
    btn.addEventListener('click', function () {
      const text = getText();
      if (!text) return;
      CT.copy(text).then(function (ok) {
        CT.toast(ok ? label + ' copied' : 'Could not copy - select the text and copy it manually.', ok ? '' : 'err');
      });
    });
  }

  wireCopy(copyShort, function () { return outShort.value; }, 'Short link');
  wireCopy(copyWatch, function () { return outWatch.value; }, 'Watch link');
  wireCopy(copyEmbed, function () { return outEmbed.value; }, 'Embed link');
  wireCopy(copyComment, function () { return outComment.value; }, 'Timestamp');
  wireCopy(copyCommentLink, function () {
    return outComment.value ? '[' + outComment.value + '](' + outShort.value + ')' : '';
  }, 'Markdown link');

  resetBtn.addEventListener('click', function () {
    videoInput.value = '';
    timeInput.value = '';
    update();
    videoInput.focus();
  });

  /* A link pasted with its own time parameter fills the time field too. */
  function prefillFromUrl() {
    const params = new URLSearchParams(location.search);
    const vid = params.get('v') || params.get('url');
    const t = params.get('t');
    if (vid) videoInput.value = vid;
    if (t) {
      const secs = CT.parseClock(t.replace(/s$/i, ''));
      if (secs != null) {
        timeInput.value = CT.formatClock(Math.floor(secs));
      }
    }
    update();
  }

  prefillFromUrl();
})();
