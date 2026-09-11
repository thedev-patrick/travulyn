# Travulyn

A travel agency website and admin CMS. Travellers can check visa/document requirements and
price estimates between countries, read the blog, and see testimonials. Once onboarded by staff,
each customer gets a private link to track their document checklist and application progress.
Staff manage everything — pricing, document requirements, blog posts, testimonials, and
customers — from the admin CMS at `/admin`.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack), Tailwind CSS v4, shadcn/ui (Base UI)
- **Prisma 7** + PostgreSQL, via the `@prisma/adapter-pg` driver adapter
- **Auth.js (NextAuth) v5** — email/password admin login (JWT session)
- **Cloudinary** — document and blog cover image uploads
- **SendGrid** — transactional email (customer portal links, progress updates)

Customers never create an account: each application (trip) generates a random token embedded in a
private `/portal/[token]` link, emailed to them. A returning customer travelling a new route gets
a second application — and a second portal link — under the same customer profile. Admins sign in
with email + password.

## Local development

Install dependencies:

```bash
npm install
```

Start a local Postgres instance (no Docker required — Prisma runs one for you):

```bash
npx prisma dev --name travulyn --detach
```

Copy `.env.example` to `.env` and fill in `DATABASE_URL` with the connection string printed by
`prisma dev` (also viewable via `npx prisma dev ls`). Cloudinary and SendGrid can be left blank
locally — uploads will fail without Cloudinary credentials, and emails are logged to the console
instead of being sent when `SENDGRID_API_KEY` is unset.

Run migrations and seed sample data (an admin user, countries, a few corridors with pricing and
document requirements, a blog post, and testimonials):

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed prints the admin login (defaults to `admin@travulyn.com` / `ChangeMe123!`, overridable
via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

Start the app:

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin CMS: http://localhost:3000/admin/login

## Data model

See `prisma/schema.prisma`. Key models: `Country`, `Corridor` (an origin→destination country pair
with price estimate + processing time), `RequiredDocument` (master document types) joined to
corridors via `CorridorDocument` (mandatory vs optional). `Customer` is a person (name, email,
phone) who can have several `Application`s — one per trip — each with its own origin/destination,
status lifecycle, token-based portal link, `ApplicationDocument` checklist snapshot (with
approve/reject review), and `ProgressEvent` timeline. A returning customer travelling a new route
gets a new `Application` under their existing `Customer` record rather than a duplicate person.
Rounding out the schema: `BlogPost`, `Testimonial`, and `Inquiry` (contact form submissions).

## Deployment (Render)

`render.yaml` defines a web service plus a managed Postgres database. From the Render dashboard,
create a new Blueprint pointed at this repo — it provisions both automatically. After the first
deploy, set the remaining environment variables in the Render dashboard (Cloudinary, SendGrid,
`NEXT_PUBLIC_APP_URL` to your Render URL, and `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` if you
want to run the seed once via the Render shell: `npx prisma db seed`).

The build command runs `prisma migrate deploy` automatically on every deploy, so schema changes
committed to `prisma/migrations/` apply on push.

## Notable implementation details

- **Next.js 16**: this project uses the current App Router conventions — `proxy.ts` (not
  `middleware.ts`) guards `/admin/*`, and all dynamic `params`/`searchParams` are asynchronous.
- **Prisma 7**: the client is generated to `lib/generated/prisma` (not `node_modules`) and
  instantiated with the `@prisma/adapter-pg` driver adapter in `lib/prisma.ts`.
- Admin CRUD uses Next.js Server Actions with native `<form>` submissions (progressive
  enhancement, no client form library) validated with Zod.
