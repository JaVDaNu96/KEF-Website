// Remove all previous code and start fresh
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    // Add animation class when in viewport and not previously animated
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate');
                        // Mark as animated
                        entry.target.setAttribute('data-animated', 'true');
                        // Stop observing this image
                        observer.unobserve(entry.target);
                    });
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: '50px'
        }
    );

    // Get all images and observe them
    const images = document.querySelectorAll('img');
    images.forEach(img => observer.observe(img));
});