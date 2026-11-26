/* Image Compressor / WebP converter */
(function () {
  const CT = window.CT;
  const dropzone = document.getElementById('dropzone');
  if (!dropzone) return;

  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const listEmpty = document.getElementById('listEmpty');
  const summary = document.getElementById('summary');
  const sumCount = document.getElementById('sumCount');
  const sumBefore = document.getElementById('sumBefore');
  const sumAfter = document.getElementById('sumAfter');
  const sumSaved = document.getElementById('sumSaved');
  const sumFailed = document.getElementById('sumFailed');
  const sumFailedNum = document.getElementById('sumFailedNum');
  const formatSel = document.getElementById('format');
  const formatSeg = document.getElementById('formatSeg');
  const quality = document.getElementById('quality');
  const qualityValue = document.getElementById('qualityValue');
  const qualityField = document.getElementById('qualityField');
  const downloadAllBtn = document.getElementById('downloadAll');
  const clearAllBtn = document.getElementById('clearAll');
  const multiNotice = document.getElementById('multiNotice');

  const MAX_FILES = 30;
  const MAX_SIDE = 12000;
  const EXT = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };
  const SAME_OK = { 'image/jpeg': true, 'image/png': true, 'image/webp': true };

  const items = [];
  let uid = 0;
  let version = 0;
  const canvas = document.createElement('canvas');

  function targetMime(item) {
    const wanted = formatSel.value;
    if (wanted !== 'same') return wanted;
    return SAME_OK[item.file.type] ? item.file.type : 'image/webp';
  }

  function setQualityLabel() {
    qualityValue.textContent = Number(quality.value).toFixed(2);
  }

  function applyFormatUi() {
    const isPng = formatSel.value === 'image/png';
    quality.disabled = isPng;
    qualityField.style.opacity = isPng ? '0.45' : '1';
  }

  async function decode(file) {
    if (window.createImageBitmap) {
      try {
        return await createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch (e) { /* fall back to <img> */ }
    }
    return new Promise(function (resolve, reject) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
      img.src = url;
    });
  }

  function toBlob(cnv, mime, q) {
    return new Promise(function (resolve) {
      cnv.toBlob(resolve, mime, mime === 'image/png' ? undefined : q);
    });
  }

  function makeRow(item) {
    const row = document.createElement('div');
    row.className = 'file-row';

    const img = document.createElement('img');
    img.alt = '';
    img.src = item.url;
    row.appendChild(img);

    const info = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'file-name';
    name.textContent = item.file.name;
    name.title = item.file.name;
    const sizes = document.createElement('div');
    sizes.className = 'file-sizes';
    sizes.textContent = CT.fmtBytes(item.file.size) + ' · waiting…';
    info.appendChild(name);
    info.appendChild(sizes);
    row.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'file-actions';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-ghost btn-sm';
    saveBtn.textContent = 'Save';
    saveBtn.disabled = true;
    saveBtn.addEventListener('click', function () {
      if (!item.outBlob) return;
      const filename = CT.baseName(item.file.name) + '.' + (EXT[item.outType] || 'webp');
      CT.downloadBlob(item.outBlob, filename);
      CT.toast('Saved ' + filename);
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'icon-btn';
    removeBtn.setAttribute('aria-label', 'Remove ' + item.file.name);
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', function () {
      item.removed = true;
      URL.revokeObjectURL(item.url);
      row.remove();
      const idx = items.indexOf(item);
      if (idx !== -1) items.splice(idx, 1);
      refreshUi();
    });

    actions.appendChild(saveBtn);
    actions.appendChild(removeBtn);
    row.appendChild(actions);

    item.row = row;
    item.sizesEl = sizes;
    item.saveBtn = saveBtn;
  }

  function setRowState(item, html, isError) {
    if (!item.row || item.removed) return;
    item.sizesEl.innerHTML = html;
    item.sizesEl.style.color = isError ? 'var(--rose-ink)' : '';
  }

  function refreshUi() {
    const hasItems = items.length > 0;
    listEmpty.hidden = hasItems;
    summary.hidden = !hasItems;
    clearAllBtn.disabled = !hasItems;

    let before = 0;
    let readyBefore = 0;
    let after = 0;
    let ready = 0;
    let failed = 0;
    items.forEach(function (it) {
      before += it.file.size;
      if (it.outBlob) {
        after += it.outBlob.size;
        readyBefore += it.file.size;
        ready++;
      } else if (it.failed) {
        failed++;
      }
    });

    const settled = hasItems && ready + failed === items.length;
    sumCount.textContent = String(items.length);
    sumBefore.textContent = CT.fmtBytes(before);
    sumAfter.textContent = settled ? CT.fmtBytes(after) : '…';
    if (settled && readyBefore > 0) {
      const pct = Math.round((1 - after / readyBefore) * 100);
      sumSaved.textContent = pct >= 0 ? pct + '%' : Math.abs(pct) + '% bigger';
      sumSaved.classList.toggle('good', pct >= 0);
    } else {
      sumSaved.textContent = settled ? '—' : '…';
      sumSaved.classList.remove('good');
    }
    sumFailed.hidden = failed === 0;
    sumFailedNum.textContent = String(failed);
    downloadAllBtn.disabled = ready === 0;
  }

  async function compressOne(item, v) {
    try {
      const mime = targetMime(item);
      const q = Number(quality.value);
      const bmp = await decode(item.file);
      if (item.removed || v !== version) {
        if (typeof bmp.close === 'function') bmp.close();
        return;
      }
      const w = bmp.width || bmp.naturalWidth;
      const h = bmp.height || bmp.naturalHeight;
      if (!w || !h) throw new Error('empty image');

      const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      if (typeof bmp.close === 'function') bmp.close();

      const blob = await toBlob(canvas, mime, q);
      if (v !== version || item.removed) return;
      if (!blob) throw new Error('export failed');

      item.outBlob = blob;
      item.outType = blob.type || mime;
      item.saveBtn.disabled = false;

      const inSize = item.file.size;
      const outSize = blob.size;
      const pct = Math.round((1 - outSize / inSize) * 100);
      const cls = pct >= 0 ? 'saved' : 'bigger';
      const note = pct >= 0 ? pct + '% smaller' : Math.abs(pct) + '% larger';
      setRowState(
        item,
        CT.escapeHtml(CT.fmtBytes(inSize)) + ' → ' + CT.escapeHtml(CT.fmtBytes(outSize)) +
          ' <span class="' + cls + '">(' + note + ')</span>'
      );
    } catch (e) {
      if (v !== version || item.removed) return;
      item.outBlob = null;
      item.failed = true;
      item.saveBtn.disabled = true;
      setRowState(item, 'Could not compress this file (unsupported or broken image).', true);
    }
    refreshUi();
  }

  async function processAll() {
    if (!items.length) return;
    const v = ++version;
    items.forEach(function (it) {
      it.outBlob = null;
      it.failed = false;
      it.saveBtn.disabled = true;
      setRowState(it, CT.fmtBytes(it.file.size) + ' · compressing…', false);
    });
    refreshUi();
    for (let i = 0; i < items.length; i++) {
      if (v !== version) return;
      await compressOne(items[i], v);
    }
  }

  function addFiles(list) {
    const files = Array.prototype.slice.call(list || []).filter(function (f) {
      return f.type && f.type.indexOf('image/') === 0;
    });
    if (!files.length) {
      CT.toast('Please choose image files (JPG, PNG, WebP…).', 'err');
      return;
    }
    let room = MAX_FILES - items.length;
    if (room <= 0) {
      CT.toast('Maximum ' + MAX_FILES + ' files at a time.', 'err');
      return;
    }
    if (files.length > room) {
      CT.toast('Only the first ' + room + ' images were added (limit ' + MAX_FILES + ').', 'err');
      files.length = room;
    }
    files.forEach(function (file) {
      const item = { id: ++uid, file: file, url: URL.createObjectURL(file), outBlob: null, removed: false };
      makeRow(item);
      fileList.appendChild(item.row);
      items.push(item);
    });
    refreshUi();
    processAll();
  }

  /* Events */
  dropzone.addEventListener('click', function () { fileInput.click(); });
  dropzone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener('change', function () {
    addFiles(fileInput.files);
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
    addFiles(e.dataTransfer && e.dataTransfer.files);
  });

  CT.$$('button', formatSeg).forEach(function (btn) {
    btn.addEventListener('click', function () {
      CT.$$('button', formatSeg).forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      formatSel.value = btn.getAttribute('data-format');
      applyFormatUi();
      if (items.length) processAll();
    });
  });

  quality.addEventListener('input', setQualityLabel);
  quality.addEventListener('change', function () {
    if (items.length) processAll();
  });

  downloadAllBtn.addEventListener('click', function () {
    const ready = items.filter(function (it) { return it.outBlob; });
    if (!ready.length) return;
    multiNotice.hidden = ready.length < 2;
    ready.forEach(function (it, i) {
      setTimeout(function () {
        const filename = CT.baseName(it.file.name) + '.' + (EXT[it.outType] || 'webp');
        CT.downloadBlob(it.outBlob, filename);
      }, i * 400);
    });
    CT.toast('Saving ' + ready.length + ' file' + (ready.length > 1 ? 's' : '') + '…');
  });

  clearAllBtn.addEventListener('click', function () {
    version++;
    items.forEach(function (it) { URL.revokeObjectURL(it.url); });
    items.length = 0;
    fileList.innerHTML = '';
    multiNotice.hidden = true;
    refreshUi();
  });

  setQualityLabel();
  applyFormatUi();
  refreshUi();
})();
