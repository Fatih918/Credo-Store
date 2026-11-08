# Credo Store — Architecture

## 1. Decision
Use a frontend-first modular monolith for MVP. The application calculates orders locally and hands the details to WhatsApp Click to Chat. No database, authentication, payment backend, or order API is justified by the current scope.

## 2. Proposed stack
- Next.js App Router
- React + TypeScript (strict)
- Tailwind CSS
- Zod for runtime validation
- React Hook Form for the order form
- Lucide icons
- Vitest + Testing Library
- Playwright for end-to-end tests
- Vercel deployment

Select currently supported stable dependency versions when implementation begins and commit the lockfile. The repository is currently empty; no existing stack is assumed.

## 3. Proposed structure
src/
  app/                 # routes, layouts, global styles
  components/
    layout/            # header, footer, navigation
    ui/                # shared primitives
  features/
    catalog/           # catalog data, types, components
    order/             # form, validation, summary
    promotion/         # promotion data and display
    whatsapp/          # message builder and URL generator
  config/              # store identity and WhatsApp destination
  lib/                 # currency and shared utilities
  types/

tests/
  unit/
  e2e/

docs/

The exact layout may evolve, but feature boundaries must remain clear.

## 4. Responsibilities
- Catalog: typed service definitions and category data. No prices duplicated in UI components.
- Pricing: pure functions for per-star totals and fixed package totals. Keep post-service rewards outside initial checkout calculations.
- Order: order model, local form state, validation, and summary. No persistence in MVP.
- Promotion: promotion copy and eligibility rules. Do not automatically deduct testimonial reward.
- WhatsApp: build a message from a validated order and URL-encode it for Click to Chat. No background sending.
- Store config: store name, locale, currency, and WhatsApp number in one place.

## 5. Rendering and state
- Prefer Server Components for static pages and catalog presentation.
- Use Client Components only for interactive selection, form state, and dynamic totals.
- Keep state local to the order flow; no global state library is needed.
- No server actions or API routes are required for MVP.

## 6. Data flow
Catalog config → customer selection → order form and validation → pure pricing function → order summary → WhatsApp message builder → wa.me URL → customer manually reviews and sends.

## 7. Security and privacy
- Do not collect account passwords.
- Do not persist order form contents in the MVP.
- Do not expose secrets in client code.
- Validate and length-limit free text before generating the message.
- Open WhatsApp only after explicit customer action.
- Do not promise absolute account security or guaranteed game outcomes.

## 8. Testing
- Unit tests: pricing, reward eligibility, currency formatting, message generation.
- Component tests: category selection, order form validation, summary updates.
- E2E: homepage/catalog to correctly encoded WhatsApp URL.
- Responsive tests at mobile and desktop widths.
- Tests must never send a real WhatsApp message.

## 9. Deployment
Initial target is Vercel. The MVP requires no application secrets for local calculations and WhatsApp URL generation. CI should run lint, typecheck, unit tests, and production build. Custom domain and analytics are later decisions.

## 10. Evolution
Add a database when order history or tracking is needed; an admin/CMS when catalog changes need non-technical operators; payment integration when automated reconciliation is needed; WhatsApp Business Platform when automated outbound messaging or webhooks are needed. These are not MVP requirements.