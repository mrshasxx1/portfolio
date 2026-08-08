/* ============================================================
   SHASWOT GAUTAM — PORTFOLIO SCRIPTS
   Vanilla JS only. No frameworks.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---------- Fade-in fallback: guarantee every reveal triggers ---------- */
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
    { rootMargin: '-45% 0px -50% 0px' }
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
      delay = 1600;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();

  /* ---------- Cursor glow (fine pointers only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (finePointer && !reducedMotion && cursorGlow) {
    let glowX = -500, glowY = -500;
    let glowTick = false;

    document.body.classList.add('cursor-on');
    window.addEventListener('mousemove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
      if (glowTick) return;
      glowTick = true;
      requestAnimationFrame(() => {
        cursorGlow.style.transform = `translate(${glowX - 240}px, ${glowY - 240}px)`;
        glowTick = false;
      });
    }, { passive: true });
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll('.count');
  if (counters.length && !reducedMotion) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          countObserver.unobserve(el);
          const target = parseInt(el.dataset.count, 10) || 0;
          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => countObserver.observe(c));
  } else {
    counters.forEach((c) => {
      c.textContent = c.dataset.count;
    });
  }

  /* ---------- Copy email + toast ---------- */
  const copyBtn = document.getElementById('copyEmail');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'mrgautam2026@gmail.com';
      const done = () => showToast('📋 Email copied!');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(() => {
          // Fallback for older browsers / non-secure contexts
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (_) { /* ignore */ }
          document.body.removeChild(ta);
        });
      } else {
        showToast('Email: mrgautam2026@gmail.com');
      }
    });
  }

  /* ---------- Subtle 3D tilt on work cards (fine pointers only) ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.work-card').forEach((card) => {
      let raf = null;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 5;   // -2.5deg .. 2.5deg
        const ry = (px - 0.5) * 5;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
          card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        });
      });

      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
