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

gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray(".panel");
panels.forEach((panel, i) => {

// Pin each panel so it stays at top for its entire scroll range
ScrollTrigger.create({
trigger: panel,
start: "top top",
end: "bottom top",
pin: true,
pinSpacing: false 
});

// Animate the new panel from y=100% (offscreen) to y=0
// only if it's not the first one
if (i > 0) {
gsap.fromTo(panel,
    { yPercent: 80 },
    {
    yPercent: 0,
    scrollTrigger: {
        trigger: panel,
        start: "top bottom",
        end: "top top",
        scrub: true
    }
    }
);
}
});