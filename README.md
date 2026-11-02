# Ananda Bintang · One Night Only

Portfolio of Ananda Bintang Saputra, backend engineer from Sidoarjo. The site tells one night at a show in seven scenes: doors open, soundcheck, lineup, the road (experience), the photo pit (projects), backstage and the encore.

Live: https://ananda-bintang.netlify.app

## Stack

Plain HTML, CSS and JavaScript. No bundler; on Netlify the "build" only copies the site files into `dist/` (see `netlify.toml`).

- [GSAP](https://gsap.com) + ScrollTrigger for the scroll-driven scenes
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- Fonts: Archivo, IBM Plex Mono and Caveat from Google Fonts

## Run locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.

## Editing content

- **Projects** live in `content/projects.json` and **career history** in `content/experience.json`. Frames, filters, the project modal and the tour stops all build themselves from these files. A job with an empty `end` counts as the current one and fills the hero ("Backend Engineer Intern at …").
- **CMS**: open `/admin` on the live site to add, edit or remove projects and jobs from a form (Decap CMS). Each save is a commit to `master`, and Netlify redeploys. Screenshots uploaded there land in `assets/img/projects/`.
  - One-time setup: create a GitHub OAuth App (homepage `https://ananda-bintang.netlify.app`, callback `https://api.netlify.com/auth/done`), then add its client ID and secret in Netlify under Site configuration → Access & security → OAuth → GitHub.
  - Local editing without logging in: run `npx decap-server` next to the static server, then open http://localhost:5173/admin/.
- **Other copy** is in `index.html` (English) and the `ID` dictionary at the top of `assets/js/main.js` (Indonesian).
- **CV**: `Ananda_Bintang_Saputra_CV.pdf`, printed from https://github.com/AnandaBintang/curriculum-vitae.
- After changing CSS or JS, bump the `?v=` value on their links in `index.html` so browsers fetch the new files.

## Credits

Music: "Chill Wave" by Kevin MacLeod (incompetech.com), licensed under [Creative Commons: By Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
