// URL del archivo JSON de eventos
const eventsUrl = '/assets/data/events.json';

// Función para cargar y mostrar los eventos en el calendario
async function loadCalendar() {
    try {
        const response = await fetch(eventsUrl);
        const events = await response.json();

        // Obtener el contenedor del calendario
        const calendarContainer = document.getElementById('calendar');
        calendarContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

        // Crear una lista de eventos ordenados por fecha
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'calendar-event';
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es-ES')}</p>
                <p><strong>Ubicación:</strong> ${event.location}</p>
                <p>${event.description}</p>
            `;

            calendarContainer.appendChild(eventElement);
        });
    } catch (error) {
        console.error("Error al cargar los eventos:", error);
    }
}

// Cargar los eventos al cargar la página
document.addEventListener('DOMContentLoaded', loadCalendar);
