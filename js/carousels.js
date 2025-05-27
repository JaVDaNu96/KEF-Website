// Try different path approaches
const eventscarouselUrl = '/data/eventscarousel.json'; // Changed to absolute path

let currentImageIndex = 0;
let currentImageList = [];

async function loadCarousels() {
    console.log('Starting to load carousels...');
    console.log('Attempting to fetch from:', eventscarouselUrl);
    
    try {
        const response = await fetch(eventscarouselUrl);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Fetch successful, response:', response);
        
        const topics = await response.json();
        console.log('JSON parsed successfully:', topics);

        const container = document.getElementById('carousel-container');
        if (!container) {
            console.error('carousel-container element not found!');
            return;
        }
        
        console.log('Container found:', container);
        container.innerHTML = '';

        if (!topics || !Array.isArray(topics)) {
            console.error('Invalid data format:', topics);
            return;
        }

        topics.forEach((topic, topicIndex) => {
            console.log(`Processing topic ${topicIndex}:`, topic);
            
            // Create Topic Section
            const topicSection = document.createElement('div');
            topicSection.className = 'topic-section';

            const topicTitle = document.createElement('h2');
            topicTitle.textContent = topic.topic;
            topicSection.appendChild(topicTitle);

            if (topic.events && Array.isArray(topic.events)) {
                topic.events.forEach((event, eventIndex) => {
                    console.log(`Processing event ${eventIndex}:`, event);
                    
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

                    if (event.images && Array.isArray(event.images)) {
                        event.images.forEach((imgSrc, imgIndex) => {
                            console.log(`Processing image ${imgIndex}:`, imgSrc);
                            
                            const imgElement = document.createElement('img');
                            imgElement.src = imgSrc;
                            imgElement.className = 'carousel-img';
                            imgElement.onclick = () => expandImage(imgSrc, carousel);
                            
                            // Add error handling for images
                            imgElement.onerror = () => {
                                console.error('Failed to load image:', imgSrc);
                            };
                            imgElement.onload = () => {
                                console.log('Image loaded successfully:', imgSrc);
                            };
                            
                            carousel.appendChild(imgElement);
                        });
                    } else {
                        console.warn('No images found for event:', event);
                    }

                    eventSection.appendChild(carousel);
                    topicSection.appendChild(eventSection);
                });
            } else {
                console.warn('No events found for topic:', topic);
            }

            container.appendChild(topicSection);
        });
        
        console.log('Carousel loading completed successfully');
        
    } catch (error) {
        console.error("Detailed error loading carousels:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        
        // Show user-friendly error message
        const container = document.getElementById('carousel-container');
        if (container) {
            container.innerHTML = '<p style="color: red; padding: 20px;">Error loading events. Please check the console for details.</p>';
        }
    }
}

// Function to Expand Image in Modal
function expandImage(src, carouselElement) {
    console.log('Expanding image:', src);
    
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("expanded-img");

    if (!modal || !modalImg) {
        console.error('Modal elements not found');
        return;
    }

    // Get all images from the current carousel
    const allImages = Array.from(carouselElement.querySelectorAll('.carousel-img'));
    currentImageList = allImages.map(img => img.src);
    currentImageIndex = currentImageList.indexOf(src);

    modal.style.display = "block";
    modalImg.src = src;

    const closeBtn = document.querySelector(".close");
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }
}

// Event Listeners for Modal Navigation
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - initializing carousels');
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
    } else {
        console.warn('Arrow navigation elements not found');
    }
});

document.addEventListener("keydown", function (event) {
    const modal = document.getElementById("image-modal");
    if (modal && modal.style.display === "block") {
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
        }
    }
});