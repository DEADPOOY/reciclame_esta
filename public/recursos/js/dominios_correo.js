//ahi va asta arriba del todo
/* Lista compartida por el navegador y el servidor para validar dominios de correo.
 *
 * - Si "permitidos" tiene elementos, SOLO se aceptan esos dominios.
 * - Si "permitidos" está vacío, se bloquean los dominios de "bloqueados".
 *
 * Escribe los dominios en minúsculas y sin @. Para bloquear un dominio nuevo,
 * agrégalo a "bloqueados". Para permitir solo algunos, llena "permitidos".
 */
(function (raiz) {
  const config = {
    permitidos: [],
    bloqueados: [
      '10minutemail.com',
      '10minutemail.net',
      '20minutemail.com',
      '1secmail.com',
      '1secmail.net',
      '1secmail.org',
      'dispostable.com',
      'discard.email',
      'emailfake.com',
      'emailondeck.com',
      'example.com',
      'example.net',
      'example.org',
      'fakeinbox.com',
      'generator.email',
      'getairmail.com',
      'getnada.com',
      'grr.la',
      'guerrillamail.biz',
      'guerrillamail.com',
      'guerrillamail.de',
      'guerrillamail.es',
      'guerrillamail.info',
      'guerrillamail.net',
      'guerrillamail.org',
      'guerrillamailblock.com',
      'jetable.org',
      'mail-temp.com',
      'mailcatch.com',
      'maildrop.cc',
      'mailinator.com',
      'mailinator.net',
      'mailinator.org',
      'mailinator2.com',
      'mailnesia.com',
      'mailsac.com',
      'mintemail.com',
      'moakt.com',
      'mytemp.email',
      'nada.email',
      'sharklasers.com',
      'spam4.me',
      'spamgourmet.com',
      'spamgourmet.net',
      'spamgourmet.org',
      'temp-mail.io',
      'temp-mail.org',
      'tempmail.com',
      'tempmail.net',
      'tempmail.org',
      'test.com',
      'test.test',
      'throwaway.email',
      'throwawaymail.com',
      'tmail.ws',
      'trashmail.com',
      'trashmail.de',
      'trashmail.net',
      'trashmail.org',
      'yopmail.com',
      'yopmail.fr',
      'yopmail.net',
      'yopmail.org'
    ]
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = config;
  else raiz.DOMINIOS_CORREO = config;
})(typeof globalThis !== 'undefined' ? globalThis : this);
