// DOM ELEMENTS
const root = document.documentElement;
const navbar = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobileMenu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('[data-link]');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const loader = document.getElementById('loader');
const revealEls = document.querySelectorAll('.reveal');
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

/* ========== LOADER ========== */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    navbar.classList.add('visible');
  }, 650);
});

/* ========== THEME TOGGLE ========== */
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  const icon = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.textContent = icon;
}

// Initialize theme from localStorage or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

/* ========== MOBILE MENU ========== */
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});

/* ========== SMART NAVBAR VISIBILITY ========== */
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
  const currentScrollY = window.scrollY;
  
  // Show navbar when scrolling up or near top
  if (currentScrollY < lastScrollY || currentScrollY < 120) {
    navbar.classList.add('visible');
  } else {
    navbar.classList.remove('visible');
  }
  
  lastScrollY = currentScrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateNavbar);
    ticking = true;
  }
  
  // Back to top button visibility
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

// Show navbar on mouse move near top
window.addEventListener('mousemove', (e) => {
  if (e.clientY < 80) {
    navbar.classList.add('visible');
  }
});

/* ========== BACK TO TOP ========== */
backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ========== REVEAL ON SCROLL ANIMATION ========== */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealEls.forEach(el => observer.observe(el));

/* ========== SMOOTH SCROLLING FOR ANCHOR LINKS ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Skip empty or just # hrefs
    if (href === '#' || href === '') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

/* ========== CONTACT FORM SUBMISSION ========== */
 form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent default form submission

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formMsg.textContent = "Thank you! Your message has been sent.";
        form.reset();
      } else {
        const data = await response.json();
        formMsg.textContent = data?.errors?.[0]?.message || "Oops! There was a problem.";
      }
    } catch (error) {
      formMsg.textContent = "Oops! There was a problem.";
    }
  });

/* ========== PERFORMANCE OPTIMIZATIONS ========== */

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
const handleResize = debounce(() => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 900 && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
}, 250);

window.addEventListener('resize', handleResize);

/* ========== ACCESSIBILITY ENHANCEMENTS ========== */

// Keyboard navigation for mobile menu
hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    hamburger.click();
  }
});

// Trap focus in mobile menu when open
mobileMenu.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }
});

// Add active state to current nav item based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section[id]');
  const scrollY = window.scrollY;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
        document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(a => {
          a.classList.remove('active');
        });
        link.classList.add('active');
      });
    }
  });
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

// Initialize on load
updateActiveNavLink();