/*==============================================================
    1. DOM ELEMENTS
==============================================================*/

const body = document.body;

const themeToggle = document.getElementById("themeToggle");

const themeIcon = document.querySelector(".theme-icon");

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.querySelector(".nav-links");

const navItems = document.querySelectorAll(".nav-links a");

/*==============================================================
    2. THEME MANAGEMENT
==============================================================*/

const STORAGE_KEY = "theme";

const DARK_THEME = "dark";

const LIGHT_THEME = "light";

function applyTheme(theme) {
  if (theme === LIGHT_THEME) {
    body.classList.add("light-theme");

    if (themeIcon) {
      themeIcon.textContent = "☀️";
    }
  } else {
    body.classList.remove("light-theme");

    if (themeIcon) {
      themeIcon.textContent = "🌙";
    }
  }
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

function getSavedTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

function initializeTheme() {
  const savedTheme = getSavedTheme();

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(DARK_THEME);

    saveTheme(DARK_THEME);
  }
}

function toggleTheme() {
  const isLight = body.classList.contains("light-theme");

  const nextTheme = isLight ? DARK_THEME : LIGHT_THEME;

  applyTheme(nextTheme);

  saveTheme(nextTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

/*
    Synchronize theme across tabs/windows.
    If the user changes the theme on another page,
    this page updates automatically.
*/

window.addEventListener("storage", function (event) {
  if (event.key === STORAGE_KEY) {
    applyTheme(event.newValue || DARK_THEME);
  }
});

initializeTheme();

/*==============================================================
    3. MOBILE NAVIGATION
==============================================================*/

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    menuToggle.classList.toggle("active");
  });
}

/* Close menu after clicking a navigation link */

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) {
      navLinks.classList.remove("active");
    }

    if (menuToggle) {
      menuToggle.classList.remove("active");
    }
  });
});

/* Close menu when clicking outside */

document.addEventListener("click", function (event) {
  if (!navLinks || !menuToggle) return;

  const clickedInsideNav = navLinks.contains(event.target);

  const clickedButton = menuToggle.contains(event.target);

  if (!clickedInsideNav && !clickedButton) {
    navLinks.classList.remove("active");

    menuToggle.classList.remove("active");
  }
});

/*==============================================================
    4. SMOOTH SCROLLING
==============================================================*/

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    const headerHeight = document.querySelector(".header")?.offsetHeight || 80;

    const targetPosition = target.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,

      behavior: "smooth",
    });
  });
});
/*==============================================================
    5. STICKY NAVBAR
==============================================================*/

const header = document.querySelector(".header");

function updateNavbar() {
  if (!header) return;

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

updateNavbar();

/*==============================================================
    6. SCROLL TO TOP BUTTON
==============================================================*/

const scrollTopBtn = document.getElementById("scrollTopBtn");

function updateScrollButton() {
  if (!scrollTopBtn) return;

  if (window.scrollY > 500) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
}

updateScrollButton();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  });
}

/*==============================================================
    7. REVEAL ON SCROLL
==============================================================*/

const revealElements = document.querySelectorAll(
  ".feature-card, \
     .preview-card, \
     .timeline-step, \
     .tech-badge, \
     .cta-container, \
     .footer-column, \
     .stat-card",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        revealObserver.unobserve(entry.target);
      }
    });
  },

  {
    threshold: 0.15,

    rootMargin: "0px 0px -60px 0px",
  },
);

revealElements.forEach((element) => {
  element.classList.add("reveal");

  revealObserver.observe(element);
});

/*==============================================================
    8. ACTIVE NAVIGATION
==============================================================*/

const sections = document.querySelectorAll("section");

function updateActiveNavigation() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (href && href.startsWith("#") && href.substring(1) === currentSection) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNavigation);

updateActiveNavigation();

/*==============================================================
    9. UTILITY FUNCTIONS
==============================================================*/

function debounce(callback, delay = 150) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function throttle(callback, limit = 100) {
  let waiting = false;

  return (...args) => {
    if (waiting) return;

    callback(...args);

    waiting = true;

    setTimeout(() => {
      waiting = false;
    }, limit);
  };
}

/*==============================================================
    WINDOW RESIZE
==============================================================*/

window.addEventListener(
  "resize",

  debounce(() => {
    if (window.innerWidth > 768 && navLinks) {
      navLinks.classList.remove("active");
    }

    if (menuToggle) {
      menuToggle.classList.remove("active");
    }
  }),
);

/*==============================================================
    PAGE VISIBILITY
==============================================================*/

document.addEventListener(
  "visibilitychange",

  () => {
    if (!document.hidden) {
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      if (savedTheme) {
        applyTheme(savedTheme);
      }
    }
  },
);

/*==============================================================
    10. LOAD EVENTS
==============================================================*/

window.addEventListener(
  "scroll",

  throttle(() => {
    updateNavbar();

    updateScrollButton();

    updateActiveNavigation();

    heroParallax();
  }, 100),

  { passive: true },
);

/*==============================================================
    11. INITIALIZATION
==============================================================*/

document.addEventListener(
  "DOMContentLoaded",

  () => {
    initializeTheme();

    updateNavbar();

    updateScrollButton();

    updateActiveNavigation();
  },
);
