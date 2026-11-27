/* Video to GIF - capture a short clip to frames, encode with gif.js in workers */
(function () {
  const CT = window.CT;
  const dropzone = document.getElementById('gifDropzone');
  if (!dropzone || !CT) return;

  const fileInput = document.getElementById('gifFile');
  const info = document.getElementById('gifInfo');
  const nameEl = document.getElementById('gifName');
  const bytesEl = document.getElementById('gifBytes');
  const dimsEl = document.getElementById('gifDims');
  const durationEl = document.getElementById('gifDuration');

  const video = document.getElementById('gifVideo');
  const videoEmpty = document.getElementById('gifVideoEmpty');

  const startInput = document.getElementById('gifStart');
  const startHint = document.getElementById('gifStartHint');
  const useCurrentBtn = document.getElementById('gifUseCurrent');
  const lengthInput = document.getElementById('gifLength');
  const lengthValue = document.getElementById('gifLengthValue');
  const widthSeg = document.getElementById('gifWidthSeg');
  const widthHidden = document.getElementById('gifWidth');
  const fpsSeg = document.getElementById('gifFpsSeg');
  const fpsHidden = document.getElementById('gifFps');
  const speedSeg = document.getElementById('gifSpeedSeg');
  const speedHidden = document.getElementById('gifSpeed');
  const qualityInput = document.getElementById('gifQuality');
  const qualityValue = document.getElementById('gifQualityValue');

  const makeBtn = document.getElementById('gifMake');
  const cancelBtn = document.getElementById('gifCancel');
  const downloadBtn = document.getElementById('gifDownload');
  const errorEl = document.getElementById('gifError');

  const hint = document.getElementById('gifHint');
  const progressWrap = document.getElementById('gifProgressWrap');
  const progressBar = document.getElementById('gifProgress');
  const progressFill = document.getElementById('gifProgressFill');
  const progressLabel = document.getElementById('gifProgressLabel');
  const previewBox = document.getElementById('gifPreviewBox');
  const previewImg = document.getElementById('gifPreview');
  const resultMeta = document.getElementById('gifResultMeta');
  const framesEl = document.getElementById('gifFrames');
  const resultBytesEl = document.getElementById('gifResultBytes');
  const emptyEl = document.getElementById('gifEmpty');

  const WORKER_URL = '/assets/js/vendor/gif/gif.worker.js';
  const MAX_SIDE = 640;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let file = null;
  let objectUrl = '';
  let duration = 0;
  let running = false;
  let runToken = 0;
  let gif = null;
  let gifBlob = null;
  let gifUrl = '';

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

  function setRunning(on) {
    running = on;
    if (makeBtn) makeBtn.disabled = on || !file;
    if (cancelBtn) cancelBtn.disabled = !on;
    if (fileInput) fileInput.disabled = on;
  }

  function clearResult() {
    gifBlob = null;
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
      gifUrl = '';
    }
    if (previewImg) {
      previewImg.removeAttribute('src');
      previewImg.hidden = true;
    }
    if (previewBox) previewBox.hidden = true;
    if (downloadBtn) downloadBtn.disabled = true;
    if (resultMeta) resultMeta.hidden = true;
    if (emptyEl) emptyEl.hidden = false;
  }

  function setProgress(ratio, label) {
    const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(pct));
    if (progressLabel && label) progressLabel.textContent = label;
  }

  function segmentValue(seg, attr, hidden, fallback) {
    if (!seg) return fallback;
    const on = seg.querySelector('button[aria-pressed="true"]');
    const value = on ? Number(on.getAttribute(attr)) : fallback;
    if (hidden) hidden.value = String(value);
    return value;
  }

  /* One toggle handler per segmented control: flips the pressed state, then stores its value. */
  function bindSeg(seg, attr, hidden, fallback) {
    if (!seg) return;
    seg.addEventListener('click', function (e) {
      const node = e.target instanceof Element ? e.target : e.target && e.target.parentElement;
      const btn = node && node.closest ? node.closest('button') : null;
      if (!btn || !seg.contains(btn)) return;
      CT.$$('button', seg).forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (hidden) hidden.value = btn.getAttribute(attr) || String(fallback);
    });
  }

  /* ---------- loading ---------- */

  function loadFile(f) {
    if (!f) return;
    if (!/^video\//.test(f.type) && !f.type) {
      CT.toast('That file is not a video.', 'bad');
      return;
    }
    clearResult();
    clearError();
    runToken++;
    setRunning(false);

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
    if (makeBtn) makeBtn.disabled = true;
    setHint('Loading video…');
  }

  function onVideoError() {
    if (!file) return;
    const label = file.name;
    if (dimsEl) dimsEl.textContent = 'unreadable';
    if (durationEl) durationEl.textContent = 'unreadable';
    setHint('Cannot decode this video');
    if (makeBtn) makeBtn.disabled = true;
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
    /* Some WebM files (screen recordings, MediaRecorder output) report no duration at all. */
    duration = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (dimsEl) dimsEl.textContent = w && h ? w + ' x ' + h : 'unknown';
    if (durationEl) {
      durationEl.textContent = duration > 0 ? CT.formatClock(duration) + ' (' + duration.toFixed(2) + ' s)' : 'unknown (stream)';
    }
    if (!w || !h) {
      onVideoError();
      return;
    }
    clearError();
    if (makeBtn) makeBtn.disabled = running;
    setHint(duration > 0 ? 'Ready - set the range and make the GIF' : 'Ready - this file reports no duration; seek is unchecked');
    if (progressWrap) progressWrap.hidden = true;
  }

  /* ---------- seeking and frames ---------- */

  function seekTo(t) {
    return new Promise(function (resolve, reject) {
      if (!video) {
        reject(new Error('no video'));
        return;
      }
      const target = Math.max(0, Math.min(t, Math.max(0, duration - 0.001)));
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

  function targetSize() {
    const w = video ? video.videoWidth : 0;
    const h = video ? video.videoHeight : 0;
    const wanted = Number(widthHidden && widthHidden.value) || 480;
    const width = Math.max(16, Math.min(MAX_SIDE, Math.round(wanted)));
    const height = w && h ? Math.max(2, Math.round((width * h) / w)) : width;
    return { width: width, height: height };
  }

  async function makeGif() {
    if (!video || !file || running) return;
    const start = CT.parseClock(startInput ? startInput.value : '0');
    if (start == null || start < 0) {
      showError('Start time is not a valid time. Use seconds like 2.5 or m:ss like 0:12.');
      if (startInput) startInput.focus();
      return;
    }
    if (duration && start >= duration) {
      showError('Start time is past the end of this video (' + duration.toFixed(2) + ' s).');
      return;
    }
    clearError();

    const length = Math.max(1, Math.min(8, Number(lengthInput && lengthInput.value) || 3));
    const fps = Math.max(1, Math.min(30, Number(fpsHidden && fpsHidden.value) || 10));
    const speed = Math.max(0.1, Math.min(4, Number(speedHidden && speedHidden.value) || 1));
    const quality = Math.max(1, Math.min(30, Number(qualityInput && qualityInput.value) || 10));
    const size = targetSize();
    const token = ++runToken;

    video.pause();
    clearResult();
    if (typeof window.GIF !== 'function') {
      showError('The GIF encoder did not load. Reload the page and try again.');
      return;
    }

    canvas.width = size.width;
    canvas.height = size.height;
    gif = new window.GIF({
      workers: 2,
      quality: quality,
      width: size.width,
      height: size.height,
      workerScript: WORKER_URL,
      transparent: null
    });

    if (progressWrap) progressWrap.hidden = false;
    setProgress(0, 'Capturing frames…');
    setRunning(true);
    setHint('Encoding…');
    if (emptyEl) emptyEl.hidden = true;

    gif.on('progress', function (p) {
      if (token !== runToken) return;
      const ratio = typeof p === 'number' ? p : 0;
      setProgress(ratio, 'Encoding ' + Math.round(ratio * 100) + '%');
    });
    gif.on('finished', function (blob) {
      if (token !== runToken) return;
      gif = null;
      setRunning(false);
      gifBlob = blob;
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      gifUrl = URL.createObjectURL(blob);
      if (previewImg) {
        previewImg.src = gifUrl;
        previewImg.hidden = false;
        previewImg.addEventListener('load', function () {
          setHint(previewImg.naturalWidth + ' x ' + previewImg.naturalHeight + ' GIF');
        }, { once: true });
      }
      if (previewBox) previewBox.hidden = false;
      if (downloadBtn) downloadBtn.disabled = false;
      setProgress(1, 'Done - ' + CT.fmtBytes(blob.size));
      if (resultMeta) resultMeta.hidden = false;
      if (resultBytesEl) resultBytesEl.textContent = CT.fmtBytes(blob.size);
    });

    const count = Math.max(2, Math.round(length * fps));
    const step = 1 / fps;
    const delay = Math.max(20, Math.round((1000 / fps) / speed));
    let captured = 0;

    for (let i = 0; i < count; i++) {
      if (token !== runToken) return;
      const t = start + i * step;
      try {
        await seekTo(t);
      } catch (e) {
        if (token !== runToken) return;
        failRun('The browser could not seek through "' + file.name + '". Try a shorter range or another file.');
        return;
      }
      if (token !== runToken) return;
      ctx.drawImage(video, 0, 0, size.width, size.height);
      gif.addFrame(ctx, { delay: delay, copy: true });
      captured++;
      setProgress((captured / count) * 0.4, 'Capturing frame ' + captured + ' of ' + count);
    }

    if (framesEl) framesEl.textContent = String(captured) + ' at ' + fps + ' fps';
    setProgress(0.4, 'Encoding…');
    try {
      gif.render();
    } catch (e) {
      failRun('The GIF encoder failed: ' + (e && e.message ? e.message : 'unknown error'));
    }
  }

  function failRun(msg) {
    gif = null;
    setRunning(false);
    showError(msg);
    setHint('Failed');
    setProgress(0, 'Failed');
    CT.toast('Could not make the GIF', 'bad');
  }

  function cancelRun() {
    if (!running) return;
    runToken++;
    if (gif) {
      try { gif.abort(); } catch (e) { /* already finished */ }
      gif = null;
    }
    setRunning(false);
    setProgress(0, 'Cancelled');
    setHint('Cancelled');
    CT.toast('GIF cancelled');
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

  bindSeg(widthSeg, 'data-width', widthHidden, 480);
  bindSeg(fpsSeg, 'data-fps', fpsHidden, 10);
  bindSeg(speedSeg, 'data-speed', speedHidden, 1);

  if (lengthInput) {
    lengthInput.addEventListener('input', function () {
      if (lengthValue) lengthValue.textContent = Number(lengthInput.value).toFixed(1).replace(/\.0$/, '') + ' s';
    });
  }

  if (qualityInput) {
    qualityInput.addEventListener('input', function () {
      if (qualityValue) qualityValue.textContent = String(qualityInput.value);
    });
  }

  if (useCurrentBtn) {
    useCurrentBtn.addEventListener('click', function () {
      if (!video || !file) return;
      const t = video.currentTime || 0;
      if (startInput) startInput.value = t.toFixed(2);
      clearError();
    });
  }

  if (startHint) startHint.classList.remove('err');
  if (startInput) {
    startInput.addEventListener('blur', function () {
      const v = CT.parseClock(startInput.value);
      if (v == null) {
        startInput.setAttribute('aria-invalid', 'true');
        startInput.classList.add('invalid');
        if (startHint) startHint.classList.add('err');
      } else {
        startInput.removeAttribute('aria-invalid');
        startInput.classList.remove('invalid');
        if (startHint) startHint.classList.remove('err');
      }
    });
  }

  if (makeBtn) makeBtn.addEventListener('click', makeGif);
  if (cancelBtn) cancelBtn.addEventListener('click', cancelRun);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      if (!gifBlob) return;
      const base = CT.baseName(file ? file.name : 'clip');
      const filename = base + '.gif';
      CT.downloadBlob(gifBlob, filename);
      CT.toast('Saved ' + filename);
    });
  }

  segmentValue(widthSeg, 'data-width', widthHidden, 480);
  segmentValue(fpsSeg, 'data-fps', fpsHidden, 10);
  segmentValue(speedSeg, 'data-speed', speedHidden, 1);
  clearResult();
  setRunning(false);
})();
