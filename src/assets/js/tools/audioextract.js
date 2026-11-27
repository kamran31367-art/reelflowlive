/* Audio Extractor & Trimmer - decode locally, trim, export WAV or MP3 */
(function () {
  const CT = window.CT;
  const dropzone = document.getElementById('axDropzone');
  if (!dropzone) return;

  const fileInput = document.getElementById('axFile');
  const errorEl = document.getElementById('axError');
  const info = document.getElementById('axInfo');
  const nameEl = document.getElementById('axName');
  const durationEl = document.getElementById('axDuration');
  const channelsEl = document.getElementById('axChannels');
  const rateEl = document.getElementById('axRate');
  const bytesEl = document.getElementById('axBytes');
  const player = document.getElementById('axPlayer');
  const startInput = document.getElementById('axStart');
  const endInput = document.getElementById('axEnd');
  const rangeHint = document.getElementById('axRangeHint');
  const outHint = document.getElementById('axOutHint');
  const outMeta = document.getElementById('axOutMeta');
  const outRange = document.getElementById('axOutRange');
  const outLength = document.getElementById('axOutLength');
  const outWav = document.getElementById('axOutWav');
  const outMp3 = document.getElementById('axOutMp3');
  const wavBtn = document.getElementById('axWavBtn');
  const mp3Btn = document.getElementById('axMp3Btn');
  const progressWrap = document.getElementById('axProgressWrap');
  const progressFill = document.getElementById('axProgress');
  const progressLabel = document.getElementById('axProgressLabel');
  const outEmpty = document.getElementById('axOutEmpty');

  const MP3_BITRATE = 128;
  const CHUNK = 1152;
  const MIME_EXT = { 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/mp4': 'm4a', 'audio/ogg': 'ogg' };

  let buffer = null; /* decoded AudioBuffer */
  let fileName = '';
  let objectUrl = null;
  let busy = false;
  let lastRange = null; /* { start, end } in seconds */

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let decoder = null;

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

  /* File-name friendly time label, e.g. "0.5s" or "1m02.75s". */
  function suffixTime(secs) {
    const total = Math.round(secs * 100) / 100;
    const m = Math.floor(total / 60);
    const s = total - m * 60;
    const sText = s.toFixed(2).replace(/\.?0+$/, '');
    return (m > 0 ? m + 'm' + (s < 10 ? '0' : '') : '') + sText + 's';
  }

  function extFor(file) {
    const mime = (file.type || '').toLowerCase();
    if (MIME_EXT[mime]) return MIME_EXT[mime];
    const m = /\.([a-z0-9]{2,5})$/i.exec(file.name || '');
    return m ? m[1].toLowerCase() : 'bin';
  }

  /* Reads start/end fields. Returns { start, end } or { error } (error empty twice means cleared). */
  function readRange() {
    const rawStart = startInput ? startInput.value : '';
    const rawEnd = endInput ? endInput.value : '';
    const total = buffer ? buffer.duration : 0;
    let start = 0;
    let end = total;
    if (rawStart && rawStart.trim()) {
      const parsed = CT.parseClock(rawStart);
      if (parsed == null) return { error: 'The start time is not a valid time. Use mm:ss.mmm or seconds.' };
      start = Math.max(0, Math.min(total, parsed));
    }
    if (rawEnd && rawEnd.trim()) {
      const parsed = CT.parseClock(rawEnd);
      if (parsed == null) return { error: 'The end time is not a valid time. Use mm:ss.mmm or seconds.' };
      end = Math.max(0, Math.min(total, parsed));
    }
    if (end - start < 0.05) return { error: 'The end time must come after the start time.' };
    return { start: start, end: end };
  }

  function setBusy(on) {
    busy = on;
    /* Re-enable only when a valid range is present. */
    const usable = !!buffer && !readRange().error;
    wavBtn.disabled = on || !usable;
    mp3Btn.disabled = on || !usable || !window.lamejs;
  }

  function fillProgress(pct) {
    const v = Math.max(0, Math.min(100, pct));
    if (progressFill) progressFill.style.width = v.toFixed(1) + '%';
    if (progressLabel) progressLabel.textContent = Math.round(v) + '%';
  }

  function fillInfo(file) {
    const ch = buffer.numberOfChannels;
    nameEl.textContent = file.name || 'file';
    durationEl.textContent = CT.formatClock(buffer.duration, buffer.duration >= 3600 ? 'always' : 'auto') + ' (' + buffer.duration.toFixed(2) + ' s)';
    channelsEl.textContent = ch === 1 ? 'Mono' : ch === 2 ? 'Stereo' : ch + ' channels';
    rateEl.textContent = (buffer.sampleRate / 1000).toFixed(1).replace(/\.0$/, '') + ' kHz';
    bytesEl.textContent = CT.fmtBytes(file.size);
    info.hidden = false;
  }

  function updateSummary() {
    const range = readRange();
    if (range.error) {
      rangeHint.textContent = range.error;
      rangeHint.classList.add('err');
      lastRange = null;
    } else {
      rangeHint.textContent = 'Exporting ' + clockSecs(range.start) + ' - ' + clockSecs(range.end) + '. Empty fields keep the whole file.';
      rangeHint.classList.remove('err');
      lastRange = range;
    }
    if (!buffer) return;

    if (lastRange) {
      const length = lastRange.end - lastRange.start;
      const frames = Math.max(1, Math.round(length * buffer.sampleRate));
      const ch = Math.min(2, buffer.numberOfChannels);
      outMeta.hidden = false;
      outRange.textContent = clockSecs(lastRange.start) + ' - ' + clockSecs(lastRange.end);
      outLength.textContent = length.toFixed(2) + ' s';
      outWav.textContent = 'about ' + CT.fmtBytes(frames * ch * 2 + 44);
      outMp3.textContent = 'about ' + CT.fmtBytes(Math.round((MP3_BITRATE * 1000 * length) / 8 + 4096));
    } else {
      outMeta.hidden = true;
    }
    setBusy(busy);
  }

  async function decodeFile(file) {
    const Ctx = getDecoder();
    if (!Ctx) {
      setError('This browser has no Web Audio support, so "' + (file.name || 'the file') + '" cannot be decoded here.');
      return;
    }
    if (Ctx.state === 'suspended') {
      try { await Ctx.resume(); } catch (e) { /* resume is optional for decoding */ }
    }
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (e) {
      setError('Could not read "' + (file.name || 'the file') + '" from disk. Try choosing it again.');
      return;
    }
    return new Promise(function (resolve) {
      let settled = false;
      const done = function (audioBuffer) {
        if (settled) return;
        settled = true;
        resolve(audioBuffer);
      };
      try {
        const p = Ctx.decodeAudioData(arrayBuffer, done, function (err) {
          if (settled) return;
          settled = true;
          console.warn('decodeAudioData failed for ' + (file.name || 'file'), err);
          resolve(null);
        });
        if (p && typeof p.then === 'function') {
          p.then(done, function (err) {
            if (settled) return;
            settled = true;
            console.warn('decodeAudioData failed for ' + (file.name || 'file'), err);
            resolve(null);
          });
        }
      } catch (err) {
        if (settled) return;
        settled = true;
        console.warn('decodeAudioData threw for ' + (file.name || 'file'), err);
        resolve(null);
      }
    });
  }

  async function loadFile(file) {
    if (!file) return;
    setError('');
    if (busy) {
      CT.toast('Wait for the current export to finish.', 'err');
      return;
    }
    fileName = file.name || 'audio';
    outHint.textContent = 'Decoding…';

    const decoded = await decodeFile(file);
    if (!decoded || !decoded.length) {
      buffer = null;
      if (player) player.hidden = true;
      info.hidden = true;
      outMeta.hidden = true;
      wavBtn.disabled = true;
      mp3Btn.disabled = true;
      outHint.textContent = 'Could not decode';
      setError('"' + fileName + '" could not be decoded. The browser does not support its audio codec, or the file is damaged. Try MP4, WebM, MP3, WAV, M4A or OGG.');
      CT.toast('Could not decode ' + fileName + '.', 'err');
      return;
    }

    buffer = decoded;
    fillInfo(file);

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    if (player) {
      player.src = objectUrl;
      player.hidden = false;
      player.addEventListener('error', function onPlayerError() {
        setError('The preview player reported an error for "' + fileName + '". The export may still work if decoding succeeded.');
      }, { once: true });
    }

    startInput.value = '';
    endInput.value = '';
    startInput.placeholder = '0:00.000';
    endInput.placeholder = clockSecs(buffer.duration);
    progressWrap.hidden = true;
    outEmpty.hidden = true;
    outHint.textContent = 'Ready';
    updateSummary();
  }

  /* ---------- WAV ---------- */
  function writeAscii(view, offset, text) {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  }

  function encodeWav(channels, sampleRate) {
    const chCount = channels.length;
    const frames = channels[0].length;
    const dataBytes = frames * chCount * 2;
    const out = new ArrayBuffer(44 + dataBytes);
    const view = new DataView(out);
    writeAscii(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataBytes, true);
    writeAscii(view, 8, 'WAVE');
    writeAscii(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); /* PCM */
    view.setUint16(22, chCount, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * chCount * 2, true);
    view.setUint16(32, chCount * 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, 'data');
    view.setUint32(40, dataBytes, true);
    let off = 44;
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < chCount; c++) {
        let s = channels[c][i];
        s = s < -1 ? -1 : s > 1 ? 1 : s;
        view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        off += 2;
      }
    }
    return out;
  }

  function sliceChannels(range) {
    const asr = buffer.sampleRate;
    const startFrame = Math.floor(range.start * asr);
    const endFrame = Math.min(buffer.length, Math.ceil(range.end * asr));
    const frames = Math.max(0, endFrame - startFrame);
    const chCount = Math.min(2, buffer.numberOfChannels);
    const channels = [];
    for (let c = 0; c < chCount; c++) {
      const full = buffer.getChannelData(c);
      channels.push(full.subarray(startFrame, startFrame + frames));
    }
    return channels;
  }

  function toInt16(src) {
    const out = new Int16Array(src.length);
    for (let i = 0; i < src.length; i++) {
      const s = src[i] < -1 ? -1 : src[i] > 1 ? 1 : src[i];
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  function exportWav() {
    if (!buffer || busy) return;
    const range = readRange();
    if (range.error) {
      updateSummary();
      CT.toast(range.error, 'err');
      return;
    }
    setBusy(true);
    outHint.textContent = 'Building WAV…';
    progressWrap.hidden = false;
    fillProgress(0);
    /* Let the UI paint before the synchronous encode. */
    setTimeout(function () {
      try {
        const channels = sliceChannels(range);
        const wav = encodeWav(channels, buffer.sampleRate);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const suffix = range.start > 0 || range.end < buffer.duration - 0.01
          ? '-' + suffixTime(range.start) + '-' + suffixTime(range.end)
          : '';
        const name = CT.baseName(fileName) + suffix + '.wav';
        CT.downloadBlob(blob, name);
        fillProgress(100);
        outHint.textContent = 'WAV ready (' + CT.fmtBytes(blob.size) + ')';
        CT.toast('Saved ' + name);
      } catch (err) {
        console.warn('WAV export failed', err);
        setError('The WAV export for "' + fileName + '" failed: ' + (err && err.message ? err.message : 'unknown error') + '.');
      } finally {
        setBusy(false);
      }
    }, 30);
  }

  /* ---------- MP3 ---------- */
  function exportMp3() {
    if (!buffer || busy) return;
    if (!window.lamejs) {
      setError('The MP3 encoder did not load, so "' + fileName + '" can still be saved as WAV.');
      return;
    }
    const range = readRange();
    if (range.error) {
      updateSummary();
      CT.toast(range.error, 'err');
      return;
    }

    setBusy(true);
    outHint.textContent = 'Encoding MP3…';
    progressWrap.hidden = false;
    fillProgress(0);

    setTimeout(function () {
      const channels = sliceChannels(range);
      const chCount = channels.length;
      const rate = buffer.sampleRate;
      let encoder;
      try {
        encoder = new window.lamejs.Mp3Encoder(chCount, rate, MP3_BITRATE);
      } catch (err) {
        console.warn('Mp3Encoder could not start', err);
        setError('The MP3 encoder refused "' + fileName + '": ' + (err && err.message ? err.message : 'unknown error') + '. Use WAV instead.');
        setBusy(false);
        outHint.textContent = 'MP3 failed';
        return;
      }

      const left = toInt16(channels[0]);
      const right = chCount > 1 ? toInt16(channels[1]) : null;
      const total = left.length;
      const parts = [];
      let pos = 0;

      function step() {
        try {
          const end = Math.min(total, pos + CHUNK * 64);
          while (pos < end) {
            const n = Math.min(CHUNK, end - pos);
            const buf = right
              ? encoder.encodeBuffer(left.subarray(pos, pos + n), right.subarray(pos, pos + n))
              : encoder.encodeBuffer(left.subarray(pos, pos + n));
            if (buf.length > 0) parts.push(new Int8Array(buf));
            pos += n;
          }
          fillProgress((pos / total) * 100);
          if (pos < total) {
            setTimeout(step, 0);
            return;
          }
          const tail = encoder.flush();
          if (tail.length > 0) parts.push(new Int8Array(tail));
          const blob = new Blob(parts, { type: 'audio/mpeg' });
          const suffix = range.start > 0 || range.end < buffer.duration - 0.01
            ? '-' + suffixTime(range.start) + '-' + suffixTime(range.end)
            : '';
          const name = CT.baseName(fileName) + suffix + '.mp3';
          CT.downloadBlob(blob, name);
          fillProgress(100);
          outHint.textContent = 'MP3 ready (' + CT.fmtBytes(blob.size) + ')';
          CT.toast('Saved ' + name);
          setBusy(false);
        } catch (err) {
          console.warn('MP3 encode failed', err);
          setError('The MP3 export for "' + fileName + '" failed: ' + (err && err.message ? err.message : 'unknown error') + '. Use WAV instead.');
          outHint.textContent = 'MP3 failed';
          setBusy(false);
        }
      }
      step();
    }, 30);
  }

  /* ---------- wiring ---------- */
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

  [startInput, endInput].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', updateSummary);
    el.addEventListener('change', updateSummary);
  });

  wavBtn.addEventListener('click', exportWav);
  mp3Btn.addEventListener('click', exportMp3);

  if (!window.lamejs) {
    console.warn('lamejs global missing; MP3 export stays disabled.');
    mp3Btn.title = 'MP3 encoder unavailable';
  } else {
    mp3Btn.title = '';
  }
})();
