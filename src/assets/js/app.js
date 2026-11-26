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
})();
