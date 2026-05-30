<div align="center">

# PreLLI — Precious Little Lives Initiative

Premium website **+ admin-managed backend** for a Nigerian non-profit supporting orphans, widows, and the elderly.

[![Live](https://img.shields.io/badge/live-prelli.web.app-7BBA3C)](https://prelli.web.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Spark-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

`#non-profit` `#nextjs` `#firebase` `#static-export` `#cms` `#mobile-first`

</div>

---

## ✨ Overview

A fast, mobile-first, statically-exported site with a full **content-management backend** — runs entirely on the **Firebase free (Spark) plan** (no Cloud Functions; client-direct writes secured by Security Rules + App Check).

| | |
|---|---|
| **Live** | https://prelli.web.app |
| **Firebase project** | `prelli` |
| **Contact email** | prellicares@gmail.com |
| **Plan** | [`../planning/IMPLEMENTATION_PLAN.md`](../planning/IMPLEMENTATION_PLAN.md) |
| **Go-live steps** | [`DEPLOYMENT.md`](./DEPLOYMENT.md) |

## 🧱 Stack

**Next.js 15** (App Router, `output: export`) · **TypeScript** · **Tailwind CSS** · **Framer Motion** + **Lenis** · **Firebase** (Firestore · Auth · Storage · App Check) · **EmailJS** (optional alerts)

## 🌍 Public site

Home · About · Our Work · Impact · Stories *(11 migrated)* · Gallery · Events · Volunteer · Partner · Donate *(pledge-based)* · Contact

Custom animations throughout — parallax hero, scroll reveals, animated impact counters, odometer event countdown, image-zoom cards, smooth scroll — all respecting `prefers-reduced-motion`.

## 🔐 Admin backend — `/admin`

Auth-gated, role-based (`superadmin` / `admin` / `editor`), fully responsive.

| Module | Capability |
|---|---|
| **Dashboard** | Live stats + quick actions |
| **Posts** | CRUD, draft/publish, cover image |
| **Events** | CRUD, 3–5 image sets, animated-countdown toggle |
| **Inventory** | Items + stock in/out, category/location/photo, event-linked distribution |
| **Submissions** | Contact · Volunteer · Partner · Pledges — manage + CSV export |
| **Subscribers** | Newsletter list, search, CSV export |
| **Users** | Create staff (email + temp password), roles, first-login reset |
| **Gallery · Team · Sponsors · Settings** | Site content management |

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # public prelli web config
npm run dev                  # http://localhost:3000
npm run build                # static export → ./out
```

## 📦 Deploy

Push to `main` → **GitHub Actions** builds and deploys to Firebase Hosting (PRs get preview channels).
Manual: `firebase deploy --only hosting,firestore:rules,storage --project prelli`. See [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## 🗂️ Structure

```
src/
  app/(site)/     Public pages + route group layout
  app/admin/      CMS dashboard (auth-gated)
  components/     ui · motion · site · admin
  content/        Canonical site copy + 11 seed stories
  lib/            firebase · auth · db · media · submissions · csv
public/brand/     Official PreLLI logos
```
