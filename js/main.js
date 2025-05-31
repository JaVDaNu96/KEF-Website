// Remove all previous code and start fresh
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card-container.landing .card');

  /* 1 — slide-in once when the card first appears */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .35 });

  cards.forEach(card => io.observe(card));

  /* 2 — give each card an ascending z-index so newer covers older */
  cards.forEach((card, i) => card.style.zIndex = i + 1);

  /* 3 — optional: hide shadows on buried cards to avoid halo */
  window.addEventListener('scroll', () => {
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const isParked = r.top <= 60 && r.bottom > 60;  // 64 px = top + padding
      card.style.boxShadow = isParked ? 'none' : '';  // remove halo while stacked
    });
  });
  // 2. IntersectionObserver to toggle the "in-view" class
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    root: null,               // viewport
    threshold: 0.6,           // fire when 10% visible
    rootMargin: '0px 0px -20% 0px' // shift trigger a bit upward
  });

  cards.forEach(card => observer.observe(card));
   cards.forEach((card, i) => {
    if (i > 0) {
      const style     = getComputedStyle(card);
      const topOffset = parseFloat(style.top);                    // in px
      const height    = card.getBoundingClientRect().height;     // in px
      card.style.marginTop = `${-height}px`;
    }
  });
});