# Development

## Running locally

```sh
npm install
npm run db:migrate:local
npx wrangler d1 execute strides --local --command "INSERT INTO user (email, name) VALUES ('you@example.com', 'You')"
cp .dev.vars.example .dev.vars
npm run dev    # the login page has dev-only "Sign in as" buttons
```

Tests: `npm test` (unit), `npm run test:e2e` (Playwright), `npm run check` (types), `npm run lint`.

https://strides.app.haddow.me (deploys from `main` with Cloudflare Workers Builds).

## Installing on a phone

Open the app in Safari (iPhone) or Chrome (Android), sign in, then Share → Add to Home Screen.

## Sign-in

Google OAuth. Only emails in the `user` table can sign in.

## Configuration

Vars in `wrangler.jsonc`: `GOOGLE_CLIENT_ID`. Secret (`wrangler secret put`): `GOOGLE_CLIENT_SECRET`.

## Deploying

Pushing to `main` deploys through Cloudflare Workers Builds, whose deploy command `npm run deploy:ci` applies D1 migrations first.
