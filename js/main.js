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
      const isParked = r.top <= 64 && r.bottom > 64;  // 64 px = top + padding
      card.style.boxShadow = isParked ? 'none' : '';  // remove halo while stacked
    });
  });
});