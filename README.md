# Shaswot Gautam — Portfolio

Personal developer portfolio. Dark "aurora terminal" theme, **pure HTML / CSS / vanilla JavaScript** —
no frameworks, no build step, no dependencies.

## Sections

- **Hero** — availability badge, animated typewriter roles, count-up stats, photo with a rotating neon ring and orbiting tech chips
- **Skills** — languages, frameworks, tools, currently learning
- **Work** — live projects: **StreamForge AI** (AI video processing, live on Render), LanceFlow (freelance time tracker) & creatorOS
- **Education** — Harvard CS50x, CS50P, CS50W
- **Contact** — email with one-click copy, GitHub, LinkedIn

Extras: cursor glow, scroll progress bar, scrollspy nav, back-to-top, marquee tech strip, 3D card tilt, reduced-motion support.

## Run locally

```bash
python -m http.server 8080 --directory .
# open http://127.0.0.1:8080
```

## Customize

| File | What to edit |
| --- | --- |
| `photo.jpg` | Your picture (a 3:4 portrait works best in the circular frame) |
| `index.html` | Project cards, live links, email, socials |
| `style.css` | Palette & theme tokens at the top (`:root`) |
| `script.js` | Typewriter roles, stats, animation behavior |

## Deploy

Static site — drop the folder into any host (Vercel, Netlify, GitHub Pages, etc.).
This repo is linked to Vercel, so pushing to `main` deploys automatically.
