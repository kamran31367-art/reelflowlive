/* ReelFlow Toolkit - shared page behaviour */
(function () {
  const CT = window.CT;

  /* Mobile navigation */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Footer year */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* Cookie consent. The banner stays hidden without JavaScript and no
     advertising script loads until the visitor accepts. */
  const banner = document.getElementById('consent');
  const STORAGE_KEY = 'ct.consent';
  const waiters = [];

  function readChoice(version) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.v === version && (saved.choice === 'granted' || saved.choice === 'denied')) {
        return saved.choice;
      }
    } catch (err) {
      /* Storage can be blocked; treat it as "not decided yet". */
    }
    return null;
  }

  CT.consent = {
    choice: null,
    whenReady: function (callback) {
      if (this.choice === 'granted') return callback(true);
      if (this.choice === 'denied') return false;
      waiters.push(callback);
      return false;
    }
  };

  if (banner) {
    const version = Number(banner.getAttribute('data-version')) || 1;
    const acceptBtn = document.getElementById('consentAccept');
    const declineBtn = document.getElementById('consentDecline');

    function hide() {
      banner.hidden = true;
      document.body.classList.remove('has-consent');
    }

    function decide(choice) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: version, choice: choice, ts: Date.now() }));
      } catch (err) {
        /* The choice still applies for this page view. */
      }
      CT.consent.choice = choice;
      hide();
      if (choice === 'granted') {
        waiters.splice(0).forEach(function (callback) { callback(true); });
      } else {
        waiters.length = 0;
      }
      window.dispatchEvent(new CustomEvent('ct:consent', { detail: { choice: choice } }));
    }

    if (acceptBtn) acceptBtn.addEventListener('click', function () { decide('granted'); });
    if (declineBtn) declineBtn.addEventListener('click', function () { decide('denied'); });

    CT.consent.choice = readChoice(version);
    if (!CT.consent.choice) {
      banner.hidden = false;
      document.body.classList.add('has-consent');
    }
  }

  /* Opt-out door on the privacy page. The choice cannot be undone mid-page
     because the ad script is already running, so clear it and reload. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-consent-reset]'), function (el) {
    el.hidden = false;
    el.addEventListener('click', function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* blocked storage */ }
      window.location.reload();
    });
  });

  /* Pointer tilt for the 3D icon tiles: cards lean towards the cursor and
     the icon floats above the surface. Skipped for touch and reduced motion. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reduceMotion && finePointer) {
    function tilt(el, maxX, maxY) {
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (px * maxY).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * maxX).toFixed(2) + 'deg');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--rx', '0deg');
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll('.tool-card'), function (card) { tilt(card, 6, 7); });
    Array.prototype.forEach.call(document.querySelectorAll('.icon-hero'), function (tile) { tilt(tile, 10, 12); });
  }

  /* Support note on tool pages: appears once the visitor has downloaded or
     copied a result, never before. */
  const supportNote = document.getElementById('supportNote');
  if (supportNote) {
    document.addEventListener('ct:result', function () {
      supportNote.hidden = false;
      supportNote.classList.add('on');
    }, { once: true });
  }
})();
