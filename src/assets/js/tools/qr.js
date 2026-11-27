/* QR Code Generator */
(function () {
  const CT = window.CT;
  const canvas = document.getElementById('qrCanvas');
  if (!canvas || !CT) return;

  const typeSeg = document.getElementById('typeSeg');
  const typeValue = document.getElementById('typeValue');
  const textFields = document.getElementById('textFields');
  const contentInput = document.getElementById('contentInput');
  const contentLabel = document.getElementById('contentLabel');
  const contentHint = document.getElementById('contentHint');
  const wifiFields = document.getElementById('wifiFields');
  const wifiSsid = document.getElementById('wifiSsid');
  const wifiPass = document.getElementById('wifiPass');
  const wifiEnc = document.getElementById('wifiEnc');
  const wifiHidden = document.getElementById('wifiHidden');
  const sizeSelect = document.getElementById('qrSize');
  const marginRange = document.getElementById('qrMargin');
  const marginValue = document.getElementById('qrMarginValue');
  const fgColor = document.getElementById('fgColor');
  const bgColor = document.getElementById('bgColor');
  const qrEmpty = document.getElementById('qrEmpty');
  const qrHint = document.getElementById('qrHint');
  const modulesEl = document.getElementById('qrModules');
  const exportEl = document.getElementById('qrExport');
  const lengthEl = document.getElementById('qrLength');
  const pngBtn = document.getElementById('pngBtn');
  const svgBtn = document.getElementById('svgBtn');

  const PLACEHOLDERS = {
    url: { label: 'Link', text: 'https://example.com', hint: 'Paste the address the code should open.', empty: 'Type a link to see the code.' },
    text: { label: 'Text', text: 'Any text you want to share', hint: 'Any short text or note is encoded as it is.', empty: 'Type some text to see the code.' },
    wifi: { label: 'Link', text: 'https://example.com', hint: 'Paste the address the code should open.', empty: 'Type a network name to see the code.' }
  };

  let qr = null; /* last generated QRCode model */
  let payload = '';
  let scaleFactor = 1;

  function currentType() {
    return typeValue.value || 'url';
  }

  /* Escapes the separators and special characters of the WIFI format. */
  function wifiEscape(value) {
    return String(value).replace(/([\\;,:"])/g, '\\$1');
  }

  function normalizeUrl(raw) {
    let text = String(raw || '').trim();
    if (!text) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(text) && /^[^\s]+\.[^\s]+/.test(text)) {
      text = 'https://' + text;
    }
    return text;
  }

  /* Returns the string to encode, or '' when the input is not usable. */
  function buildPayload() {
    const type = currentType();
    if (type === 'wifi') {
      const ssid = wifiSsid.value.trim();
      if (!ssid) return '';
      const enc = wifiEnc.value || 'nopass';
      const hidden = wifiHidden.value === 'true' ? 'true' : 'false';
      const pass = enc === 'nopass' ? '' : wifiPass.value;
      return 'WIFI:T:' + enc + ';S:' + wifiEscape(ssid) + ';P:' + wifiEscape(pass) + ';H:' + hidden + ';;';
    }
    const raw = contentInput.value.trim();
    if (!raw) return '';
    return type === 'url' ? normalizeUrl(raw) : raw;
  }

  function clearCanvasHint() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function render() {
    marginValue.textContent = marginRange.value;
    exportEl.textContent = Number(sizeSelect.value) + ' × ' + Number(sizeSelect.value);

    const data = buildPayload();
    payload = data;

    if (!data) {
      qr = null;
      canvas.hidden = true;
      qrEmpty.hidden = false;
      qrEmpty.textContent = PLACEHOLDERS[currentType()].empty;
      qrHint.textContent = 'Waiting for input';
      modulesEl.textContent = '—';
      lengthEl.textContent = '—';
      pngBtn.disabled = true;
      svgBtn.disabled = true;
      return;
    }

    let code = null;
    try {
      code = qrcode(0, 'M');
      code.addData(data);
      code.make();
    } catch (e) {
      code = null;
    }

    if (!code || !code.getModuleCount()) {
      qr = null;
      canvas.hidden = true;
      qrEmpty.hidden = false;
      qrEmpty.textContent = 'This content is too long or cannot be encoded. Shorten it and try again.';
      qrHint.textContent = 'Cannot encode';
      modulesEl.textContent = '—';
      lengthEl.textContent = '—';
      pngBtn.disabled = true;
      svgBtn.disabled = true;
      return;
    }

    qr = code;
    const count = code.getModuleCount();
    const margin = Math.max(0, Math.min(8, Number(marginRange.value) || 0));
    const size = Number(sizeSelect.value) || 512;
    /* Integer module size so every module is drawn at the same width. */
    const scale = Math.max(1, Math.floor(size / (count + 2 * margin)));
    scaleFactor = scale;

    const drawn = (count + 2 * margin) * scale;
    canvas.width = drawn;
    canvas.height = drawn;
    canvas.hidden = false;
    qrEmpty.hidden = true;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor.value || '#ffffff';
    ctx.fillRect(0, 0, drawn, drawn);
    ctx.fillStyle = fgColor.value || '#000000';
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (code.isDark(row, col)) {
          ctx.fillRect((col + margin) * scale, (row + margin) * scale, scale, scale);
        }
      }
    }

    modulesEl.textContent = count + ' × ' + count;
    lengthEl.textContent = data.length + (data.length === 1 ? ' character' : ' characters');
    qrHint.textContent = 'Ready — ' + drawn + ' × ' + drawn + ' px';
    pngBtn.disabled = false;
    svgBtn.disabled = false;
  }

  const scheduleRender = CT.debounce(render, 120);

  function applyType() {
    const type = currentType();
    const wifi = type === 'wifi';
    textFields.hidden = wifi;
    wifiFields.hidden = !wifi;
    contentLabel.textContent = PLACEHOLDERS[type].label;
    contentInput.placeholder = PLACEHOLDERS[type].text;
    contentHint.textContent = PLACEHOLDERS[type].hint;
    render();
  }

  function filename(ext) {
    return 'qr-' + currentType() + '.' + ext;
  }

  CT.$$('button', typeSeg).forEach(function (btn) {
    btn.addEventListener('click', function () {
      CT.$$('button', typeSeg).forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      typeValue.value = btn.getAttribute('data-type');
      applyType();
    });
  });

  contentInput.addEventListener('input', scheduleRender);
  [wifiSsid, wifiPass].forEach(function (el) { el.addEventListener('input', scheduleRender); });
  wifiEnc.addEventListener('change', function () {
    wifiPass.disabled = wifiEnc.value === 'nopass';
    render();
  });
  wifiHidden.addEventListener('change', scheduleRender);
  sizeSelect.addEventListener('change', render);
  fgColor.addEventListener('input', scheduleRender);
  bgColor.addEventListener('input', scheduleRender);
  marginRange.addEventListener('input', render);

  pngBtn.addEventListener('click', function () {
    if (!qr) return;
    canvas.toBlob(function (blob) {
      if (!blob) {
        CT.toast('This browser could not export the PNG.', 'err');
        return;
      }
      CT.downloadBlob(blob, filename('png'));
      CT.toast('Saved ' + filename('png'));
    }, 'image/png');
  });

  svgBtn.addEventListener('click', function () {
    if (!qr) return;
    const count = qr.getModuleCount();
    const margin = Math.max(0, Math.min(8, Number(marginRange.value) || 0));
    const scale = scaleFactor;
    const dim = (count + 2 * margin) * scale;
    const parts = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + dim + '" height="' + dim +
        '" viewBox="0 0 ' + dim + ' ' + dim + '" shape-rendering="crispEdges">',
      '<rect width="' + dim + '" height="' + dim + '" fill="' + (bgColor.value || '#ffffff') + '"/>'
    ];
    const fill = fgColor.value || '#000000';
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          parts.push('<rect x="' + (col + margin) * scale + '" y="' + (row + margin) * scale +
            '" width="' + scale + '" height="' + scale + '" fill="' + fill + '"/>');
        }
      }
    }
    parts.push('</svg>');
    CT.downloadBlob(new Blob([parts.join('\n')], { type: 'image/svg+xml' }), filename('svg'));
    CT.toast('Saved ' + filename('svg'));
  });

  wifiPass.disabled = false;
  clearCanvasHint();
  applyType();
})();
