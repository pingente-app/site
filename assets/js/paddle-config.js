/* pingente.app — configuração do checkout da Paddle (Merchant of Record dos códigos de ativação).
   Preencher quando a conta existir:
   - environment: 'sandbox' (conta em sandbox-vendors.paddle.com) ou 'production'
   - clientToken: token de cliente (Paddle → Developer tools → Authentication → Client-side tokens)
   - prices: IDs de preço (pri_…) dos três pacotes, com custom_data.credits = 5 / 10 / 50 no catálogo
   Enquanto clientToken ou o priceId estiverem vazios, os botões "Comprar" ficam desabilitados ("Em breve"). */
window.PINGENTE_PADDLE = {
  environment: 'production',
  clientToken: 'live_ca9f72e771a5a5c42942184295a',
  prices: {
    pack5: 'pri_01m1ne58e1676905w0j0y4nc1n',
    pack10: 'pri_01m1ne58kk1zgm56m9p1erb8px',
    pack50: 'pri_01m1ne58s9q6xyq8njh8bm7j6n'
  },
  successUrl: 'https://pingente.app/codes/?txn={transaction_id}'
};
