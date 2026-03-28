/* ============================================
   M2BR 2026 - Main JavaScript
   ============================================ */

// --- Theme Toggle ---
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('m2br-theme');

if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  if (next === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', next);
  }
  localStorage.setItem('m2br-theme', next);
});

// --- Navbar scroll effect ---
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});

// Close nav on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    navToggle.focus();
  }
});

// --- Active nav link on scroll ---
const sections = document.querySelectorAll('section[id], .cta-section');
const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// --- Scroll reveal (fade-up animation) ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fadeElements = document.querySelectorAll('.fade-up');

if (prefersReducedMotion) {
  fadeElements.forEach(el => el.classList.add('visible'));
} else {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// --- Counter animation for numbers ---
function animateCounter(el) {
  const target = el.innerText;
  const isPercentage = target.includes('%');
  const isPlus = target.includes('+');
  const isMoney = target.includes('R$') || target.includes('M');

  // Only animate pure numbers
  const numMatch = target.match(/[\d,.]+/);
  if (!numMatch) return;

  const num = parseFloat(numMatch[0].replace(/\./g, '').replace(',', '.'));
  if (isNaN(num)) return;

  if (prefersReducedMotion) return;

  const duration = 1500;
  const start = performance.now();
  const prefix = target.match(/^[^\d]*/)[0];
  const suffix = target.match(/[^\d]*$/)[0];

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(num * eased);

    let formatted = current.toLocaleString('pt-BR');
    el.innerText = prefix + formatted + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.innerText = target; // Restore original
    }
  }

  requestAnimationFrame(step);
}

// Observe number elements
const numberElements = document.querySelectorAll('.number-value, .metric-value');
const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      numberObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

numberElements.forEach(el => numberObserver.observe(el));
