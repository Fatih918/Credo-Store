# Credo Store — Acceptance Criteria

## Landing page
- [ ] Homepage identifies Credo Store and its MLBB service.
- [ ] Grand-opening promotion is visible without obscuring prices.
- [ ] Customer can reach the catalog and order flow.
- [ ] No fabricated testimonials, ratings, order counts, or guarantees.

## Catalog
- [ ] Three categories exist: per-star, fixed packages, tier progression.
- [ ] All supplied services and prices match the approved price list.
- [ ] Original prices appear only where supplied.
- [ ] Per-star services have no five-star minimum.
- [ ] Fixed packages use their exact fixed price.
- [ ] Epic V → Mythic is marked Best Seller.
- [ ] Tier progression displays +1 bonus star.
- [ ] Placement Mythic states 10 matches / all matches included.

## Pricing
- [ ] Per-star total equals configured promo rate × positive integer quantity.
- [ ] Zero, negative, fractional, missing, and non-numeric quantities are rejected.
- [ ] Fixed-package prices are not multiplied by a quantity.
- [ ] Currency uses Indonesian locale.
- [ ] Testimonial reward is not deducted from initial checkout.
- [ ] Rp20.000 is ineligible; Rp20.001 is eligible only after completion and proof.
- [ ] Cross-tier orders are not silently split without an approved rule.

## Order form
- [ ] Customer can review the selected service before handoff.
- [ ] Summary updates when service or quantity changes.
- [ ] Optional fields can be blank.
- [ ] No account-password field exists.
- [ ] Free text is validated and length-limited.
- [ ] Invalid data blocks WhatsApp handoff and shows a useful error.
- [ ] Customer can edit the order before handoff.

## WhatsApp
- [ ] Destination number is exactly 6283165112261.
- [ ] URL uses https://wa.me/ format.
- [ ] Message includes service, quantity when applicable, total, and supplied customer details.
- [ ] Customer-entered text is URL encoded.
- [ ] Empty optional fields are omitted cleanly.
- [ ] WhatsApp opens only after explicit customer action.
- [ ] UI says customer must press Send in WhatsApp.
- [ ] No message is sent in the background.

## Accessibility
- [ ] Document language is Indonesian.
- [ ] Every route exposes one main landmark with a stable skip-navigation target.
- [ ] A keyboard user can reach the skip link and see visible focus indicators.
- [ ] Navigation has an accessible label.
- [ ] Catalog groups and package detail sections have programmatic headings.
- [ ] Form controls have associated labels and errors remain readable.
- [ ] Informative images have meaningful alternative text; decorative images use empty alt text.
- [ ] Text and controls have sufficient contrast.
- [ ] Reduced-motion preferences are respected.

## SEO and sharing
- [ ] Each route has a meaningful title and description.
- [ ] Shared metadata includes Open Graph and Twitter card basics.
- [ ] The store icon is exposed through metadata.
- [ ] Public pages are indexable; invalid package pages are not indexable.
- [ ] Canonical URLs, sitemap, and absolute social preview images are configured only after the production domain is known.

## Responsive
- [ ] Primary flow works on narrow mobile screens without horizontal overflow.
- [ ] Desktop layout remains readable.

## Automated quality gates
- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Unit tests cover pricing, testimonial eligibility, currency, and WhatsApp URL generation.
- [ ] Order form render tests cover per-star, fixed-package, and tier-progression initial states.
- [ ] Production HTTP smoke tests cover Home, catalog, package detail, metadata, accessibility landmarks, and unknown-package 404.
- [ ] Production build succeeds.
- [ ] Tests never send a real WhatsApp message.

## Manual/browser acceptance still required
- [ ] Interactions update quantity and subtotal correctly in a browser.
- [ ] Invalid form data blocks WhatsApp handoff.
- [ ] Validated form opens the correct prefilled WhatsApp URL.
- [ ] Mobile and desktop layouts are checked in a real browser.
- [ ] Keyboard navigation, focus visibility, and contrast are reviewed with keyboard and accessibility tooling.

## MVP boundaries
- [ ] No database/order persistence.
- [ ] No authentication.
- [ ] No payment gateway.
- [ ] No admin dashboard.
