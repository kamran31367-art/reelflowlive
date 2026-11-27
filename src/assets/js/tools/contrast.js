/* WCAG color contrast checker */
(function () {
  const CT = window.CT;
  const textPick = document.getElementById('textPick');
  if (!textPick || !CT) return;

  const bgPick = document.getElementById('bgPick');
  const textHex = document.getElementById('textHex');
  const bgHex = document.getElementById('bgHex');
  const textSwatch = document.getElementById('textSwatch');
  const bgSwatch = document.getElementById('bgSwatch');
  const textErr = document.getElementById('textErr');
  const bgErr = document.getElementById('bgErr');
  const swapBtn = document.getElementById('swapBtn');
  const resetBtn = document.getElementById('resetBtn');
  const ratioValue = document.getElementById('ratioValue');
  const previewFrame = document.getElementById('previewFrame');
  const previewSmall = document.getElementById('previewSmall');
  const previewLarge = document.getElementById('previewLarge');

  const BADGES = {
    normalAA: document.getElementById('badgeNormalAA'),
    normalAAA: document.getElementById('badgeNormalAAA'),
    largeAA: document.getElementById('badgeLargeAA'),
    largeAAA: document.getElementById('badgeLargeAAA')
  };

  const DEFAULTS = { text: '#000000', bg: '#ffffff' };

  /* ---------- color parsing ---------- */

  function parseHex(raw) {
    let value = String(raw || '').trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(value)) {
      value = value.split('').map(function (ch) { return ch + ch; }).join('');
    }
    if (!/^[0-9a-f]{6}$/i.test(value)) return null;
    return {
      hex: '#' + value.toLowerCase(),
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  /* WCAG 2.x relative luminance */
  function luminance(color) {
    const channel = function (v) {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
  }

  function ratio(a, b) {
    const la = luminance(a);
    const lb = luminance(b);
    const light = Math.max(la, lb);
    const dark = Math.min(la, lb);
    return (light + 0.05) / (dark + 0.05);
  }

  function setBadge(el, ok, label) {
    if (!el) return;
    el.className = 'badge ' + (ok ? 'ok' : 'bad');
    el.textContent = label + (ok ? ': Pass' : ': Fail');
  }

  function setHint(el, msg) {
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  /* ---------- state ---------- */

  let textColor = parseHex(DEFAULTS.text);
  let bgColor = parseHex(DEFAULTS.bg);

  function render() {
    if (textSwatch) textSwatch.style.background = textColor.hex;
    if (bgSwatch) bgSwatch.style.background = bgColor.hex;

    if (previewFrame) {
      previewFrame.style.background = bgColor.hex;
      previewFrame.style.color = textColor.hex;
    }
    if (previewSmall) previewSmall.style.color = textColor.hex;
    if (previewLarge) previewLarge.style.color = textColor.hex;

    const r = ratio(textColor, bgColor);
    const rounded = Math.round(r * 100) / 100;
    if (ratioValue) ratioValue.textContent = rounded.toFixed(2);

    setBadge(BADGES.normalAA, r >= 4.5, 'AA normal');
    setBadge(BADGES.normalAAA, r >= 7, 'AAA normal');
    setBadge(BADGES.largeAA, r >= 3, 'AA large');
    setBadge(BADGES.largeAAA, r >= 4.5, 'AAA large');
  }

  /* ---------- inputs ---------- */

  function applyPicker(pick, hexField, which) {
    const color = parseHex(pick.value);
    if (!color) return;
    if (which === 'text') {
      textColor = color;
      setHint(textErr, '');
      textPick.classList.remove('invalid');
    } else {
      bgColor = color;
      setHint(bgErr, '');
      bgPick.classList.remove('invalid');
    }
    hexField.value = color.hex;
    render();
  }

  function applyHex(hexField, pick, which, errEl) {
    const raw = hexField.value.trim();
    if (!raw) {
      setHint(errEl, 'Type a hex value such as #1d4ed8.');
      pick.classList.add('invalid');
      return;
    }
    const color = parseHex(raw);
    if (!color) {
      setHint(errEl, 'Use #rgb or #rrggbb, for example #1d4ed8.');
      pick.classList.add('invalid');
      return;
    }
    if (which === 'text') textColor = color;
    else bgColor = color;
    hexField.value = color.hex;
    pick.value = color.hex;
    pick.classList.remove('invalid');
    setHint(errEl, '');
    render();
  }

  if (textPick) {
    textPick.addEventListener('input', function () { applyPicker(textPick, textHex, 'text'); });
  }
  if (bgPick) {
    bgPick.addEventListener('input', function () { applyPicker(bgPick, bgHex, 'bg'); });
  }

  if (textHex) {
    let lastValid = textColor.hex;
    textHex.addEventListener('input', function () {
      const color = parseHex(textHex.value);
      if (!color) {
        setHint(textErr, 'Use #rgb or #rrggbb, for example #1d4ed8.');
        return;
      }
      lastValid = color.hex;
      setHint(textErr, '');
      textPick.value = color.hex;
      textColor = color;
      render();
    });
    textHex.addEventListener('blur', function () {
      if (parseHex(textHex.value)) { applyHex(textHex, textPick, 'text', textErr); return; }
      textHex.value = lastValid;
      setHint(textErr, 'Kept the last valid color.');
    });
  }

  if (bgHex) {
    let lastValid = bgColor.hex;
    bgHex.addEventListener('input', function () {
      const color = parseHex(bgHex.value);
      if (!color) {
        setHint(bgErr, 'Use #rgb or #rrggbb, for example #1d4ed8.');
        return;
      }
      lastValid = color.hex;
      setHint(bgErr, '');
      bgPick.value = color.hex;
      bgColor = color;
      render();
    });
    bgHex.addEventListener('blur', function () {
      if (parseHex(bgHex.value)) { applyHex(bgHex, bgPick, 'bg', bgErr); return; }
      bgHex.value = lastValid;
      setHint(bgErr, 'Kept the last valid color.');
    });
  }

  if (swapBtn) {
    swapBtn.addEventListener('click', function () {
      const tmp = textColor;
      textColor = bgColor;
      bgColor = tmp;
      textPick.value = textColor.hex;
      bgPick.value = bgColor.hex;
      textHex.value = textColor.hex;
      bgHex.value = bgColor.hex;
      setHint(textErr, '');
      setHint(bgErr, '');
      render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      textColor = parseHex(DEFAULTS.text);
      bgColor = parseHex(DEFAULTS.bg);
      textPick.value = textColor.hex;
      bgPick.value = bgColor.hex;
      textHex.value = textColor.hex;
      bgHex.value = bgColor.hex;
      setHint(textErr, '');
      setHint(bgErr, '');
      render();
    });
  }

  render();
})();
