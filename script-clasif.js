// script-clasif.js

// Elementos
const victoryScreen = document.getElementById('victoryScreen');
let clasifPanel = null;
let clasifButton = document.getElementById('clasifBtn');
let nameSaved = false;
let lastScore = 0;
let lastImg = '';
let lastUser = '';

function createClasifPanel() {
    if (clasifPanel) return clasifPanel;
    clasifPanel = document.createElement('div');
    clasifPanel.className = 'clasif-panel';
    clasifPanel.innerHTML = `
        <div class="clasif-header">SUPREMOS LEGENDARIOS</div>
        <div class="clasif-top">
            <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
                <div class="clasif-top-rank">1º</div>
                <div class="clasif-top-score" id="clasifTopScore">0</div>
            </div>
            <div class="clasif-top-img" id="clasifTopImg"></div>
            <div style="width:100%;text-align:center;">
                <span class="clasif-top-name" id="clasifTopName">-</span>
            </div>
        </div>
        <div class="clasif-list" id="clasifList">
            <!-- Aquí van los puestos 2-10 -->
        </div>
    `;
    document.body.appendChild(clasifPanel);
    return clasifPanel;
}

function toggleClasifPanel() {
    if (!clasifPanel) createClasifPanel();
    clasifPanel.classList.toggle('active');
}

if (clasifButton) {
    clasifButton.addEventListener('click', toggleClasifPanel);
}

// Lógica para guardar nombre y actualizar tabla
let clasifData = [];
function saveClasifTable() {
    localStorage.setItem('clasifTable', JSON.stringify(clasifData));
}
function loadClasifTable() {
    const data = localStorage.getItem('clasifTable');
    if (data) {
        clasifData = JSON.parse(data);
        updateClasifPanel();
    }
}
function saveClasif(score, imgSrc, name) {
    if (!name || name.trim() === '') return false;
    clasifData.push({ score, imgSrc, name });
    clasifData = clasifData.sort((a, b) => b.score - a.score).slice(0, 10);
    updateClasifPanel();
    saveClasifTable();
    return true;
}

function updateClasifPanel() {
    if (!clasifPanel) return;
    // Primer lugar
    const top = clasifData[0];
    document.getElementById('clasifTopScore').textContent = top ? top.score : '0';
    document.getElementById('clasifTopImg').innerHTML = top && top.imgSrc ? `<img src="${top.imgSrc}" style="width:48px;height:48px;border-radius:8px;">` : '';
    document.getElementById('clasifTopName').textContent = top ? top.name : '-';
    // Resto de la lista
    const list = document.getElementById('clasifList');
    list.innerHTML = '';
    for (let i = 1; i < 10; i++) {
        const item = clasifData[i];
        list.innerHTML += `<div class="clasif-row"><span>${i+1}º</span> <input type='text' maxlength='30' value='${item ? item.name : ''}' class='clasif-top-name' style='width:90px;' ${item ? 'disabled' : ''}> <span>${item ? item.score : '-'}</span> <span>${item && item.imgSrc ? `<img src='${item.imgSrc}' style='width:32px;height:32px;border-radius:6px;'>` : ''}</span></div>`;
    }
}

// Mostrar input para nombre en pantalla de victoria al ganar
function showNameInputOnVictory(score, imgSrc) {
    lastScore = score;
    lastImg = imgSrc;
    let nameInput = document.getElementById('victoryNameInput');
    let okBtn = document.getElementById('victoryNameOk');
    const winnerName = document.getElementById('winnerName');
    // Eliminar símbolos y mostrar solo el input arcade
    winnerName.textContent = '';
    if (!nameInput) {
        nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'victoryNameInput';
        nameInput.maxLength = 30;
        nameInput.placeholder = 'Ingresa tu nombre...';
        nameInput.className = 'clasif-top-name';
        okBtn = document.createElement('button');
        okBtn.id = 'victoryNameOk';
        okBtn.textContent = 'Aceptar';
        okBtn.className = 'clasif-ok-btn';
        winnerName.parentNode.insertBefore(nameInput, winnerName.nextSibling);
        winnerName.parentNode.insertBefore(okBtn, nameInput.nextSibling);
    } else {
        nameInput.value = '';
        nameInput.disabled = false;
        okBtn.disabled = false;
    }
    okBtn.onclick = function() {
        if (nameInput.value.trim() !== '') {
            saveClasif(lastScore, lastImg, nameInput.value.trim());
            nameInput.disabled = true;
            okBtn.disabled = true;
        }
    };
}

// Recibir score desde script-03.js
window.showClasifInput = function(score, imgSrc) {
    showNameInputOnVictory(score, imgSrc);
};

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    createClasifPanel();
    loadClasifTable();
    clasifPanel.classList.remove('active');
});
