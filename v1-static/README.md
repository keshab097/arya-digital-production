# Arya Digital Production — Homepage (T01_HOME)

The locked homepage for [aryadigitalproduction.com](https://aryadigitalproduction.com/). Built as a single, self-contained file you can preview in any browser and ship to staging today.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The runnable homepage. Open it in a browser, no build step. All 14 sections, schema, and interactions are inline. |
| `tailwind.config.js` | Token + font registration, for when you compile Tailwind for production. |
| `globals.css` | The CSS variables and custom utilities, extracted for a compiled build. |
| `README.md` | This file. |

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 5173   # then visit http://localhost:5173
```

No install, no bundler. The page pulls Tailwind, Google Fonts, and placeholder images from CDNs, so it needs a network connection on first load.

---

## Assumptions made

These are the judgment calls I made where the brief left room or contradicted itself. Change any of them freely.

1. **Single `index.html`, not `page.tsx`.** The brief said "either is fine, match the rendering environment" and "do not deliver a multi-file scaffold I have to assemble." The working folder was empty (no Next.js project), and a bare `page.tsx` cannot be previewed or shipped without a project around it. A self-contained HTML file is the only thing that satisfies *runnable + previewable today + no scaffold* at once. A `page.tsx` port is the easy next step if you have a Next app (see below).
2. **Tailwind via the Play CDN.** Keeps the file to a single paste-and-preview artifact. It is fine for staging but **not** for production performance (it ships a JIT compiler as JS). Before launch, compile Tailwind with the provided `tailwind.config.js` + `globals.css` and delete the CDN `<script>`. That is the only change needed to meet the JS / LCP budget and kill any flash-of-unstyled-content.
3. **Placeholder images via Lorem Picsum** (`picsum.photos/seed/...`), not live Unsplash. The old Unsplash Source endpoint the brief implies was retired in 2024 and now 404s, which would have left broken images in your preview. Picsum returns real, deterministic stock photos at exact dimensions (so no layout shift) and is meant to be swapped for shoot files anyway. Seeds are named per section (`arya-kathmandu-skyline`, `arya-work-1`, etc.) so they stay stable.
4. **Content rules enforced over the draft copy.** Section 6 of the brief is marked non-negotiable, so it won out where it clashed with the draft body copy:
   - **No em dashes** anywhere. The draft hero subhead had one ("grow — through SEO"); rewritten with a comma.
   - **No first-person plural in body copy.** The draft subhead opened "We help..."; rewritten to "Arya helps...". Process step 1 "We pull the data first" became "Data first:". The CTA-band sub was reworked to drop "we." First person is left intact only inside testimonial quotes (allowed) and in the client-written section eyebrows/headings you supplied verbatim ("What we do", "How we work", "Don't take our word", "Let's see if we're the right fit") — tell me if you want those neutralized too.
5. **H1 is verbatim and singular.** `Digital Solutions for Digital Nepal`, the only `<h1>` on the page. The second "Digital" is colored saffron (I picked color over underline, as the brief said pick one). "Nepal" and "Kathmandu" both land inside the first 100 words.
6. **Mega-menu silo lists are reasonable guesses.** The brief said "fetch the silo list from the workbook," which I do not have. I used the SEO/SEM/Social/Content/Email examples for Digital Marketing and inferred sensible silos for the other five pillars. **Verify every silo label and URL against the workbook** (the mobile accordion is generated from the same list in the script, so update it in one place: the `pillars` array near the bottom of `index.html`).
7. **Pillar hub URLs** assumed as `/digital-marketing/`, `/production/`, `/branding/`, `/web/`, `/training/`, `/blog/`, plus `/studio-rental/`, `/portfolio/`, `/contact/`, `/case-studies/`, `/about/`, `/careers/`. Confirm these match the workbook's URL map.
8. **Business hours** in the LocalBusiness schema (Sun–Fri, 10:00–18:00) are a placeholder.

---

## Placeholder content that needs real client data

Everything below is flagged with a `[CONFIRM]` comment in the code. **None of it should go live as-is.**

- **Phone number** — `+977-XXXXXXXXX` appears in the header, footer, mobile menu, floating call button, and LocalBusiness schema. Search-replace once you have the real number (and the WhatsApp link `wa.me/977XXXXXXXXX`).
- **Proof Band stats** — `120+` projects, `45+` clients, `8` years, `15` disciplines. Replace with verified numbers.
- **Client logos** — currently styled text wordmarks (hero trust strip + 5×3 grid). Drop in real client SVGs, capped at ~120px wide.
- **Testimonials** — 3 placeholder quotes with invented names. Replace with real, outcome-specific quotes and headshots.
- **Portfolio / case studies** — 6 carousel cards, 1 highlight, and all `/case-studies/...` URLs use invented projects and Picsum covers. Swap for real work, outcomes, and shoot files.
- **Blog posts** — 3 invented titles, categories, and dates. Wire to the real CMS feed (latest 3).
- **Social URLs** — placeholder handles in the footer and the schema `sameAs`. Confirm each profile URL.
- **OG image + favicon set** — referenced but not supplied: `og-image.jpg` (1200×630), `apple-touch-icon.png`, and a full favicon set (16, 32, 180, 512 maskable). The inline SVG favicon is a stand-in.
- **Newsletter form** — captures the email and shows a thanks state, but has no backend. Wire it to your ESP (Mailchimp / Brevo / etc.) before launch.
- **NAP consistency** — the footer address (`Arya Digital Production, Okharbot Marg, New Baneshwor, Kathmandu`) must be byte-identical to the Contact page and the Google Business Profile. It is the geographic ranking anchor.

---

## Acceptance checklist status

| Check | Status |
| --- | --- |
| One `<h1>` only (`document.querySelectorAll('h1').length === 1`) | Pass |
| Every section has a saffron/eyebrow above its H2 | Pass |
| No em dashes in body copy | Pass |
| Header sticks and goes solid ink after 80px scroll | Pass |
| Mobile hamburger opens; 6 pillars expand to silo lists | Pass |
| Reduced-motion users see no animations | Pass (global `prefers-reduced-motion` guard + JS checks) |
| Schema present (Organization + LocalBusiness + WebSite) | Pass — **validate in [Rich Results Test](https://search.google.com/test/rich-results) after you fill the real phone / social URLs** |
| Skip-to-content link + visible focus rings + semantic landmarks | Pass |
| LCP < 2.0s, CLS < 0.05, JS < 180kb | **Needs the compiled-Tailwind production build to verify** (the CDN inflates JS). Hero LCP is the H1 text on a solid bg, so it is structurally fast. |

---

## Next 3 things to build

1. **Contact page (`/contact/`)** — the primary conversion target. Quote form (name, brand, budget band, message), the identical NAP block, an embedded map, and WhatsApp / phone CTAs. Every "Get a Quote" on this page points here.
2. **Digital Marketing pillar hub (`/digital-marketing/`)** — the highest-priority pillar and the destination for the hero's feature card. Houses the SEO / SEM / Social / Content / Email silo pages and owns the supporting keyword cluster.
3. **Production pillar hub (`/production/`)** — video, photography, podcasts, and the Studio Rental booking flow, the second-largest pixel-weight card in the bento.

> Want the `page.tsx` + `next/font` + Framer Motion port for an existing Next.js app, or the compiled-Tailwind production build? Say the word and I'll generate it.
