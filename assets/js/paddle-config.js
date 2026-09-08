/* pingente.app — configuração do checkout da Paddle (Merchant of Record dos códigos de ativação).
   Preencher quando a conta existir:
   - environment: 'sandbox' (conta em sandbox-vendors.paddle.com) ou 'production'
   - clientToken: token de cliente (Paddle → Developer tools → Authentication → Client-side tokens)
   - prices: IDs de preço (pri_…) dos cinco pacotes, com custom_data.credits = 10 / 50 / 100 / 500 / 1000 no catálogo
   Enquanto clientToken ou o priceId estiverem vazios, os botões "Comprar" ficam desabilitados ("Em breve"). */
window.PINGENTE_PADDLE = {
  environment: 'production',
  clientToken: 'live_ca9f72e771a5a5c42942184295a',
  prices: {
    pack10: 'pri_01m21bnk8tzke116kfa281jct8',
    pack50: 'pri_01m21bnknp3vn5m1g4pap27zvr',
    pack100: 'pri_01m21bnm2xkqm6gtdegsp4xbkv',
    pack500: 'pri_01m21bnmg37xk6m41rs99nd9ys',
    pack1000: 'pri_01m21bnmx176sdx31998h3k7r9'
  },
  successUrl: 'https://pingente.app/codes/?txn={transaction_id}'
};
