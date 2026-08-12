/* A bola do BLAST atravessando a página.
 *
 * É o mesmo desenho do jogo: rastro que esmaece, halo por círculos concêntricos
 * (nunca blur em buffer offscreen — caro e desnecessário) e, de tempos em
 * tempos, um disparo BLAST com anel dourado e aceleração que decai sozinha.
 *
 * Três regras que a mantêm discreta:
 *   1. `prefers-reduced-motion` desliga tudo — o CSS esconde e o script nem sobe.
 *   2. Aba escondida congela o laço: não gasta bateria de quem nem está olhando.
 *   3. `pointer-events:none` e opacidade .55 — ela é ambiente, não conteúdo.
 */
(() => {
  const cv = document.getElementById('blast-ball');
  if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = cv.getContext('2d');
  let W = 0, H = 0;

  function medir(){
    // teto de 2 no DPR: acima disso é pixel que ninguém vê e GPU que todo mundo paga
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  medir();
  window.addEventListener('resize', medir, { passive:true });

  const MENTA = [45,230,176], OURO = [255,225,77];
  const RASTRO = 21;   // 1,5x o rastro original — dá leitura de direção
  const rgba = (c,a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /* Quatro bolas, todas diferentes.
   *
   * Se fossem idênticas, quatro objetos iguais atravessando a tela viram
   * poluição. Variando raio, velocidade e opacidade elas leem como PROFUNDIDADE:
   * a maior e mais opaca parece à frente, as menores e mais apagadas ao fundo.
   * `peso` é o multiplicador de opacidade — é ele que faz esse trabalho.
   */
  /* `dispara:false` nas duas mais apagadas: com seis bolas, se todas
   * disparassem BLAST o anel dourado apareceria a cada ~3 s e deixaria de ser
   * evento. As do fundo só passeiam; o dourado fica sendo coisa da frente. */
  const PERFIS = [
    { r: 8.0, passo: 1.5, peso: 0.85, dispara: true  },
    { r: 7.0, passo: 3.0, peso: 1.00, dispara: true  },
    { r: 6.0, passo: 1.9, peso: 0.62, dispara: true  },
    { r: 5.5, passo: 2.3, peso: 0.72, dispara: true  },
    { r: 4.5, passo: 3.5, peso: 0.55, dispara: false },
    { r: 3.8, passo: 4.1, peso: 0.42, dispara: false },
  ];

  function nova(p, i){
    // ângulo enviesado para a diagonal: bola quase na vertical ou quase na
    // horizontal fica monótona, sempre repetindo o mesmo caminho
    const base = 0.35 + Math.random() * 0.9;
    const ang = base * (Math.random() < .5 ? 1 : -1) + (Math.random() < .5 ? 0 : Math.PI);
    return {
      r: p.r, passo: p.passo, peso: p.peso, dispara: p.dispara,
      x: W * (0.15 + Math.random() * 0.7),
      y: H * (0.15 + Math.random() * 0.7),
      vx: Math.cos(ang) * p.passo,
      vy: Math.sin(ang) * p.passo,
      rastro: [],
      blastAte: 0, flash: null,
      // escalona o primeiro disparo de cada uma: BLASTs simultâneos seriam um
      // piscar de árvore de natal, não um destaque
      proximoBlast: 5000 + i * 5000 + Math.random() * 4000,
    };
  }

  let bolas = PERFIS.map(nova);
  let ultimo = 0, relogio = 0;

  function halo(cx, cy, raio, abertura, pico, cor){
    for (let i = 4; i >= 1; i--){
      const t = i/4;
      ctx.beginPath();
      ctx.arc(cx, cy, raio + abertura*t, 0, Math.PI*2);
      ctx.fillStyle = rgba(cor, pico * Math.pow(1 - t*0.85, 2));
      ctx.fill();
    }
  }

  function anda(b, dt){
    if (b.dispara && relogio >= b.proximoBlast){
      b.blastAte = relogio + 1400;
      b.flash = { x: b.x, y: b.y, t0: relogio };
      const ang = Math.atan2(b.vy, b.vx) + (Math.random() - 0.5) * 1.2;
      const vel = b.passo * 2.1;
      b.vx = Math.cos(ang) * vel; b.vy = Math.sin(ang) * vel;
      b.proximoBlast = relogio + 16000 + Math.random() * 16000;
    }

    // depois do disparo a velocidade volta ao passeio sozinha
    if (relogio >= b.blastAte){
      const vel = Math.hypot(b.vx, b.vy);
      if (vel > b.passo){
        const k = Math.max(b.passo/vel, 1 - 0.02*dt);
        b.vx *= k; b.vy *= k;
      }
    }

    b.x += b.vx*dt; b.y += b.vy*dt;
    if (b.x - b.r < 0){ b.x = b.r;     b.vx = Math.abs(b.vx); }
    if (b.x + b.r > W){ b.x = W - b.r; b.vx = -Math.abs(b.vx); }
    if (b.y - b.r < 0){ b.y = b.r;     b.vy = Math.abs(b.vy); }
    if (b.y + b.r > H){ b.y = H - b.r; b.vy = -Math.abs(b.vy); }

    b.rastro.push({ x: b.x, y: b.y });
    if (b.rastro.length > RASTRO) b.rastro.shift();
  }

  function desenha(b){
    const blastando = relogio < b.blastAte;
    const cor = blastando ? OURO : MENTA;
    const r = blastando ? b.r*1.25 : b.r;
    const op = b.peso;

    for (let i = 0; i < b.rastro.length; i++){
      const p = b.rastro[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * (blastando ? 1 : .7), 0, Math.PI*2);
      ctx.fillStyle = rgba(cor, ((i+1)/(b.rastro.length+1)) * (blastando ? .5 : .32) * op);
      ctx.fill();
    }

    if (b.flash){
      const p = (relogio - b.flash.t0) / 420;
      if (p < 1){
        ctx.beginPath();
        ctx.arc(b.flash.x, b.flash.y, 10 + p*62, 0, Math.PI*2);
        ctx.strokeStyle = rgba(OURO, (1-p)*.85*op);
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else b.flash = null;
    }

    halo(b.x, b.y, r, blastando ? 16 : 10, (blastando ? .45 : .32) * op, cor);

    const g = ctx.createRadialGradient(b.x-3, b.y-3, 1, b.x, b.y, r);
    g.addColorStop(0, rgba([255,255,255], op));
    g.addColorStop(1, rgba(cor, op));
    ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI*2);
    ctx.fillStyle = g; ctx.fill();
  }

  function quadro(agora){
    requestAnimationFrame(quadro);
    if (document.hidden){ ultimo = agora; return; }

    // normaliza pelo tempo real: mesmo ritmo em tela de 60, 90 ou 120 Hz.
    // `relogio` só avança com a aba visível, então voltar de outra aba não
    // dispara os quatro BLASTs represados de uma vez.
    const dt = ultimo ? Math.min((agora - ultimo)/16.667, 3) : 1;
    ultimo = agora;
    relogio += dt * 16.667;

    ctx.clearRect(0, 0, W, H);
    for (const b of bolas){ anda(b, dt); desenha(b); }
  }
  requestAnimationFrame(quadro);
})();
