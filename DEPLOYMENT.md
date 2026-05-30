# PreLLI — Deployment & Go-Live

Project: **`prelli`** (Firebase, free Spark plan) · Repo: **thalamuxtech/prelli** · Domain: **prellicares.org**

## One-time Firebase setup (in the `scholarlyechos@gmail.com` console)

1. **Authentication** → Sign-in method → enable **Email/Password**. ✅ (done)
2. **Firestore Database** → create in production mode. ✅ (done)
3. **Storage** → (optional) confirm the free bucket for image uploads. If unavailable on the free plan, the MediaPicker can be pointed at an external host later (see plan §3.1).

## CLI auth for manual deploys

The Firebase CLI must be logged in as the **owner of `prelli`** (`scholarlyechos@gmail.com`):

```powershell
firebase login            # or: firebase login:add  (then login:use scholarlyechos@gmail.com)
firebase projects:list    # should list "prelli"
```

> Note: the Admin SDK service-account key (`prelli-firebase-adminsdk-…json`) can read/write
> Firestore data but is NOT authorized for CLI deploys unless granted
> `roles/serviceusage.serviceUsageConsumer` + `roles/firebasehosting.admin` in GCP IAM.

## Deploy

```powershell
cd app
npm ci
npm run build                         # static export -> ./out
firebase deploy --only hosting,firestore:rules,storage --project prelli
```

Or push to `main` — GitHub Actions deploys automatically (needs `FIREBASE_SERVICE_ACCOUNT`
secret with deploy permissions + the `NEXT_PUBLIC_FB_*` repo variables, both already set).

## First superadmin

1. Firebase console → Authentication → **Add user** (email + password).
2. Copy that user's **UID**.
3. Firestore → create collection `users`, document ID = **the UID**, fields:
   - `email` (string) — the same email
   - `role` (string) — `superadmin`
   - `displayName` (string) — your name
   - `mustChangePassword` (boolean) — `false`
4. Visit `/admin`, sign in. You can now create other staff from **Users**.

## Optional integrations (GitHub repo variables / `.env`)

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — turns on App Check spam protection for public forms.
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` — email alerts on new submissions.

Both are no-ops until set; the site and admin work without them.

## Custom domain

Firebase console → Hosting → **Add custom domain** → `prellicares.org`, then update DNS as instructed.
