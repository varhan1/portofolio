/**
 * Main Application — Portfolio Interactions
 * Handles all UI interactions, animations, and non-Three.js logic
 */
import './style.css';
import { initHeroScene } from './three-scene.js';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  initNavbar();
  initTypingAnimation();
  initScrollReveal();
  initStatCounters();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initCertificateFilters();
});

// ===== THREE.JS SCENE =====
function initThreeScene() {
  try {
    initHeroScene();
  } catch (error) {
    console.warn('Three.js initialization failed:', error);
    const canvas = document.getElementById('hero-canvas');
    if (canvas) canvas.style.display = 'none';
  }
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Create overlay for mobile menu
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  // Scroll state
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Toggle scrolled class
        if (scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Active section detection
        let currentSection = '';
        sections.forEach((section) => {
          const sectionTop = section.offsetTop - 120;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
          }
        });

        lastScrollY = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial call

  // Mobile menu toggle
  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    overlay.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    overlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typingElement.textContent = 'Frontend Developer';
    return;
  }

  const titles = [
    'Frontend Developer',
    'Mobile App Developer',
    'Web Developer',
    'UI Enthusiast',
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isPaused) {
      setTimeout(type, 100);
      return;
    }

    if (!isDeleting) {
      // Typing
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentTitle.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, 2200);
        return;
      }

      setTimeout(type, 70 + Math.random() * 40);
    } else {
      // Deleting
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(type, 500);
        return;
      }

      setTimeout(type, 35);
    }
  }

  // Start typing after hero animations complete
  setTimeout(type, 1800);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach((el) => observer.observe(el));
}

// ===== STAT COUNTERS =====
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => observer.observe(stat));
}

function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-count'));
  const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = eased * target;

    element.textContent = currentValue.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name');
    const email = form.querySelector('#form-email');
    const subject = form.querySelector('#form-subject');
    const message = form.querySelector('#form-message');

    let isValid = true;

    // Validate name
    if (!name.value.trim()) {
      showError(name, 'error-name', 'Please enter your name.');
      isValid = false;
    } else {
      clearError(name, 'error-name');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'error-email', 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'error-email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(email, 'error-email');
    }

    // Validate subject
    if (!subject.value.trim()) {
      showError(subject, 'error-subject', 'Please enter a subject.');
      isValid = false;
    } else {
      clearError(subject, 'error-subject');
    }

    // Validate message
    if (!message.value.trim()) {
      showError(message, 'error-message', 'Please enter your message.');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, 'error-message', 'Message must be at least 10 characters.');
      isValid = false;
    } else {
      clearError(message, 'error-message');
    }

    if (isValid) {
      // Show demo alert — no backend connected
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Message Noted!
      `;
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.pointerEvents = '';
        submitBtn.style.opacity = '';
        form.reset();
      }, 3000);
    }
  });

  // Clear errors on input
  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      const errorId = `error-${input.name}`;
      clearError(input, errorId);
    });
  });
}

function showError(input, errorId, message) {
  input.classList.add('error');
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearError(input, errorId) {
  input.classList.remove('error');
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FOOTER YEAR =====
function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ===== GALLERY FILTERS + LIGHTBOX =====
function initCertificateFilters() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbIssuer = document.getElementById('lightbox-issuer');
  const lbDate = document.getElementById('lightbox-date');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  if (!items.length) return;

  let visibleItems = [...items];
  let currentIndex = 0;

  // ── Filter ──
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      items.forEach((item, i) => {
        const cat = item.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        if (show) {
          item.classList.remove('cert-hidden');
          item.style.animationDelay = `${(i % 3) * 60}ms`;
          item.style.animation = 'none';
          void item.offsetWidth;
          item.style.animation = '';
        } else {
          item.classList.add('cert-hidden');
        }
      });

      visibleItems = [...items].filter(el => !el.classList.contains('cert-hidden'));
    });
  });

  // ── Open lightbox ──
  function openLightbox(item) {
    visibleItems = [...items].filter(el => !el.classList.contains('cert-hidden'));
    currentIndex = visibleItems.indexOf(item);
    loadIntoLightbox(item);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function loadIntoLightbox(item) {
    lbImg.src = item.getAttribute('data-img') || '';
    lbImg.alt = item.getAttribute('data-title') || '';
    lbTitle.textContent = item.getAttribute('data-title') || '';
    lbIssuer.textContent = item.getAttribute('data-issuer') || '';
    lbDate.textContent = item.getAttribute('data-date') || '';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    loadIntoLightbox(visibleItems[currentIndex]);
  }

  // Click on gallery item or zoom button
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      openLightbox(item);
    });
  });

  // Close
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Prev / Next
  if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}
