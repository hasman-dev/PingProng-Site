# Site do Ping Prong

Página pública do jogo **Ping Prong** (iPhone). Existe para resolver três
exigências da App Store de uma vez:

| Campo do App Store Connect | Endereço a usar |
| --- | --- |
| URL de política de privacidade | `.../privacidade.html` |
| URL de suporte | `.../#suporte` |
| Marketing / divulgação | a raiz do site |

O repositório do **código do jogo** é outro, e é privado. Aqui só existe HTML e
imagem — de propósito, porque no plano gratuito do GitHub o Pages só publica a
partir de repositório **público**.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `index.html` | A página do jogo. Autocontida: sem fonte externa, sem script, sem CDN. |
| `privacidade.html` | Cópia da política auditada que vive em `Loja/` no repositório do jogo. |
| `capturas/*-web.png` | As capturas da loja reduzidas para 660px de largura. |
| `icone.png` / `icone-web.png` | Ícone do app, para og:image e favicon. |

## Antes de publicar — três coisas para trocar

Estão marcadas com comentário `<!-- TROQUE ... -->` dentro do `index.html`:

1. ~~E-mail de suporte~~ — **feito**. É `hasman.corp.support@gmail.com`, na
   página e nas duas versões (PT/EN) da política de privacidade.
2. **Link da App Store.** O botão está desativado com "Em breve". Quando o app
   for aprovado, troque o `href` e remova `aria-disabled="true"`.
3. **Link do TestFlight.** O botão "Quero testar antes" aponta para a seção de
   suporte. Se você abrir um teste público, aponte-o para o link do TestFlight.

## Se a política de privacidade mudar

Ela é gerada em `Loja/politica-de-privacidade.html`, no repositório do jogo.
Edite **lá**, copie para cá e atualize a data de vigência nos dois lugares.
O que a política afirma foi auditado no código — se o app passar a fazer
chamada de rede, usar SDK de terceiros ou pedir permissão, a política tem que
mudar junto.

## Ver a página localmente

```bash
cd ~/PingProng-Site && python3 -m http.server 8000
```

Depois abra <http://localhost:8000>.
