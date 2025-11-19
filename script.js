// Partículas decorativas para la selección de niveles
// Sorpresa visual para la selección de nivel

document.addEventListener('DOMContentLoaded', function() {
  function randomColor() {
    const colors = ['#00ff00', '#ffd700', '#fff700', '#00ff88', '#ffea00'];
    return colors[Math.floor(Math.random()*colors.length)];
  }
  for(let i=0;i<22;i++) {
    const p = document.createElement('span');
    p.className = 'level-particle';
    p.style.left = (Math.random()*90+5) + 'vw';
    p.style.top = (Math.random()*60+20) + 'vh';
    p.style.background = randomColor();
    document.body.appendChild(p);
  }
});
