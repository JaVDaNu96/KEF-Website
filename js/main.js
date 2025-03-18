const interventionsUrl = '../.netlify/functions/getInterventions';
// Función para cargar las intervenciones desde el JSON
async function loadInterventions(tagFilter = '') {
    try {
        const response = await fetch(interventionsUrl);
        const interventions = await response.json();

        // Filtrar intervenciones si hay un tag específico
        const filteredInterventions = tagFilter 
            ? interventions.filter(intervention => intervention.tags.includes(tagFilter)) 
            : interventions;

        // Renderizar las intervenciones
        renderInterventions(filteredInterventions);
    } catch (error) {
        console.error("Error al cargar las intervenciones:", error);
    }
}

// Función para renderizar las intervenciones en el contenedor
function renderInterventions(interventions) {
    const container = document.getElementById('interventions-container');
    container.innerHTML = ''; // Clear the container before rendering

    interventions.forEach(intervention => {
        const interventionElement = document.createElement('div');
        interventionElement.className = 'intervention-wrapper';

        interventionElement.innerHTML = `
            <div class="intervention-card">
                <h3>${intervention.title}</h3>
                <p><strong>Fecha:</strong> ${intervention.date}</p>
                <p><strong>Ubicación:</strong> ${intervention.location}</p>
                <p>${intervention.description}</p>
            </div>
        `;

        container.appendChild(interventionElement);
    });
}

// Función para filtrar intervenciones por tag (usada en intervenciones.html)
function filterInterventions(tag) {
    loadInterventions(tag);
}

// Cargar las intervenciones iniciales en cada página
document.addEventListener('DOMContentLoaded', () => {
    // Detecta la página actual y carga las intervenciones con el tag correspondiente
    const currentPage = window.location.pathname;

    if (currentPage.includes('activismo.html')) {
        loadInterventions('Activismo');
    } else if (currentPage.includes('formacion.html')) {
        loadInterventions('Formacion');
    } else if (currentPage.includes('consumo.html')) {
        loadInterventions('Consumo');
    } else if (currentPage.includes('intervenciones.html')) {
        loadInterventions(); // Carga todas las intervenciones
    }
});

const eventsUrl = '../data/eventscarousel.json';

async function loadCarousels() {
    try {
        const response = await fetch(eventsUrl);
        const topics = await response.json();

        const container = document.getElementById('carousel-container');
        container.innerHTML = '';

        topics.forEach(topic => {
            // Create Topic Section
            const topicSection = document.createElement('div');
            topicSection.className = 'topic-section';

            const topicTitle = document.createElement('h2');
            topicTitle.textContent = topic.topic;
            topicSection.appendChild(topicTitle);

            topic.events.forEach(event => {
                // Create Event Section
                const eventSection = document.createElement('div');
                eventSection.className = 'event-section';

                const eventTitle = document.createElement('h3');
                eventTitle.textContent = event.name;

                const eventDescription = document.createElement('p');
                eventDescription.textContent = event.description;

                eventSection.appendChild(eventTitle);
                eventSection.appendChild(eventDescription);

                // Create Carousel Container
                const carousel = document.createElement('div');
                carousel.className = 'carousel';

                event.images.forEach(imgSrc => {
                    const imgElement = document.createElement('img');
                    imgElement.src = imgSrc;
                    imgElement.className = 'carousel-img';
                    imgElement.onclick = () => expandImage(imgSrc);
                    carousel.appendChild(imgElement);
                });

                eventSection.appendChild(carousel);
                topicSection.appendChild(eventSection);
            });

            container.appendChild(topicSection);
        });
    } catch (error) {
        console.error("Error loading carousels:", error);
    }
}

// Function to Expand Image in Modal
function expandImage(src) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("expanded-img");

    modal.style.display = "block";
    modalImg.src = src;

    document.querySelector(".close").onclick = function() {
        modal.style.display = "none";
    };
}

// Load carousels on page load
document.addEventListener('DOMContentLoaded', loadCarousels);
