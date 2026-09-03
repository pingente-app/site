/* pingente.app — troca de idioma das páginas trilíngues (pt-BR · en-US · es-419).
   Blocos: <section data-lang="pt-BR" lang="pt-BR" data-title="…"> e <span class="i18n" data-lang="…">.
   Detecção: ?lang= → localStorage → idiomas do navegador → en-US (fallback). */
(function () {
  var LANGS = ['pt-BR', 'en-US', 'es-419'];
  var KEY = 'pingente-lang';
  var LEGACY_KEY = 'pingente-privacy-lang';
  var SHORT = { 'pt-BR': 'pt', 'en-US': 'en', 'es-419': 'es' };
  var current = null;

  function detect() {
    var q = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(q) >= 0) return q;
    try {
      var s = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
      if (LANGS.indexOf(s) >= 0) return s;
    } catch (e) {}
    var prefs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < prefs.length; i++) {
      var p = String(prefs[i]).toLowerCase();
      if (p.indexOf('pt') === 0) return 'pt-BR';
      if (p.indexOf('es') === 0) return 'es-419';
      if (p.indexOf('en') === 0) return 'en-US';
    }
    return 'en-US';
  }

  function apply(lang, remember) {
    if (LANGS.indexOf(lang) < 0) lang = 'en-US';
    current = lang;
    document.querySelectorAll('section[data-lang], .i18n[data-lang]').forEach(function (el) {
      var on = el.getAttribute('data-lang') === lang;
      el.hidden = !on;
      if (on && el.hasAttribute('data-title')) document.title = el.getAttribute('data-title');
      if (on && el.tagName === 'SECTION' && el.getAttribute('lang')) {
        document.documentElement.lang = el.getAttribute('lang');
      }
    });
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    if (remember) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
    try { document.dispatchEvent(new CustomEvent('pingente:lang', { detail: lang })); } catch (e) {}
  }

  window.pingenteLang = {
    LANGS: LANGS,
    current: function () { return current || detect(); },
    short: function () { return SHORT[current || detect()]; },
    apply: apply
  };

  function init() {
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-lang'), true); });
    });
    apply(detect(), false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
