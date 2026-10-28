# Strides

A running log as a phone web app. Each run is scored and graded, as in the old "Running Tracksheet" sheet.

- Log a run: route, date, km, time, elevation gain, surface. Known routes fill themselves in.
- Runs by month with totals; tap one to edit or delete it.
- Stats: totals, personal bests, grades, km and climb by month.

**Score** = (km/h ^ 1.5) / 2 × (1 + climb m / 1500) × surface factor (Road 1, Track 1.02, Trail 1.05, Mixed 1.1, Technical 1.2).
**Grades:** 🏆 A+ ≥ 25, 🥇 A ≥ 22.5, 🥈 B ≥ 19.5, 🥉 C ≥ 16.5, 👟 D ≥ 13.5, 🚶 E below.

Stack: SvelteKit (Svelte 5) on Cloudflare Workers, Drizzle ORM on Cloudflare D1, Vitest and Playwright.

## Running locally

```sh
npm install
npm run db:migrate:local
npx wrangler d1 execute strides --local --command "INSERT INTO user (email, name) VALUES ('you@example.com', 'You')"
cp .dev.vars.example .dev.vars
npm run dev    # the login page has dev-only "Sign in as" buttons
```

Tests: `npm test` (unit), `npm run test:e2e` (Playwright), `npm run check` (types), `npm run lint`.

## Live

https://strides.app.haddow.me (deploys from `main` with Cloudflare Workers Builds).

## Installing on a phone

Open the app in Safari (iPhone) or Chrome (Android), sign in, then Share → Add to Home Screen.

## Sign-in

Google OAuth. Only emails in the `user` table can sign in.

## Configuration

Vars in `wrangler.jsonc`: `GOOGLE_CLIENT_ID`. Secret (`wrangler secret put`): `GOOGLE_CLIENT_SECRET`.
