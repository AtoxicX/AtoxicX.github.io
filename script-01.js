document.addEventListener("DOMContentLoaded", function () {
            // Fondo canvas simple detrás de todo
            (function(){
                'use strict';
                const gameContainers = document.querySelectorAll('.game-container');
                gameContainers.forEach(container => {
                    const canvas = document.createElement('canvas');
                    canvas.className = 'starfield';
                    canvas.setAttribute('aria-hidden','true');
                    canvas.style.position = 'absolute';
                    canvas.style.left = '0';
                    canvas.style.top = '0';
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';
                    canvas.style.zIndex = '1';
                    canvas.style.pointerEvents = 'none';
                    container.appendChild(canvas);

                    const ctx = canvas.getContext('2d');
                    let DPR = Math.max(1, window.devicePixelRatio || 1);
                    function resizeCanvas(){
                        DPR = Math.max(1, window.devicePixelRatio || 1);
                        const w = container.clientWidth;
                        const h = container.clientHeight;
                        canvas.width = Math.max(1, Math.floor(w * DPR));
                        canvas.height = Math.max(1, Math.floor(h * DPR));
                        canvas.style.width = w + 'px';
                        canvas.style.height = h + 'px';
                        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
                    }
                    window.addEventListener('resize', resizeCanvas);
                    resizeCanvas();

                    const numStars = 80;
                    const stars = [];
                    for(let i=0;i<numStars;i++){
                        stars.push({
                            x: Math.random() * container.clientWidth,
                            y: Math.random() * container.clientHeight,
                            p: Math.random(),
                            size: 0.5 + Math.random()*1.8,
                            speed: 60 + Math.random()*200,
                            prevX: null, prevY: null
                        });
                    }
                    let lastFrame = performance.now();
                    function drawStars(now){
                        const dt = Math.max(0, (now - lastFrame) / 1000);
                        lastFrame = now;
                        ctx.fillStyle = 'rgba(2,6,20,0.22)';
                        ctx.fillRect(0,0, canvas.width / DPR, canvas.height / DPR);
                        ctx.lineCap = 'round';
                        for(const s of stars){
                            s.prevX = s.prevX == null ? s.x : s.prevX;
                            s.prevY = s.prevY == null ? s.y : s.prevY;
                            const speedFactor = 0.6 + s.p * 3.2;
                            s.x -= s.speed * speedFactor * dt;
                            s.y += Math.sin((now * 0.001) + s.x * 0.001) * (0.2 + s.p * 0.8);
                            if(s.x < -30){ s.x = container.clientWidth + Math.random() * 40; s.y = Math.random() * container.clientHeight; s.prevX = s.x; s.prevY = s.y; }
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(255,255,255,${0.06 + s.p * 0.6})`;
                            ctx.lineWidth = s.size * (0.8 + s.p * 1.6);
                            ctx.moveTo(s.prevX, s.prevY);
                            ctx.lineTo(s.x, s.y);
                            ctx.stroke();
                            ctx.fillStyle = `rgba(255,255,255,${0.25 + s.p * 0.5})`;
                            ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(0.35, s.size * 0.45), 0, Math.PI * 2); ctx.fill();
                            s.prevX = s.prevX * 0.7 + s.x * 0.3;
                            s.prevY = s.prevY * 0.7 + s.y * 0.3;
                        }
                        requestAnimationFrame(drawStars);
                    }
                    requestAnimationFrame(drawStars);
                });
            })();
    const chicken1 = document.getElementById("chicken1");
    const chicken2 = document.getElementById("chicken2");
    const playButton = document.getElementById("playButton");
    const retryButton = document.getElementById("retryButton");
    const gameContainer = document.getElementById("gameContainer");
    const victoryScreen = document.getElementById("victoryScreen");
    const winnerName = document.getElementById("winnerName");
    const winnerImage = document.getElementById("winnerImage");

    // Elementos de audio
    const backgroundMusic = document.getElementById("backgroundMusic");
    const clickSound = document.getElementById("clickSound");
    const victorySound = document.getElementById("victorySound");

    // Dropdown character panel controls (moved from inline HTML script)
    (function(){
        const openBtn = document.getElementById('openChars');
        const panel = document.getElementById('charsPanel');
        const closeBtn = document.getElementById('closeChars');
        const p1Input = document.getElementById('player1Selected');
        const p2Input = document.getElementById('player2Selected');
        const ch1 = document.getElementById('chicken1');
        const ch2 = document.getElementById('chicken2');
        let nextPlayer = 1;

        function openPanel(){ if(panel){ panel.classList.add('open'); panel.setAttribute('aria-hidden','false'); } if(openBtn) openBtn.setAttribute('aria-expanded','true'); }
        function closePanel(){ if(panel){ panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); } if(openBtn) openBtn.setAttribute('aria-expanded','false'); }

        openBtn && openBtn.addEventListener('click', function(e){ e.stopPropagation(); if(panel && panel.classList.contains('open')) closePanel(); else openPanel(); });
        closeBtn && closeBtn.addEventListener('click', function(e){ e.stopPropagation(); closePanel(); });

        if(panel){
            panel.querySelectorAll('.char-box').forEach(function(box){
                box.addEventListener('click', function(e){
                    e.stopPropagation();
                    const chr = box.dataset.char || '';
                    const img = box.querySelector('img'); const imgSrc = img ? img.getAttribute('src') : '';
                    if(nextPlayer === 1){
                        document.querySelectorAll('#player1Panel .char-box').forEach(b=>b.classList.remove('assigned-p1'));
                        const t = document.querySelector(`#player1Panel .char-box[data-char="${chr}"]`);
                        if(t) t.classList.add('assigned-p1');
                        p1Input && (p1Input.value = chr);
                        if(ch1 && imgSrc) ch1.style.backgroundImage = `url('${imgSrc}')`;
                        nextPlayer = 2;
                    } else {
                        document.querySelectorAll('#player2Panel .char-box').forEach(b=>b.classList.remove('assigned-p2'));
                        const t2 = document.querySelector(`#player2Panel .char-box[data-char="${chr}"]`);
                        if(t2) t2.classList.add('assigned-p2');
                        p2Input && (p2Input.value = chr);
                        if(ch2 && imgSrc) ch2.style.backgroundImage = `url('${imgSrc}')`;
                        nextPlayer = 1;
                    }
                });
            });
        }

        document.addEventListener('click', function(e){ if(!panel) return; if(!panel.contains(e.target) && e.target !== openBtn) closePanel(); });
    })();

    let gameInterval;
    let platformInterval;
    let colorInterval;
    let platforms = [];

    let lastPlatformPosition = null; // Para evitar posiciones repetidas consecutivamente

    // Configuración de los pollos
    const chickens = [
    {
        element: chicken1,
            gravity: 1, // 1 = down, -1 = up
            yPos: 275,
            xPos: 1000,
            velocity: 0,
            key: 'a',
            name: 'Jugador 1',
            canChangeGravity: true,
            onPlatform: false,
        },
        {
            element: chicken2,
            gravity: 1, // 1 = down, -1 = up
            yPos: 280,
            xPos: 975, // 25 píxeles a la izquierda del Jugador 1
            velocity: 0,
            key: 'l',
            name: 'Jugador 2',
            canChangeGravity: true,
            onPlatform: false,
        }
        ];

function selectCharacter(event, playerId, table) {
    const el = event.currentTarget;
    const characterId = el.dataset.char || el.id;
    const characterImg = `url('${characterId}.png')`;

    // Cambia la imagen de fondo del jugador correspondiente
    const playerEl = document.getElementById(playerId);
    if (playerEl) playerEl.style.backgroundImage = characterImg;

    // Quita la clase 'selected' de cualquier otra imagen en la tabla
    table.querySelectorAll(".selected").forEach(item => {
        item.classList.remove("selected");
    });

    // Agrega la clase 'selected' al elemento clicado
    el.classList.add("selected");
}

// Configura la selección de personajes para ambas tablas
document.querySelectorAll("#player1Table td, #player2Table td").forEach(item => {
    item.addEventListener("click", (event) => {
        // Determina si el clic fue en la tabla del jugador 1 o del jugador 2
        const playerId = item.closest("table").id === "player1Table" ? "chicken1" : "chicken2";
        const table = item.closest("table");
        selectCharacter(event, playerId, table);
    });
});
const fullscreenButton = document.getElementById("fullscreenButton");
let fullscreenIcon = document.getElementById("fullscreenIcon");
if (!fullscreenIcon && fullscreenButton) {
    fullscreenIcon = fullscreenButton.querySelector('i') || fullscreenButton;
}

if (fullscreenButton) {
    fullscreenButton.addEventListener("click", toggleFullScreen);
}

function toggleFullScreen() {
    const gameContainer = document.getElementById("gameContainer");

    if (!document.fullscreenElement) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.mozRequestFullScreen) {
            gameContainer.mozRequestFullScreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        }
        if (fullscreenIcon) fullscreenIcon.className = "bx bx-exit"; // Cambiar a ícono de salir
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if (fullscreenIcon) fullscreenIcon.className = "bx bx-fullscreen"; // Cambiar a ícono de pantalla completa
    }
}

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        if (fullscreenIcon) fullscreenIcon.className = "bx bx-fullscreen";
    } else {
        if (fullscreenIcon) fullscreenIcon.className = "bx bx-exit";
    }
});

        function updatePositions() {
        // Esto ajusta las posiciones de los pollos continuamente
        chickens[1].xPos = chickens[0].xPos - 900;
        chickens[1].element.style.left = chickens[1].xPos + 'px';
    }
    
    setInterval(updatePositions, 1000 / 30); // Actualiza 60 veces por segundo
    

    const gravityForce = 4;
    const velocityMax =3;
    const platformSpeed = 20;
    const platformFrequency = 100; // Tiempo entre generación de plataformas (ms)
    const colorChangeFrequency = 200; // Cambio de color cada 0.5 segundos

    const colors = ['green','cyan','cornflowerblue','pink','red','yellow']; // Excluir rojo
    let currentColorIndex = 0;

    let isGameRunning = false;

    // Puntaje
    let score = 0;
    const scoreEl = document.getElementById('score');
    function addScore(points) {
        score += points;
        if (scoreEl) scoreEl.textContent = score;
    }

    // Función para iniciar el juego
    function startGame() {
        if (isGameRunning) return;
        isGameRunning = true;
        playButton.style.display = 'none'; // Ocultar el botón de Play
        victoryScreen.classList.add('hidden');
        resetPositions();
        clearPlatforms();

        // Reproducir música de fondo
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();

        // Iniciar intervalos de juego
        gameInterval = setInterval(updateGame, 15); // 50 FPS
        platformInterval = setInterval(generatePlatform, platformFrequency);
        colorInterval = setInterval(changePlatformColors, colorChangeFrequency); // Cambio de colores

        // Generar la plataforma inicial (estructura sólida)
        generateInitialFloor();

        // Generar plataformas adicionales para empezar
        for (let i = 1; i <= 3; i++) {
            generatePlatform();
        }
    }

    // Función para reintentar el juego
    retryButton.addEventListener("click", function () {
        clickSound.play();
        startGame();
    });

    // Función para generar una estructura inicial sólida
    function generateInitialFloor() {
        const blockSize = PLATFORM_SIZE;
        const xStart = 100;  // Posición centrada a la izquierda de la pantalla
        const yStart = gameContainer.clientHeight - 150; // Posición inferior para la estructura

        // Crear base de 10 bloques
        for (let i = 0; i < 4; i++) {
            const floorBlock = document.createElement('div');
            floorBlock.classList.add('platform');
            floorBlock.style.width = `${blockSize}px`;
            floorBlock.style.height = `${blockSize}px`;
            floorBlock.style.left = `${xStart + i * blockSize}px`;
            floorBlock.style.top = `${yStart}px`;
            floorBlock.style.backgroundColor = colors[currentColorIndex];

            gameContainer.appendChild(floorBlock);

            platforms.push({
                element: floorBlock,
                xPos: xStart + i * blockSize,
                yPos: yStart,
                width: blockSize,
                height: blockSize
            });
        }

        // Crear bloques adicionales debajo de la base
        for (let i = 0; i < 2; i++) {
            const lowerBlock = document.createElement('div');
            lowerBlock.classList.add('platform');
            lowerBlock.style.width = `${blockSize}px`;
            lowerBlock.style.height = `${blockSize}px`;
            lowerBlock.style.left = `${xStart + (5 + i) * blockSize}px`; // Debajo del bloque central
            lowerBlock.style.top = `${yStart + blockSize}px`; // Posicionado justo debajo
            lowerBlock.style.backgroundColor = colors[currentColorIndex];

            gameContainer.appendChild(lowerBlock);

            platforms.push({
                element: lowerBlock,
                xPos: xStart + (5 + i) * blockSize,
                yPos: yStart + blockSize,
                width: blockSize,
                height: blockSize
            });
        }

        // Crear una estructura paralela encima de la base
        for (let i = 0; i < 4; i++) {
            const upperBlock = document.createElement('div');
            upperBlock.classList.add('platform');
            upperBlock.style.width = `${blockSize}px`;
            upperBlock.style.height = `${blockSize}px`;
            upperBlock.style.left = `${xStart + i * blockSize}px`;
            upperBlock.style.top = `${yStart - blockSize * 2}px`; // Dos bloques por encima
            upperBlock.style.backgroundColor = colors[currentColorIndex];

            gameContainer.appendChild(upperBlock);

            platforms.push({
                element: upperBlock,
                xPos: xStart + i * blockSize,
                yPos: yStart - blockSize * 2,
                width: blockSize,
                height: blockSize
            });
        }
    }

    // Función para generar plataformas adicionales
    function generatePlatform() {
        const blockSize = PLATFORM_SIZE;
        let max = 4;
        let min = 0; 
        const platformLength = Math.floor(Math.random() * (max - min)) + 2 ; // Longitud entre 2 y 5 bloques

        // Alternar posiciones: upper, middle-up, middle-down, lower
        const positions = ['upper', 'middle-up', 'middle-down', 'lower'];
        let availablePositions = positions.filter(pos => pos !== lastPlatformPosition);
        const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        lastPlatformPosition = position;

        let yPos;
        switch (position) {
            case 'upper':
                yPos = 100; // 100px desde arriba
                break;
                case 'middle-up':
                yPos = gameContainer.clientHeight / 2 - 100; // Medio arriba
                break;
                case 'middle-down':
                yPos = gameContainer.clientHeight / 2 + 50; // Medio abajo
                break;
                case 'lower':
                yPos = gameContainer.clientHeight - 100; // 150px desde abajo
                break;
            }

        // Determinar posición X (fuera de la pantalla a la derecha)
        const xStart = gameContainer.clientWidth;

        // Crear múltiples bloques para formar una plataforma
        for (let i = 0; i < platformLength; i++) {
            const platformBlock = document.createElement('div');
            platformBlock.classList.add('platform');
            platformBlock.style.width = `${blockSize}px`;
            platformBlock.style.height = `${blockSize}px`;
            platformBlock.style.left = `${xStart + i * blockSize}px`;
            platformBlock.style.top = `${yPos}px`;
            platformBlock.style.backgroundColor = colors[currentColorIndex];

            gameContainer.appendChild(platformBlock);

            platforms.push({
                element: platformBlock,
                xPos: xStart + i * blockSize,
                yPos: yPos,
                width: blockSize,
                height: blockSize
            });
        }
    }

  // Función para cambiar el color de todas las plataformas al mismo tiempo
function changePlatformColors() {
    // Incrementa el índice para cambiar al siguiente color en el arreglo
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    const newColor = colors[currentColorIndex];

    // Cambia el color de fondo de todos los bloques al nuevo color
    platforms.forEach(platform => {
        platform.element.style.backgroundColor = newColor;
    });
}

    // Función para actualizar el estado del juego
    function updateGame() {
        moveChickens();
        movePlatforms();
        checkCollisions();
        checkWinConditions();
    }

    // Función para mover los pollos
    function moveChickens() {
        chickens.forEach(chicken => {
            // Aplicar gravedad y actualizar posición vertical
            chicken.velocity += gravityForce * chicken.gravity;
            chicken.velocity = Math.max(Math.min(chicken.velocity, velocityMax), -velocityMax); // Limitar velocidad
            chicken.yPos += chicken.velocity;
            chicken.element.style.top = chicken.yPos + 'px';
        });
    }

    // Función para mover las plataformas
    function movePlatforms() {
        platforms.forEach((platform, index) => {
            platform.xPos -= platformSpeed;
            platform.element.style.left = `${platform.xPos}px`;

            // Eliminar plataformas que salen de la pantalla
            if (platform.xPos + platform.width < 0) {
                gameContainer.removeChild(platform.element);
                platforms.splice(index, 1);
                addScore(100); // Suma 100 puntos por cada bloque avanzado
            }
        });
    }

    // Función para detectar colisiones y gestionar cooldown
    function checkCollisions() {
        chickens.forEach(chicken => {
            let isOnPlatform = false;
            platforms.forEach(platform => {
                const platformLeft = platform.xPos;
                const platformRight = platform.xPos + platform.width;
                const platformTop = platform.yPos;
                const platformBottom = platform.yPos + platform.height;

                const chickenLeft = 50; // Posición fija en X (left: 50px)
                const chickenRight = chickenLeft + chicken.element.clientWidth;

                const chickenTop = chicken.yPos;
                const chickenBottom = chicken.yPos + chicken.element.clientHeight;

                if (chicken.gravity === 1) { // Gravity down
                    // Verificar si la parte inferior del pollo está sobre la parte superior de la plataforma
                    if (
                        chickenBottom >= platformTop &&
                        chickenBottom <= platformBottom + 5 && // Margen de error
                        chickenLeft < platformRight &&
                        chickenRight > platformLeft
                        ) {
                        isOnPlatform = true;
                    if (!chicken.onPlatform) {
                            chicken.canChangeGravity = true; // Reset cooldown al aterrizar
                            chicken.onPlatform = false;
                            chicken.velocity = 0; // Detener la caída al estar en una plataforma
                            chicken.yPos = platformTop - chicken.element.clientHeight; // Alinear al tope de la plataforma
                            chicken.element.style.top = chicken.yPos + 'px';

                            // Ajustar transform según la gravedad
                            chicken.element.classList.remove('gravity-up');
                            chicken.element.classList.add('gravity-down');
                        }
                    }
                } else { // Gravity up
                    // Verificar si la parte superior del pollo está sobre la parte inferior de la plataforma
                    if (
                        chickenTop <= platformBottom &&
                        chickenTop >= platformTop - 5 && // Margen de error
                        chickenLeft < platformRight &&
                        chickenRight > platformLeft
                        ) {
                        isOnPlatform = true;
                    if (!chicken.onPlatform) {
                            chicken.canChangeGravity = true; // Reset cooldown al aterrizar
                            chicken.onPlatform = true;
                            chicken.velocity = 0; // Detener la subida al estar en una plataforma
                            chicken.yPos = platformBottom;
                            chicken.element.style.top = chicken.yPos + 'px';

                            // Ajustar transform según la gravedad
                            chicken.element.classList.remove('gravity-down');
                            chicken.element.classList.add('gravity-up');
                        }
                    }
                }
            });

            if (!isOnPlatform && chicken.onPlatform) {
                chicken.onPlatform = false;
            }
        });
    }

    // Función para verificar condiciones de victoria
    function checkWinConditions() {
        // Verificar si un jugador ha caído fuera del área de juego
        chickens.forEach(chicken => {
            if (chicken.yPos < -chicken.element.clientHeight || chicken.yPos > gameContainer.clientHeight) {
                const winner = chickens.find(c => c !== chicken); // Encuentra al otro jugador
                endGame(winner);
            }
        });
    }

    // Función para terminar el juego
    function endGame(winner) {
        if (!isGameRunning) return;
        clearInterval(gameInterval);
        clearInterval(platformInterval);
        clearInterval(colorInterval);
        isGameRunning = false;
        // No mostramos el botón de Play nuevamente, solo el Retry

        // Detener la música de fondo
        backgroundMusic.pause();

        // Reproducir sonido de victoria
        victorySound.currentTime = 0;
        victorySound.play();

        // Mostrar pantalla de victoria
        showVictoryScreen(winner);
    }

    // Función para mostrar la pantalla de victoria
    function showVictoryScreen(winner) {
        winnerName.textContent = `${winner.name} ¡Gana!`;
        // Intentar extraer la imagen del fondo del elemento del jugador si existe
        let src = '';
        try {
            const bg = winner.element && winner.element.style && winner.element.style.backgroundImage;
            if (bg && bg !== 'none') {
                const m = bg.match(/url\(["']?(.*?)["']?\)/);
                if (m) src = m[1];
            }
        } catch (e) {
            src = '';
        }
        if (src) winnerImage.src = src;
        winnerImage.alt = winner.name;
        victoryScreen.classList.remove('hidden');
    }

    // Función para reiniciar posiciones de los pollos
    function resetPositions() {
        chickens.forEach(chicken => {
            chicken.yPos = chicken.element.id === 'chicken1' ? 150 : 200;
            chicken.velocity = 0;
            chicken.gravity = 1;
            chicken.canChangeGravity = true;
            chicken.onPlatform = false;
            chicken.element.style.top = chicken.yPos + 'px';
            chicken.element.classList.remove('gravity-up', 'gravity-down');
            chicken.element.classList.add('gravity-down');
        });
    }

    // Función para limpiar todas las plataformas existentes
    function clearPlatforms() {
        platforms.forEach(platform => {
            if (gameContainer.contains(platform.element)) {
                gameContainer.removeChild(platform.element);
            }
        });
        platforms = [];
        lastPlatformPosition = null;
    }

    // Manejar el cambio de gravedad al presionar teclas
    document.addEventListener('keydown', function (e) {
        if (!isGameRunning) return;

        const key = e.key.toLowerCase();
        chickens.forEach(chicken => {
            if (key === chicken.key && chicken.canChangeGravity) {
                clickSound.play();
                chicken.gravity *= -1; // Cambiar dirección de la gravedad
                chicken.canChangeGravity = false;

                // Añadir clase de gravedad
                if (chicken.gravity === 1) {
                    chicken.element.classList.remove('gravity-up');
                    chicken.element.classList.add('gravity-down');
                } else {
                    chicken.element.classList.remove('gravity-down');
                    chicken.element.classList.add('gravity-up');
                }
            }
        });
    });

    // Iniciar el juego al hacer clic en el botón Play
    if (playButton) {
        playButton.addEventListener("click", function () {
            if (clickSound && clickSound.play) clickSound.play();
            startGame();
        });
    }
});

const image = document.getElementById('chicken1');

// Escuchar el evento de teclado
document.addEventListener('keydown', (e) => {
    if (e.key.toUpperCase() === 'A') { // Comprobar si la tecla es 'A'
        // Alternar la clase 'mirrored' si el elemento existe
        if (!image) return;
        if (image.classList.contains('mirrored')) {
            image.classList.remove('mirrored');
        } else {
            image.classList.add('mirrored');
        }
    }
});

// Updated dropdown panel logic
document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("openChars");
    const panel = document.getElementById("charsPanel");
    if (openBtn && panel) {
        openBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            panel.classList.toggle("open");
        });
        document.addEventListener("click", function(e) {
            if (!panel.contains(e.target) && e.target !== openBtn) {
                panel.classList.remove("open");
            }
        });
    }
});

(function(){
        const openBtn = document.getElementById('openChars');
        const panel = document.getElementById('charsPanel');
        const closeBtn = document.getElementById('closeChars');
        const p1Input = document.getElementById('player1Selected');
        const p2Input = document.getElementById('player2Selected');
        const chicken1 = document.getElementById('chicken1');
        const chicken2 = document.getElementById('chicken2');

        function openPanel(){
            panel.classList.add('open');
            panel.setAttribute('aria-hidden','false');
            openBtn.setAttribute('aria-expanded','true');
        }
        function closePanel(){
            panel.classList.remove('open');
            panel.setAttribute('aria-hidden','true');
            openBtn.setAttribute('aria-expanded','false');
        }

        openBtn && openBtn.addEventListener('click', function(e){
            e.stopPropagation();
            if(panel.classList.contains('open')) closePanel(); else openPanel();
        });
        closeBtn && closeBtn.addEventListener('click', function(e){ e.stopPropagation(); closePanel(); });

        // assign first click to player1, second click to player2, then alternate
        let nextPlayer = 1;
        panel && panel.querySelectorAll('.char-box').forEach(function(box){
            box.addEventListener('click', function(e){
                e.stopPropagation();
                const chr = box.dataset.char || '';
                const img = box.querySelector('img');
                const imgSrc = img ? img.getAttribute('src') : '';

                if(nextPlayer === 1){
                    // clear previous p1 selection visual
                    const prev = document.querySelectorAll('#player1Panel .char-box');
                    prev.forEach(b=>b.classList.remove('assigned-p1'));
                    // mark selected in player1 panel
                    const target = document.querySelector(`#player1Panel .char-box[data-char="${chr}"]`);
                    if(target) target.classList.add('assigned-p1');
                    p1Input && (p1Input.value = chr);
                    if(chicken1 && imgSrc) chicken1.style.backgroundImage = `url('${imgSrc}')`;
                    nextPlayer = 2;
                } else {
                    const prev2 = document.querySelectorAll('#player2Panel .char-box');
                    prev2.forEach(b=>b.classList.remove('assigned-p2'));
                    const target2 = document.querySelector(`#player2Panel .char-box[data-char="${chr}"]`);
                    if(target2) target2.classList.add('assigned-p2');
                    p2Input && (p2Input.value = chr);
                    if(chicken2 && imgSrc) chicken2.style.backgroundImage = `url('${imgSrc}')`;
                    nextPlayer = 1;
                }
            });
        });

        // close when clicking outside
        document.addEventListener('click', function(e){
            if(!panel) return;
            if(!panel.contains(e.target) && e.target !== openBtn) closePanel();
        });
    })();

// Ajusta hitbox y posición inicial para pollos y plataformas
const CHICKEN_SIZE = 35;
const PLATFORM_SIZE = 35;
chicken1.style.width = CHICKEN_SIZE + 'px';
chicken1.style.height = CHICKEN_SIZE + 'px';
chicken2.style.width = CHICKEN_SIZE + 'px';
chicken2.style.height = CHICKEN_SIZE + 'px';

function generateInitialFloor() {
    const blockSize = PLATFORM_SIZE;
    const xStart = 100;  // Posición centrada a la izquierda de la pantalla
    const yStart = gameContainer.clientHeight - 150; // Posición inferior para la estructura

    // Crear base de 10 bloques
    for (let i = 0; i < 4; i++) {
        const floorBlock = document.createElement('div');
        floorBlock.classList.add('platform');
        floorBlock.style.width = `${blockSize}px`;
        floorBlock.style.height = `${blockSize}px`;
        floorBlock.style.left = `${xStart + i * blockSize}px`;
        floorBlock.style.top = `${yStart}px`;
        floorBlock.style.backgroundColor = colors[currentColorIndex];

        gameContainer.appendChild(floorBlock);

        platforms.push({
            element: floorBlock,
            xPos: xStart + i * blockSize,
            yPos: yStart,
            width: blockSize,
            height: blockSize
        });
    }

    // Crear bloques adicionales debajo de la base
    for (let i = 0; i < 2; i++) {
        const lowerBlock = document.createElement('div');
        lowerBlock.classList.add('platform');
        lowerBlock.style.width = `${blockSize}px`;
        lowerBlock.style.height = `${blockSize}px`;
        lowerBlock.style.left = `${xStart + (5 + i) * blockSize}px`; // Debajo del bloque central
        lowerBlock.style.top = `${yStart + blockSize}px`; // Posicionado justo debajo
        lowerBlock.style.backgroundColor = colors[currentColorIndex];

        gameContainer.appendChild(lowerBlock);

        platforms.push({
            element: lowerBlock,
            xPos: xStart + (5 + i) * blockSize,
            yPos: yStart + blockSize,
            width: blockSize,
            height: blockSize
        });
    }

    // Crear una estructura paralela encima de la base
    for (let i = 0; i < 4; i++) {
        const upperBlock = document.createElement('div');
        upperBlock.classList.add('platform');
        upperBlock.style.width = `${blockSize}px`;
        upperBlock.style.height = `${blockSize}px`;
        upperBlock.style.left = `${xStart + i * blockSize}px`;
        upperBlock.style.top = `${yStart - blockSize * 2}px`; // Dos bloques por encima
        upperBlock.style.backgroundColor = colors[currentColorIndex];

        gameContainer.appendChild(upperBlock);

        platforms.push({
            element: upperBlock,
            xPos: xStart + i * blockSize,
            yPos: yStart - blockSize * 2,
            width: blockSize,
            height: blockSize
        });
    }
}

// Función para generar plataformas adicionales
function generatePlatform() {
    const blockSize = PLATFORM_SIZE;
    let max = 4;
    let min = 0; 
    const platformLength = Math.floor(Math.random() * (max - min)) + 2 ; // Longitud entre 2 y 5 bloques

    // Alternar posiciones: upper, middle-up, middle-down, lower
    const positions = ['upper', 'middle-up', 'middle-down', 'lower'];
    let availablePositions = positions.filter(pos => pos !== lastPlatformPosition);
    const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    lastPlatformPosition = position;

    let yPos;
    switch (position) {
        case 'upper':
            yPos = 100; // 100px desde arriba
            break;
            case 'middle-up':
            yPos = gameContainer.clientHeight / 2 - 100; // Medio arriba
            break;
            case 'middle-down':
            yPos = gameContainer.clientHeight / 2 + 50; // Medio abajo
            break;
            case 'lower':
            yPos = gameContainer.clientHeight - 100; // 150px desde abajo
            break;
        }

    // Determinar posición X (fuera de la pantalla a la derecha)
    const xStart = gameContainer.clientWidth;

    // Crear múltiples bloques para formar una plataforma
    for (let i = 0; i < platformLength; i++) {
        const platformBlock = document.createElement('div');
        platformBlock.classList.add('platform');
        platformBlock.style.width = `${blockSize}px`;
        platformBlock.style.height = `${blockSize}px`;
        platformBlock.style.left = `${xStart + i * blockSize}px`;
        platformBlock.style.top = `${yPos}px`;
        platformBlock.style.backgroundColor = colors[currentColorIndex];

        gameContainer.appendChild(platformBlock);

        platforms.push({
            element: platformBlock,
            xPos: xStart + i * blockSize,
            yPos: yPos,
            width: blockSize,
            height: blockSize
        });
    }
}