// URL del archivo JSON
const jsonUrl = 'assets/data/intervenciones.json';

// Función para cargar las intervenciones desde el JSON
async function loadInterventions(tagFilter = '') {
    try {
        const response = await fetch(jsonUrl);
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
                <p><strong>Fecha:</strong> ${new Date(intervention.date).toLocaleDateString('es-ES')}</p>
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

document.addEventListener('DOMContentLoaded', () => {
    // Constants and state variables
    const TRANSITION_DURATION = 600; // in milliseconds (should match your CSS transition duration)
    let isAnimating = false;
    const wrappers = document.querySelectorAll('.full-section-wrapper');
    let currentIndex = 0;

    // Initialization: assign fixed z-indexes and initial classes
    wrappers.forEach((wrapper, index) => {
        wrapper.style.zIndex = index + 1; // Fix the deck order
        if (index === currentIndex) {
            wrapper.classList.add('active');
        } else {
            wrapper.classList.add('off-screen');
        }
        });

    // Listen for wheel events on the window
    window.addEventListener('wheel', (e) => {
        console.log('wheel event fired', e.deltaY)
        if (isAnimating) return; // Prevent overlapping animations

        // Scrolling down: bring the next card in from the bottom
        if (e.deltaY > 0 && currentIndex < wrappers.length - 1) {
        isAnimating = true;
        const currentSection = wrappers[currentIndex];
        const nextSection = wrappers[currentIndex + 1];
        
        // Prepare next card: remove its off-screen class and animate it in
        nextSection.classList.remove('off-screen');
        nextSection.classList.add('slide-in-up');
        
        setTimeout(() => {
            // After the animation, mark next as active and current as off-screen.
            nextSection.classList.remove('slide-in-up');
            nextSection.classList.add('active');
            currentIndex++;
            isAnimating = false;
        }, TRANSITION_DURATION);
        
        // Scrolling up: slide the current card down to reveal the previous card
        } else if (e.deltaY < 0 && currentIndex > 0) {
        isAnimating = true;
        const currentSection = wrappers[currentIndex];
        const prevSection = wrappers[currentIndex - 1];
        
        // Animate the current card down
        currentSection.classList.remove('active');
        currentSection.classList.add('slide-out-down');
        
        setTimeout(() => {
            // After the animation, mark current card as off-screen and previous as active.
            currentSection.classList.remove('slide-out-down');
            currentSection.classList.add('off-screen');
            prevSection.classList.remove('off-screen');
            prevSection.classList.add('active');
            currentIndex--;
            isAnimating = false;
        }, TRANSITION_DURATION);
        }
    });
    }); 