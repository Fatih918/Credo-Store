# Credo Store

Mobile-first storefront for Credo Store's Mobile Legends: Bang Bang rank-boosting services.

## Project status

The MVP storefront, catalog, pricing engine, order form, and WhatsApp Click to Chat handoff are implemented. Current work focuses on automated quality coverage and production readiness.

## Requirements

- Node.js 22+
- npm

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

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
- `docs/storefront-pages.md` — route and storefront behavior

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
- [x] Order form, validation, and live order summary
- [x] WhatsApp Click to Chat message generation
- [x] Home, catalog, and package detail pages
- [x] Unit tests and initial component/HTTP smoke coverage

## MVP exclusions

- No account authentication or database persistence
- No payment gateway or automated WhatsApp sending
- No admin dashboard or order tracking
- No password or verification-code collection
