document.addEventListener("DOMContentLoaded", function () {
    const img = document.getElementById("animated-image");

    // Expand image on load
    img.onload = function () {
        img.classList.add("visible-image");
    };

    if (img.complete) {
        img.onload();
    }

    // Observe scrolling behavior
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    img.classList.add("visible-image"); // Expand
                } else {
                    img.classList.remove("visible-image"); // Shrink
                }
            });
        },
        { threshold: 0.3 } // Adjust threshold for when the effect triggers
    );

    observer.observe(img);
});