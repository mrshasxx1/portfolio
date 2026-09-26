# Shaswot Gautam — Portfolio

Personal developer portfolio. **Pure HTML / CSS / vanilla JavaScript** — no frameworks,
no build step, no dependencies.

Design: a modern dark theme — near-black surfaces, a warm orange accent, Fraunces for
display type with italic accent moments, glass nav, film grain, and an infinite tech marquee.

## Advanced touches

- **⌘K command palette** — `⌘K` / `Ctrl+K` or the nav button; jump to sections, open any live app or case study, ask the assistant, copy email, download the résumé or vCard, toggle theme. Accent-insensitive search ("resume" finds "résumé"), arrow keys + Enter, Esc to close
- **AI portfolio assistant** — a tiny local chatbot (zero APIs, zero backend) that answers questions about projects, skills, the journey and hiring; opens from the floating 🤖 button or the ⌘K palette
- **Journey timeline** — 2023 → 2026 → "your project here", with an animated rail and hover nodes
- **Dev log** — three short build notes (Clip Kitchen, LanceFlow, MegaCalc) linking to the case study and live apps
- **Light / dark theme** — toggle button in the hero, `T` keyboard shortcut, palette command; persisted in `localStorage`, respects `prefers-color-scheme`, applied pre-paint (no flash)
- **Keyboard shortcuts** — `?` opens a shortcuts modal; `1`–`8` jump to sections; `Esc` closes anything
- **Work filters** — All / AI / Web apps / Tools tabs over the five projects
- **Screenshot lightbox** — click any project screenshot to view it large, with a link to the live app
- **3D tilt + spotlight** — screenshots tilt toward the cursor with a moving sheen (desktop only)
- **Count-up facts** — quick-stats row in About animates on first view
- **Hero word intro** — headline rises in word by word (skipped under reduced motion)
- **Custom cursor** — orange dot with a trailing ring that swells over interactive elements (desktop pointers only)
- **Magnetic buttons** — CTAs lean toward the cursor
- **Reading progress bar** — orange gradient across the top, driven by scroll
- **Side section dots** — fixed dot navigation with labels and scrollspy
- **Back-to-top button** — floating, appears after 600px of scroll
- **Form draft autosave** — a half-typed brief survives an accidental refresh
- **Konami code easter egg** — `↑↑↓↓←→←→BA` for confetti
- **Availability chip** — pulsing "Open to work" badge in the hero
- **PWA / offline** — `manifest.json` + `sw.js`: installable, works offline, instant repeat loads (service worker registers on https only)
- **Direct CV download** — `resume.pdf` (generated from `resume.html` via headless Chrome: `chrome --headless=new --no-pdf-header-footer --print-to-pdf=resume.pdf http://<host>/resume.html`; regenerate after editing the résumé)

## Sections

- **Hero** — big serif headline with an italic accent line, GitHub chip, call-to-actions, infinite tech marquee
- **Work** — five shipped projects with live screenshots (in `shots/`), status badges, and a full case study each (build, what broke first, learnings). The flagship (Clip Kitchen) started the format:
  - **Clip Kitchen** — AI video reformatting for every social platform (Render)
  - **ChatBlinker** — public chat rooms, random 1-on-1 chat, private DMs (Render)
  - **MegaCalc** — standard/scientific calculator suite with unit converter, graphing and history (Vercel)
  - **LanceFlow** — freelance time tracker with PDF invoicing (Vercel)
  - **creatorOS** — creator workspace (Vercel)
- **Services** — what Shaswot can build for clients: web apps, Android apps, automation, games — with an FAQ accordion
- **Testimonials** — client quotes (placeholder names — swap in real ones as they come)
- **Journey** — the self-taught timeline, 2023 to now, ending on an open "your project here" node
- **Dev log** — short posts from actually building things, each linking to the related project
- **About** — background, stack, Harvard CS50x / CS50P / CS50W + animated quick-facts row
- **Contact** — quick-brief form that **sends real email** via FormSubmit's free AJAX relay (activate once via the
  confirmation link FormSubmit emails you on first submission; until then it falls back to opening the visitor's email app),
  GitHub, LinkedIn, résumé
- **resume.html** — print-ready résumé; open with `#print` to trigger the print dialog (Save as PDF)

## Run locally

```bash
python -m http.server 8080
# open http://127.0.0.1:8080
```

## Customize

| File | What to edit |
| --- | --- |
| `index.html` | Project entries, copy, email, socials |
| `style.css` | Palette and fonts at the top (`:root`) |
| `script.js` | Menu, scrollspy, reveal, ⌘K palette, AI assistant, form |

## SEO / sharing

- `og-image.png` — 1200×630 social share card (regenerate with `_og.html` + headless Chrome if the design changes)
- `sitemap.xml`, `robots.txt`, `404.html`, JSON-LD Person schema, canonical + Open Graph/Twitter meta
- Update `https://shaswotgautam.dev/` in `sitemap.xml`, `robots.txt`, `index.html` (canonical/OG) if the domain changes

## Deploy

Static site — drop the folder into any host (Vercel, Netlify, GitHub Pages, etc.).
This repo is linked to Vercel, so pushing to `main` deploys automatically.
