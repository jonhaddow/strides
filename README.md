# Strides

A running log, as a phone web app.

Log each run (route, distance, time, climb and surface) and it's given a score and a grade, so runs on different routes can be compared. Stats show totals, personal bests and distance by month.

**Score** = (km/h ^ 1.5) / 2 × (1 + climb m / 1500) × surface factor (Road 1, Track 1.02, Trail 1.05, Mixed 1.1, Technical 1.2).
**Grades:** 🏆 A+ ≥ 25, 🥇 A ≥ 22.5, 🥈 B ≥ 19.5, 🥉 C ≥ 16.5, 👟 D ≥ 13.5, 🚶 E below.

## Tech stack

- [SvelteKit](https://svelte.dev) (Svelte 5) and TypeScript, as an installable PWA
- [Cloudflare Workers](https://workers.cloudflare.com), with [D1](https://developers.cloudflare.com/d1/) (SQLite) through [Drizzle ORM](https://orm.drizzle.team)
- Google sign-in ([Arctic](https://arcticjs.dev)) for an allowlist of users
- [Tailwind CSS](https://tailwindcss.com) and [shadcn-svelte](https://shadcn-svelte.com)
- [Vitest](https://vitest.dev) and [Playwright](https://playwright.dev) for tests
- Deployed from `main` by Cloudflare Workers Builds

## Development

See [`docs/development.md`](docs/development.md) for running it locally, configuration and deploying.
