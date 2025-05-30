// Clean production version of carousels.js
let currentImageIndex = 0;
let currentImageList = [];

function loadCarousels() {
    try {
        // Use the globally available eventsData instead of fetching
        const topics = window.eventsData;

        if (!topics) {
            console.error('Events data not found. Make sure eventsData.js is loaded.');
            return;
        }

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

                // Only create carousel if there are images
                if (event.images && event.images.length > 0) {
                    // Create Carousel Container
                    const carousel = document.createElement('div');
                    carousel.className = 'carousel';

                    event.images.forEach((imgSrc, imgIndex) => {
                        const imgElement = document.createElement('img');
                        imgElement.src = imgSrc;
                        imgElement.className = 'carousel-img';
                        imgElement.alt = `${event.name} - Image ${imgIndex + 1}`;
                        imgElement.onclick = () => expandImage(imgSrc, carousel);
                        carousel.appendChild(imgElement);
                    });

                    eventSection.appendChild(carousel);
                }

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

document.addEventListener("keydown", function (event) {
    const modal = document.getElementById("image-modal");
    if (modal.style.display === "block") {
        if (event.key === "ArrowLeft") {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                document.getElementById("expanded-img").src = currentImageList[currentImageIndex];
            }
        } else if (event.key === "ArrowRight") {
            if (currentImageIndex < currentImageList.length - 1) {
                currentImageIndex++;
                document.getElementById("expanded-img").src = currentImageList[currentImageIndex];
            }
        } else if (event.key === "Escape") {
            modal.style.display = "none";
        }
    }
});