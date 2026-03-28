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

// --- Scroll throttle utility ---
let ticking = false;
function onScroll(callback) {
  if (!ticking) {
    requestAnimationFrame(() => { callback(); ticking = false; });
    ticking = true;
  }
}

// --- Navbar scroll effect ---
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => onScroll(() => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}));

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

window.addEventListener('scroll', () => onScroll(updateActiveLink));

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

// --- Hero Particle Network ---
(function () {
  const canvas = document.getElementById('heroParticles');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles, animId;
  const mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT_BASE = 100;
  const CONNECTION_DIST = 170;
  const MOUSE_RADIUS = 220;
  const RED = { r: 227, g: 31, b: 43 };

  function isLightMode() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    const isMobile = width < 768;
    const base = isMobile ? 30 : PARTICLE_COUNT_BASE;
    const count = Math.floor(base * (width / 1400));
    particles = [];
    for (let i = 0; i < Math.max(count, isMobile ? 20 : 35); i++) {
      const isAccent = Math.random() < 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: isAccent ? Math.random() * 2.5 + 1.5 : Math.random() * 1.5 + 0.5,
        accent: isAccent,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const light = isLightMode();
    const baseR = light ? 0 : 255;
    const baseG = light ? 0 : 255;
    const baseB = light ? 0 : 255;

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.35;
          const bothAccent = particles[i].accent || particles[j].accent;

          if (bothAccent) {
            ctx.strokeStyle = `rgba(${RED.r},${RED.g},${RED.b},${opacity * 1.2})`;
          } else {
            ctx.strokeStyle = `rgba(${baseR},${baseG},${baseB},${opacity})`;
          }
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Mouse connections
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < MOUSE_RADIUS) {
        const opacity = (1 - mDist / MOUSE_RADIUS) * 0.5;
        ctx.strokeStyle = `rgba(${RED.r},${RED.g},${RED.b},${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // Draw particles
    for (const p of particles) {
      // Mouse attraction
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < MOUSE_RADIUS && mDist > 1) {
        const force = (MOUSE_RADIUS - mDist) / MOUSE_RADIUS * 0.02;
        p.vx -= (mdx / mDist) * force;
        p.vy -= (mdy / mDist) * force;
      }

      // Damping
      p.vx *= 0.998;
      p.vy *= 0.998;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > height) { p.y = height; p.vy *= -1; }

      // Draw dot
      if (p.accent) {
        ctx.fillStyle = `rgba(${RED.r},${RED.g},${RED.b},0.9)`;
      } else {
        const dotOpacity = light ? 0.25 : 0.45;
        ctx.fillStyle = `rgba(${baseR},${baseG},${baseB},${dotOpacity})`;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (heroVisible) {
      animId = requestAnimationFrame(draw);
    } else {
      animId = null;
    }
  }

  // Mouse tracking relative to hero section (canvas has pointer-events: none)
  const heroEl = canvas.parentElement;
  heroEl.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroEl.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Pause animation when hero not visible
  const heroSection = document.getElementById('home');
  let heroVisible = true;

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      heroVisible = entry.isIntersecting;
      if (heroVisible && !animId) animId = requestAnimationFrame(draw);
    });
  }, { threshold: 0 });

  function init() {
    resize();
    createParticles();
    heroObserver.observe(heroSection);
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  init();
})();
