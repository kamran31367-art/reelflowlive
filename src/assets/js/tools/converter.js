/* Image Format Converter - batch re-encode between JPG, WebP and PNG on the canvas. */
(function () {
  'use strict';

  var MAX_FILES = 30;
  var FORMATS = {
    'image/jpeg': { ext: 'jpg', label: 'JPG' },
    'image/webp': { ext: 'webp', label: 'WebP' },
    'image/png': { ext: 'png', label: 'PNG' }
  };

  var dropzone = document.getElementById('dropzone');
  var fileInput = document.getElementById('fileInput');
  var formatSeg = document.getElementById('formatSeg');
  var outFormatInput = document.getElementById('outFormat');
  var quality = document.getElementById('quality');
  var qualityValue = document.getElementById('qualityValue');
  var qualityField = document.getElementById('qualityField');
  var bgColor = document.getElementById('bgColor');
  var summary = document.getElementById('summary');
  var sumCount = document.getElementById('sumCount');
  var sumBefore = document.getElementById('sumBefore');
  var sumAfter = document.getElementById('sumAfter');
  var sumSaved = document.getElementById('sumSaved');
  var sumFailed = document.getElementById('sumFailed');
  var sumFailedNum = document.getElementById('sumFailedNum');
  var multiNotice = document.getElementById('multiNotice');
  var downloadAll = document.getElementById('downloadAll');
  var clearAll = document.getElementById('clearAll');
  var listEmpty = document.getElementById('listEmpty');
  var list = document.getElementById('fileList');

  if (!dropzone) return;

  var items = [];
  var seq = 0;
  var encodeToken = 0;

  function currentType() { return outFormatInput.value; }

  function syncQualityVisibility() {
    qualityField.style.visibility = currentType() === 'image/png' ? 'hidden' : 'visible';
  }

  function addFiles(fileList) {
    var files = Array.prototype.slice.call(fileList).filter(function (file) {
      return /^image\/(jpeg|png|webp)$/.test(file.type);
    });
    if (!files.length) {
      CT.toast('Only JPG, PNG and WebP files are supported', 'err');
      return;
    }
    var room = MAX_FILES - items.length;
    if (room <= 0) {
      CT.toast('The list already has ' + MAX_FILES + ' images', 'err');
      return;
    }
    if (files.length > room) {
      files = files.slice(0, room);
      CT.toast('Added the first ' + room + ' files (limit ' + MAX_FILES + ')', 'err');
    }
    files.forEach(function (file) {
      var item = { id: ++seq, file: file, img: null, blob: null, url: null, failed: false, before: file.size, after: 0, thumbUrl: URL.createObjectURL(file) };
      items.push(item);
      var img = new Image();
      img.onload = function () {
        item.img = img;
        encodeAll();
      };
      img.onerror = function () {
        item.failed = true;
        renderList();
      };
      img.src = item.thumbUrl;
    });
    renderList();
  }

  function canvasFor(item) {
    var canvas = document.createElement('canvas');
    canvas.width = item.img.naturalWidth;
    canvas.height = item.img.naturalHeight;
    var ctx = canvas.getContext('2d');
    if (currentType() === 'image/jpeg') {
      ctx.fillStyle = bgColor.value || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(item.img, 0, 0);
    return canvas;
  }

  function encodeItem(item, type, q) {
    return new Promise(function (resolve) {
      var canvas = canvasFor(item);
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, type, type === 'image/png' ? undefined : q);
    });
  }

  function encodeAll() {
    var token = ++encodeToken;
    var type = currentType();
    var q = parseFloat(quality.value);
    var jobs = items.map(function (item) {
      if (!item.img) return Promise.resolve();
      return encodeItem(item, type, q).then(function (blob) {
        if (!blob) {
          item.failed = true;
          item.blob = null;
          return;
        }
        item.failed = false;
        if (item.url) URL.revokeObjectURL(item.url);
        item.blob = blob;
        item.after = blob.size;
        item.url = URL.createObjectURL(blob);
      });
    });
    Promise.all(jobs).then(function () {
      if (token !== encodeToken) return;
      renderList();
    });
  }

  function outName(item) {
    var base = CT.baseName(item.file.name);
    return base + '.' + FORMATS[currentType()].ext;
  }

  function renderList() {
    list.innerHTML = '';
    var done = items.filter(function (item) { return item.blob && !item.failed; });
    var failed = items.filter(function (item) { return item.failed; });
    var before = items.reduce(function (sum, item) { return sum + item.before; }, 0);
    var after = done.reduce(function (sum, item) { return sum + item.after; }, 0);

    listEmpty.hidden = items.length > 0;
    summary.hidden = items.length === 0;
    multiNotice.hidden = items.length < 2;
    downloadAll.disabled = done.length === 0;
    clearAll.disabled = items.length === 0;

    if (items.length) {
      sumCount.textContent = String(items.length);
      sumBefore.textContent = CT.fmtBytes(before);
      sumAfter.textContent = CT.fmtBytes(after);
      var saved = before - after;
      sumSaved.textContent = saved >= 0 ? CT.fmtBytes(saved) : '+' + CT.fmtBytes(-saved);
      sumFailed.hidden = failed.length === 0;
      sumFailedNum.textContent = String(failed.length);
    }

    items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'file-row';

      var thumb = document.createElement('img');
      thumb.src = item.thumbUrl;
      thumb.alt = '';
      row.appendChild(thumb);

      var info = document.createElement('div');
      var name = document.createElement('div');
      name.className = 'file-name';
      name.textContent = item.file.name;
      var sizes = document.createElement('div');
      sizes.className = 'file-sizes';
      if (item.failed) {
        sizes.textContent = 'Could not convert this file';
      } else if (item.blob) {
        var diff = item.before - item.after;
        sizes.innerHTML = CT.escapeHtml(CT.fmtBytes(item.before)) + ' &rarr; ' + CT.escapeHtml(CT.fmtBytes(item.after)) + ' ' +
          '<span class="' + (diff >= 0 ? 'saved' : 'bigger') + '">' +
          (diff >= 0 ? CT.fmtBytes(diff) + ' smaller' : '+' + CT.fmtBytes(-diff)) + '</span>';
      } else {
        sizes.textContent = 'Converting…';
      }
      info.appendChild(name);
      info.appendChild(sizes);
      row.appendChild(info);

      var actions = document.createElement('div');
      actions.className = 'file-actions';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm btn-ghost';
      btn.textContent = 'Download';
      btn.disabled = !item.blob || item.failed;
      btn.addEventListener('click', function () {
        if (item.blob) CT.downloadBlob(item.blob, outName(item));
      });
      actions.appendChild(btn);
      row.appendChild(actions);

      list.appendChild(row);
    });
  }

  formatSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-format]');
    if (!btn) return;
    outFormatInput.value = btn.getAttribute('data-format');
    Array.prototype.forEach.call(formatSeg.querySelectorAll('button'), function (other) {
      var on = other === btn;
      other.classList.toggle('on', on);
      other.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    syncQualityVisibility();
    encodeAll();
  });

  quality.addEventListener('input', function () {
    qualityValue.textContent = parseFloat(quality.value).toFixed(2);
  });
  quality.addEventListener('change', encodeAll);
  bgColor.addEventListener('change', encodeAll);

  dropzone.addEventListener('click', function () { fileInput.click(); });
  dropzone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  });
  dropzone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('dragover'); });
  dropzone.addEventListener('drop', function (event) {
    event.preventDefault();
    dropzone.classList.remove('dragover');
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) addFiles(fileInput.files);
    fileInput.value = '';
  });

  downloadAll.addEventListener('click', function () {
    items.forEach(function (item, index) {
      if (!item.blob || item.failed) return;
      setTimeout(function () { CT.downloadBlob(item.blob, outName(item)); }, index * 180);
    });
  });

  clearAll.addEventListener('click', function () {
    items.forEach(function (item) {
      if (item.url) URL.revokeObjectURL(item.url);
      URL.revokeObjectURL(item.thumbUrl);
    });
    items = [];
    renderList();
  });

  syncQualityVisibility();
  renderList();
})();
