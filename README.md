# Wanda Gordon — Financial Educator · Coach · Speaker

Personal brand site with a full admin dashboard. React + Vite frontend, Express + PostgreSQL API.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 6, React Router 7, Tailwind CSS 3, Framer Motion, Axios, Recharts, React Icons |
| Backend | Node.js, Express 4, `pg` (no ORM) |
| Database | PostgreSQL 14+ (16 recommended) |
| Auth | JWT + bcrypt |

No third-party SaaS required — no Cloudinary, no external analytics.

## Project structure

```
wandaGordo/
├── backend/
│   ├── src/
│   │   ├── config/db.js            # pg Pool, connection test, pool tuning
│   │   ├── controllers/            # auth, testimonial, media, message, visitor, dashboard
│   │   ├── middleware/             # auth (JWT guard), errorHandler
│   │   ├── routes/                 # thin routers (same set as controllers)
│   │   ├── initDb.js               # creates DB + applies schema (idempotent)
│   │   ├── seed.js                 # idempotent demo seeding
│   │   └── server.js               # app bootstrap, process guards, graceful shutdown
│   ├── uploads/                    # static-served at /uploads
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/                     # favicon, robots, sitemap, photos
│   └── src/
│       ├── components/             # 24 shared + section components
│       ├── context/                # AuthContext, ThemeContext
│       ├── data/                   # ALL public content lives here (9 files)
│       ├── layouts/                # PublicLayout, AdminLayout
│       ├── pages/                  # Home, About, Contact, EventDetail, NotFound, admin/*
│       │                           # admin: Dashboard, Messages, Testimonials, Media, Analytics
│       ├── services/api.js         # single axios instance
│       ├── utils/format.js
│       ├── App.jsx
│       └── main.jsx
├── database/schema.sql             # 8 tables, idempotent DDL
├── docker-compose.yml              # postgres:16-alpine
├── CUSTOMIZATION.md
└── README.md
```

## Setup

### 1. Database

```bash
docker compose up -d db
```

Or use a local PostgreSQL install. Credentials live in `backend/.env` (defaults below).

### 2. Backend — http://localhost:5001

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run db:init           # creates portfolio_db + applies database/schema.sql
npm run seed              # admin user + demo content (idempotent)
npm run dev               # node --watch
```

### 3. Frontend — http://localhost:5173

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:5001`.

## Admin access

`http://localhost:5173/admin/login`

Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` **then** run `npm run seed`.
Note: `.env` values only apply when seeding. To change later, re-run `npm run seed` or update the `admins` row.

## Routes

### Public

| Route | Page |
|-------|------|
| `/` | Full scroll landing: hero → about → recognition → expertise → events → speaking → media → testimonials → social → contact |
| `/about` | Biography + recognition (reuses the same sections as Home) |
| `/contact` | Contact section |
| `/events/:slug` | Event detail, resolves from `src/data/events.js` |
| any other | Branded 404 |

### Admin

| Route | Purpose |
|-------|---------|
| `/admin` | Counters (messages, speaking invites, testimonials, media, visitors) |
| `/admin/messages` | Inbox with **All / Messages / Speaking Invites** tabs, search, mark read, delete |
| `/admin/testimonials` | CRUD — feeds the public carousel |
| `/admin/media` | CRUD for the video library (first video featured) |
| `/admin/analytics` | Recharts: 30-day trend, browsers, OS, devices, top pages, recent visits |

## Important: where content lives

The **public site is mostly static and data-driven** — copy, services, events and
social links come from `frontend/src/data/*.js`. Two sections are **admin-managed
via the database** (with static fallbacks if the tables are empty or the API is down):

- **Testimonials** carousel ← `GET /api/testimonials`, managed at `/admin/testimonials`
- **Media** videos ← `GET /api/media`, managed at `/admin/media` (first video featured)

The database also powers:

- the contact + speaking inquiry forms (`POST /api/messages` with `source: contact | speaking`)
- the tabbed admin inbox (`GET /api/messages?source=`)
- visitor analytics (`POST /api/visitors/track`, `GET /api/visitors/stats`)
- the admin dashboard counters (`GET /api/stats`)

There are no projects / skills / certificates screens, tables or endpoints — they were
removed because the Wanda site has no such sections.

See **CUSTOMIZATION.md** for exactly where to change each piece.

## REST API

All responses use `{ success, data?, message? }`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Liveness + database state (503 if DB is down) |
| POST | `/api/auth/login` | No | Returns `{ token, admin }` |
| GET | `/api/auth/me` | Yes | Current admin |
| GET | `/api/testimonials` | No | Ordered by `display_order`; feeds the public carousel |
| GET | `/api/testimonials/:id` | No | Single testimonial |
| POST/PUT/DELETE | `/api/testimonials[/:id]` | Yes | Create / update / delete |
| GET | `/api/media` | No | Video library ordered by `display_order`; first is featured |
| GET | `/api/media/:id` | No | Single video |
| POST/PUT/DELETE | `/api/media[/:id]` | Yes | Create / update / delete (full YouTube URLs accepted, ID extracted) |
| POST | `/api/messages` | No | Contact form or speaking invite (`source: contact \| speaking`) |
| GET | `/api/messages` | Yes | Inbox; `search`, `unread`, `source` |
| PATCH | `/api/messages/:id/read` | Yes | Mark read |
| DELETE | `/api/messages/:id` | Yes | Delete |
| POST | `/api/visitors/track` | No | Track visit (deduped per session + page) |
| GET | `/api/visitors/stats` | Yes | Analytics aggregates |
| GET | `/api/stats` | Yes | Dashboard counters |
| GET | `/api/experiences` | No | Timeline |
| GET | `/api/services` | No | Services |
| GET | `/api/settings` | No | Site settings object |

## Environment variables

### `backend/.env`

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `5001` | 5000 is often taken on Windows — keep 5001 |
| `DB_HOST` / `DB_PORT` | `localhost` / `5432` | |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` | `portfolio_db` / `postgres` / `kali` | |
| `DB_CONNECT_TIMEOUT_MS` | `5000` | Fail fast instead of hanging |
| `DB_STATEMENT_TIMEOUT_MS` | `15000` | |
| `DB_POOL_MAX` | `10` | |
| `JWT_SECRET` | — | **Set a long random value before deploying** |
| `JWT_EXPIRES_IN` | `7d` | |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | — | Applied by `npm run seed` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | `smtp.gmail.com` / `587` / `false` | Email alerts (Gmail example). Blank = channel disabled |
| `SMTP_USER` / `SMTP_PASS` | — | Login: full address + a Google **App Password**, not the account password |
| `SMTP_FROM` | — | Sender shown on alerts |
| `NOTIFY_EMAIL` | — | Inbox receiving alerts (defaults to `SMTP_USER`) |
| `WHATSAPP_PROVIDER` | — | Set `callmebot` to enable WhatsApp alerts |
| `CALLMEBOT_API_KEY` | — | Key from callmebot.com |
| `WHATSAPP_TO` | — | Recipient number, international format, no `+` (e.g. `255675029833`) |

### `frontend/.env` (optional)

| Variable | Notes |
|----------|-------|
| `VITE_API_URL` | Override the API base URL (defaults to `/api` via the Vite proxy) |
| `VITE_API_TIMEOUT_MS` | Request timeout, default 15000 |
| `VITE_WHATSAPP_NUMBER` | Enables the WhatsApp button/floating action |
| `VITE_TIKTOK_URL` / `VITE_INSTAGRAM_URL` / `VITE_FACEBOOK_URL` / `VITE_YOUTUBE_URL` | Social links — empty means the card renders as "coming soon", never a fake link |

## Production

```bash
cd frontend && npm run build     # -> dist/
cd backend  && npm start
```

The SPA needs a host rewrite so unknown paths fall back to `index.html`
(`/about`, `/events/*`, `/admin/*` will 404 otherwise). Point `VITE_API_URL`
at the live API if not using the Vite proxy.

Before going live: set a strong `JWT_SECRET`, change the admin password, and
replace the default `DB_PASSWORD` / `ADMIN_PASSWORD` values.

## Notes on the code

- The API is designed to stay up: `uncaughtException` / `unhandledRejection`
  are logged rather than fatal, and listen errors exit with guidance instead of
  a stack trace.
- Visitor tracking is deduplicated per session + page within a 2-second window
  (transaction-scoped advisory lock), so React StrictMode double-mounts don't
  inflate your analytics.
- Only `create` routes are validated (`express-validator`); `PUT` routes perform
  a full-row merge and are not validated.
- `src/data/*.js` files carry explicit content rules: never invent credentials,
  quotes, dates or URLs. Placeholders degrade gracefully.
