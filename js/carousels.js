const eventscarouselUrl = '../data/eventscarousel.json';

let currentImageIndex = 0;
let currentImageList = [];

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
                    imgElement.onclick = () => expandImage(imgSrc, carousel);
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
function expandImage(src, carouselElement) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("expanded-img");

    // Get all images from the current carousel
    const allImages = Array.from(carouselElement.querySelectorAll('.carousel-img'));
    currentImageList = allImages.map(img => img.src);
    currentImageIndex = currentImageList.indexOf(src);

    modal.style.display = "block";
    modalImg.src = src;

    document.querySelector(".close").onclick = function() {
        modal.style.display = "none";
    };
}

// Event Listeners for Modal Navigation
window.addEventListener('DOMContentLoaded', () => {
    loadCarousels();

    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    if (leftArrow && rightArrow) {
        leftArrow.addEventListener("click", () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                document.getElementById("expanded-img").src = currentImageList[currentImageIndex];
            }
        });

        rightArrow.addEventListener("click", () => {
            if (currentImageIndex < currentImageList.length - 1) {
                currentImageIndex++;
                document.getElementById("expanded-img").src = currentImageList[currentImageIndex];
            }
        });
    }
});
