# Enactus ENSI Platform

A full-stack platform for Enactus ENSI: a public institutional website (identity, team, projects,
events, partners) and a secure admin CMS to manage that content.

## Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, React Hook Form + Zod, Axios
- **Backend**: Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Flyway, MapStruct
- **Database**: PostgreSQL
- **Infrastructure**: Docker Compose

## Project structure

Pour la configuration d'hébergement gratuit (Vercel, Render et Neon), voir
[DEPLOIEMENT.md](DEPLOIEMENT.md). Le fichier `render.yaml` prépare le backend Render Free.
Le stockage persistant des fichiers reste à intégrer avant une utilisation réelle du CMS.

```
root/
├── frontend/   Next.js app (App Router, public site + admin CMS)
├── backend/    Spring Boot API (controller/service/repository/entity/dto/mapper/security)
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick start (Docker)

1. Copy the environment template and fill in real values:

   ```bash
   cp .env.example .env
   ```

   At minimum set `DB_PASSWORD`, `JWT_SECRET` (a long random string - e.g. `openssl rand -base64 48`),
   `ADMIN_EMAIL` and `ADMIN_PASSWORD` (your initial admin login). Never commit `.env`.

2. Build and start everything:

   ```bash
   docker compose up --build
   ```

3. Open:
   - Public site: http://localhost:3000
   - Backend API: http://localhost:8080
   - Admin CMS: http://localhost:3000/admin/login (sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

The database schema and seed content (site text, values, the 10 real team members, and a few
clearly-flagged `[DEMO]` projects/events/partners for UI verification) are created automatically by
Flyway migrations on first startup. The initial admin account is created from environment variables
on first startup only (idempotent - safe to restart).

## Local development (without Docker)

### Backend

Requires JDK 21 and a running PostgreSQL instance (or `docker compose up postgres`).

```bash
cd backend
# JAVA_HOME must point at a JDK 21 install
mvn spring-boot:run
```

Configuration is entirely environment-variable driven (see `backend/src/main/resources/application.yml`).
For local runs without Docker, export the same variables listed in `.env.example` (`DB_HOST=localhost`, etc.)
before starting.

Run the backend test suite (uses an in-memory H2 database, no external services required):

```bash
mvn test
```

### Frontend

Requires Node 22+.

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`) if the backend runs elsewhere.

```bash
npm run build   # production build
npm run lint    # ESLint
```

## Architecture notes

- **Public API** (`/api/public/**`) is read-only and unauthenticated: content, values, team,
  projects, events, partners.
- **Admin API** (`/api/admin/**`) requires a valid JWT with `ROLE_ADMIN`, issued by
  `POST /api/auth/login`. The frontend stores the token in a browser cookie and attaches it as a
  `Authorization: Bearer` header on admin requests; `proxy.ts` guards `/admin/**` routes client-side,
  while the backend enforces authorization independently via Spring Security.
- **File storage**: uploads go through `POST /api/admin/upload` and are validated (MIME type,
  extension, max size) and stored under UUID filenames. The `StorageService` interface currently has
  a local-disk implementation (`LocalFileStorageService`); a future S3/MinIO/Cloudinary
  implementation can be swapped in without touching callers. Files are served from `/uploads/**`.
- **Slugs** for projects and events are generated server-side from the name and are immutable once
  created, to keep public URLs stable.
- Demo seed content is clearly prefixed `[DEMO]` in its name so it's obvious which records are
  placeholders meant to be replaced or deleted from the admin CMS.

## Branding

The Enactus ENSI graphic charter (colors `#FFC220` / `#132240` / `#515456` / `#B0B3B8`, typography)
is implemented in `frontend/tailwind.config.ts` and `frontend/app/globals.css`. The real Enactus ENSI
logo and heading font files ("Bon Vivant", primary; "Glacial Indifference", secondary) are not
included in this repo (no source files were provided / these fonts aren't freely distributable):

- Replace `frontend/public/images/logo-enactus-ensi.svg` and `logo-enactus-ensi-white.svg` with the
  real logo assets (same filenames, or update the references in `Navbar.tsx` / `Footer.tsx` /
  `AdminSidebar.tsx` / the admin login page).
- Drop real `BonVivant-Regular.woff2` / `-Bold.woff2` (and, optionally,
  `GlacialIndifference-Regular.woff2` / `-Bold.woff2` as a secondary choice) into
  `frontend/public/fonts/` and they'll be picked up automatically everywhere headings are rendered
  (see the `@font-face` rules in `app/globals.css`, and in the placeholder logo SVGs themselves).
  Until then, headings fall back to Poppins, a similarly-shaped geometric sans-serif.
- Replace the placeholder SVGs under `frontend/public/images/{team,projects,events,partners}/` with
  real photography as content is added through the admin CMS.
- The splash intro (`components/public/SplashIntro.tsx`) shows the origami bird from the mark on
  every home page load, built from hand-placed SVG polygons approximating the bird's silhouette
  since no source vector file was provided - swap its `<polygon>` shapes for the real bird artwork
  once you have it.

## Security

- Passwords are hashed with BCrypt; no plaintext credentials are stored or logged.
- JWTs are signed with `JWT_SECRET` (HMAC) - use a long random value in production.
- CORS is restricted to `CORS_ALLOWED_ORIGINS`.
- Upload endpoint validates MIME type, file extension and size before writing to disk.
- `.env` is gitignored; only `.env.example` (placeholder values) is committed.
