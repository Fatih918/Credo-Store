# Credo Store

Mobile-first storefront for Credo Store's Mobile Legends: Bang Bang rank-boosting services.

## Project status

The product requirements, pricing rules, architecture, and acceptance criteria are documented in `docs/`. The application foundation is being established before catalog and order-flow implementation.

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
```

Or run all checks sequentially:

```bash
npm run check
```

## Documentation

- `docs/requirements.md` — product scope and user flows
- `docs/architecture.md` — application architecture and technical decisions
- `docs/pricing-rules.md` — catalog, pricing, and promotion rules
- `docs/acceptance-tests.md` — verifiable acceptance criteria

## Store information

- Store name: Credo Store
- Order channel: WhatsApp Click to Chat
- WhatsApp number: `6283165112261`

## Current implementation status

- [x] Product and architecture documentation
- [x] Next.js App Router foundation
- [x] TypeScript strict configuration
- [x] Tailwind CSS v4 integration
- [x] ESLint and Vitest setup
- [x] Initial currency-formatting utility and unit tests
- [x] GitHub Actions quality workflow
- [ ] Service catalog and pricing engine
- [ ] Order form and WhatsApp handoff
