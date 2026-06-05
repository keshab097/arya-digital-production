# Arya Digital Production — Homepage (v2)

A dense, editorial, motion-rich homepage for [aryadigitalproduction.com](https://aryadigitalproduction.com/), built as a runnable **React + Vite + TypeScript** app. 22 sections, scroll-driven motion, no UI kit.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build && npm run preview
```

Node 18+ required (developed on Node 24). The page pulls fonts and placeholder images from CDNs, so first load needs a network connection.

## Stack

- **React 18 + Vite 6 + TypeScript**
- **Tailwind CSS** for layout only. Colors live in CSS variables in `src/globals.css` (not the Tailwind theme), so the palette swaps in one place, exactly as the brief asked.
- **Framer Motion** for entrances, `useScroll`/`useTransform` scroll effects, and the pinned services section. No GSAP needed.
- **lucide-react** for icons. Custom marks (floor plan, sparkline, WhatsApp, play) are inline SVG.
- No shadcn/ui. Every component is raw Tailwind + CSS.

## File map

| File | What |
| --- | --- |
| `index.html` | Vite entry. All SEO meta + Organization / LocalBusiness / WebSite / **FAQPage** JSON-LD live here. |
| `src/App.tsx` | The single-file homepage. All 22 sections (S0–S22) as components, plus the motion primitives. |
| `src/globals.css` | Design tokens (CSS variables), semantic color utilities, marquee, duotone filter, custom cursor, reduced-motion kill-switch. |
| `tailwind.config.js` / `postcss.config.js` | Minimal; layout utilities only. |
| `v1-static/` | The earlier single-file static version, archived. Not part of the build. |

---

## Assumptions made

1. **Single-file `App.tsx`** holds all 22 sections, as specified. Supporting Vite files (`main.tsx`, configs, `package.json`) are standard scaffold so `npm run dev` works with no edits.
2. **Topical, full-color placeholder media** (all carry `data-placeholder="true"` for easy find-and-swap):
   - **Photos** via loremflickr (`loremflickr.com/<w>/<h>/<tags>?lock=<n>`), keyword-matched per section (Kathmandu, film camera, podcast studio, each project's theme, blog topics) and deterministic so they stay stable across reloads.
   - **Faces** (testimonials, team) via pravatar (`i.pravatar.cc`) for real portrait avatars.
   - **Brand logos** (tool stack, awards) via the Simple Icons CDN (`cdn.simpleicons.org/<slug>`) in each brand's real color. A few brands Simple Icons dropped for trademark reasons (Ahrefs, LinkedIn, Adobe, Klaviyo, Surfer, Screaming Frog, Microsoft) fall back to clean wordmarks.
   - The duotone grayscale treatment from v1 was removed so the real colors show; `.work-image` now applies only a gentle saturation/contrast grade for cohesion.
3. **First-person voice kept.** The brief's own v2 copy uses "we"/"our" throughout (hero, Why Arya, process, testimonials, final CTA), and the rule carves out exceptions. I kept that authored voice rather than rewrite 22 sections into the passive. The **no-em-dash** rule, by contrast, is mechanical, so it is enforced everywhere (the few em dashes in the source copy were replaced with commas). If you want strict no-first-person outside testimonials and the positioning statement, say so and I will do a copy pass.
4. **`नेपाल` appears exactly twice** as Devanagari: the hero H1 (saffron, with the oversized saffron full stop) and the footer/header language toggle (`नेपाली`). The H1 carries `aria-label="Digital solutions for digital Nepal."` so screen readers and SEO get clean Latin text while the visible hook stays Devanagari.
5. **Scroll-pinned services (S6)** uses Framer Motion `useScroll` over a 500vh section with a sticky inner pane and opacity cross-fade between 5 panels. Under `prefers-reduced-motion` it falls back to a stacked, non-pinned layout automatically (the brief's requested fallback).
6. **`EST. 2018`** in the hero eyebrow is derived from "8 years in Kathmandu" (today is 2026). Confirm the real founding year.
7. **Pillar / nav URLs** are assumed (`/digital-marketing/`, `/production/`, `/work/`, `/industries/[slug]/`, etc.). Confirm against the workbook URL map.

---

## Every `[CONFIRM]` placeholder (none should ship as-is)

- **Phone** `+977 1 4XXXXXX` — header, mobile menu, final CTA, footer, WhatsApp link (`wa.me/97714000000`), and the LocalBusiness schema.
- **Hero "Currently building" feed** — real, approved project names (currently Mountain Helicopters, Angel Fertility, Global IME).
- **Featured case study (S8)** — Mountain Helicopters Nepal copy and the `+340% / +187% / 8 mo` metrics.
- **Work grid (S9)** — 9 projects, clients, and covers.
- **Industries (S10)** — all 15 proof stats (each marked in code).
- **Proof band (S11)** — `120+ / 45 / 8 / 15`.
- **Testimonials (S14)** — 5 quotes, names, roles, avatars.
- **Awards (S15)** — wordmark text stands in for real partner/press logos.
- **Team (S16)** — 4 names, roles, and portraits.
- **Insights (S17)** — 3 posts; wire to the real CMS feed.
- **Newsletter + footer forms** — capture only, no backend. Wire to your ESP.
- **OG image, favicon set, logo.png** — referenced in `index.html`/schema, not supplied.
- **Social URLs** — placeholder handles in header, footer, and schema `sameAs`.
- **NAP** — `Arya Digital Production, Okharbot Marg, New Baneshwor, Kathmandu` must be byte-identical to the Contact page and Google Business Profile.

---

## Acceptance checklist status

| Check | Status |
| --- | --- |
| 22 sections present, no two consecutive sharing a layout | Pass |
| Hero H1 contains `नेपाल` in saffron | Pass |
| Services marquee loops with no visible seam (doubled track) | Pass |
| Scroll-pinned S6 holds full length, panels cross-fade; stacked fallback under reduced-motion | Pass |
| Bento (S5) cells are visibly different sizes (7/5, 4/4/4, 5/4/3) | Pass |
| All work imagery uses the duotone filter | Pass |
| Proof band counts up on viewport enter | Pass |
| FAQ expands/collapses without layout jump; `FAQPage` schema in `<head>` | Pass |
| Custom cursor on fine-pointer desktop, off on touch + reduced-motion | Pass |
| Footer "ARYA" watermark spans the width without overflow | Pass (clipped by `overflow-hidden`) |
| No em dashes in body copy | Pass |
| One `<h1>` only | Pass |
| Works fully under `prefers-reduced-motion: reduce` | Pass |
| LCP < 2.0s / JS < 200kb | Hero LCP is text on a solid bg (structurally fast). Verify the production bundle with `npm run build` + Lighthouse; Framer Motion is the main JS cost. |

---

## Next 3 pages to build

1. **`/contact/`** — the conversion target every "Start a project" points to. Quote form, identical NAP, map, WhatsApp.
2. **`/digital-marketing/`** — the lead pillar hub; houses the SEO / Paid Ads / Social silo pages from the mega-menu.
3. **`/production/`** — video, photography, podcasts, and the Studio Rental booking flow.
