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

## Ajustes pendentes (auditoria de 20/08/2026)

Levantados com o detector do skill `impeccable` e com o Playwright, e **todos
conferidos à mão** antes de entrar aqui — o detector produz falso positivo, e há
uma lista dele no fim desta seção com o motivo de cada recusa.

Nada foi alterado. A ordem abaixo é por custo-benefício: os quatro primeiros
somam cerca de seis linhas.

### 1. Rolagem horizontal no celular — o mais grave

**Onde:** `index.html:193` e `en.html:192`, o botão do e-mail de suporte.

Medido com o Playwright num viewport de **360px** (largura comum de Android):
o botão tem **336px** de largura numa área de conteúdo de **301px**. Estoura
35px e faz a **página inteira** rolar de lado, não só a seção.

A causa é a soma de três coisas em `estilo.css:75` (`.btn`): o endereço tem 29
caracteres, `padding:13px 26px` acrescenta 52px, e não há por onde quebrar.

**Correção:** no `.btn`, permitir quebra do endereço (`overflow-wrap:anywhere`)
ou dar ao botão de e-mail uma variante com padding menor e fonte menor. Não
reduza o padding de `.btn` em geral — os botões do topo dependem dele.

**Por que importa:** afeta todo visitante de celular, e a seção logo acima é a
que recruta os 12 testadores que destravam a Play Store.

### 2. `og:image` com caminho relativo

**Onde:** `index.html:12` e `en.html:12` — `content="icone.png"`.

O arquivo existe e responde HTTP 200. O problema é o formato: Open Graph pede
**URL absoluta**, e os crawlers de Facebook, WhatsApp e Instagram em geral não
resolvem caminho relativo. A prévia do link sai sem imagem.

**Correção:** `https://hasman-dev.github.io/PingProng-Site/icone.png` nos dois
arquivos. Se um dia entrar domínio próprio, este é um dos pontos a trocar.

**Por que importa:** o tráfego vem do Instagram — a própria página tem aviso de
navegador embutido por causa disso. A prévia do link é o que faz clicar.

### 3. Dois contrastes reprovam WCAG AA em `privacidade.html`

Calculados pela fórmula de luminância relativa, não estimados.

| Elemento | Onde | Atual | Precisa |
| --- | --- | --- | --- |
| Links | `privacidade.html:41`, `a{ color:var(--mint) }` no tema **claro** | 3,47:1 | 4,5:1 |
| `.tag` "Ping Prong" | `privacidade.html:26`, branco sobre `--copper` | 3,66:1 | 4,5:1 |

**A causa dos links é estrutural.** O bloco `@media (prefers-color-scheme: dark)`
em `privacidade.html:12` redefine `--ink`, `--muted`, `--line` e `--bg`, mas
**não** `--mint` nem `--copper`. O tema escuro passa por acidente (5,45:1); o
claro falha.

**Cuidado — a correção óbvia quebra o outro tema.** Trocar `--mint` por
`#0f8667` resolve o claro (4,54:1) e **reprova** no escuro (4,17:1). O certo é
redefinir por tema:

- `:root` (claro): `--mint:#0f8667` → 4,54:1 sobre branco
- dentro do `@media ... dark`: `--mint:#129c78` → 5,45:1 sobre `#0d1117`

Para a `.tag`, duas saídas, ambas verificadas:

- **A** — escurecer o cobre para `#ac6335`, mantendo texto branco → 4,57:1
- **B** — manter `#c4703c` e usar texto escuro `#2a1408` → 4,77:1

A **B** preserva melhor a cor da marca, que é o cobre do PRONG.

### 4. Dois cosméticos

**`border-left:3px solid var(--mint)`** em `privacidade.html:31` (`.lead`). O
skill chama isso de "side-tab" e o classifica como o tique mais reconhecível de
interface gerada por IA. Trocar por fundo sutil sem a barra lateral.

**Legenda em caixa alta** — `index.html:76` e `en.html:77` (`.demo-legenda`,
estilo em `estilo.css:103`): 58 caracteres em mono 11,5px com
`letter-spacing:.16em`. Caixa alta serve para rótulo curto; uma frase inteira
perde a forma das palavras, que é como se lê. Manter o estilo e encurtar o
texto, ou tirar o `text-transform` desta classe.

### 5. Identidade da página de privacidade — maior ganho, maior escopo

O site é placa de circuito escura com mono e as cores do jogo. A
`privacidade.html` é documento branco com fonte de sistema e CSS próprio no
`<head>`. Lado a lado parecem dois produtos.

Isto **não** é bug: a legibilidade de documento legal foi uma escolha, e ela
está correta. Mas dá para manter a legibilidade e ainda assim parecer o mesmo
produto — cabeçalho com a marca do PRONG, os tokens de cor do `estilo.css`, o
par mono/sans do site.

Fica por último de propósito: é o único item que não é correção de defeito.

### 6. Menores

- **Sem `<link rel="canonical">`** em `index.html` e `en.html`. Com duas páginas
  no ar e `hreflang` cruzado, evita ambiguidade de indexação.
- **Alvos de toque abaixo de 44px** (mínimo recomendado): "English" no topo tem
  18px de altura, os links do rodapé 15px, os `.btn` 41px. Os botões estão perto;
  os links de texto são os que realmente incomodam no polegar.

### O que foi recusado, e por quê

O detector acusou 16 anti-patterns. Estes **não** serão corrigidos:

| Achado | Motivo da recusa |
| --- | --- |
| `dark-glow` (3×) | O brilho neon **é** a identidade, herdada do jogo. O próprio SKILL.md manda honrar estética definida: redirecionar um brief claro para o gosto do detector é falha, não conserto. |
| `flat-type-hierarchy` | Falso positivo: o detector **não resolve `clamp()`**. Listou só 11,5–17px e ignorou o H1, que medido no navegador tem **73,6px**. |
| `gpt-thin-border-wide-shadow` (2×) | É o mockup de iPhone, que precisa de borda definida **e** elevação para ler como aparelho. |
| `kicker-above-heading` | Discutível; se o item 5 for feito, o rótulo sai junto de qualquer forma. |
| `em-dash-overuse` (advisory) | A copy é escrita à mão e tem voz própria. Advisory nunca reprova. |

### Duas armadilhas das ferramentas

Quem repetir esta auditoria precisa saber:

1. **O detector roda degradado sem quatro módulos npm** (`htmlparser2`,
   `css-select`, `css-tree`, `domutils`). Ele avisa uma vez no topo e continua.
   Aqui achou **1** anti-pattern degradado contra **16** com o parser completo —
   subcontagem de 16×, com cara de atestado de saúde limpo.
   Antes de rodar: `npm install --no-save htmlparser2 css-select css-tree domutils`

2. **O Playwright não toca H.264.** Ele roda Chromium sem codecs proprietários,
   então `gameplay.mp4` falha com `DEMUXER_ERROR_COULD_NOT_OPEN` e parece
   quebrado. **Não está**: o arquivo foi conferido — `moov` antes de `mdat`
   (faststart correto), `avc1`, 2,13 MB, e falha igual mesmo baixando o blob
   inteiro sem range request. Pior: `canPlayType` responde `"probably"` mesmo
   assim, ou seja, a checagem de capacidade mente. Para validar vídeo, use outro
   navegador. Para DOM, console, rede, layout e viewport o Playwright é confiável.

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
