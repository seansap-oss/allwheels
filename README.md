# MOTORA — India's multi-category vehicle marketplace

Clean build from scratch (Next.js App Router + TypeScript + Tailwind + Drizzle/Postgres).
One backend · one database · one account · web + PWA today, Android/iOS ready architecturally.

## Quick start

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # http://localhost:3000
```

Works immediately **without** a database (seed catalogue + in-memory service layer).
Connect Postgres to go production:

```bash
npm run db:migrate
npm run db:seed
```

## Architecture

- `src/lib/types.ts` — shared cross-client contracts (User, Vehicle, Listing, Dealer, Message, Payment, Notification, …)
- `src/lib/store.ts` — service layer used by pages AND `/api/v1` (swap to Postgres without changing callers)
- `src/lib/schema.ts` + `drizzle/0001_init.sql` — canonical Postgres schema + indexes
- `src/lib/auth.ts` — JWT sessions (httpOnly cookie), bcrypt, RBAC roles
- `src/lib/validation.ts` — zod schemas shared by UI + API
- `src/lib/payments.ts` — gateway abstraction (Razorpay today; store billing later)
- `src/app/api/v1/*` — versioned API for web, PWA and future native apps
- `middleware.ts` — wildcard dealer subdomains (`abc.motora.com` → `/dealer/abc`)

## Key routes

`/`, `/search`, `/vehicle/[slug]`, `/sell`, `/saved`, `/compare`, `/messages`,
`/login`, `/signup`, `/profile`, `/dealers`, `/dealer/[slug]`, `/dealer/dashboard`,
`/research`, `/news`, `/pricing`, `/dealer-enquiry`, `/checkout`, `/admin/*`

## PWA

`public/manifest.webmanifest`, `public/sw.js` (production-safe caching — never auth/messages/payments),
`public/offline.html`, install prompt + update + offline handling in `PwaRegister`.

## Demo accounts

- admin@motora.com / Admin@123 (SUPER_ADMIN)
- seller@motora.com / Seller@123
- dealer@motora.com / Dealer@123

## Deploy (GitHub → Vercel → Supabase)

1. Push to GitHub. 2. Import in Vercel; set env vars from `.env.example`.
3. Add wildcard domain `*.motora.com` for dealer microsites.
4. Run `npm run db:migrate && npm run db:seed` against Supabase.
5. Configure Razorpay keys + webhook (`/api/v1/payments/webhook`).
