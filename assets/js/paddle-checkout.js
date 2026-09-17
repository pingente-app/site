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

  var API = 'https://pingente-backend.pingente-backend.workers.dev';
  var txn = null, done = false, watching = false;

  function goToCodes() {
    if (done || !txn) return; done = true;
    try { window.Paddle.Checkout.close(); } catch (_) {}
    location.assign('/codes/?txn=' + encodeURIComponent(txn));
  }

  // Pix (e outros métodos assíncronos) confirmam em outra aba e o overlay desta não fica sabendo:
  // consulta os códigos da transação a cada 4 s por até 20 min e abre /codes/ assim que o webhook os criar.
  function watch() {
    if (watching || !txn) return;
    watching = true;
    var tries = 0;
    (function tick() {
      if (done || tries++ > 300) return;
      setTimeout(function () {
        fetch(API + '/v1/codes?txn=' + encodeURIComponent(txn), { cache: 'no-store', headers: { accept: 'application/json' } })
          .then(function (r) { if (r.status === 200) goToCodes(); else tick(); }) // 202 = webhook ainda não processou
          .catch(tick);
      }, 4000);
    })();
  }

  function onEvent(e) {
    if (!e || !e.name) return;
    if (e.data && e.data.transaction_id) txn = e.data.transaction_id;
    if (e.name === 'checkout.payment.initiated') watch();
    if (e.name === 'checkout.completed') goToCodes();
    if (e.name === 'checkout.closed' && !done && txn) {
      watch();
      document.querySelectorAll('[data-aguardando]').forEach(function (el) { el.hidden = false; });
    }
  }

  function open(priceId) {
    if (!ready) return;
    txn = null; done = false; watching = false;
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
        window.Paddle.Initialize({ token: cfg.clientToken, eventCallback: onEvent });
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
