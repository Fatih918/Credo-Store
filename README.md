# Credo Store

Mobile-first storefront for Credo Store's Mobile Legends: Bang Bang rank-boosting services.

## Project status

The storefront, catalog, pricing engine, order form, and WhatsApp Click to Chat handoff are implemented. Supabase catalog schema/seed/RLS, SSR clients, session refresh, admin login, and server-side role authorization are now in place. Admin account management, catalog CRUD, audit-log UI, and database-backed public catalog reads remain future implementation steps.

## Requirements

- Node.js 22+
- npm

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To configure Supabase, copy `env.local.example` to `.env.local` and fill in the public project URL and publishable key. See `docs/supabase-setup.md` and `docs/admin-authentication.md`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

The HTTP smoke tests expect a production server to be running at http://127.0.0.1:3000. Run `npm run build` and `npm run start` in one terminal, then run `npm run test:e2e` in another.

Or run the static quality gates and production build sequentially:

```bash
npm run check
```

## Documentation

- `docs/requirements.md` — product scope and user flows
- `docs/architecture.md` — application architecture and technical decisions
- `docs/pricing-rules.md` — catalog, pricing, and promotion rules
- `docs/acceptance-tests.md` — verifiable acceptance criteria
- `docs/testing-strategy.md` — automated coverage and remaining manual QA
- `docs/accessibility-seo.md` — accessibility and SEO implementation, plus domain-dependent follow-up
- `docs/storefront-pages.md` — route and storefront behavior
- `docs/admin-dashboard-design.md` — admin dashboard and RBAC architecture
- `docs/supabase-setup.md` — database migration, environment, and SSR setup
- `docs/admin-authentication.md` — admin login, RBAC, and first-owner bootstrap

## Store information

- Store name: Credo Store
- Order channel: WhatsApp Click to Chat
- WhatsApp number: `6283165112261`

## Implemented scope

- [x] Product and architecture documentation
- [x] Next.js App Router foundation
- [x] TypeScript strict configuration and Tailwind CSS v4
- [x] ESLint, Vitest, and GitHub Actions CI
- [x] Catalog data, rank artwork, and pricing engine
- [x] Order form, validation, and WhatsApp Click to Chat
- [x] Supabase catalog schema, seed data, RLS policies, and RBAC database primitives
- [x] Supabase browser/server clients and Next.js 16 session-refresh Proxy
- [x] Admin email/password login and logout
- [x] Server-side admin session and permission guards
- [x] Last-active-owner database protection
- [x] Home, catalog, and package detail pages
- [x] Unit tests and initial component/HTTP smoke coverage

## Not implemented yet

- Owner-only admin invitation and role management UI
- Admin category/subcategory CRUD
- Admin audit-log UI
- Database-backed public catalog reads
- Payment gateway, automated WhatsApp sending, and order tracking
- Password or verification-code collection
