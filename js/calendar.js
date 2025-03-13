// URL del archivo JSON de eventos
const eventsUrl = '/data/events.json';

// Función para cargar y organizar eventos en un objeto {Año -> Mes -> Eventos}
async function loadCalendar() {
    try {
        const response = await fetch(eventsUrl);
        const events = await response.json();

        const eventMap = {}; // { year: { month: [event1, event2] } }

        // Organizar eventos por año y mes
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const year = eventDate.getFullYear();
            const month = eventDate.toLocaleString('es-ES', { month: 'long' });

            if (!eventMap[year]) {
                eventMap[year] = {};
            }
            if (!eventMap[year][month]) {
                eventMap[year][month] = [];
            }
            eventMap[year][month].push(event);
        });

        renderCalendar(eventMap);
    } catch (error) {
        console.error("Error al cargar los eventos:", error);
    }
}

// Función para renderizar el calendario en la página
function renderCalendar(eventMap) {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Limpiar antes de renderizar

    // Crear botones de año
    Object.keys(eventMap).sort((a, b) => b - a).forEach(year => {
        const yearButton = document.createElement('button');
        yearButton.classList.add('year-button');
        yearButton.textContent = year;
        yearButton.addEventListener('click', () => toggleMonths(year, eventMap));

        const yearContainer = document.createElement('div');
        yearContainer.classList.add('year-container');
        yearContainer.appendChild(yearButton);

        const monthsContainer = document.createElement('div');
        monthsContainer.classList.add('months-container', 'hidden');
        monthsContainer.id = `months-${year}`;

        yearContainer.appendChild(monthsContainer);
        calendarGrid.appendChild(yearContainer);
    });
}

// Función para mostrar/ocultar meses de un año
function toggleMonths(year, eventMap) {
    const monthsContainer = document.getElementById(`months-${year}`);
    if (monthsContainer.classList.contains('hidden')) {
        monthsContainer.innerHTML = ''; // Resetear meses

        Object.keys(eventMap[year]).forEach(month => {
            const monthButton = document.createElement('button');
            monthButton.classList.add('month-button');
            monthButton.textContent = month;
            monthButton.addEventListener('click', () => toggleEvents(year, month, eventMap));

            const monthContainer = document.createElement('div');
            monthContainer.classList.add('month-container');

            const eventsContainer = document.createElement('div');
            eventsContainer.classList.add('events-container', 'hidden');
            eventsContainer.id = `events-${year}-${month}`;

            monthContainer.appendChild(monthButton);
            monthContainer.appendChild(eventsContainer);
            monthsContainer.appendChild(monthContainer);
        });

        monthsContainer.classList.remove('hidden');
    } else {
        monthsContainer.classList.add('hidden');
    }
}

// Función para mostrar eventos de un mes específico
function toggleEvents(year, month, eventMap) {
    const eventsContainer = document.getElementById(`events-${year}-${month}`);
    if (eventsContainer.classList.contains('hidden')) {
        eventsContainer.innerHTML = ''; // Resetear eventos

        eventMap[year][month].forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('calendar-event');
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es-ES')}</p>
                <p><strong>Ubicación:</strong> ${event.location}</p>
                <p>${event.description}</p>
            `;
            eventsContainer.appendChild(eventElement);
        });

        eventsContainer.classList.remove('hidden');
    } else {
        eventsContainer.classList.add('hidden');
    }
}

// Cargar el calendario cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadCalendar);