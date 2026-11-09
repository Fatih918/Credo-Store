# Public catalog database integration

## Runtime source of truth

The public `/paket` and `/paket/[id]` routes read active records from Supabase through `getPublicCatalog()` in `src/features/catalog/data/public-catalog.ts`.

- Active categories are ordered by `sort_order`, then name.
- Only active subcategories are rendered. Public RLS additionally restricts subcategories to active parent categories.
- Subcategories are mapped by `pricing_type` into the existing per-star, fixed-package, and tier-progression domain types.
- Public URLs continue to use the stable subcategory slug, not the database UUID. A migration adds a global unique index because the detail route uses one slug segment across all categories.
- Pricing summaries and WhatsApp message content use the item passed from the database-backed page. New admin-created catalog entries do not need a matching static TypeScript entry.
- No service-role key is used by public catalog reads. The server-side Supabase SSR client uses the publishable key and normal RLS.
- No customer account, order persistence, payment processing, or automatic WhatsApp sending is introduced.

## Required migration\n\nAfter merging, apply the new migration with the project's normal Supabase migration workflow (`supabase db push`). It checks for duplicate subcategory slugs before adding the global unique index. If duplicates exist, resolve them before pushing; the migration intentionally fails instead of creating ambiguous package URLs.\n\n## Failure behavior

If Supabase is not configured or the catalog query fails, the storefront displays an unavailable state. It does not silently fall back to stale static prices. An empty but successful query displays an empty-catalog state.

## Card customization follow-up

The card component still derives artwork from the static `rank-artwork.ts` mapping. The current database schema does not provide editable card artwork or presentation fields. Admin controls for card appearance (for example image/artwork, card badge, and optional card copy) are intentionally deferred to a separate PR and must not be represented as available in this integration.

## Pricing boundary

The browser receives the server-rendered catalog item to calculate the visible estimate and prepare the WhatsApp message. This is a customer-facing estimate, not a persisted or server-authoritative order quote. The store must confirm the final details and price in WhatsApp. Server-side quote/order validation is a separate future capability if the project adds order persistence.
