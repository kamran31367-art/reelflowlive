/* ReelFlow Toolkit - shared helpers */
(function () {
  const CT = (window.CT = window.CT || {});

  CT.$ = (sel, root) => (root || document).querySelector(sel);
  CT.$$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  /* Fired once a visitor actually receives a result (download or copy), so the
     tool page can offer its support note at the moment it is relevant. */
  function noteResult() { document.dispatchEvent(new CustomEvent('ct:result')); }

  CT.fmtBytes = function (n, digits) {
    if (!isFinite(n) || n < 0) return '—';
    if (n === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
    const v = n / Math.pow(1024, i);
    const d = digits == null ? 1 : digits;
    return (i === 0 ? Math.round(v) : v.toFixed(d)) + ' ' + units[i];
  };

  CT.downloadBlob = function (blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    noteResult();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };

  CT.downloadUrl = function (url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    noteResult();
  };

  CT.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { noteResult(); return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  };

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    if (ok) noteResult();
    return ok;
  }

  let toastWrap = null;
  CT.toast = function (msg, kind) {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'toast-wrap';
      toastWrap.setAttribute('role', 'status');
      toastWrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastWrap);
    }
    const t = document.createElement('div');
    t.className = 'toast' + (kind ? ' ' + kind : '');
    t.textContent = msg;
    toastWrap.appendChild(t);
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transition = 'opacity .3s';
      setTimeout(function () { t.remove(); }, 350);
    }, 2400);
  };

  CT.escapeHtml = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* Parses "1:02:03.5", "2:03", "125". Returns seconds (float) or null. */
  CT.parseClock = function (str) {
    if (str == null) return null;
    str = String(str).trim().replace(',', '.');
    if (!str) return null;
    const m = str.match(/^(\d+(?:\.\d+)?)(?::(\d+(?:\.\d+)?))?(?::(\d+(?:\.\d+)?))?$/);
    if (!m) return null;
    let secs;
    if (m[3] != null) secs = (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]);
    else if (m[2] != null) secs = (+m[1]) * 60 + (+m[2]);
    else secs = +m[1];
    return secs;
  };

  /* mode: 'auto' (h only when >= 1h) | 'always' */
  CT.formatClock = function (secs, mode) {
    if (!isFinite(secs) || secs < 0) return '';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (mode === 'always' || (mode !== 'never' && h > 0)) {
      return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    return m + ':' + String(s).padStart(2, '0');
  };

  CT.debounce = function (fn, ms) {
    let t;
    const wait = ms == null ? 150 : ms;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  };

  CT.baseName = function (name) {
    return String(name || 'file').replace(/\.[^.]+$/, '');
  };
})();
