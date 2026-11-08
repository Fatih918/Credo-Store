# Credo Store — Testing Strategy

## Automated coverage

### Unit tests
Vitest covers deterministic business logic:
- Catalog pricing and testimonial eligibility.
- Order validation and order-summary calculation.
- WhatsApp message content and URL encoding.
- Rank artwork mappings and currency formatting.

### Component render tests
The OrderForm component is server-rendered with React's renderer in Vitest. These checks verify that:
- Per-star services expose a quantity field.
- Fixed-price packages do not expose a star quantity field.
- The initial subtotal and tier progression bonus are visible.
- WhatsApp handoff is not exposed before validation.
- No password input is rendered.

These are render-level component tests. They do not simulate browser events or assert client-side state transitions.

### Production HTTP smoke tests
Node's built-in test runner requests the production Next.js server and checks:
- Home page response and catalog navigation.
- Catalog category content and representative detail links.
- Package detail rendering and order form presence.
- Unknown package routes return HTTP 404.
- Shared SEO metadata, skip navigation, landmark order, and accessible section relationships.

The HTTP smoke tests do not open a browser and do not submit a real WhatsApp message. WhatsApp message formatting and URL encoding remain covered by unit tests.

## CI execution

The CI workflow runs:
1. ESLint.
2. TypeScript typecheck.
3. Vitest unit and component render tests.
4. Next.js production build.
5. Production HTTP smoke tests against the production Next.js server.

## Remaining manual/browser QA

Before launch, verify in a real browser:
- Form interactions, quantity changes, validation errors, and WhatsApp link activation.
- Mobile and desktop layouts.
- Keyboard navigation, skip navigation, and visible focus.
- WhatsApp destination and prefilled message, without pressing Send.

A browser automation suite (for example Playwright) can be added when browser-level interaction coverage is required. It is intentionally not represented as implemented by the current smoke tests.
