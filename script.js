/* ============================================================
   Shaswot Gautam — portfolio
   Vanilla JS. Menu, scrollspy, reveals, theme, palette,
   filters, lightbox, tilt, count-ups, shortcuts, easter egg.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EMAIL = 'mrgautam2026@gmail.com';

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (_) { /* old browser, oh well */ }
    document.body.removeChild(ta);
  }

  function copyEmail() {
    const done = () => showToast('Email copied — talk soon.');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(() => fallbackCopy(EMAIL, done));
    } else {
      fallbackCopy(EMAIL, done);
    }
  }

  /* ============================================================
     1. THEME — light/dark, persisted, system-aware, no flash
     ============================================================ */
  const themeBtn = document.getElementById('themeToggle');
  const THEME_KEY = 'portfolio_theme';

  function applyTheme(theme, announce) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) { /* private mode */ }
    if (themeBtn) themeBtn.setAttribute('aria-label', 'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#faf7f2' : '#0c0c0e');
    if (announce) showToast(theme === 'light' ? '☀ Light mode' : '☾ Dark mode');
  }

  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
    const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(theme, false);
  })();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next, true);
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  function setMenu(open) {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }

  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Nav state + progress bar + back-to-top ---------- */
  const nav = document.querySelector('.nav');
  const progress = document.getElementById('scrollProgress');
  const fabBtn = document.getElementById('toTopFab');
  let lastY = -1;
  function paintScrollState() {
    const y = window.scrollY;
    if (y === lastY) return; // nothing changed — skip the style writes
    lastY = y;
    nav.classList.toggle('scrolled', y > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    if (fabBtn) fabBtn.classList.toggle('show', y > 600);
  }
  // scroll events cover real browsers; the guarded poll catches embeds that
  // swallow scroll events, and scroll restoration on load
  window.addEventListener('scroll', paintScrollState, { passive: true });
  setInterval(paintScrollState, 250);
  paintScrollState();

  /* ---------- Scrollspy (nav + side dots share it) ---------- */
  const spyLinks = document.querySelectorAll('.nav-links a');
  const dotLinks = document.querySelectorAll('.side-dots a');
  const sections = [...document.querySelectorAll('main section[id]')];
  const SECTION_IDS = sections.map((s) => s.id); // for 1–6 shortcuts

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      spyLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === id));
      dotLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 0.06 + 's';
      revealObserver.observe(el);
    });
  }

  /* ============================================================
     2. HERO — word-by-word rise-in
     ============================================================ */
  (function heroWords() {
    const title = document.getElementById('heroTitle');
    if (!title || reducedMotion) return;

    // wrap each word (keep the <br> and <em> intact)
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3 && child.textContent.trim()) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.appendChild(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(title);

    const words = title.querySelectorAll('.w');
    words.forEach((w, i) => setTimeout(() => w.classList.add('in'), 120 + i * 90));
  })();

  /* ============================================================
     3. WORK FILTERS
     ============================================================ */
  (function workFilters() {
    const filterBar = document.getElementById('workFilters');
    const items = document.querySelectorAll('#workList .work-item');
    if (!filterBar || !items.length) return;

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.wf-btn');
      if (!btn) return;

      filterBar.querySelectorAll('.wf-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      const f = btn.dataset.filter;
      items.forEach((item) => {
        const show = f === 'all' || (item.dataset.tags || '').split(' ').includes(f);
        item.classList.toggle('hidden-by-filter', !show);
      });
    });
  })();

  /* ---------- Copy email button ---------- */
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const done = () => {
        copyBtn.textContent = 'Copied ✓';
        copyBtn.classList.add('done');
        showToast('Email copied — talk soon.');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('done');
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(done).catch(() => fallbackCopy(EMAIL, done));
      } else {
        fallbackCopy(EMAIL, done);
      }
    });
  }

  /* ============================================================
     4. SCREENSHOT LIGHTBOX
     ============================================================ */
  (function lightbox() {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbOpen = document.getElementById('lbOpen');
    if (!lb) return;

    function openLb(shot) {
      const img = shot.querySelector('img');
      const item = shot.closest('.work-item');
      const live = item.querySelector('.work-link');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = img.alt.split('—')[0].trim();
      if (live) lbOpen.href = live.href;
      lb.hidden = false;
      lb.classList.add('open'); // sync — rAF can be throttled in background tabs
      document.body.style.overflow = 'hidden';
    }

    function closeLb() {
      lb.classList.remove('open');
      setTimeout(() => { lb.hidden = true; }, 250);
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.work-shot').forEach((shot) => {
      shot.addEventListener('click', (e) => {
        // click on the frame itself opens the lightbox; the ⤢ hint is decorative
        e.preventDefault();
        openLb(shot);
      });
    });

    document.getElementById('lbClose').addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    window.__closeLightbox = closeLb; // Esc handler uses this
  })();

  /* ============================================================
     5. 3D TILT + SPOTLIGHT SHEEN on screenshots
     ============================================================ */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.work-item').forEach((item) => {
      const shot = item.querySelector('.work-shot');
      if (!shot) return;

      item.addEventListener('mousemove', (e) => {
        const r = shot.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        shot.style.setProperty('--spot-x', (px * 100) + '%');
        shot.style.setProperty('--spot-y', (py * 100) + '%');
        const tiltY = (px - 0.5) * 7;  // deg
        const tiltX = (0.5 - py) * 5;
        shot.style.transform = 'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-3px)';
      });

      item.addEventListener('mouseleave', () => {
        shot.style.transform = '';
      });
    });
  }

  /* ============================================================
     6. COUNT-UP FACTS (About)
     ============================================================ */
  (function countUps() {
    const row = document.getElementById('factsRow');
    if (!row) return;

    function animate(el) {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur = 1300;
      const t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }

    if (reducedMotion || !('IntersectionObserver' in window)) {
      row.querySelectorAll('.fact-num').forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '');
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.fact-num').forEach(animate);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    io.observe(row);
  })();

  /* ---------- Back-to-top fab ---------- */
  const fab = document.getElementById('toTopFab');
  if (fab) {
    fab.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     9. FORM DRAFT AUTOSAVE — never lose a typed brief
     ============================================================ */
  (function draftAutosave() {
    const briefForm = document.getElementById('briefForm');
    if (!briefForm) return;
    const KEY = 'brief_draft_v1';
    const fields = ['name', 'email', 'brief'];

    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) {}

    // restore only if the form is empty (don't clobber a fresh session)
    fields.forEach((f) => {
      const input = briefForm.elements[f];
      if (input && saved[f] && !input.value) input.value = saved[f];
    });

    let saveTimer = null;
    briefForm.addEventListener('input', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const data = {};
        fields.forEach((f) => { data[f] = briefForm.elements[f]?.value || ''; });
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
      }, 400);
    });

    // clear the draft after a successful send
    briefForm.addEventListener('submit', () => {
      setTimeout(() => { try { localStorage.removeItem(KEY); } catch (_) {} }, 4000);
    });
  })();

  /* ============================================================
     11. LOCAL AI ASSISTANT — zero APIs, zero backend.
     A tiny keyword engine that knows the portfolio. ~100 lines.
     ============================================================ */
  (function assistant() {
    const fab = document.getElementById('botFab');
    const panel = document.getElementById('botPanel');
    if (!fab || !panel) return;

    const log = document.getElementById('botLog');
    const input = document.getElementById('botInput');
    const send = document.getElementById('botSend');
    const close = document.getElementById('botClose');

    const a = (href, label) => '<a href="' + href + '" target="_blank" rel="noopener" style="color:var(--accent)">' + label + '</a>';
    const jump = (hash, label) => '<a href="' + hash + '" style="color:var(--accent)">' + label + '</a>';

    const appLink = (url) => a(url, url.split('//')[1]);
    const mail = a('mailto:' + EMAIL, EMAIL);

    const RULES = [
      { re: /\b(hi|hello|hey|yo|sup|namaste)\b/, a: () =>
        'Hey! 👋 Ask me about Shaswot\u2019s <b>projects</b>, <b>skills</b>, <b>journey</b>, pricing — or how to <b>hire</b> him.' },
      { re: /who are you|what are you|about (you|yourself)|your name/, a: () =>
        'I\u2019m a tiny assistant living entirely in this page — about a hundred lines of JavaScript, <b>no backend, no APIs</b>. I know everything on this site, so ask away.' },
      { re: /who (built|made|coded) (you|u)|how do you work/, a: () =>
        'Shaswot built me by hand — same as everything else here. No frameworks, no build step. ' + jump('#work', 'See what else he builds →') },
      { re: /\b(hire|freelance|available|open to|price|cost|rate|charge|budget|how much)\b/, a: () =>
        'He\u2019s <b>open to freelance work</b> — web apps, Android apps, automation, games. Fixed quote after one conversation, no hourly surprises; small tools usually start around a few hundred dollars. ' + mail },
      { re: /\b(projects?|portfolio|work|apps?|built|made|products?)\b/, a: () =>
        'Five products, all live right now: <b>StreamForge AI</b> (video reformatting), <b>ChatBlinker</b> (real-time chat), <b>MegaCalc</b> (calculator suite), <b>LanceFlow</b> (freelance time-tracking) and <b>creatorOS</b>. Which one should I introduce?' },
      { re: /streamforge|stream|video|reels|tiktok/, a: () =>
        '<b>StreamForge AI</b> takes one video upload and cuts it to the right format for YouTube, TikTok, Reels and LinkedIn — one click instead of five re-exports. Flask + AI, live at ' + appLink('https://streamforge-ai.onrender.com/') + '. There\u2019s a full ' + a('case-study-streamforge.html', 'case study') + ' too.' },
      { re: /chatblinker|chat(?!bot)|room|random chat/, a: () =>
        '<b>ChatBlinker</b> is a no-signup chat platform — public rooms, random 1-on-1 chat, private DMs. Real-time over WebSockets. Pick a name and try it: ' + appLink('https://chatblinker.onrender.com/') },
      { re: /megacalc|mega calc|calculator/, a: () =>
        '<b>MegaCalc</b> is a calculator suite that grew past one calculator: standard, scientific, unit converter, live graphing, history. Keyboard-first, vanilla JS + Canvas: ' + appLink('https://mega-calculator-zeta.vercel.app/') },
      { re: /lanceflow|lance|time.?track|invoice|freelance(r)? tool/, a: () =>
        '<b>LanceFlow</b> is time-tracking for people who invoice by the hour — clients, projects, a stopwatch that survives refresh, PDF invoices. Built because Shaswot needed it himself. Flask + SQLite: ' + appLink('https://lance-flow-rho.vercel.app/') },
      { re: /creatoros|creator os/, a: () =>
        '<b>creatorOS</b> is a workspace for creators — notes, ideas, planning in one place. React, on Vercel: ' + appLink('https://creatoros-ten-kappa.vercel.app') },
      { re: /\b(skills?|tech|stack|languages?|know|frameworks?)\b/, a: () =>
        'Languages: <b>Python, JavaScript, C, Java, SQL</b>. Web: Flask, Node.js, React, Tailwind. Data: SQLite, MongoDB. Learning: TypeScript, Next.js. The full stack list is in ' + jump('#about', 'About') + '.' },
      { re: /\b(contact|reach|email|mail|touch|message)\b/, a: () =>
        'Fastest way is the brief form down in ' + jump('#contact', 'Contact') + ' — it lands straight in his inbox. Or email directly: ' + mail + '. He replies within a day.' },
      { re: /\b(resume|cv)\b/, a: () =>
        'Here you go: ' + a('resume.pdf', 'resume.pdf') + ' — also linked in the contact section.' },
      { re: /journey|timeline|story|background|experience|started|learn/, a: () =>
        'Self-taught the long way: C and segfaults in 2023, CS50x + CS50P in 2024, first shipped apps in 2025, real-time and AI in 2026. The whole story is in ' + jump('#journey', 'the journey section') + '.' },
      { re: /theme|dark|light|night/, a: () =>
        'There\u2019s a sun/moon toggle at the top of the page — or just press <b>T</b>. Your choice is remembered.' },
      { re: /konami|secret|easter/, a: () =>
        '↑ ↑ ↓ ↓ ← → ← → B A — on the page, not in here. That\u2019s all I\u2019ll say. 🤫' },
      { re: /\b(thanks|thank you|great|awesome|nice|cool|love)\b/, a: () =>
        'Anytime! If a project idea comes to mind, ' + mail + ' is always open.' },
      { re: /\b(bye|goodbye|see ya|later)\b/, a: () =>
        'See you around — the inbox is always open. 👋' }
    ];

    function answer(q) {
      const t = ' ' + q.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ') + ' ';
      for (const r of RULES) {
        if (r.re.test(t)) return r.a();
      }
      return 'I\u2019m a tiny local bot — no servers behind me. I know Shaswot\u2019s <b>projects</b>, <b>skills</b>, <b>journey</b> and how to <b>hire</b> him. For anything else: ' + mail;
    }

    let typingEl = null;
    function thinking(on) {
      if (on) {
        typingEl = document.createElement('div');
        typingEl.className = 'bot-msg bot bot-typing';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(typingEl);
        log.scrollTop = log.scrollHeight;
      } else if (typingEl) {
        typingEl.remove(); typingEl = null;
      }
    }

    function addMsg(html, who) {
      const div = document.createElement('div');
      div.className = 'bot-msg ' + who;
      div.innerHTML = html;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    function setOpen(open) {
      panel.classList.toggle('open', open);
      if (open) {
        if (!panel.dataset.greeted) {
          panel.dataset.greeted = '1';
          setTimeout(() => addMsg('Hey! 👋 I\u2019m Shaswot\u2019s assistant — a tiny script with <b>no backend and no APIs</b>, running right here in your browser. Ask me about his <b>projects</b>, <b>skills</b>, <b>journey</b> — or how to <b>hire</b> him.', 'bot'), 280);
        }
        setTimeout(() => input.focus(), 160);
      }
    }

    fab.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
    close.addEventListener('click', () => setOpen(false));
    window.__openBot = () => setOpen(true);
    window.__closeBot = () => setOpen(false);

    function handleSend() {
      const q = input.value.trim();
      if (!q) return;
      input.value = '';
      addMsg(q.replace(/[<>&]/g, ''), 'user');
      thinking(true);
      setTimeout(() => {
        thinking(false);
        addMsg(answer(q), 'bot');
      }, 420 + Math.random() * 380);
    }
    send.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    panel.querySelectorAll('.bot-chip').forEach((chip) => {
      chip.addEventListener('click', () => { input.value = chip.textContent; handleSend(); });
    });
  })();

  /* ============================================================
     ⌘K COMMAND PALETTE (now with theme command)
     ============================================================ */
  const overlay = document.getElementById('cmdkOverlay');
  const cmdkInput = document.getElementById('cmdkInput');
  const cmdkList = document.getElementById('cmdkList');
  const OPENERS = [document.getElementById('cmdkOpen'), document.getElementById('cmdkOpenFooter')].filter(Boolean);

  function scrollOrJump(sel) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  const COMMANDS = [
    { label: 'Home', hint: 'go', ico: 'H', action: () => scrollOrJump('#home') },
    { label: 'Selected work', hint: 'go', ico: '01', action: () => scrollOrJump('#work') },
    { label: 'StreamForge AI', hint: 'app', ico: 'SF', action: () => window.open('https://streamforge-ai.onrender.com/', '_blank') },
    { label: 'ChatBlinker', hint: 'app', ico: 'CB', action: () => window.open('https://chatblinker.onrender.com/', '_blank') },
    { label: 'MegaCalc', hint: 'app', ico: 'MC', action: () => window.open('https://mega-calculator-zeta.vercel.app/', '_blank') },
    { label: 'LanceFlow', hint: 'app', ico: 'LF', action: () => window.open('https://lance-flow-rho.vercel.app/', '_blank') },
    { label: 'creatorOS', hint: 'app', ico: 'OS', action: () => window.open('https://creatoros-ten-kappa.vercel.app', '_blank') },
    { label: 'Services', hint: 'go', ico: '02', action: () => scrollOrJump('#services') },
    { label: 'Testimonials', hint: 'go', ico: '03', action: () => scrollOrJump('#testimonials') },
    { label: 'Journey', hint: 'go', ico: '04', action: () => scrollOrJump('#journey') },
    { label: 'Dev log', hint: 'read', ico: 'DL', action: () => scrollOrJump('#log') },
    { label: 'About', hint: 'go', ico: '06', action: () => scrollOrJump('#about') },
    { label: 'Contact', hint: 'go', ico: '07', action: () => scrollOrJump('#contact') },
    { label: 'Ask my assistant', hint: 'act', ico: '🤖', action: () => { if (window.__openBot) window.__openBot(); else scrollOrJump('#contact'); } },
    { label: 'Toggle light / dark theme', hint: 'act', ico: '◐', action: () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next, true);
      } },
    { label: 'StreamForge AI case study', hint: 'read', ico: 'CS', action: () => window.open('case-study-streamforge.html', '_blank') },
    { label: 'ChatBlinker case study', hint: 'read', ico: 'CS', action: () => window.open('case-study-chatblinker.html', '_blank') },
    { label: 'MegaCalc case study', hint: 'read', ico: 'CS', action: () => window.open('case-study-megacalc.html', '_blank') },
    { label: 'LanceFlow case study', hint: 'read', ico: 'CS', action: () => window.open('case-study-lanceflow.html', '_blank') },
    { label: 'Download résumé (PDF)', hint: 'doc', ico: 'CV', action: () => window.open('resume.pdf', '_blank') },
    { label: 'Add me to contacts (vCard)', hint: 'act', ico: 'vC', action: () => {
        const link = document.createElement('a');
        link.href = 'shaswot-gautam.vcf';
        link.download = 'shaswot-gautam.vcf';
        link.click();
        showToast('Contact card downloading — see you in your address book.');
      } },
    { label: 'Copy email', hint: 'act', ico: '@', action: copyEmail },
    { label: 'GitHub ↗', hint: 'ext', ico: 'GH', action: () => window.open('https://github.com/mrshasxx1', '_blank') },
    { label: 'LinkedIn ↗', hint: 'ext', ico: 'in', action: () => window.open('https://www.linkedin.com/in/mr-shashwat-84a60b40b/', '_blank') },
    { label: 'Keyboard shortcuts', hint: '?', ico: '⌨', action: () => setKbModal(true) }
  ];

  let cmdkOpen = false, cmdkSel = 0, cmdkItems = [];

  // accent-insensitive search: "resume" finds "résumé"
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function renderCmdk(query) {
    const q = norm(query || '').trim();
    cmdkItems = COMMANDS.filter((c) => !q || norm(c.label).includes(q));
    cmdkSel = 0;
    if (!cmdkItems.length) {
      cmdkList.innerHTML = '<li class="cmdk-empty">Nothing matches "' + query.replace(/[<>&]/g, '') + '" — try "work" or "email".</li>';
      return;
    }
    cmdkList.innerHTML = cmdkItems.map((c, i) =>
      '<li class="cmdk-item' + (i === 0 ? ' sel' : '') + '" data-i="' + i + '" role="option">' +
        '<span class="cmdk-ico" aria-hidden="true">' + c.ico + '</span>' +
        '<span>' + c.label + '</span>' +
        '<span class="cmdk-hint">' + c.hint + '</span>' +
      '</li>'
    ).join('');
  }

  function paintSel() {
    cmdkList.querySelectorAll('.cmdk-item').forEach((el, i) => {
      el.classList.toggle('sel', i === cmdkSel);
      if (i === cmdkSel) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function setPalette(open) {
    cmdkOpen = open;
    overlay.hidden = false;
    overlay.classList.toggle('open', open);
    if (open) {
      cmdkInput.value = '';
      renderCmdk('');
      setTimeout(() => cmdkInput.focus(), 30);
    } else {
      setTimeout(() => { if (!cmdkOpen) overlay.hidden = true; }, 220);
    }
  }

  OPENERS.forEach((btn) => btn.addEventListener('click', () => setPalette(true)));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) setPalette(false); });
  cmdkInput.addEventListener('input', () => renderCmdk(cmdkInput.value));

  cmdkList.addEventListener('click', (e) => {
    const li = e.target.closest('.cmdk-item');
    if (!li) return;
    setPalette(false);
    cmdkItems[+li.dataset.i].action();
  });

  /* ============================================================
     8. KEYBOARD SHORTCUTS MODAL (?) + global keys
     ============================================================ */
  const kbOverlay = document.getElementById('kbOverlay');

  function setKbModal(open) {
    kbOverlay.hidden = false;
    kbOverlay.classList.toggle('open', open);
    if (!open) setTimeout(() => { if (!kbOverlay.classList.contains('open')) kbOverlay.hidden = true; }, 220);
  }

  document.getElementById('kbClose').addEventListener('click', () => setKbModal(false));
  kbOverlay.addEventListener('click', (e) => { if (e.target === kbOverlay) setKbModal(false); });

  /* ============================================================
     10. KONAMI CODE → CONFETTI
     ============================================================ */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;

  function fireConfetti() {
    const canvas = document.getElementById('confetti');
    canvas.classList.add('on');
    canvas.width = innerWidth; canvas.height = innerHeight;
    const ctx = canvas.getContext('2d');
    const colors = ['#ff6a2b', '#ffb347', '#f2f1ee', '#3ecf8e', '#7b5cff'];
    const parts = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      vy: 2.2 + Math.random() * 3.2,
      vx: -1.4 + Math.random() * 2.8,
      rot: Math.random() * Math.PI,
      vr: -0.12 + Math.random() * 0.24,
      color: colors[(Math.random() * colors.length) | 0]
    }));
    const t0 = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t - t0 < 3800) requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.classList.remove('on'); }
    })(t0);
    showToast('🎉 You found it. Now hire me.');
  }

  /* ---------- Global keydown: palette, shortcuts, Esc, 1–6, T, ? ---------- */
  document.addEventListener('keydown', (e) => {
    // Konami (tracked everywhere except inside inputs)
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName || '');
    if (!typing) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konamiIdx = key === KONAMI[konamiIdx] ? konamiIdx + 1 : (key === KONAMI[0] ? 1 : 0);
      if (konamiIdx === KONAMI.length) { konamiIdx = 0; fireConfetti(); }
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setPalette(!cmdkOpen);
      return;
    }
    if (!cmdkOpen) {
      if (e.key === 'Escape') {
        if (!kbOverlay.hidden) { setKbModal(false); return; }
        if (window.__closeLightbox && !document.getElementById('lightbox').hidden) { window.__closeLightbox(); return; }
        if (window.__closeBot) window.__closeBot();
        setMenu(false);
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'T' || e.key === 't') {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next, true);
        return;
      }
      if (e.key === '?') { setKbModal(true); return; }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= SECTION_IDS.length) { scrollOrJump('#' + SECTION_IDS[n - 1]); return; }
      return;
    }
    // palette keys
    if (e.key === 'Escape') { setPalette(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); cmdkSel = Math.min(cmdkSel + 1, cmdkItems.length - 1); paintSel(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdkSel = Math.max(cmdkSel - 1, 0); paintSel(); }
    else if (e.key === 'Enter' && cmdkItems[cmdkSel]) {
      e.preventDefault();
      const fn = cmdkItems[cmdkSel].action;
      setPalette(false);
      fn();
    }
  });

  /* ============================================================
     7. QUICK-BRIEF FORM → real email via FormSubmit
     ============================================================ */
  const briefForm = document.getElementById('briefForm');
  const sendBtn = document.getElementById('sendBtn');
  const formNote = document.getElementById('formNote');
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;

  function setSending(sending) {
    if (!sendBtn) return;
    sendBtn.disabled = sending;
    const label = sendBtn.querySelector('.send-label');
    if (label) label.textContent = sending ? 'Sending…' : 'Send brief';
  }

  function formFail() {
    setSending(false);
    if (formNote) formNote.textContent = 'Couldn\'t send automatically — opening your email app instead.';
    showToast('⚠ Email client opening as backup…');
    const data = briefForm ? new FormData(briefForm) : new FormData();
    const subject = 'Project brief from ' + (data.get('name') || 'the portfolio');
    const body = (data.get('brief') || '') + '\n\n— ' + (data.get('name') || '') + '\n' + (data.get('email') || '');
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  if (briefForm && sendBtn) {
    briefForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!briefForm.checkValidity()) { briefForm.reportValidity(); return; }

      const data = new FormData(briefForm);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const brief = (data.get('brief') || '').toString().trim();

      setSending(true);
      if (formNote) formNote.textContent = 'Lands straight in my inbox — I usually reply within a day.';

      // give up after 15s — a hung network must never leave the button stuck
      const controller = new AbortController();
      const kill = setTimeout(() => controller.abort(), 15000);

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: '🎯 New project brief from ' + name,
          name: name,
          email: email,
          message: brief,
          _template: 'box',
          _captcha: 'false'
        })
      })
        .then((res) => {
          clearTimeout(kill);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(() => {
          setSending(false);
          briefForm.reset();
          try { localStorage.removeItem('brief_draft_v1'); } catch (_) {}
          if (formNote) formNote.textContent = 'Sent — it\'s in my inbox. Talk soon!';
          showToast('✓ Brief sent — talk soon!');
        })
        .catch((err) => { clearTimeout(kill); formFail(); });
    });
  }

  /* ---------- Custom cursor (desktop pointers only) ---------- */
  if (finePointer && !reducedMotion) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
    }, { passive: true });

    (function ringLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      const half = ring.offsetWidth / 2;
      ring.style.transform = 'translate(' + (rx - half) + 'px,' + (ry - half) + 'px)';
      requestAnimationFrame(ringLoop);
    })();

    document.querySelectorAll('a, button, [data-magnetic], details').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + dx * strength + 'px,' + dy * strength + 'px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- PWA: register service worker (offline + installable) ---------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* dev server — fine */ });
  }

  /* ---------- console easter egg for the curious ---------- */
  console.log(
    '%c👋 Looking under the hood? Good sign.',
    'font:600 16px Georgia, serif; color:#ff6a2b;'
  );
  console.log(
    '%cThis site is hand-built — no frameworks, no build step.\nTry the Konami code, or just email me: mrgautam2026@gmail.com',
    'font:12px monospace; color:#9b9aa3;'
  );
});
