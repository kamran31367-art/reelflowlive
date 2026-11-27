/* Audio Speed & Pitch - tape-style speed change, WAV export, waveform PNG */
(function () {
  const CT = window.CT;
  const dropzone = document.getElementById('atDropzone');
  if (!dropzone) return;

  const fileInput = document.getElementById('atFile');
  const errorEl = document.getElementById('atError');
  const info = document.getElementById('atInfo');
  const nameEl = document.getElementById('atName');
  const durationEl = document.getElementById('atDuration');
  const channelsEl = document.getElementById('atChannels');
  const rateEl = document.getElementById('atRate');
  const speedSeg = document.getElementById('atSpeedSeg');
  const speedInput = document.getElementById('atSpeed');
  const pitch = document.getElementById('atPitch');
  const pitchValue = document.getElementById('atPitchValue');
  const result = document.getElementById('atResult');
  const factorEl = document.getElementById('atFactor');
  const outLengthEl = document.getElementById('atOutLength');
  const outPitchEl = document.getElementById('atOutPitch');
  const hint = document.getElementById('atHint');
  const canvas = document.getElementById('atWave');
  const emptyEl = document.getElementById('atEmpty');
  const wavBtn = document.getElementById('atWavBtn');
  const pngBtn = document.getElementById('atPngBtn');
  const progressWrap = document.getElementById('atProgressWrap');
  const progressFill = document.getElementById('atProgress');
  const progressLabel = document.getElementById('atProgressLabel');
  const outEmpty = document.getElementById('atOutEmpty');

  const WAVE_H = 160;
  const PNG_W = 1200;
  const PNG_H = 360;
  const WAVE_COLOR = '#2563eb';
  const MIN_SPAN = 60; /* seconds - short clips sit in a one-minute window */

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;

  let buffer = null;
  let fileName = '';
  let busy = false;
  let restoredPitch = '0';
  let decoder = null;
  let peaksCache = null; /* { key, data } - min/max per pixel for the preview canvas */

  function getDecoder() {
    if (!AudioCtx) return null;
    if (!decoder) decoder = new AudioCtx();
    return decoder;
  }

  function setError(message) {
    if (!errorEl) return;
    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  function clockSecs(secs) {
    if (!isFinite(secs) || secs < 0) return '—';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m + ':' + (s < 10 ? '0' : '') + s.toFixed(3);
  }

  function clockShort(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function num(el, fallback) {
    const v = el ? Number(el.value) : NaN;
    return isFinite(v) ? v : fallback;
  }

  function speedFactor() {
    const speed = num(speedInput, 1);
    const semis = num(pitch, 0);
    return speed * Math.pow(2, semis / 12);
  }

  function setBusy(on) {
    busy = on;
    const usable = !!buffer;
    wavBtn.disabled = on || !usable || !OfflineCtx;
    pngBtn.disabled = on || !usable;
  }

  function setProgress(pct) {
    const v = Math.max(0, Math.min(100, pct));
    if (progressFill) progressFill.style.width = v.toFixed(1) + '%';
    if (progressLabel) progressLabel.textContent = Math.round(v) + '%';
  }

  function setSpeed(value) {
    const v = String(value);
    speedInput.value = v;
    if (!speedSeg) return;
    CT.$$('button', speedSeg).forEach(function (b) {
      const on = b.getAttribute('data-speed') === v;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function updateReadout() {
    const semis = num(pitch, 0);
    pitchValue.textContent = (semis > 0 ? '+' : '') + semis.toFixed(1).replace(/\.0$/, '') + ' st';
    if (buffer) {
      const factor = speedFactor();
      const length = buffer.duration / factor;
      factorEl.textContent = factor.toFixed(2) + 'x';
      outLengthEl.textContent = clockShort(length) + ' (was ' + clockShort(buffer.duration) + ')';
      outPitchEl.textContent = (semis > 0 ? '+' : '') + semis.toFixed(1).replace(/\.0$/, '') + ' st';
      result.hidden = false;
      hint.textContent = semis === 0 && num(speedInput, 1) === 1 ? 'Original timing' : 'Preview of the change';
    }
  }

  /* ---------- waveform ---------- */
  function computePeaks(mix, width) {
    const data = new Float32Array(width * 2);
    const block = mix.length / width;
    for (let x = 0; x < width; x++) {
      const from = Math.floor(x * block);
      const to = Math.min(mix.length, Math.floor((x + 1) * block));
      let min = 0;
      let max = 0;
      for (let i = from; i < to; i++) {
        const s = mix[i];
        if (s < min) min = s;
        if (s > max) max = s;
      }
      data[x * 2] = min;
      data[x * 2 + 1] = max;
    }
    return data;
  }

  function mixBuffer(buf) {
    const chCount = buf.numberOfChannels;
    if (chCount === 1) return buf.getChannelData(0);
    const len = buf.length;
    const out = new Float32Array(len);
    for (let c = 0; c < chCount; c++) {
      const src = buf.getChannelData(c);
      for (let i = 0; i < len; i++) out[i] += src[i] / chCount;
    }
    return out;
  }

  /* Draws one vertical bar per pixel. A column with no samples shows as a thin
     line on the centre so silence reads as silence, not as a click at the edge. */
  function drawPeaks(ctx, peaks, width, y, height, color) {
    ctx.fillStyle = color;
    const mid = y + height / 2;
    const half = height / 2;
    for (let x = 0; x < width; x++) {
      const min = peaks[x * 2];
      const max = peaks[x * 2 + 1];
      if (min === 0 && max === 0) {
        ctx.fillRect(x, mid - 1, 1, 2);
        continue;
      }
      const top = mid - max * half;
      const bottom = mid - Math.min(0, min) * half;
      ctx.fillRect(x, top, 1, Math.max(1, bottom - top));
    }
    ctx.fillStyle = 'rgba(37,99,235,.18)';
    ctx.fillRect(0, mid, width, 1);
  }

  /* Builds the preview peaks. Very short clips are drawn in the middle of a
     one-minute style window instead of being stretched edge to edge. */
  function previewPeaks(width) {
    const duration = buffer.duration || 0;
    const span = duration > 0 && duration < MIN_SPAN ? MIN_SPAN : duration;
    if (!(duration > 0) || !(span > 0)) return null;
    const mix = mixBuffer(buffer);
    const used = Math.min(width, Math.max(1, Math.round(width * (duration / span))));
    const offset = Math.max(0, Math.floor((width - used) / 2));
    const outer = new Float32Array(width * 2);
    const local = computePeaks(mix, used);
    for (let i = 0; i < used; i++) {
      outer[(offset + i) * 2] = local[i * 2];
      outer[(offset + i) * 2 + 1] = local[i * 2 + 1];
    }
    return { data: outer, offset: offset, used: used };
  }

  function drawPreview() {
    if (!canvas || !buffer) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = Math.max(80, canvas.clientWidth || (canvas.parentElement ? canvas.parentElement.clientWidth - 24 : 600));
    const cssH = WAVE_H;
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;

    const cacheKey = w + ':' + buffer.duration + ':' + buffer.length;
    if (!peaksCache || peaksCache.key !== cacheKey) {
      peaksCache = { key: cacheKey, data: previewPeaks(w) };
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const lit = peaksCache.data;
    if (lit) {
      drawPeaks(ctx, lit.data, w, 0, h, WAVE_COLOR);
      /* Dim the empty margins so the real length is obvious. */
      const edge = 'rgba(148,163,184,.10)';
      if (lit.offset > 0) {
        ctx.fillStyle = edge;
        ctx.fillRect(0, 0, lit.offset, h);
        ctx.fillRect(lit.offset + lit.used, 0, w - lit.offset - lit.used, h);
      }
    }
  }

  const redraw = CT.debounce(function () {
    peaksCache = null;
    drawPreview();
  }, 160);

  /* ---------- load ---------- */
  async function decodeFile(file) {
    const Ctx = getDecoder();
    if (!Ctx) return null;
    if (Ctx.state === 'suspended') {
      try { await Ctx.resume(); } catch (e) { /* not required for decoding */ }
    }
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (e) {
      return 'unreadable';
    }
    return new Promise(function (resolve) {
      let settled = false;
      const fail = function (err) {
        if (settled) return;
        settled = true;
        console.warn('decodeAudioData failed for ' + (file.name || 'file'), err);
        resolve(null);
      };
      const done = function (audioBuffer) {
        if (settled) return;
        settled = true;
        resolve(audioBuffer);
      };
      try {
        const p = Ctx.decodeAudioData(arrayBuffer, done, fail);
        if (p && typeof p.then === 'function') p.then(done, fail);
      } catch (err) {
        fail(err);
      }
    });
  }

  async function loadFile(file) {
    if (!file) return;
    if (busy) {
      CT.toast('Wait for the current render to finish.', 'err');
      return;
    }
    setError('');
    fileName = file.name || 'audio';
    hint.textContent = 'Decoding…';

    if (!AudioCtx) {
      setError('This browser has no Web Audio support, so "' + fileName + '" cannot be processed here.');
      return;
    }

    const decoded = await decodeFile(file);
    if (decoded === 'unreadable' || !decoded || !decoded.length) {
      buffer = null;
      info.hidden = true;
      result.hidden = true;
      wavBtn.disabled = true;
      pngBtn.disabled = true;
      emptyEl.hidden = false;
      hint.textContent = 'Could not decode';
      setError(decoded === 'unreadable'
        ? 'Could not read "' + fileName + '" from disk. Try choosing it again.'
        : '"' + fileName + '" could not be decoded. The browser does not support its audio codec, or the file is damaged. Try MP4, WebM, MP3, WAV, M4A or OGG.');
      CT.toast('Could not decode ' + fileName + '.', 'err');
      return;
    }

    buffer = decoded;
    peaksCache = null;
    const ch = buffer.numberOfChannels;
    nameEl.textContent = fileName;
    durationEl.textContent = CT.formatClock(buffer.duration, buffer.duration >= 3600 ? 'always' : 'auto') + ' (' + buffer.duration.toFixed(2) + ' s)';
    channelsEl.textContent = ch === 1 ? 'Mono' : ch === 2 ? 'Stereo' : ch + ' channels';
    rateEl.textContent = (buffer.sampleRate / 1000).toFixed(1).replace(/\.0$/, '') + ' kHz';
    info.hidden = false;
    emptyEl.hidden = true;
    outEmpty.hidden = true;
    hint.textContent = 'Waveform ready';

    if (restoredPitch && pitch) pitch.value = restoredPitch;
    restoredPitch = '';

    drawPreview();
    updateReadout();
    setBusy(false);
    if (!OfflineCtx) {
      CT.toast('This browser cannot re-render audio, so the WAV export stays off.', 'err');
    }
  }

  /* ---------- WAV ---------- */
  function floatTo16(view, offset, src) {
    for (let i = 0; i < src.length; i++) {
      const s = src[i] < -1 ? -1 : src[i] > 1 ? 1 : src[i];
      view.setInt16(offset + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  }

  function encodeWav(rendered) {
    const chCount = Math.min(2, rendered.numberOfChannels);
    const frames = rendered.length;
    const dataBytes = frames * chCount * 2;
    const out = new ArrayBuffer(44 + dataBytes);
    const view = new DataView(out);
    const ascii = function (offset, text) {
      for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
    };
    ascii(0, 'RIFF');
    view.setUint32(4, 36 + dataBytes, true);
    ascii(8, 'WAVE');
    ascii(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, chCount, true);
    view.setUint32(24, rendered.sampleRate, true);
    view.setUint32(28, rendered.sampleRate * chCount * 2, true);
    view.setUint16(32, chCount * 2, true);
    view.setUint16(34, 16, true);
    ascii(36, 'data');
    view.setUint32(40, dataBytes, true);

    if (chCount === 1) {
      floatTo16(view, 44, rendered.getChannelData(0));
    } else {
      const left = rendered.getChannelData(0);
      const right = rendered.getChannelData(1);
      let off = 44;
      for (let i = 0; i < frames; i++) {
        view.setInt16(off, Math.max(-1, Math.min(1, left[i])) * (left[i] < 0 ? 0x8000 : 0x7fff), true);
        view.setInt16(off + 2, Math.max(-1, Math.min(1, right[i])) * (right[i] < 0 ? 0x8000 : 0x7fff), true);
        off += 4;
      }
    }
    return out;
  }

  function exportWav() {
    if (!buffer || busy) return;
    if (!OfflineCtx) {
      setError('This browser has no OfflineAudioContext, so "' + fileName + '" cannot be re-rendered.');
      return;
    }
    const factor = speedFactor();
    const frames = Math.max(1, Math.ceil((buffer.duration / factor) * buffer.sampleRate));
    const chCount = Math.min(2, buffer.numberOfChannels);

    setBusy(true);
    hint.textContent = 'Rendering…';
    progressWrap.hidden = false;
    setProgress(0);

    let ctx;
    try {
      ctx = new OfflineCtx(chCount, frames, buffer.sampleRate);
    } catch (err) {
      console.warn('OfflineAudioContext could not start', err);
      setError('The render for "' + fileName + '" could not start: ' + (err && err.message ? err.message : 'unknown error') + '.');
      setBusy(false);
      hint.textContent = 'Render failed';
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = factor;
    source.connect(ctx.destination);
    source.start(0);

    const started = Date.now();
    const tick = setInterval(function () {
      /* Approximate progress while the render runs off the main thread rate. */
      const expect = (frames / buffer.sampleRate) * 1000;
      const pct = Math.min(95, ((Date.now() - started) / Math.max(120, expect)) * 100);
      setProgress(Math.max(5, pct));
    }, 120);

    ctx.oncomplete = function (e) {
      clearInterval(tick);
      try {
        const rendered = e.renderedBuffer;
        const wav = encodeWav(rendered);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const name = CT.baseName(fileName) + '-' + factor.toFixed(2).replace(/\.?0+$/, '') + 'x.wav';
        CT.downloadBlob(blob, name);
        setProgress(100);
        hint.textContent = 'WAV ready (' + CT.fmtBytes(blob.size) + ')';
        CT.toast('Saved ' + name);
      } catch (err) {
        console.warn('WAV encode failed', err);
        setError('The WAV export for "' + fileName + '" failed: ' + (err && err.message ? err.message : 'unknown error') + '.');
        hint.textContent = 'WAV failed';
      } finally {
        setBusy(false);
      }
    };

    const fail = function (err) {
      clearInterval(tick);
      console.warn('Render failed', err);
      setError('The render for "' + fileName + '" failed: ' + (err && err.message ? err.message : 'unknown error') + '. Try a shorter file or a smaller speed change.');
      hint.textContent = 'Render failed';
      setBusy(false);
    };
    const p = ctx.startRendering();
    if (p && typeof p.then === 'function') p.catch(fail);
  }

  /* ---------- waveform PNG ---------- */
  function drawPng(cv) {
    const dpr = 2; /* export at double size for crisp text */
    cv.width = PNG_W * dpr;
    cv.height = PNG_H * dpr;
    const w = cv.width;
    const h = cv.height;
    const ctx = cv.getContext('2d');
    if (!ctx) return false;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const padX = 60 * dpr;
    const titleY = 64 * dpr;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold ' + 30 * dpr + 'px system-ui, -apple-system, Segoe UI, Arial, sans-serif';
    ctx.textBaseline = 'middle';
    let title = fileName;
    const titleMax = w - padX * 2 - 260 * dpr;
    while (title.length > 6 && ctx.measureText(title).width > titleMax) {
      title = title.slice(0, -2) + '\u2026';
    }
    ctx.fillText(title, padX, titleY);

    const totalLabel = CT.formatClock(buffer.duration, buffer.duration >= 3600 ? 'always' : 'auto');
    ctx.fillStyle = '#64748b';
    ctx.font = 24 * dpr + 'px system-ui, -apple-system, Segoe UI, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(totalLabel, w - padX, titleY);
    ctx.textAlign = 'left';

    const waveTop = 110 * dpr;
    const waveH = 180 * dpr;
    const waveW = w - padX * 2;
    drawPeaks(ctx, computePeaks(mixBuffer(buffer), waveW), waveW, waveTop, waveH, WAVE_COLOR);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 20 * dpr + 'px system-ui, -apple-system, Segoe UI, Arial, sans-serif';
    ctx.fillText('0:00', padX, h - 34 * dpr);
    ctx.textAlign = 'right';
    ctx.fillText(totalLabel, w - padX, h - 34 * dpr);
    ctx.textAlign = 'left';
    return true;
  }

  function exportPng() {
    if (!buffer || busy) return;
    const cv = document.createElement('canvas');
    if (!drawPng(cv)) {
      setError('This browser cannot draw the waveform image for "' + fileName + '".');
      return;
    }
    cv.toBlob(function (blob) {
      if (!blob) {
        setError('This browser could not encode the waveform image for "' + fileName + '".');
        return;
      }
      const name = CT.baseName(fileName) + '-waveform.png';
      CT.downloadBlob(blob, name);
      hint.textContent = 'Waveform PNG ready (' + CT.fmtBytes(blob.size) + ')';
      CT.toast('Saved ' + name);
    }, 'image/png');
  }

  /* ---------- wiring ---------- */
  if (speedSeg) {
    CT.$$('button', speedSeg).forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSpeed(btn.getAttribute('data-speed'));
        updateReadout();
      });
    });
  }

  if (pitch) {
    pitch.addEventListener('input', updateReadout);
    pitch.addEventListener('change', updateReadout);
  }

  dropzone.addEventListener('click', function () { fileInput.click(); });
  dropzone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener('change', function () {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = '';
    loadFile(file);
  });
  ['dragenter', 'dragover'].forEach(function (type) {
    dropzone.addEventListener(type, function (e) {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(function (type) {
    dropzone.addEventListener(type, function (e) {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', function (e) {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    loadFile(file);
  });

  wavBtn.addEventListener('click', exportWav);
  pngBtn.addEventListener('click', exportPng);
  window.addEventListener('resize', redraw);

  if (!OfflineCtx) wavBtn.title = 'Audio re-render is not available in this browser';
  updateReadout();
})();
