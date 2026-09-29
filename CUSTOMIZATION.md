# Customization Guide

Where to change things, and how to fix common problems without external help.

> **Read this first:** the public site renders from `frontend/src/data/*.js`, **not** from the
> database. Editing content in `/admin` changes the dashboard but not the live pages. See
> [Where content lives](#where-content-lives).

---

## 1. Where content lives

| What | File |
|------|------|
| Name, tagline, hero copy, email, WhatsApp number, SEO | `frontend/src/data/siteConfig.js` |
| Nav links + scroll offset | `frontend/src/data/navLinks.js` |
| Services / expertise cards | `frontend/src/data/expertise.js` |
| Credentials + celebration copy | `frontend/src/data/achievements.js` |
| Events (list + detail pages) | `frontend/src/data/events.js` |
| YouTube / media embed | `frontend/src/data/media.js` |
| Social links | `frontend/src/data/socialLinks.js` |
| Speaking topics + event types | `frontend/src/data/speakingTopics.js` |
| Testimonials | `frontend/src/data/testimonials.js` |

Copy marked `// REVIEW COPY` is still a draft awaiting sign-off — search for it:

```
frontend/src/data/expertise.js
```

### Content rules (please keep them)

These files carry deliberate guardrails. Please respect them:

- **Never invent** credentials, awards, dates, venues, attendee counts, names, roles or quotes.
- Only list **verified** achievements.
- An **empty social URL must render as "coming soon"**, never a link to a fake page.
  `isRealUrl()` in `socialLinks.js` enforces this.
- Use real `PLACEHOLDER_*` markers so the UI can degrade gracefully.

---

## 2. Images

| What | Where |
|------|--------|
| Hero portrait | `frontend/public/wanda-portrait.jpg` (path set in `siteConfig.js` → `portrait.src`) |
| About portrait | `frontend/public/wanda-about.jpg` (used by `AboutSection.jsx`) |
| Event photos | `frontend/public/events/` |
| Favicon | `frontend/public/favicon.svg` |
| CV / resume | `frontend/public/` (not currently linked from the UI — add an `<a>` where you want it) |
| User uploads | `backend/uploads/` is served at `http://localhost:5001/uploads/...` |

**Keep images reasonably sized.** Recommended max width 1400px and JPEG quality ~82.
The About portrait originally shipped at 3120×4160 / 1.1 MB, which is far more than the
layout needs. A quick check:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem -Recurse -Include *.jpg -Path frontend\public |
  ForEach-Object { $i=[System.Drawing.Image]::FromFile($_.FullName);
    "{0}  {1} KB  {2}x{3}" -f $_.Name,[math]::Round($_.Length/1KB,1),$i.Width,$i.Height; $i.Dispose() }
```

`Portrait.jsx` sets `width`/`height` from the `aspect` prop to prevent layout shift, sets
`loading="lazy"` by default, and only loads eagerly when `priority` is set (only the Hero does).

---

## 3. Route → file map

| Route | File |
|-------|------|
| `/` | `pages/Home.jsx` (composes the `components/*Section.jsx` files) |
| `/about` | `pages/About.jsx` (reuses `AboutSection` + `RecognitionSection`) |
| `/contact` | `pages/Contact.jsx` (reuses `ContactSection`) |
| `/events/:slug` | `pages/EventDetail.jsx` |
| 404 | `pages/NotFound.jsx` |
| `/admin` | `pages/admin/AdminDashboard.jsx` (messages, speaking invites, testimonials, media, visitors) |
| `/admin/messages` | `pages/admin/AdminMessages.jsx` (All / Messages / Speaking Invites tabs) |
| `/admin/testimonials` | `pages/admin/AdminTestimonials.jsx` (feeds the public carousel) |
| `/admin/media` | `pages/admin/AdminMedia.jsx` (video library, first video featured) |
| `/admin/analytics` | `pages/admin/AdminAnalytics.jsx` |
| Navbar / Footer | `components/Navbar.jsx`, `components/Footer.jsx` |
| Layout + page motion | `layouts/PublicLayout.jsx`, `components/PageTransition.jsx` |
| Section IDs + scroll spy | `data/navLinks.js` |

### Home section IDs

Used for `/#anchor` links. The `id` must exist on a `<section>` and in `navLinks`:

`about` · `expertise` · `events` · `speaking` · `media` · `contact`

Adding a section to the page means also adding it to `navLinks.js`, otherwise the
Navbar scroll-spy will not pick it up. `ScrollToTop.jsx` handles the `/#id` navigation.

---

## 4. Personal info

- **Brand / name** — `data/siteConfig.js` (`siteConfig.name`) and the wordmark in `components/Footer.jsx`
- **Email / WhatsApp** — `data/siteConfig.js`, or `VITE_WHATSAPP_NUMBER` in `frontend/.env`
- **Socials** — `data/socialLinks.js` (or the `VITE_*_URL` env vars)
- **Admin user** — `backend/.env` → `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then `npm run seed`
- **SEO meta** — `frontend/index.html` (static; also contains JSON-LD for Person + Event)

---

## 5. Design system

`frontend/src/index.css` defines the vocabulary used by every public component.

**Sections:** `section-light` `section-warm` `section-sand` `section-soft` `section-dark` `section-navy` `section-plum-deep`

**Layout/type:** `container-editorial` `container-page` `section-pad` `heading-display` `headline-editorial` `eyebrow` `body-editorial`

**Surfaces:** `card-surface` `card-lift` `hairline` `gold-rule` `gold-rule-left` `ghost-numeral` `grain` `glass` `input-field`

**Buttons:** `btn-primary` `btn-secondary`

Tailwind tokens in `tailwind.config.js`:

- Editorial: `sage` (+ `soft`), `plum` (+ `light` / `deep` / `deeper`), `charcoal`, `ivory`, `sand`, `peach`
- Fonts: `font-serif` (Playfair Display), `font-sans` (Manrope), `font-mono` (JetBrains Mono)

### Accessibility conventions (keep these)

- Minimum **44–48px** tap targets (`min-h-[48px] min-w-[48px]`)
- `aria-label` / `aria-modal` / `aria-expanded` / `aria-current`, `role="status"` for async results
- Escape closes modals, focus is trapped inside them, body scroll is locked
- `prefers-reduced-motion` branches — check them when adding motion
- **Sage is a fill/line colour only — never body text on ivory.** Use charcoal on sage, ivory on plum/charcoal.

### Theming

Dark mode (`darkMode: 'class'`, toggled by `ThemeContext`) is used **only by the admin panel**.
The public site is intentionally fixed-editorial with no toggle. `brand-*` and `ink-*`
Tailwind scales are legacy and belong to the admin components — don't use them in public sections.

---

## 6. Animations

- Shared reveal system: `components/SectionReveal.jsx` (`Reveal`, `Stagger`, `StaggerItem`)
- Easing constant: `const EASE = [0.22, 1, 0.36, 1]`
- Scroll progress: `components/ScrollProgressBar.jsx`
- Back to top: `components/ScrollTopButton.jsx`
- Keep motion subtle and consistent with the existing palette.

---

## 7. Common fixes (no AI needed)

### `EADDRINUSE` — port already in use

```bash
netstat -ano | findstr :5001
taskkill /PID <pid> /F
```

Or change the port in **both** places:
1. `backend/.env` → `PORT=5002`
2. `frontend/vite.config.js` → `server.proxy['/api'].target`

Keep 5001 rather than 5000 — Windows/AirPlay frequently grabs 5000.

### Vite proxy errors: `read ECONNRESET` / `ECONNREFUSED`

The backend is not answering. The API now stays up instead of dying, so this means it is
genuinely stopped or never started.

1. `curl http://localhost:5001/api/health`
   - returns JSON → backend is fine, restart Vite
   - `ECONNREFUSED` → the API is not running
2. Start it: `cd backend && npm run dev`
3. If startup prints `PostgreSQL not reachable`, start the database:
   `docker compose up -d db`
4. If the port is occupied, see `EADDRINUSE` above.

### Frontend loads blank

1. Confirm the backend is up and `/api/health` returns JSON.
2. DevTools → Network: look for failed `/api/...` requests.
3. Hard-refresh. Do **not** open the built `index.html` as a `file://` URL.
4. A React error is caught by `components/ErrorBoundary.jsx` — in dev it prints the message.

### Admin login fails

`.env` admin values are only applied when seeding. Re-run `npm run seed`, or update the
`admins` row directly in PostgreSQL.

### Admin logged out unexpectedly

Only a real `401` clears the token now. A dropped connection keeps you signed in — reconnect
and refresh.

### Form alerts (email + WhatsApp) not arriving

1. Check the backend console for `[notify]` lines — every attempt is logged there.
2. **Email `535 BadCredentials`** — the `SMTP_PASS` must be a Google **App Password**
   (Google Account → Security → 2-Step Verification → App passwords), not the normal
   account password. Paste it into `backend/.env` exactly as shown (spaces included).
3. **WhatsApp silent** — the recipient phone (`WHATSAPP_TO`) must first send
   `I allow callmebot to send me messages` to the CallMeBot bot number (one-time opt-in).
   Wrong/missing `CALLMEBOT_API_KEY` also fails silently — check the log line.
4. Either channel missing from `.env` = that channel is skipped (forms still save).

### Database connection errors

1. Confirm PostgreSQL is running (`docker compose up -d db`).
2. Check `DB_PASSWORD` / `DB_USER` / `DB_NAME` in `backend/.env`.
3. `cd backend && npm run db:init && npm run seed`

### 404 on `/about` or `/admin/*` after building

The production host needs a SPA rewrite so unknown paths serve `index.html`.

---

## 8. Before deploying

- [ ] Set a long random `JWT_SECRET` in `backend/.env`
- [ ] Change `ADMIN_PASSWORD` (and re-seed)
- [ ] Change the default `DB_PASSWORD`
- [ ] Set `VITE_API_URL` to the live API (if not proxying)
- [ ] Add real social URLs (or leave empty for "coming soon")
- [ ] Replace `// REVIEW COPY` draft text with approved copy
- [ ] Verify no `PLACEHOLDER_` strings remain visible in the UI
- [ ] Configure the SPA fallback rewrite
