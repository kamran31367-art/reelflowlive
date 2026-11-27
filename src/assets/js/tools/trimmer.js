/* Video Trimmer - records the chosen section with MediaRecorder, no encoder download. */
(function () {
  'use strict';

  var drop = document.getElementById('vtDrop');
  var fileInput = document.getElementById('vtFile');
  var info = document.getElementById('vtInfo');
  var nameEl = document.getElementById('vtName');
  var sizeEl = document.getElementById('vtSize');
  var durEl = document.getElementById('vtDur');
  var resEl = document.getElementById('vtRes');
  var startRange = document.getElementById('startRange');
  var startText = document.getElementById('startText');
  var endRange = document.getElementById('endRange');
  var endText = document.getElementById('endText');
  var rangeNote = document.getElementById('rangeNote');
  var trimBtn = document.getElementById('trimBtn');
  var progressWrap = document.getElementById('vtProgressWrap');
  var progressFill = document.getElementById('vtProgress');
  var progressLabel = document.getElementById('vtProgressLabel');
  var errorEl = document.getElementById('vtError');
  var srcVideo = document.getElementById('srcVideo');
  var srcEmpty = document.getElementById('srcEmpty');
  var srcHint = document.getElementById('srcHint');
  var outWrap = document.getElementById('outWrap');
  var outVideo = document.getElementById('outVideo');
  var downloadBtn = document.getElementById('downloadClip');
  var resetBtn = document.getElementById('resetVt');

  if (!drop) return;

  var file = null;
  var duration = 0;
  var objectUrl = '';
  var outUrl = '';
  var outBlob = null;
  var outExt = 'mp4';
  var recording = false;

  function fmt(t) {
    if (!isFinite(t)) return '0:00.0';
    var h = Math.floor(t / 3600);
    var m = Math.floor((t % 3600) / 60);
    var s = t % 60;
    var sText = (s < 10 ? '0' : '') + s.toFixed(1);
    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + sText;
  }

  function parseTime(raw) {
    var text = String(raw || '').trim().replace(',', '.');
    if (!text) return NaN;
    if (text.indexOf(':') === -1) return parseFloat(text);
    var parts = text.split(':').map(parseFloat);
    if (parts.some(function (p) { return !isFinite(p); })) return NaN;
    var seconds = 0;
    for (var i = 0; i < parts.length; i++) seconds = seconds * 60 + parts[i];
    return seconds;
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function setError(msg) {
    errorEl.textContent = msg || '';
    errorEl.hidden = !msg;
  }

  function updateLength() {
    var s = parseFloat(startRange.value);
    var e = parseFloat(endRange.value);
    rangeNote.textContent = 'Clip length: ' + fmt(Math.max(0, e - s));
  }

  function syncFromRanges() {
    startText.value = fmt(parseFloat(startRange.value));
    endText.value = fmt(parseFloat(endRange.value));
  }

  function syncRanges() {
    var s = clamp(parseTime(startText.value), 0, Math.max(0, duration - 0.1));
    var e = clamp(parseTime(endText.value), 0.1, duration);
    if (!isFinite(s)) s = parseFloat(startRange.value);
    if (!isFinite(e)) e = parseFloat(endRange.value);
    if (e <= s) e = Math.min(duration, s + 0.1);
    startRange.value = String(s);
    endRange.value = String(e);
    startText.value = fmt(s);
    endText.value = fmt(e);
    updateLength();
  }

  function pickMime() {
    var candidates = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    if (!window.MediaRecorder) return '';
    for (var i = 0; i < candidates.length; i++) {
      if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i];
    }
    return '';
  }

  function loadFile(next) {
    if (!next || !/^video\//.test(next.type)) {
      CT.toast('Choose a video file', 'err');
      return;
    }
    if (recording) return;
    file = next;
    setError('');
    outBlob = null;
    downloadBtn.disabled = true;
    outWrap.hidden = true;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(next);
    srcVideo.src = objectUrl;
    srcVideo.hidden = false;
    srcEmpty.hidden = true;
    info.hidden = false;
    nameEl.textContent = next.name;
    sizeEl.textContent = CT.fmtBytes(next.size);
    srcHint.textContent = 'Loading metadata…';
    [startRange, endRange, startText, endText].forEach(function (el) { el.disabled = false; });
  }

  srcVideo.addEventListener('loadedmetadata', function () {
    duration = srcVideo.duration || 0;
    durEl.textContent = fmt(duration);
    resEl.textContent = srcVideo.videoWidth + ' x ' + srcVideo.videoHeight;
    srcHint.textContent = fmt(duration) + ' clip';
    startRange.max = String(duration);
    endRange.max = String(duration);
    startRange.value = '0';
    endRange.value = String(duration);
    startText.value = '0:00.0';
    endText.value = fmt(duration);
    updateLength();
    trimBtn.disabled = !duration;
    if (!pickMime()) setError('This browser cannot record video, so trimming is not available here.');
  });

  srcVideo.addEventListener('error', function () {
    srcHint.textContent = 'Cannot play this file';
    CT.toast('This browser cannot decode ' + (file ? file.name : 'the video'), 'err');
    setError('Cannot decode this video. Try an MP4 with H.264.');
  });

  function seekTo(time) {
    return new Promise(function (resolve) {
      function done() {
        srcVideo.removeEventListener('seeked', done);
        resolve();
      }
      srcVideo.addEventListener('seeked', done);
      srcVideo.currentTime = time;
    });
  }

  function trim() {
    if (!file || recording) return;
    var mime = pickMime();
    if (!mime) {
      setError('This browser cannot record video in this page.');
      return;
    }
    var start = parseFloat(startRange.value);
    var end = parseFloat(endRange.value);
    if (!(end > start + 0.05)) {
      setError('The end time must be after the start time.');
      return;
    }
    var clipLength = end - start;
    setError('');
    recording = true;
    trimBtn.disabled = true;
    downloadBtn.disabled = true;
    progressWrap.hidden = false;
    progressFill.style.width = '0%';
    progressLabel.textContent = 'Preparing…';

    seekTo(start).then(function () {
      var stream;
      try {
        stream = srcVideo.captureStream();
      } catch (err) {
        throw new Error('captureStream is not supported');
      }
      var recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 });
      var chunks = [];
      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size) chunks.push(event.data);
      };
      recorder.onerror = function (event) {
        fail('The recorder stopped: ' + (event.error ? event.error.name : 'unknown error'));
      };
      recorder.onstop = function () {
        stream.getTracks().forEach(function (track) { track.stop(); });
        srcVideo.pause();
        finish(chunks, mime, clipLength);
      };
      progressLabel.textContent = 'Recording… keep this tab open';
      recorder.start(250);
      srcVideo.muted = false;
      srcVideo.play().catch(function () {});
      var ticker = setInterval(function () {
        var at = srcVideo.currentTime || 0;
        var ratio = clamp((at - start) / clipLength, 0, 1);
        progressFill.style.width = Math.round(ratio * 100) + '%';
        progressLabel.textContent = 'Recording ' + Math.round(ratio * 100) + '%';
        if (at >= end - 0.02 || srcVideo.ended) {
          clearInterval(ticker);
          try { recorder.stop(); } catch (e) {}
        }
      }, 120);
    }).catch(function (err) {
      fail('Could not start the recording: ' + (err && err.message ? err.message : 'unknown error'));
    });

    function fail(message) {
      recording = false;
      trimBtn.disabled = !file;
      progressLabel.textContent = 'Stopped';
      progressFill.style.width = '0';
      setError(message);
    }

    function finish(chunks, type, expectLength) {
      recording = false;
      trimBtn.disabled = !file;
      if (!chunks.length) {
        fail('The browser recorded no data. Try a shorter section.');
        return;
      }
      outExt = /mp4/.test(type) ? 'mp4' : 'webm';
      outBlob = new Blob(chunks, { type: type.split(';')[0] });
      if (outUrl) URL.revokeObjectURL(outUrl);
      outUrl = URL.createObjectURL(outBlob);
      outVideo.src = outUrl;
      outWrap.hidden = false;
      downloadBtn.disabled = false;
      progressFill.style.width = '100%';
      progressLabel.textContent = 'Done - ' + fmt(expectLength) + ' clip, ' + CT.fmtBytes(outBlob.size);
    }
  }

  drop.addEventListener('click', function () { fileInput.click(); });
  drop.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  });
  drop.addEventListener('dragover', function (event) {
    event.preventDefault();
    drop.classList.add('dragover');
  });
  drop.addEventListener('dragleave', function () { drop.classList.remove('dragover'); });
  drop.addEventListener('drop', function (event) {
    event.preventDefault();
    drop.classList.remove('dragover');
    if (event.dataTransfer.files.length) loadFile(event.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) loadFile(fileInput.files[0]);
    fileInput.value = '';
  });

  startRange.addEventListener('input', function () {
    endRange.min = startRange.value;
    syncFromRanges();
    updateLength();
  });
  endRange.addEventListener('input', function () {
    startRange.max = endRange.value;
    syncFromRanges();
    updateLength();
  });
  startText.addEventListener('change', syncRanges);
  endText.addEventListener('change', syncRanges);

  trimBtn.addEventListener('click', trim);

  downloadBtn.addEventListener('click', function () {
    if (outBlob) CT.downloadBlob(outBlob, CT.baseName(file ? file.name : 'video') + '-trimmed.' + outExt);
  });

  resetBtn.addEventListener('click', function () {
    if (recording) return;
    file = null;
    duration = 0;
    outBlob = null;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (outUrl) URL.revokeObjectURL(outUrl);
    objectUrl = outUrl = '';
    srcVideo.removeAttribute('src');
    srcVideo.hidden = true;
    srcEmpty.hidden = false;
    srcHint.textContent = 'No video yet';
    info.hidden = true;
    outWrap.hidden = true;
    downloadBtn.disabled = true;
    trimBtn.disabled = true;
    progressWrap.hidden = true;
    setError('');
    [startRange, endRange, startText, endText].forEach(function (el) { el.disabled = true; });
    rangeNote.textContent = 'Choose a video first. Times accept 12.5 or 1:02.5.';
  });
})();
