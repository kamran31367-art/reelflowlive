/* Thumbnail Safe-Zone Tester */
(function () {
  const CT = window.CT;
  const dropzone = document.getElementById('dropzone');
  if (!dropzone || !CT) return;

  const fileInput = document.getElementById('fileInput');
  const sourceStats = document.getElementById('sourceStats');
  const srcName = document.getElementById('srcName');
  const srcDims = document.getElementById('srcDims');
  const srcWeight = document.getElementById('srcWeight');
  const sizeHint = document.getElementById('sizeHint');
  const safeToggle = document.getElementById('safeToggle');
  const gradientToggle = document.getElementById('gradientToggle');
  const badgeToggle = document.getElementById('badgeToggle');
  const cropToggle = document.getElementById('cropToggle');
  const stage = document.getElementById('stage');
  const stageEmpty = document.getElementById('stageEmpty');
  const stageImg = document.getElementById('stageImg');
  const safeBox = document.getElementById('safeBox');
  const gradientBand = document.getElementById('gradientBand');
  const safeLabel = document.getElementById('safeLabel');
  const badge = document.getElementById('badge');
  const phoneEmpty = document.getElementById('phoneEmpty');
  const phoneImg = document.getElementById('phoneImg');
  const phoneCrop = document.getElementById('phoneCrop');
  const previewHint = document.getElementById('previewHint');
  const exportCanvas = document.getElementById('exportCanvas');
  const exportEmpty = document.getElementById('exportEmpty');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  const TARGET_W = 1280;
  const TARGET_H = 720;

  let source = null; /* { el, width, height, name } */
  let objectUrl = null;

  function clearObjectUrl() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  async function decodeImage(file) {
    if (window.createImageBitmap) {
      try {
        return await createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch (e) { /* fall back to an img element */ }
    }
    return new Promise(function (resolve, reject) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not decode image')); };
      img.src = url;
    });
  }

  function applyOverlays() {
    const loaded = !!source;
    safeBox.hidden = !(loaded && safeToggle.checked);
    safeLabel.hidden = !(loaded && safeToggle.checked);
    gradientBand.hidden = !(loaded && gradientToggle.checked);
    badge.hidden = !(loaded && badgeToggle.checked);
    phoneCrop.hidden = !(loaded && cropToggle.checked);
  }

  /* Draws the guides on top of a copy of the image at its natural size. */
  function drawExport() {
    if (!source) {
      exportCanvas.hidden = true;
      exportEmpty.hidden = false;
      downloadBtn.disabled = true;
      return;
    }
    const w = source.width;
    const h = source.height;
    exportCanvas.width = w;
    exportCanvas.height = h;
    const ctx = exportCanvas.getContext('2d');
    ctx.drawImage(source.el, 0, 0, w, h);

    const line = Math.max(2, Math.round(w / 320));
    const font = Math.max(12, Math.round(w / 42));

    if (safeToggle.checked) {
      const insetX = w * 0.05;
      const insetY = h * 0.05;
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = line;
      ctx.setLineDash([line * 4, line * 3]);
      ctx.strokeRect(insetX, insetY, w - insetX * 2, h - insetY * 2);
      ctx.restore();
    }

    if (gradientToggle.checked) {
      const bandH = h * 0.3;
      const grad = ctx.createLinearGradient(0, h - bandH, 0, h);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.82)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, h - bandH, w, bandH);
    }

    if (badgeToggle.checked) {
      const text = '12:46';
      ctx.font = '700 ' + font + 'px system-ui, sans-serif';
      const padX = font * 0.5;
      const padY = font * 0.3;
      const textW = ctx.measureText(text).width;
      const boxW = textW + padX * 2;
      const boxH = font + padY * 2;
      const x = w - boxW - w * 0.012;
      const y = h - boxH - h * 0.022;
      ctx.fillStyle = 'rgba(11,18,32,0.85)';
      ctx.fillRect(x, y, boxW, boxH);
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + padX, y + boxH / 2);
    }

    if (cropToggle.checked) {
      ctx.save();
      ctx.strokeStyle = 'rgba(251,191,36,0.9)';
      ctx.lineWidth = line;
      ctx.setLineDash([line * 4, line * 3]);
      ctx.beginPath();
      ctx.moveTo(w * 0.25, 0);
      ctx.lineTo(w * 0.25, h);
      ctx.moveTo(w * 0.75, 0);
      ctx.lineTo(w * 0.75, h);
      ctx.stroke();
      ctx.restore();
    }

    exportCanvas.hidden = false;
    exportEmpty.hidden = true;
    downloadBtn.disabled = false;
  }

  function checkAspect() {
    if (!source) {
      sizeHint.hidden = true;
      return;
    }
    const ratio = source.width / source.height;
    const target = TARGET_W / TARGET_H;
    sizeHint.hidden = false;
    if (Math.abs(ratio - target) < 0.01) {
      sizeHint.className = 'field-hint';
      sizeHint.textContent = '16:9 - the same shape YouTube uses for thumbnails.';
    } else {
      sizeHint.className = 'field-hint err';
      sizeHint.textContent = 'Not 16:9 (' + source.width + ' × ' + source.height + '). YouTube crops it, so check the checked guides before you publish.';
    }
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
      clearObjectUrl();
      source = { el: el, width: width, height: height, name: file.name || 'thumbnail' };

      srcName.textContent = source.name;
      srcDims.textContent = width + ' × ' + height;
      srcWeight.textContent = CT.fmtBytes(file.size);
      sourceStats.hidden = false;

      objectUrl = URL.createObjectURL(file);
      stageImg.src = objectUrl;
      stageImg.hidden = false;
      phoneImg.src = objectUrl;
      phoneImg.hidden = false;
      stageEmpty.hidden = true;
      phoneEmpty.hidden = true;
      stage.style.background = '#0b1220';
      previewHint.textContent = 'Guides on';
      applyOverlays();
      checkAspect();
      drawExport();
    } catch (e) {
      CT.toast('That image could not be opened. Try a JPG, PNG or WebP file.', 'err');
    }
  }

  [safeToggle, gradientToggle, badgeToggle, cropToggle].forEach(function (el) {
    el.addEventListener('change', function () {
      applyOverlays();
      drawExport();
    });
  });

  downloadBtn.addEventListener('click', function () {
    if (!source) return;
    const name = CT.baseName(source.name) + '-guides.png';
    exportCanvas.toBlob(function (blob) {
      if (!blob) {
        CT.toast('This browser could not export the PNG.', 'err');
        return;
      }
      CT.downloadBlob(blob, name);
      CT.toast('Saved ' + name);
    }, 'image/png');
  });

  resetBtn.addEventListener('click', function () {
    if (source && typeof source.el.close === 'function') source.el.close();
    source = null;
    clearObjectUrl();
    stageImg.removeAttribute('src');
    stageImg.hidden = true;
    phoneImg.removeAttribute('src');
    phoneImg.hidden = true;
    stageEmpty.hidden = false;
    phoneEmpty.hidden = false;
    sourceStats.hidden = true;
    sizeHint.hidden = true;
    previewHint.textContent = 'No image yet';
    safeToggle.checked = true;
    gradientToggle.checked = true;
    badgeToggle.checked = true;
    cropToggle.checked = true;
    applyOverlays();
    drawExport();
  });

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

  applyOverlays();
  drawExport();
})();
