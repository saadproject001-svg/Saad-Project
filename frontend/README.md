# Inventory Insights Pro — Frontend

React 19 + Vite + Tailwind 4. Talks to the FastAPI backend in `../backend` for
all data, and to Supabase Auth directly (via `@supabase/supabase-js`) for
signup/login — this app never sends a password to its own backend.

## Local setup

```bash
cp .env.example .env   # fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL
npm install
npm run dev
```

`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` must point at the same Supabase
project as the backend's `SUPABASE_URL`. `VITE_API_BASE_URL` should point at the
backend's `/api/v1` (e.g. `http://localhost:8000/api/v1` for local dev).

Sign up (creates a real Supabase Auth user + a new organization) or sign in, or
run `python scripts/seed_demo_platform.py` in `../backend` first to get a
populated demo account (seeded owner email + `DemoPass123!`).

## Architecture

- `src/lib/supabaseClient.js` / `src/lib/apiClient.js` — the two outbound
  clients. `apiClient` attaches the live Supabase access token as
  `Authorization: Bearer` and the active organization as `X-Organization-Id` to
  every backend call.
- `src/context/AuthContext.jsx` / `src/hooks/useAuth.js` — session, current
  user, and active-organization state, used throughout the app.
- `src/hooks/useApi.js` — a small hand-rolled data-fetching hook (loading/error/
  refetch) used by every page instead of a heavier state-management dependency.
- `src/pages/SellerboardPage.jsx` — one generic renderer for all 61
  "Sellerboard" routes, driven by `GET /api/v1/sellerboard/pages/{path}` rather
  than a static per-route config file.
- `src/pages/admin/` — the platform super-admin section (`/admin/*`), gated by
  `is_platform_admin` on the signed-in user and only reachable for accounts the
  backend has flagged as such.

## Linting

```bash
npm run lint
```
