/* Video Frame Grabber - seek a video and save one frame as a full-resolution PNG */
(function () {
  const CT = window.CT;
  const dropzone = document.getElementById('grabDropzone');
  if (!dropzone || !CT) return;

  const fileInput = document.getElementById('grabFile');
  const info = document.getElementById('grabInfo');
  const nameEl = document.getElementById('grabName');
  const bytesEl = document.getElementById('grabBytes');
  const dimsEl = document.getElementById('grabDims');
  const durationEl = document.getElementById('grabDuration');

  const video = document.getElementById('grabVideo');
  const videoEmpty = document.getElementById('grabVideoEmpty');

  const rangeInput = document.getElementById('grabRange');
  const rangeValue = document.getElementById('grabRangeValue');
  const timeInput = document.getElementById('grabTime');
  const timeHint = document.getElementById('grabTimeHint');
  const minusBtn = document.getElementById('grabMinus');
  const plusBtn = document.getElementById('grabPlus');

  const grabBtn = document.getElementById('grabFrame');
  const downloadBtn = document.getElementById('grabDownload');
  const errorEl = document.getElementById('grabError');
  const hint = document.getElementById('grabHint');

  const previewCanvas = document.getElementById('grabPreviewCanvas');
  const previewEmpty = document.getElementById('grabPreviewEmpty');
  const fullCanvas = document.getElementById('grabFullCanvas');
  const fullEmpty = document.getElementById('grabFullEmpty');
  const fullMeta = document.getElementById('grabFullMeta');
  const fullSize = document.getElementById('grabFullSize');
  const fullTime = document.getElementById('grabFullTime');
  const fullBytes = document.getElementById('grabFullBytes');

  const MAX_PREVIEW = 640;
  const FALLBACK_DURATION = 300;
  const previewCtx = previewCanvas ? previewCanvas.getContext('2d') : null;
  const fullCtx = fullCanvas ? fullCanvas.getContext('2d') : null;

  let file = null;
  let objectUrl = '';
  let duration = 0;
  let ready = false;
  let seekId = 0;
  let currentTime = 0;
  let grabbedAt = -1;
  let pngBlob = null;
  let pngUrl = '';

  function clampTime(t) {
    const max = duration > 0 ? duration : FALLBACK_DURATION;
    if (!isFinite(t)) return 0;
    return Math.max(0, Math.min(t, max));
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function setHint(text) {
    if (hint) hint.textContent = text;
  }

  function markTimeInvalid(bad) {
    if (timeInput) {
      timeInput.classList.toggle('invalid', bad);
      if (bad) timeInput.setAttribute('aria-invalid', 'true');
      else timeInput.removeAttribute('aria-invalid');
    }
    if (timeHint) timeHint.classList.toggle('err', bad);
  }

  function clearOutput() {
    pngBlob = null;
    grabbedAt = -1;
    if (pngUrl) {
      URL.revokeObjectURL(pngUrl);
      pngUrl = '';
    }
    if (downloadBtn) downloadBtn.disabled = true;
    if (fullCanvas) fullCanvas.hidden = true;
    if (fullEmpty) fullEmpty.hidden = false;
    if (fullMeta) fullMeta.hidden = true;
  }

  function setControlsEnabled(on) {
    if (rangeInput) rangeInput.disabled = !on;
    if (timeInput) timeInput.disabled = !on;
    if (minusBtn) minusBtn.disabled = !on;
    if (plusBtn) plusBtn.disabled = !on;
    if (grabBtn) grabBtn.disabled = !on;
  }

  function updateLabels(t) {
    const text = t.toFixed(2) + ' s';
    if (rangeValue) rangeValue.textContent = text;
    if (timeInput && document.activeElement !== timeInput) timeInput.value = t.toFixed(2);
    if (rangeInput && Math.abs(Number(rangeInput.value) - t) > 0.001) rangeInput.value = String(t);
  }

  /* ---------- loading ---------- */

  function loadFile(f) {
    if (!f) return;
    ready = false;
    seekId++;
    clearError();
    clearOutput();
    setControlsEnabled(false);

    file = f;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(f);

    if (nameEl) nameEl.textContent = f.name;
    if (bytesEl) bytesEl.textContent = CT.fmtBytes(f.size);
    if (dimsEl) dimsEl.textContent = 'reading…';
    if (durationEl) durationEl.textContent = 'reading…';
    if (info) info.hidden = false;
    if (videoEmpty) videoEmpty.hidden = true;
    if (video) {
      video.hidden = false;
      video.src = objectUrl;
      video.load();
    }
    if (previewEmpty) previewEmpty.hidden = false;
    if (previewCanvas) previewCanvas.hidden = true;
    setHint('Loading video…');
  }

  function onVideoError() {
    if (!file) return;
    ready = false;
    const label = file.name;
    if (dimsEl) dimsEl.textContent = 'unreadable';
    if (durationEl) durationEl.textContent = 'unreadable';
    setControlsEnabled(false);
    setHint('Cannot decode this video');
    if (videoEmpty) {
      videoEmpty.textContent = 'This browser cannot decode ' + label + '.';
      videoEmpty.hidden = false;
    }
    if (video) video.hidden = true;
    showError('The browser cannot decode "' + label + '". Try an MP4 (H.264) or WebM file, or convert it first.');
    CT.toast('Cannot decode ' + label, 'bad');
  }

  function onVideoMeta() {
    if (!video || !file) return;
    /* Streamed or recorded WebM files may report no duration; the slider then spans a safe default. */
    duration = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (dimsEl) dimsEl.textContent = w && h ? w + ' x ' + h : 'unknown';
    if (durationEl) {
      durationEl.textContent = duration > 0
        ? CT.formatClock(duration) + ' (' + duration.toFixed(2) + ' s)'
        : 'unknown (stream)';
    }
    if (!w || !h) {
      onVideoError();
      return;
    }
    ready = true;
    clearError();
    setControlsEnabled(true);
    if (rangeInput) {
      rangeInput.max = String(Math.max(0, duration || FALLBACK_DURATION));
      rangeInput.step = '0.05';
    }
    setHint(duration > 0 ? 'Ready - move to a second' : 'Ready - duration unknown, slider spans 5 minutes');
    seekAndRender(0);
  }

  /* ---------- seeking and preview ---------- */

  function seekTo(t) {
    return new Promise(function (resolve, reject) {
      if (!video) {
        reject(new Error('no video'));
        return;
      }
      const target = duration > 0 ? Math.min(t, Math.max(0, duration - 0.001)) : t;
      let done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onErr);
        if (ok) resolve();
        else reject(new Error('seek failed'));
      }
      function onSeeked() { finish(true); }
      function onErr() { finish(false); }
      video.addEventListener('seeked', onSeeked);
      video.addEventListener('error', onErr);
      try {
        video.currentTime = target;
      } catch (e) {
        finish(false);
        return;
      }
      setTimeout(function () { finish(false); }, 8000);
    });
  }

  function drawPreview() {
    if (!video || !previewCanvas || !previewCtx) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;
    const width = Math.min(MAX_PREVIEW, w);
    const height = Math.max(1, Math.round((width * h) / w));
    if (previewCanvas.width !== width || previewCanvas.height !== height) {
      previewCanvas.width = width;
      previewCanvas.height = height;
    }
    previewCtx.drawImage(video, 0, 0, width, height);
    previewCanvas.hidden = false;
    if (previewEmpty) previewEmpty.hidden = true;
  }

  async function seekAndRender(t) {
    if (!ready || !video) return;
    const target = clampTime(t);
    currentTime = target;
    updateLabels(target);
    const id = ++seekId;
    try {
      await seekTo(target);
    } catch (e) {
      if (id !== seekId) return;
      showError('The browser could not seek to ' + target.toFixed(2) + ' s in this video.');
      return;
    }
    if (id !== seekId) return;
    drawPreview();
    setHint('Preview at ' + target.toFixed(2) + ' s');
  }

  const seekSoon = CT.debounce(function (t) { seekAndRender(t); }, 60);

  /* ---------- grabbing ---------- */

  function grabFrame() {
    if (!ready || !video || !fullCanvas || !fullCtx) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) {
      showError('This video has no readable frame size.');
      return;
    }
    fullCanvas.width = w;
    fullCanvas.height = h;
    try {
      fullCtx.drawImage(video, 0, 0, w, h);
    } catch (e) {
      showError('The browser refused to draw this frame to a canvas.');
      return;
    }
    fullCanvas.hidden = false;
    if (fullEmpty) fullEmpty.hidden = true;
    grabbedAt = currentTime;

    if (fullSize) fullSize.textContent = w + ' x ' + h;
    if (fullTime) fullTime.textContent = currentTime.toFixed(2) + ' s';
    if (fullMeta) fullMeta.hidden = false;
    if (fullBytes) fullBytes.textContent = 'rendering…';

    if (downloadBtn) downloadBtn.disabled = true;
    if (pngUrl) {
      URL.revokeObjectURL(pngUrl);
      pngUrl = '';
    }
    pngBlob = null;

    const id = seekId;
    fullCanvas.toBlob(function (blob) {
      if (id !== seekId) return;
      if (!blob) {
        if (fullBytes) fullBytes.textContent = 'failed';
        showError('The browser could not create the PNG.');
        return;
      }
      pngBlob = blob;
      if (fullBytes) fullBytes.textContent = CT.fmtBytes(blob.size);
      if (downloadBtn) downloadBtn.disabled = false;
      setHint('Frame grabbed at ' + grabbedAt.toFixed(2) + ' s');
    }, 'image/png');
  }

  function frameName() {
    const base = CT.baseName(file ? file.name : 'video');
    return base + '-frame-' + currentTime.toFixed(2) + 's.png';
  }

  /* ---------- UI wiring ---------- */

  dropzone.addEventListener('click', function () {
    if (fileInput) fileInput.click();
  });
  dropzone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (fileInput) fileInput.click();
    }
  });
  ['dragenter', 'dragover'].forEach(function (type) {
    dropzone.addEventListener(type, function (e) {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'dragend'].forEach(function (type) {
    dropzone.addEventListener(type, function () {
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) loadFile(files[0]);
  });
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files.length) loadFile(fileInput.files[0]);
      fileInput.value = '';
    });
  }

  if (video) {
    video.addEventListener('loadedmetadata', onVideoMeta);
    video.addEventListener('error', onVideoError);
  }

  if (rangeInput) {
    rangeInput.addEventListener('input', function () {
      const t = clampTime(Number(rangeInput.value));
      currentTime = t;
      updateLabels(t);
      seekSoon(t);
    });
  }

  if (timeInput) {
    const commit = function () {
      const t = CT.parseClock(timeInput.value);
      if (t == null) {
        markTimeInvalid(true);
        return;
      }
      markTimeInvalid(false);
      clearError();
      seekAndRender(t);
    };
    timeInput.addEventListener('change', commit);
    timeInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      }
    });
    timeInput.addEventListener('input', function () {
      const t = CT.parseClock(timeInput.value);
      markTimeInvalid(t == null);
      if (t == null || !ready) return;
      const clamped = clampTime(t);
      currentTime = clamped;
      if (rangeValue) rangeValue.textContent = clamped.toFixed(2) + ' s';
      if (rangeInput) rangeInput.value = String(clamped);
      seekSoon(clamped);
    });
  }

  function step(delta) {
    if (!ready) return;
    seekAndRender(currentTime + delta);
  }

  if (minusBtn) minusBtn.addEventListener('click', function () { step(-0.1); });
  if (plusBtn) plusBtn.addEventListener('click', function () { step(0.1); });
  if (grabBtn) grabBtn.addEventListener('click', grabFrame);
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      if (!pngBlob) return;
      const filename = frameName();
      CT.downloadBlob(pngBlob, filename);
      CT.toast('Saved ' + filename);
    });
  }

  setControlsEnabled(false);
  updateLabels(0);
  clearOutput();
})();
