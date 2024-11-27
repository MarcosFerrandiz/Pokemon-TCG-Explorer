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
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.images.small}" alt="${card.name}">
            <div class="card-details">
                <p class="price">$${card.cardmarket?.prices?.averageSellPrice?.toFixed(2) || 'N/A'}</p>
                <p class="date">${card.set.releaseDate || 'Fecha desconocida'}</p>
            </div>`;
        
        cardElement.addEventListener('click', () => showCardDetails(card));
        cardGrid.appendChild(cardElement);
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

    document.getElementById('card-img').src = card.images.large;
    modal.style.display = 'block';

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
    let isMoving = false;
    let startX, startY;
    let rotateX = 0, rotateY = 0;

    // Eventos para escritorio
    card.addEventListener('mousedown', startMove);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stopMove);
    document.addEventListener('mouseleave', stopMove);

    // Eventos para móviles
    card.addEventListener('touchstart', startMoveTouch);
    document.addEventListener('touchmove', moveTouch);
    document.addEventListener('touchend', stopMove);

    function startMove(e) {
        isMoving = true;
        startX = e.clientX;
        startY = e.clientY;
        card.style.transition = 'none';
    }

    function startMoveTouch(e) {
        isMoving = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        card.style.transition = 'none';
    }

    function move(e) {
        if (!isMoving) return;
        handleMove(e.clientX, e.clientY);
    }

    function moveTouch(e) {
        if (!isMoving) return;
        e.preventDefault(); // Prevenir el scroll
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }

    function handleMove(currentX, currentY) {
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // Limitar la rotación a un máximo de 20 grados
        rotateX = Math.max(-20, Math.min(20, -deltaY / 5));
        rotateY = Math.max(-20, Math.min(20, deltaX / 5));

        updateCardTransform();
    }

    function stopMove() {
        isMoving = false;
        card.style.transition = 'transform 0.6s';
        rotateX = 0;
        rotateY = 0;
        updateCardTransform();
    }

    function updateCardTransform() {
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
}

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
