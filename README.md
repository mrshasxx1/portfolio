# Shaswot Gautam — Portfolio

Personal developer portfolio. Dark neon theme, **pure HTML / CSS / vanilla JavaScript** —
no frameworks, no build step, no dependencies.

## Sections

- **Hero** — name, animated typewriter roles, photo with neon ring
- **Skills** — languages, frameworks, tools, currently learning
- **Work** — live projects: LanceFlow (time tracker), creatorOS & StreamForge AI (video processing)
- **Education** — Harvard CS50x, CS50P, CS50W
- **Contact** — email, GitHub, LinkedIn

## Run locally

```bash
python -m http.server 8080 --directory .
# open http://127.0.0.1:8080
```

## Customize

| File | What to edit |
| --- | --- |
| `photo.jpg` | Your picture (a 3:4 portrait works best in the circular frame) |
| `index.html` | Project cards, live links, email, socials (search for `✏️`) |
| `style.css` | Palette & theme tokens at the top (`:root`) |
| `script.js` | Typewriter roles list, animation behavior |

## Deploy

Static site — drop the folder into any host (Vercel, Netlify, GitHub Pages, etc.).
Vercel drag-and-drop works as-is.
