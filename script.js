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



// Agrega un evento para cerrar el modal
document.querySelector('.close').addEventListener('click', function() {
    document.querySelector('.modal').style.display = 'none';
});


function showCardDetails(card) {

    const primaryType = card.types ? card.types[0] : 'Normal';
  const typeElement = document.getElementById('card-type');
  typeElement.className = `card-type ${primaryType}`;
  typeElement.style.backgroundImage = `url('path/to/your/sprite-sheet.png')`; // Asegúrate de que la ruta sea correcta
  typeElement.style.backgroundRepeat = 'no-repeat';

    
    document.getElementById('card-name').textContent = card.name;

    // Set the type with the corresponding class
    typeElement.textContent = primaryType;
    
    // Assign the type class for coloring
	const typeColors = {
		Fire: 'Fire',
		Water: 'Water',
		Grass: 'Grass',
		Electric: 'Electric',
		Psychic: 'Psychic',
		Ice: 'Ice',
		Dragon: 'Dragon',
		Dark: 'Dark',
		Fairy: 'Fairy',
		Normal:'Normal',
		Fighting:'Fighting',
		Flying:'Flying',
		Poison:'Poison',
		Ground:'Ground',
		Rock:'Rock',
		Bug:'Bug',
		Ghost:'Ghost',
		Steel:'Steel'
	};


    

	typeElement.className = `type ${typeColors[primaryType] || 'Normal'}`;

	document.getElementById('card-attacks').textContent = card.attacks ? card.attacks.map(attack => attack.name).join(', ') : 'Sin ataques';
	document.getElementById('card-weaknesses').textContent = card.weaknesses ? card.weaknesses.map(w => w.type).join(', ') : 'Ninguna';
	document.getElementById('card-resistances').textContent = card.resistances ? card.resistances.map(r => r.type).join(', ') : 'Ninguna';
	document.getElementById('card-retreat-cost').textContent = card.retreatCost ? card.retreatCost.length : '0';
	document.getElementById('card-rarity').textContent = card.rarity || 'Desconocida';
	document.getElementById('card-set').textContent = card.set.name;
	document.getElementById('card-artist').textContent = card.artist || 'Desconocido';
	document.getElementById('card-hp').textContent = `HP ${card.hp}`;
	const price = card.cardmarket?.prices?.averageSellPrice || 'N/A';
	const releaseDate = card.set.releaseDate || 'Fecha desconocida';

	document.getElementById('card-price').textContent = `Precio: $${price.toFixed(2)}`;
	document.getElementById('card-date').textContent = `Fecha de lanzamiento: ${releaseDate}`;

	document.getElementById('card-img').src = card.images.large;

	modal.style.display = 'block'; // Mostrar modal

    // Set modal border color based on Pokémon type
	const modalContent = document.querySelector('.modal-content');
	modalContent.className = `modal-content type-border ${primaryType}`; // Add type class for border color

    const cardAttacksContainer = document.getElementById('card-attacks'); // Contenedor de ataques
    const cardWeaknessesContainer = document.getElementById('card-weaknesses'); // Contenedor de debilidades
    const cardResistancesContainer = document.getElementById('card-resistances'); // Contenedor de resistencias

    
    const attacks = card.attacks || [];
    cardAttacksContainer.innerHTML = ''; // Limpiar el contenedor de ataques
    attacks.forEach(attack => {
        const attackElement = document.createElement('div'); // Cambiar a un div para agrupar
    
        // Crear un elemento para el nombre del ataque
        const attackNameElement = document.createElement('p');
        attackNameElement.textContent = attack.name; // Solo el nombre del ataque
    
        // Crear un elemento para el coste
        const costElement = document.createElement('p'); // Crear un nuevo párrafo para el coste
        const cost = attack.cost ? attack.cost.map(costType => {
            const costImage = document.createElement('span');
            costImage.className = `type-element ${costType}`; // Clase para el tipo
            return costImage; // Devuelve el elemento de imagen
        }) : ['N/A']; // Coste de energía
    
        // Añadir texto "Coste: " antes de las imágenes
        cost.forEach(costType => {
            costElement.appendChild(costType); // Añadir cada imagen al párrafo de coste
        });
    
        attackElement.appendChild(attackNameElement); // Añadir nombre del ataque al contenedor
        attackElement.appendChild(costElement); // Añadir coste debajo del ataque
        cardAttacksContainer.appendChild(attackElement); // Agregar el ataque al contenedor principal
    });
  
    // Debilidades
const weaknesses = card.weaknesses || [];
cardWeaknessesContainer.innerHTML = ''; // Limpiar el contenedor de debilidades
weaknesses.forEach(weakness => {
    const weaknessElement = document.createElement('div'); // Cambiar a un div para agrupar
    const typeElement = document.createElement('span');
    typeElement.className = `type-element ${weakness.type}`; // Clase para el tipo

    weaknessElement.appendChild(typeElement); // Añadir la imagen al contenedor de debilidades
    weaknessElement.appendChild(document.createTextNode(` ${weakness.value}`)); // Añadir multiplicador
    cardWeaknessesContainer.appendChild(weaknessElement); // Agregar al contenedor
});

// Resistencias
const resistances = card.resistances || [];
cardResistancesContainer.innerHTML = ''; // Limpiar el contenedor de resistencias
resistances.forEach(resistance => {
    const resistanceElement = document.createElement('div'); // Cambiar a un div para agrupar
    const typeElement = document.createElement('span');
    typeElement.className = `type-element ${resistance.type}`; // Clase para el tipo

    resistanceElement.appendChild(typeElement); // Añadir la imagen al contenedor de resistencias
    resistanceElement.appendChild(document.createTextNode(` ${resistance.value}`)); // Añadir multiplicador
    cardResistancesContainer.appendChild(resistanceElement); // Agregar al contenedor
});




    showModal();
	enableCardMovement(); // Enable movement for the card in modal
    applyHolographicEffect(card);
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

    // Events for desktop
    container.addEventListener('mousedown', startMove);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stopMove);

    // Events for mobile
    container.addEventListener('touchstart', startMoveTouch);
    container.addEventListener('touchmove', moveTouch);
    container.addEventListener('touchend', stopMove);

    function startMove(e) {
        isMoving = true;
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        card.style.transition = 'none'; // Disable transition for smooth dragging
    }

    function startMoveTouch(e) {
        isMoving = true;
        startX = e.touches[0].clientX - rect.left;
        startY = e.touches[0].clientY - rect.top;
        card.style.transition = 'none'; // Disable transition for smooth dragging
    }

    function move(e) {
        if (!isMoving) return;
        updateCardPosition(e.clientX - rect.left, e.clientY - rect.top);
    }

    function moveTouch(e) {
        if (!isMoving) return;
        e.preventDefault(); // Prevent default touch behavior
        updateCardPosition(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }

    function updateCardPosition(currentX, currentY) {
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const rotateY = deltaX / rect.width * 20; // Rotate based on horizontal movement
        const rotateX = -deltaY / rect.height * 20; // Rotate based on vertical movement
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; // Apply rotation
    }

    function stopMove() {
        isMoving = false;
        card.style.transition = 'transform 0.5s ease-out'; // Smooth transition back to original position
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
}


function showModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.top = `${(window.innerHeight - modalContent.offsetHeight) / 2}px`;
    modalContent.style.left = `${(window.innerWidth - modalContent.offsetWidth) / 2}px`;
  }
  

function closeModal() {
    // Hide the modal
    modal.style.display = 'none';

    // Enable scrolling on the body
    document.body.style.overflow = 'auto';
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
    const holographicRarities = ['Rare Holo', 'Rare Holo GX', 'Rare Holo V', 'Rare Holo VMAX', 'Rare Holo EX'];
    if (holographicRarities.includes(card.rarity)) {
        document.getElementById('movable-card').classList.add('holo');
    } else {
        document.getElementById('movable-card').classList.remove('holo');
    }
}







async function fetchPokemonCard(cardName) {
    try {
        // Solicitar los datos de la carta de Pokémon desde la API
        const response = await fetch(`${apiUrl}?q=name:${cardName}`);
        const data = await response.json();

        // Asegurarse de que se obtuvo una carta
        if (data.data.length > 0) {
            const card = data.data[0];

            // Extraer los datos necesarios
            const name = card.name;
            const hp = card.hp;
            const type = card.types ? card.types.join(', ') : 'Unknown';
            const move = card.attacks && card.attacks[0] ? card.attacks[0].name : 'No Move';
            const moveDescription = card.attacks && card.attacks[0] ? card.attacks[0].text : 'No Description';
            const weakness = card.weaknesses ? card.weaknesses.map(w => `${w.type} x${w.value}`).join(', ') : 'None';
            const resistance = card.resistances ? card.resistances.map(r => r.type).join(', ') : 'None';
            const retreatCost = card.retreatCost || 0;

            // Actualizar los elementos del DOM
            document.getElementById('pokemon-name').innerText = name;
            document.getElementById('pokemon-hp').innerText = `HP ${hp}`;
            document.getElementById('pokemon-type').innerText = `Type: ${type}`;
            document.getElementById('pokemon-move').innerText = move;
            document.getElementById('move-description').innerText = moveDescription;
            document.getElementById('pokemon-weakness').innerText = weakness;
            document.getElementById('pokemon-resistance').innerText = resistance;
            document.getElementById('pokemon-retreat').innerText = retreatCost;
        } else {
            alert('Carta no encontrada.');
        }
    } catch (error) {
        console.error('Error al obtener los datos de la carta:', error);
    }
}

// Llamar a la función con el nombre del Pokémon (puedes cambiarlo por otros nombres)
fetchPokemonCard('Sprigatito');





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

