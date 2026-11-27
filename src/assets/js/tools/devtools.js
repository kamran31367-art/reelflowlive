/* Developer tools: JSON, Base64, hash, password and URL helpers */
(function () {
  const CT = window.CT;
  const seg = document.getElementById('toolSeg');
  if (!seg || !CT) return;

  const out = document.getElementById('output');
  const outHint = document.getElementById('outHint');
  const outputCopy = document.getElementById('outputCopy');
  const outputClear = document.getElementById('outputClear');
  const modeHint = document.getElementById('modeHint');
  const panels = CT.$$('.panel', document.querySelector('.workspace'));

  const MODE_HINT = {
    json: 'JSON formatter',
    base64: 'Base64 encoder',
    hash: 'SHA-256 and SHA-1',
    password: 'Strong password',
    url: 'URL encode and decode'
  };

  function showPanel(name) {
    CT.$$('button', seg).forEach(function (btn) {
      const on = btn.getAttribute('data-panel') === name;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.hidden = p.id !== 'panel-' + name;
    });
    if (modeHint) modeHint.textContent = MODE_HINT[name] || '';
  }

  CT.$$('button', seg).forEach(function (btn) {
    btn.addEventListener('click', function () { showPanel(btn.getAttribute('data-panel')); });
  });

  /* ---------- shared helpers ---------- */

  function setOutput(text, hint) {
    if (!out) return;
    out.value = text == null ? '' : String(text);
    if (outputCopy) outputCopy.disabled = !out.value;
    if (outHint) outHint.textContent = hint || (out.value ? 'Result ready' : 'Result appears here');
  }

  function setErr(el, msg) {
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  function copyText(text, label) {
    if (!text) {
      CT.toast('Nothing to copy yet', 'err');
      return;
    }
    CT.copy(text).then(function (ok) {
      CT.toast(ok ? (label || 'Copied') : 'Could not copy', ok ? '' : 'err');
    }, function () {
      CT.toast('Could not copy', 'err');
    });
  }

  if (outputCopy) {
    outputCopy.addEventListener('click', function () { copyText(out.value, 'Output copied'); });
  }
  if (outputClear) {
    outputClear.addEventListener('click', function () { setOutput('', 'Result appears here'); });
  }

  const bytesToB64 = function (bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  };

  const b64ToBytes = function (b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };

  /* ---------- JSON ---------- */

  const jsonInput = document.getElementById('jsonInput');
  const jsonBadge = document.getElementById('jsonBadge');
  const jsonError = document.getElementById('jsonError');
  const jsonCopy = document.getElementById('jsonCopy');

  function jsonBadgeSet(kind, text) {
    if (!jsonBadge) return;
    jsonBadge.className = 'badge' + (kind ? ' ' + kind : '');
    jsonBadge.textContent = text;
  }

  function snippetAround(text, pos) {
    const start = Math.max(0, pos - 24);
    const end = Math.min(text.length, pos + 30);
    return (start > 0 ? '...' : '') + text.slice(start, end).replace(/\s+/g, ' ') + (end < text.length ? '...' : '');
  }

  function parseJson() {
    const raw = jsonInput ? jsonInput.value : '';
    if (!raw.trim()) {
      jsonBadgeSet('', 'Nothing parsed yet');
      setErr(jsonError, 'Paste some JSON first.');
      return null;
    }
    try {
      const value = JSON.parse(raw);
      jsonBadgeSet('ok', 'Valid JSON');
      setErr(jsonError, '');
      return value;
    } catch (err) {
      let msg = err && err.message ? err.message : 'Invalid JSON';
      const m = /position\s+(\d+)/i.exec(msg);
      if (m) {
        const pos = parseInt(m[1], 10);
        msg += '  near: "' + snippetAround(raw, pos) + '"';
      }
      jsonBadgeSet('bad', 'Invalid JSON');
      setErr(jsonError, msg);
      return null;
    }
  }

  function jsonOut(value, space) {
    const text = space == null ? JSON.stringify(value) : JSON.stringify(value, null, space);
    if (jsonCopy) jsonCopy.disabled = !text;
    return text;
  }

  const jsonFormat = document.getElementById('jsonFormat');
  const jsonMinify = document.getElementById('jsonMinify');
  const jsonValidate = document.getElementById('jsonValidate');

  if (jsonFormat) {
    jsonFormat.addEventListener('click', function () {
      const value = parseJson();
      if (value === null && jsonError && !jsonError.hidden) { setOutput('', 'Fix the JSON and try again'); return; }
      setOutput(jsonOut(value, 2), 'Formatted with 2-space indent');
    });
  }
  if (jsonMinify) {
    jsonMinify.addEventListener('click', function () {
      const value = parseJson();
      if (value === null && jsonError && !jsonError.hidden) { setOutput('', 'Fix the JSON and try again'); return; }
      const text = jsonOut(value, null);
      setOutput(text, text.length + ' bytes minified');
    });
  }
  if (jsonValidate) {
    jsonValidate.addEventListener('click', function () {
      const value = parseJson();
      if (!jsonInput || !jsonInput.value.trim()) { setOutput('', 'Result appears here'); return; }
      if (value === null && jsonError && !jsonError.hidden) {
        setOutput('Invalid JSON', 'Validation failed');
        return;
      }
      let keys = 0;
      if (value && typeof value === 'object') keys = Object.keys(value).length;
      setOutput('Valid JSON\n' + (Array.isArray(value) ? 'Array with ' + value.length + ' items' : typeof value === 'object' ? 'Object with ' + keys + ' top-level keys' : 'Primitive value (' + typeof value + ')'), 'Validation passed');
    });
  }
  if (jsonCopy) {
    jsonCopy.addEventListener('click', function () { copyText(out.value, 'JSON copied'); });
  }

  /* ---------- Base64 ---------- */

  const b64Input = document.getElementById('b64Input');
  const b64Error = document.getElementById('b64Error');
  const b64Encode = document.getElementById('b64Encode');
  const b64Decode = document.getElementById('b64Decode');
  const b64Swap = document.getElementById('b64Swap');

  function encodeB64(text) {
    return bytesToB64(new TextEncoder().encode(text));
  }

  function decodeB64(text) {
    const clean = text.replace(/\s+/g, '');
    const bytes = b64ToBytes(clean);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  if (b64Encode) {
    b64Encode.addEventListener('click', function () {
      const text = b64Input ? b64Input.value : '';
      setErr(b64Error, '');
      if (!text) { setErr(b64Error, 'Type something to encode.'); setOutput('', 'Result appears here'); return; }
      try {
        setOutput(encodeB64(text), text.length + ' characters encoded');
      } catch (err) {
        setErr(b64Error, 'Could not encode that text.');
      }
    });
  }
  if (b64Decode) {
    b64Decode.addEventListener('click', function () {
      const text = b64Input ? b64Input.value.trim() : '';
      setErr(b64Error, '');
      if (!text) { setErr(b64Error, 'Paste some Base64 to decode.'); setOutput('', 'Result appears here'); return; }
      try {
        setOutput(decodeB64(text), 'Decoded from Base64');
      } catch (err) {
        setErr(b64Error, 'That is not valid Base64, or it is not UTF-8 text.');
        setOutput('', 'Result appears here');
      }
    });
  }
  if (b64Swap) {
    b64Swap.addEventListener('click', function () {
      if (!b64Input) return;
      const current = out ? out.value : '';
      if (!current) { setErr(b64Error, 'Run Encode or Decode first, then swap.'); return; }
      b64Input.value = current;
      setOutput('', 'Result appears here');
      setErr(b64Error, '');
    });
  }

  /* ---------- Hash ---------- */

  const hashInput = document.getElementById('hashInput');
  const hashError = document.getElementById('hashError');
  const hashOut256 = document.getElementById('hashOut256');
  const hashOut1 = document.getElementById('hashOut1');
  const hashCopy = document.getElementById('hashCopy');
  const hashSha256 = document.getElementById('hashSha256');
  const hashSha1 = document.getElementById('hashSha1');

  let lastAlgo = '';

  function cryptoAvailable() {
    return !!(window.crypto && window.crypto.subtle && window.crypto.subtle.digest);
  }

  function toHex(buf) {
    const bytes = new Uint8Array(buf);
    let hex = '';
    for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
    return hex;
  }

  function runHash(algo) {
    const text = hashInput ? hashInput.value : '';
    setErr(hashError, '');
    if (!cryptoAvailable()) {
      setErr(hashError, 'Hashing is not available in this browser. Open the page on a secure (https) connection or in a newer browser.');
      return;
    }
    const data = new TextEncoder().encode(text);
    window.crypto.subtle.digest(algo === 'SHA-1' ? 'SHA-1' : 'SHA-256', data).then(function (buf) {
      const hex = toHex(buf);
      if (algo === 'SHA-1') {
        if (hashOut1) hashOut1.textContent = hex;
      } else if (hashOut256) {
        hashOut256.textContent = hex;
      }
      lastAlgo = algo === 'SHA-1' ? 'SHA-1' : 'SHA-256';
      setOutput(hex, lastAlgo + ' of ' + data.length + ' bytes');
      if (hashCopy) hashCopy.disabled = false;
    }, function () {
      setErr(hashError, 'Hashing failed. The browser may have blocked the crypto API on this page.');
    });
  }

  if (hashSha256) hashSha256.addEventListener('click', function () { runHash('SHA-256'); });
  if (hashSha1) hashSha1.addEventListener('click', function () { runHash('SHA-1'); });
  if (hashCopy) hashCopy.addEventListener('click', function () { copyText(out.value, (lastAlgo || 'Hash') + ' copied'); });

  if (hashInput) {
    hashInput.addEventListener('input', function () {
      if (hashOut256) hashOut256.textContent = '-';
      if (hashOut1) hashOut1.textContent = '-';
      if (hashCopy) hashCopy.disabled = true;
    });
  }

  /* ---------- Password ---------- */

  const pwdLength = document.getElementById('pwdLength');
  const pwdLengthOut = document.getElementById('pwdLengthOut');
  const pwdLower = document.getElementById('pwdLower');
  const pwdUpper = document.getElementById('pwdUpper');
  const pwdDigits = document.getElementById('pwdDigits');
  const pwdSymbols = document.getElementById('pwdSymbols');
  const pwdGenerate = document.getElementById('pwdGenerate');
  const pwdError = document.getElementById('pwdError');
  const pwdEntropy = document.getElementById('pwdEntropy');

  const GROUPS = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.?'
  };

  const LOWERCASE = GROUPS.lower;
  const UPPERCASE = GROUPS.upper;
  const DIGITS = GROUPS.digits;
  const SYMBOLS = GROUPS.symbols;

  function rnd(max) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    let value;
    do {
      window.crypto.getRandomValues(buf);
      value = buf[0];
    } while (value >= limit);
    return value % max;
  }

  function selectedGroups() {
    const groups = [];
    if (pwdLower && pwdLower.checked) groups.push(LOWERCASE);
    if (pwdUpper && pwdUpper.checked) groups.push(UPPERCASE);
    if (pwdDigits && pwdDigits.checked) groups.push(DIGITS);
    if (pwdSymbols && pwdSymbols.checked) groups.push(SYMBOLS);
    return groups;
  }

  function enforceOne() {
    if (!pwdLower || !pwdUpper || !pwdDigits || !pwdSymbols) return;
    const boxes = [pwdLower, pwdUpper, pwdDigits, pwdSymbols];
    const checked = boxes.filter(function (b) { return b.checked; });
    if (checked.length === 0) {
      boxes[0].checked = true;
      setErr(pwdError, 'At least one character group must stay checked, so Lowercase was re-enabled.');
    } else {
      setErr(pwdError, '');
    }
  }

  function generatePassword() {
    const length = Math.max(8, Math.min(64, parseInt(pwdLength ? pwdLength.value : '20', 10) || 8));
    const groups = selectedGroups();
    if (!groups.length) return '';
    const pool = groups.join('');
    const chars = [];
    /* guarantee at least one character from every selected group */
    groups.forEach(function (g) { chars.push(g[rnd(g.length)]); });
    while (chars.length < length) chars.push(pool[rnd(pool.length)]);
    /* shuffle with crypto randomness */
    for (let i = chars.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      const tmp = chars[i];
      chars[i] = chars[j];
      chars[j] = tmp;
    }
    return chars.slice(0, length).join('');
  }

  function updateLengthLabel() {
    if (pwdLengthOut && pwdLength) pwdLengthOut.textContent = pwdLength.value;
    if (pwdEntropy && pwdLength) {
      const pool = selectedGroups().join('').length;
      const bits = pool ? Math.round(parseInt(pwdLength.value, 10) * Math.log2(pool)) : 0;
      pwdEntropy.textContent = pool
        ? 'About ' + bits + ' bits of entropy from a pool of ' + pool + ' characters.'
        : 'Pick at least one character group.';
    }
  }

  if (pwdGenerate) {
    pwdGenerate.addEventListener('click', function () {
      enforceOne();
      if (!window.crypto || !window.crypto.getRandomValues) {
        setErr(pwdError, 'This browser has no secure random generator, so no password was created.');
        return;
      }
      const pwd = generatePassword();
      if (!pwd) { setErr(pwdError, 'Pick at least one character group.'); return; }
      updateLengthLabel();
      setOutput(pwd, 'Generated using crypto.getRandomValues');
    });
  }
  if (pwdLength) {
    pwdLength.addEventListener('input', function () {
      updateLengthLabel();
      if (pwdGenerate) pwdGenerate.click();
    });
  }
  [pwdLower, pwdUpper, pwdDigits, pwdSymbols].forEach(function (box) {
    if (!box) return;
    box.addEventListener('change', function () {
      enforceOne();
      updateLengthLabel();
      if (pwdGenerate) pwdGenerate.click();
    });
  });

  /* ---------- URL ---------- */

  const urlInput = document.getElementById('urlInput');
  const urlError = document.getElementById('urlError');
  const urlEncode = document.getElementById('urlEncode');
  const urlDecode = document.getElementById('urlDecode');
  const urlSwap = document.getElementById('urlSwap');

  if (urlEncode) {
    urlEncode.addEventListener('click', function () {
      const text = urlInput ? urlInput.value : '';
      setErr(urlError, '');
      if (!text) { setErr(urlError, 'Type something to encode.'); return; }
      setOutput(encodeURIComponent(text), 'encodeURIComponent applied');
    });
  }
  if (urlDecode) {
    urlDecode.addEventListener('click', function () {
      const text = urlInput ? urlInput.value : '';
      setErr(urlError, '');
      if (!text) { setErr(urlError, 'Paste an encoded string to decode.'); return; }
      try {
        setOutput(decodeURIComponent(text.replace(/\+/g, ' ')), 'decodeURIComponent applied');
      } catch (err) {
        setErr(urlError, 'That string has an invalid escape sequence, so it cannot be decoded.');
        setOutput('', 'Result appears here');
      }
    });
  }
  if (urlSwap) {
    urlSwap.addEventListener('click', function () {
      if (!urlInput) return;
      const current = out ? out.value : '';
      if (!current) { setErr(urlError, 'Run Encode or Decode first, then swap.'); return; }
      urlInput.value = current;
      setOutput('', 'Result appears here');
      setErr(urlError, '');
    });
  }

  /* ---------- init ---------- */

  showPanel('json');
  updateLengthLabel();
  if (!cryptoAvailable()) {
    setErr(hashError, 'Hashing is not available in this browser. Open the page on a secure (https) connection or in a newer browser.');
  }
})();
