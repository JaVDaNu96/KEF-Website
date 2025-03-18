document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("courses-container");
    
    try {
        const response = await fetch("../data/cursos.json");
        const courses = await response.json();

        courses.forEach(course => {
            const card = document.createElement("div");
            card.className = `flip-card`;

            card.innerHTML = `
                <div class="flip-card-inner">
                    <!-- Front Side -->
                    <div class="flip-card-front ${course.category}">
                        <h3>${course.name}</h3>
                        <p>${course.date}</p>
                    </div>
                    
                    <!-- Back Side -->
                    <div class="flip-card-back ${course.category}">
                        <p>${course.description}</p>
                        ${
                            course.available 
                                ? `<a href="${course.link}" target="_blank" class="cta-button">Inscribirse</a>` 
                                : ""
                        }
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
});