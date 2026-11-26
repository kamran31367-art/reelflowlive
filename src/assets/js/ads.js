/* Loads the advertising script only after consent when the site owner
   enables a provider in src/_data/ads.json. Nothing loads while disabled. */
(function () {
  var config = window.CT_ADS || {};
  if (!config.enabled || !config.scriptSrc) return;

  var path = window.location.pathname;
  var excluded = config.excludePages || [];
  var skip = excluded.some(function (prefix) {
    return prefix && path.indexOf(prefix) === 0;
  });
  if (skip) return;

  function inject() {
    if (document.querySelector('script[data-ad-provider]')) return;
    var script = document.createElement('script');
    script.src = config.scriptSrc;
    script.async = true;
    script.setAttribute('data-ad-provider', config.provider || 'ads');
    Object.keys(config.attrs || {}).forEach(function (key) {
      script.setAttribute('data-' + key, config.attrs[key]);
    });
    document.head.appendChild(script);
  }

  if (config.requireConsent !== false) {
    if (window.CT && window.CT.consent) window.CT.consent.whenReady(inject);
    return;
  }
  inject();
})();
