/* pingente.app — idioma.
   Dois modos:
   1. Páginas geradas por idioma (tools/build.js): <html data-lang="pt-BR"> fixa o idioma; o seletor é
      um conjunto de links (.lang-switch a). Aqui o script só guarda a escolha e, na raiz em inglês,
      sugere /pt/ ou /es/ na primeira visita de um navegador nesses idiomas.
   2. Páginas trilíngues de runtime (/t/, /codes/, 404): blocos <section data-lang> e <span class="i18n">
      alternados em JavaScript; detecção: ?lang= → localStorage → idiomas do navegador → en-US. */
(function () {
  var LANGS = ['pt-BR', 'en-US', 'es-419'];
  var PREFIX = { 'pt-BR': '/pt', 'en-US': '', 'es-419': '/es' };
  var KEY = 'pingente-lang';
  var LEGACY_KEY = 'pingente-privacy-lang';
  var SHORT = { 'pt-BR': 'pt', 'en-US': 'en', 'es-419': 'es' };
  var fixed = document.documentElement.getAttribute('data-lang');
  var current = LANGS.indexOf(fixed) >= 0 ? fixed : null;

  function stored() {
    try {
      var s = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
      if (LANGS.indexOf(s) >= 0) return s;
    } catch (e) {}
    return null;
  }

  function fromBrowser() {
    var prefs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < prefs.length; i++) {
      var p = String(prefs[i]).toLowerCase();
      if (p.indexOf('pt') === 0) return 'pt-BR';
      if (p.indexOf('es') === 0) return 'es-419';
      if (p.indexOf('en') === 0) return 'en-US';
    }
    return 'en-US';
  }

  function detect() {
    var q = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(q) >= 0) return q;
    return stored() || fromBrowser();
  }

  function remember(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} }

  function apply(lang, save) {
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
    if (save) remember(lang);
    try { document.dispatchEvent(new CustomEvent('pingente:lang', { detail: lang })); } catch (e) {}
  }

  window.pingenteLang = {
    LANGS: LANGS,
    current: function () { return current || detect(); },
    short: function () { return SHORT[current || detect()]; },
    apply: apply
  };

  function initFixed() {
    // Escolha explícita no seletor → lembrar; assim a raiz em inglês não sugere de novo.
    document.querySelectorAll('.lang-switch a[hreflang]').forEach(function (a) {
      a.addEventListener('click', function () {
        var code = a.getAttribute('lang') === 'pt-BR' ? 'pt-BR' : a.getAttribute('lang') === 'es' ? 'es-419' : 'en-US';
        remember(code);
      });
    });
    // Primeira visita à raiz (inglês) vindo de um navegador em pt/es: vai para a versão do idioma.
    if (fixed === 'en-US' && !stored() && !new URLSearchParams(location.search).has('lang')) {
      var want = fromBrowser();
      if (want !== 'en-US') {
        remember(want);
        location.replace(PREFIX[want] + location.pathname + location.search + location.hash);
        return;
      }
    }
    if (fixed) remember(fixed);
  }

  function initRuntime() {
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-lang'), true); });
    });
    apply(detect(), false);
  }

  function init() { if (fixed) initFixed(); else initRuntime(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
