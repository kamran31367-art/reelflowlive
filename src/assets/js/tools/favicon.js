/* Favicon Generator - renders PNG icon sizes and packs favicon.ico in the browser. */
(function () {
  'use strict';

  var SIZES = [16, 32, 48, 64, 180, 192, 512];
  var ICO_SIZES = [16, 32, 48];
  var PNG_NAMES = { 16: 'favicon-16x16.png', 32: 'favicon-32x32.png', 48: 'favicon-48x48.png', 64: 'favicon-64x64.png', 180: 'apple-touch-icon.png', 192: 'favicon-192x192.png', 512: 'favicon-512x512.png' };

  var mode = 'image';
  var sourceImage = null;
  var iconBlobs = {};
  var iconUrls = [];
  var renderToken = 0;

  var modeSeg = document.getElementById('modeSeg');
  var imagePane = document.getElementById('imagePane');
  var textPane = document.getElementById('textPane');
  var dropzone = document.getElementById('iconDropzone');
  var fileInput = document.getElementById('iconFile');
  var infoBox = document.getElementById('iconInfo');
  var nameEl = document.getElementById('iconName');
  var dimsEl = document.getElementById('iconDims');
  var textInput = document.getElementById('iconText');
  var shapeInput = document.getElementById('iconShape');
  var bgInput = document.getElementById('iconBg');
  var inkInput = document.getElementById('iconInk');
  var grid = document.getElementById('iconGrid');
  var emptyEl = document.getElementById('iconEmpty');
  var statusEl = document.getElementById('iconStatus');
  var icoBtn = document.getElementById('downloadIco');
  var snippetBtn = document.getElementById('copySnippet');
  var resetBtn = document.getElementById('resetIcons');

  if (!grid) return;

  function setMode(next) {
    mode = next;
    Array.prototype.forEach.call(modeSeg.querySelectorAll('button'), function (btn) {
      var on = btn.getAttribute('data-mode') === next;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    imagePane.hidden = next !== 'image';
    textPane.hidden = next !== 'text';
    render();
  }

  function revokeUrls() {
    iconUrls.forEach(function (url) { URL.revokeObjectURL(url); });
    iconUrls = [];
  }

  function loadImageFile(file) {
    if (!file || !/^image\//.test(file.type)) {
      CT.toast('Choose an image file', 'err');
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        sourceImage = img;
        infoBox.hidden = false;
        nameEl.textContent = file.name;
        dimsEl.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
        render();
      };
      img.onerror = function () { CT.toast('That image could not be read', 'err'); };
      img.src = reader.result;
    };
    reader.onerror = function () { CT.toast('That file could not be read', 'err'); };
    reader.readAsDataURL(file);
  }

  function roundedRect(ctx, size, radius) {
    var r = Math.min(radius, size / 2);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
  }

  function drawIcon(size) {
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    if (mode === 'image' && sourceImage) {
      var scale = Math.max(size / sourceImage.naturalWidth, size / sourceImage.naturalHeight);
      var sw = size / scale;
      var sh = size / scale;
      var sx = (sourceImage.naturalWidth - sw) / 2;
      var sy = (sourceImage.naturalHeight - sh) / 2;
      ctx.drawImage(sourceImage, sx, sy, sw, sh, 0, 0, size, size);
      return canvas;
    }

    var letters = (textInput.value || 'R').slice(0, 2).toUpperCase();
    var shape = shapeInput.value;
    ctx.fillStyle = bgInput.value;
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'rounded') {
      roundedRect(ctx, size, size * 0.22);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    ctx.fillStyle = inkInput.value;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var fontSize = Math.round(size * (letters.length === 1 ? 0.56 : 0.44));
    ctx.font = '700 ' + fontSize + 'px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
    ctx.fillText(letters, size / 2, size / 2 + size * 0.02);
    return canvas;
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error('PNG export failed'));
      }, 'image/png');
    });
  }

  function render() {
    var token = ++renderToken;
    var canRenderImage = mode === 'image' && !!sourceImage;
    var canRenderText = mode === 'text' && (textInput.value || '').trim().length > 0;
    revokeUrls();
    grid.innerHTML = '';
    iconBlobs = {};

    if (!canRenderImage && !canRenderText) {
      emptyEl.hidden = false;
      statusEl.textContent = mode === 'image' ? 'Waiting for an image' : 'Type one or two letters';
      icoBtn.disabled = true;
      snippetBtn.disabled = true;
      return;
    }

    emptyEl.hidden = true;
    var jobs = SIZES.map(function (size) {
      return canvasToBlob(drawIcon(size)).then(function (blob) {
        return { size: size, blob: blob };
      });
    });

    Promise.all(jobs).then(function (results) {
      if (token !== renderToken) return;
      statusEl.textContent = results.length + ' icons ready';
      results.forEach(function (item) {
        iconBlobs[item.size] = item.blob;
        var url = URL.createObjectURL(item.blob);
        iconUrls.push(url);

        var cell = document.createElement('div');
        cell.className = 'icon-cell';

        var img = document.createElement('img');
        img.src = url;
        img.alt = item.size + ' pixel icon';

        var label = document.createElement('span');
        label.textContent = item.size + ' x ' + item.size;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-ghost btn-sm';
        btn.textContent = 'PNG';
        btn.setAttribute('aria-label', 'Download ' + item.size + ' pixel PNG');
        btn.addEventListener('click', function () { downloadPng(item.size); });

        cell.appendChild(img);
        cell.appendChild(label);
        cell.appendChild(btn);
        grid.appendChild(cell);
      });
      icoBtn.disabled = false;
      snippetBtn.disabled = false;
    }).catch(function () {
      if (token !== renderToken) return;
      CT.toast('Icons could not be generated', 'err');
    });
  }

  function downloadPng(size) {
    var blob = iconBlobs[size];
    if (blob) CT.downloadBlob(blob, PNG_NAMES[size] || 'favicon-' + size + '.png');
  }

  function buildIco() {
    var parts = [];
    var jobs = ICO_SIZES.map(function (size) {
      return iconBlobs[size].arrayBuffer().then(function (buf) { return { size: size, buf: buf }; });
    });
    return Promise.all(jobs).then(function (list) {
      var header = new ArrayBuffer(6 + 16 * list.length);
      var view = new DataView(header);
      view.setUint16(0, 0, true);
      view.setUint16(2, 1, true);
      view.setUint16(4, list.length, true);
      var offset = 6 + 16 * list.length;
      list.forEach(function (item, index) {
        var base = 6 + index * 16;
        view.setUint8(base, item.size === 256 ? 0 : item.size);
        view.setUint8(base + 1, item.size === 256 ? 0 : item.size);
        view.setUint8(base + 2, 0);
        view.setUint8(base + 3, 0);
        view.setUint16(base + 4, 1, true);
        view.setUint16(base + 6, 32, true);
        view.setUint32(base + 8, item.buf.byteLength, true);
        view.setUint32(base + 12, offset, true);
        offset += item.buf.byteLength;
        parts.push(new Uint8Array(item.buf));
      });
      return new Blob([header].concat(parts), { type: 'image/x-icon' });
    });
  }

  function buildSnippet() {
    return [
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
      '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">',
      '<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">',
      '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
      '<link rel="icon" href="/favicon.ico" sizes="48x48">'
    ].join('\n');
  }

  function reset() {
    sourceImage = null;
    fileInput.value = '';
    infoBox.hidden = true;
    render();
  }

  modeSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-mode]');
    if (btn) setMode(btn.getAttribute('data-mode'));
  });

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
    if (event.dataTransfer.files.length) loadImageFile(event.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) loadImageFile(fileInput.files[0]);
  });

  var debouncedRender = CT.debounce(render, 160);
  textInput.addEventListener('input', debouncedRender);
  shapeInput.addEventListener('change', render);
  bgInput.addEventListener('input', debouncedRender);
  inkInput.addEventListener('input', debouncedRender);

  icoBtn.addEventListener('click', function () {
    if (!iconBlobs[16] || !iconBlobs[32] || !iconBlobs[48]) {
      CT.toast('Icons are still rendering', 'err');
      return;
    }
    buildIco().then(function (blob) { CT.downloadBlob(blob, 'favicon.ico'); });
  });

  snippetBtn.addEventListener('click', function () {
    CT.copy(buildSnippet()).then(function (ok) {
      CT.toast(ok ? 'HTML snippet copied' : 'Copy failed', ok ? '' : 'err');
    });
  });

  resetBtn.addEventListener('click', reset);

  render();
})();
