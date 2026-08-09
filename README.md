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
