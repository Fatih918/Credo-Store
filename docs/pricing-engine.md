# Credo Store — Catalog & Pricing Engine

## Source of truth
Public storefront catalog names, identifiers, promotional prices, original prices, supplied rank bands, package descriptions, featured status, and progression bonuses are read from the active Supabase `categories` and `subcategories` records through `src/features/catalog/data/public-catalog.ts`.

`src/features/catalog/data/catalog.ts` remains a static fixture/reference for pure pricing tests and existing seed verification; it is no longer the production storefront source of truth. UI components must consume the catalog item supplied by the server repository rather than duplicate price literals.

## Pricing API
Pure functions in `src/features/pricing/pricing.ts` provide:
- `calculatePerStarPrice(serviceId, quantity)`
- `calculateFixedPackagePrice(packageId)`
- `calculateTierProgressionPrice(progressionId)`
- `isTestimonialRewardEligible(subtotal)`

Invalid identifiers and invalid numeric inputs throw `RangeError`. Callers should catch validation errors at the order-flow boundary and present a user-readable message.

## Explicit business constraints
- Per-star quantity must be a positive safe integer; no minimum of five stars.
- Fixed packages are charged at their configured price exactly once per selection. Multiplicity/cart behavior is not implemented.
- Tier progression packages return their configured +1 bonus star; this does not alter the subtotal.
- Testimonial eligibility is strictly greater than Rp20.000. The Rp5.000 reward is informational and is never subtracted from the initial checkout subtotal.
- Per-star service selection applies only that service's configured rate. The engine does not split cross-tier quantities into multiple rates or infer tier transitions.
- The supplied 25/50-star boundary labels are preserved as catalog metadata; the engine does not decide how a boundary-crossing order is allocated.

## Non-goals
This module does not handle UI state, order persistence, payment collection, DP splitting, testimonial payout, or WhatsApp message generation.
