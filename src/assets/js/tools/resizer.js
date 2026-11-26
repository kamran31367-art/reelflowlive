/* Image Resizer */
(function () {
  const CT = window.CT;
  const dropzone = document.getElementById('dropzone');
  if (!dropzone) return;

  const fileInput = document.getElementById('fileInput');
  const sourceStats = document.getElementById('sourceStats');
  const srcName = document.getElementById('srcName');
  const srcDims = document.getElementById('srcDims');
  const srcWeight = document.getElementById('srcWeight');
  const preset = document.getElementById('preset');
  const outWidth = document.getElementById('outWidth');
  const outHeight = document.getElementById('outHeight');
  const fitSeg = document.getElementById('fitSeg');
  const fitMode = document.getElementById('fitMode');
  const formatSeg = document.getElementById('formatSeg');
  const outFormat = document.getElementById('outFormat');
  const quality = document.getElementById('quality');
  const qualityValue = document.getElementById('qualityValue');
  const qualityField = document.getElementById('qualityField');
  const bgColor = document.getElementById('bgColor');
  const canvas = document.getElementById('previewCanvas');
  const previewEmpty = document.getElementById('previewEmpty');
  const outHint = document.getElementById('outHint');
  const outDims = document.getElementById('outDims');
  const outWeight = document.getElementById('outWeight');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  const MIME_EXT = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' };
  const MAX_DIM = 8000;

  let source = null; /* { el, width, height, name } */
  let lastBlob = null;
  let lastSize = null;
  let token = 0;

  function clampDim(v, fallback) {
    const n = Math.round(Number(v));
    if (!isFinite(n) || n < 16) return fallback;
    return Math.min(MAX_DIM, n);
  }

  function setQualityLabel() {
    qualityValue.textContent = Number(quality.value).toFixed(2);
  }

  function applyFormatUi() {
    const isPng = outFormat.value === 'image/png';
    quality.disabled = isPng;
    qualityField.style.opacity = isPng ? '0.45' : '1';
  }

  async function decodeImage(file) {
    if (window.createImageBitmap) {
      try {
        return await createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch (e) { /* fall through */ }
    }
    return new Promise(function (resolve, reject) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not decode image')); };
      img.src = url;
    });
  }

  async function loadFile(file) {
    if (!file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) {
      CT.toast('Please choose an image file (JPG, PNG or WebP).', 'err');
      return;
    }
    try {
      const el = await decodeImage(file);
      const width = el.width || el.naturalWidth;
      const height = el.height || el.naturalHeight;
      if (!width || !height) throw new Error('Empty image');
      if (source && typeof source.el.close === 'function') source.el.close();
      source = { el: el, width: width, height: height, name: file.name || 'image' };

      srcName.textContent = source.name;
      srcDims.textContent = width + '×' + height;
      srcWeight.textContent = CT.fmtBytes(file.size);
      sourceStats.hidden = false;

      if (preset.value === 'custom') {
        outWidth.value = Math.min(MAX_DIM, width);
        outHeight.value = Math.min(MAX_DIM, height);
      } else {
        const parts = preset.value.split('x');
        outWidth.value = parts[0];
        outHeight.value = parts[1];
      }

      canvas.hidden = false;
      previewEmpty.hidden = true;
      outHint.textContent = 'Source image loaded';
      update();
    } catch (e) {
      CT.toast('That image could not be opened. Try a JPG, PNG or WebP file.', 'err');
    }
  }

  function draw() {
    const w = clampDim(outWidth.value, 0);
    const h = clampDim(outHeight.value, 0);
    if (!w || !h) return null;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = bgColor.value || '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const sw = source.width;
    const sh = source.height;
    const mode = fitMode.value;

    if (mode === 'stretch') {
      ctx.drawImage(source.el, 0, 0, w, h);
    } else {
      const scale = mode === 'contain' ? Math.min(w / sw, h / sh) : Math.max(w / sw, h / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      ctx.drawImage(source.el, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }
    return { w: w, h: h };
  }

  function currentQuality() {
    return outFormat.value === 'image/png' ? undefined : Number(quality.value);
  }

  async function update() {
    if (!source) return;
    const my = ++token;
    const size = draw();
    if (!size) {
      downloadBtn.disabled = true;
      outDims.textContent = '—';
      outWeight.textContent = '—';
      return;
    }
    outDims.textContent = size.w + '×' + size.h;
    outHint.textContent = 'Processing…';

    const mime = outFormat.value;
    const blob = await new Promise(function (resolve) {
      canvas.toBlob(resolve, mime, currentQuality());
    });
    if (my !== token) return;

    if (!blob) {
      lastBlob = null;
      lastSize = null;
      downloadBtn.disabled = true;
      outWeight.textContent = '—';
      outHint.textContent = 'Export failed';
      CT.toast('This browser could not export ' + (MIME_EXT[mime] || mime) + '. Try JPG instead.', 'err');
      return;
    }
    lastBlob = blob;
    lastSize = size;
    outWeight.textContent = CT.fmtBytes(blob.size);
    outHint.textContent = 'Ready - ' + (MIME_EXT[mime] || '').toUpperCase();
    downloadBtn.disabled = false;
  }

  const scheduleUpdate = CT.debounce(update, 130);

  function wireSeg(container, hiddenInput, attr, afterChange) {
    const buttons = CT.$$('button', container);
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          const on = b === btn;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        hiddenInput.value = btn.getAttribute('data-' + attr);
        if (afterChange) afterChange();
      });
    });
  }

  wireSeg(fitSeg, fitMode, 'fit', function () { scheduleUpdate(); });
  wireSeg(formatSeg, outFormat, 'format', function () { applyFormatUi(); update(); });

  preset.addEventListener('change', function () {
    const val = preset.value;
    if (val === 'custom') {
      if (source) {
        outWidth.value = Math.min(MAX_DIM, source.width);
        outHeight.value = Math.min(MAX_DIM, source.height);
        update();
      }
      return;
    }
    const parts = val.split('x');
    outWidth.value = parts[0];
    outHeight.value = parts[1];
    update();
  });

  [outWidth, outHeight].forEach(function (el) {
    el.addEventListener('input', function () {
      preset.value = 'custom';
      scheduleUpdate();
    });
  });
  bgColor.addEventListener('input', scheduleUpdate);
  quality.addEventListener('input', function () {
    setQualityLabel();
    scheduleUpdate();
  });
  outFormat.addEventListener('change', applyFormatUi);

  downloadBtn.addEventListener('click', function () {
    if (!lastBlob || !source || !lastSize) return;
    const ext = MIME_EXT[outFormat.value] || 'png';
    const name = CT.baseName(source.name) + '-' + lastSize.w + 'x' + lastSize.h + '.' + ext;
    CT.downloadBlob(lastBlob, name);
    CT.toast('Saved ' + name);
  });

  resetBtn.addEventListener('click', function () {
    token++;
    if (source && typeof source.el.close === 'function') source.el.close();
    source = null;
    lastBlob = null;
    lastSize = null;
    canvas.hidden = true;
    previewEmpty.hidden = false;
    sourceStats.hidden = true;
    outDims.textContent = '—';
    outWeight.textContent = '—';
    outHint.textContent = 'No image yet';
    downloadBtn.disabled = true;
    preset.value = '1280x720';
    outWidth.value = '1280';
    outHeight.value = '720';
    fitMode.value = 'cover';
    CT.$$('button', fitSeg).forEach(function (b, i) {
      b.classList.toggle('on', i === 0);
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    });
    outFormat.value = 'image/jpeg';
    CT.$$('button', formatSeg).forEach(function (b, i) {
      b.classList.toggle('on', i === 0);
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    });
    applyFormatUi();
  });

  /* File picking */
  dropzone.addEventListener('click', function () { fileInput.click(); });
  dropzone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener('change', function () {
    loadFile(fileInput.files && fileInput.files[0]);
    fileInput.value = '';
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

  setQualityLabel();
  applyFormatUi();
})();
