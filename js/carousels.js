// Improved carousels.js with better error handling and debugging
let currentImageIndex = 0;
let currentImageList = [];

function loadCarousels() {
    console.log('🔍 loadCarousels() called');
    
    try {
        // Check if eventsData is available
        if (!window.eventsData) {
            console.error('❌ eventsData not found on window object');
            console.log('Available on window:', Object.keys(window).filter(key => key.includes('event')));
            return;
        }

        const topics = window.eventsData;
        console.log('✅ Found eventsData with', topics.length, 'topics');

        const container = document.getElementById('carousel-container');
        if (!container) {
            console.error('❌ carousel-container element not found');
            return;
        }
        
        console.log('✅ Found carousel container');
        container.innerHTML = '';

        topics.forEach((topic, topicIndex) => {
            console.log(`Processing topic ${topicIndex + 1}:`, topic.topic);
            
            // Create Topic Section
            const topicSection = document.createElement('div');
            topicSection.className = 'topic-section';

            const topicTitle = document.createElement('h2');
            topicTitle.textContent = topic.topic;
            topicSection.appendChild(topicTitle);

            topic.events.forEach((event, eventIndex) => {
                console.log(`  Processing event ${eventIndex + 1}:`, event.name);
                
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
                    console.log(`    Creating carousel with ${event.images.length} images`);
                    
                    // Create Carousel Container
                    const carousel = document.createElement('div');
                    carousel.className = 'carousel';

                    event.images.forEach((imgSrc, imgIndex) => {
                        const imgElement = document.createElement('img');
                        imgElement.src = imgSrc;
                        imgElement.className = 'carousel-img';
                        imgElement.alt = `${event.name} - Image ${imgIndex + 1}`;
                        
                        // Add error handling for images
                        imgElement.onerror = function() {
                            console.warn(`⚠️ Failed to load image: ${imgSrc}`);
                            this.style.display = 'none';
                        };
                        
                        imgElement.onload = function() {
                            console.log(`✅ Loaded image: ${imgSrc}`);
                        };
                        
                        imgElement.onclick = () => expandImage(imgSrc, carousel);
                        carousel.appendChild(imgElement);
                    });

                    eventSection.appendChild(carousel);
                } else {
                    console.log('    No images for this event');
                    const noImagesText = document.createElement('p');
                    noImagesText.textContent = 'No hay imágenes disponibles para este evento.';
                    noImagesText.style.fontStyle = 'italic';
                    noImagesText.style.color = '#666';
                    eventSection.appendChild(noImagesText);
                }

                topicSection.appendChild(eventSection);
            });

            container.appendChild(topicSection);
        });
        
        console.log('✅ Carousels loaded successfully');
        
    } catch (error) {
        console.error("❌ Error loading carousels:", error);
        console.error(error.stack);
    }
}

// Function to Expand Image in Modal
function expandImage(src, carouselElement) {
    console.log('🔍 Expanding image:', src);
    
    try {
        const modal = document.getElementById("image-modal");
        const modalImg = document.getElementById("expanded-img");

        if (!modal || !modalImg) {
            console.error('❌ Modal elements not found');
            return;
        }

        // Get all images from the current carousel
        const allImages = Array.from(carouselElement.querySelectorAll('.carousel-img'));
        currentImageList = allImages.map(img => img.src);
        currentImageIndex = currentImageList.indexOf(src);

        console.log(`Found ${currentImageList.length} images in carousel, current index: ${currentImageIndex}`);

        modal.style.display = "block";
        modalImg.src = src;

        // Setup close button
        const closeBtn = document.querySelector(".close");
        if (closeBtn) {
            closeBtn.onclick = function() {
                console.log('🔍 Closing modal');
                modal.style.display = "none";
            };
        }
        
    } catch (error) {
        console.error('❌ Error expanding image:', error);
    }
}

// Enhanced initialization
function initializeCarousels() {
    console.log('🔍 Initializing carousels...');
    
    // Wait for eventsData to be available
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkAndLoad = () => {
        attempts++;
        console.log(`Attempt ${attempts}: Checking for eventsData...`);
        
        if (window.eventsData) {
            console.log('✅ eventsData found, loading carousels');
            loadCarousels();
            setupModalNavigation();
        } else if (attempts < maxAttempts) {
            console.log('⏳ eventsData not ready, waiting...');
            setTimeout(checkAndLoad, 100);
        } else {
            console.error('❌ Timeout waiting for eventsData');
        }
    };
    
    checkAndLoad();
}

function setupModalNavigation() {
    console.log('🔍 Setting up modal navigation');
    
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    if (leftArrow && rightArrow) {
        console.log('✅ Found modal navigation arrows');
        
        leftArrow.addEventListener("click", () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                document.getElementById("expanded-img").src = currentImageList[currentImageIndex];
                console.log('◀ Previous image, index:', currentImageIndex);
            }
        });

        rightArrow.addEventListener("click", () => {
            if (currentImageIndex < currentImageList.length - 1) {
                currentImageIndex++;
                document.getElementById("expanded-img").src = currentImageList[currentImageIndex];
                console.log('▶ Next image, index:', currentImageIndex);
            }
        });
    } else {
        console.warn('⚠️ Modal navigation arrows not found');
    }
}

// Event Listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCarousels);
} else {
    // DOM already loaded
    initializeCarousels();
}

// Keyboard navigation for modal
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
        } else if (event.key === "Escape") {
            modal.style.display = "none";
        }
    }
});

// Make functions globally available for debugging
window.loadCarousels = loadCarousels;
window.expandImage = expandImage;