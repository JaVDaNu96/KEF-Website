const eventscarouselUrl = '../data/eventscarousel.json';

async function loadCarousels() {
    try {
        const response = await fetch(eventscarouselUrl);
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

// const coursesUrl = '../data/cursos.json';

// async function loadCourses() {
//     try {
//         const response = await fetch(coursesUrl);
//         const courses = await response.json();
//         const coursecontainer = document.getElementById("courses-container");
        
//         courses.forEach(course => {
//             const card = document.createElement("div");
//             card.className = `flip-card`;
//             card.innerHTML = `
//             <div class="flip-card-inner">
//             <!-- Front Side -->
//             <div class="flip-card-front ${course.category}">
//             <h3>${course.name}</h3>
//             <p>${course.date}</p>
//             </div>
            
//             <!-- Back Side -->
//             <div class="flip-card-back ${course.category}">
//             <p>${course.description}</p>
//             ${course.available ? `<a href="#" class="cta-button">Inscribirse</a>` : ""}
//             </div>
//             </div>
//             `;
            
//             coursecontainer.appendChild(card);
//         });
//     } catch (error) {
//         console.error("Error loading courses:", error);
//     }
// }