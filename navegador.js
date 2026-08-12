/* Aviso de navegador embutido.
 *
 * Instagram, Facebook, TikTok e afins não abrem links no navegador do
 * aparelho: usam uma WebView própria, dentro do app. Nela, dois tipos de link
 * costumam simplesmente não fazer nada ao toque:
 *
 *   - `mailto:` — a WebView não consegue entregar para o app de e-mail;
 *   - links de loja — às vezes abrem a página web em vez do app.
 *
 * Não há conserto pelo site: quem decide é a WebView. O que dá para fazer é
 * avisar e ensinar a sair dela — e é isso que este arquivo faz.
 *
 * O aviso já existe no HTML das duas páginas (com o texto no idioma certo) e
 * nasce escondido. Aqui só se acrescenta a classe `on` quando a detecção bate,
 * para que quem estiver num navegador normal nunca veja nada.
 */
(() => {
  const ua = navigator.userAgent || '';

  // Instagram e Threads mandam "Instagram"; o Facebook manda FBAN/FBAV/FB_IAB.
  // Os demais são os que mais aparecem em link de bio.
  const embutido = /Instagram|FBAN|FBAV|FB_IAB|Threads|TikTok|Line\/|MicroMessenger|Snapchat|Pinterest|LinkedInApp/i.test(ua);
  if (!embutido) return;

  const aviso = document.querySelector('.aviso-app');
  if (aviso) aviso.classList.add('on');
})();
