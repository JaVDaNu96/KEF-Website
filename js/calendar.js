// URL del archivo JSON de eventos
const eventsUrl = '../data/events.json';

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
            // Usar un array de meses o extraer el mes a través de toLocaleString si se prefiere
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const month = monthNames[eventDate.getMonth()];

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

// Función para renderizar el calendario en la página en tres columnas
function renderCalendar(eventMap) {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    // Crear contenedores para las tres columnas
    const yearColumn = document.createElement('div');
    yearColumn.classList.add('year-column');
    const monthColumn = document.createElement('div');
    monthColumn.classList.add('month-column');
    const eventColumn = document.createElement('div');
    eventColumn.classList.add('event-column');

    // Agregar las columnas al contenedor principal
    calendarGrid.appendChild(yearColumn);
    calendarGrid.appendChild(monthColumn);
    calendarGrid.appendChild(eventColumn);

    // Crear botones de año en orden descendente
    Object.keys(eventMap).sort((a, b) => b - a).forEach(year => {
        const yearButton = document.createElement('button');
        yearButton.classList.add('year-button');
        yearButton.textContent = year;
        // Al hacer clic en un año, se rellena la columna de meses
        yearButton.addEventListener('click', () => {
            // Clear the month and event columns and remove the 'show' class
            monthColumn.innerHTML = '';
            eventColumn.innerHTML = '';
            monthColumn.classList.remove('show');
            eventColumn.classList.remove('show');
        
            // For each month in the selected year, create the month buttons
            Object.keys(eventMap[year]).forEach(month => {
                const monthButton = document.createElement('button');
                monthButton.classList.add('month-button');
                monthButton.textContent = month;
                // On mouse over, show events with a fade-in effect
                monthButton.addEventListener('mouseover', () => {
                    eventColumn.innerHTML = '';
                    eventColumn.classList.remove('show');
                    eventMap[year][month].forEach(event => {
                        const eventElement = document.createElement('div');
                        eventElement.classList.add('calendar-event');
                        eventElement.innerHTML = `
                            <h3>${event.title}</h3>
                            <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es-ES')}</p>
                            <p><strong>Ubicación:</strong> ${event.location}</p>
                            <p>${event.description}</p>
                        `;
                        eventColumn.appendChild(eventElement);
                    });
                    // Trigger reflow and then add the class to animate the opacity
                    void eventColumn.offsetWidth;
                    eventColumn.classList.add('show');
                });
                monthColumn.appendChild(monthButton);
            });
            // Trigger reflow and then add the class to animate the opacity
            void monthColumn.offsetWidth;
            monthColumn.classList.add('show');
        });
        yearColumn.appendChild(yearButton);
    });
}

// Cargar el calendario cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadCalendar);