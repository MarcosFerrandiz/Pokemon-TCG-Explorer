const apiKey = 'fc9ae57e-62eb-4c1b-98c5-0be3ae7ac0d9';
const baseUrl = 'https://api.pokemontcg.io/v2';

const cardGrid = document.getElementById('card-grid');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const randomButton = document.getElementById('random-button');
const menuButton = document.getElementById('menu-button');
const sortSelect = document.getElementById('sort-select');
const sortButton = document.getElementById('sort-button');
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close');
const cardDetails = document.getElementById('card-details');

let currentCards = [];

const typeColors = {
    Fire: '#FF5733',
    Water: '#3498DB',
    Grass: '#58D68D',
    Electric: '#F4D03F',
    Psychic: '#AF7AC5',
    Ice: '#85C1E9',
    Dragon: '#D35400',
    Dark: '#34495E',
    Fairy: '#F1948A',
    Normal: '#AAB7B8',
    Fighting: '#CD6155',
    Flying: '#AED6F1',
    Poison: '#BB8FCE',
    Ground: '#D7BDE2',
    Rock: '#B7950B',
    Bug: '#82E0AA',
    Ghost: '#7D3C98',
    Steel: '#85929E'
};

async function loadRandomCards() {
    try {
        const response = await fetch(`${baseUrl}/cards?pageSize=20&page=${Math.floor(Math.random() * 50) + 1}`, {
            headers: { 'X-Api-Key': apiKey }
        });
        const data = await response.json();
        currentCards = data.data;
        resetSortSelect();
        displayCards(currentCards);
    } catch (error) {
        console.error('Error al cargar las cartas:', error);
    }
}

async function searchCards() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        loadRandomCards();
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/cards?q=name:"${searchTerm}*"`, {
            headers: { 'X-Api-Key': apiKey }
        });
        const data = await response.json();
        currentCards = data.data;
        resetSortSelect();
        displayCards(currentCards);
    } catch (error) {
        console.error('Error al buscar cartas:', error);
    }
}

function displayCards(cards) {
    cardGrid.innerHTML = '';
    if (cards.length === 0) {
        cardGrid.innerHTML = '<p>No se encontraron cartas.</p>';
        return;
    }

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-container';
        cardElement.innerHTML = `
            <div class="card">
                <img src="${card.images.small}" alt="${card.name}">
                <h3>${card.name}</h3>
            </div>
            <div class="card-details">
                <p class="price">$${card.cardmarket?.prices?.averageSellPrice?.toFixed(2) || 'N/A'}</p>
                <p class="date">${card.set.releaseDate || 'Fecha desconocida'}</p>
            </div>`;
        
        cardElement.addEventListener('click', () => showCardDetails(card));
        cardGrid.appendChild(cardElement);
    });
}


function addDynamicGlow() {
    const card = document.getElementById('movable-card');
    
    // Añadir animación de brillo
    card.classList.add('active');
    
    // Crear efecto de brillo dinámico
    const glowEffect = document.createElement('div');
    glowEffect.classList.add('glow-effect');
    card.appendChild(glowEffect);

    // Mover brillo con el mouse
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glowEffect.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3), transparent 50%)`;
    });

    // Eliminar brillo al salir
    card.addEventListener('mouseleave', () => {
        card.classList.remove('active');
        card.removeChild(glowEffect);
    });
}




function showCardDetails(card) {
    const primaryType = card.types ? card.types[0] : 'Normal';
    
    document.getElementById('card-name').textContent = card.name;
    document.getElementById('card-type').textContent = primaryType;
    document.getElementById('card-attacks').textContent = card.attacks ? card.attacks.map(attack => attack.name).join(', ') : 'Sin ataques';
    document.getElementById('card-weaknesses').textContent = card.weaknesses ? card.weaknesses.map(w => w.type).join(', ') : 'Ninguna';
    document.getElementById('card-resistances').textContent = card.resistances ? card.resistances.map(r => r.type).join(', ') : 'Ninguna';
    document.getElementById('card-retreat-cost').textContent = card.retreatCost ? card.retreatCost.length : '0';
    document.getElementById('card-rarity').textContent = card.rarity || 'Desconocida';
    document.getElementById('card-set').textContent = card.set.name;
    document.getElementById('card-artist').textContent = card.artist || 'Desconocido';

    // Asignar precio y fecha de lanzamiento
    const price = card.cardmarket?.prices?.averageSellPrice || 'N/A';
    const releaseDate = card.set.releaseDate || 'Fecha desconocida';

    document.getElementById('card-price').textContent = `Precio: $${price.toFixed(2)}`;
    document.getElementById('card-date').textContent = `Fecha de lanzamiento: ${releaseDate}`;

    // Mostrar imagen de la carta
    document.getElementById('card-img').src = card.images.large;
    modal.style.display = 'block';

    applyHolographicEffect(card);
    enableCardMovement();
}

function closeModal() {
    modal.style.display = 'none';
}

function resetSortSelect() {
    sortSelect.value = 'name';
}

function sortCards() {
    const sortType = sortSelect.value;

    switch (sortType) {
        case 'name':
            currentCards.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'date-asc':
            currentCards.sort((a, b) => new Date(a.set.releaseDate) - new Date(b.set.releaseDate));
            break;
        case 'date-desc':
            currentCards.sort((a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate));
            break;
        case 'price-asc':
            currentCards.sort((a, b) => (a.cardmarket?.prices?.averageSellPrice || 0) - (b.cardmarket?.prices?.averageSellPrice || 0));
            break;
        case 'price-desc':
            currentCards.sort((a, b) => (b.cardmarket?.prices?.averageSellPrice || 0) - (a.cardmarket?.prices?.averageSellPrice || 0));
            break;
    }

    displayCards(currentCards);
}

function enableCardMovement() {
    const card = document.getElementById('movable-card');
    const container = document.getElementById('card-container');
    let rect = container.getBoundingClientRect();
    let isMoving = false;
    let startX, startY;

    // Eventos para escritorio
    container.addEventListener('mousedown', startMove);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stopMove);

    // Eventos para móviles
    container.addEventListener('touchstart', startMoveTouch);
    container.addEventListener('touchmove', moveTouch);
    container.addEventListener('touchend', stopMove);

    function startMove(e) {
        isMoving = true;
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        card.style.transition = 'none';
    }

    function startMoveTouch(e) {
        isMoving = true;
        startX = e.touches[0].clientX - rect.left;
        startY = e.touches[0].clientY - rect.top;
        card.style.transition = 'none';
    }

    function move(e) {
        if (!isMoving) return;
        updateCardPosition(e.clientX - rect.left, e.clientY - rect.top);
    }

    function moveTouch(e) {
        if (!isMoving) return;
        e.preventDefault();
        updateCardPosition(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }

    function updateCardPosition(currentX, currentY) {
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const rotateY = deltaX / rect.width * 20;
        const rotateX = -deltaY / rect.height * 20;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function stopMove() {
        isMoving = false;
        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
}

function applyHolographicEffect(card) {
    const holographicRarities = ['Rare Holo', 'Rare Holo GX', 'Rare Holo V', 'Rare Holo VMAX'];
    const cardElement = document.getElementById('movable-card');
    
    if (holographicRarities.includes(card.rarity)) {
        cardElement.classList.add('holo');
    } else {
        cardElement.classList.remove('holo');
    }
}

function applyHolographicEffect(card) {
    const holographicRarities = ['Rare Holo', 'Rare Holo GX', 'Rare Holo V', 'Rare Holo VMAX'];
    if (holographicRarities.includes(card.rarity)) {
        document.getElementById('movable-card').classList.add('holo');
    } else {
        document.getElementById('movable-card').classList.remove('holo');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadRandomCards();

    menuButton.addEventListener('click', loadRandomCards);
    searchButton.addEventListener('click', searchCards);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCards();
        }
    });
    randomButton.addEventListener('click', loadRandomCards);
    sortButton.addEventListener('click', sortCards);
    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
