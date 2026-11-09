# Admin catalog management

## Category management
The protected `/admin/categories` route manages category names, slugs, descriptions, active state, and display order.

## Subcategory and pricing management
The protected `/admin/subcategories` route manages the records in `public.subcategories`. Mutations require `catalog:write`; reading requires `catalog:read`. The authenticated Supabase SSR client is used so RLS and database audit triggers remain in force. Removal is implemented as soft deactivation.

Pricing field mapping:
- `per_star`: `promo_price` is the rupiah price per star; `original_price` is optional comparison pricing; `unit_label` is fixed to `star`; optional `band_min` and `band_max` describe the supplied band.
- `fixed`: `promo_price` is the whole package price; `included_quantity` is optional; per-star and rank progression fields are cleared.
- `tier_progression`: `promo_price` is the whole progression price; `source_rank`, `target_rank`, and `bonus_quantity` are stored; fixed-package and band fields are cleared.

All monetary values are non-negative safe integers in IDR. The database remains the final constraint authority. The public `/paket` catalog reads these records from Supabase; changes to presentation fields are reflected in public cards after the cache/path is revalidated.

## Card presentation fields
- `card_image_url` stores a same-site path under `/img/`; external URLs and path traversal are rejected.
- `card_badge` is optional, limited to 40 characters, and overrides the legacy Best Seller badge text when set.
- `card_description` is optional, limited to 240 characters, and overrides the generated short card copy. The existing `description` remains the longer package-detail description.
- The admin UI edits references to files already committed under `public/img`; image upload and Supabase Storage are not part of this change.

## Business-rule safeguards
- The original seeded values remain unchanged until an administrator edits them.
- No automatic cross-band price splitting is implemented.
- Existing 25/50-star boundary interpretation is not changed by this UI.
- Testimonial reward remains manually applied and is not deducted from checkout.
- Editing a catalog price does not imply the storefront is already reading the database.
