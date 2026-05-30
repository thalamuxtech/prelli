# PreLLI Cares — Website

Premium website + admin-managed backend for **Precious Little Lives Initiative (PreLLI)**, a Nigerian non-profit supporting orphans, widows, and the elderly.

- **Stack:** Next.js 15 (App Router, static export) · TypeScript · Tailwind CSS · Framer Motion · Firebase (Firestore, Auth, Storage)
- **Hosting:** Firebase Hosting — project `prelli` (free Spark plan, no Cloud Functions)
- **Plan:** see [`../planning/IMPLEMENTATION_PLAN.md`](../planning/IMPLEMENTATION_PLAN.md)

## Local development

```bash
npm install
cp .env.example .env.local   # already contains the public prelli web config
npm run dev                  # http://localhost:3000
```

## Build (static export)

```bash
npm run build                # outputs static site to ./out
```

## Deploy

Pushing to `main` auto-deploys via GitHub Actions → Firebase Hosting.
Pull requests get a temporary preview channel.

> **Deploy prerequisites:** the `prelli` Firebase project is owned by `scholarlyechos@gmail.com`.
> Add a CI service-account JSON as the GitHub secret `FIREBASE_SERVICE_ACCOUNT`, and the
> `NEXT_PUBLIC_FB_*` values as GitHub Actions **repository variables**.

## Structure

```
src/
  app/            Next.js routes (public site + /admin CMS)
  components/     ui / motion / site / admin components
  content/        canonical site copy (seed/fallback)
  lib/            firebase init, utils
public/brand/     official PreLLI logos
```
