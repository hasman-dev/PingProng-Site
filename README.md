# Site do Ping Prong

Página pública do jogo **Ping Prong** — na App Store desde 8 de agosto de 2026,
e com a versão Android a caminho. Existe para resolver três exigências da
App Store de uma vez:

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
| `index.html` | A página do jogo, em **português**. |
| `en.html` | A mesma página em **inglês**. |
| `estilo.css` | O CSS das duas. Compartilhado de propósito — ver abaixo. |
| `bola.js` | O único script: as bolas do BLAST. Compartilhado pelas duas. |
| `privacidade.html` | Cópia da política auditada que vive em `Loja/` no repositório do jogo. |
| `capturas/*-web.png` | Abertura e BLAST carregado, reduzidas para 660px. As telas de partida normal e de vitória saíram: o vídeo já cobre a primeira. |
| `gameplay.mp4` | Laço de 14,5s do piloto automático jogando, 442x960, mudo. Toca sozinho na página. |
| `gameplay-poster.png` | Primeiro quadro do vídeo, exibido enquanto ele carrega. |
| `icone.png` / `icone-web.png` | Ícone do app, para og:image e favicon. |

## Antes de publicar — três coisas para trocar

Estão marcadas com comentário `<!-- TROQUE ... -->` dentro do `index.html`:

1. ~~E-mail de suporte~~ — **feito**. É `hasman.corp.support@gmail.com`, na
   página e nas duas versões (PT/EN) da política de privacidade.
2. ~~Link da App Store~~ — **feito**. Publicado em 8 de agosto de 2026:
   `https://apps.apple.com/br/app/ping-prong/id6797659988`
   O `6797659988` é o Apple ID do app; ele não muda entre versões.
3. **Link do TestFlight.** O botão secundário aponta para a seção de suporte.
   Se você abrir um teste público, aponte-o para o link do TestFlight.

## As bolas do BLAST

O único script da página. Um `<canvas>` fixo atrás de todo o conteúdo, com
**quatro** bolas que atravessam a tela quicando nas bordas e, de tempos em
tempos, disparam um BLAST — anel dourado, bola dourada e uma aceleração que
decai sozinha.

**As quatro são diferentes de propósito.** Quatro objetos idênticos cruzando a
tela viram poluição; variando raio, velocidade e opacidade elas leem como
profundidade — a maior e mais opaca parece à frente, as menores e apagadas ao
fundo. Quem faz esse trabalho é o campo `peso`, multiplicador de opacidade em
`PERFIS`. Mexa nele antes de mexer na opacidade global do canvas.

Os disparos são **escalonados** (`proximoBlast` começa deslocado por índice):
quatro BLASTs simultâneos seriam um piscar de árvore de natal, não um destaque.

O `relogio` interno só avança com a aba visível — assim voltar de outra aba não
dispara de uma vez os BLASTs represados.

É o mesmo desenho do jogo, inclusive na técnica: rastro que esmaece e halo feito
de **círculos concêntricos translúcidos**, nunca `blur`/`shadow` em buffer
offscreen. No jogo essa escolha foi o que segurou 60 fps num aparelho de 2019;
aqui ela evita que uma página institucional gaste GPU à toa.

Três regras que a mantêm discreta — se for mexer, preserve as três:

1. **`prefers-reduced-motion`** desliga tudo: o CSS esconde o canvas e o script
   nem chega a iniciar.
2. **Aba escondida congela o laço** (`document.hidden`), para não gastar bateria
   de quem nem está olhando.
3. **`pointer-events:none` e opacidade `.55`** — ela é ambiente, não conteúdo.
   Se começar a disputar atenção com o texto, o efeito falhou.

O passo é normalizado pelo tempo real, então o ritmo é o mesmo em tela de 60, 90
ou 120 Hz.

## Os dois idiomas

`index.html` (pt-BR) e `en.html` (en) são **páginas separadas**, ligadas por
`hreflang` nos dois sentidos e por um link no topo à direita e no rodapé.

Não segui o padrão da `privacidade.html`, que empilha o inglês logo abaixo do
português no mesmo arquivo. Para um documento legal aquilo funciona — a pessoa
rola até achar o idioma dela. Numa página de venda seria ruim: ninguém rola uma
landing page inteira procurando a própria língua, e o visitante desiste antes.

Páginas separadas também dão **URL compartilhável** (dá para mandar o link em
inglês para alguém de fora) e duas páginas indexáveis.

O preço disso é manter as duas em sincronia. Por isso o CSS e o JS foram
extraídos para `estilo.css` e `bola.js`: **só o texto vive duplicado**. Se mexer
em estilo ou no efeito, muda num lugar só. Se mexer em conteúdo, lembre das duas.

A página em inglês aponta para a App Store **sem código de país**
(`apps.apple.com/app/id...`), que redireciona o visitante para a loja dele. A
versão em português mantém o link `/br/`.

## Seção "Em breve no Android"

Além de anunciar, ela **recruta testadores** — e isso é de propósito. A Google
Play exige um período de teste fechado com um número mínimo de pessoas antes de
qualquer app novo poder ir à produção, e o site é o canal mais barato para
encontrá-las. O botão abre um e-mail com assunto pronto.

Quando o app entrar no ar, esta seção vira o botão da Play Store — e o texto
sobre "não tem data ainda" sai junto.

## Se a política de privacidade mudar

Ela é gerada em `Loja/politica-de-privacidade.html`, no repositório do jogo.
Edite **lá**, copie para cá e atualize a data de vigência nos dois lugares.
O que a política afirma foi auditado no código — se o app passar a fazer
chamada de rede, usar SDK de terceiros ou pedir permissão, a política tem que
mudar junto.

## Ver a página localmente

```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/01.Mac\ do\ RA/Claude/PingProng\ -\ Site \
  && python3 -m http.server 8000
```

Depois abra <http://localhost:8000>.

## De onde vem o vídeo

O jogo tem um piloto automático (`PP_AUTOPILOT=1`) que joga sozinho com
precisão perfeita. A gravação saiu de:

```bash
xcrun simctl io <UDID> recordVideo --codec h264 bruto.mov
SIMCTL_CHILD_PP_AUTOPILOT=1 xcrun simctl launch --console <UDID> com.hasmancorp.games.pingprong
```

O log `PPDIAG` marca cada ponto, cada bônus e cada BLAST por segundo — foi ele
que localizou os melhores momentos, em vez de assistir aos 200 segundos.

O corte e o redimensionamento foram feitos com `Montar.swift` (AVFoundation),
na pasta irmã `PingProng - Vendas/Redes Sociais/ferramentas/`, porque esta
máquina não tem ffmpeg. O mesmo utilitário
gerou o **App Preview** da App Store: 886x1920, 30 fps, 26,5 s.
