/* ============================================================
   SHASWOT GAUTAM — PORTFOLIO SCRIPTS
   Vanilla JS only. No frameworks.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu when a nav link is tapped
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Navbar shadow on scroll + scroll progress bar ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function updateChrome() {
    const y = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;

    navbar.classList.toggle('scrolled', y > 10);
    scrollProgress.style.width = progress + '%';
    backToTop.classList.toggle('show', y > 400);
  }

  /* ---------- Fade-in fallback: guarantee every reveal triggers ----------
     IntersectionObserver only reports states at update time, so a fast
     scroll (wheel flick, PageDown, keyboard) can skip elements. This
     passive fallback force-reveals anything that enters — or passes —
     the viewport, so nothing ever stays hidden. */
  const pendingReveals = new Set(document.querySelectorAll('.reveal'));
  let revealTick = false;
  function forceReveals() {
    revealTick = false;
    [...pendingReveals].forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight - 40) {
        el.classList.add('visible');
        pendingReveals.delete(el);
      }
    });
  }
  function scheduleReveals() {
    if (revealTick || pendingReveals.size === 0) return;
    revealTick = true;
    requestAnimationFrame(forceReveals);
  }

  window.addEventListener('scroll', () => { updateChrome(); scheduleReveals(); }, { passive: true });
  updateChrome();
  // Defer the first reveal pass until after the first paint so the hero's
  // fade-in transition actually plays instead of loading already-visible.
  requestAnimationFrame(() => requestAnimationFrame(forceReveals));

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scrollspy: highlight the nav link of the section in view ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' } // fires when a section crosses mid-viewport
  );
  sections.forEach((section) => spyObserver.observe(section));

  /* ---------- Fade-in on scroll (staggered) ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          pendingReveals.delete(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  let revealIndex = 0;
  pendingReveals.forEach((el) => {
    // Subtle stagger: later elements animate slightly later
    el.style.transitionDelay = (revealIndex++ % 4) * 0.08 + 's';
    revealObserver.observe(el);
  });

  /* ---------- Typewriter effect for the role line ---------- */
  const roles = [
    'Full-Stack Software Engineer',
    'App Developer',
    'Game Developer',
    'Problem Solver',
  ];
  const typewriterEl = document.getElementById('typewriter');

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = roles[roleIndex];

    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typewriterEl.textContent = current.slice(0, charIndex);

    let delay = deleting ? 40 : 80;

    if (!deleting && charIndex === current.length) {
      delay = 1600; // pause when the full word is shown
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
