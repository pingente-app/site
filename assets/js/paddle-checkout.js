/* pingente.app — abre o overlay checkout da Paddle nos botões [data-pack].
   Depende de paddle.js (cdn.paddle.com/paddle/v2/paddle.js) e de paddle-config.js. */
(function () {
  var cfg = window.PINGENTE_PADDLE || {};
  var prices = cfg.prices || {};
  var LOCALE = { 'pt-BR': 'pt-br', 'en-US': 'en', 'es-419': 'es' };
  var ready = false;

  function locale() {
    var lang = window.pingenteLang ? window.pingenteLang.current() : 'en-US';
    return LOCALE[lang] || 'en';
  }

  function disable(button) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    var soon = button.getAttribute('data-soon');
    if (soon) button.textContent = soon;
  }

  function open(priceId) {
    if (!ready) return;
    window.Paddle.Checkout.open({
      items: [{ priceId: priceId, quantity: 1 }],
      settings: {
        successUrl: cfg.successUrl || 'https://pingente.app/codes/?txn={transaction_id}',
        locale: locale(),
        displayMode: 'overlay'
      }
    });
  }

  function init() {
    if (cfg.clientToken && window.Paddle) {
      try {
        if (cfg.environment === 'sandbox') window.Paddle.Environment.set('sandbox');
        window.Paddle.Initialize({ token: cfg.clientToken });
        ready = true;
      } catch (e) {
        ready = false;
      }
    }
    document.querySelectorAll('button[data-pack]').forEach(function (button) {
      var priceId = prices[button.getAttribute('data-pack')] || '';
      if (!ready || !priceId) { disable(button); return; }
      button.addEventListener('click', function () { open(priceId); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
