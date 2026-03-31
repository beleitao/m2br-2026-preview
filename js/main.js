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

// --- Motion preference ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// --- Hero logo fade on nav proximity ---
const heroLogo = document.querySelector('.hero-logo');
function updateHeroLogoFade() {
  if (!heroLogo || prefersReducedMotion) return;
  const top = heroLogo.getBoundingClientRect().top;
  if (top > 160) {
    heroLogo.style.opacity = '';
    heroLogo.style.transform = '';
  } else if (top < 60) {
    heroLogo.style.opacity = '0';
    heroLogo.style.transform = 'scale(0.92)';
  } else {
    const p = (top - 60) / 100;
    heroLogo.style.opacity = p;
    heroLogo.style.transform = `scale(${0.92 + p * 0.08})`;
  }
}

window.addEventListener('scroll', () => onScroll(() => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  updateHeroLogoFade();
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

// --- Filter System (Cases & Clients) ---
document.querySelectorAll('.filter-pills').forEach(pillGroup => {
  const targetId = pillGroup.getAttribute('data-filter-target');
  const container = document.getElementById(targetId);
  if (!container) return;

  // Determine attribute name based on section
  const isCases = targetId === 'cases-grid';
  const attr = isCases ? 'data-category' : 'data-segment';

  pillGroup.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;

    const filter = pill.getAttribute('data-filter');

    // Update active state
    pillGroup.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    // Filter items
    const items = container.querySelectorAll(`[${attr}]`);
    items.forEach(item => {
      const categories = item.getAttribute(attr) || '';
      if (filter === 'all' || categories === 'all' || categories.includes(filter)) {
        item.classList.remove('filter-hidden');
      } else {
        item.classList.add('filter-hidden');
      }
    });
  });
});

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
  const RED = { r: 227, g: 32, b: 44 };
  const accentTarget = { r: 227, g: 32, b: 44 };
  const accentCurrent = { r: 227, g: 32, b: 44 };

  window._setParticleAccent = function(r, g, b) {
    accentTarget.r = r; accentTarget.g = g; accentTarget.b = b;
  };

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
    // Lerp accent color
    accentCurrent.r += (accentTarget.r - accentCurrent.r) * 0.03;
    accentCurrent.g += (accentTarget.g - accentCurrent.g) * 0.03;
    accentCurrent.b += (accentTarget.b - accentCurrent.b) * 0.03;
    const AR = Math.round(accentCurrent.r), AG = Math.round(accentCurrent.g), AB = Math.round(accentCurrent.b);
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
            ctx.strokeStyle = `rgba(${AR},${AG},${AB},${opacity * 1.2})`;
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
        ctx.strokeStyle = `rgba(${AR},${AG},${AB},${opacity})`;
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
        ctx.fillStyle = `rgba(${AR},${AG},${AB},0.9)`;
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

// --- Hero Slider ---
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const nodes = document.querySelectorAll('.hero-timeline-node');
  if (slides.length < 2) return;

  let current = 0;
  let isTransitioning = false;
  let autoTimer = null;
  const AUTO_INTERVAL = 6000;

  function goToSlide(index) {
    if (index === current || isTransitioning) return;
    isTransitioning = true;

    const oldSlide = slides[current];
    const newSlide = slides[index];

    // Update timeline nodes
    nodes.forEach(n => {
      n.classList.remove('active');
      n.setAttribute('aria-current', 'false');
      // Reset ring animation
      const circle = n.querySelector('circle');
      if (circle) {
        circle.style.animation = 'none';
        circle.offsetHeight; // reflow
        circle.style.animation = '';
      }
    });

    // Exit current slide
    oldSlide.classList.add('exiting');

    // After exit animation, switch
    setTimeout(() => {
      oldSlide.classList.remove('active', 'exiting');
      oldSlide.setAttribute('aria-hidden', 'true');

      // Activate new slide
      newSlide.classList.add('active');
      newSlide.removeAttribute('aria-hidden');

      // Toggle dark-slide class for light mode timeline colors
      const heroEl = document.getElementById('home');
      if (newSlide.querySelector('.hero-slide-bg')) {
        heroEl.classList.add('hero--dark-slide');
      } else {
        heroEl.classList.remove('hero--dark-slide');
      }

      // Activate timeline node
      nodes[index].classList.add('active');
      nodes[index].setAttribute('aria-current', 'true');

      // Update particle accent color
      const accent = newSlide.getAttribute('data-accent');
      if (accent && window._setParticleAccent) {
        const [r, g, b] = accent.split(',').map(Number);
        window._setParticleAccent(r, g, b);
      }

      current = index;

      setTimeout(() => {
        isTransitioning = false;
      }, 800);
    }, 350);

    resetAutoProgress();
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function resetAutoProgress() {
    clearTimeout(autoTimer);
    // Restart ring animation on active node
    const activeNode = nodes[current] || nodes[0];
    const circle = activeNode.querySelector('circle');
    if (circle) {
      circle.style.animation = 'none';
      circle.offsetHeight;
      circle.style.animation = '';
    }
    autoTimer = setTimeout(nextSlide, AUTO_INTERVAL);
  }

  // Timeline node click
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const idx = parseInt(node.getAttribute('data-goto'));
      goToSlide(idx);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const hero = document.getElementById('home');
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToSlide((current + 1) % slides.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToSlide((current - 1 + slides.length) % slides.length);
    }
  });

  // Touch swipe
  let touchStartX = 0;
  const heroEl = document.getElementById('heroSlider');
  heroEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  heroEl.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goToSlide((current + 1) % slides.length);
      else goToSlide((current - 1 + slides.length) % slides.length);
    }
  }, { passive: true });

  // Pause on hover
  const heroSection = document.getElementById('home');
  heroSection.addEventListener('mouseenter', () => clearTimeout(autoTimer));
  heroSection.addEventListener('mouseleave', () => {
    autoTimer = setTimeout(nextSlide, AUTO_INTERVAL);
  });

  // Init: activate first node ring
  nodes[0].classList.add('active');
  nodes[0].setAttribute('aria-current', 'true');
  resetAutoProgress();
})();

// --- Contact Modal ---
(function () {
  const modal = document.getElementById('contactModal');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  if (!modal) return;

  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first input after animation
    setTimeout(() => {
      const first = modal.querySelector('.form-input');
      if (first) first.focus();
    }, 400);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
    // Reset form after close animation
    setTimeout(() => {
      if (form) {
        form.reset();
        form.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
        form.style.display = '';
      }
      if (success) success.hidden = true;
    }, 400);
  }

  // Open triggers
  document.querySelectorAll('[data-open-contact]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close triggers
  modal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Focus trap
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Form validation & submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(input => {
        input.classList.remove('error');
        if (!input.value.trim()) {
          input.classList.add('error');
          valid = false;
        }
        if (input.type === 'email' && input.value.trim()) {
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRe.test(input.value.trim())) {
            input.classList.add('error');
            valid = false;
          }
        }
      });

      if (!valid) {
        form.querySelector('.error')?.focus();
        return;
      }

      // Simulate sending (replace with real endpoint later)
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.querySelector('.form-submit-text').textContent = 'Enviando...';

      setTimeout(() => {
        form.style.display = 'none';
        success.hidden = false;
        submitBtn.disabled = false;
        submitBtn.querySelector('.form-submit-text').textContent = 'Enviar mensagem';
      }, 1200);
    });

    // Clear error on input
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => input.classList.remove('error'));
    });
  }
})();
