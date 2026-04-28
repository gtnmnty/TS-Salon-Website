// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Gallery nav (simple toggle for demo)
const dots = document.querySelectorAll('.gallery-dot');
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    dots.forEach(d => d.style.background = '');
    dot.style.background = 'rgba(255,255,255,0.5)';
  });
});

// Cart button feedback
document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', function () {
    const orig = this.textContent;
    this.textContent = 'Added ✓';
    this.style.background = 'rgba(197,160,89,0.3)';
    this.style.color = '#C5A059';
    setTimeout(() => {
      this.textContent = orig;
      this.style.background = '';
      this.style.color = '';
    }, 1500);
  });
});