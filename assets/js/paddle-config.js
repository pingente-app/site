/* pingente.app — configuração do checkout da Paddle (Merchant of Record dos códigos de ativação).
   Preencher quando a conta existir:
   - environment: 'sandbox' (conta em sandbox-vendors.paddle.com) ou 'production'
   - clientToken: token de cliente (Paddle → Developer tools → Authentication → Client-side tokens)
   - prices: IDs de preço (pri_…) dos três pacotes, com custom_data.credits = 5 / 10 / 50 no catálogo
   Enquanto clientToken ou o priceId estiverem vazios, os botões "Comprar" ficam desabilitados ("Em breve"). */
window.PINGENTE_PADDLE = {
  environment: 'sandbox',
  clientToken: '',
  prices: {
    pack5: '',
    pack10: '',
    pack50: ''
  },
  successUrl: 'https://pingente.app/codes/?txn={transaction_id}'
};
