document.addEventListener('DOMContentLoaded', function() {
      // Música de fondo
      var bgMusic = document.getElementById('backgroundMusic');
      if (bgMusic) {
        bgMusic.volume = 0.5;
        var playMusic = function() {
          bgMusic.play().catch(()=>{});
        };
        playMusic();
        document.addEventListener('click', playMusic, { once: true });
      }

      // Bloque glitcheado
      var glitchContainer = document.getElementById('glitch-block-container');
      var glitchBlock = document.createElement('a');
      glitchBlock.href = 'level-03.html';
      glitchBlock.target = '_blank';
      glitchBlock.style.position = 'absolute';
      glitchBlock.style.left = 'calc(100vw - 120px)';
      glitchBlock.style.top = '120px';
      glitchBlock.style.width = '50px';
      glitchBlock.style.height = '50px';
      glitchBlock.style.display = 'flex';
      glitchBlock.style.alignItems = 'center';
      glitchBlock.style.justifyContent = 'center';
      glitchBlock.style.background = '#111';
      glitchBlock.style.color = '#fff';
      glitchBlock.style.zIndex = '9999';
      glitchBlock.style.border = '4px solid #ff0000';
      glitchBlock.style.borderRadius = '12px';
      glitchBlock.style.boxShadow = '0 0 18px #000';
      glitchBlock.style.overflow = 'hidden';
      glitchContainer.appendChild(glitchBlock);

      // Animación glitcheada, color y rotación
      var colors = ['#ff0000', '#00ff00'];
      var lastColor = 0;
      var rotation = 0;
      setInterval(function(){
        // Movimiento brusco
        var dx = Math.random()*12-6;
        var dy = Math.random()*12-6;
        rotation += 2;
        glitchBlock.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rotation + 'deg)';
        // Color de borde
        lastColor = 1 - lastColor;
        glitchBlock.style.borderColor = colors[lastColor];
        // Color de fondo alterna
        glitchBlock.style.background = '#000';
      }, 100);
    });
document.addEventListener('DOMContentLoaded', function() {
      var bgMusic = document.getElementById('backgroundMusic');
      if (bgMusic) {
        bgMusic.volume = 0.5;
        var playMusic = function() {
          bgMusic.play().catch(()=>{});
        };
        playMusic();
        // Algunos navegadores requieren interacción
        document.addEventListener('click', playMusic, { once: true });
      }
    });
// Elementos de audio
const backgroundMusic = document.getElementById("backgroundMusic");
if (backgroundMusic) {
  backgroundMusic.volume = 0.5;
  // Forzar reproducción tras interacción si el navegador lo requiere
  document.addEventListener('click', () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play().catch(()=>{});
    }
  }, { once: true });
}

(function(){
  'use strict';

  // Referencias a elementos del DOM
  const stage = document.getElementById('stage');
  const particles = document.getElementById('particles');
  const groundEl = document.getElementById('ground');
  const ceilingEl = document.getElementById('ceiling');

  /* ---------------------------------------------------------------------------
     CAMPO DE ESTRELLAS
     - Creamos un canvas en `stage` para dibujar estrellas con estelas.
     - Se usa DPR y ctx.setTransform para que luzca nítido en pantallas HiDPI.
  --------------------------------------------------------------------------- */
  const canvas = document.createElement('canvas');
  canvas.className = 'starfield';
  canvas.setAttribute('aria-hidden','true');
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '10';
  canvas.style.pointerEvents = 'none';
  stage.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let DPR = Math.max(1, window.devicePixelRatio || 1);

  // Ajusta el tamaño del canvas acorde al viewport y DPR
  function resizeCanvas(){
    DPR = Math.max(1, window.devicePixelRatio || 1);
    const w = window.innerWidth || document.documentElement.clientWidth;
    const h = window.innerHeight || document.documentElement.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * DPR));
    canvas.height = Math.max(1, Math.floor(h * DPR));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Configuración de estrellas: posición, profundidad, tamaño y velocidad
  const numStars = 80;
  const stars = [];
  for(let i=0;i<numStars;i++){
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      p: Math.random(), // factor de profundidad (0..1)
      size: 0.5 + Math.random()*1.8,
      speed: 60 + Math.random()*200,
      prevX: null, prevY: null
    });
  }

  // Bucle que dibuja las estrellas y produce el efecto de estela
  let lastFrame = performance.now();
  function drawStars(now){
    const dt = Math.max(0, (now - lastFrame) / 1000);
    lastFrame = now;

    // Pinta un rectángulo semitransparente para desvanecer el frame previo (trail)
    ctx.fillStyle = 'rgba(2,6,20,0.22)';
    ctx.fillRect(0,0, canvas.width / DPR, canvas.height / DPR);

    ctx.lineCap = 'round';
    for(const s of stars){
      s.prevX = s.prevX == null ? s.x : s.prevX;
      s.prevY = s.prevY == null ? s.y : s.prevY;

      const speedFactor = 0.6 + s.p * 3.2;
      s.x -= s.speed * speedFactor * dt;
      s.y += Math.sin((now * 0.001) + s.x * 0.001) * (0.2 + s.p * 0.8);

      if(s.x < -30){ s.x = window.innerWidth + Math.random() * 40; s.y = Math.random() * window.innerHeight; s.prevX = s.x; s.prevY = s.y; }

      // Dibuja la raya (streak)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${0.06 + s.p * 0.6})`;
      ctx.lineWidth = s.size * (0.8 + s.p * 1.6);
      ctx.moveTo(s.prevX, s.prevY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      // Cabeza brillante
      ctx.fillStyle = `rgba(255,255,255,${0.25 + s.p * 0.5})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(0.35, s.size * 0.45), 0, Math.PI * 2); ctx.fill();

      s.prevX = s.prevX * 0.7 + s.x * 0.3;
      s.prevY = s.prevY * 0.7 + s.y * 0.3;
    }

    requestAnimationFrame(drawStars);
  }
  requestAnimationFrame(drawStars);

  // Partículas estáticas (elementos DOM) para sensación de profundidad
  for(let i=0;i<22;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*80 + '%';
    s.style.opacity = (0.05+Math.random()*0.2).toFixed(2);
    s.style.transform = `scale(${0.6+Math.random()*1.4})`;
    particles.appendChild(s);
  }

  /* ---------------------------------------------------------------------------
     SPRITES / PERSONAJES
     - Se genera un sprite a la vez (puedes ampliar si deseas múltiples).
     - Nacen sobre el suelo (tiles inferiores) y avanzan horizontalmente.
     - Cada cierto tiempo aleatorio inician una fase vertical que llega hasta
       la parte superior o inferior (no traspasan los límites).
  --------------------------------------------------------------------------- */
  const characters = ['marino','mario','giachero','ageitos','accolla','zuniga','trani', 'priscila','bruno'];
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  // Ciclo de colores para tiles (se sincroniza desde aquí)
  const cycleColors = ['green','cyan','cornflowerblue','pink','red','yellow'];
  let colorIndex = 0;

  // Crea tiles (ground/ceiling) con el color actual
  function createTiles(container){
    while(container.firstChild) container.removeChild(container.firstChild);
    const count = Math.ceil((window.innerWidth || document.documentElement.clientWidth) / 50) + 2;
    for(let i=0;i<count;i++){
      const t = document.createElement('div');
      t.className = 'tile';
      t.style.backgroundColor = cycleColors[colorIndex];
      t.style.boxSizing = 'border-box';
      container.appendChild(t);
    }
  }

  function setAllTilesColor(color){
    [groundEl, ceilingEl].forEach(container=>{ const tiles = container.children; for(let i=0;i<tiles.length;i++) tiles[i].style.backgroundColor = color; });
  }

  createTiles(groundEl); createTiles(ceilingEl);
  window.addEventListener('resize', ()=>{ createTiles(groundEl); createTiles(ceilingEl); setAllTilesColor(cycleColors[colorIndex]); });

  // ciclo de color sincronizado cada 200ms
  setInterval(()=>{ colorIndex = (colorIndex + 1) % cycleColors.length; setAllTilesColor(cycleColors[colorIndex]); }, 200);

  // Estado de sprite activo (sólo uno a la vez en esta implementación)
  let active = null; let lastTime = null;

  /*
    computePhase(startY, dir, height, depth)
    - Calcula el objetivo vertical (top o bottom) y la duración necesaria
    - height y depth sirven para que el cálculo use el tamaño real del sprite
  */
  function computePhase(startY, dir, height, depth){
    const ceilingRect = ceilingEl.getBoundingClientRect();
    const groundRect = groundEl.getBoundingClientRect();
    const targetY = (dir < 0) ? ceilingRect.bottom : (groundRect.top - (height || 50));
    const distance = Math.abs(targetY - startY);
    const verticalSpeedBase = 220 + (depth || 0) * 12; // px/s
    const randFactor = 0.85 + Math.random() * 0.3;
    const speed = verticalSpeedBase * randFactor;
    const duration = Math.max(0.04, distance / speed);
    return { targetY, duration, distance };
  }

  // Spawnea un sprite (si no hay uno activo)
  function spawn(){
    if(active) return;
    const name = pick(characters);
    const ssj = (Math.random() < 0.01); // 1% probabilidad SSJ
    const fileName = ssj ? `${name}ssj.png` : `${name}.png`;

    const img = document.createElement('img'); img.className = 'sprite'; img.src = fileName; img.alt = name;
    const depth = Math.ceil(Math.random()*3); img.classList.add('depth-'+depth); stage.appendChild(img);

    img.onload = ()=>{
      const rect = img.getBoundingClientRect();
      const width = rect.width || img.width; const height = rect.height || img.height;
      // start off-left
      let x = -width - 10;
      // posicion inicial sobre el suelo (top del ground menos la altura del sprite)
      const groundRectStart = groundEl.getBoundingClientRect();
      const y0 = Math.round(groundRectStart.top - height);

      const baseSpeed = 420 + Math.random()*480 + depth*40;
      const diag = Math.SQRT2/2;
      const vx = baseSpeed * diag * 0.6; // componente horizontal

      let dir = Math.random() < 0.5 ? -1 : 1;
      const phaseStart = performance.now();
      let initial = computePhase(y0, dir, height, depth);
      let tries = 0; while(initial.distance < 1 && tries < 3){ dir = -dir; initial = computePhase(y0, dir, height, depth); tries++; }

      active = {
        el: img, x: x, y: y0, vx: vx, w: width, h: height, depth: depth, dir: dir,
        phaseStart: phaseStart, phaseTargetY: initial.targetY, phaseDuration: initial.duration, phaseStartY: y0,
        phaseType: 'none', nextVerticalAt: performance.now() + 600 + Math.random() * 2600, ssj: ssj
      };

      // SSJ: crear estela de bits (0/1) y un intervalo que los actualiza
      if(ssj){
        const trailCount = 14; const trailContainer = document.createElement('div');
        trailContainer.style.position = 'absolute'; trailContainer.style.left = '0'; trailContainer.style.top = '0'; trailContainer.style.width = '100%'; trailContainer.style.height = '100%'; trailContainer.style.pointerEvents = 'none'; trailContainer.style.zIndex = '18';
        stage.appendChild(trailContainer);
        const spans = [];
        for(let i=0;i<trailCount;i++){
          const sp = document.createElement('span'); sp.textContent = Math.random() < 0.5 ? '0' : '1';
          sp.style.position = 'absolute'; sp.style.font = 'bold 14px monospace'; sp.style.color = '#7CFC00'; sp.style.textShadow = '0 0 6px rgba(124,252,0,0.6)'; sp.style.pointerEvents = 'none'; sp.style.transform = 'translate(-50%,-50%)'; sp.style.willChange = 'left,top,opacity';
          trailContainer.appendChild(sp); spans.push(sp);
        }
        active.trailContainer = trailContainer; active.trailSpans = spans; active.trailPositions = [];
        active.ssjInterval = setInterval(()=>{ for(const sp of spans) sp.textContent = Math.random() < 0.5 ? '0' : '1'; }, 100);
      }

      // asegurar que aparece sin rotación inicialmente
      active.el.style.transition = 'transform 0s'; active.el.style.transform = 'none';
      if(!rafRunning) startLoop();
    };
  }

  /* ---------------------------------------------------------------------------
     Bucle de animación principal
     - Actualiza posición horizontal constantemente.
     - Dispara fases verticales aleatorias que siempre alcanzan techo/ suelo.
     - Administra la estela SSJ y limpieza al salir de pantalla.
  --------------------------------------------------------------------------- */
  let rafId = null, rafRunning = false;
  function startLoop(){ rafRunning = true; lastTime = performance.now(); rafId = requestAnimationFrame(loop); }
  function stopLoop(){ rafRunning = false; if(rafId) cancelAnimationFrame(rafId); rafId = null; }

  function loop(t){
    const dt = (t - lastTime) / 1000; lastTime = t;
    if(active){
      active.x += active.vx * dt;

      if(active.phaseType === 'vertical'){
        const phaseElapsed = (t - active.phaseStart) / 1000;
        const progress = Math.min(1, phaseElapsed / active.phaseDuration);
        active.y = active.phaseStartY + (active.phaseTargetY - active.phaseStartY) * progress;
        const _ceilingRect = ceilingEl.getBoundingClientRect(); const _groundRect = groundEl.getBoundingClientRect();
        const _minY = _ceilingRect.bottom; const _maxY = _groundRect.top - active.h;
        if(active.y < _minY) active.y = _minY; if(active.y > _maxY) active.y = _maxY;
        if(progress >= 1){ active.y = active.phaseTargetY; active.phaseType = 'none'; active.nextVerticalAt = t + (600 + Math.random() * 2400); }
      } else {
        if(t >= (active.nextVerticalAt || 0)){
          let nextDir = (Math.random() < 0.5) ? -1 : 1;
          const cr = ceilingEl.getBoundingClientRect(); const gr = groundEl.getBoundingClientRect();
          const atGround = Math.abs(active.y - (gr.top - active.h)) < 1.5; const atCeiling = Math.abs(active.y - cr.bottom) < 1.5;
          if(atGround) nextDir = -1; if(atCeiling) nextDir = 1;
          let nextPhase = computePhase(active.y, nextDir, active.h, active.depth); let tries = 0;
          while(nextPhase.distance < 1 && tries < 3){ nextDir = -nextDir; nextPhase = computePhase(active.y, nextDir, active.h, active.depth); tries++; }
          if(nextPhase.distance < 1){ active.nextVerticalAt = t + 800 + Math.random()*2200; }
          else {
            active.phaseType = 'vertical'; active.dir = nextDir; active.phaseStart = t; active.phaseStartY = active.y; active.phaseTargetY = nextPhase.targetY; active.phaseDuration = nextPhase.duration;
            // rotación instantánea al comenzar la fase vertical (hacia arriba se da la vuelta)
            if(Math.abs(active.phaseTargetY - active.phaseStartY) > 1){ if(active.dir < 0){ active.el.style.transition = 'transform 0s'; active.el.style.transform = 'rotate(180deg) scaleX(-1)'; } else { active.el.style.transition = 'transform 0s'; active.el.style.transform = 'none'; } }
          }
        }
      }

      active.el.style.left = Math.round(active.x) + 'px'; active.el.style.top = Math.round(active.y) + 'px';

      if(active.ssj && active.trailSpans){
        const cx = active.x + active.w/2; const cy = active.y + active.h/2; active.trailPositions.unshift({x: cx, y: cy});
        if(active.trailPositions.length > active.trailSpans.length) active.trailPositions.pop();
        for(let i=0;i<active.trailSpans.length;i++){
          const sp = active.trailSpans[i]; const pos = active.trailPositions[i] || active.trailPositions[active.trailPositions.length-1] || {x:cx,y:cy};
          const ox = Math.round(pos.x - i*6); const oy = Math.round(pos.y + i*2);
          sp.style.left = ox + 'px'; sp.style.top = oy + 'px'; sp.style.opacity = String(Math.max(0.12, 1 - (i / active.trailSpans.length))); sp.style.fontSize = (14 - i*0.6) + 'px';
        }
      }

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      if(active.x > vw + 200){ if(active.ssj){ if(active.ssjInterval) clearInterval(active.ssjInterval); if(active.trailContainer) active.trailContainer.remove(); } active.el.remove(); active = null; }
    }

    if(active) rafId = requestAnimationFrame(loop); else { stopLoop(); }
  }

  // spawn cadence y lanzamiento inicial
  let spawnInterval = setInterval(spawn, 1000);
  spawn();

})();

/* Fin de JS separado */
